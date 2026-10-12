import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

// Misi: empat janji, satu baris di desktop (tanpa tangga; tangga hanya untuk Cara kerja).
export default function Mission({ t }: { t: Dictionary }) {
  const m = t.mission;
  return (
    <section id="misi" className="py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{m.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{m.h2}</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4 list-none p-0">
          {m.items.map((it) => (
            <Reveal as="li" key={it.n}>
              <Image src={it.image} alt="" width={400} height={340} unoptimized className="rounded-lg w-full h-auto" />
              <p className="mt-3.5 font-mono text-code text-teal-600">{it.n}</p>
              <h3 className="text-headline font-extrabold">{it.title}</h3>
              <p className="mt-1 text-body text-ink-muted">{it.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
