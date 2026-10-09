import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary";
import Eyebrow from "./ui/Eyebrow";
import Reveal from "./ui/Reveal";

// Blok berwarna dengan lebar tidak sama (bukan kartu putih seragam). Urutan tetap: Web, Mobile, Desktop, UI/UX.
const blocks = [
  { span: "md:col-span-7", tone: "theme-dark bg-navy-700 text-ink", muted: "text-ink-muted", layout: "row" },
  { span: "md:col-span-5", tone: "bg-amber-500 text-on-accent", muted: "text-on-accent", layout: "phone" },
  { span: "md:col-span-5", tone: "bg-teal-600 text-white", muted: "text-white", layout: "col" },
  { span: "md:col-span-7", tone: "bg-surface-raised text-ink border-line", muted: "text-ink-muted", layout: "row" },
] as const;

export default function Services({ t }: { t: Dictionary }) {
  const s = t.services;
  return (
    <section id="layanan" className="bg-surface-sunken py-12 lg:py-16">
      <div className="mx-auto max-w-content px-4 md:px-8">
        <Eyebrow>{s.eyebrow}</Eyebrow>
        <h2 className="mt-2 text-display-lg-sm sm:text-display-lg">{s.h2}</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-12">
          {s.items.map((item, i) => {
            const b = blocks[i];
            const isPhone = b.layout === "phone";
            return (
              <Reveal
                as="article"
                key={item.name}
                className={`${b.span} ${b.tone} rounded-lg p-7 border border-transparent flex flex-col gap-5 ${
                  b.layout === "row" ? "md:flex-row md:items-end md:justify-between" : ""
                }`}
              >
                <div className="md:flex-1">
                  <h3 className="text-[32px] leading-[38px] font-extrabold">{item.name}</h3>
                  <p className={`mt-2 text-body ${b.muted}`}>{item.text}</p>
                </div>
                <Image
                  src={item.image}
                  alt=""
                  width={item.width}
                  height={item.height}
                  unoptimized
                  className={
                    isPhone
                      ? "rounded-md w-[140px] md:w-[150px] h-auto self-start md:self-end"
                      : b.layout === "col"
                        ? "rounded-md w-full md:w-[60%] h-auto md:self-end"
                        : "rounded-md w-full md:w-[46%] h-auto md:flex-none"
                  }
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
