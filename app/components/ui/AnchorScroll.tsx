"use client";

import { useEffect } from "react";

// Gulir ke seksi tanpa menulis "#id" ke URL.
// 1) Klik tautan ke anchor di halaman yang sama (href "#x" atau "/path#x") dicegat: gulir halus + fokus ke seksi.
// 2) Saat dibuka dengan ?s=x (dari halaman lain) atau #x, gulir ke seksi itu lalu bersihkan URL.
// Tanpa JavaScript, tautan tetap bekerja sebagai anchor biasa.
export const SECTION_PARAM = "s";

function scrollToId(id: string, focus: boolean) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (focus) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
  return true;
}

export default function AnchorScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      if (scrollToId(id, true)) e.preventDefault();
    };
    document.addEventListener("click", onClick);

    const url = new URL(location.href);
    const fromQuery = url.searchParams.get(SECTION_PARAM);
    const target = fromQuery ?? (url.hash ? decodeURIComponent(url.hash.slice(1)) : null);
    if (target) {
      url.searchParams.delete(SECTION_PARAM);
      url.hash = "";
      history.replaceState(history.state, "", url.pathname + url.search);
      // Tunggu satu frame supaya tata letak (font, gambar) sudah terpasang.
      requestAnimationFrame(() => scrollToId(target, false));
    }
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
