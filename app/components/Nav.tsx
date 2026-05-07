"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const items = [
  { href: "#solutions", label: "Solutions" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-void-950/70 border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <Image
            src="/nexvoid-mark.png"
            alt="Nexvoid logo"
            width={381}
            height={289}
            className="h-9 sm:h-11 w-auto transition-transform group-hover:scale-105"
            priority
          />
          <span className="font-mono text-[13px] sm:text-sm tracking-[0.18em] text-ink uppercase">
            Nex<span className="text-electric">void</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="px-3 py-2 text-[12px] uppercase tracking-[0.16em] text-ink-dim hover:text-ink transition-colors relative group font-mono"
              >
                {it.label}
                <span className="absolute left-3 right-3 -bottom-px h-px bg-gradient-to-r from-electric to-violet scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] uppercase tracking-[0.16em] bg-ink text-void-950 hover:bg-electric hover:text-void-950 transition-colors font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
            Start a project
          </a>
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
            aria-expanded={open}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full border border-black/10 hover:border-electric transition-colors"
          >
            <span className="relative block w-4 h-3">
              <span className={`absolute left-0 right-0 h-px bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 right-0 h-px bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "bottom-0"}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-void-950/95 backdrop-blur-xl">
          <ul className="px-5 py-4 flex flex-col gap-1">
            {items.map((it) => (
              <li key={it.href}>
                <a
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm uppercase tracking-[0.16em] text-ink-dim hover:text-ink font-mono"
                >
                  {it.label}
                </a>
              </li>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center px-4 py-3 rounded-full text-[12px] uppercase tracking-[0.16em] bg-ink text-void-950 font-mono"
            >
              Start a project
            </a>
          </ul>
        </div>
      )}
    </header>
  );
}
