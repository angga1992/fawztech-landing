import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { isPortfolioAllowed } from "@/lib/site";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

// Portofolio + studi kasus. Tiap kartu klien tayang hanya bila slug-nya diizinkan lewat NEXT_PUBLIC_PORTFOLIO_CLIENTS
// (izin klien, brief §3). Tanpa klien yang diizinkan, seksi tidak dirender sama sekali. Gambar: hanya versi "blurred".
const tones = [
  { card: "theme-dark bg-navy-900 text-ink", muted: "text-ink-muted", lift: "lg:min-h-[260px]" },
  { card: "theme-dark bg-navy-500 text-ink", muted: "text-ink-muted", lift: "lg:min-h-[300px]" },
  { card: "bg-teal-600 text-white", muted: "text-white/85", lift: "lg:min-h-[280px]" },
  { card: "bg-amber-500 text-on-accent", muted: "text-on-accent", lift: "lg:min-h-[320px]" },
] as const;
const bars = ["border-navy-700", "border-teal-600", "border-amber-500"];

export default function Portfolio({ t }: { t: Dictionary }) {
  const p = t.portfolio;
  const items = p.items.map((it, i) => ({ ...it, tone: tones[i] })).filter((it) => isPortfolioAllowed(it.slug));
  if (items.length === 0) return null;
  const cs = isPortfolioAllowed(p.caseStudy.slug) ? p.caseStudy : null;

  return (
    <section id="portofolio" className="bg-surface-sunken py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{p.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{p.h2}</h2>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end list-none p-0">
          {items.map((it) => (
            <Reveal
              as="li"
              key={it.slug}
              className={`${it.tone.card} ${it.tone.lift} rounded-lg p-6 min-h-[220px] flex flex-col justify-between gap-6`}
            >
              <div>
                <p className={`font-mono text-code ${it.tone.muted}`}>{it.client}</p>
                <h3 className="mt-2 text-[24px] leading-[29px] font-extrabold">{it.title}</h3>
              </div>
              <p className={`text-body font-semibold ${it.tone.muted}`}>{it.type}</p>
            </Reveal>
          ))}
        </ul>

        {cs ? (
          <Reveal as="article" id="studi-kasus" className="mt-14 grid gap-7 lg:grid-cols-[1.25fr_1fr] lg:gap-14 items-start">
            <figure className="m-0">
              <Image
                src={cs.image}
                alt={cs.imageAlt}
                width={1600}
                height={823}
                sizes="(min-width: 1024px) 640px, 100vw"
                className="rounded-lg border border-line w-full h-auto"
              />
              <figcaption className="mt-2.5 font-mono text-code text-ink-muted">{cs.caption}</figcaption>
            </figure>
            <div>
              <Eyebrow>{cs.eyebrow}</Eyebrow>
              <h3 className="mt-2 mb-6 text-display-md sm:text-[30px] sm:leading-[36px] font-extrabold text-balance">{cs.title}</h3>
              {cs.blocks.map((b, i) => (
                <div key={b.label} className={`border-l-8 ${bars[i]} pl-5 mb-6 last:mb-0`}>
                  <p className="font-mono text-code uppercase tracking-[0.08em] text-ink-muted">{b.label}</p>
                  <p className="mt-1.5 text-[17px] leading-[27px]">{b.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
