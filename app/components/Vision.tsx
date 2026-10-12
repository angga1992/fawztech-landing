import type { Dictionary } from "@/lib/i18n/dictionary";
import Eyebrow from "./ui/Eyebrow";

// Visi: latar navy-700, teks putih, blok amber kecil di atas (brief §3).
export default function Vision({ t }: { t: Dictionary }) {
  const v = t.vision;
  return (
    <section id="visi" className="theme-dark bg-navy-700 text-ink py-14 lg:py-[72px]">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <span aria-hidden="true" className="block w-14 h-4 rounded-sm bg-amber-500 mb-5" />
        <Eyebrow tone="dark">{v.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-display-xl-sm sm:text-display-xl max-w-[900px] text-balance">{v.h2}</h2>
        <p className="mt-5 text-[18px] leading-[28px] text-ink-muted max-w-[620px]">{v.text}</p>
      </div>
    </section>
  );
}
