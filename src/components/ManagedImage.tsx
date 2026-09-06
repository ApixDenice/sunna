import Image from "next/image";
import { resolveImage } from "@/lib/images";
import { resolveText } from "@/lib/texts";

/**
 * Bild, das im Admin-Panel austauschbar ist.
 * Verwendung:  <ManagedImage slot="home-hero" sizes="(min-width:1024px) 40vw, 100vw" />
 *
 * Rendert mit `fill` – das übergeordnete Element muss deshalb `relative`
 * und eine feste Höhe bzw. ein Seitenverhältnis haben.
 */
export default async function ManagedImage({
  slot,
  className = "object-cover",
  sizes = "100vw",
  priority = false,
  alt,
}: {
  slot: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  alt?: string;
}) {
  const { src } = await resolveImage(slot);
  // Die Bildbeschreibung ist im Admin änderbar; `alt` als Prop schlägt beides.
  const managedAlt = await resolveText(slot, "alt");

  return (
    <Image
      src={src}
      alt={alt ?? managedAlt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
