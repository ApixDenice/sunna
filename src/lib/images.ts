import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_cache, revalidateTag } from "next/cache";
import { slotById } from "./slots";

/**
 * Speicherung der vom Admin hochgeladenen Bilder.
 * ───────────────────────────────────────────────
 * Alles Persistente liegt in EINEM Verzeichnis, dessen Ort die Umgebungs-
 * variable `DATA_DIR` bestimmt:
 *
 *   <DATA_DIR>/uploads/<slot>-<zeitstempel>.webp   die Bilder
 *   <DATA_DIR>/manifest.json                       welches Bild zu welchem Slot
 *   <DATA_DIR>/texts.json                          siehe lib/texts.ts
 *
 * Ohne gesetzte Variable ist es `.data` im Projektordner – lokal ändert sich
 * damit nichts.
 *
 * Warum ein einziges Verzeichnis: Gehostete Container sind bei jedem Deploy
 * neu, überlebt nur ein eingehängtes Volume – und ein Volume hängt an genau
 * EINEM Pfad. Lägen Bilder unter public/uploads und die JSON-Dateien unter
 * .data, könnte immer nur eine Hälfte überleben: Nach dem Deploy wären
 * entweder die Bilder da und die Zuordnung weg oder umgekehrt.
 *
 * Der frühere Vercel-Blob-Zweig ist ersatzlos entfallen. Er war an einen
 * Anbieter gebunden, hing an Token- und OIDC-Eigenheiten und hat mehr Zeit
 * gekostet als er je gespart hat. Diese Fassung läuft überall gleich, wo ein
 * Node-Prozess und eine beschreibbare Platte existieren: Railway, Hetzner,
 * jeder Docker-Host, der eigene Rechner.
 */

export type Manifest = Record<string, { url: string; updatedAt: string }>;

const CACHE_TAG = "sunna-images";

/** Öffentlicher Pfad, unter dem hochgeladene Bilder ausgeliefert werden. */
export const MEDIEN_PREFIX = "/medien";

/**
 * Bilder liegen außerhalb von `public/` und werden deshalb nicht von Next
 * selbst ausgeliefert, sondern von app/medien/[datei]/route.ts. Der Dateiname
 * wird dort streng geprüft – hier wird er erzeugt, dort bewacht.
 */
export function datenVerzeichnis() {
  const gesetzt = process.env.DATA_DIR?.trim();
  return gesetzt ? path.resolve(gesetzt) : path.join(process.cwd(), ".data");
}

export const uploadVerzeichnis = () => path.join(datenVerzeichnis(), "uploads");
const manifestDatei = () => path.join(datenVerzeichnis(), "manifest.json");

/**
 * Ist das Datenverzeichnis wirklich beschreibbar?
 *
 * Wird beim Laden der Admin-Seite aufgerufen, damit dort steht, ob Speichern
 * funktionieren wird – statt dass Kerstin es beim ersten Upload herausfindet.
 * Ein fehlendes Verzeichnis ist dabei kein Fehler: Es wird angelegt.
 */
export async function speicherStatus() {
  const verzeichnis = datenVerzeichnis();
  try {
    await fs.mkdir(uploadVerzeichnis(), { recursive: true });
    // Ein echter Schreibversuch. `access()` mit W_OK lügt in Containern
    // gelegentlich, weil es nur Rechte-Bits prüft und nicht, ob das Dateisystem
    // read-only eingehängt ist.
    const probe = path.join(verzeichnis, ".schreibtest");
    await fs.writeFile(probe, "ok", "utf8");
    await fs.unlink(probe).catch(() => {});
    return { verzeichnis, schreibbar: true, eigenesVerzeichnis: Boolean(process.env.DATA_DIR) };
  } catch {
    return { verzeichnis, schreibbar: false, eigenesVerzeichnis: Boolean(process.env.DATA_DIR) };
  }
}

export type Speicher = Awaited<ReturnType<typeof speicherStatus>>;

/** Klartext für den Fehlerfall – gemeinsam genutzt mit lib/texts.ts. */
export function speicherFehlerText(was: string) {
  return (
    `${was} nicht möglich: Das Datenverzeichnis ${datenVerzeichnis()} ist nicht ` +
    "beschreibbar. Beim Hosting muss dort ein Volume eingehängt und die Variable " +
    "DATA_DIR auf denselben Pfad gesetzt sein."
  );
}

async function assertWritableStore(was: string) {
  try {
    await fs.mkdir(uploadVerzeichnis(), { recursive: true });
  } catch {
    throw new Error(speicherFehlerText(was));
  }
}

/* ── Lesen ──────────────────────────────────────────────────────────────────── */

