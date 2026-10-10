import { verifyTurnstile } from "@/lib/leads/turnstile";
import { verifyRecaptcha, type RecaptchaReason } from "./recaptcha";

export type CaptchaCheck = { ok: boolean; provider: "recaptcha" | "turnstile" | "none"; score?: number; reason: RecaptchaReason | "turnstile_failed" };

/**
 * Verifikasi captcha di landing page. Hanya dipakai saat landing menjadi penerima akhir (mode webhook/log);
 * saat LEADS_API_URL terisi, token diteruskan ke sistem internal yang memverifikasi sekali (token sekali pakai).
 * Penyedia dari secret: reCAPTCHA > Turnstile > none.
 */
export async function verifyCaptchaLocally(
  tokens: { recaptcha_token: string; turnstile_token: string },
  ip: string,
  env: Record<string, string | undefined> = process.env
): Promise<CaptchaCheck> {
  if (env.RECAPTCHA_SECRET_KEY?.trim()) {
    const r = await verifyRecaptcha(tokens.recaptcha_token, ip, { secret: env.RECAPTCHA_SECRET_KEY.trim() });
    return { ok: r.ok, provider: "recaptcha", score: r.score, reason: r.reason };
  }
  if (env.TURNSTILE_SECRET_KEY?.trim()) {
    const ok = await verifyTurnstile(tokens.turnstile_token, ip, { secret: env.TURNSTILE_SECRET_KEY.trim() });
    return { ok, provider: "turnstile", reason: ok ? "ok" : "turnstile_failed" };
  }
  return { ok: true, provider: "none", reason: "ok" };
}
