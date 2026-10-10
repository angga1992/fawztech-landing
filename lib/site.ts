import { normalizePhone } from "./leads/schema";

// Placeholder persis seperti naskah handoff. Diganti lewat variabel lingkungan (lihat .env.example).
const PLACEHOLDER = {
  url: "http://localhost:3000",
  email: "[nama@domainanda.id]",
  phone: "[+62 8xx xxxx xxxx]",
  instagram: "[@akunanda]",
  linkedin: "[LinkedIn]",
  replyDays: "[X]",
} as const;

export function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  const t = value.trim();
  return t === "" || (t.startsWith("[") && t.endsWith("]"));
}

function env(value: string | undefined, fallback: string): string {
  return value && value.trim() !== "" ? value.trim() : fallback;
}

const waRaw = env(process.env.NEXT_PUBLIC_WA_NUMBER, "");

export const site = {
  name: "Fawz Tech",
  tagline: "Sistem yang pas untuk bisnismu, dibangun bersama.",
  address: "Bintaro Sektor 2",
  url: env(process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL, PLACEHOLDER.url),
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, PLACEHOLDER.email),
  phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE, waRaw || PLACEHOLDER.phone),
  /** Nomor WhatsApp ternormalisasi `62…`, atau null bila belum dikonfigurasi. */
  waNumber: waRaw ? normalizePhone(waRaw) : null,
  instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM, PLACEHOLDER.instagram),
  linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN, PLACEHOLDER.linkedin),
  replyDays: env(process.env.NEXT_PUBLIC_REPLY_DAYS, PLACEHOLDER.replyDays),
  plausibleDomain: env(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN, ""),
  turnstileSiteKey: env(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, ""),
  recaptchaSiteKey: env(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, ""),
} as const;

/** Daftar nilai yang masih placeholder; dipakai untuk peringatan saat build. */
export function placeholderKeys(): string[] {
  const keys: string[] = [];
  if (site.url === PLACEHOLDER.url) keys.push("SITE_URL");
  if (isPlaceholder(site.email)) keys.push("NEXT_PUBLIC_CONTACT_EMAIL");
  if (!site.waNumber) keys.push("NEXT_PUBLIC_WA_NUMBER");
  if (isPlaceholder(site.instagram)) keys.push("NEXT_PUBLIC_INSTAGRAM");
  if (isPlaceholder(site.linkedin)) keys.push("NEXT_PUBLIC_LINKEDIN");
  if (isPlaceholder(site.replyDays)) keys.push("NEXT_PUBLIC_REPLY_DAYS");
  return keys;
}

export function hasPlaceholders(): boolean {
  return placeholderKeys().length > 0;
}

/** URL absolut ke path di situs ini. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

/** Handle Instagram "@akun" → URL profil. */
export function instagramUrl(handle: string): string {
  const h = handle.replace(/^@/, "");
  return `https://instagram.com/${h}`;
}
