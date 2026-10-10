// Penyedia captcha dipilih dari env. Nilai NEXT_PUBLIC_* ditulis literal agar di-inline ke bundel klien.
export type CaptchaProvider = "recaptcha" | "turnstile" | "none";

/** Nama aksi reCAPTCHA v3 untuk form prospek; harus sama dengan yang diverifikasi server. */
export const RECAPTCHA_ACTION = "lead_submit";

export const recaptchaSiteKey = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
export const turnstileSiteKey = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim();

/** reCAPTCHA diprioritaskan; Turnstile tetap didukung; tanpa keduanya tidak ada skrip pihak ketiga. */
export function captchaProvider(): CaptchaProvider {
  if (recaptchaSiteKey) return "recaptcha";
  if (turnstileSiteKey) return "turnstile";
  return "none";
}
