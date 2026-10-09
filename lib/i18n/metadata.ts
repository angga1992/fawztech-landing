import type { Metadata } from "next";
import { LOCALES, type Locale } from "./config";
import { getDictionary } from "./dictionary";
import { pathFor, type RouteKey } from "./routes";

const OG_LOCALE: Record<Locale, string> = { id: "id_ID", en: "en_US" };

/** Metadata per halaman dan locale: title, description, canonical, hreflang, Open Graph. */
export function pageMetadata(locale: Locale, key: RouteKey): Metadata {
  const t = getDictionary(locale);
  const path = pathFor(locale, key);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = pathFor(l, key);
  languages["x-default"] = pathFor("id", key);

  const title = key === "home" ? t.meta.title : t.privacy.metaTitle;
  const description = key === "home" ? t.meta.description : t.privacy.metaDescription;

  return {
    title: key === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url: path,
      siteName: "Fawz Tech",
      title,
      description,
      images: [{ url: t.meta.ogImage, width: 1200, height: 630, alt: "Fawz Tech" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [t.meta.ogImage] },
  };
}
