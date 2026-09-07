import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_cache, revalidateTag } from "next/cache";
import { fallbackFor, fieldExists } from "./slot-texts";

/**
 * Speicherung der im Admin geänderten Bildtexte.
 *
 * Aufbau bewusst identisch zu lib/images.ts:
 * Produktion (Vercel) im Blob Store, lokal unter .data/ – gleiche Denkweise,
 * gleiche Fallstricke, nichts Neues zu lernen. Der Text aus dem Code bleibt
 * immer der Rückfallwert; gespeichert wird nur, was tatsächlich abweicht.
 */

/** slotId -> fieldId -> Text */
export type TextStore = Record<string, Record<string, string>>;

const STORE_PATH = "sunna/texts.json";
const LOCAL_STORE = path.join(process.cwd(), ".data", "texts.json");
const CACHE_TAG = "sunna-texts";

// Erkennung wie in lib/images.ts – dort steht die Begründung.
// BLOB_STORE_ID = über OIDC verbundener Store, BLOB_READ_WRITE_TOKEN = statischer Token.
const useBlob = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

function assertWritableStore() {
  if (!useBlob() && process.env.VERCEL) {
    throw new Error(
      "Text speichern nicht möglich: In der Cloud wird ein Vercel-Blob-Store benötigt. " +
        "Im Vercel-Dashboard unter Storage einen Blob-Store anlegen und mit dem Projekt verbinden.",
    );
  }
}

/* ── Lesen ──────────────────────────────────────────────────────────────────── */

async function readStoreUncached(): Promise<TextStore> {
  try {
    if (useBlob()) {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: STORE_PATH, limit: 1 });
      if (!blobs.length) return {};
      const version = new Date(blobs[0].uploadedAt).getTime();
      const res = await fetch(`${blobs[0].url}?v=${version}`);
      if (!res.ok) return {};
      return (await res.json()) as TextStore;
    }
    return JSON.parse(await fs.readFile(LOCAL_STORE, "utf8")) as TextStore;
  } catch {
    // Noch nie ein Text geändert -> überall die Werte aus dem Code.
    return {};
  }
}

export const getTexts = unstable_cache(readStoreUncached, ["sunna-text-store"], {
  tags: [CACHE_TAG],
  revalidate: 300,
});

/**
 * Alle Texte eines Bildplatzes, überschriebene und unveränderte gemischt.
 * Eine Abfrage pro Slot statt einer pro Feld – der Store wird ohnehin
 * am Stück geladen und gecacht.
 */
export async function resolveSlotTexts(slotId: string): Promise<Record<string, string>> {
  const store = await getTexts();
  return store[slotId] ?? {};
}

/** Ein einzelner Text mit Rückfall auf den Wert aus dem Code. */
export async function resolveText(slotId: string, fieldId: string): Promise<string> {
  const custom = (await resolveSlotTexts(slotId))[fieldId];
  return custom?.trim() ? custom : fallbackFor(slotId, fieldId);
}

/* ── Schreiben ──────────────────────────────────────────────────────────────── */

async function writeStore(store: TextStore) {
  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    await put(STORE_PATH, JSON.stringify(store, null, 2), {
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
    await fs.mkdir(path.dirname(LOCAL_STORE), { recursive: true });
    await fs.writeFile(LOCAL_STORE, JSON.stringify(store, null, 2), "utf8");
  }
  revalidateTag(CACHE_TAG);
}

/**
 * Speichert einen Text. Ein leerer Wert – oder einer, der dem Standard
 * entspricht – löscht den Eintrag wieder, statt ihn doppelt abzulegen.
 * So bleibt der Store klein und ein späterer Textwechsel im Code wirkt.
 */
export async function saveSlotText(slotId: string, fieldId: string, value: string) {
  if (!fieldExists(slotId, fieldId)) throw new Error("Unbekanntes Textfeld.");
  assertWritableStore();

  const store = await readStoreUncached();
  const clean = value.replace(/\s+/g, " ").trim();
  const fields = { ...(store[slotId] ?? {}) };

  if (!clean || clean === fallbackFor(slotId, fieldId)) {
    delete fields[fieldId];
  } else {
    fields[fieldId] = clean;
  }

  if (Object.keys(fields).length) store[slotId] = fields;
  else delete store[slotId];

  await writeStore(store);
  return clean || fallbackFor(slotId, fieldId);
}

/** Setzt ein Feld auf den Text aus dem Code zurück. */
export async function resetSlotText(slotId: string, fieldId: string) {
  if (!fieldExists(slotId, fieldId)) throw new Error("Unbekanntes Textfeld.");
  assertWritableStore();

  const store = await readStoreUncached();
  if (store[slotId]) {
    delete store[slotId][fieldId];
    if (!Object.keys(store[slotId]).length) delete store[slotId];
    await writeStore(store);
  }
  return fallbackFor(slotId, fieldId);
}
