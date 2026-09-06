import Link from "next/link";
import type { Metadata } from "next";
import ManagedImage from "@/components/ManagedImage";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import SunArc from "@/components/SunArc";
import { site } from "@/lib/site";
import { getGoogleReviews, formatRating } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Photovoltaik aus Lengede – persönlich geplant von Kerstin Klaiber",
  description: site.description,
  alternates: { canonical: "/" },
};

const leistungen = [
  {
    slot: "home-leistung-anlage",
    kicker: "01",
    title: "Photovoltaikanlage",
    text: "Bifaziale Glas-Glas-Module mit patentierter Technologie, geplant für genau Ihr Dach – nicht nach Katalog. 10 Jahre Garantie auf die Technik, 25 Jahre auf die Modulleistung.",
    span: "lg:row-span-2",
  },
  {
    slot: "home-leistung-speicher",
    kicker: "02",
    title: "Stromspeicher",
    text: "Damit der Strom vom Mittag auch abends noch da ist. Passend dimensioniert auf Ihren echten Verbrauch statt auf die größte Rechnung.",
    span: "",
  },
  {
    slot: "home-leistung-wallbox",
    kicker: "03",
    title: "Wallbox, Wärmepumpe & Haustechnik",
    text: "Zählerschrank, Ladepunkt, Wärmepumpe als Ablösung der alten Heizung, Anmeldungen beim Netzbetreiber: Wir kennen die Haustechnik und erledigen alle Meldungen für Sie.",
    span: "",
  },
];

const ablauf = [
  {
    n: "01",
    title: "Kostenloses Kennenlernen",
    text: "Wir schauen uns gemeinsam Dach, Verbrauch und Wünsche an. Ohne Verkaufsdruck, ohne Vertragsmappe auf dem Küchentisch.",
  },
  {
    n: "02",
    title: "Planung in 14 Tagen",
    text: "Sie bekommen ein Konzept mit klaren Preisen und klaren Leistungen. Was drinsteht, gilt.",
  },
  {
    n: "03",
    title: "Montage in 1–2 Tagen",
    text: "Eingespielte Abläufe, saubere Ausführung, Dachkenntnis inklusive. Danach ist die Baustelle wieder Ihr Zuhause.",
  },
  {
    n: "04",
    title: "Anmeldung & Betreuung",
    text: "Alle Meldungen übernehmen wir. Und danach bin ich weiterhin Ihre Ansprechpartnerin – nicht eine Hotline.",
  },
];

