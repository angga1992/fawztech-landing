// Konfigurasi locale. Modul ini dipakai middleware (Edge), jadi tanpa import Node.

export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "id";

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

export const COOKIE_NAME = "NEXT_LOCALE";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 tahun

/** Header negara, dicoba berurutan; env GEO_COUNTRY_HEADER (bila ada) selalu paling dulu. */
export const GEO_HEADERS = ["x-vercel-ip-country", "cf-ipcountry", "cloudfront-viewer-country", "x-country-code"] as const;

/** Nilai negara yang berarti "tidak diketahui". */
export const UNKNOWN_COUNTRIES = ["", "XX", "T1", "ZZ"] as const;

/** Crawler dan pemindai tautan: tidak pernah diarahkan berdasarkan negara. */
export const BOT_UA_RE =
  /googlebot|bingbot|duckduckbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|applebot|petalbot|ahrefsbot|semrushbot/i;

/** Bahasa pada Accept-Language yang berarti Indonesia. */
export const ID_LANGUAGES = ["id", "in", "ms"] as const;
