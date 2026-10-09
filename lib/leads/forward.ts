import { MESSAGES_ID, type Messages } from "./messages";
import type { LeadErrors, LeadPayload } from "./schema";

export type ForwardEnv = {
  LEADS_API_URL?: string;
  LEADS_API_TOKEN?: string;
  LEADS_WEBHOOK_URL?: string;
  NODE_ENV?: string;
};

export type ForwardResult =
  | { status: 201; body: { id: string }; target: "api" | "webhook" | "log" }
  | { status: 422; body: { errors: LeadErrors }; target: "api" }
  | { status: 429; body: { error: string }; target: "api" }
  | { status: 502; body: { error: string }; target: "api" | "webhook" }
  | { status: 503; body: { error: string }; target: "none" };

export const FORWARD_TIMEOUT_MS = 8000;

function envFrom(override?: ForwardEnv): Required<ForwardEnv> {
  return {
    LEADS_API_URL: override?.LEADS_API_URL ?? process.env.LEADS_API_URL ?? "",
    LEADS_API_TOKEN: override?.LEADS_API_TOKEN ?? process.env.LEADS_API_TOKEN ?? "",
    LEADS_WEBHOOK_URL: override?.LEADS_WEBHOOK_URL ?? process.env.LEADS_WEBHOOK_URL ?? "",
    NODE_ENV: override?.NODE_ENV ?? process.env.NODE_ENV ?? "development",
  };
}

async function post(
  f: typeof fetch,
  url: string,
  body: unknown,
  headers: Record<string, string>
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
  try {
    return await f(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Teruskan prospek: LEADS_API_URL (sistem internal) → LEADS_WEBHOOK_URL → log (dev) / 503 (prod).
 * Tidak pernah mencatat data pribadi ke log.
 */
export async function forwardLead(
  payload: LeadPayload,
  opts: { id: string; ip: string; env?: ForwardEnv; fetchImpl?: typeof fetch; messages?: Messages }
): Promise<ForwardResult> {
  const env = envFrom(opts.env);
  const f = opts.fetchImpl ?? fetch;
  const MESSAGES = opts.messages ?? MESSAGES_ID;
  const fwdHeaders: Record<string, string> = {};
  if (opts.ip && opts.ip !== "unknown") fwdHeaders["X-Forwarded-For"] = opts.ip;

  if (env.LEADS_API_URL) {
    const headers = { ...fwdHeaders };
    if (env.LEADS_API_TOKEN) headers.Authorization = `Bearer ${env.LEADS_API_TOKEN}`;
    try {
      const res = await post(f, env.LEADS_API_URL, payload, headers);
      if (res.status === 201) {
        const json = (await res.json().catch(() => ({}))) as { id?: string };
        return { status: 201, body: { id: typeof json.id === "string" ? json.id : opts.id }, target: "api" };
      }
      if (res.status === 422) {
        const json = (await res.json().catch(() => ({}))) as { errors?: LeadErrors };
        return { status: 422, body: { errors: json.errors ?? {} }, target: "api" };
      }
      if (res.status === 429) return { status: 429, body: { error: MESSAGES.tooMany }, target: "api" };
      return { status: 502, body: { error: MESSAGES.forwardFailed }, target: "api" };
    } catch {
      return { status: 502, body: { error: MESSAGES.forwardFailed }, target: "api" };
    }
  }

  if (env.LEADS_WEBHOOK_URL) {
    try {
      const res = await post(
        f,
        env.LEADS_WEBHOOK_URL,
        { ...payload, id: opts.id, received_at: new Date().toISOString() },
        fwdHeaders
      );
      if (res.ok) return { status: 201, body: { id: opts.id }, target: "webhook" };
      return { status: 502, body: { error: MESSAGES.forwardFailed }, target: "webhook" };
    } catch {
      return { status: 502, body: { error: MESSAGES.forwardFailed }, target: "webhook" };
    }
  }

  if (env.NODE_ENV !== "production") {
    // Hanya di development: tampilkan payload agar bisa dicek saat pengembangan.
    console.info("[leads] tidak ada tujuan dikonfigurasi; payload:", JSON.stringify(payload, null, 2));
    return { status: 201, body: { id: opts.id }, target: "log" };
  }

  return { status: 503, body: { error: MESSAGES.notConfigured }, target: "none" };
}
