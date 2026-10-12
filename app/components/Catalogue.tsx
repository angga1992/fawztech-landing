import type { Dictionary } from "@/lib/i18n/dictionary";
import BlockIcon, { type Bar } from "./ui/BlockIcon";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

// Katalog: delapan titik awal (4×2 desktop, 2 kolom tablet, 1 kolom mobile). Kartu bukan tautan (belum ada halaman detail).
const dark = { base: "bg-white", accent: "bg-amber-500" };
const light = { base: "bg-navy-700", accent: "bg-amber-500" };
const cards: readonly { tone: string; muted: string; base: string; accent: string; bars: readonly Bar[] }[] = [
  { tone: "theme-dark bg-navy-700 text-ink", muted: "text-ink-muted", ...dark, bars: [{ h: 24 }, { h: 40 }, { h: 60, accent: true }] },
  { tone: "bg-surface-raised text-ink border-line", muted: "text-ink-muted", ...light, bars: [{ h: 20 }, { h: 44 }, { h: 44, accent: true }] },
  { tone: "bg-amber-500 text-on-accent", muted: "text-on-accent", base: "bg-navy-900", accent: "bg-white", bars: [{ h: 48, w: 36 }, { h: 14, w: 24, accent: true }] },
  { tone: "bg-teal-600 text-white", muted: "text-white/85", ...dark, bars: [{ h: 36, w: 48 }, { h: 14, w: 16, accent: true }, { h: 14, w: 16, accent: true }] },
  { tone: "bg-mist-100 text-ink border-line", muted: "text-ink-muted", ...light, bars: [{ h: 40, w: 44 }, { h: 20, w: 24, accent: true }] },
  { tone: "theme-dark bg-navy-500 text-ink", muted: "text-ink-muted", ...dark, bars: [{ h: 18, w: 44 }, { h: 36, w: 36 }] },
  { tone: "bg-surface-raised text-ink border-line", muted: "text-ink-muted", ...light, bars: [{ h: 40, w: 48 }, { h: 14, w: 24, accent: true }] },
  { tone: "theme-dark bg-navy-700 text-ink", muted: "text-ink-muted", ...dark, bars: [{ h: 26, w: 24 }, { h: 26, w: 24, accent: true }, { h: 18, w: 48 }] },
];

export default function Catalogue({ t }: { t: Dictionary }) {
  const c = t.catalogue;
  return (
    <section id="katalog" className="py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{c.h2}</h2>
        <p className="mt-3 text-body text-ink-muted">{c.sub}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 list-none p-0">
          {c.items.map((it, i) => {
            const k = cards[i];
            return (
              <Reveal
                as="li"
                key={it.name}
                className={`${k.tone} rounded-lg border border-transparent p-6 min-h-[220px] flex flex-col justify-between gap-5`}
              >
                <BlockIcon bars={k.bars} base={k.base} accent={k.accent} height={60} />
                <div>
                  <h3 className="text-[24px] leading-[28px] font-extrabold text-balance">{it.name}</h3>
                  <p className={`mt-1.5 text-body ${k.muted}`}>{it.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
