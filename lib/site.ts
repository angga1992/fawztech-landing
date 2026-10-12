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

/** Slug klien portofolio (urutan tampil). Tayang hanya bila klien sudah mengizinkan; lihat NEXT_PUBLIC_PORTFOLIO_CLIENTS. */
export const PORTFOLIO_CLIENTS = ["arfindo-bersinar", "menya-sakura", "museum-nasional", "kkara"] as const;
export type PortfolioClient = (typeof PORTFOLIO_CLIENTS)[number];

function parsePortfolio(raw: string): readonly PortfolioClient[] {
  const v = raw.trim().toLowerCase();
  if (v === "") return [];
  if (v === "all") return PORTFOLIO_CLIENTS;
  const wanted = new Set(v.split(",").map((x) => x.trim()));
  return PORTFOLIO_CLIENTS.filter((c) => wanted.has(c));
}

export const site = {
  name: "Fawz Tech",
  tagline: "Sistem yang pas untuk bisnismu, dibangun bersama.",
  // Alamat sesuai company profile final (Oktober 2026); lengkapi kota dan kode pos bila sudah ada.
  address: "Jl Punai II",
  foundingYear: "2022",
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
  /** Klien portofolio yang boleh tayang (kosong = seksi portofolio dan tautan navnya disembunyikan). */
  portfolioClients: parsePortfolio(process.env.NEXT_PUBLIC_PORTFOLIO_CLIENTS ?? ""),
} as const;

export function isPortfolioAllowed(slug: string): boolean {
  return (site.portfolioClients as readonly string[]).includes(slug);
}

export function portfolioVisible(): boolean {
  return site.portfolioClients.length > 0;
}

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
