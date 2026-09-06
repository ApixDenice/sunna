"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { login } from "./actions";
import type { LoginState } from "./types";

export default function LoginForm() {
  const [state, action] = useActionState(login, {} as LoginState);

  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <Image src="/logo.webp" alt="Sunna Photovoltaik" width={740} height={160} className="mx-auto h-8 w-auto" />

        <form action={action} className="mt-10 rounded-[var(--radius-card)] border border-[var(--edge)] bg-sand/50 p-8">
          <h1 className="display-tight text-[1.4rem] text-plum-900">Bilder verwalten</h1>
          <p className="mt-2 text-sm text-ink-muted">Bitte melden Sie sich an.</p>

          <label htmlFor="password" className="mt-7 mb-1.5 block text-sm font-medium text-plum-900">
            Passwort
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={Boolean(state.error)}
            className="w-full rounded-xl border border-[var(--edge)] bg-paper px-4 py-3 text-[0.9375rem] transition focus:border-magenta-500 focus:outline-none focus:ring-2 focus:ring-magenta-500/20"
          />

          {state.error && (
            <p role="alert" className="mt-3 rounded-lg bg-magenta-100 px-3 py-2 text-sm text-magenta-700">
              {state.error}
            </p>
          )}

          <Submit />
        </form>

        <p className="mt-6 text-center text-xs text-ink-muted">
          <a href="/" className="link-underline">Zurück zur Website</a>
        </p>
      </div>
    </div>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:opacity-60">
      {pending ? "Wird geprüft …" : "Anmelden"}
    </button>
  );
}
