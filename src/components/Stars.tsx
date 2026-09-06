/**
 * Sternebewertung. `value` darf auch 4,7 sein – dann wird der letzte Stern
 * anteilig gefüllt. Für Screenreader gibt es einen Textfallback.
 */
export default function Stars({
  value,
  size = 18,
  className = "",
  label,
}: {
  value: number;
  size?: number;
  className?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <span className={`inline-flex items-center ${className}`} role="img" aria-label={label ?? `${value} von 5 Sternen`}>
      <span className="relative inline-block" style={{ lineHeight: 0 }}>
        <span className="flex gap-[3px] text-sand-dark" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex gap-[3px] overflow-hidden text-magenta-500"
          style={{ width: `${pct}%` }}
          aria-hidden
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} />
          ))}
        </span>
      </span>
    </span>
  );
}

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className="shrink-0">
      <path d="M10 1.6l2.47 5.3 5.53.66-4.09 3.86 1.09 5.68L10 14.3l-4.99 2.8 1.09-5.68L2.01 7.56l5.52-.66L10 1.6z" />
    </svg>
  );
}
