// Validasi dan normalisasi prospek. Fungsi murni, dipakai oleh form (klien) dan route handler (server).
// Aturan mengikuti internal-app.md bagian "Integrasi landing page".

export const NEEDS = ["web", "mobile", "desktop", "uiux", "belum"] as const;
export type Need = (typeof NEEDS)[number];

export const MAX_STORY = 1000;
export const MAX_NAME = 120;
export const MAX_BISNIS = 120;
export const MAX_META = 500;
export const MAX_BODY_BYTES = 16 * 1024;

import { MESSAGES_ID, type Messages } from "./messages";

/** Pesan Indonesia (bawaan). Kamus lain: lib/leads/messages.ts. */
export const MESSAGES = MESSAGES_ID;
export type { Messages };

/** Payload yang dikirim ke sistem internal (POST /api/public/leads). */
export type LeadPayload = {
  nama: string;
  kontak: string;
  bisnis: string;
  kebutuhan: Need[];
  cerita: string;
  setuju: true;
  website: string;
  turnstile_token: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  page_url: string;
  referrer: string;
  privacy_version: string;
};

export type LeadErrors = Partial<Record<keyof LeadPayload | "turnstile", string>>;

export type ValidationResult = { ok: true; data: LeadPayload } | { ok: false; errors: LeadErrors };

/**
 * Normalkan nomor WhatsApp Indonesia ke format `62…`.
 * Menerima `08…`, `+62…`, `62…` dengan spasi, strip, titik, atau kurung.
 * Mengembalikan null bila bukan nomor Indonesia yang valid (9–15 digit setelah normalisasi).
 */
export function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-.()]/g, "");
  if (!/^\+?\d+$/.test(cleaned)) return null;
  let digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  if (!digits.startsWith("62")) return null;
  if (digits.length < 9 || digits.length > 15) return null;
  return digits;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

/** Normalkan kontak: email → huruf kecil; nomor → `62…`. */
export function normalizeContact(raw: string): { kind: "email" | "phone"; value: string } | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.includes("@")) {
    const v = t.toLowerCase();
    return isEmail(v) ? { kind: "email", value: v } : null;
  }
  const phone = normalizePhone(t);
  return phone ? { kind: "phone", value: phone } : null;
}

function str(v: unknown, max = MAX_META): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "on" || v === "1" || v === 1;
}

function list(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string" && v !== "") return [v];
  return [];
}

/** Validasi input mentah (JSON atau form) dan hasilkan payload ternormalisasi. Field tak dikenal (mis. `locale`) dibuang. */
export function validateLead(input: Record<string, unknown>, messages: Messages = MESSAGES_ID): ValidationResult {
  const errors: LeadErrors = {};

  const nama = typeof input.nama === "string" ? input.nama.trim() : "";
  if (!nama) errors.nama = messages.required;
  else if (nama.length > MAX_NAME) errors.nama = messages.tooLong;

  const kontakRaw = typeof input.kontak === "string" ? input.kontak : "";
  const kontak = normalizeContact(kontakRaw);
  if (!kontakRaw.trim()) errors.kontak = messages.required;
  else if (!kontak) errors.kontak = messages.contact;

  const bisnis = typeof input.bisnis === "string" ? input.bisnis.trim() : "";
  if (bisnis.length > MAX_BISNIS) errors.bisnis = messages.tooLong;

  const cerita = typeof input.cerita === "string" ? input.cerita.trim() : "";
  if (!cerita) errors.cerita = messages.required;
  else if (cerita.length > MAX_STORY) errors.cerita = messages.storyMax;

  const rawNeeds = list(input.kebutuhan);
  const kebutuhan = Array.from(new Set(rawNeeds)) as Need[];
  if (kebutuhan.some((n) => !(NEEDS as readonly string[]).includes(n))) errors.kebutuhan = messages.needs;

  if (!bool(input.setuju)) errors.setuju = messages.consent;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      nama,
      kontak: kontak!.value,
      bisnis,
      kebutuhan,
      cerita,
      setuju: true,
      website: str(input.website, 200),
      turnstile_token: str(input.turnstile_token, 4096),
      utm_source: str(input.utm_source),
      utm_medium: str(input.utm_medium),
      utm_campaign: str(input.utm_campaign),
      page_url: str(input.page_url),
      referrer: str(input.referrer),
      privacy_version: str(input.privacy_version, 32),
    },
  };
}
