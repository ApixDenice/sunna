"use server";

import { headers } from "next/headers";
import { site } from "@/lib/site";
import { rateLimit } from "@/lib/auth";

import type { ContactState } from "./types";

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: ein für Menschen unsichtbares Feld. Ist es gefüllt, war es ein Bot.
  // Wir melden trotzdem Erfolg, damit der Bot nicht dazulernt.
  if ((formData.get("website") as string)?.length) {
    return { status: "ok", message: "Vielen Dank! Ihre Nachricht ist angekommen." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 15 * 60_000).ok) {
    return {
      status: "error",
      message: "Es wurden zu viele Anfragen gesendet. Bitte versuchen Sie es später erneut oder rufen Sie uns an.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefon = String(formData.get("telefon") ?? "").trim();
  const ort = String(formData.get("ort") ?? "").trim();
  const anliegen = String(formData.get("anliegen") ?? "").trim();
  const nachricht = String(formData.get("nachricht") ?? "").trim();
  const datenschutz = formData.get("datenschutz") === "on";

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Bitte geben Sie Ihren Namen an.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fieldErrors.email = "Bitte prüfen Sie Ihre E-Mail-Adresse.";
  if (nachricht.length < 10) fieldErrors.nachricht = "Bitte beschreiben Sie Ihr Anliegen kurz (mind. 10 Zeichen).";
  if (!datenschutz) fieldErrors.datenschutz = "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.";

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Bitte prüfen Sie die markierten Felder.", fieldErrors };
  }

  const betreff = `Website-Anfrage von ${name}${ort ? ` (${ort})` : ""}`;
  const text = [
    `Name:      ${name}`,
    `E-Mail:    ${email}`,
    `Telefon:   ${telefon || "—"}`,
    `Ort/PLZ:   ${ort || "—"}`,
    `Anliegen:  ${anliegen || "—"}`,
    "",
    "Nachricht:",
    nachricht,
    "",
    "—",
    `Gesendet über ${site.url} am ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}`,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  /**
   * Empfänger ist immer Kerstins Postfach aus lib/site.ts (info@sunna-photovoltaik.de).
   * CONTACT_TO_EMAIL überschreibt das nur, wenn bewusst eine abweichende Adresse
   * gesetzt wird – etwa ein Testpostfach auf einer Staging-Umgebung. Ein leer
   * gesetztes ENV (`CONTACT_TO_EMAIL=`) fällt dank `||` ebenfalls zurück.
   */
  const to = process.env.CONTACT_TO_EMAIL?.trim() || site.email;

  /**
   * Absender ist eine technische Adresse auf der EIGENEN Domain – nicht die
   * Adresse aus dem Formular. Würde dort die Besucheradresse stehen, scheitert
   * die Zustellung an SPF/DKIM/DMARC: Wir dürfen nicht im Namen von gmx.de oder
   * gmail.com senden. Kerstin kann trotzdem direkt antworten, weil unten
   * `replyTo` auf die Adresse des Absenders zeigt.
   * Die Domain muss dafür einmalig in Resend verifiziert werden.
   */
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "website@sunna-photovoltaik.de";

  if (!apiKey) {
    // Ohne konfigurierten Mailversand geht nichts verloren – aber wir tun auch
    // nicht so, als sei die Nachricht zugestellt worden.
    console.warn("[kontakt] RESEND_API_KEY fehlt. Anfrage:\n" + text);
    return {
      status: "error",
      message: `Der E-Mail-Versand ist noch nicht eingerichtet. Bitte schreiben Sie uns direkt an ${site.email} oder rufen Sie an: ${site.phone.display}.`,
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Sunna Website <${from}>`,
      to: [to],
      replyTo: email,
      subject: betreff,
      text,
    });
    if (error) throw error;
  } catch (err) {
    console.error("[kontakt] Versand fehlgeschlagen:", err);
    return {
      status: "error",
      message: `Die Nachricht konnte nicht gesendet werden. Bitte rufen Sie uns an: ${site.phone.display}.`,
    };
  }

  return {
    status: "ok",
    message: "Vielen Dank! Ihre Nachricht ist angekommen – ich melde mich in der Regel innerhalb eines Werktags.",
  };
}