async function readManifestUncached(): Promise<Manifest> {
  try {
    return JSON.parse(await fs.readFile(manifestDatei(), "utf8")) as Manifest;
  } catch {
    // Noch nie etwas hochgeladen -> überall die Standardbilder aus slots.ts.
    return {};
  }
}

/** Gecacht, damit nicht jede Seitenanfrage die Platte anfasst. */
// revalidate muss zur Seiten-Revalidierung (60 s) passen – siehe lib/texts.ts.
export const getManifest = unstable_cache(readManifestUncached, ["sunna-image-manifest"], {
  tags: [CACHE_TAG],
  revalidate: 60,
});

/** Liefert die anzuzeigende Bild-URL für einen Slot (Upload schlägt Standardbild). */
export async function resolveImage(slotId: string): Promise<{ src: string; alt: string }> {
  const slot = slotById.get(slotId);
  if (!slot) throw new Error(`Unbekannter Bild-Slot: ${slotId}`);
  const manifest = await getManifest();
  return { src: manifest[slotId]?.url ?? slot.src, alt: slot.alt };
}

/* ── Schreiben ──────────────────────────────────────────────────────────────── */

async function writeManifest(manifest: Manifest) {
  await schreibeAtomar(manifestDatei(), JSON.stringify(manifest, null, 2));
  revalidateTag(CACHE_TAG);
}

/**
 * Erst in eine Nachbardatei schreiben, dann umbenennen. Bricht der Vorgang
 * mittendrin ab – Deploy, Absturz, volle Platte –, bleibt die alte Fassung
 * heil. Ein halb geschriebenes manifest.json würde sonst alle Bildzuordnungen
 * auf einmal verlieren.
 */
export async function schreibeAtomar(ziel: string, inhalt: string) {
  await fs.mkdir(path.dirname(ziel), { recursive: true });
  const temp = `${ziel}.${process.pid}.tmp`;
  await fs.writeFile(temp, inhalt, "utf8");
  await fs.rename(temp, ziel);
}

/** Speichert eine hochgeladene Datei und verknüpft sie mit dem Slot. */
export async function saveSlotImage(slotId: string, file: File): Promise<string> {
  if (!slotById.has(slotId)) throw new Error("Unbekannter Bild-Slot.");
  await assertWritableStore("Bild-Upload");

  const ext = extensionFor(file.type);
  // Zeitstempel im Namen = neue Adresse bei jedem Upload. Damit kann die Datei
  // dauerhaft gecacht werden, ohne dass ein Bildwechsel hängen bleibt.
  const name = `${slotId}-${Date.now()}${ext}`;
  const ziel = path.join(uploadVerzeichnis(), name);

  const buf = Buffer.from(await file.arrayBuffer());
  const temp = `${ziel}.tmp`;
  await fs.writeFile(temp, buf);
  await fs.rename(temp, ziel);

  const manifest = await readManifestUncached();
  const vorher = manifest[slotId]?.url;
  manifest[slotId] = { url: `${MEDIEN_PREFIX}/${name}`, updatedAt: new Date().toISOString() };
  await writeManifest(manifest);

  // Das ersetzte Bild löschen. Ohne das läuft das Volume nach genug
  // Bildwechseln voll – auf Hobby-Tarifen sind 5 GB schnell erreicht.
  await loescheUpload(vorher);

  return manifest[slotId].url;
}

/** Setzt einen Slot auf das ursprüngliche Standardbild zurück. */
export async function resetSlotImage(slotId: string) {
  await assertWritableStore("Zurücksetzen");
  const manifest = await readManifestUncached();
  const vorher = manifest[slotId]?.url;
  delete manifest[slotId];
  await writeManifest(manifest);
  await loescheUpload(vorher);
}

/** Löscht eine zuvor hochgeladene Datei, sofern die URL auf eine solche zeigt. */
async function loescheUpload(url?: string) {
  if (!url?.startsWith(`${MEDIEN_PREFIX}/`)) return; // Standardbild aus /public
  const name = url.slice(MEDIEN_PREFIX.length + 1);
  if (!istErlaubterDateiname(name)) return;
  await fs.unlink(path.join(uploadVerzeichnis(), name)).catch(() => {});
}

/**
 * Nur Namen, die wir selbst erzeugt haben: Buchstaben, Ziffern, Bindestrich,
 * Punkt – und kein Punkt am Anfang. Damit sind `..`, Schrägstriche und
 * absolute Pfade ausgeschlossen, bevor daraus je ein Dateipfad wird.
 */
export function istErlaubterDateiname(name: string) {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/.test(name) && !name.includes("..");
}

function extensionFor(mime: string) {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    default:
      throw new Error("Nicht unterstütztes Bildformat.");
  }
}

/** Endung -> Content-Type, für die Auslieferung in app/medien/[datei]/route.ts. */
export const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB – Handyfotos passen locker rein
