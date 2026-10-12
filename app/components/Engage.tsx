import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

// Cara bekerja sama: tiga kartu putih bergaris (A/B/C). Tanpa harga di halaman.
export default function Engage({ t }: { t: Dictionary }) {
  const e = t.engage;
  return (
    <section id="kerja-sama" className="py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{e.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{e.h2}</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3 list-none p-0">
          {e.items.map((it) => (
            <Reveal as="li" key={it.n} className="bg-surface-raised border border-line rounded-lg p-5">
              <Image src={it.image} alt="" width={400} height={300} unoptimized className="rounded-md w-full h-auto" />
              <p className="mt-3.5 font-mono text-code text-teal-600">{it.n}</p>
              <h3 className="text-[22px] leading-[28px] font-extrabold">{it.title}</h3>
              <p className="mt-1 text-body text-ink-muted">{it.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
