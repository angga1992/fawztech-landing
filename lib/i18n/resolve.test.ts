import { describe, expect, it } from "vitest";
import { parseAcceptLanguage, resolveLocale } from "./resolve";

const GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

describe("parseAcceptLanguage", () => {
  it("mengurutkan berdasarkan bobot dan mengambil kode dasar", () => {
    expect(parseAcceptLanguage("en-US,en;q=0.9,id;q=0.8")).toEqual(["en", "en", "id"]);
    expect(parseAcceptLanguage("id-ID,id;q=0.9,en;q=0.8")[0]).toBe("id");
    expect(parseAcceptLanguage("fr;q=0.5,de")[0]).toBe("de");
    expect(parseAcceptLanguage("")).toEqual([]);
    expect(parseAcceptLanguage("*")).toEqual([]);
  });
});

describe("resolveLocale", () => {
  it("melewatkan path berawalan /en", () => {
    expect(resolveLocale({ pathname: "/en" })).toEqual({ action: "pass", locale: "en" });
    expect(resolveLocale({ pathname: "/en/privacy", country: "ID" })).toEqual({ action: "pass", locale: "en" });
  });

  it("mengalihkan awalan /id secara permanen", () => {
    expect(resolveLocale({ pathname: "/id" })).toEqual({ action: "redirect", locale: "id", target: "/", status: 301 });
    expect(resolveLocale({ pathname: "/id/privasi", search: "?a=1" })).toEqual({
      action: "redirect", locale: "id", target: "/privasi?a=1", status: 301,
    });
  });

  it("negara ID → rewrite Indonesia", () => {
    expect(resolveLocale({ pathname: "/", country: "ID" })).toEqual({ action: "rewrite", locale: "id", target: "/id" });
    expect(resolveLocale({ pathname: "/privasi", country: "id" })).toEqual({ action: "rewrite", locale: "id", target: "/id/privasi" });
  });

  it("negara lain → redirect 302 ke /en dengan query dipertahankan", () => {
    expect(resolveLocale({ pathname: "/", country: "US" })).toEqual({ action: "redirect", locale: "en", target: "/en", status: 302 });
    expect(resolveLocale({ pathname: "/", search: "?utm_source=ig", country: "AU" })).toEqual({
      action: "redirect", locale: "en", target: "/en?utm_source=ig", status: 302,
    });
    expect(resolveLocale({ pathname: "/privasi", country: "SG" })).toEqual({
      action: "redirect", locale: "en", target: "/en/privacy", status: 302,
    });
  });

  it("path tak dikenal tidak dialihkan walau dari luar negeri", () => {
    expect(resolveLocale({ pathname: "/fr", country: "US" })).toEqual({ action: "rewrite", locale: "id", target: "/id/fr" });
  });

  it("negara tidak diketahui → Accept-Language", () => {
    expect(resolveLocale({ pathname: "/", country: "XX", acceptLanguage: "en-US,en;q=0.9" }).action).toBe("redirect");
    expect(resolveLocale({ pathname: "/", acceptLanguage: "id-ID,id;q=0.9,en;q=0.8" }).action).toBe("rewrite");
    expect(resolveLocale({ pathname: "/", acceptLanguage: "ms-MY" }).action).toBe("rewrite");
    expect(resolveLocale({ pathname: "/", acceptLanguage: "de" }).action).toBe("redirect");
  });

  it("tanpa negara dan tanpa Accept-Language → Indonesia", () => {
    expect(resolveLocale({ pathname: "/" })).toEqual({ action: "rewrite", locale: "id", target: "/id" });
  });

  it("cookie mengalahkan negara", () => {
    expect(resolveLocale({ pathname: "/", country: "ID", cookie: "en" })).toEqual({
      action: "redirect", locale: "en", target: "/en", status: 302,
    });
    expect(resolveLocale({ pathname: "/", country: "US", cookie: "id" })).toEqual({ action: "rewrite", locale: "id", target: "/id" });
  });

  it("cookie tidak valid diabaikan", () => {
    expect(resolveLocale({ pathname: "/", country: "US", cookie: "fr" }).action).toBe("redirect");
  });

  it("bot tidak pernah dialihkan", () => {
    expect(resolveLocale({ pathname: "/", country: "US", userAgent: GOOGLEBOT })).toEqual({
      action: "rewrite", locale: "id", target: "/id",
    });
    expect(resolveLocale({ pathname: "/", country: "US", cookie: "en", userAgent: "WhatsApp/2.23.4" }).action).toBe("rewrite");
    expect(resolveLocale({ pathname: "/en", userAgent: GOOGLEBOT })).toEqual({ action: "pass", locale: "en" });
  });

  it("garis miring di akhir dinormalkan", () => {
    expect(resolveLocale({ pathname: "/privasi/", country: "ID" }).action).toBe("rewrite");
    expect(resolveLocale({ pathname: "/en/" })).toEqual({ action: "pass", locale: "en" });
  });
});
