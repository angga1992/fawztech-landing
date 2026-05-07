import Image from "next/image";

const cols = [
  {
    h: "Solutions",
    items: ["Mobile App", "Web App", "UI / UX", "Custom ERP", "Backend & AI"],
  },
  { h: "Company", items: ["About", "Process", "Careers", "Press"] },
  { h: "Resources", items: ["Blog", "Case Studies", "Privacy", "Terms"] },
];

export default function Footer() {
  return (
    <footer className="relative bg-void-950 border-t border-black/5 pt-16 sm:pt-20 pb-8 sm:pb-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-8 sm:gap-10 mb-16 sm:mb-20">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/nexvoid-mark.png"
                alt="Nexvoid"
                width={381}
                height={289}
                className="h-10 w-auto"
              />
              <span className="font-mono uppercase tracking-[0.18em] text-sm">
                Nex<span className="text-electric">void</span>
              </span>
            </div>
            <p className="mt-5 sm:mt-6 font-display font-medium text-2xl sm:text-3xl md:text-4xl leading-[1.1] tracking-[-0.03em] text-ink-dim max-w-md text-balance">
              Software dirakit dengan{" "}
              <em className="text-plasma not-italic font-light">presisi</em> Eropa di tropis Asia.
            </p>
            <div className="mt-6 sm:mt-8 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute font-mono">
              PT Nexvoid Technology Indonesia
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.h} className="col-span-6 md:col-span-2">
              <div className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute mb-3 sm:mb-4 font-mono">
                {c.h}
              </div>
              <ul className="space-y-2 sm:space-y-2.5">
                {c.items.map((it) => (
                  <li key={it}>
                    <a
                      href="#"
                      className="text-sm text-ink-dim hover:text-ink transition-colors"
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-12 md:col-span-1">
            <div className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute mb-3 sm:mb-4 font-mono">
              Social
            </div>
            <ul className="space-y-2 sm:space-y-2.5 text-sm text-ink-dim">
              <li>
                <a href="#" className="hover:text-ink">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink">
                  Dribbble
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* monumental wordmark */}
        <div className="relative -mx-5 sm:-mx-6 lg:-mx-10 mb-8 sm:mb-10 select-none pointer-events-none">
          <div className="font-display font-medium text-[24vw] leading-none tracking-[-0.05em] text-center bg-gradient-to-b from-electric/60 via-violet/40 to-transparent bg-clip-text text-transparent">
            nexvoid
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-ink-mute pt-5 sm:pt-6 border-t border-black/5 font-mono">
          <span>© {new Date().getFullYear()} Nexvoid · All rights reserved</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
            Built in Bandung
          </span>
          <span>v.2026.05</span>
        </div>
      </div>
    </footer>
  );
}
