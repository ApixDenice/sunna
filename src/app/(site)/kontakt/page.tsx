import type { Metadata } from "next";
import ManagedImage from "@/components/ManagedImage";
import Reveal from "@/components/Reveal";
import SunArc from "@/components/SunArc";
import ContactForm from "./ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt – kostenlose Beratung anfragen",
  description: `Sunna Photovoltaik erreichen Sie unter ${site.phone.display} oder ${site.email}. Kostenloser Beratungstermin in Lengede und Umgebung.`,
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-12 md:pb-20 md:pt-20">
        <SunArc className="pointer-events-none absolute -left-28 top-4 h-[26rem] w-[26rem] opacity-[0.1]" rings={7} />
        <div className="wrap relative">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Kontakt</p>
            <h1 className="display mt-6 text-[clamp(2.4rem,6.5vw,4rem)] text-plum-900 balance">
              Reden wir über Ihr Dach.
            </h1>
            <p className="lede mt-7 max-w-2xl pretty">
              Vereinbaren Sie mit uns einen kostenlosen und verständlichen Beratungstermin. Ohne
              Verkaufsdruck – und Sie sprechen mit mir persönlich.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* ── Formular ──────────────────────────────────────────────────── */}
            <Reveal className="rounded-[var(--radius-card)] border border-[var(--edge)] bg-sand/50 p-7 md:p-10">
              <h2 className="display-tight text-[1.5rem] text-plum-900">Anfrage schreiben</h2>
              <p className="mt-2 mb-8 text-sm leading-relaxed text-ink-muted">
                Je mehr Sie zu Dach und Verbrauch schreiben, desto konkreter kann ich antworten.
              </p>
              <ContactForm />
            </Reveal>

            {/* ── Direktkontakt ─────────────────────────────────────────────── */}
            <div className="space-y-8">
              <Reveal delay={80}>
                <div className="surface-dark grain relative overflow-hidden rounded-[var(--radius-card)] p-8 md:p-10">
                  <div className="relative z-10">
                    <p className="eyebrow eyebrow-light">Am schnellsten geht&rsquo;s so</p>
                    <a
                      href={site.phone.href}
                      className="display mt-6 block text-[clamp(1.8rem,4.5vw,2.5rem)] text-paper transition hover:text-magenta-300"
                    >
                      {site.phone.display}
                    </a>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-3 block text-paper/70 transition hover:text-magenta-300"
                    >
                      {site.email}
                    </a>
                    <p className="mt-6 text-sm leading-relaxed text-paper/60">{site.hoursNote}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div className="rounded-[var(--radius-card)] border border-[var(--edge)] p-8">
                  <h2 className="display-tight text-[1.25rem] text-plum-900">So finden Sie uns</h2>
                  <address className="mt-4 not-italic leading-relaxed text-ink-muted">
                    {site.legalName}
                    <br />
                    {site.address.street}
                    <br />
                    {site.address.zip} {site.address.city} OT {site.address.district}
                  </address>
                  {/* Bewusst nur ein Link statt einer eingebetteten Karte:
                      eine Google-Maps-Einbettung würde eine Einwilligung erfordern. */}
                  <a
                    href={site.googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost mt-6 !py-2.5 !text-sm"
                  >
                    Route in Google Maps öffnen
                    <span aria-hidden>↗</span>
                  </a>

                  <dl className="mt-8 space-y-2 border-t border-[var(--edge)] pt-6 text-sm">
                    {site.hours.map((h) => (
                      <div key={h.days} className="flex justify-between gap-4">
                        <dt className="text-ink-muted">{h.days}</dt>
                        <dd className="font-medium text-plum-900">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="frame-offset aspect-[4/3]">
                  <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-card)] bg-sand">
                    <ManagedImage slot="kontakt-bild" sizes="(min-width:1024px) 45vw, 92vw" className="object-cover" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
