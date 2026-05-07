"use client";

import { motion } from "framer-motion";

const stats = [
  { v: "25+", l: "Tahun pengalaman", k: "yrs" },
  { v: "200+", l: "Klien global", k: "clients" },
  { v: "150+", l: "Produk dirilis", k: "shipped" },
  { v: "DE↔ID", l: "Standar Jerman", k: "quality" },
];

export default function Stats() {
  return (
    <section id="about" className="relative py-20 sm:py-28 lg:py-32 border-t border-black/5">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="col-span-12 md:col-span-5">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.3em] text-electric flex items-center gap-3 font-mono">
              <span className="w-6 sm:w-8 h-px bg-electric" /> 02 — About
            </p>
            <h2 className="mt-5 sm:mt-6 font-display font-medium text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] text-balance">
              Dirakit di Indonesia.{" "}
              <em className="text-plasma not-italic font-light">Diuji</em> standar internasional.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 self-end">
            <p className="text-ink-dim text-sm sm:text-base leading-relaxed text-pretty">
              Sejak 2025, Nexvoid menyandingkan disiplin engineering Jerman dengan kelincahan studio Asia Tenggara. Kami membangun produk untuk perusahaan yang menolak kompromi antara kecepatan, ketahanan, dan keindahan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 border border-black/10 rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative p-5 sm:p-8 lg:p-10 border-r last:border-r-0 border-b lg:border-b-0 [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r border-black/10 group"
            >
              <div className="font-display font-medium text-4xl sm:text-6xl lg:text-7xl tracking-[-0.04em] text-ink leading-none">
                {s.v}
              </div>
              <div className="mt-4 sm:mt-6 flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-ink-dim">
                  {s.l}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-ink-mute hidden sm:inline">
                  /{s.k}
                </span>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-electric to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