export default async function HomePage() {
  const { rating, total, status } = await getGoogleReviews();

  return (
    <>
      {/* ══ Hero ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-10 md:pb-28 md:pt-16">
        {/* Sonnenbogen als ruhiges Hintergrundmotiv statt beliebiger Farbverläufe */}
        <SunArc
          className="pointer-events-none absolute -right-24 -top-16 h-[34rem] w-[34rem] opacity-[0.13] md:-right-10 md:h-[46rem] md:w-[46rem]"
          rings={9}
        />

        <div className="wrap relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">Photovoltaik aus Lengede</p>
                <h1 className="display mt-6 text-[clamp(2.5rem,7.5vw,4.5rem)] text-plum-900 balance">
                  Ihre Anlage. Geplant von jemandem, der danach noch ans Telefon geht.
                </h1>
              </Reveal>

              <Reveal delay={90}>
                <p className="lede mt-7 max-w-xl pretty">
                  Bei Sunna gibt es keine Verkaufskolonne, sondern mich: <strong className="font-semibold text-plum-800">Kerstin Klaiber</strong>. Ich
                  plane Photovoltaikanlagen, die wirklich zu Ihrem Haus und Ihrem Dach passen –
                  und begleite Sie von der ersten Beratung weit über die Installation hinaus.
                </p>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Link href="/kontakt" className="btn btn-primary">
                    Kostenlose Beratung anfragen
                  </Link>
                  <Link href="/referenzen" className="btn btn-ghost">
                    Referenzen ansehen
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={230}>
                <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-[var(--edge)] pt-7">
                  {rating !== null && total !== null && status === "ok" ? (
                    <Link href="/bewertungen" className="group flex items-center gap-3">
                      <Stars value={rating} size={17} label={`${formatRating(rating)} von 5 Sternen bei Google`} />
                      <span className="text-sm text-ink-muted">
                        <strong className="font-semibold text-plum-800">{formatRating(rating)}</strong> bei Google
                        {" · "}
                        <span className="link-underline">{total} Bewertungen</span>
                      </span>
                    </Link>
                  ) : (
                    <Link href="/bewertungen" className="text-sm text-ink-muted link-underline">
                      Was Kundinnen und Kunden sagen
                    </Link>
                  )}

                  <p className="text-sm text-ink-muted">
                    <strong className="font-semibold text-plum-800">1.000+</strong> realisierte Anlagen
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Bild mit versetztem Rahmen + persönlicher Karte, die überlappt */}
            <Reveal delay={120} className="relative">
              <div className="frame-offset mx-auto aspect-[3/4] w-full max-w-[30rem]">
                <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-card)] bg-sand">
                  <ManagedImage
                    slot="home-hero"
                    priority
                    sizes="(min-width: 1024px) 40vw, 92vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="relative z-10 mx-auto -mt-12 w-[min(22rem,88%)] rounded-2xl border border-[var(--edge)] bg-paper/95 p-6 shadow-[0_20px_50px_-30px_rgba(36,7,51,0.55)] backdrop-blur-sm lg:absolute lg:-left-6 lg:bottom-10 lg:mt-0">
                <p className="display-tight text-[1.25rem] text-plum-900 pretty">
                  „Ich fange überall die Sonne ein – zuverlässig, sauber, fair.“
                </p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-ink-muted">
                    Kerstin Klaiber
                    <br />
                    <span className="text-xs">Inhaberin, Sunna Photovoltaik</span>
                  </p>
                  <a
                    href={site.phone.href}
                    className="shrink-0 rounded-full bg-plum-800 px-4 py-2 text-xs font-semibold text-paper transition hover:bg-magenta-500"
                  >
                    Anrufen
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ Kennzahlen ════════════════════════════════════════════════════════ */}
      <section className="border-y border-[var(--edge)] bg-sand/60" aria-label="Zahlen und Fakten">
        <div className="wrap grid grid-cols-2 divide-x divide-y divide-[var(--edge)] md:grid-cols-4 md:divide-y-0">
          {site.facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 70} className="px-2 py-9 first:border-l-0 md:px-6">
              <p className="display text-[clamp(2.25rem,5vw,3.25rem)] text-magenta-600">{f.value}</p>
              <p className="mt-2 text-sm leading-snug text-ink-muted">{f.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ Haltung / Differenzierung ═════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Warum Sunna</p>
              <h2 className="display-tight mt-6 text-[clamp(1.85rem,4vw,2.75rem)] text-plum-900 balance">
                Qualität vor Quantität. Und ein Mensch, der zuständig bleibt.
              </h2>
            </Reveal>

            <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {[
                {
                  t: "Keine Verkaufskolonne",
                  d: "Sie sprechen mit mir – nicht mit wechselnden Vertrieblern, die nach Abschluss verschwinden.",
                },
                {
                  t: "Handwerk statt Katalog",
                  d: "Über 40 Jahre Elektro- und Haustechnik-Erfahrung im Team, dazu Ingenieurs-Know-how aus der Familie.",
                },
                {
                  t: "Klare Preise, klare Zusagen",
                  d: "Was im Angebot steht, wird gebaut. Keine Nachträge, die niemand angekündigt hat.",
                },
                {
                  t: "Rundum-sorglos",
                  d: "Planung, Montage, Zählerschrank, Anmeldungen beim Netzbetreiber – wir übernehmen den Papierkram.",
                },
              ].map((item, i) => (
                <Reveal key={item.t} delay={i * 70}>
                  <h3 className="display-tight flex items-baseline gap-3 text-[1.3rem] text-plum-900">
                    <span className="h-px w-6 shrink-0 translate-y-[-0.3em] bg-magenta-500" aria-hidden />
                    {item.t}
                  </h3>
                  <p className="mt-3 pl-9 leading-relaxed text-ink-muted pretty">{item.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ Leistungen ════════════════════════════════════════════════════════ */}
      <section className="pb-24 md:pb-32">
        <div className="wrap">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Was wir bauen</p>
            <h2 className="display-tight mt-6 text-[clamp(1.85rem,4vw,2.75rem)] text-plum-900 balance">
              Alles aus einer Hand – vom Modul bis zur Anmeldung
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {leistungen.map((l, i) => (
              <Reveal
                key={l.slot}
                delay={i * 80}
                className={`group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--edge)] bg-paper ${l.span}`}
              >
                <div className={`relative w-full overflow-hidden ${l.span ? "aspect-[4/3] lg:aspect-[4/5]" : "aspect-[16/10]"}`}>
                  <ManagedImage
                    slot={l.slot}
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1 font-display text-xs font-semibold tracking-wider text-magenta-600 backdrop-blur">
                    {l.kicker}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="display-tight text-[1.4rem] text-plum-900">{l.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-muted pretty">{l.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Ablauf ════════════════════════════════════════════════════════════ */}
      <section className="surface-dark grain relative overflow-hidden py-24 md:py-32">
        <div className="wrap relative z-10">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow eyebrow-light">So läuft es ab</p>
              <h2 className="display-tight mt-6 text-[clamp(1.85rem,4vw,2.75rem)] text-paper balance">
                Vom ersten Gespräch bis zum eigenen Strom
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-paper/65 pretty">
                In der Regel plane ich innerhalb von 14 Tagen und setze Projekte dank
                eingespielter Abläufe meist in ein bis zwei Tagen um.
              </p>

              <div className="frame-offset mt-12 hidden aspect-[16/10] lg:block">
                <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-card)]">
                  <ManagedImage slot="home-band" sizes="45vw" className="object-cover" />
                </div>
              </div>
            </Reveal>

            <ol className="relative">
              {ablauf.map((step, i) => (
                <Reveal
                  as="li"
                  key={step.n}
                  delay={i * 80}
                  className="relative grid grid-cols-[3.25rem_1fr] gap-5 border-b border-white/12 py-7 first:pt-0 last:border-b-0"
                >
                  <span className="display text-[1.75rem] leading-none text-magenta-300/90">{step.n}</span>
                  <div>
                    <h3 className="display-tight text-[1.3rem] text-paper">{step.title}</h3>
                    <p className="mt-2.5 leading-relaxed text-paper/60 pretty">{step.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ══ Persönliches Zitat ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="wrap">
          <Reveal className="mx-auto max-w-3xl text-center">
            <SunArc className="mx-auto h-24 w-48 opacity-70" rings={6} />
            <blockquote className="display mt-8 text-[clamp(1.6rem,3.6vw,2.4rem)] text-plum-900 balance">
              „Wenn unsere Kunden am Ende sagen: <em className="not-italic text-magenta-600">Genau so haben wir es uns gewünscht</em> – dann ist das für mich der schönste Erfolg.“
            </blockquote>
            <p className="mt-7 text-sm text-ink-muted">
              Kerstin Klaiber · Inhaberin ·{" "}
              <Link href="/ueber-uns" className="link-underline font-semibold text-plum-800">
                Mehr über mich
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ Abschluss-CTA ═════════════════════════════════════════════════════ */}
      <section className="pb-24 md:pb-32">
        <div className="wrap">
          <Reveal className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--edge)] bg-sand px-8 py-14 text-center md:px-16 md:py-20">
            <h2 className="display-tight mx-auto max-w-2xl text-[clamp(1.75rem,3.6vw,2.5rem)] text-plum-900 balance">
              Lassen Sie uns unverbindlich über Ihr Dach sprechen.
            </h2>
            <p className="lede mx-auto mt-5 max-w-xl pretty">
              Ein Anruf, ein Termin, eine ehrliche Einschätzung – kostenlos und ohne Verpflichtung.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/kontakt" className="btn btn-primary">
                Beratungstermin anfragen
              </Link>
              <a href={site.phone.href} className="btn btn-ghost">
                {site.phone.display}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
