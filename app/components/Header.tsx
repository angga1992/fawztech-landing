"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { HeaderDictionary } from "@/lib/i18n/dictionary";
import { pathFor, type RouteKey } from "@/lib/i18n/routes";
import { fill } from "@/lib/i18n/dictionary";
import { SECTION_PARAM } from "./ui/AnchorScroll";
import Button from "./ui/Button";
import Flag from "./ui/Flag";
import Logo from "./ui/Logo";

type Props = {
  t: HeaderDictionary;
  locale: Locale;
  routeKey: RouteKey;
};

export default function Header({ t, locale, routeKey }: Props) {
  const [open, setOpen] = useState(false);
  const home = pathFor(locale, "home");
  const other: Locale = locale === "id" ? "en" : "id";
  // Pengalih bahasa: tautan biasa (bekerja tanpa JavaScript); middleware memasang cookie dari ?lang=.
  const switchHref = `${pathFor(other, routeKey)}?lang=${other}`;
  // Tautan ke seksi: di beranda berupa anchor (dicegat AnchorScroll, URL tidak berubah);
  // dari halaman lain ke beranda dengan ?s=id yang dibersihkan setelah menggulir. Tidak ada "#" di URL.
  const onHome = routeKey === "home";
  const section = (hash: string) => (onHome ? hash : `${home}?${SECTION_PARAM}=${hash.replace(/^#/, "")}`);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Toggle bendera: satu tautan ke locale lain; bendera aktif ditonjolkan, yang lain diredupkan.
  const otherLabel = other === "id" ? t.switcher.labelId : t.switcher.labelEn;
  const switchLabel = fill(t.switcher.switchTo, { lang: otherLabel });
  const flagSlot = (l: Locale) => (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-pill transition-colors ${
        l === locale ? "bg-surface-raised border border-line" : "opacity-45"
      }`}
    >
      <Flag code={l} size={18} />
    </span>
  );
  const toggle = (
    <a
      href={switchHref}
      hrefLang={other}
      lang={other}
      aria-label={switchLabel}
      title={switchLabel}
      className="inline-flex items-center gap-0.5 h-11 px-1 rounded-pill border border-line bg-surface-sunken no-underline hover:border-line-strong shrink-0"
    >
      {flagSlot("id")}
      {flagSlot("en")}
    </a>
  );

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-line">
      <div className="mx-auto max-w-content px-4 md:px-8 h-header flex items-center gap-2 sm:gap-3 lg:gap-6">
        <a href={onHome ? "#atas" : home} aria-label={t.header.logoAria} className="inline-flex rounded-sm shrink-0">
          {/* Layar sempit: tanda F saja agar logo, tombol utama, dan hamburger muat di 360px. */}
          <span className="sm:hidden inline-flex"><Logo mark height={32} /></span>
          <span className="hidden sm:inline-flex"><Logo height={32} /></span>
        </a>

        <nav aria-label={t.header.navAria} className="hidden lg:flex items-center gap-5 xl:gap-6 ml-auto">
          {t.nav.map((it) => (
            <a
              key={it.href}
              href={section(it.href)}
              className="inline-flex items-center min-h-[44px] px-1 text-[14px] font-semibold text-ink no-underline hover:text-link rounded-sm"
            >
              {it.label}
            </a>
          ))}
        </nav>

        {/* Di bawah lg: logo + tombol utama + hamburger (brief: "logo + tombol, tautan lain masuk menu"). CTA satu baris. */}
        <Button
          href={section(t.navCta.href)}
          variant="primary"
          className="ml-auto lg:ml-0 whitespace-nowrap px-3 sm:px-4 lg:px-5 shrink-0"
        >
          {t.navCta.label}
        </Button>

        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          aria-label={open ? t.header.menuClose : t.header.menuOpen}
          aria-expanded={open}
          aria-controls="menu-mobile"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-sm border border-line-strong text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>

        {/* Desktop (lg+): toggle bendera paling kanan. Di bawah lg toggle ada di dalam menu. */}
        <div className="hidden lg:block">{toggle}</div>
      </div>

      {/* Panel menu mobile: tautan seksi, pengalih bahasa, dan tombol utama. */}
      <nav
        id="menu-mobile"
        aria-label={t.header.navAria}
        hidden={!open}
        className="lg:hidden absolute left-0 right-0 top-full border-b border-line bg-surface max-h-[calc(100vh-var(--header-h))] overflow-y-auto"
      >
        <ul className="mx-auto max-w-content px-4 py-2">
          {t.nav.map((it) => (
            <li key={it.href}>
              <a
                href={section(it.href)}
                onClick={() => setOpen(false)}
                className="flex items-center min-h-[48px] px-2 text-[16px] font-semibold text-ink no-underline rounded-sm hover:bg-surface-sunken"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mx-auto max-w-content px-4 pb-4 pt-3 border-t border-line flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {toggle}
            <span className="text-body-sm text-ink-muted">{locale === "id" ? t.switcher.labelId : t.switcher.labelEn}</span>
          </div>
          <Button href={section(t.navCta.href)} variant="primary" className="whitespace-nowrap" onClick={() => setOpen(false)}>
            {t.navCta.label}
          </Button>
        </div>
      </nav>
    </header>
  );
}
