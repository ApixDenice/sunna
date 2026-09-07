import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { saveSlotImage, resetSlotImage, ALLOWED_MIME, MAX_UPLOAD_BYTES } from "@/lib/images";
import { slotById } from "@/lib/slots";

export const runtime = "nodejs";
// Uploads dürfen nie aus einem Cache beantwortet werden.
export const dynamic = "force-dynamic";

/** Nach einem Bildwechsel alle Seiten neu erzeugen, damit es sofort sichtbar ist. */
function refreshSite() {
  revalidatePath("/", "layout");
}

/**
 * Fehler aus lib/images.ts wörtlich durchreichen, wenn sie der Nutzerin
 * tatsächlich weiterhelfen – etwa der fehlende Blob-Store. Ein pauschales
 * „bitte erneut versuchen" schickt sie sonst in eine Endlosschleife, weil ein
 * zweiter Versuch am selben Konfigurationsfehler scheitert.
 */
function nutzbareMeldung(err: unknown, fallback: string) {
  return err instanceof Error && err.message.startsWith("Bild-Upload nicht möglich")
    ? err.message
    : fallback;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const slotId = String(form.get("slotId") ?? "");
  const file = form.get("file");

  if (!slotById.has(slotId)) {
    return NextResponse.json({ error: "Unbekannter Bildplatz." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Es wurde keine Datei übermittelt." }, { status: 400 });
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json(
      { error: "Nur JPG-, PNG-, WebP- oder AVIF-Bilder sind erlaubt." },
      { status: 415 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `Das Bild ist zu groß (max. ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB).` },
      { status: 413 },
    );
  }

  try {
    const url = await saveSlotImage(slotId, file);
    refreshSite();
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[api/images] Upload fehlgeschlagen:", err);
    return NextResponse.json(
      {
        error: nutzbareMeldung(
          err,
          "Das Bild konnte nicht gespeichert werden. Bitte erneut versuchen.",
        ),
      },
      { status: 500 },
    );
  }
}

/** Setzt einen Bildplatz auf das ursprüngliche Standardbild zurück. */
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const slotId = new URL(request.url).searchParams.get("slotId") ?? "";
  const slot = slotById.get(slotId);
  if (!slot) return NextResponse.json({ error: "Unbekannter Bildplatz." }, { status: 400 });

  try {
    await resetSlotImage(slotId);
    refreshSite();
    return NextResponse.json({ ok: true, url: slot.src });
  } catch (err) {
    console.error("[api/images] Zurücksetzen fehlgeschlagen:", err);
    return NextResponse.json(
      { error: nutzbareMeldung(err, "Zurücksetzen fehlgeschlagen.") },
      { status: 500 },
    );
  }
}
