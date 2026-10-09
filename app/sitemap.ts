import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/config";
import { pathFor, ROUTES, type RouteKey } from "@/lib/i18n/routes";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) languages[l] = absoluteUrl(pathFor(l, key));
    languages["x-default"] = absoluteUrl(pathFor("id", key));
    for (const l of LOCALES) {
      entries.push({
        url: absoluteUrl(pathFor(l, key)),
        lastModified: now,
        changeFrequency: key === "home" ? "monthly" : "yearly",
        priority: key === "home" ? 1 : 0.3,
        alternates: { languages },
      });
    }
  }
  return entries;
}
