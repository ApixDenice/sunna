import Link from "next/link";
import type { Metadata } from "next";
import ManagedImage from "@/components/ManagedImage";
import Reveal from "@/components/Reveal";
import SunArc from "@/components/SunArc";
import { site } from "@/lib/site";

/**
 * Selbstheilung statt blindes Vertrauen in den Cache.
 *
 * Diese Seite zeigt Bilder und Texte, die Kerstin im Admin ändert. Nach jeder
 * Änderung ruft die API `revalidatePath("/", "layout")` – die Seite wird also
 * sofort neu erzeugt. Ohne dieses `revalidate` wäre sie aber eine rein
 * statische Seite, die AUSSCHLIESSLICH an diesem einen Aufruf hängt: Geht der
 * Purge verloren, bleibt der alte Stand für immer stehen, und Kerstin hält
 * ihre gespeicherte Änderung für verschluckt.
 *
 * Mit `revalidate` wird die Seite spätestens nach dieser Zeit ohnehin neu
 * gebaut. Sofort-Aktualisierung bleibt der Normalfall, 60 Sekunden sind die
 * Obergrenze im Fehlerfall.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Über uns – Kerstin Klaiber",
  description:
    "Kerstin Klaiber führt Sunna Photovoltaik gemeinsam mit ihrer Familie in Lengede: Photovoltaik, Stromspeicher, Wallbox und Wärmepumpe. Keine Verkaufskolonne, sondern persönliche, ehrliche und empathische Beratung.",
  alternates: { canonical: "/ueber-uns" },
};

const bloecke = [
  {
    title: "Wer ich bin",
    text: "Ich bin Kerstin und führe ein Unternehmen für Photovoltaik. Mich reizt die Mischung aus präziser Planung, solider Haustechnik und ehrlicher Beratung. Mein Anspruch: Lösungen, die wirklich zu Haus und Dach passen – nicht von der Stange.",
  },
  {
    title: "Was ich tue",
    text: "Ich biete maßgeschneiderte Photovoltaikanlagen – von der ersten, kostenlosen Beratung bis zur fertigen Inbetriebnahme. Mein Team und ich haben bereits über 1.000 Anlagen realisiert. Wir kennen uns in der Haustechnik inklusive Zählerschrank aus, montieren Stromspeicher und Wallboxen und lösen auf Wunsch auch die alte Heizung durch eine Wärmepumpe ab. Dazu bringen wir die nötigen Dachkenntnisse mit, um Anlagen sicher und langlebig zu montieren.",
  },
  {
    title: "Wie ich arbeite",
    text: "Ich plane in der Regel innerhalb von 14 Tagen und setze Projekte dank Erfahrung und eingespielter Abläufe meist in 1–2 Tagen um. Ich arbeite 24/7 serviceorientiert, koordiniere die Baubetreuung und erledige alle erforderlichen Meldungen und Anmeldungen. Verbaut werden nur hochwertige, bifaziale Glas-Glas-Module und Komponenten mit patentierter Technologie. Auf die Technik gibt es 10 Jahre Garantie, auf die Modulleistung 25 Jahre.",
  },
  {
    title: "Was mir wichtig ist",
    text: "Ich möchte, dass meine Kundinnen und Kunden die Sonne überall einfangen können – effizient, ästhetisch und wirtschaftlich. Qualität vor Quantität, klare Preise und Leistungen, und ein Rundum-sorglos-Paket, das wirklich entlastet.",
  },
];

export default function UeberUnsPage() {
  return (
    <>
      {/* ══ Kopf ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
        <SunArc className="pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] opacity-[0.1]" rings={8} />

        <div className="wrap relative">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Über uns</p>
            <h1 className="display mt-6 text-[clamp(2.4rem,6.5vw,4rem)] text-plum-900 balance">
              Das bin ich – Kerstin
            </h1>
            <p className="lede mt-7 max-w-2xl pretty">
              Ich bin Kerstin und führe gemeinsam mit meiner Familie ein Photovoltaikunternehmen
              in Lengede.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ Porträt + Erzähltext ══════════════════════════════════════════════ */}
      <section className="pb-24 md:pb-32">
        <div className="wrap">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <div className="frame-offset aspect-[3/4] w-full">
                <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-card)] bg-sand">
                  <ManagedImage
                    slot="about-portrait"
                    priority
                    sizes="(min-width: 1024px) 40vw, 92vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-8 rounded-2xl border border-[var(--edge)] bg-sand/70 p-6">
                <p className="text-sm leading-relaxed text-ink-muted">
                  Lieber direkt sprechen? Ich gehe selbst ans Telefon.
                </p>
                <a
                  href={site.phone.href}
                  className="display-tight mt-2 block text-[1.4rem] text-plum-900 transition hover:text-magenta-600"
                >
                  {site.phone.display}
                </a>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="display-tight text-[clamp(1.4rem,2.6vw,1.9rem)] text-plum-900 pretty">
                  Bei uns gibt es keine Verkaufskolonne, sondern persönliche, ehrliche und
                  empathische Beratung.
                </p>
                <p className="mt-6 leading-relaxed text-ink-muted pretty">
                  Ich möchte verstehen, was Sie brauchen – und Lösungen planen, die wirklich zu
                  Ihnen und Ihrem Zuhause passen.
                </p>
                <p className="mt-5 leading-relaxed text-ink-muted pretty">
                  Mit über <strong className="font-semibold text-plum-800">40 Jahren Elektro- und
                  Haustechnik-Erfahrung</strong> meines Partners, dem technischen Know-how meiner
                  Tochter als Ingenieurin und meiner Erfahrung in Kundenbetreuung und
                  Unternehmensführung verbinden wir Kompetenz mit persönlicher Betreuung.
                </p>
                <p className="mt-5 leading-relaxed text-ink-muted pretty">
                  Ich bin technikbegeistert, naturverbunden und überzeugt von der Energiewende.
                  Meine Kunden begleite ich persönlich –{" "}
                  <strong className="font-semibold text-plum-800">
                    von der ersten Beratung weit über die Installation hinaus.
                  </strong>
                </p>
              </Reveal>

              <Reveal delay={80} className="my-12 border-y border-[var(--edge)] py-9">
                <p className="display text-[clamp(1.4rem,3vw,2rem)] text-plum-900 balance">
                  „Wir bauen Anlagen, die wir uns selbst wünschen – und geben dafür jeden Tag
                  unser Bestes.“
                </p>
              </Reveal>

              <dl className="space-y-10">
                {bloecke.map((b, i) => (
                  <Reveal key={b.title} delay={i * 60}>
                    <dt className="display-tight flex items-baseline gap-3 text-[1.35rem] text-plum-900">
                      <span className="h-px w-6 shrink-0 translate-y-[-0.3em] bg-magenta-500" aria-hidden />
                      {b.title}
                    </dt>
                    <dd className="mt-3 pl-9 leading-relaxed text-ink-muted pretty">{b.text}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Arbeitsweise-Band ═════════════════════════════════════════════════ */}
      <section className="surface-dark grain relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative order-2 aspect-[4/3] lg:order-1 lg:aspect-auto lg:min-h-[32rem]">
            <ManagedImage slot="about-team" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="order-1 flex items-center px-6 py-20 md:px-14 lg:order-2 lg:py-28">
            <Reveal className="max-w-lg">
              <p className="eyebrow eyebrow-light">Unser Versprechen</p>
              <h2 className="display-tight mt-6 text-[clamp(1.7rem,3.4vw,2.4rem)] text-paper balance">
                Ich fange überall die Sonne ein – zuverlässig, sauber, fair.
              </h2>
              <ul className="mt-9 space-y-4">
                {[
                  "Kostenlose, verständliche Erstberatung",
                  "Planung in der Regel innerhalb von 14 Tagen",
                  "Montage meist in 1–2 Tagen",
                  "Bifaziale Glas-Glas-Module, 25 Jahre Leistungsgarantie",
                  "Auf Wunsch: Wärmepumpe statt alter Heizung",
                  "Alle Meldungen und Anmeldungen übernehmen wir",
                  "24/7 erreichbar, wenn es dringend ist",
                ].map((p) => (
                  <li key={p} className="flex gap-3.5 text-paper/75">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-magenta-500" aria-hidden />
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
              <Link href="/kontakt" className="btn btn-on-dark mt-10">
                Jetzt kennenlernen
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ Weiterführung ═════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="wrap grid gap-6 sm:grid-cols-2">
          {[
            { href: "/referenzen", t: "Referenzen", d: "Anlagen, die wir gebaut haben – vom Ziegeldach bis zum Flachdach." },
            { href: "/bewertungen", t: "Bewertungen", d: "Was Kundinnen und Kunden bei Google über uns schreiben." },
          ].map((c, i) => (
            <Reveal key={c.href} delay={i * 70}>
              <Link
                href={c.href}
                className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-[var(--edge)] bg-sand/60 p-8 transition hover:border-magenta-500/50 hover:bg-sand"
              >
                <div>
                  <h2 className="display-tight text-[1.5rem] text-plum-900">{c.t}</h2>
                  <p className="mt-3 leading-relaxed text-ink-muted pretty">{c.d}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-magenta-600">
                  Ansehen
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
