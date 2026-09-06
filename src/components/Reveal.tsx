"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

/**
 * Blendet Inhalte beim Scrollen sanft ein – ohne Animationsbibliothek.
 * Respektiert `prefers-reduced-motion` (siehe globals.css).
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fallback für sehr alte Browser: sofort anzeigen.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Bewusster Cast: `as` ist absichtlich frei wählbar (div, li, section …),
  // TypeScript kann die Props einer solchen Union nicht auflösen.
  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref as never}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
