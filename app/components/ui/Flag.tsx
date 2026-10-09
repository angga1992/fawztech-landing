import type { Locale } from "@/lib/i18n/config";

// Bendera sebagai SVG inline (bukan emoji, yang tampil sebagai huruf di Windows). Dekoratif: aria-hidden.
// id: Sang Merah Putih. en: Union Jack yang disederhanakan.
export default function Flag({ code, size = 20, className = "" }: { code: Locale; size?: number; className?: string }) {
  const w = size;
  const h = Math.round((size * 2) / 3);
  if (code === "id") {
    return (
      <svg width={w} height={h} viewBox="0 0 30 20" aria-hidden="true" focusable="false" className={className}>
        <rect width="30" height="10" fill="#E31E25" />
        <rect y="10" width="30" height="10" fill="#FFFFFF" />
      </svg>
    );
  }
  return (
    <svg width={w} height={h} viewBox="0 0 60 40" aria-hidden="true" focusable="false" className={className}>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0V40M0 20H60" stroke="#FFFFFF" strokeWidth="12" />
      <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  );
}
