import type { ReactNode } from "react";

// Eyebrow: JetBrains Mono, kapital, tracking 0.08em.
// Di latar terang teal-600; di latar navy amber-500 (amber tidak pernah jadi teks di latar terang).
export default function Eyebrow({
  tone = "light",
  children,
  className = "",
}: {
  tone?: "light" | "dark";
  children: ReactNode;
  className?: string;
}) {
  const color = tone === "dark" ? "text-amber-500" : "text-teal-600";
  return (
    <p className={`font-mono text-code uppercase tracking-[0.08em] ${color} ${className}`.trim()}>
      {children}
    </p>
  );
}
