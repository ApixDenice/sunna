import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
    ["", 1, "monthly"],
    ["/ueber-uns", 0.9, "monthly"],
    ["/referenzen", 0.8, "monthly"],
    ["/bewertungen", 0.7, "weekly"],
    ["/kontakt", 0.9, "yearly"],
    ["/impressum", 0.2, "yearly"],
    ["/datenschutz", 0.2, "yearly"],
  ];

  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
