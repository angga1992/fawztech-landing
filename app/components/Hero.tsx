import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary";
import Button from "./ui/Button";
import Eyebrow from "./ui/Eyebrow";
import InlineSvg from "./ui/InlineSvg";

export default function Hero({ t }: { t: Dictionary }) {
  const h = t.hero;
  return (
    <section id="atas" className="theme-dark bg-navy-900 text-ink py-12 lg:py-[88px]">
      <div className="mx-auto max-w-content px-4 md:px-8 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-center">
        <div>
          <Eyebrow tone="dark">{h.eyebrow}</Eyebrow>
          <h1 className="mt-3 text-display-xl-sm sm:text-display-xl text-balance">{h.h1}</h1>
          <p className="mt-4 text-headline text-ink-muted max-w-[520px]">{h.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={h.ctaPrimary.href} variant="amber">
              {h.ctaPrimary.label}
            </Button>
            <Button href={h.ctaSecondary.href} variant="ghost">
              {h.ctaSecondary.label}
            </Button>
          </div>
          <p className="mt-8 font-mono text-code text-ink-muted">{h.strip}</p>
        </div>

        <div className="relative">
          {/* Ditanam inline (viewBox 960×640) supaya LCP tidak menunggu permintaan gambar. */}
          <InlineSvg src="illustrations/hero-dashboard.svg" className="rounded-lg w-full h-auto" />
          <Image
            src="/illustrations/app-mobile.svg"
            alt=""
            width={420}
            height={760}
            unoptimized
            className="absolute w-[26%] h-auto right-[-4%] bottom-[-8%] rounded-md"
          />
        </div>
      </div>
    </section>
  );
}
