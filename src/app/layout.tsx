import type { Metadata, Viewport } from "next";

// Selbst gehostete Schriften – es geht keine Anfrage an Google Fonts raus.
// Für die zusätzlichen Fraunces-Achsen (SOFT/WONK/opsz) stattdessen
// "@fontsource-variable/fraunces/full.css" importieren.
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – Photovoltaik aus Lengede | Persönliche Beratung`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Photovoltaik Lengede",
    "Solaranlage Peine",
    "Photovoltaik Salzgitter",
    "PV-Anlage Braunschweig",
    "Stromspeicher",
    "Wallbox",
    "Kerstin Klaiber",
  ],
  authors: [{ name: site.owner }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: site.url,
    siteName: site.name,
    title: `${site.name} – Photovoltaik aus Lengede`,
    description: site.description,
    images: [{ url: "/bilder/referenz-drohne-wintergarten.webp", width: 1600, height: 1200, alt: site.name }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#310252",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
