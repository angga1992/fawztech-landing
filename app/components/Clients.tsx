"use client";

import { motion } from "framer-motion";

const clients = [
  "Astra",
  "Pertamina",
  "Telkomsel",
  "BCA",
  "Unilever",
  "Garuda",
  "Bluebird",
  "Indofood",
  "Mayora",
  "Sinar Mas",
];

const quote = {
  body: "Tim Nexvoid mengirimkan modul WMS dalam empat bulan — dengan kualitas yang biasanya kami harapkan dari vendor di Eropa. Mereka tidak menjual jam, mereka menjual hasil.",
  by: "VP of Operations",
  org: "Indonesian Logistics Group",
};

export default function Clients() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-8 sm:gap-10 items-start">
          <div className="col-span-12 md:col-span-5">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.3em] text-electric flex items-center gap-3 font-mono">
              <span className="w-6 sm:w-8 h-px bg-electric" /> 05 — Trust
            </p>
            <h2 className="mt-5 sm:mt-6 font-display font-medium text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.04em] text-balance">
              Dipercaya oleh{" "}
              <em className="text-plasma not-italic font-light">200+</em> perusahaan.
            </h2>

            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-2 sm:gap-y-3">
              {clients.map((c) => (
                <div
                  key={c}
                  className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.16em] text-ink-mute py-2 border-b border-black/5"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="col-span-12 md:col-span-7 md:col-start-7 relative rounded-2xl sm:rounded-3xl border border-black/10 bg-gradient-to-br from-white/80 to-white/40 p-7 sm:p-10 lg:p-14 overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute -top-32 -right-32 w-80 h-80 glow-orb opacity-30"
            />
            <span className="font-display text-[7rem] sm:text-[10rem] leading-none text-electric/30 absolute top-0 sm:top-2 left-4 sm:left-6 select-none">
              “
            </span>
            <blockquote className="relative font-display font-medium text-xl sm:text-2xl md:text-4xl leading-[1.2] tracking-[-0.02em] text-balance pt-4 sm:pt-0">
              {quote.body}
            </blockquote>
            <figcaption className="relative mt-8 sm:mt-10 flex items-center justify-between gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-ink-mute font-mono flex-wrap">
              <span>
                {quote.by} ·{" "}
                <span className="text-ink-dim">{quote.org}</span>
              </span>
              <span className="font-mono text-electric">★★★★★</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
