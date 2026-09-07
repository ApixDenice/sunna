"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Kontaktformular ohne Server
 * ───────────────────────────
 * Die Anfrage wird NICHT von uns verschickt. Beim Klick auf den Knopf baut
 * diese Komponente eine fertige E-Mail zusammen und übergibt sie per
 * `mailto:` an das E-Mail-Programm des Besuchers – abgeschickt wird sie dort
 * von ihm selbst.
 *
 * Warum so:
 *  • Kein Versanddienst, kein API-Schlüssel, keine DNS-Einträge, kein
 *    Auftragsverarbeitungsvertrag – die Daten erreichen unseren Server nie.
 *  • Zustellbarkeit ist kein Thema: Die Mail kommt aus dem Postfach des
 *    Absenders, nicht von einem fremden Versandserver.
 *  • Kein Spam über das Formular, weil es keinen Endpunkt gibt, den ein Bot
 *    ansprechen könnte. Deshalb hier auch kein Honeypot mehr.
 *
 * Der Preis dafür: Wer kein eingerichtetes E-Mail-Programm hat (viele
 * Handy-Browser, Webmail im Firmennetz), bei dem passiert nach dem Klick
 * sichtbar nichts. Genau dafür ist der Block nach dem Absenden da – er zeigt
 * die fertige Nachricht zum Kopieren, die Adresse und die Telefonnummer.
 * Ohne diesen Ausweg gehen genau die Anfragen verloren, die man nie sieht.
 */

type Felder = {
  name: string;
  email: string;
  telefon: string;
  ort: string;
  anliegen: string;
  nachricht: string;
};

type Fehler = Partial<Record<"name" | "email" | "nachricht", string>>;

const leer: Felder = { name: "", email: "", telefon: "", ort: "", anliegen: "", nachricht: "" };

const fieldBase =
  "w-full rounded-xl border border-[var(--edge)] bg-paper px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-muted/50 transition focus:border-magenta-500 focus:outline-none focus:ring-2 focus:ring-magenta-500/20";

/** Bewusst großzügig: Ein Formular ist kein Ort, um Tippfehler zu bestrafen. */
const istEmail = (wert: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert.trim());

function betreffAus(f: Felder) {
  const thema = f.anliegen.trim() || "Anfrage über die Website";
  return f.name.trim() ? `${thema} – ${f.name.trim()}` : thema;
}

/**
 * Zeilenumbrüche als CRLF, weil einige E-Mail-Programme (allen voran Outlook)
 * einfache \n im mailto-Body verschlucken und alles zu einem Absatz machen.
 */
function textAus(f: Felder) {
  const zeilen = [
    `Name: ${f.name.trim()}`,
    `E-Mail: ${f.email.trim()}`,
    f.telefon.trim() && `Telefon: ${f.telefon.trim()}`,
    f.ort.trim() && `PLZ / Ort: ${f.ort.trim()}`,
    f.anliegen.trim() && `Anliegen: ${f.anliegen.trim()}`,
    "",
    "Nachricht:",
    f.nachricht.trim(),
  ].filter((z): z is string => Boolean(z));
  return zeilen.join("\r\n");
}

