import type { Locale } from "./config";

const MONTHS: Record<Locale, string[]> = {
  id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** "2026-10-09" → "9 Oktober 2026" (id) / "9 October 2026" (en) */
export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[locale][m - 1]} ${y}`;
}
