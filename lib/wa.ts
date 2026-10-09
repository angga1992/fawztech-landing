import { normalizePhone } from "./leads/schema";

/**
 * Bangun tautan wa.me dengan pesan terisi.
 * Mengembalikan null bila nomor kosong, placeholder, atau tidak valid.
 */
export function buildWaLink(number: string | null | undefined, text: string): string | null {
  if (!number) return null;
  const normalized = normalizePhone(number);
  if (!normalized) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${normalized}${q}`;
}
