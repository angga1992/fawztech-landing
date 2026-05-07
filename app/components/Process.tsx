"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "I",
    t: "Discovery",
    d: "Workshop dua minggu. Memetakan ambisi bisnis ke arsitektur, risiko, dan KPI yang dapat diukur.",
  },
  {
    n: "II",
    t: "Architecture",
    d: "Stack, data model, integrasi. Dokumen ADR, RFC, dan blueprint sistem ditandatangani sebelum baris kode pertama.",
  },
  {
    n: "III",
    t: "Build",
    d: "Sprint dua-mingguan, demo terbuka, CI/CD sejak hari pertama. Setiap commit reviewable.",
  },
  {
    n: "IV",
    t: "Harden",
    d: "Pen-test, observability, performance budget. Standar SLA: 99.9% atau lebih baik.",
  },
  {
    n: "V",
    t: "Operate",
    d: "Maintenance proaktif, on-call rotation, dan roadmap evolusi 12 bulan ke depan.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative py-20 sm:py-28 lg:py-40 border-t border-black/5"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="col-span-12 md:col-span-5">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.3em] text-electric flex items-center gap-3 font-mono">
              <span className="w-6 sm:w-8 h-px bg-electric" /> 04 — Process
            </p>
            <h2 className="mt-5 sm:mt-6 font-display font-medium text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] text-balance">
              Lima fase. <em className="text-plasma not-italic font-light">Nol</em> kejutan.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 self-end">
            <p className="text-ink-dim text-sm sm:text-base leading-relaxed text-pretty">
              Engineering tanpa drama: setiap fase memiliki gerbang keluar yang jelas, deliverable yang terukur, dan referensi ADR untuk setiap keputusan arsitektural.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-6 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent hidden md:block" />
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="relative pl-16 md:pl-0 md:pt-16"
              >
                <div className="absolute top-0 left-0 w-11 h-11 sm:w-12 sm:h-12 grid place-items-center rounded-full bg-white border border-black/10 font-mono text-xs text-electric">
                  {s.n}
                </div>
                <h3 className="font-display font-medium text-xl sm:text-2xl mb-2 sm:mb-3 tracking-[-0.02em]">{s.t}</h3>
                <p className="text-ink-dim text-sm leading-relaxed text-pretty">
                  {s.d}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
