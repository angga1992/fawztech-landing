import { readFileSync } from "node:fs";
import { join } from "node:path";

// Menanam SVG dari public/ langsung ke HTML (server component, dibaca saat build/render).
// Dipakai untuk ilustrasi di atas lipatan agar tidak ada permintaan tambahan di jalur kritis (brief §7).
// Gambar dekoratif: aria-hidden, tanpa teks.
export default function InlineSvg({ src, className = "" }: { src: string; className?: string }) {
  const file = readFileSync(join(process.cwd(), "public", src), "utf8");
  const svg = file
    .replace(/^<\?xml[^>]*>\s*/, "")
    .replace(/<svg\b([^>]*)>/, (_m, attrs: string) => {
      const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, "");
      return `<svg${cleaned} aria-hidden="true" focusable="false" class="${className}">`;
    });
  return <span className="contents" dangerouslySetInnerHTML={{ __html: svg }} />;
}
