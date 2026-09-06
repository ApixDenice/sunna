import { slotById, type ImageSlot } from "./slots";

/**
 * Texte, die zu einem Bild gehören
 * ────────────────────────────────
 * Wenn Kerstin ein Foto austauscht, stimmt der Text daneben oft nicht mehr:
 * Aus dem Ziegeldach wird ein Flachdach, aus dem Speicher eine Wärmepumpe.
 * Deshalb ist jeder Text, der ein Bild *beschreibt*, hier an dessen Slot
 * gebunden und im Admin direkt unter dem Bild editierbar.
 *
 * Bewusst NICHT hier: Überschriften, Fließtext und Rechtstexte der Seiten.
 * Die bleiben im Code – ein volles Text-CMS war eine bewusst verworfene
 * Entscheidung (Layout-Risiko, Pflegeaufwand), siehe Architektur-Notizen.
 *
 * `maxLength` ist keine Schikane, sondern Layoutschutz: Ein Referenztitel mit
 * 120 Zeichen bricht die Kachel auf drei Zeilen und schiebt die Beschriftung
 * aus dem Bild. Das Admin-Panel zeigt den Zähler live mit.
 */

export type TextField = {
  /** Eindeutig innerhalb eines Slots */
  id: string;
  label: string;
  hint: string;
  /** Mehrzeiliges Feld statt einzeiligem Eingabefeld */
  multiline?: boolean;
  maxLength: number;
  /** Der Text aus dem Code, solange nichts überschrieben wurde */
  fallback: string;
};

type Draft = TextField;

const referenz = (
  titel: string,
  kurz: string,
  detail: string,
  tags: string,
): Draft[] => [
  {
    id: "titel",
    label: "Überschrift der Kachel",
    hint: "Was ist zu sehen? Kurz und konkret.",
    maxLength: 60,
    fallback: titel,
  },
  {
    id: "kurz",
    label: "Zeile darunter",
    hint: "Immer sichtbar. Der Nutzen in einem Halbsatz.",
    maxLength: 90,
    fallback: kurz,
  },
  {
    id: "detail",
    label: "Text beim Darüberfahren",
    hint: "Erscheint, wenn die Maus auf der Kachel liegt.",
    multiline: true,
    maxLength: 220,
    fallback: detail,
  },
  {
    id: "tags",
    label: "Schlagwörter",
    hint: "Die kleinen Pillen oben in der Kachel. Mit Komma trennen, höchstens zwei.",
    maxLength: 60,
    fallback: tags,
  },
];

