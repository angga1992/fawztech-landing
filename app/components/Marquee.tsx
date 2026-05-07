const tokens = [
  "Mobile",
  "Web",
  "ERP",
  "UI / UX",
  "AI Integration",
  "Backend",
  "SAP Mobility",
  "DevOps",
  "Cloud",
  "Automation",
];

export default function Marquee() {
  return (
    <div className="relative border-y border-black/10 bg-void-900/60 py-6 overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...tokens, ...tokens, ...tokens].map((t, i) => (
          <span
            key={i}
            className="font-display font-light text-2xl md:text-5xl text-ink-dim/70"
          >
            {t} <span className="text-electric font-mono"></span>
          </span>
        ))}
      </div>
    </div>
  );
}
