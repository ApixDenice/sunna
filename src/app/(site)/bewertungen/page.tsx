import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import SunArc from "@/components/SunArc";
import { site } from "@/lib/site";
import { getGoogleReviews, formatRating } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Bewertungen – was Kundinnen und Kunden sagen",
  description:
    "Echte Google-Bewertungen für Sunna Photovoltaik in Lengede. Gesamtnote und aktuelle Rezensionen, direkt von Google geladen.",
  alternates: { canonical: "/bewertungen" },
};

// Die Seite wird alle 6 Stunden neu erzeugt (siehe lib/reviews.ts).
export const revalidate = 21_600;

/*
 * Hinweis zu strukturierten Daten:
 * Wir markieren die Google-Note bewusst NICHT als eigenes `aggregateRating`
 * per JSON-LD. Googles Richtlinien für strukturierte Daten untersagen es,
 * Bewertungen von Drittplattformen als eigene Bewertungen auszuzeichnen –
 * das kann zu einer manuellen Maßnahme führen.
 */

export default async function BewertungenPage() {
  const { rating, total, reviews, mapsUri, status, message } = await getGoogleReviews();

  return (
    <>
      {/* ══ Gesamtnote ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
        <SunArc className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] opacity-[0.1]" rings={7} />

        <div className="wrap relative">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Bewertungen</p>
            <h1 className="display mt-6 text-[clamp(2.4rem,6.5vw,4rem)] text-plum-900 balance">
              Was unsere Kundinnen und Kunden sagen
            </h1>
            <p className="lede mt-7 max-w-2xl pretty">
              Diese Bewertungen kommen direkt aus unserem Google-Unternehmensprofil – ungefiltert
              und unbearbeitet. Wir können sie weder auswählen noch löschen.
            </p>
          </Reveal>

          {status === "ok" && rating !== null && (
            <Reveal delay={90} className="mt-14">
              <div className="flex flex-col items-start gap-8 rounded-[var(--radius-card)] border border-[var(--edge)] bg-sand/70 p-8 sm:flex-row sm:items-center sm:gap-12 md:p-12">
                <div className="shrink-0">
                  <p className="display text-[clamp(3.5rem,9vw,5.5rem)] leading-none text-plum-900">
                    {formatRating(rating)}
                  </p>
                  <Stars
                    value={rating}
                    size={22}
                    className="mt-4"
                    label={`Gesamtbewertung ${formatRating(rating)} von 5 Sternen`}
                  />
                  {total !== null && (
                    <p className="mt-3 text-sm text-ink-muted">
                      aus <strong className="font-semibold text-plum-800">{total}</strong>{" "}
                      {total === 1 ? "Bewertung" : "Bewertungen"} bei Google
                    </p>
                  )}
                </div>

                <div className="h-px w-full bg-[var(--edge)] sm:h-24 sm:w-px" aria-hidden />

                <div>
                  <p className="display-tight text-[1.35rem] text-plum-900 pretty">
                    Danke für dieses Vertrauen.
                  </p>
                  <p className="mt-3 max-w-md leading-relaxed text-ink-muted pretty">
                    Jede dieser Bewertungen steht für ein Dach, eine Familie und ein Projekt, das
                    wir persönlich begleitet haben.
                  </p>
                  <a
                    href={mapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost mt-6"
                  >
                    Auf Google ansehen
                    <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ══ Einzelbewertungen ═════════════════════════════════════════════════ */}
      <section className="pb-24 md:pb-32">
        <div className="wrap">
          {reviews.length > 0 ? (
            <>
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((r, i) => (
                  <Reveal
                    as="li"
                    key={r.id}
                    delay={(i % 3) * 70}
                    className="flex flex-col rounded-[var(--radius-card)] border border-[var(--edge)] bg-paper p-7 transition hover:border-magenta-500/40"
                  >
                    <Stars value={r.rating} size={16} label={`${r.rating} von 5 Sternen`} />
                    <blockquote className="mt-5 flex-1 leading-relaxed text-ink pretty">
                      {r.text}
                    </blockquote>
                    <footer className="mt-7 flex items-center gap-3 border-t border-[var(--edge)] pt-5">
                      {/* Initialen statt des bei Google gehosteten Profilbilds –
                          so wird beim Besucher keine Verbindung zu Google aufgebaut. */}
                      <span
                        aria-hidden
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum-800 font-display text-sm text-paper"
                      >
                        {initials(r.author)}
                      </span>
                      <div className="min-w-0">
                        {r.authorUri ? (
                          <a
                            href={r.authorUri}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="block truncate text-sm font-semibold text-plum-900 link-underline"
                          >
                            {r.author}
                          </a>
                        ) : (
                          <p className="truncate text-sm font-semibold text-plum-900">{r.author}</p>
                        )}
                        <p className="text-xs text-ink-muted">{r.relativeTime} · Google</p>
                      </div>
                    </footer>
                  </Reveal>
                ))}
              </ul>

              <Reveal className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[var(--edge)] bg-sand/50 p-6 sm:flex-row sm:items-center">
                <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
                  <strong className="font-semibold text-plum-800">Warum nur {reviews.length} Rezensionen?</strong>{" "}
                  Google gibt über seine offizielle Schnittstelle maximal fünf Rezensionen pro
                  Unternehmensprofil heraus. Die Gesamtnote oben berücksichtigt dagegen alle
                  Bewertungen. Den vollständigen Verlauf finden Sie direkt bei Google.
                </p>
                <a
                  href={mapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost shrink-0"
                >
                  Alle Bewertungen
                  <span aria-hidden>↗</span>
                </a>
              </Reveal>
            </>
          ) : (
            <Reveal className="rounded-[var(--radius-card)] border border-dashed border-[var(--edge)] bg-sand/40 p-10 text-center">
              <p className="display-tight text-[1.4rem] text-plum-900">
                Die Bewertungen werden gerade nicht angezeigt.
              </p>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-muted pretty">
                {status === "not-configured"
                  ? "Die Verbindung zu Google ist noch nicht eingerichtet. Bis dahin finden Sie alle Bewertungen direkt in unserem Google-Profil."
                  : "Gerade konnten wir die Bewertungen nicht von Google laden. Bitte schauen Sie direkt in unserem Google-Profil vorbei."}
              </p>
              <a href={mapsUri} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-7">
                Bewertungen bei Google ansehen
              </a>
              {process.env.NODE_ENV !== "production" && message && (
                <p className="mt-6 font-mono text-xs text-magenta-600">Dev-Hinweis: {message}</p>
              )}
            </Reveal>
          )}

          {/* Pflichtangabe: Quelle der Bewertungen ausweisen */}
          <p className="mt-8 text-center text-xs text-ink-muted">
            Bewertungen und Gesamtnote stammen aus dem Google-Unternehmensprofil von{" "}
            {site.legalName} und werden über die Google Places API geladen. Google und das
            Google-Logo sind Marken von Google LLC.
          </p>
        </div>
      </section>

      {/* ══ Aufruf ════════════════════════════════════════════════════════════ */}
      <section className="surface-dark grain relative overflow-hidden py-20 md:py-28">
        <div className="wrap relative z-10 text-center">
          <Reveal className="mx-auto max-w-2xl">
            <h2 className="display-tight text-[clamp(1.7rem,3.4vw,2.4rem)] text-paper balance">
              Sie sind schon Kundin oder Kunde?
            </h2>
            <p className="mt-5 leading-relaxed text-paper/65 pretty">
              Eine ehrliche Bewertung hilft anderen bei der Entscheidung – und uns, besser zu
              werden.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={mapsUri} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Bei Google bewerten
              </a>
              <Link href="/kontakt" className="btn btn-on-dark">
                Direkt Kontakt aufnehmen
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
