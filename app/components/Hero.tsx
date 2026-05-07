"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 overflow-hidden noise">
      {/* grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />
      {/* orbs */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[40rem] h-[40rem] glow-orb opacity-50 animate-pulse-slow"
      />
      <div
        aria-hidden
        className="absolute bottom-0 -left-40 w-[36rem] h-[36rem] glow-orb opacity-30"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* meta strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-3 text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.2em] uppercase text-ink-mute mb-10 sm:mb-12 font-mono"
        >
          <span className="truncate">[ ID · 06°17′ S ]</span>
          <span className="hidden md:inline">Software · Engineered with intent</span>
          <span className="shrink-0">v.2026</span>
        </motion.div>

        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-end">
          <div className="col-span-12 lg:col-span-9">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-[10px] sm:text-[11px] tracking-[0.24em] sm:tracking-[0.3em] uppercase text-electric mb-6 sm:mb-8 flex items-center gap-3 font-mono"
            >
              <span className="w-6 sm:w-8 h-px bg-electric" />
              Software house · Est. 2025
            </motion.p>

            <h1 className="font-display font-medium leading-[0.9] tracking-[-0.04em] text-ink text-balance">
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8 }}
                className="block text-[clamp(3rem,15vw,9rem)] lg:text-[8.4vw]"
              >
                Inovasi
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="block text-[clamp(3rem,15vw,9rem)] lg:text-[8.4vw]"
              >
                <em className="text-plasma not-italic font-light">tanpa</em>{" "}
                <span className="text-ink-dim">/</span> batas
              </motion.span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="col-span-12 lg:col-span-3 lg:pb-6 flex flex-col gap-6"
          >
            <div className="relative w-40 sm:w-48 lg:w-full aspect-[381/289]">
              <div className="absolute inset-0 rounded-full bg-electric/20 blur-3xl animate-pulse-slow" />
              <Image
                src="/nexvoid-mark.png"
                alt="Nexvoid mark"
                fill
                sizes="(min-width:1024px) 18rem, 12rem"
                className="object-contain drop-shadow-[0_0_30px_rgba(40,66,230,0.5)]"
                priority
              />
            </div>
            <p className="text-ink-dim text-sm sm:text-[15px] leading-relaxed max-w-md lg:max-w-xs text-pretty">
              Bisnis lebih efisien dengan solusi software yang tepat. Mobile, web, ERP, dan AI, dirakit dengan standar teknologi Jerman.
            </p>
          </motion.div>
        </div>

        {/* hero footer row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12 sm:mt-16 lg:mt-24 grid grid-cols-12 gap-4 sm:gap-6 items-center"
        >
          <div className="col-span-12 md:col-span-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-ink text-void-950 hover:bg-electric hover:text-void-950 transition-all"
            >
              <span className="px-3 py-2 text-[11px] sm:text-[12px] uppercase tracking-[0.16em] sm:tracking-[0.18em] font-mono">
                Start a project
              </span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-void-950 text-ink grid place-items-center group-hover:rotate-45 transition-transform">
                ↗
              </span>
            </a>
            <a
              href="#solutions"
              className="text-[11px] sm:text-[12px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-ink-dim hover:text-ink font-mono"
            >
              See solutions
            </a>
          </div>

          <div className="col-span-12 md:col-span-6 flex md:justify-end items-center gap-4 sm:gap-8 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-ink-mute font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Accepting Q3 briefs
            </div>
            <div className="hidden lg:block">↓ scroll</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
