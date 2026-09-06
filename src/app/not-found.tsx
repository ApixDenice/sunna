import Link from "next/link";
import SunArc from "@/components/SunArc";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <SunArc className="mx-auto h-28 w-56 opacity-70" rings={6} />
        <p className="display mt-8 text-[clamp(3rem,10vw,5rem)] text-plum-900">404</p>
        <h1 className="display-tight mt-2 text-[1.5rem] text-plum-900">Diese Seite gibt es nicht.</h1>
        <p className="mt-4 text-ink-muted">Vielleicht hat sich ein Tippfehler eingeschlichen.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Zur Startseite</Link>
          <Link href="/kontakt" className="btn btn-ghost">Kontakt</Link>
        </div>
      </div>
    </div>
  );
}
