/**
 * Zentrale Stammdaten. Nur hier ändern – alle Seiten, das Impressum,
 * die strukturierten Daten und der Footer lesen von hier.
 */
export const site = {
  name: "Sunna Photovoltaik",
  legalName: "Sunna Photovoltaik Inh. Kerstin Klaiber",
  owner: "Kerstin Klaiber",
  claim: "Ich fange überall die Sonne ein – zuverlässig, sauber, fair.",
  description:
    "Photovoltaik aus Lengede: persönliche Beratung, maßgeschneiderte Planung in 14 Tagen und saubere Montage in 1–2 Tagen. Über 1.000 realisierte Anlagen – dazu Stromspeicher, Wallbox und Wärmepumpe.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sunna-photovoltaik.de",

  address: {
    street: "Am Sommerfeld 10",
    zip: "38268",
    city: "Lengede",
    district: "Barbecke",
    country: "DE",
    full: "Am Sommerfeld 10, 38268 Lengede OT Barbecke",
  },

  phone: { display: "0163 – 510 67 51", href: "tel:+491635106751" },
  email: "info@sunna-photovoltaik.de",

  /**
   * Wirtschafts-Identifikationsnummer nach § 139c AO.
   * § 5 Abs. 1 Nr. 6 DDG verlangt „die Umsatzsteueridentifikationsnummer nach
   * § 27a UStG ODER eine Wirtschafts-Identifikationsnummer nach § 139c AO,
   * soweit vorhanden" – die W-IdNr. erfüllt die Pflichtangabe also vollwertig.
   * Eine USt-IdNr. gibt es nicht.
   */
  wIdNr: "DE452885839",

  hours: [
    { days: "Montag – Samstag", time: "09:00 – 17:00 Uhr" },
    { days: "Sonntag", time: "geschlossen" },
  ],
  hoursNote: "In dringenden Fällen bin ich 24/7 für Sie erreichbar.",

  social: {
    instagram: "https://www.instagram.com/sunna.photovoltaik/",
    facebook: "https://www.facebook.com/p/Sunna-Photovoltaik-61566494646049/",
  },

  /** Wird für den „Auf Google ansehen“-Button genutzt, falls die API keine URI liefert. */
  googleMapsSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=Sunna+Photovoltaik+Am+Sommerfeld+10+38268+Lengede",

  /**
   * Einsatzgebiet – alphabetisch nach DIN 5007-1 (Umlaute sortieren wie der
   * Grundvokal, deshalb steht Goslar vor Göttingen). Wird auf der Referenzen-
   * seite, im Footer und in den strukturierten Daten (areaServed) verwendet.
   * Die Kartenpunkte dazu liegen in components/RegionMap.tsx; wer hier einen
   * Ort ergänzt, ergänzt ihn auch dort.
   */
  serviceArea: [
    "Braunschweig",
    "Gifhorn",
    "Goslar",
    "Göttingen",
    "Hannover",
    "Hildesheim",
    "Peine",
    "Salzgitter",
    "Wolfenbüttel",
    "Wolfsburg",
  ],

  /** Kennzahlen aus Kerstins „Über mich“ – an einer Stelle gepflegt. */
  facts: [
    { value: "1.000+", label: "realisierte Anlagen" },
    { value: "40", label: "Jahre Elektro- & Haustechnik im Team" },
    { value: "14", label: "Tage bis zur fertigen Planung" },
    { value: "25", label: "Jahre Garantie auf die Modulleistung" },
  ],
} as const;

export const nav = [
  { href: "/", label: "Start" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/referenzen", label: "Referenzen" },
  { href: "/bewertungen", label: "Bewertungen" },
  { href: "/kontakt", label: "Kontakt" },
] as const;
