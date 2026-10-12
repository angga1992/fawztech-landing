import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

// Tangga: tiap langkah lebih tinggi dari sebelumnya (hanya ≥ 1024px). Langkah terakhir diberi blok amber.
const lift = ["", "lg:mb-10", "lg:mb-20", "lg:mb-[120px]"];

export default function Process({ t }: { t: Dictionary }) {
  const p = t.process;
  return (
    <section id="cara-kerja" className="bg-surface-sunken py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{p.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{p.h2}</h2>

        <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-end list-none p-0">
          {p.steps.map((step, i) => {
            const last = i === p.steps.length - 1;
            return (
              <Reveal as="li" key={step.n} className={lift[i]}>
                <div className={last ? "bg-amber-500 rounded-lg p-3" : ""}>
                  <Image
                    src={step.image}
                    alt=""
                    width={400}
                    height={340}
                    unoptimized
                    className="rounded-lg w-full h-auto"
                  />
                </div>
                <p className="mt-3.5 font-mono text-code text-teal-600">{step.n}</p>
                <h3 className="text-headline font-extrabold">{step.name}</h3>
                <p className="mt-1 text-body text-ink-muted">{step.text}</p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
