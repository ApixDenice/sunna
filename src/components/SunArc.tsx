/**
 * Wiederkehrendes Bildzeichen: ein aufgehender Sonnenbogen aus konzentrischen
 * Linien. Greift den Namen „Sunna“ auf und ersetzt austauschbare Deko-Blobs.
 *
 * Die Farbe jeder Linie wird direkt berechnet – bewusst ohne <defs>-Verlauf,
 * damit mehrere Instanzen auf einer Seite sich keine SVG-ID teilen.
 */
export default function SunArc({
  className = "",
  rings = 7,
  from = "#d6006d",
  to = "#310252",
}: {
  className?: string;
  rings?: number;
  /** Farbe der äußeren Linie (Hex) */
  from?: string;
  /** Farbe der inneren Linie (Hex) */
  to?: string;
}) {
  return (
    <svg viewBox="0 0 400 200" className={className} aria-hidden focusable="false">
      {Array.from({ length: rings }).map((_, i) => {
        const t = rings === 1 ? 0 : i / (rings - 1);
        const r = 30 + t * 140;
        return (
          <path
            key={i}
            d={`M ${200 - r} 200 A ${r} ${r} 0 0 1 ${200 + r} 200`}
            fill="none"
            stroke={mix(to, from, t)}
            strokeWidth={1.25}
            opacity={0.2 + (1 - t) * 0.55}
          />
        );
      })}
    </svg>
  );
}

/** Lineare Interpolation zweier Hex-Farben. */
function mix(a: string, b: string, t: number) {
  const pa = hex(a);
  const pb = hex(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

function hex(value: string): [number, number, number] {
  const h = value.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
