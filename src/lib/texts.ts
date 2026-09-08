import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_cache, revalidateTag } from "next/cache";
import { fallbackFor, fieldExists } from "./slot-texts";
import { datenVerzeichnis, schreibeAtomar, speicherFehlerText } from "./images";

/**
 * Speicherung der im Admin geänderten Bildtexte.
 *
 * Liegt bewusst im selben Datenverzeichnis wie die Bilder (siehe lib/images.ts):
 * ein Volume, ein Pfad, alles überlebt gemeinsam einen Deploy. Der Text aus dem
 * Code bleibt immer der Rückfallwert; gespeichert wird nur, was abweicht.
 */

/** slotId -> fieldId -> Text */
export type TextStore = Record<string, Record<string, string>>;

const CACHE_TAG = "sunna-texts";
const textDatei = () => path.join(datenVerzeichnis(), "texts.json");

async function assertWritableStore() {
  try {
    await fs.mkdir(datenVerzeichnis(), { recursive: true });
  } catch {
    throw new Error(speicherFehlerText("Text speichern"));
  }
}

/* ── Lesen ──────────────────────────────────────────────────────────────────── */

async function readStoreUncached(): Promise<TextStore> {
  try {
    return JSON.parse(await fs.readFile(textDatei(), "utf8")) as TextStore;
  } catch {
    // Noch nie ein Text geändert -> überall die Werte aus dem Code.
    return {};
  }
}

// revalidate muss zur Seiten-Revalidierung passen (60 s). Stünde hier ein
// größerer Wert, würde die Seite zwar neu gebaut, läse dabei aber weiter den
// alten Cache-Eintrag – der äußere Neubau brächte dann gar nichts.
export const getTexts = unstable_cache(readStoreUncached, ["sunna-text-store"], {
  tags: [CACHE_TAG],
  revalidate: 60,
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
  await schreibeAtomar(textDatei(), JSON.stringify(store, null, 2));
  revalidateTag(CACHE_TAG);
}

/**
 * Speichert einen Text. Ein leerer Wert – oder einer, der dem Standard
 * entspricht – löscht den Eintrag wieder, statt ihn doppelt abzulegen.
 * So bleibt der Store klein und ein späterer Textwechsel im Code wirkt.
 */
export async function saveSlotText(slotId: string, fieldId: string, value: string) {
  if (!fieldExists(slotId, fieldId)) throw new Error("Unbekanntes Textfeld.");
  await assertWritableStore();

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
  await assertWritableStore();

  const store = await readStoreUncached();
  if (store[slotId]) {
    delete store[slotId][fieldId];
    if (!Object.keys(store[slotId]).length) delete store[slotId];
    await writeStore(store);
  }
  return fallbackFor(slotId, fieldId);
}
