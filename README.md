# Sunna Photovoltaik – Website

Next.js 15 (App Router, TypeScript, Tailwind v4). Fünf öffentliche Seiten, ein
Admin-Bereich zum Austauschen der Bilder und eine serverseitige Anbindung an die
Google-Bewertungen.

---

## Schnellstart

```bash
npm install
cp .env.example .env
npm run hash-password -- 'EinSicheresPasswortFuerKerstin'   # Ausgabe in .env eintragen
npm run dev                                                  # http://localhost:3000
```

Ohne `BLOB_READ_WRITE_TOKEN` speichert die App hochgeladene Bilder lokal unter
`public/uploads` und das Manifest unter `.data/manifest.json` – der Admin-Bereich
ist damit vollständig testbar, ohne dass irgendetwas in der Cloud liegt.
Achtung: Dieser Fallback funktioniert **nur lokal**. Auf Vercel ist das
Dateisystem zur Laufzeit schreibgeschützt; fehlt dort der Blob Store, bricht der
Upload mit einer entsprechenden Klartextmeldung ab.

---

## Was wo liegt

| Pfad | Zweck |
| --- | --- |
| `src/lib/site.ts` | **Stammdaten** – Adresse, Telefon, Öffnungszeiten, Kennzahlen. Nur hier ändern. |
| `src/lib/slots.ts` | **Bild-Register.** Jeder austauschbare Bildplatz. Neuer Eintrag = neues Feld im Admin. |
| `src/lib/images.ts` | Speicherung der Uploads (Vercel Blob bzw. lokaler Fallback). |
| `src/lib/reviews.ts` | Google Places API. |
| `src/lib/auth.ts` | Admin-Login (bcrypt + JWT-Cookie). |
| `src/app/(site)/` | Die öffentlichen Seiten. |
| `src/app/admin/` | Admin-Oberfläche. |
| `public/bilder/` | Die Standardbilder (WebP, 1600px und 800px). |

Texte stehen bewusst direkt in den Seiten-Dateien und nicht in einem CMS – so
bleibt die redaktionelle Kontrolle bei dir, und Kerstin kann das Layout nicht
versehentlich zerschießen.

---

## Google-Bewertungen einrichten

