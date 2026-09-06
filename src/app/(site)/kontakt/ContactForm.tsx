"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { sendContact } from "./actions";
import type { ContactState } from "./types";

const initial: ContactState = { status: "idle" };

const fieldBase =
  "w-full rounded-xl border border-[var(--edge)] bg-paper px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-muted/50 transition focus:border-magenta-500 focus:outline-none focus:ring-2 focus:ring-magenta-500/20";

export default function ContactForm() {
  const [state, formAction] = useActionState(sendContact, initial);

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-card)] border border-magenta-500/30 bg-magenta-100/50 p-10 text-center"
      >
        <p className="display-tight text-[1.5rem] text-plum-900">Nachricht angekommen</p>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink-muted pretty">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-xl border border-magenta-500/40 bg-magenta-100/60 px-4 py-3 text-sm text-magenta-700"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required error={state.fieldErrors?.name} autoComplete="name" />
        <Field
          label="E-Mail"
          name="email"
          type="email"
          required
          error={state.fieldErrors?.email}
          autoComplete="email"
        />
        <Field label="Telefon" name="telefon" type="tel" autoComplete="tel" optional />
        <Field label="PLZ / Ort" name="ort" autoComplete="postal-code" optional />
      </div>

      <div>
        <label htmlFor="anliegen" className="mb-1.5 block text-sm font-medium text-plum-900">
          Worum geht es? <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <select id="anliegen" name="anliegen" defaultValue="" className={fieldBase}>
          <option value="">Bitte auswählen</option>
          <option>Neue Photovoltaikanlage</option>
          <option>Stromspeicher nachrüsten</option>
          <option>Wallbox / Ladepunkt</option>
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
          required
          aria-invalid={Boolean(state.fieldErrors?.nachricht)}
          aria-describedby={state.fieldErrors?.nachricht ? "nachricht-error" : undefined}
          placeholder="Zum Beispiel: Satteldach nach Süden, Baujahr 1998, rund 4.500 kWh Verbrauch im Jahr …"
          className={`${fieldBase} resize-y`}
        />
        {state.fieldErrors?.nachricht && (
          <p id="nachricht-error" className="mt-1.5 text-sm text-magenta-700">
            {state.fieldErrors.nachricht}
          </p>
        )}
      </div>

      {/* Honeypot – für Menschen unsichtbar, für Bots verlockend */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website (bitte frei lassen)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-muted">
          <input
            type="checkbox"
            name="datenschutz"
            required
            aria-invalid={Boolean(state.fieldErrors?.datenschutz)}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-magenta-500)]"
          />
          <span>
            Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage
            verarbeitet werden. Weitere Hinweise in der{" "}
            <Link href="/datenschutz" className="link-underline font-medium text-plum-800">
              Datenschutzerklärung
            </Link>
            . <span aria-hidden className="text-magenta-500">*</span>
          </span>
        </label>
        {state.fieldErrors?.datenschutz && (
          <p className="mt-1.5 text-sm text-magenta-700">{state.fieldErrors.datenschutz}</p>
        )}
      </div>

      <SubmitButton />
      <p className="text-xs text-ink-muted">Mit * markierte Felder werden benötigt.</p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
      {pending ? "Wird gesendet …" : "Anfrage absenden"}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  optional = false,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
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
        required={required}
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
