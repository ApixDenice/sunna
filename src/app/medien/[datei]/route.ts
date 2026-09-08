import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  CONTENT_TYPES,
  istErlaubterDateiname,
  uploadVerzeichnis,
} from "@/lib/images";

/**
 * Auslieferung der im Admin hochgeladenen Bilder.
 *
 * Sie liegen im Datenverzeichnis (siehe lib/images.ts) und damit außerhalb von
 * `public/` – Next liefert sie deshalb nicht von selbst aus. Das ist kein
 * Umweg, sondern der Preis dafür, dass sie einen Deploy überleben: Nur ein
 * eingehängtes Volume ist dauerhaft, und `public/` ist Teil des Builds.
 *
 * Sicherheit: Ein Dateiname aus der URL wird NIE ungeprüft zu einem Pfad.
 * `istErlaubterDateiname` lässt nur Namen durch, die wir selbst erzeugt haben,
 * und der zusammengesetzte Pfad wird danach noch einmal daraufhin geprüft, ob
 * er wirklich im Upload-Verzeichnis liegt. Ohne diese zweite Prüfung wäre ein
 * `%2e%2e%2f`-Trick der direkte Weg zu /etc/passwd.
 */

export const runtime = "nodejs";

export async function GET(_: Request, ctx: { params: Promise<{ datei: string }> }) {
  const { datei } = await ctx.params;

  if (!istErlaubterDateiname(datei)) {
    return new NextResponse("Nicht gefunden", { status: 404 });
  }

  const typ = CONTENT_TYPES[path.extname(datei).toLowerCase()];
  if (!typ) return new NextResponse("Nicht gefunden", { status: 404 });

  const wurzel = uploadVerzeichnis();
  const ziel = path.resolve(wurzel, datei);
  if (ziel !== path.join(wurzel, datei)) {
    return new NextResponse("Nicht gefunden", { status: 404 });
  }

  try {
    const daten = await fs.readFile(ziel);
    return new NextResponse(new Uint8Array(daten), {
      headers: {
        "Content-Type": typ,
        // Der Dateiname enthält einen Zeitstempel und ändert sich bei jedem
        // Upload. Die Datei unter diesem Namen ist also unveränderlich und
        // darf beliebig lange gecacht werden.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    // Datei weg (Volume neu, Bild zurückgesetzt): kein Serverfehler, sondern
    // schlicht nicht vorhanden. Die Seite fällt dann auf das Standardbild
    // zurück, sobald das Manifest das nächste Mal gelesen wird.
    return new NextResponse("Nicht gefunden", { status: 404 });
  }
}
