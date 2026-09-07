import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Informationen zur Verarbeitung personenbezogener Daten auf der Website von ${site.legalName}.`,
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: false },
};

/*
 * ACHTUNG – vor dem Livegang prüfen:
 * Diese Erklärung beschreibt korrekt, was diese Website technisch tut
 * (kein Tracking, keine Cookies außer der Admin-Session, keine externen
 * Schriften, keine Kartendienst-Einbettung).
 *
 * Es gibt nur noch EINEN Auftragsverarbeiter: den Hoster Vercel. Der frühere
 * Mailversand über Resend ist entfallen – das Kontaktformular übergibt die
 * Anfrage jetzt an das E-Mail-Programm des Besuchers, es erreicht unseren
 * Server also gar keine Formulardaten mehr (siehe kontakt/ContactForm.tsx).
 *
 * VORAUSSETZUNG, die noch erfüllt werden muss:
 *   • Auftragsverarbeitungsvertrag (AVV/DPA) mit Vercel abschließen
 *     – im Vercel-Dashboard unter Settings → Legal.
 * Der Text oben behauptet, dass dieser Vertrag besteht. Ohne Abschluss wäre
 * das eine unwahre Angabe – also erst abschließen, dann live gehen.
 * Rechtliche Prüfung durch eine Anwältin/einen Anwalt wird weiterhin empfohlen.
 */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="display-tight mb-3 text-[1.25rem] text-plum-900">{title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
);

export default function DatenschutzPage() {
  return (
    <article className="wrap max-w-2xl py-16 md:py-24">
      <h1 className="display text-[clamp(2.2rem,5.5vw,3.25rem)] text-plum-900">
        Datenschutzerklärung
      </h1>

      <div className="mt-12 space-y-10 leading-relaxed text-ink-muted">
        <Section title="1. Verantwortliche Stelle">
          <address className="not-italic">
            {site.legalName}
            <br />
            {site.address.street}, {site.address.zip} {site.address.city} OT {site.address.district}
            <br />
            Telefon:{" "}
            <a href={site.phone.href} className="link-underline text-plum-800">
              {site.phone.display}
            </a>
            <br />
            E-Mail:{" "}
            <a href={`mailto:${site.email}`} className="link-underline text-plum-800">
              {site.email}
            </a>
          </address>
        </Section>

        <Section title="2. Grundsätzliches zu dieser Website">
          <p>
            Diese Website verzichtet bewusst auf Analyse- und Trackingdienste, auf
            Werbe-Netzwerke und auf Social-Media-Plug-ins. Es werden keine Cookies zu
            Analyse- oder Marketingzwecken gesetzt. Aus diesem Grund gibt es hier auch keinen
            Cookie-Banner.
          </p>
          <p>
            Schriftarten werden vom eigenen Server ausgeliefert. Beim Aufruf der Seiten wird
            keine Verbindung zu Google Fonts oder anderen Drittanbieter-CDNs hergestellt.
          </p>
        </Section>

        <Section title="3. Server-Logfiles">
          <p>
            Der Hosting-Anbieter erhebt und speichert automatisch Informationen in
            Server-Logfiles, die Ihr Browser übermittelt: Browsertyp und -version, verwendetes
            Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der
            Serveranfrage und IP-Adresse. Diese Daten werden nicht mit anderen Datenquellen
            zusammengeführt.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren
            und störungsfreien Betrieb der Website).
          </p>
          <p>
            Hosting-Anbieter ist die Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723,
            USA. Mit Vercel besteht ein Auftragsverarbeitungsvertrag; die Übermittlung in die USA
            wird auf die EU-Standardvertragsklauseln gestützt. Die Auslieferung dieser Website
            erfolgt über Vercels Rechenzentren in der Europäischen Union.
          </p>
        </Section>

        <Section title="4. Kontaktformular und Kontaktaufnahme">
          <p>
            Wenn Sie das Formular auf der{" "}
            <Link href="/kontakt" className="link-underline text-plum-800">
              Kontaktseite
            </Link>{" "}
            ausfüllen, werden Ihre Angaben <strong>nicht an diese Website übertragen</strong>.
            Sie bleiben in Ihrem Browser; beim Absenden wird daraus lediglich eine vorbereitete
            E-Mail zusammengestellt und an Ihr eigenes E-Mail-Programm übergeben. Ob und wann Sie
            diese Nachricht abschicken, entscheiden allein Sie. Bis dahin findet keine
            Verarbeitung durch uns und keine Weitergabe an Dritte statt.
          </p>
          <p>
            Schicken Sie die E-Mail ab, erreicht sie unser Postfach auf demselben Weg wie jede
            andere E-Mail an uns. Die darin enthaltenen Daten (Name, E-Mail-Adresse,
            gegebenenfalls Telefonnummer und Ort sowie Ihre Nachricht) verarbeiten wir
            ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1
            lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen) bzw. Art. 6 Abs. 1 lit. f
            DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
          </p>
          <p>
            Die Daten verbleiben bei uns, bis Ihre Anfrage abschließend bearbeitet ist und keine
            gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
        </Section>

        <Section title="5. Google-Bewertungen">
          <p>
            Auf der{" "}
            <Link href="/bewertungen" className="link-underline text-plum-800">
              Bewertungsseite
            </Link>{" "}
            zeigen wir die Gesamtnote und aktuelle Rezensionen aus unserem
            Google-Unternehmensprofil an.
          </p>
          <p>
            Diese Daten werden ausschließlich <strong>von unserem Server</strong> über die Google
            Places API abgerufen und anschließend als reiner Text auf unserer Seite dargestellt.
            Ihr Browser baut dabei <strong>keine Verbindung zu Google auf</strong>; es wird kein
            Google-Skript geladen, kein Cookie gesetzt und keine IP-Adresse an Google übertragen.
            Erst wenn Sie aktiv auf einen Link zu Google Maps oder zu einem Rezensenten-Profil
            klicken, verlassen Sie unsere Website und es gelten die Datenschutzbestimmungen von
            Google.
          </p>
          <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Darstellung von Kundenfeedback).</p>
        </Section>

        <Section title="6. Kartendienst">
          <p>
            Wir binden keine Karte direkt in die Website ein. Auf der Kontaktseite finden Sie
            lediglich einen Link zu Google Maps. Erst durch Ihren Klick auf diesen Link werden
            Daten an Google übertragen.
          </p>
        </Section>

        <Section title="7. Administrationsbereich">
          <p>
            Der passwortgeschützte Bereich unter <code>/admin</code> dient ausschließlich der
            Pflege der auf der Website gezeigten Bilder. Nach der Anmeldung wird ein technisch
            notwendiges Sitzungs-Cookie gesetzt, das ausschließlich der Authentifizierung dient
            und nach spätestens acht Stunden abläuft. Für Besucherinnen und Besucher der Website
            hat dieser Bereich keine Bedeutung.
          </p>
        </Section>

        <Section title="8. Ihre Rechte">
          <p>
            Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
            (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung
            (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch
            (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die
            Zukunft widerrufen.
          </p>
          <p>
            Wenden Sie sich dazu formlos an{" "}
            <a href={`mailto:${site.email}`} className="link-underline text-plum-800">
              {site.email}
            </a>
            .
          </p>
          <p>
            Ihnen steht außerdem ein Beschwerderecht bei einer Aufsichtsbehörde zu, in
            Niedersachsen bei der Landesbeauftragten für den Datenschutz Niedersachsen.
          </p>
        </Section>

        <Section title="9. SSL-/TLS-Verschlüsselung">
          <p>
            Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung. Eine
            verschlüsselte Verbindung erkennen Sie an <code>https://</code> in der Adresszeile
            Ihres Browsers.
          </p>
        </Section>

        <p className="border-t border-[var(--edge)] pt-8 text-sm">
          Stand dieser Datenschutzerklärung: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
        </p>
      </div>
    </article>
  );
}
