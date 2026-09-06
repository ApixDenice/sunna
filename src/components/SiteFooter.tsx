import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="surface-dark grain relative mt-px overflow-hidden">
      <div className="wrap relative z-10 py-20 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr_1fr]">
          <div className="max-w-sm">
            <Image
              src="/logo.webp"
              alt={site.name}
              width={740}
              height={163}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="display-tight mt-7 text-[1.5rem] text-paper/95 pretty">
              „{site.claim}“
            </p>
            <p className="mt-4 text-sm text-paper/55">— {site.owner}, Inhaberin</p>

            <div className="mt-8 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-paper/80 transition hover:border-magenta-500 hover:bg-magenta-500 hover:text-white"
                aria-label="Sunna Photovoltaik auf Instagram"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.88a4.28 4.28 0 1 1 0-8.56 4.28 4.28 0 0 1 0 8.56Zm8.4-11.14a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0Z" />
                </svg>
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-paper/80 transition hover:border-magenta-500 hover:bg-magenta-500 hover:text-white"
                aria-label="Sunna Photovoltaik auf Facebook"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
                </svg>
              </a>
            </div>
          </div>

          <nav aria-label="Footer-Navigation">
            <h2 className="eyebrow eyebrow-light">Seiten</h2>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/75 transition hover:text-paper link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow eyebrow-light">Kontakt</h2>
            <address className="mt-6 space-y-4 not-italic text-paper/75">
              <p className="leading-relaxed">
                {site.legalName}
                <br />
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city} OT {site.address.district}
              </p>
              <p className="space-y-1">
                <a href={site.phone.href} className="block text-paper transition hover:text-magenta-300">
                  {site.phone.display}
                </a>
                <a href={`mailto:${site.email}`} className="block transition hover:text-magenta-300">
                  {site.email}
                </a>
              </p>
            </address>

            <dl className="mt-7 space-y-1.5 text-sm text-paper/60">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-white/10 pb-1.5">
                  <dt>{h.days}</dt>
                  <dd className="text-paper/85">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-magenta-300">{site.hoursNote}</p>
          </div>
        </div>

        {/* Einsatzgebiet – auch ein Signal für die lokale Google-Suche */}
        <div className="mt-16 border-t border-white/10 pt-7">
          <h2 className="eyebrow eyebrow-light">Einsatzgebiet</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-paper/60">
            Photovoltaik, Stromspeicher, Wallbox und Wärmepumpe in{" "}
            {site.serviceArea.map((ort, i) => (
              <span key={ort}>
                <span className="text-paper/85">{ort}</span>
                {i < site.serviceArea.length - 2
                  ? ", "
                  : i === site.serviceArea.length - 2
                    ? " und "
                    : ""}
              </span>
            ))}{" "}
            – und in den Gemeinden dazwischen.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}
          </p>
          <div className="flex gap-6">
            <Link href="/impressum" className="transition hover:text-paper">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition hover:text-paper">
              Datenschutz
            </Link>
            <Link href="/admin" className="transition hover:text-paper">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