export default function ContactForm() {
  const [f, setF] = useState<Felder>(leer);
  const [fehler, setFehler] = useState<Fehler>({});
  const [abgeschickt, setAbgeschickt] = useState(false);
  const [kopiert, setKopiert] = useState(false);

  const text = useMemo(() => textAus(f), [f]);
  const mailto = useMemo(
    () =>
      `mailto:${site.email}?subject=${encodeURIComponent(betreffAus(f))}&body=${encodeURIComponent(text)}`,
    [f, text],
  );

  const setzen = (feld: keyof Felder) => (wert: string) => {
    setF((alt) => ({ ...alt, [feld]: wert }));
    setFehler((alt) => ({ ...alt, [feld]: undefined }));
  };

  function absenden(e: React.FormEvent) {
    e.preventDefault();

    const neu: Fehler = {};
    if (!f.name.trim()) neu.name = "Bitte tragen Sie Ihren Namen ein.";
    if (!f.email.trim()) neu.email = "Bitte tragen Sie Ihre E-Mail-Adresse ein.";
    else if (!istEmail(f.email)) neu.email = "Diese E-Mail-Adresse sieht nicht vollständig aus.";
    if (!f.nachricht.trim()) neu.nachricht = "Bitte beschreiben Sie kurz Ihr Anliegen.";

    if (Object.keys(neu).length) {
      setFehler(neu);
      // Zum ersten Fehler springen – sonst sucht man auf dem Handy vergeblich.
      document.getElementById(Object.keys(neu)[0])?.focus();
      return;
    }

    setAbgeschickt(true);
    window.location.href = mailto;
  }

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2500);
    } catch {
      // Kein Zugriff auf die Zwischenablage (ältere Browser, kein HTTPS):
      // Text markieren, damit Kopieren von Hand einen Klick entfernt ist.
      const feld = document.getElementById("mail-text") as HTMLTextAreaElement | null;
      feld?.select();
    }
  }

  if (abgeschickt) {
    return (
      <div className="rounded-[var(--radius-card)] border border-magenta-500/30 bg-magenta-100/40 p-8">
        <p className="display-tight text-[1.4rem] text-plum-900">Fast geschafft</p>
        <p className="mt-3 leading-relaxed text-ink-muted pretty">
          Ihr E-Mail-Programm sollte sich mit der fertigen Nachricht geöffnet haben.{" "}
          <strong className="font-semibold text-plum-800">
            Dort müssen Sie nur noch auf „Senden“ klicken
          </strong>{" "}
          – erst dann erreicht uns Ihre Anfrage.
        </p>

        <details className="mt-6 rounded-xl border border-[var(--edge)] bg-paper p-5">
          <summary className="cursor-pointer text-sm font-semibold text-plum-900">
            Es hat sich nichts geöffnet?
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Dann ist auf diesem Gerät kein E-Mail-Programm eingerichtet. Kopieren Sie einfach den
            Text und schicken Sie ihn an{" "}
            <a href={`mailto:${site.email}`} className="link-underline font-medium text-plum-800">
              {site.email}
            </a>{" "}
            – oder rufen Sie an:{" "}
            <a href={site.phone.href} className="link-underline font-medium text-plum-800">
              {site.phone.display}
            </a>
            .
          </p>
          <textarea
            id="mail-text"
            readOnly
            rows={9}
            value={text}
            className={`${fieldBase} mt-4 resize-y font-mono text-xs`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void kopieren()}
              className="btn btn-ghost !py-2 !text-sm"
            >
              Text kopieren
            </button>
            {kopiert && <span className="text-sm font-semibold text-magenta-600">Kopiert</span>}
            <a href={mailto} className="text-sm text-ink-muted link-underline">
              Nochmal versuchen
            </a>
          </div>
        </details>

        <button
          type="button"
          onClick={() => setAbgeschickt(false)}
          className="mt-6 text-sm text-ink-muted link-underline"
        >
          Angaben noch einmal ändern
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={absenden} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          value={f.name}
          onChange={setzen("name")}
          error={fehler.name}
          autoComplete="name"
        />
        <Field
          label="E-Mail"
          name="email"
          type="email"
          required
          value={f.email}
          onChange={setzen("email")}
          error={fehler.email}
          autoComplete="email"
        />
        <Field
          label="Telefon"
          name="telefon"
          type="tel"
          optional
          value={f.telefon}
          onChange={setzen("telefon")}
          autoComplete="tel"
        />
        <Field
          label="PLZ / Ort"
          name="ort"
          optional
          value={f.ort}
          onChange={setzen("ort")}
          autoComplete="postal-code"
        />
      </div>

      <div>
        <label htmlFor="anliegen" className="mb-1.5 block text-sm font-medium text-plum-900">
          Worum geht es? <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <select
          id="anliegen"
          name="anliegen"
          value={f.anliegen}
          onChange={(e) => setzen("anliegen")(e.target.value)}
          className={fieldBase}
        >
          <option value="">Bitte auswählen</option>
          <option>Neue Photovoltaikanlage</option>
          <option>Stromspeicher nachrüsten</option>
          <option>Wallbox / Ladepunkt</option>
          <option>Wärmepumpe statt alter Heizung</option>
          <option>Bestehende Anlage erweitern</option>
          <option>Etwas anderes</option>
        </select>
      </div>

      <div>
        <label htmlFor="nachricht" className="mb-1.5 block text-sm font-medium text-plum-900">
          Ihre Nachricht <span aria-hidden className="text-magenta-500">*</span>
        </label>
        <textarea
          id="nachricht"
          name="nachricht"
          rows={5}
          value={f.nachricht}
          onChange={(e) => setzen("nachricht")(e.target.value)}
          aria-invalid={Boolean(fehler.nachricht)}
          aria-describedby={fehler.nachricht ? "nachricht-error" : undefined}
          placeholder="Zum Beispiel: Satteldach nach Süden, Baujahr 1998, rund 4.500 kWh Verbrauch im Jahr …"
          className={`${fieldBase} resize-y`}
        />
        {fehler.nachricht && (
          <p id="nachricht-error" className="mt-1.5 text-sm text-magenta-700">
            {fehler.nachricht}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Anfrage im E-Mail-Programm öffnen
      </button>

      {/* Erwartung vorher setzen. Wer glaubt, mit dem Klick sei die Anfrage
          raus, schickt sie nie ab – und wundert sich, dass niemand antwortet. */}
      <p className="text-xs leading-relaxed text-ink-muted">
        Es öffnet sich Ihr E-Mail-Programm mit der fertigen Nachricht – abgeschickt wird sie erst,
        wenn Sie dort auf „Senden“ klicken. Ihre Angaben werden dabei nicht an diese Website
        übertragen; mehr dazu in der{" "}
        <Link href="/datenschutz" className="link-underline font-medium text-plum-800">
          Datenschutzerklärung
        </Link>
        . Mit * markierte Felder werden benötigt.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  optional = false,
  value,
  onChange,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChange: (wert: string) => void;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-plum-900">
        {label}{" "}
        {required ? (
          <span aria-hidden className="text-magenta-500">
            *
          </span>
        ) : optional ? (
          <span className="font-normal text-ink-muted">(optional)</span>
        ) : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={fieldBase}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-magenta-700">
          {error}
        </p>
      )}
    </div>
  );
}