1. In der [Google Cloud Console](https://console.cloud.google.com/) ein Projekt anlegen.
2. **Places API (New)** aktivieren und Abrechnung hinterlegen.
3. API-Key erstellen und einschränken auf: *Places API (New)*, Anwendungs­einschränkung „IP-Adressen“ (Vercel-Egress) oder „Keine“, wenn die Nutzung ohnehin gedeckelt ist.
4. Key als `GOOGLE_PLACES_API_KEY` eintragen, dann:

```bash
npm run find-place-id
```

Die ausgegebene `GOOGLE_PLACE_ID` in die `.env` übernehmen. Fertig.

**Bereits ermittelt (06.09.2026):** `GOOGLE_PLACE_ID=ChIJQ9HU891XpUcR6Bb7pyKZhKE`

**Zugangsdaten testen**, bevor sie nach Vercel wandern – ein Aufruf genügt:

```bash
source .env && curl -s \
  -H "X-Goog-Api-Key: $GOOGLE_PLACES_API_KEY" \
  -H "X-Goog-FieldMask: displayName,rating,userRatingCount" \
  "https://places.googleapis.com/v1/places/$GOOGLE_PLACE_ID?languageCode=de"
```

Erwartet wird JSON mit Name, Note und Anzahl der Bewertungen. Kommt stattdessen
`API_KEY_INVALID`, stimmt der Schlüssel nicht; bei `PERMISSION_DENIED` ist die
*Places API (New)* im Projekt nicht aktiviert oder der Schlüssel zu eng
eingeschränkt (die Anwendungseinschränkung muss auf „Keine" stehen).

**Grenzen, die man kennen muss:**

* Die API liefert **maximal 5 Rezensionen** pro Ort. Gesamtnote und Anzahl der
  Bewertungen sind dagegen vollständig. Die Bewertungsseite erklärt das den
  Besuchern offen, statt es zu kaschieren.
* Googles Nutzungsbedingungen **verbieten das dauerhafte Speichern** der
  Rezensionstexte. Deshalb gibt es hier keine Datenbank, sondern nur
  Next.js-Revalidierung alle 6 Stunden (≈ 4 API-Aufrufe pro Tag, damit sicher
  im kostenlosen Kontingent).
* Der Abruf läuft **rein serverseitig**. Im Browser der Besucher wird kein
  Google-Skript geladen – deshalb braucht die Seite keinen Cookie-Banner.
* Die Google-Note wird **absichtlich nicht** als eigenes `aggregateRating` per
  JSON-LD ausgezeichnet. Googles Richtlinien untersagen das für Bewertungen von
  Drittplattformen; ein Verstoß kann eine manuelle Maßnahme auslösen.

---

## Deployment auf Vercel

1. Repository nach GitHub pushen, in Vercel importieren.
2. Im Vercel-Projekt unter **Storage** einen **Blob Store** anlegen und verbinden.
   `BLOB_READ_WRITE_TOKEN` wird dann automatisch gesetzt.
3. Environment-Variablen aus `.env.example` in Vercel eintragen
   (`ADMIN_PASSWORD_HASH`, `AUTH_SECRET`, `GOOGLE_*`, `RESEND_*`, `NEXT_PUBLIC_SITE_URL`).
4. Domain `sunna-photovoltaik.de` verbinden und `www` auf die Apex-Domain
   weiterleiten (oder umgekehrt – aber nur eine Variante indexieren lassen).

### Kontaktformular

Für den E-Mail-Versand wird [Resend](https://resend.com) genutzt (kostenloses
Kontingent reicht hier locker).

* **Empfänger** ist `info@sunna-photovoltaik.de` aus `src/lib/site.ts`.
  `CONTACT_TO_EMAIL` überschreibt das nur, wenn es bewusst gesetzt wird
  (z. B. ein Testpostfach); leer bedeutet: Adresse aus `site.ts`.
* **Absender** ist `website@sunna-photovoltaik.de` (überschreibbar via
  `CONTACT_FROM_EMAIL`). Das ist bewusst *nicht* die Adresse des Besuchers –
  im fremden Namen zu senden scheitert an SPF/DKIM/DMARC. Kerstin kann trotzdem
  direkt antworten, weil `replyTo` auf den Absender zeigt.
* Die Absenderdomain muss in Resend verifiziert werden, sonst landen Mails im
  Spam oder werden gar nicht zugestellt.
* Ohne `RESEND_API_KEY` zeigt das Formular ehrlich an, dass es noch nicht scharf
  ist, und verweist auf Telefon und E-Mail – es tut nicht so, als sei die
  Nachricht angekommen. Die Anfrage steht dann im Server-Log.

---

## Vor dem Livegang unbedingt erledigen

Erledigt (06.09.): Porträt von Kerstin liegt als Standardbild im Slot
`about-portrait`. Die geschätzten Referenz-Ortsangaben sind entfernt.
Der Datenschutz nennt Hoster (Vercel) und Mailversand (Resend) namentlich.

- [ ] `npm install && npm run build` einmal lokal durchlaufen lassen.
      Der Build ist bislang **nie** ausgeführt worden.
- [ ] **Impressum:** Handwerkskammer und Berufsbezeichnung ergänzen, dazu den
      Link auf die EU-OS-Plattform (`src/app/(site)/impressum/page.tsx`, Details
      im Kommentar oben in der Datei). Die Wirtschafts-Identifikationsnummer nach
      § 139c AO ist seit 06.09. eingetragen und erfüllt § 5 Abs. 1 Nr. 6 DDG –
      eine USt-IdNr. gibt es nicht und wird auch nicht gebraucht.
- [ ] **Auftragsverarbeitungsverträge abschließen**, bevor die
      Datenschutzerklärung online geht: Vercel (Dashboard → Settings → Legal)
      und Resend (resend.com/legal). Der Text behauptet, dass sie bestehen.
- [ ] Beide Rechtstexte anwaltlich oder über die IHK prüfen lassen.
- [ ] **Resend:** Domain `sunna-photovoltaik.de` verifizieren (DNS-Records für
      SPF und DKIM setzen), API-Key erzeugen, `RESEND_API_KEY` in Vercel
      eintragen. Erst danach kommen Formularanfragen bei Kerstin an.
- [ ] **Vercel Blob Store** anlegen und verbinden – ohne ihn schlägt jeder
      Bild-Upload im Admin fehl (das Dateisystem ist in der Cloud
      schreibgeschützt; die App meldet das jetzt im Klartext).
- [ ] `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` setzen, sonst zeigt die
      Bewertungsseite nur den Hinweis „noch nicht eingerichtet“.
- [ ] `AUTH_SECRET` und Admin-Passwort in einem Passwortmanager hinterlegen.
- [ ] Nach jeder Code-Änderung: `sunna-vorschau.html` von Hand nachziehen –
      die Vorschau ist eine Kopie, kein Build.

## Admin-Passwort

```bash
npm run hash-password -- 'EinePassphrase'
```

Gibt zwei Zeilen aus, die unverändert in die `.env` gehören – ohne
Anführungszeichen, ohne Leerzeichen hinter dem `=`. Danach den Dev-Server
**neu starten**; Umgebungsvariablen liest Node nur beim Prozessstart.

**Warum der Hash Base64-kodiert ist:** Ein bcrypt-Hash beginnt mit `$2a$12$…`.
Next.js schickt alle `.env`-Werte durch `dotenv-expand`, das `$2a` und `$12` als
Verweise auf Umgebungsvariablen liest und durch nichts ersetzt – der Hash käme
leer in der App an, und der Login meldete „nicht eingerichtet", obwohl in der
`.env` alles richtig steht. Anführungszeichen helfen dagegen nicht.
Backslash-Escaping (`\$2a\$12\$…`) würde funktionieren, müsste in Vercel aber
wieder entfernt werden – dort gibt es kein `dotenv-expand`. Diese Asymmetrie ist
eine Falle; Base64 vermeidet sie, weil der Wert überall identisch ist.
`src/lib/auth.ts` dekodiert ihn und akzeptiert zur Sicherheit auch einen roh
eingetragenen Hash.

**Prüfen, was die App tatsächlich sieht:**

```bash
node -e "const {loadEnvConfig}=require('@next/env');loadEnvConfig(process.cwd());\
const h=process.env.ADMIN_PASSWORD_HASH||'';\
console.log('HASH:',h.length,'Zeichen |','SECRET:',(process.env.AUTH_SECRET||'').length,'Zeichen')"
```

Zeigt `HASH: 0 Zeichen`, ist der Wert unterwegs verlorengegangen.

---

## Nützliche Befehle

```bash
npm run dev             # Entwicklungsserver
npm run build           # Produktionsbuild (prüft auch die Typen)
npm run start           # Produktionsserver lokal
npm run hash-password -- 'Passwort'
npm run find-place-id
```
