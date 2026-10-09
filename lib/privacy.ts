import { formatDate } from "./i18n/format";

// Versi kebijakan privasi (tanggal ISO). Naikkan setiap kali teks /privasi berubah.
// Nilai ini dikirim bersama prospek sebagai `privacy_version`. Satu kebijakan, dua bahasa.
export const PRIVACY_POLICY_VERSION = "2026-10-09";

/** Masa simpan prospek yang tidak berlanjut sebelum dianonimkan (bulan). */
export const LEAD_RETENTION_MONTHS = 24;

/** Dipertahankan untuk kompatibilitas: "2026-10-09" → "9 Oktober 2026" */
export function formatDateId(iso: string): string {
  return formatDate(iso, "id");
}
