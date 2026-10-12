// Ikon "blok" dirakit dari CSS (bukan file gambar), mengikuti prototipe handoff untuk Nilai dan Katalog.
// Dekoratif: aria-hidden. Warna blok mengikuti kelas `base` dan `accent` dari kartu induk.
export type Bar = { h: number; w?: number; accent?: boolean };

export default function BlockIcon({
  bars,
  base,
  accent,
  height = 48,
  className = "",
}: {
  bars: readonly Bar[];
  base: string;
  accent: string;
  height?: number;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`flex items-end gap-1.5 ${className}`.trim()} style={{ height }}>
      {bars.map((b, i) => (
        <i key={i} className={`block rounded-sm ${b.accent ? accent : base}`} style={{ height: b.h, width: b.w ?? 16 }} />
      ))}
    </span>
  );
}
