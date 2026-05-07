"use client";

import { motion } from "framer-motion";

const services = [
  {
    no: "01",
    title: "Mobile App",
    desc: "Aplikasi native dan cross-platform untuk Play Store & App Store. Performa tinggi, UI presisi, ready-scale.",
    tags: ["iOS", "Android", "Flutter", "React Native"],
  },
  {
    no: "02",
    title: "Web App",
    desc: "E-commerce, SaaS, dashboard internal — arsitektur modern, SEO-first, dan siap berkembang bersama bisnis.",
    tags: ["Next.js", "Nuxt", "Headless CMS"],
  },
  {
    no: "03",
    title: "UI / UX Design",
    desc: "Antarmuka intuitif yang memetakan alur bisnis ke layar dengan ketat. Riset, wireframe, hingga handoff.",
    tags: ["Research", "Prototyping", "Design Systems"],
  },
  {
    no: "04",
    title: "Custom ERP",
    desc: "Modul keuangan, inventory, HRM, hingga warehouse — cloud atau on-premise — disesuaikan operasi Anda.",
    tags: ["Cloud", "On-Premise", "Integrations"],
  },
  {
    no: "05",
    title: "Backend & AI",
    desc: "API skala produksi, otomasi proses, dan integrasi AI: route optimization, payment, OCR, dan lainnya.",
    tags: ["Node", "Go", "Python", "LLM"],
  },
];

export default function Services() {
  return (
    <section id="solutions" className="relative py-20 sm:py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="col-span-12 md:col-span-4">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.3em] text-electric flex items-center gap-3 font-mono">
              <span className="w-6 sm:w-8 h-px bg-electric" /> 01 — Solutions
            </p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2 className="font-display font-medium text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.04em] text-balance">
              Lima disiplin.{" "}
              <em className="text-plasma not-italic font-light">Satu</em> standar eksekusi.
            </h2>
          </div>
        </div>

        <ul className="border-t border-black/10">
          {services.map((s, i) => (
            <motion.li
              key={s.no}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group relative border-b border-black/10 hover:bg-gradient-to-r hover:from-violet/5 hover:to-transparent transition-colors"
            >
              <div className="grid grid-cols-12 gap-3 sm:gap-6 py-6 sm:py-8 md:py-10 items-baseline">
                <div className="col-span-2 md:col-span-1">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-ink-mute">
                    {s.no}
                  </span>
                </div>
                <div className="col-span-10 md:col-span-4">
                  <h3 className="font-display font-medium text-2xl sm:text-3xl md:text-5xl leading-none tracking-[-0.03em]">
                    {s.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <p className="text-ink-dim text-sm leading-relaxed text-pretty max-w-md">
                    {s.desc}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-2 flex flex-wrap gap-1.5 md:justify-end">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full border border-black/10 text-[10px] uppercase tracking-[0.14em] text-ink-mute font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-electric opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden md:block">
                ↗
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