/** Slot-ID → Zusatzfelder. Nur Referenzkacheln haben welche. */
const bySlot: Record<string, Draft[]> = {
  "ref-1": referenz(
    "Solardach, vollflächig belegt",
    "Anthrazit auf Anthrazit – Ertrag, den man kaum sieht",
    "Module bündig zur Dachfläche gesetzt. Aus der Luft wirkt das Dach wie aus einem Guss – volle Leistung, ohne dass das Haus zur Baustelle wird.",
    "Satteldach, Vollbelegung",
  ),
  "ref-2": referenz(
    "Mehrfamilienhaus über die volle Dachbreite",
    "Eine Anlage, mehrere Wohneinheiten",
    "Südausrichtung über die gesamte Dachbreite, ausgelegt auf die Versorgung mehrerer Parteien – inklusive der passenden Zähler- und Messkonzepte.",
    "Mehrfamilienhaus",
  ),
  "ref-3": referenz(
    "Ziegeldach mit zwei Modulfeldern",
    "Um jedes Dachfenster herum geplant",
    "Zwei Felder statt einer Fläche: So bleiben Dachfenster nutzbar und die Anlage sieht trotzdem aus wie geplant – nicht wie nachträglich draufgelegt.",
    "Ziegeldach, Dachfenster",
  ),
  "ref-4": referenz(
    "Solardach über mehrere Flächen",
    "Jede Teilfläche einzeln ausgelegt",
    "Mehrere Dachflächen mit unterschiedlicher Ausrichtung, jede für sich berechnet. Genau der Fall, für den Katalogangebote nie passen.",
    "Satteldach, Individuelle Planung",
  ),
  "ref-5": referenz(
    "Aufgeständertes Flachdach",
    "Ballastiert – ohne ein einziges Loch im Dach",
    "Die Unterkonstruktion wird beschwert statt verschraubt. Die Dachabdichtung bleibt unberührt, die Module stehen im optimalen Winkel.",
    "Flachdach, Aufständerung",
  ),
  "ref-6": referenz(
    "Stromspeicher, modular erweiterbar",
    "Sonne vom Mittag, nutzbar am Abend",
    "Auf den tatsächlichen Abendverbrauch dimensioniert statt auf die größte Rechnung. Wächst mit, wenn später E-Auto oder Wärmepumpe dazukommen.",
    "Speicher",
  ),
  "ref-7": referenz(
    "Nebengebäude als zusätzliche Ertragsfläche",
    "Wenn das Hauptdach nicht reicht",
    "Garage, Carport, Scheune: Flächen, die ohnehin da sind, arbeiten mit. Oft der günstigste Weg zu spürbar mehr Eigenverbrauch.",
    "Nebengebäude",
  ),
  "ref-8": referenz(
    "Neuer Zählerschrank samt Wechselrichter",
    "Haustechnik aus einer Hand – kein zweiter Betrieb nötig",
    "Viele Altbauten brauchen vor der Anlage einen neuen Zählerschrank. Wir erneuern ihn gleich mit und übernehmen die Meldung beim Netzbetreiber.",
    "Haustechnik, Wechselrichter",
  ),
  "ref-9": referenz(
    "Wohnhaus mit Wintergarten",
    "Anbauten bleiben, wie sie sind",
    "Die Anlage ist so gesetzt, dass Wintergarten und Dachaufbauten unberührt bleiben – Verschattung eingerechnet, nicht ignoriert.",
    "Satteldach, Bestand",
  ),
  "ref-10": referenz(
    "Moderne Wärmepumpe, statt alter Heizung",
    "Heizung raus, Wärmepumpe rein – ohne kalten Winter",
    "Ablösung einer in die Jahre gekommenen Anlage: Wärmepumpe mit Pufferspeicher, sauber gedämmte Verrohrung, hydraulisch eingeregelt.",
    "Wärmepumpe, Heizungstausch",
  ),
  "ref-11": referenz(
    "Wärmepumpe, sauber eingebunden",
    "Technikraum, den man herzeigen kann",
    "Pufferspeicher, Hydraulikgruppe und Ausdehnungsgefäß auf engem Raum geordnet montiert. Bedienung über ein Display – der Rest läuft von allein.",
    "Wärmepumpe, Haustechnik",
  ),
};

/**
 * Alle editierbaren Textfelder eines Bildplatzes.
 * Die Bildbeschreibung hat jeder Slot – sie kommt aus `alt` in slots.ts.
 */
export function textFieldsFor(slot: ImageSlot): TextField[] {
  return [
    {
      id: "alt",
      label: "Bildbeschreibung",
      hint: "Wird blinden Besuchern vorgelesen und von Google gelesen. Beschreiben Sie sachlich, was auf dem Foto zu sehen ist.",
      maxLength: 160,
      fallback: slot.alt,
    },
    ...(bySlot[slot.id] ?? []),
  ];
}

/** Prüft, ob es dieses Feld an diesem Slot überhaupt gibt (Schutz für die API). */
export function fieldExists(slotId: string, fieldId: string) {
  const slot = slotById.get(slotId);
  if (!slot) return false;
  return textFieldsFor(slot).some((f) => f.id === fieldId);
}

/** Standardtext eines Feldes – der Wert aus dem Code. */
export function fallbackFor(slotId: string, fieldId: string): string {
  const slot = slotById.get(slotId);
  if (!slot) return "";
  return textFieldsFor(slot).find((f) => f.id === fieldId)?.fallback ?? "";
}
