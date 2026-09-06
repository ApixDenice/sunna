/**
 * Bild-Slot-Register
 * ──────────────────
 * Jeder Platz auf der Website, an dem ein Bild steht, ist hier als „Slot“
 * definiert. Das Admin-Panel liest genau diese Liste und baut daraus
 * automatisch seine Oberfläche – ein neuer Slot hier bedeutet also ein
 * neues Feld im Admin, ohne dass am Admin-Code etwas geändert werden muss.
 *
 * `src` ist das Standardbild aus /public. Lädt jemand im Admin ein neues Bild
 * hoch, überschreibt dessen URL diesen Wert (siehe lib/images.ts).
 */

export type ImageSlot = {
  id: string;
  /** Beschriftung im Admin-Panel */
  label: string;
  /** Gruppierung im Admin-Panel */
  group: string;
  /** Hinweis für die Admin-Nutzerin, welches Format gut aussieht */
  hint: string;
  /** Standardbild, solange nichts hochgeladen wurde */
  src: string;
  /** Alternativtext (Barrierefreiheit + SEO) */
  alt: string;
  /** Seitenverhältnis für die Vorschau im Admin */
  aspect: "16/9" | "4/3" | "3/4" | "1/1";
};

export const imageSlots: ImageSlot[] = [
  // ── Startseite ─────────────────────────────────────────────────────────────
  {
    id: "home-hero",
    label: "Startseite – großes Bild oben",
    group: "Startseite",
    hint: "Hochformat, am besten eine fertige Anlage aus der Luft.",
    src: "/bilder/referenz-drohne-wintergarten.webp",
    alt: "Wohnhaus mit Wintergarten und einer von Sunna installierten Photovoltaikanlage aus der Vogelperspektive",
    aspect: "3/4",
  },
  {
    id: "home-leistung-anlage",
    label: "Startseite – Leistung „Photovoltaikanlage“",
    group: "Startseite",
    hint: "Querformat, Dach mit Modulen.",
    src: "/bilder/referenz-ziegeldach.webp",
    alt: "Photovoltaikmodule auf einem roten Ziegeldach",
    aspect: "4/3",
  },
  {
    id: "home-leistung-speicher",
    label: "Startseite – Leistung „Stromspeicher“",
    group: "Startseite",
    hint: "Querformat, Speicher oder Technikraum.",
    src: "/bilder/referenz-speicher-doppel.webp",
    alt: "Zwei Stromspeicher an einer Kellerwand",
    aspect: "4/3",
  },
  {
    id: "home-leistung-wallbox",
    label: "Startseite – Leistung „Wallbox“",
    group: "Startseite",
    hint: "Querformat, Ladepunkt oder Zählerschrank.",
    src: "/bilder/referenz-wallbox.webp",
    alt: "Wallbox auf einer Stele im Garten",
    aspect: "4/3",
  },
  {
    id: "home-band",
    label: "Startseite – breites Bild im Ablauf-Abschnitt",
    group: "Startseite",
    hint: "Sehr breites Querformat (Panorama).",
    src: "/bilder/referenz-drohne-anthrazit.webp",
    alt: "Anthrazitfarbenes Dach mit vollflächiger Photovoltaikanlage aus der Luft",
    aspect: "16/9",
  },

  // ── Über uns ───────────────────────────────────────────────────────────────
  {
    id: "about-portrait",
    label: "Über uns – Porträt von Kerstin",
    group: "Über uns",
    hint: "Hochformat-Porträt (3:4). Ein aktuelleres Foto einfach hier hochladen.",
    src: "/bilder/kerstin-portrait.webp",
    alt: "Kerstin Klaiber, Inhaberin von Sunna Photovoltaik",
    aspect: "3/4",
  },
  {
    id: "about-team",
    label: "Über uns – Bild im Abschnitt „Wie ich arbeite“",
    group: "Über uns",
    hint: "Querformat, gern eine Montage-Situation.",
    src: "/bilder/referenz-module-nah.webp",
    alt: "Nahaufnahme sauber verlegter Photovoltaikmodule",
    aspect: "4/3",
  },

  // ── Referenzen ─────────────────────────────────────────────────────────────
  {
    id: "ref-1",
    label: "Referenz 1",
    group: "Referenzen",
    hint: "Querformat.",
    src: "/bilder/referenz-drohne-anthrazit.webp",
    alt: "Vollflächig belegtes Satteldach in Anthrazit",
    aspect: "4/3",
  },
  {
    id: "ref-2",
    label: "Referenz 2",
    group: "Referenzen",
    hint: "Hochformat wirkt hier am besten.",
    src: "/bilder/referenz-mehrfamilienhaus.webp",
    alt: "Mehrfamilienhaus mit Photovoltaikanlage auf dem Satteldach",
    aspect: "3/4",
  },
  {
    id: "ref-3",
    label: "Referenz 3",
    group: "Referenzen",
    hint: "Querformat.",
    src: "/bilder/referenz-ziegeldach.webp",
    alt: "Einfamilienhaus mit Ziegeldach und zwei Modulfeldern",
    aspect: "4/3",
  },
  {
    id: "ref-4",
    label: "Referenz 4",
    group: "Referenzen",
    hint: "Querformat.",
    src: "/bilder/referenz-drohne-walmdach.webp",
    alt: "Satteldach mit Photovoltaikmodulen auf mehreren Teilflächen",
    aspect: "4/3",
  },
  {
    id: "ref-5",
    label: "Referenz 5",
    group: "Referenzen",
    hint: "Querformat.",
    src: "/bilder/referenz-flachdach.webp",
    alt: "Aufgeständerte Module auf einem Flachdach",
    aspect: "4/3",
  },
  {
    id: "ref-6",
    label: "Referenz 6",
    group: "Referenzen",
    hint: "Hochformat wirkt hier am besten.",
    src: "/bilder/referenz-speicher-turm.webp",
    alt: "Modularer Stromspeicher in einem Hauswirtschaftsraum",
    aspect: "3/4",
  },
  {
    id: "ref-7",
    label: "Referenz 7",
    group: "Referenzen",
    hint: "Querformat.",
    src: "/bilder/referenz-nebengebaeude.webp",
    alt: "Nebengebäude mit zwei Modulfeldern aus der Luft",
    aspect: "4/3",
  },
  {
    id: "ref-8",
    label: "Referenz 8",
    group: "Referenzen",
    hint: "Querformat.",
    src: "/bilder/referenz-zaehlerschrank.webp",
    alt: "Neu gesetzter Zählerschrank mit Wechselrichter",
    aspect: "4/3",
  },
  {
    id: "ref-9",
    label: "Referenz 9",
    group: "Referenzen",
    hint: "Querformat.",
    src: "/bilder/referenz-drohne-wintergarten.webp",
    alt: "Wohnhaus mit Wintergarten und Photovoltaikanlage",
    aspect: "4/3",
  },
  {
    id: "ref-10",
    label: "Referenz 10 – Wärmepumpe",
    group: "Referenzen",
    hint: "Hochformat wirkt hier am besten.",
    src: "/bilder/referenz-waermepumpe.webp",
    alt: "Bosch-Wärmepumpe mit Pufferspeicher und gedämmter Verrohrung im Technikraum",
    aspect: "3/4",
  },
  {
    id: "ref-11",
    label: "Referenz 11 – Wärmepumpe (Technik)",
    group: "Referenzen",
    hint: "Querformat.",
    src: "/bilder/referenz-waermepumpe-technik.webp",
    alt: "Bedieneinheit einer Wärmepumpe, daneben Pufferspeicher und Hydraulikgruppe",
    aspect: "4/3",
  },

  // ── Kontakt ────────────────────────────────────────────────────────────────
  {
    id: "kontakt-bild",
    label: "Kontakt – Bild neben dem Formular",
    group: "Kontakt",
    hint: "Hochformat.",
    src: "/bilder/referenz-speicher-doppel.webp",
    alt: "Installierte Speichertechnik von Sunna Photovoltaik",
    aspect: "3/4",
  },
];

export const slotById = new Map(imageSlots.map((s) => [s.id, s]));

export const slotGroups = [...new Set(imageSlots.map((s) => s.group))];
