"use client";

import { useEffect, useRef, useState } from "react";
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

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  // Ditutup karena memilih tautan seksi: fokus dibiarkan pada seksi tujuan (AnchorScroll), bukan kembali ke tombol menu.
  const closedByLink = useRef(false);

  // Panel samping kanan (< lg), meniru menu fawz-internal: latar gelap, Escape, kunci scroll, fokus dikelola.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      document.body.style.overflow = "hidden";
      const raf = requestAnimationFrame(() => closeRef.current?.focus());
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      // Bila jendela melebar ke desktop saat panel terbuka, tutup supaya kunci scroll tidak tertinggal.
      const mq = window.matchMedia("(min-width: 1024px)");
      const onChange = () => mq.matches && setOpen(false);
      document.addEventListener("keydown", onKey);
      mq.addEventListener("change", onChange);
      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("keydown", onKey);
        mq.removeEventListener("change", onChange);
      };
    }
    document.body.style.overflow = "";
    if (wasOpen.current) {
      wasOpen.current = false;
      if (!closedByLink.current) toggleRef.current?.focus();
      closedByLink.current = false;
    }
  }, [open]);

  const closeFromLink = () => {
    closedByLink.current = true;
    setOpen(false);
  };

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
          className="max-[379px]:hidden ml-auto lg:ml-0 whitespace-nowrap px-3 sm:px-4 lg:px-5 shrink-0"
        >
          {t.navCta.label}
        </Button>

        {/* Toggle bendera: paling kanan di desktop; di mobile tepat di kiri hamburger. < 380px tombol utama
            disembunyikan (tetap ada di panel), jadi toggle yang mendorong ke kanan. */}
        <div className="max-[379px]:ml-auto shrink-0">{toggle}</div>

        <button
          type="button"
          ref={toggleRef}
          onClick={() => setOpen(true)}
          aria-label={t.header.menuOpen}
          aria-expanded={open}
          aria-controls="menu-mobile"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-sm border border-line-strong text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
      </div>

      {/* Latar gelap di balik panel (hanya < lg). */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-[rgba(7,26,47,0.6)] transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Panel menu mobile dari kanan: tautan seksi dan tombol utama (pengalih bahasa ada di bar atas). */}
      <div
        id="menu-mobile"
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={t.header.navAria}
        className={`lg:hidden theme-dark fixed inset-y-0 right-0 z-50 flex w-[min(320px,85vw)] flex-col bg-navy-900 text-ink shadow-[-12px_0_32px_rgba(7,26,47,0.35)] duration-200 ease-out ${
          // Buka: langsung visible (agar fokus ke tombol × diterima), hanya transform yang beranimasi.
          // Tutup: visibility ikut ditransisikan supaya panel baru disembunyikan setelah selesai bergeser.
          open ? "translate-x-0 visible transition-transform" : "translate-x-full invisible transition-[transform,visibility]"
        }`}
      >
        <div className="flex h-header shrink-0 items-center justify-between border-b border-line pl-5 pr-3">
          <Logo variant="dark" height={24} />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t.header.menuClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-strong text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label={t.header.navAria} className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="grid gap-0.5">
            {t.nav.map((it) => (
              <li key={it.href}>
                <a
                  href={section(it.href)}
                  onClick={closeFromLink}
                  className="flex items-center min-h-[48px] px-3 rounded-md text-[16px] font-semibold text-ink-muted no-underline hover:bg-surface-raised hover:text-ink"
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line px-5 py-5 grid gap-4">
          <Button href={section(t.navCta.href)} variant="amber" onClick={closeFromLink} className="w-full whitespace-nowrap">
            {t.navCta.label}
          </Button>
        </div>
      </div>
    </header>
  );
}
