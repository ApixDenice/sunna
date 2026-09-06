"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü schließen, wenn die Seite wechselt
  useEffect(() => setOpen(false), [pathname]);

  // Hintergrund nicht scrollen lassen, solange das Menü offen ist
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-plum-800 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Zum Inhalt springen
      </a>

      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled || open
            ? "bg-paper/85 shadow-[0_1px_0_0_rgba(36,7,51,0.10)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
          <Link href="/" className="relative z-10 shrink-0" aria-label={`${site.name} – zur Startseite`}>
            <Image
              src="/logo.webp"
              alt={site.name}
              width={740}
              height={163}
              priority
              className="h-7 w-auto md:h-8"
            />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors ${
                    active ? "text-plum-800" : "text-ink-muted hover:text-plum-800"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-px bg-magenta-500" aria-hidden />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={site.phone.href} className="text-sm font-semibold text-plum-800 link-underline">
              {site.phone.display}
            </a>
            <Link href="/kontakt" className="btn btn-primary !py-2.5 !text-sm">
              Kostenlose Beratung
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-plum-800 lg:hidden"
          >
            <span className="sr-only">{open ? "Menü schließen" : "Menü öffnen"}</span>
            <span aria-hidden className="grid gap-[5px]">
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span className={`block h-[1.5px] w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobiles Menü */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 surface-dark grain overflow-hidden lg:hidden"
      >
        <div className="wrap flex h-full flex-col justify-between pb-10 pt-28">
          <nav aria-label="Hauptnavigation (mobil)" className="flex flex-col">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="display border-b border-white/10 py-5 text-[2.25rem] text-paper"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <span className="mr-4 align-super text-[0.7rem] font-sans font-semibold tracking-widest text-magenta-300">
                  0{i + 1}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-4">
            <a href={site.phone.href} className="display block text-[1.75rem] text-paper">
              {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className="block text-paper/70">
              {site.email}
            </a>
            <Link href="/kontakt" className="btn btn-primary w-full">
              Kostenlose Beratung anfragen
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
