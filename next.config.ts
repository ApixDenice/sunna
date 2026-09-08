import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // Hochgeladene Bilder kommen jetzt aus dem eigenen Datenverzeichnis und
    // werden über /medien/... ausgeliefert – also gleiche Herkunft, keine
    // remotePatterns nötig.
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,

  /**
   * Weiterleitungen von der alten Website.
   *
   * sunna-photovoltaik.de lief bisher mit anderen Adressen: /startseite statt /
   * und /über-uns mit Umlaut. Diese URLs stehen im Google-Index, in Aushängen
   * und vermutlich in der ein oder anderen E-Mail. Ohne Weiterleitung landet
   * jeder darauf im 404 – und der aufgebaute Rang der alten Seite verfällt,
   * statt auf die neue Adresse überzugehen.
   *
   * `permanent: true` sendet 301: Google überträgt damit die Bewertung der
   * alten Adresse auf die neue.
   */
  async redirects() {
    return [
      { source: "/startseite", destination: "/", permanent: true },
      { source: "/über-uns", destination: "/ueber-uns", permanent: true },
      // Dieselbe Adresse noch einmal prozentkodiert, wie Browser sie senden.
      { source: "/%C3%BCber-uns", destination: "/ueber-uns", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default config;
