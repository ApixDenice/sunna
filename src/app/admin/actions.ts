"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createSession, destroySession, verifyPassword, isConfigured, rateLimit } from "@/lib/auth";

import type { LoginState } from "./types";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isConfigured()) {
    return {
      error:
        "Der Admin-Bereich ist noch nicht eingerichtet (ADMIN_PASSWORD_HASH bzw. AUTH_SECRET fehlen).",
    };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit(`login:${ip}`);
  if (!limit.ok) {
    return { error: "Zu viele Versuche. Bitte warten Sie einige Minuten." };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Bitte geben Sie das Passwort ein." };

  if (!(await verifyPassword(password))) {
    // Bewusst keine Angabe, was genau falsch war.
    return { error: `Passwort nicht korrekt. Noch ${limit.remaining} Versuche.` };
  }

  await createSession();
  revalidatePath("/admin");
  return {};
}

export async function logout() {
  await destroySession();
  revalidatePath("/admin");
}
