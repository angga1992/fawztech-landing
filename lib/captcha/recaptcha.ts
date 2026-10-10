import { RECAPTCHA_ACTION } from "./provider";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
export const DEFAULT_MIN_SCORE = 0.5;

export type RecaptchaReason =
  | "ok"
  | "missing_token"
  | "missing_secret"
  | "rejected"
  | "action_mismatch"
  | "low_score"
  | "hostname_mismatch"
  | "unavailable";

export type RecaptchaResult = { ok: boolean; score?: number; reason: RecaptchaReason; hostname?: string };

export type RecaptchaOptions = {
  secret?: string;
  minScore?: number;
  hostnames?: string[];
  action?: string;
  production?: boolean;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

/** Hostname yang diizinkan: RECAPTCHA_HOSTNAMES (dipisah koma), atau hostname SITE_URL; localhost di luar produksi. */
export type EnvLike = Record<string, string | undefined>;

export function allowedHostnames(env: EnvLike = process.env, production = env.NODE_ENV === "production"): string[] {
  const list = (env.RECAPTCHA_HOSTNAMES ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (list.length === 0) {
    const url = env.SITE_URL ?? env.NEXT_PUBLIC_SITE_URL ?? "";
    try {
      if (url) list.push(new URL(url).hostname.toLowerCase());
    } catch {
      /* abaikan */
    }
  }
  if (!production) list.push("localhost", "127.0.0.1");
  return Array.from(new Set(list));
}

export function minScoreFromEnv(env: EnvLike = process.env): number {
  const n = Number(env.RECAPTCHA_MIN_SCORE);
  return Number.isFinite(n) && n >= 0 && n <= 1 ? n : DEFAULT_MIN_SCORE;
}

/**
 * Verifikasi token reCAPTCHA v3. Lolos hanya bila success, action cocok, skor ≥ ambang, dan hostname diizinkan.
 * Gagal tertutup bila Google tidak terjangkau. Secret tidak pernah dikembalikan atau dicatat.
 */
export async function verifyRecaptcha(token: string, ip: string, opts: RecaptchaOptions = {}): Promise<RecaptchaResult> {
  const secret = opts.secret ?? process.env.RECAPTCHA_SECRET_KEY ?? "";
  if (!secret) return { ok: false, reason: "missing_secret" };
  if (!token) return { ok: false, reason: "missing_token" };
  const f = opts.fetchImpl ?? fetch;
  const production = opts.production ?? process.env.NODE_ENV === "production";
  const hostnames = opts.hostnames ?? allowedHostnames(process.env, production);
  const minScore = opts.minScore ?? minScoreFromEnv();
  const action = opts.action ?? RECAPTCHA_ACTION;

  type SiteVerify = { success?: boolean; score?: number; action?: string; hostname?: string };
  let data: SiteVerify | null = null;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await f(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(opts.timeoutMs ?? 5000),
    });
    if (!res.ok) return { ok: false, reason: "unavailable" };
    data = (await res.json()) as SiteVerify;
  } catch {
    return { ok: false, reason: "unavailable" };
  }
  if (!data || data.success !== true) return { ok: false, reason: "rejected" };
  const hostname = (data.hostname ?? "").toLowerCase();
  // Kunci uji resmi Google membalas success tanpa score/action dengan hostname testkey.google.com. Hanya diterima di luar produksi.
  if (!production && hostname === "testkey.google.com" && data.score === undefined && data.action === undefined) {
    return { ok: true, score: 1, reason: "ok", hostname };
  }
  const score = typeof data.score === "number" ? data.score : 0;
  if (data.action !== action) return { ok: false, score, reason: "action_mismatch", hostname };
  if (hostnames.length > 0 && !hostnames.includes(hostname)) return { ok: false, score, reason: "hostname_mismatch", hostname };
  if (score < minScore) return { ok: false, score, reason: "low_score", hostname };
  return { ok: true, score, reason: "ok", hostname };
}
