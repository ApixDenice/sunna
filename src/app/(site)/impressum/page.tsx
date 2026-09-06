import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung von ${site.legalName}.`,
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: false },
};

/*
 * Grundlage: der bestehende Auftritt sunna-photovoltaik.de/impressum, 1:1
 * übernommen (bewusste Entscheidung von Dennis), plus die von ihm am 06.09.
 * nachgelieferte Wirtschafts-Identifikationsnummer.
 *
 * ERLEDIGT:
 *   • § 5 Abs. 1 Nr. 6 DDG – die Norm verlangt „die Umsatzsteueridentifikations-
 *     nummer nach § 27a UStG ODER eine Wirtschafts-Identifikationsnummer nach
 *     § 139c AO, soweit vorhanden". Eine USt-IdNr. existiert nicht, die W-IdNr.
 *     steht hier. Damit ist die Pflichtangabe erfüllt.
 *
 * NOCH OFFEN vor dem Livegang:
 *   • § 5 Abs. 1 Nr. 5 DDG: zuständige Handwerkskammer + Berufsbezeichnung
 *     (bei Elektro-/PV-Handwerk Pflichtangabe, weil zulassungspflichtiges
 *     Handwerk nach Anlage A HwO). Für Lengede wäre das voraussichtlich die
 *     Handwerkskammer Braunschweig-Lüneburg-Stade – bei Kerstin bestätigen
 *     lassen, nicht raten.
 *   • Art. 14 ODR-VO: Link auf die OS-Plattform der EU-Kommission.
 */

export default function ImpressumPage() {
  return (
    <article className="wrap max-w-2xl py-16 md:py-24">
      <h1 className="display text-[clamp(2.2rem,5.5vw,3.25rem)] text-plum-900">Impressum</h1>

      <div className="mt-12 space-y-10 leading-relaxed text-ink-muted">
        <section>
          <h2 className="display-tight mb-3 text-[1.25rem] text-plum-900">Angaben gemäß § 5 DDG</h2>
          <address className="not-italic">
            {site.owner}
            <br />
            {site.address.street}
            <br />
            {site.address.zip} {site.address.city}
          </address>
        </section>

        <section>
          <h2 className="display-tight mb-3 text-[1.25rem] text-plum-900">Vertreten durch</h2>
          <p>{site.owner}</p>
        </section>

        <section>
          <h2 className="display-tight mb-3 text-[1.25rem] text-plum-900">Kontakt</h2>
          <p>
            Telefon:{" "}
            <a href={site.phone.href} className="link-underline text-plum-800">
              {site.phone.display}
            </a>
            <br />
            E-Mail:{" "}
            <a href={`mailto:${site.email}`} className="link-underline text-plum-800">
              {site.email}
            </a>
          </p>
        </section>

        <section>
          <h2 className="display-tight mb-3 text-[1.25rem] text-plum-900">
            Wirtschafts-Identifikationsnummer
          </h2>
          <p>
            Wirtschafts-Identifikationsnummer gemäß § 139c der Abgabenordnung:
            <br />
            {site.wIdNr}
          </p>
        </section>

        <section>
          <h2 className="display-tight mb-3 text-[1.25rem] text-plum-900">Haftungsausschluss</h2>

          <h3 className="mb-2 mt-6 font-semibold text-plum-800">Haftung für Inhalte</h3>
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine
            diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
            Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden
            wir diese Inhalte umgehend entfernen.
          </p>

          <h3 className="mb-2 mt-6 font-semibold text-plum-800">Datenschutz</h3>
          <p>
            Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten
            möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift
            oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf
            freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte
            weitergegeben.
          </p>
          <p className="mt-4">
            Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation
            per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem
            Zugriff durch Dritte ist nicht möglich.
          </p>
          <p className="mt-4">
            Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch
            Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und
            Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten
            behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von
            Werbeinformationen, etwa durch Spam-Mails, vor.
          </p>
        </section>

        <section>
          <h2 className="display-tight mb-3 text-[1.25rem] text-plum-900">Bildnachweise</h2>
          <p>
            Sofern nicht anders angegeben, stammen alle Fotos aus eigenen Projekten von{" "}
            {site.legalName}.
          </p>
        </section>
      </div>
    </article>
  );
}
