/**
 * Ermittelt einmalig die Google Place ID des Unternehmens.
 * Voraussetzung: GOOGLE_PLACES_API_KEY ist in der .env gesetzt und
 * die "Places API (New)" ist im Google-Cloud-Projekt aktiviert.
 *
 * Aufruf:  npm run find-place-id
 */
import { readFileSync } from "node:fs";

// Minimaler .env-Leser, damit kein zusätzliches Paket nötig ist.
try {
  for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
} catch {
  /* keine .env vorhanden – dann müssen die Variablen extern gesetzt sein */
}

const key = process.env.GOOGLE_PLACES_API_KEY;
if (!key) {
  console.error("GOOGLE_PLACES_API_KEY fehlt (in .env eintragen).");
  process.exit(1);
}

const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": key,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount",
  },
  body: JSON.stringify({
    textQuery: "Sunna Photovoltaik Am Sommerfeld 10 38268 Lengede Barbecke",
    languageCode: "de",
    regionCode: "DE",
  }),
});

if (!res.ok) {
  console.error(`Fehler ${res.status}:`, await res.text());
  process.exit(1);
}

const { places = [] } = await res.json();
if (!places.length) {
  console.error("Kein Treffer. Suchbegriff im Skript anpassen.");
  process.exit(1);
}

console.log("\nGefundene Einträge:\n");
for (const p of places) {
  console.log(`  ${p.displayName?.text}`);
  console.log(`    ${p.formattedAddress}`);
  console.log(`    Bewertung: ${p.rating ?? "—"} (${p.userRatingCount ?? 0})`);
  console.log(`    GOOGLE_PLACE_ID=${p.id}\n`);
}
