import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_cache, revalidateTag } from "next/cache";
import { slotById } from "./slots";

/**
 * Speicherung der vom Admin hochgeladenen Bilder.
 *
 * Produktion (Vercel): Bilder + manifest.json liegen im Vercel Blob Store.
 * Lokal (kein BLOB_READ_WRITE_TOKEN): Bilder unter public/uploads,
 * Manifest unter .data/manifest.json – so lässt sich alles ohne Cloud testen.
 */

export type Manifest = Record<string, { url: string; updatedAt: string }>;

const MANIFEST_PATH = "sunna/manifest.json";
const LOCAL_MANIFEST = path.join(process.cwd(), ".data", "manifest.json");
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const CACHE_TAG = "sunna-images";

export const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * Für die Statusanzeige im Admin. Eigener Name, weil `useBlob` wie ein
 * React-Hook aussieht und in einer Komponente aufgerufen werden soll.
 */
export function speicherStatus() {
  return {
    blobVerbunden: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    inDerCloud: Boolean(process.env.VERCEL),
    umgebung: process.env.VERCEL_ENV ?? "lokal",
  };
}

/**
 * Der lokale Zweig schreibt nach public/uploads. Auf Vercel ist das Dateisystem
 * zur Laufzeit schreibgeschützt – ein Upload würde dort mit einem kryptischen
 * EROFS-Fehler abbrechen und Kerstin ratlos zurücklassen. Deshalb hier ein
 * klarer Abbruch mit Klartext, sobald in der Cloud der Blob-Store fehlt.
 */
function assertWritableStore() {
  if (!useBlob() && process.env.VERCEL) {
    throw new Error(
      "Bild-Upload nicht möglich: In der Cloud wird ein Vercel-Blob-Store benötigt. " +
        "Im Vercel-Dashboard unter Storage einen Blob-Store anlegen und mit dem Projekt " +
        "verbinden – die Variable BLOB_READ_WRITE_TOKEN wird dann automatisch gesetzt.",
    );
  }
}

/* ── Lesen ──────────────────────────────────────────────────────────────────── */

async function readManifestUncached(): Promise<Manifest> {
  try {
    if (useBlob()) {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: MANIFEST_PATH, limit: 1 });
      if (!blobs.length) return {};
      // Der Zeitstempel im Query-Parameter erzwingt nach jedem Upload eine
      // frische URL. So bleibt der normale Fetch-Cache nutzbar, ohne dass
      // ein Bildwechsel verzögert sichtbar wird.
      const version = new Date(blobs[0].uploadedAt).getTime();
      const res = await fetch(`${blobs[0].url}?v=${version}`);
      if (!res.ok) return {};
      return (await res.json()) as Manifest;
    }
    const raw = await fs.readFile(LOCAL_MANIFEST, "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    // Noch nie etwas hochgeladen (oder Store nicht erreichbar) -> Standardbilder.
    return {};
  }
}

/** Gecacht, damit nicht jede Seitenanfrage den Blob-Store anfasst. */
export const getManifest = unstable_cache(readManifestUncached, ["sunna-image-manifest"], {
  tags: [CACHE_TAG],
  revalidate: 300,
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
  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    await put(MANIFEST_PATH, JSON.stringify(manifest, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      cacheControlMaxAge: 0,
      // Hinweis für ein späteres Upgrade auf @vercel/blob 1.x: Dort wirft put()
      // beim Überschreiben eines vorhandenen Pfades, solange nicht
      // `allowOverwrite: true` gesetzt ist. In der hier installierten 0.27.x
      // gibt es die Option noch nicht – Überschreiben ist dort das
      // Standardverhalten. Beim Versionswechsel also ergänzen, sonst schlägt
      // jede Änderung im Admin fehl.
    });
  } else {
    await fs.mkdir(path.dirname(LOCAL_MANIFEST), { recursive: true });
    await fs.writeFile(LOCAL_MANIFEST, JSON.stringify(manifest, null, 2), "utf8");
  }
  revalidateTag(CACHE_TAG);
}

/** Speichert eine hochgeladene Datei und verknüpft sie mit dem Slot. */
export async function saveSlotImage(slotId: string, file: File): Promise<string> {
  if (!slotById.has(slotId)) throw new Error("Unbekannter Bild-Slot.");
  assertWritableStore();

  const ext = extensionFor(file.type);
  // Zeitstempel im Namen = neue URL bei jedem Upload -> keine veralteten
  // Bilder aus Browser- oder CDN-Cache.
  const key = `sunna/bilder/${slotId}-${Date.now()}${ext}`;

  let url: string;
  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(key, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    url = blob.url;
  } else {
    await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
    const name = key.split("/").pop()!;
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, name), buf);
    url = `/uploads/${name}`;
  }

  const manifest = await readManifestUncached();
  manifest[slotId] = { url, updatedAt: new Date().toISOString() };
  await writeManifest(manifest);
  return url;
}

/** Setzt einen Slot auf das ursprüngliche Standardbild zurück. */
export async function resetSlotImage(slotId: string) {
  assertWritableStore();
  const manifest = await readManifestUncached();
  delete manifest[slotId];
  await writeManifest(manifest);
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

export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB – Handyfotos passen locker rein
