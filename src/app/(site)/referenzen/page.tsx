import Link from "next/link";
import type { Metadata } from "next";
import ManagedImage from "@/components/ManagedImage";
import RegionMap from "@/components/RegionMap";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { resolveText } from "@/lib/texts";

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
  title: "Referenzen – realisierte Photovoltaikanlagen & Wärmepumpen",
  description:
    "Ausgewählte Projekte von Sunna Photovoltaik: Solardächer auf Sattel-, Ziegel- und Flachdach, Stromspeicher, Wallbox, Zählerschrank und Wärmepumpe – in Braunschweig, Hildesheim, Peine, Salzgitter und der ganzen Region.",
  alternates: { canonical: "/referenzen" },
};

/**
 * Nur noch Bildplatz und Kachelgröße – die Texte gehören zum Bild und stehen
 * deshalb in lib/slot-texts.ts. Kerstin ändert sie im Admin direkt unter dem
 * Foto, damit Bild und Beschriftung nicht auseinanderlaufen.
 */
const projekte = [
  { slot: "ref-1", size: "wide" },
  { slot: "ref-2", size: "tall" },
  { slot: "ref-3", size: "normal" },
  { slot: "ref-4", size: "normal" },
  { slot: "ref-5", size: "normal" },
  { slot: "ref-6", size: "tall" },
  { slot: "ref-7", size: "normal" },
  { slot: "ref-8", size: "normal" },
  { slot: "ref-10", size: "tall" },
  { slot: "ref-11", size: "normal" },
  { slot: "ref-9", size: "wide" },
] as const;

/**
 * Kachelgröße im Raster: getrennt nach Raster-Spanne und Seitenverhältnis.
 * Hochformat-Kacheln spannen zwei Rasterzeilen – ab `sm` darf das Bild deshalb
 * kein festes Seitenverhältnis mehr haben, sonst bleibt unten eine leere Fläche.
 */
const layout = {
  wide: { cell: "sm:col-span-2", ratio: "aspect-[16/10]" },
  tall: { cell: "sm:row-span-2", ratio: "aspect-[3/4] sm:aspect-auto sm:h-full" },
  normal: { cell: "", ratio: "aspect-[4/3]" },
} as const;

export default async function ReferenzenPage() {
  // Ein Ladevorgang für alle Kacheln – der Textspeicher wird ohnehin am Stück
  // gecacht, einzelne Abfragen pro Feld wären reine Verschwendung.
  const texte = await Promise.all(
    projekte.map(async (p) => ({
      ...p,
      titel: await resolveText(p.slot, "titel"),
      kurz: await resolveText(p.slot, "kurz"),
      detail: await resolveText(p.slot, "detail"),
      tags: (await resolveText(p.slot, "tags"))
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    })),
  );

  return (
    <>
      <section className="pb-12 pt-12 md:pb-16 md:pt-20">
        <div className="wrap">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Referenzen</p>
            <h1 className="display mt-6 text-[clamp(2.4rem,6.5vw,4rem)] text-plum-900 balance">
              Über 1.000 Anlagen. Hier ein paar davon.
            </h1>
            <p className="lede mt-7 max-w-2xl pretty">
              Jedes Dach ist anders – deshalb sieht auch keine unserer Anlagen aus wie die
              vorherige. Eine Auswahl aus Südost-Niedersachsen: Solardächer, Speicher,
              Haustechnik und Wärmepumpen.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ Einsatzgebiet ═════════════════════════════════════════════════════
          Steht bewusst hier oben: Wer auf „Referenzen“ landet, prüft als Erstes,
          ob wir überhaupt in seiner Gegend arbeiten. Erst danach lohnt sich der
          Blick auf die Projekte. Die H1 bleibt darüber – sonst leidet die
          Dokumentstruktur (Vorlesereihenfolge und SEO). */}
      <section
        className="border-y border-[var(--edge)] bg-sand/50 py-20 md:py-24"
        aria-labelledby="einsatzgebiet"
      >
        <div className="wrap">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">Einsatzgebiet</p>
                <h2
                  id="einsatzgebiet"
                  className="display-tight mt-6 text-[clamp(1.85rem,4vw,2.75rem)] text-plum-900 balance"
                >
                  Nah genug, um vorbeizukommen
                </h2>
                <p className="lede mt-6 max-w-lg pretty">
                  Von Lengede aus bin ich in ganz Südost-Niedersachsen unterwegs – zur Beratung,
                  zur Montage und wenn nach Jahren doch mal eine Frage aufkommt. Kein Callcenter
                  drei Bundesländer weiter.
                </p>
              </Reveal>

              <Reveal delay={90}>
                <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-3 lg:grid-cols-2">
                  {site.serviceArea.map((ort) => (
                    <li
                      key={ort}
                      className="flex items-center gap-2.5 border-b border-[var(--edge)] py-2.5 text-plum-900"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-magenta-500" aria-hidden />
                      {ort}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-ink-muted">
                  Ihre Region nicht dabei? Rufen Sie trotzdem an – wir schauen, ob es passt.
                </p>
              </Reveal>
            </div>

            <Reveal delay={140} className="lg:justify-self-end">
              <RegionMap className="mx-auto w-full max-w-[22rem] lg:max-w-[26rem]" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-20 md:pb-32 md:pt-24">
        <div className="wrap">
          <ul className="grid auto-rows-auto gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {texte.map((p, i) => (
              <Reveal
                as="li"
                key={p.slot}
                delay={(i % 3) * 70}
                className={`group relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--edge)] bg-sand ${layout[p.size].cell}`}
              >
                <div className={`relative w-full ${layout[p.size].ratio}`}>
                  <ManagedImage
                    slot={p.slot}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                  {/* Verlauf sorgt dafür, dass die Beschriftung auf jedem Foto lesbar bleibt */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-plum-950/85 via-plum-950/15 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/25 px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-wide text-paper/90"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="display-tight text-[1.25rem] text-paper">{p.titel}</h2>
                    <p className="mt-1 text-sm text-paper/70">{p.kurz}</p>
                    <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-paper/75 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                      {p.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-16 rounded-[var(--radius-card)] border border-[var(--edge)] bg-sand/60 px-8 py-12 text-center md:px-16">
            <h2 className="display-tight mx-auto max-w-xl text-[clamp(1.6rem,3.2vw,2.2rem)] text-plum-900 balance">
              Ihr Dach ist der nächste Fall.
            </h2>
            <p className="lede mx-auto mt-4 max-w-lg pretty">
              Schicken Sie mir ein Foto Ihres Dachs – ich sage Ihnen ehrlich, was sich lohnt.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/kontakt" className="btn btn-primary">
                Kostenlose Einschätzung
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
