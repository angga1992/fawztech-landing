import { useCallback, useRef } from "react";
import { RECAPTCHA_ACTION, recaptchaSiteKey, turnstileSiteKey, type CaptchaProvider } from "@/lib/captcha/provider";

declare global {
  interface Window {
    grecaptcha?: { ready: (cb: () => void) => void; execute: (siteKey: string, opts: { action: string }) => Promise<string> };
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void }) => string;
    };
  }
}

export type CaptchaTokens = { recaptcha_token: string; turnstile_token: string };

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then((v) => (clearTimeout(t), resolve(v)), (e) => (clearTimeout(t), reject(e)));
  });
}

/**
 * Captcha berpenyedia untuk form prospek.
 * - recaptcha: skrip dimuat saat interaksi pertama (ensureLoaded), token diminta saat kirim (getTokens).
 * - turnstile: widget dirender ke widgetRef saat interaksi pertama; token dari callback.
 * - none: tidak ada skrip pihak ketiga.
 * Kegagalan memuat/eksekusi menghasilkan token kosong; server yang memutuskan.
 */
export function useCaptcha(provider: CaptchaProvider, widgetRef: React.RefObject<HTMLDivElement>) {
  const loading = useRef<Promise<void> | null>(null);
  const turnstileToken = useRef("");

  const ensureLoaded = useCallback(() => {
    if (provider === "none" || loading.current) return;
    loading.current = new Promise<void>((resolve) => {
      if (provider === "recaptcha") {
        if (window.grecaptcha) return resolve();
        const s = document.createElement("script");
        s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
        return;
      }
      const render = () => {
        if (widgetRef.current && window.turnstile) {
          window.turnstile.render(widgetRef.current, {
            sitekey: turnstileSiteKey,
            callback: (t) => (turnstileToken.current = t),
            "expired-callback": () => (turnstileToken.current = ""),
          });
        }
        resolve();
      };
      if (window.turnstile) return render();
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.onload = render;
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
  }, [provider, widgetRef]);

  const getTokens = useCallback(async (): Promise<CaptchaTokens> => {
    const empty = { recaptcha_token: "", turnstile_token: "" };
    if (provider === "none") return empty;
    ensureLoaded();
    try {
      await withTimeout(loading.current ?? Promise.resolve(), 5000);
    } catch {
      return empty;
    }
    if (provider === "turnstile") return { ...empty, turnstile_token: turnstileToken.current };
    const g = window.grecaptcha;
    if (!g) return empty;
    try {
      const token = await withTimeout(
        new Promise<string>((resolve, reject) => g.ready(() => g.execute(recaptchaSiteKey, { action: RECAPTCHA_ACTION }).then(resolve, reject))),
        5000
      );
      return { ...empty, recaptcha_token: token };
    } catch {
      return empty;
    }
  }, [provider, ensureLoaded]);

  return { ensureLoaded, getTokens };
}
