/**
 * Einsatzgebiet als kleine Übersichtskarte.
 *
 * Bewusst KEINE Landkarte mit Grenzen und keine maßstabsgetreue Karte:
 *  • Die *Richtung* jedes Orts von Lengede aus ist exakt (echte Koordinaten,
 *    äquirektangulär projiziert, cos-Korrektur für 52,2° N).
 *  • Die *Entfernung* ist gestaucht (r ∝ d^0.62, Mindestradius für Nachbarorte wie Salzgitter).
 *    Sonst zieht Göttingen (78 km) die Karte auseinander und der dichte Kern
 *    um Lengede wird unlesbar.
 * Die gestrichelten Ringe bei 25 und 50 km machen die Stauchung sichtbar,
 * die km-Angaben pro Ort machen sie überprüfbar. Reines Inline-SVG:
 * kein Tile-Server, kein externer Request – die Seite bleibt cookie-frei.
 *
 * Die Ortsliste selbst steht in lib/site.ts (serviceArea). Wer dort einen Ort
 * ergänzt, ergänzt ihn auch hier (Koordinaten siehe Kommentar oben).
 */

type Ort = {
  name: string;
  x: number;
  y: number;
  /** Luftlinie ab Lengede in km – bleibt ehrlich trotz gestauchter Darstellung */
  km: number;
  /** Beschriftung links vom Punkt (Orte westlich von Lengede) */
  left?: boolean;
};

const orte: Ort[] = [
  { name: "Braunschweig", x: 130.3, y: 85.4, km: 17 },
  { name: "Gifhorn", x: 125.1, y: 52.1, km: 36 },
  { name: "Goslar", x: 112.9, y: 151.0, km: 34 },
  { name: "Göttingen", x: 70.0, y: 182.8, km: 78, left: true },
  { name: "Hannover", x: 45.0, y: 73.2, km: 44, left: true },
  { name: "Hildesheim", x: 58.3, y: 109.6, km: 24, left: true },
  { name: "Peine", x: 89.2, y: 72.0, km: 14, left: true },
  { name: "Salzgitter", x: 120.1, y: 132.2, km: 7 },
  { name: "Wolfenbüttel", x: 132.0, y: 109.4, km: 16 },
  { name: "Wolfsburg", x: 147.1, y: 65.0, km: 41 },
];

const CX = 100;
const CY = 100;

export default function RegionMap({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="2 26 192 172"
      className={className}
      role="img"
      aria-label={`Übersicht des Einsatzgebiets rund um den Firmensitz in Lengede: ${orte
        .map((o) => `${o.name} etwa ${o.km} Kilometer`)
        .join(", ")}.`}
    >
      {/* Entfernungsringe – machen die gestauchte Skala sichtbar */}
      <g fill="none" stroke="currentColor" className="text-plum-900/12" strokeDasharray="1.5 4">
        <circle cx={CX} cy={CY} r={43.3} />
        <circle cx={CX} cy={CY} r={66.6} />
      </g>
      <g className="fill-plum-900/35" fontSize={5.5} textAnchor="middle">
        <text x={CX} y={CY - 43.3 + 1.8}>
          25 km
        </text>
        <text x={CX} y={CY - 66.6 + 1.8}>
          50 km
        </text>
      </g>

      {/* Strahlen vom Sitz zu jedem Ort */}
      <g stroke="currentColor" className="text-magenta-500/30" strokeWidth={0.6}>
        {orte.map((o) => (
          <line key={o.name} x1={CX} y1={CY} x2={o.x} y2={o.y} />
        ))}
      </g>

      {/* Firmensitz */}
      <circle cx={CX} cy={CY} r={10} className="fill-magenta-500/12" />
      <circle cx={CX} cy={CY} r={4} className="fill-magenta-600" />
      <text
        x={CX}
        y={CY + 19}
        textAnchor="middle"
        fontSize={8}
        className="fill-plum-900 font-semibold"
      >
        Lengede
      </text>
      <text x={CX} y={CY + 26.5} textAnchor="middle" fontSize={5.5} className="fill-magenta-600">
        Firmensitz
      </text>

      {/* Orte */}
      {orte.map((o) => (
        <g key={o.name}>
          <circle cx={o.x} cy={o.y} r={2.6} className="fill-plum-800" />
          <text
            x={o.left ? o.x - 5.5 : o.x + 5.5}
            y={o.y + 0.6}
            textAnchor={o.left ? "end" : "start"}
            fontSize={7.5}
            className="fill-plum-900/85"
          >
            {o.name}
          </text>
          <text
            x={o.left ? o.x - 5.5 : o.x + 5.5}
            y={o.y + 7.4}
            textAnchor={o.left ? "end" : "start"}
            fontSize={5.5}
            className="fill-plum-900/40"
          >
            {o.km} km
          </text>
        </g>
      ))}
    </svg>
  );
}
