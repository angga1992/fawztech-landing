import { DEFAULT_LOCALE, type Locale } from "./config";

/** Peta halaman per locale. Indonesia tanpa awalan; Inggris berawalan /en. */
export const ROUTES = {
  home: { id: "/", en: "/en" },
  privacy: { id: "/privasi", en: "/en/privacy" },
} as const;

export type RouteKey = keyof typeof ROUTES;

export function pathFor(locale: Locale, key: RouteKey): string {
  return ROUTES[key][locale];
}

function normalize(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname || "/";
}

/** Locale dari awalan path: /en… → en; selain itu id. */
export function localeFromPath(pathname: string): Locale {
  const p = normalize(pathname);
  return p === "/en" || p.startsWith("/en/") ? "en" : DEFAULT_LOCALE;
}

/** Buang awalan /en atau /id. "/en/privacy" → "/privacy", "/id" → "/". */
export function stripLocale(pathname: string): string {
  const p = normalize(pathname);
  for (const l of ["en", "id"]) {
    if (p === `/${l}`) return "/";
    if (p.startsWith(`/${l}/`)) return p.slice(l.length + 1);
  }
  return p;
}

/** Kunci route untuk path lengkap (termasuk awalan), atau null bila tidak dikenal. */
export function routeKeyFor(pathname: string): RouteKey | null {
  const p = normalize(pathname);
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    const r = ROUTES[key];
    if (r.id === p || r.en === p) return key;
  }
  return null;
}

/** Path padanan di locale tujuan; path tak dikenal → beranda locale tujuan. */
export function alternatePath(pathname: string, toLocale: Locale): string {
  const key = routeKeyFor(pathname) ?? "home";
  return ROUTES[key][toLocale];
}
