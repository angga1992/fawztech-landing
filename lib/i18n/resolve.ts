import { BOT_UA_RE, ID_LANGUAGES, UNKNOWN_COUNTRIES, isLocale, type Locale } from "./config";
import { alternatePath, routeKeyFor } from "./routes";

export type ResolveInput = {
  pathname: string;
  /** Query string termasuk "?" atau kosong. */
  search?: string;
  cookie?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
  userAgent?: string | null;
};

export type ResolveResult =
  | { action: "pass"; locale: Locale }
  | { action: "rewrite"; locale: "id"; target: string }
  | { action: "redirect"; locale: Locale; target: string; status: 301 | 302 };

/** Urutkan bahasa pada Accept-Language berdasarkan bobot q, kembalikan kode dasar (en-US → en). */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const weight = q ? Number(q.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split("-")[0], weight: Number.isFinite(weight) ? weight : 0, i };
    })
    .filter((x) => x.lang && x.lang !== "*" && x.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.i - b.i)
    .map((x) => x.lang);
}

function normalizeCountry(c: string | null | undefined): string | null {
  const v = (c ?? "").trim().toUpperCase();
  return (UNKNOWN_COUNTRIES as readonly string[]).includes(v) ? null : v;
}

function trimSlash(p: string): string {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p || "/";
}

/**
 * Tentukan locale untuk sebuah permintaan. Fungsi murni, tanpa Next.js.
 * Prioritas untuk path tanpa awalan: bot → cookie → negara → Accept-Language → id.
 */
export function resolveLocale(input: ResolveInput): ResolveResult {
  const pathname = trimSlash(input.pathname);
  const search = input.search ?? "";

  // 1. Sudah berawalan /en: sajikan apa adanya.
  if (pathname === "/en" || pathname.startsWith("/en/")) return { action: "pass", locale: "en" };

  // 2. Awalan /id tidak dipakai: alihkan permanen ke path tanpa awalan.
  if (pathname === "/id" || pathname.startsWith("/id/")) {
    const bare = pathname === "/id" ? "/" : pathname.slice(3);
    return { action: "redirect", locale: "id", target: bare + search, status: 301 };
  }

  const rewrite: ResolveResult = { action: "rewrite", locale: "id", target: `/id${pathname === "/" ? "" : pathname}${search}` };
  const toEn = (): ResolveResult => {
    // Hanya halaman yang dikenal yang dialihkan; path lain disajikan apa adanya (404 Indonesia).
    if (!routeKeyFor(pathname)) return rewrite;
    return { action: "redirect", locale: "en", target: alternatePath(pathname, "en") + search, status: 302 };
  };

  // 3. Crawler: selalu Indonesia pada path tanpa awalan.
  if (input.userAgent && BOT_UA_RE.test(input.userAgent)) return rewrite;

  // 4. Pilihan eksplisit lewat cookie.
  if (isLocale(input.cookie)) return input.cookie === "en" ? toEn() : rewrite;

  // 5. Negara dari header geo.
  const country = normalizeCountry(input.country);
  if (country) return country === "ID" ? rewrite : toEn();

  // 6. Accept-Language.
  const langs = parseAcceptLanguage(input.acceptLanguage);
  if (langs.length === 0) return rewrite;
  return (ID_LANGUAGES as readonly string[]).includes(langs[0]) ? rewrite : toEn();
}
