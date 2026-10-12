"use client";

import { useEffect, useState } from "react";

// Tombol WhatsApp melayang di pojok kanan bawah (brief §1: aksi utama = form atau WhatsApp).
// Gaya mengikuti panduan desain: amber dengan teks navy-900, ikon garis 1.75px, tanpa emoji.
// Disembunyikan saat seksi #kontak terlihat (sudah ada tombol WhatsApp dan form di sana) agar tidak menutupi form.
export default function FloatingWa({ href, label }: { href: string; label: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("kontak");
    if (!contact || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={label}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      onClick={() => window.plausible?.("whatsapp_click", { props: { position: "floating" } })}
      className={`fixed z-30 right-4 bottom-4 sm:right-6 sm:bottom-6 inline-flex items-center gap-2 min-h-[52px] min-w-[52px] justify-center rounded-pill px-4 sm:px-5 bg-amber-500 text-on-accent font-semibold text-[15px] no-underline shadow-[0_8px_24px_rgba(7,26,47,0.28)] border border-navy-900/10 hover:bg-[var(--fawz-amber-400)] transition-[opacity,transform,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700 ${
        hidden ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {/* Gelembung pesan bergaya garis (setara Lucide "message-circle"). */}
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M9 10h.01M12 10h.01M15 10h.01" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
