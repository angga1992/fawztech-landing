"use client";

import { motion } from "framer-motion";

const cases = [
  {
    n: "F.01",
    title: "Route Optimization AI",
    industry: "Logistics",
    body: "Engine routing real-time untuk armada distribusi nasional. Penghematan jarak 18%, waktu tempuh −22%.",
    metric: "−22% travel time",
  },
  {
    n: "F.02",
    title: "Payment Gateway Mesh",
    industry: "FinTech",
    body: "Integrasi multi-acquirer dengan failover otomatis, idempotent, dan rekonsiliasi harian.",
    metric: "99.99% uptime",
  },
  {
    n: "F.03",
    title: "Warehouse OS",
    industry: "Retail",
    body: "Sistem WMS dengan barcode + handheld, sinkron SAP. Akurasi stok 99.6% sejak go-live.",
    metric: "99.6% accuracy",
  },
  {
    n: "F.04",
    title: "SAP Mobility Suite",
    industry: "Enterprise",
    body: "Field-app mobile yang melekat pada SAP backend — inspeksi, work order, hingga e-signature offline.",
    metric: "Offline-first",
  },
];

export default function Solutions() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 sm:mb-16 flex-wrap gap-4 sm:gap-6">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.3em] text-electric flex items-center gap-3 font-mono">
              <span className="w-6 sm:w-8 h-px bg-electric" /> 03 — Featured Work
            </p>
            <h2 className="mt-5 sm:mt-6 font-display font-medium text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.04em] text-balance">
              Studi kasus <em className="text-plasma not-italic font-light">terpilih</em>.
            </h2>
          </div>
          <p className="font-mono text-[10px] sm:text-[11px] tracking-widest text-ink-mute">
            [ 04 / many ]
          </p>
        </div>

        <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          {cases.map((c, i) => (
            <motion.article
              key={c.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`relative col-span-12 md:col-span-6 group overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-white/80 to-white/40 p-6 sm:p-8 lg:p-10 hover:border-electric/40 transition-colors ${
                i % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"
              }`}
            >
              <div
                aria-hidden
                className="absolute -top-24 -right-24 w-64 h-64 glow-orb opacity-0 group-hover:opacity-40 transition-opacity duration-700"
              />
              <header className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute font-mono">
                <span>{c.n}</span>
                <span>{c.industry}</span>
              </header>

              <h3 className="mt-6 sm:mt-8 font-display font-medium text-3xl sm:text-4xl md:text-5xl leading-[0.95] tracking-[-0.03em] text-balance">
                {c.title}
              </h3>

              <p className="mt-4 sm:mt-6 text-ink-dim text-sm leading-relaxed max-w-md text-pretty">
                {c.body}
              </p>

              <footer className="mt-8 sm:mt-10 flex items-center justify-between gap-3 flex-wrap">
                <span className="font-mono text-xs px-3 py-1.5 rounded-full bg-electric/10 border border-electric/30 text-electric">
                  {c.metric}
                </span>
                <span className="text-ink-dim text-sm group-hover:text-ink transition-colors">
                  Read case ↗
                </span>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
