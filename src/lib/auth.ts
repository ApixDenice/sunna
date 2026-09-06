import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

/**
 * Bewusst minimale Authentifizierung: ein Admin, ein Passwort.
 * Das Passwort liegt nur als bcrypt-Hash in der Umgebungsvariable,
 * die Session ist ein signiertes JWT in einem httpOnly-Cookie.
 */

const COOKIE = "sunna_admin";
const MAX_AGE = 60 * 60 * 8; // 8 Stunden

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_SECRET fehlt oder ist kürzer als 32 Zeichen (siehe .env.example).");
  }
  return new TextEncoder().encode(s);
}

/**
 * Liest den Admin-Hash aus der Umgebung.
 *
 * Hintergrund – der Grund für die Base64-Kodierung:
 * Ein bcrypt-Hash beginnt mit "$2a$12$…". Next.js schickt alle Werte aus der
 * .env durch dotenv-expand, und das liest "$2a", "$12" usw. als Verweise auf
 * Umgebungsvariablen. Die gibt es nicht, also werden sie durch nichts ersetzt –
 * der Hash kommt leer in der App an und der Login meldet „nicht eingerichtet",
 * obwohl in der .env alles korrekt steht. Anführungszeichen helfen dagegen
 * nicht; Backslash-Escaping schon, aber das müsste man in Vercel wieder
 * entfernen, weil es dort kein dotenv-expand gibt. Diese Asymmetrie ist eine
 * Falle, die später garantiert jemandem das Wochenende kostet.
 *
 * Deshalb liegt der Hash Base64-kodiert in der Variable: nur [A-Za-z0-9+/=],
 * kein Dollarzeichen, keine Anführungszeichen, kein Escaping – derselbe Wert
 * funktioniert in .env, in Vercel und in jeder Shell.
 *
 * Ein unkodierter bcrypt-Hash wird weiterhin akzeptiert, falls er unbeschadet
 * ankommt (in Vercel gesetzte Variablen laufen nicht durch dotenv-expand).
 */
function adminHash(): string | null {
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!raw) return null;
  if (raw.startsWith("$2")) return raw;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    return decoded.startsWith("$2") ? decoded : null;
  } catch {
    return null;
  }
}

export function isConfigured() {
  return Boolean(adminHash() && (process.env.AUTH_SECRET?.length ?? 0) >= 32);
}

export async function verifyPassword(password: string) {
  const hash = adminHash();
  if (!hash) return false;
  // bcrypt.compare ist von Natur aus laufzeitkonstant genug gegen Timing-Angriffe.
  return bcrypt.compare(password, hash);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthenticated() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/* ── Sehr einfaches Brute-Force-Limit (pro Serverinstanz, im Speicher) ─────── */

const attempts = new Map<string, { count: number; until: number }>();

export function rateLimit(ip: string, max = 8, windowMs = 10 * 60_000) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.until) {
    attempts.set(ip, { count: 1, until: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  entry.count += 1;
  return { ok: entry.count <= max, remaining: Math.max(0, max - entry.count) };
}
