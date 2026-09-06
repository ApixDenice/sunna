import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { saveSlotText, resetSlotText } from "@/lib/texts";
import { fieldExists, fallbackFor, textFieldsFor } from "@/lib/slot-texts";
import { slotById } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Nach einer Textänderung alle Seiten neu erzeugen, damit sie sofort greift. */
function refreshSite() {
  revalidatePath("/", "layout");
}

function limitFor(slotId: string, fieldId: string) {
  const slot = slotById.get(slotId);
  return slot ? (textFieldsFor(slot).find((f) => f.id === fieldId)?.maxLength ?? 0) : 0;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  let body: { slotId?: string; fieldId?: string; value?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const slotId = String(body.slotId ?? "");
  const fieldId = String(body.fieldId ?? "");
  const value = String(body.value ?? "");

  if (!fieldExists(slotId, fieldId)) {
    return NextResponse.json({ error: "Unbekanntes Textfeld." }, { status: 400 });
  }

  // Serverseitig prüfen, nicht nur im Formular – maxLength im Browser ist
  // Komfort, keine Zusicherung.
  const max = limitFor(slotId, fieldId);
  if (value.length > max) {
    return NextResponse.json(
      { error: `Der Text ist zu lang (höchstens ${max} Zeichen).` },
      { status: 400 },
    );
  }

  try {
    const saved = await saveSlotText(slotId, fieldId, value);
    refreshSite();
    return NextResponse.json({
      ok: true,
      value: saved,
      isCustom: saved !== fallbackFor(slotId, fieldId),
    });
  } catch (err) {
    console.error("[api/texts] Speichern fehlgeschlagen:", err);
    const message =
      err instanceof Error && err.message.startsWith("Text speichern nicht möglich")
        ? err.message
        : "Der Text konnte nicht gespeichert werden. Bitte erneut versuchen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Setzt ein Textfeld auf den Wert aus dem Code zurück. */
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const url = new URL(request.url);
  const slotId = url.searchParams.get("slotId") ?? "";
  const fieldId = url.searchParams.get("fieldId") ?? "";

  if (!fieldExists(slotId, fieldId)) {
    return NextResponse.json({ error: "Unbekanntes Textfeld." }, { status: 400 });
  }

  try {
    const value = await resetSlotText(slotId, fieldId);
    refreshSite();
    return NextResponse.json({ ok: true, value, isCustom: false });
  } catch (err) {
    console.error("[api/texts] Zurücksetzen fehlgeschlagen:", err);
    return NextResponse.json({ error: "Zurücksetzen fehlgeschlagen." }, { status: 500 });
  }
}
