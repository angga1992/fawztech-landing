import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

// Siapa kami: teks kiri, ilustrasi tim + dua blok statistik (navy dan amber) di kanan.
export default function About({ t }: { t: Dictionary }) {
  const a = t.about;
  const [year, name] = a.stats;
  return (
    <section id="tentang" className="py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{a.eyebrow}</Eyebrow>
        <Reveal className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-display-xl-sm sm:text-display-xl text-balance">{a.h2}</h2>
            <p className="mt-5 text-[18px] leading-[28px] max-w-[560px]">
              {a.text} <strong className="font-extrabold text-ink">{a.slogan}</strong>
            </p>
          </div>
          <div>
            <Image src={a.image} alt="" width={960} height={640} unoptimized className="rounded-lg w-full h-auto" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="theme-dark bg-navy-700 text-ink rounded-lg p-5 min-h-[130px] flex flex-col justify-between">
                <p className="text-[40px] leading-[44px] font-extrabold tracking-[-0.03em]">{year.big}</p>
                <p className="text-body-sm font-medium text-ink-muted">{year.label}</p>
              </div>
              <div className="bg-amber-500 text-on-accent rounded-lg p-5 min-h-[130px] flex flex-col justify-between">
                <p className="text-[32px] leading-[44px] font-extrabold tracking-[-0.03em]">{name.big}</p>
                <p className="text-body-sm font-medium">{name.label}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
