import type { Dictionary } from "@/lib/i18n/dictionary";
import BlockIcon, { type Bar } from "./ui/BlockIcon";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

// Lima kartu berwarna dengan tinggi menanjak di desktop (2 kolom di mobile). Ikon dari blok CSS, bukan gambar.
const cards: readonly { tone: string; muted: string; base: string; accent: string; lift: string; bars: readonly Bar[] }[] = [
  { tone: "theme-dark bg-navy-700 text-ink", muted: "text-ink-muted", base: "bg-white", accent: "bg-amber-500", lift: "lg:min-h-[220px]", bars: [{ h: 30 }, { h: 44, accent: true }] },
  { tone: "theme-dark bg-navy-500 text-ink", muted: "text-ink-muted", base: "bg-white", accent: "bg-amber-500", lift: "lg:min-h-[270px]", bars: [{ h: 44 }, { h: 28 }, { h: 20, accent: true }] },
  { tone: "bg-teal-600 text-white", muted: "text-white/85", base: "bg-white", accent: "bg-amber-500", lift: "lg:min-h-[320px]", bars: [{ h: 48 }, { h: 36 }, { h: 42 }, { h: 18, accent: true }] },
  { tone: "bg-surface-raised text-ink border-line", muted: "text-ink-muted", base: "bg-navy-700", accent: "bg-amber-500", lift: "lg:min-h-[370px]", bars: [{ h: 16 }, { h: 30 }, { h: 44 }, { h: 12, accent: true }] },
  { tone: "bg-amber-500 text-on-accent", muted: "text-on-accent", base: "bg-navy-900", accent: "bg-white", lift: "lg:min-h-[420px]", bars: [{ h: 34, w: 44 }] },
];

export default function Values({ t }: { t: Dictionary }) {
  const v = t.values;
  return (
    <section id="nilai" className="bg-surface-sunken py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{v.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{v.h2}</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5 lg:items-end">
          {v.items.map((it, i) => {
            const c = cards[i];
            return (
              <Reveal
                as="article"
                key={it.title}
                className={`${c.tone} ${c.lift} rounded-lg border border-transparent p-5 sm:p-6 min-h-[180px] flex flex-col justify-between gap-6`}
              >
                <BlockIcon bars={c.bars} base={c.base} accent={c.accent} />
                <div>
                  <h3 className="text-[24px] leading-[28px] sm:text-[28px] sm:leading-[32px] font-extrabold">{it.title}</h3>
                  <p className={`mt-1.5 text-[15px] leading-[22px] ${c.muted}`}>{it.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
