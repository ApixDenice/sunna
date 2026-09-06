/**
 * Erzeugt den Admin-Zugang: bcrypt-Hash des Passworts plus Session-Schlüssel.
 * Aufruf:  npm run hash-password -- 'MeinSicheresPasswort'
 *
 * Warum Base64: Ein bcrypt-Hash beginnt mit "$2a$12$…". Next.js schickt
 * .env-Werte durch dotenv-expand, das "$2a" und "$12" als Variablenverweise
 * liest und durch nichts ersetzt – der Hash käme leer in der App an. Base64
 * enthält nur [A-Za-z0-9+/=] und übersteht .env, Vercel und jede Shell
 * unverändert. src/lib/auth.ts dekodiert den Wert wieder.
 */
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const pw = process.argv[2];
if (!pw) {
  console.error("Bitte ein Passwort angeben:  npm run hash-password -- 'MeinPasswort'");
  console.error("Einfache Anführungszeichen verwenden – in doppelten deutet zsh");
  console.error("$, ` und ! um, und der Hash passt dann zu einem anderen Passwort.");
  process.exit(1);
}
if (pw.length < 10) {
  console.error("Bitte mindestens 10 Zeichen verwenden.");
  process.exit(1);
}

const hash = await bcrypt.hash(pw, 12);
const encoded = Buffer.from(hash, "utf8").toString("base64");

console.log("\nIn die .env eintragen (ohne Anführungszeichen, ohne Leerzeichen):\n");
console.log(`ADMIN_PASSWORD_HASH=${encoded}`);
console.log(`AUTH_SECRET=${crypto.randomBytes(32).toString("hex")}\n`);
console.log("Dieselben zwei Zeilen später unverändert in die Vercel-Umgebung.\n");
console.log("Danach den Dev-Server neu starten – Umgebungsvariablen werden nur");
console.log("beim Start gelesen.\n");
