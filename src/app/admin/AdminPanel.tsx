"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { logout } from "./actions";
import type { ImageSlot } from "@/lib/slots";
import type { TextField } from "@/lib/slot-texts";

type TextView = TextField & { value: string; isCustom: boolean };
type SlotView = ImageSlot & { currentUrl: string; isCustom: boolean; texts: TextView[] };

export default function AdminPanel({ slots, groups }: { slots: SlotView[]; groups: string[] }) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-[var(--edge)] bg-paper/90 backdrop-blur-xl">
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="display-tight text-[1.25rem] text-plum-900">Bilder &amp; Texte</span>
            <span className="hidden text-sm text-ink-muted sm:inline">Sunna Photovoltaik</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-ink-muted link-underline">
              Website ansehen ↗
            </a>
            <form action={logout}>
              <button type="submit" className="btn btn-ghost !py-2 !text-sm">
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="wrap py-10">
        <div className="mb-10 max-w-2xl rounded-2xl border border-[var(--edge)] bg-sand/60 p-6">
          <h1 className="display-tight text-[1.35rem] text-plum-900">So funktioniert&rsquo;s</h1>
          <ol className="mt-4 space-y-2 text-sm leading-relaxed text-ink-muted">
            <li>
              <strong className="text-plum-800">1.</strong> Suchen Sie unten den Platz, dessen Bild
              Sie tauschen möchten.
            </li>
            <li>
              <strong className="text-plum-800">2.</strong> Auf <em>Bild ändern</em> klicken und ein
              Foto vom Computer auswählen – oder das Foto direkt auf das Bild ziehen.
            </li>
            <li>
              <strong className="text-plum-800">3.</strong> Passt der Text darunter nicht mehr zum
              neuen Foto? Auf <em>Texte bearbeiten</em> klicken, ändern, speichern.
            </li>
            <li>
              <strong className="text-plum-800">4.</strong> Fertig. Beides ist sofort auf der
              Website sichtbar.
            </li>
          </ol>
          <p className="mt-4 text-xs text-ink-muted">
            Erlaubt sind JPG, PNG, WebP und AVIF bis 12 MB. Mit <em>Zurücksetzen</em> holen Sie
            jederzeit das ursprüngliche Bild oder den ursprünglichen Text zurück. Die
            Zeichengrenze pro Feld sorgt dafür, dass die Website in Form bleibt.
          </p>
        </div>

        {groups.map((group) => (
          <section key={group} className="mb-14">
            <h2 className="eyebrow mb-6">{group}</h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {slots
                .filter((s) => s.group === group)
                .map((slot) => (
                  <SlotCard key={slot.id} slot={slot} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function SlotCard({ slot }: { slot: SlotView }) {
  const [url, setUrl] = useState(slot.currentUrl);
  const [isCustom, setIsCustom] = useState(slot.isCustom);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    setDone(false);
    setBusy(true);
    try {
      const body = new FormData();
      body.set("slotId", slot.id);
      body.set("file", file);
      const res = await fetch("/api/images", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload fehlgeschlagen.");
      setUrl(data.url);
      setIsCustom(true);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function reset() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/images?slotId=${encodeURIComponent(slot.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Zurücksetzen fehlgeschlagen.");
      setUrl(data.url);
      setIsCustom(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--edge)] bg-paper">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void upload(file);
        }}
        className={`relative w-full bg-sand transition ${dragOver ? "ring-4 ring-inset ring-magenta-500" : ""}`}
        style={{ aspectRatio: slot.aspect.replace("/", " / ") }}
      >
        <Image
          key={url}
          src={url}
          alt=""
          fill
          sizes="(min-width:1280px) 30vw, (min-width:640px) 45vw, 92vw"
          className="object-cover"
          unoptimized
        />

        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-plum-950/60 text-sm font-medium text-paper">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-paper border-t-transparent" />
              Wird hochgeladen …
            </span>
          </div>
        )}

        {done && !busy && (
          <div className="absolute inset-x-0 top-0 bg-magenta-500 py-1.5 text-center text-xs font-semibold text-white">
            Gespeichert
          </div>
        )}

        {isCustom && !busy && !done && (
          <span className="absolute right-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-magenta-600 backdrop-blur">
            geändert
          </span>
        )}

        {dragOver && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-plum-950/50 text-sm font-semibold text-paper">
            Foto hier loslassen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[0.9375rem] font-semibold leading-snug text-plum-900">{slot.label}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-muted">{slot.hint}</p>

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-magenta-100 px-3 py-2 text-xs text-magenta-700">
            {error}
          </p>
        )}

        <TextEditor slot={slot} />

        <div className="mt-4 flex items-center gap-2">
          <input
            ref={inputRef}
            id={`file-${slot.id}`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
          <label
            htmlFor={`file-${slot.id}`}
            className={`btn btn-primary flex-1 !py-2.5 !text-sm ${busy ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
          >
            Bild ändern
          </label>
          {isCustom && (
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="btn btn-ghost !px-3 !py-2.5 !text-sm disabled:opacity-50"
              title="Ursprüngliches Bild wiederherstellen"
            >
              Zurücksetzen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Texte zu einem Bild ──────────────────────────────────────────────────────
   Eingeklappt, damit die Karte übersichtlich bleibt: Wer nur ein Foto tauscht,
   sieht die Felder gar nicht. Gespeichert wird pro Feld, nicht pro Karte – so
   geht bei einem Fehlschlag nie mehr als eine Änderung verloren. */
function TextEditor({ slot }: { slot: SlotView }) {
  const [open, setOpen] = useState(false);
  const geaendert = slot.texts.filter((t) => t.isCustom).length;

  return (
    <div className="mt-4 border-t border-[var(--edge)] pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-plum-900"
      >
        <span className="flex items-center gap-2">
          Texte bearbeiten
          {geaendert > 0 && (
            <span className="rounded-full bg-magenta-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-magenta-700">
              {geaendert} geändert
            </span>
          )}
        </span>
        <svg
          viewBox="0 0 12 12"
          aria-hidden
          className={`h-3 w-3 shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 space-y-5">
          {slot.texts.map((field) => (
            <TextRow key={field.id} slotId={slot.id} field={field} />
          ))}
        </div>
      )}
    </div>
  );
}

function TextRow({ slotId, field }: { slotId: string; field: TextView }) {
  const [value, setValue] = useState(field.value);
  const [saved, setSaved] = useState(field.value);
  const [isCustom, setIsCustom] = useState(field.isCustom);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = value.trim() !== saved.trim();
  const rest = field.maxLength - value.length;
  const inputId = `text-${slotId}-${field.id}`;

  async function send(next: string) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/texts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, fieldId: field.id, value: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Speichern fehlgeschlagen.");
      setValue(data.value);
      setSaved(data.value);
      setIsCustom(data.isCustom);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(
        `/api/texts?slotId=${encodeURIComponent(slotId)}&fieldId=${encodeURIComponent(field.id)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Zurücksetzen fehlgeschlagen.");
      setValue(data.value);
      setSaved(data.value);
      setIsCustom(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    } finally {
      setBusy(false);
    }
  }

  const shared = {
    id: inputId,
    value,
    maxLength: field.maxLength,
    disabled: busy,
    onChange: (e: { target: { value: string } }) => setValue(e.target.value),
    className:
      "mt-1.5 w-full rounded-lg border border-[var(--edge)] bg-paper px-3 py-2 text-sm text-ink " +
      "focus:border-magenta-500 focus:outline-none focus:ring-2 focus:ring-magenta-500/25 disabled:opacity-60",
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-xs font-semibold text-plum-900">
          {field.label}
          {isCustom && <span className="ml-2 font-normal text-magenta-600">geändert</span>}
        </label>
        <span className={`text-[0.6875rem] tabular-nums ${rest < 15 ? "text-magenta-600" : "text-ink-muted"}`}>
          noch {rest}
        </span>
      </div>

      {field.multiline ? (
        <textarea {...shared} rows={3} />
      ) : (
        <input {...shared} type="text" />
      )}

      <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-ink-muted">{field.hint}</p>

      {error && (
        <p role="alert" className="mt-2 rounded-lg bg-magenta-100 px-3 py-2 text-xs text-magenta-700">
          {error}
        </p>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void send(value)}
          disabled={busy || !dirty}
          className="btn btn-primary !px-3 !py-1.5 !text-xs disabled:opacity-40"
        >
          Speichern
        </button>
        {isCustom && (
          <button
            type="button"
            onClick={() => void reset()}
            disabled={busy}
            className="text-xs text-ink-muted underline underline-offset-2 disabled:opacity-40"
          >
            Ursprünglichen Text zurückholen
          </button>
        )}
        {done && !busy && <span className="text-xs font-semibold text-magenta-600">Gespeichert</span>}
      </div>
    </div>
  );
}
