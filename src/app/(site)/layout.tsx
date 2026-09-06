import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/lib/site";

/** Strukturierte Daten – wichtig für die lokale Sichtbarkeit bei Google. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.legalName,
  alternateName: site.name,
  description: site.description,
  url: site.url,
  telephone: "+49 163 5106751",
  email: site.email,
  founder: { "@type": "Person", name: site.owner },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.zip,
    addressLocality: `${site.address.city} OT ${site.address.district}`,
    addressCountry: site.address.country,
  },
  // Einsatzgebiet: eine Quelle (lib/site.ts), plus der Firmensitz selbst.
  areaServed: [site.address.city, ...site.serviceArea].map((name) => ({
    "@type": "City",
    name,
  })),
  knowsAbout: [
    "Photovoltaik",
    "Solaranlage",
    "Stromspeicher",
    "Wallbox",
    "Wärmepumpe",
    "Zählerschrank",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  sameAs: [site.social.instagram, site.social.facebook],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main id="inhalt">{children}</main>
      <SiteFooter />
    </>
  );
}
