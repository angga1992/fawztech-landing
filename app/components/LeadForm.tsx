"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionary";
import type { Messages } from "@/lib/leads/messages";
import { MAX_STORY, validateLead, type LeadErrors } from "@/lib/leads/schema";
import { PRIVACY_POLICY_VERSION } from "@/lib/privacy";
import { site } from "@/lib/site";
import Button from "./ui/Button";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void }) => string;
    };
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

/** Nama aksi reCAPTCHA v3; harus sama dengan yang diperiksa sistem internal. */
const RECAPTCHA_ACTION = "lead_submit";
const RECAPTCHA_TIMEOUT_MS = 8000;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

type Values = {
  nama: string;
  kontak: string;
  bisnis: string;
  kebutuhan: string[];
  cerita: string;
  setuju: boolean;
};

type Status = "idle" | "submitting" | "success";

const initial: Values = { nama: "", kontak: "", bisnis: "", kebutuhan: [], cerita: "", setuju: false };

type Props = {
  t: Dictionary["contact"]["form"];
  messages: Messages;
  locale: Locale;
  privacyHref: string;
  whatsappHref: string | null;
};

const inputCls =
  "w-full min-h-[48px] px-3.5 py-3 rounded-sm border bg-surface text-ink text-[16px] leading-6 " +
  "placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export default function LeadForm({ t: c, messages, locale, privacyHref, whatsappHref }: Props) {
  const L = c.labels;
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const utm = useRef({ utm_source: "", utm_medium: "", utm_campaign: "", page_url: "", referrer: "" });
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileLoaded = useRef(false);
  const recaptchaLoad = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    utm.current = {
      utm_source: q.get("utm_source") ?? "",
      utm_medium: q.get("utm_medium") ?? "",
      utm_campaign: q.get("utm_campaign") ?? "",
      page_url: window.location.href.split("#")[0],
      referrer: document.referrer ?? "",
    };
    if (q.get("terkirim") === "1") setStatus("success");
  }, []);

  // Muat skrip reCAPTCHA v3 secara malas saat pengguna pertama kali berinteraksi dengan form (sekali saja).
  const ensureRecaptcha = useCallback((): Promise<void> => {
    if (!site.recaptchaSiteKey) return Promise.resolve();
    if (recaptchaLoad.current) return recaptchaLoad.current;
    recaptchaLoad.current = new Promise<void>((resolve, reject) => {
      if (window.grecaptcha) return window.grecaptcha.ready(resolve);
      const s = document.createElement("script");
      s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(site.recaptchaSiteKey)}`;
      s.async = true;
      s.defer = true;
      s.onload = () => (window.grecaptcha ? window.grecaptcha.ready(resolve) : reject(new Error("grecaptcha")));
      s.onerror = () => {
        recaptchaLoad.current = null; // boleh dicoba lagi pada interaksi berikutnya
        reject(new Error("recaptcha_script"));
      };
      document.head.appendChild(s);
    });
    return recaptchaLoad.current;
  }, []);

  // Token reCAPTCHA v3 untuk satu kiriman; string kosong bila skrip gagal (sistem internal yang menolak).
  const recaptchaToken = useCallback(async (): Promise<string> => {
    if (!site.recaptchaSiteKey) return "";
    try {
      await withTimeout(ensureRecaptcha(), RECAPTCHA_TIMEOUT_MS);
      return await withTimeout(window.grecaptcha!.execute(site.recaptchaSiteKey, { action: RECAPTCHA_ACTION }), RECAPTCHA_TIMEOUT_MS);
    } catch {
      return "";
    }
  }, [ensureRecaptcha]);

  // Muat Turnstile secara malas saat pengguna pertama kali berinteraksi dengan form (hanya bila reCAPTCHA tidak dipakai).
  const ensureTurnstile = useCallback(() => {
    if (site.recaptchaSiteKey || !site.turnstileSiteKey || turnstileLoaded.current) return;
    turnstileLoaded.current = true;
    const render = () => {
      if (turnstileRef.current && window.turnstile) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: site.turnstileSiteKey,
          callback: (t) => setToken(t),
          "expired-callback": () => setToken(""),
        });
      }
    };
    if (window.turnstile) return render();
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = render;
    document.head.appendChild(s);
  }, []);

  const ensureCaptcha = useCallback(() => {
    if (site.recaptchaSiteKey) void ensureRecaptcha().catch(() => {});
    else ensureTurnstile();
  }, [ensureRecaptcha, ensureTurnstile]);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => setValues((s) => ({ ...s, [k]: v }));

  const focusFirstError = (errs: LeadErrors) => {
    const order: (keyof LeadErrors)[] = ["nama", "kontak", "bisnis", "kebutuhan", "cerita", "setuju"];
    const first = order.find((k) => errs[k]);
    if (first) document.getElementById(`lead-${first}`)?.focus();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const result = validateLead({ ...values }, messages);
    if (!result.ok) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const recaptcha_token = await recaptchaToken();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          website: "",
          turnstile_token: token,
          recaptcha_token,
          privacy_version: PRIVACY_POLICY_VERSION,
          locale,
          ...utm.current,
        }),
      });
      if (res.status === 201) {
        setStatus("success");
        window.plausible?.("lead_submitted");
        return;
      }
      setStatus("idle");
      if (res.status === 422) {
        const body = (await res.json().catch(() => ({}))) as { errors?: LeadErrors };
        const errs = body.errors ?? {};
        const captchaErr = errs.captcha ?? errs.turnstile;
        if (captchaErr) setFormError(captchaErr);
        setErrors(errs);
        focusFirstError(errs);
        return;
      }
      if (res.status === 429) {
        setFormError(messages.tooMany);
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setFormError(body.error ?? messages.forwardFailed);
    } catch {
      setStatus("idle");
      setFormError(messages.forwardFailed);
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="theme-dark bg-surface-raised border border-line rounded-lg p-6 text-headline text-ink"
      >
        {fill(c.success, { X: site.replyDays })}
      </div>
    );
  }

  const err = (k: keyof LeadErrors) =>
    errors[k] ? (
      <p id={`lead-${k}-err`} className="mt-1 text-body-sm text-danger">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof LeadErrors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `lead-${k}-err` : undefined,
  });
  const border = (k: keyof LeadErrors) => (errors[k] ? "border-danger" : "border-line-strong");
  const remaining = MAX_STORY - values.cerita.length;

  return (
    <form
      method="post"
      action="/api/leads"
      noValidate
      onSubmit={onSubmit}
      onFocusCapture={ensureCaptcha}
      className="theme-dark bg-surface-raised border border-line rounded-lg p-6 grid gap-[18px]"
    >
      <div>
        <label htmlFor="lead-nama" className="block text-label mb-1.5">
          {L.nama}
        </label>
        <input
          id="lead-nama"
          name="nama"
          type="text"
          autoComplete="name"
          required
          value={values.nama}
          onChange={(e) => set("nama", e.target.value)}
          className={`${inputCls} ${border("nama")}`}
          {...aria("nama")}
        />
        {err("nama")}
      </div>

      <div>
        <label htmlFor="lead-kontak" className="block text-label mb-1.5">
          {L.kontak}
        </label>
        <input
          id="lead-kontak"
          name="kontak"
          type="text"
          inputMode="email"
          autoComplete="off"
          required
          value={values.kontak}
          onChange={(e) => set("kontak", e.target.value)}
          className={`${inputCls} ${border("kontak")}`}
          {...aria("kontak")}
        />
        {err("kontak")}
      </div>

      <div>
        <label htmlFor="lead-bisnis" className="block text-label mb-1.5">
          {L.bisnis} <span className="font-normal">{L.bisnisOptional}</span>
        </label>
        <input
          id="lead-bisnis"
          name="bisnis"
          type="text"
          autoComplete="organization"
          value={values.bisnis}
          onChange={(e) => set("bisnis", e.target.value)}
          className={`${inputCls} ${border("bisnis")}`}
          {...aria("bisnis")}
        />
        {err("bisnis")}
      </div>

      <fieldset className="border-0 p-0 m-0" id="lead-kebutuhan" {...aria("kebutuhan")}>
        <legend className="text-label mb-1.5">{L.kebutuhan}</legend>
        <div className="flex flex-wrap gap-2.5">
          {c.needs.map((n) => {
            const checked = values.kebutuhan.includes(n.value);
            return (
              <label
                key={n.value}
                className={`inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2.5 rounded-sm border cursor-pointer text-[14px] font-medium ${
                  checked ? "border-amber-500 bg-surface" : "border-line-strong"
                }`}
              >
                <input
                  type="checkbox"
                  name="kebutuhan"
                  value={n.value}
                  checked={checked}
                  onChange={(e) =>
                    set(
                      "kebutuhan",
                      e.target.checked
                        ? [...values.kebutuhan, n.value]
                        : values.kebutuhan.filter((x) => x !== n.value)
                    )
                  }
                  className="w-4 h-4 accent-amber-500"
                />
                {n.label}
              </label>
            );
          })}
        </div>
        {err("kebutuhan")}
      </fieldset>

      <div>
        <label htmlFor="lead-cerita" className="block text-label mb-1.5">
          {L.cerita}
        </label>
        <textarea
          id="lead-cerita"
          name="cerita"
          required
          maxLength={MAX_STORY}
          rows={5}
          value={values.cerita}
          onChange={(e) => set("cerita", e.target.value.slice(0, MAX_STORY))}
          className={`${inputCls} min-h-[140px] resize-y ${border("cerita")}`}
          aria-describedby={errors.cerita ? "lead-cerita-err lead-cerita-hint" : "lead-cerita-hint"}
          aria-invalid={errors.cerita ? true : undefined}
        />
        <p id="lead-cerita-hint" className="mt-1 text-body-sm text-ink-muted">
          {L.ceritaHint}{" "}
          <span aria-live="polite">{fill(c.remaining, { n: remaining.toLocaleString(locale === "en" ? "en-GB" : "id-ID") })}</span>
        </p>
        {err("cerita")}
      </div>

      {/* Honeypot: pengguna sungguhan tidak melihat atau mengisi ini. */}
      <div className="hp" aria-hidden="true">
        <label>
          {c.honeypotLabel}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="privacy_version" value={PRIVACY_POLICY_VERSION} />

      <div>
        <label className="flex items-start gap-2.5 text-body-sm text-ink-muted cursor-pointer">
          <input
            id="lead-setuju"
            name="setuju"
            type="checkbox"
            required
            checked={values.setuju}
            onChange={(e) => set("setuju", e.target.checked)}
            className="mt-1 w-4 h-4 shrink-0 accent-amber-500"
            {...aria("setuju")}
          />
          <span>
            {L.setujuBefore}
            <a href={privacyHref} className="text-link underline underline-offset-2">
              {L.setujuLink}
            </a>
            {L.setujuAfter}
          </span>
        </label>
        {err("setuju")}
      </div>

      {site.recaptchaSiteKey ? (
        /* Wajib bila badge reCAPTCHA disembunyikan (lihat .grecaptcha-badge di globals.css). */
        <p className="text-body-sm text-ink-muted">
          {c.recaptchaBefore}
          <a href="https://policies.google.com/privacy" className="text-link underline underline-offset-2" target="_blank" rel="noopener">
            {c.recaptchaPrivacy}
          </a>
          {c.recaptchaMiddle}
          <a href="https://policies.google.com/terms" className="text-link underline underline-offset-2" target="_blank" rel="noopener">
            {c.recaptchaTerms}
          </a>
          {c.recaptchaAfter}
        </p>
      ) : site.turnstileSiteKey ? (
        <div ref={turnstileRef} />
      ) : null}

      {formError ? (
        <p role="alert" className="text-body-sm text-danger">
          {formError}
          {whatsappHref ? (
            <>
              {" "}
              <a href={whatsappHref} className="text-link underline" target="_blank" rel="noopener">
                {c.openWhatsApp}
              </a>
            </>
          ) : null}
        </p>
      ) : null}

      <div>
        <Button type="submit" variant="amber" disabled={status === "submitting"}>
          {status === "submitting" ? c.submitting : c.submit}
        </Button>
      </div>
    </form>
  );
}
