import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_MAX_AGE, COOKIE_NAME, GEO_HEADERS, isLocale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/resolve";

// Hanya route halaman: lewati API, aset Next, folder aset statis, dan berkas bertitik (favicon.svg, sitemap.xml).
export const config = {
  matcher: ["/((?!api|_next|fonts|svg|illustrations|brand|.*\\..*).*)"],
};

function countryFrom(req: NextRequest): string | null {
  const custom = process.env.GEO_COUNTRY_HEADER?.trim().toLowerCase();
  const names = custom ? [custom, ...GEO_HEADERS] : [...GEO_HEADERS];
  for (const name of names) {
    const v = req.headers.get(name);
    if (v) return v;
  }
  return null;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Pilihan eksplisit dari pengalih bahasa: pasang cookie, lalu kembali ke URL tanpa ?lang=.
  const lang = url.searchParams.get("lang");
  if (lang !== null) {
    const clean = url.clone();
    clean.searchParams.delete("lang");
    const res = NextResponse.redirect(clean, 302);
    if (isLocale(lang)) {
      res.cookies.set({
        name: COOKIE_NAME,
        value: lang,
        maxAge: COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax",
        secure: url.protocol === "https:",
      });
    }
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  const result = resolveLocale({
    pathname: url.pathname,
    search: url.search,
    cookie: req.cookies.get(COOKIE_NAME)?.value ?? null,
    country: countryFrom(req),
    acceptLanguage: req.headers.get("accept-language"),
    userAgent: req.headers.get("user-agent"),
  });

  // x-locale dipakai not-found.tsx (tidak menerima params).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", result.locale);

  if (result.action === "pass") return NextResponse.next({ request: { headers: requestHeaders } });
  if (result.action === "rewrite") {
    return NextResponse.rewrite(new URL(result.target, req.url), { request: { headers: requestHeaders } });
  }
  const res = NextResponse.redirect(new URL(result.target, req.url), result.status);
  if (result.status === 302) {
    // Bergantung pada pengunjung: jangan di-cache oleh CDN. Geo tidak memasang cookie.
    res.headers.set("Cache-Control", "private, no-store");
    res.headers.set("Vary", "Cookie");
  }
  return res;
}
