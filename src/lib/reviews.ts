import "server-only";
import { site } from "./site";

/**
 * Google-Bewertungen über die offizielle Places API (New).
 *
 * Wichtig und bewusst so gebaut:
 * - Der Abruf passiert ausschließlich serverseitig. Im Browser der Besucher
 *   wird kein Google-Script geladen und keine Verbindung zu Google aufgebaut
 *   -> kein Cookie-Banner nötig, DSGVO-seitig die saubere Variante.
 * - Die API liefert systembedingt maximal 5 Rezensionen pro Ort. Gesamtnote
 *   und Anzahl der Bewertungen sind vollständig.
 * - Googles Nutzungsbedingungen verbieten das dauerhafte Speichern der
 *   Rezensionstexte. Deshalb kein eigener Cache in einer Datenbank, sondern
 *   nur Next.js-Revalidierung alle 6 Stunden.
 * - Autorennamen werden verlinkt und die Quelle wird ausgewiesen (Pflicht).
 */

export type GoogleReview = {
  id: string;
  author: string;
  authorUri?: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime?: string;
};

export type ReviewData = {
  rating: number | null;
  total: number | null;
  reviews: GoogleReview[];
  mapsUri: string;
  /** Fehlt die Konfiguration oder antwortet Google nicht, wird das hier gemeldet. */
  status: "ok" | "not-configured" | "error";
  message?: string;
};

const FIELDS = "rating,userRatingCount,googleMapsUri,reviews";

export async function getGoogleReviews(): Promise<ReviewData> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  const empty: ReviewData = {
    rating: null,
    total: null,
    reviews: [],
    mapsUri: site.googleMapsSearchUrl,
    status: "not-configured",
  };

  if (!key || !placeId) {
    return { ...empty, message: "GOOGLE_PLACES_API_KEY oder GOOGLE_PLACE_ID ist nicht gesetzt." };
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=de&regionCode=DE`,
      {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELDS },
        // 6 Stunden Revalidierung: aktuell genug, aber nur ~4 API-Aufrufe/Tag.
        next: { revalidate: 21_600 },
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("[reviews] Places API antwortete mit", res.status, body.slice(0, 400));
      return { ...empty, status: "error", message: `Places API: HTTP ${res.status}` };
    }

    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: Array<{
        name?: string;
        rating?: number;
        text?: { text?: string };
        originalText?: { text?: string };
        relativePublishTimeDescription?: string;
        publishTime?: string;
        authorAttribution?: { displayName?: string; uri?: string };
      }>;
    };

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r, i) => ({
        id: r.name ?? `review-${i}`,
        author: r.authorAttribution?.displayName?.trim() || "Google-Nutzer",
        authorUri: r.authorAttribution?.uri,
        rating: r.rating ?? 0,
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime,
      }))
      .filter((r) => r.text.length > 0)
      // Neueste zuerst
      .sort((a, b) => (b.publishTime ?? "").localeCompare(a.publishTime ?? ""));

    return {
      rating: data.rating ?? null,
      total: data.userRatingCount ?? null,
      reviews,
      mapsUri: data.googleMapsUri ?? site.googleMapsSearchUrl,
      status: "ok",
    };
  } catch (err) {
    console.error("[reviews] Abruf fehlgeschlagen:", err);
    return { ...empty, status: "error", message: "Bewertungen konnten nicht geladen werden." };
  }
}

/** "5" -> "5,0" – deutsche Schreibweise mit einer Nachkommastelle. */
export function formatRating(rating: number) {
  return rating.toFixed(1).replace(".", ",");
}
