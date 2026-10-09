import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

const bars = ["border-navy-700", "border-teal-600", "border-amber-500"];

export default function Problem({ t }: { t: Dictionary }) {
  const p = t.problem;
  return (
    <section id="masalah" className="py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{p.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{p.h2}</h2>

        <Reveal className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <Image
            src="/illustrations/problem-chaos.svg"
            alt=""
            width={960}
            height={640}
            unoptimized
            className="rounded-lg w-full h-auto"
          />
          <div>
            {p.points.map((pt, i) => (
              <div key={pt.title} className={`border-l-8 ${bars[i]} pl-5 mb-7 last:mb-0`}>
                <h3 className="text-headline font-extrabold">{pt.title}</h3>
                <p className="mt-1 text-body text-ink-muted">{pt.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px] items-center bg-navy-700 text-white rounded-lg p-6 lg:px-10 lg:py-8">
          <p className="text-[20px] leading-[30px] font-bold">{p.closing}</p>
          <Image
            src="/illustrations/custom-fit.svg"
            alt=""
            width={960}
            height={640}
            unoptimized
            className="rounded-md w-full h-auto"
          />
        </Reveal>
      </div>
    </section>
  );
}
