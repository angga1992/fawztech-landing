import { PRIVACY_POLICY_VERSION } from "@/lib/privacy";
import { forwardLead } from "@/lib/leads/forward";
import { leadHash, newLeadId } from "@/lib/leads/rate-limit";
import { idem, limiter } from "@/lib/leads/state";
import { MESSAGES_ID, messagesFor } from "@/lib/leads/messages";
import { MAX_BODY_BYTES, validateLead } from "@/lib/leads/schema";
import { verifyCaptchaLocally } from "@/lib/captcha/verify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Parsed = { body: Record<string, unknown>; isForm: boolean };

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function corsHeaders(req: Request): Record<string, string> {
  const allowed = process.env.LEADS_ALLOWED_ORIGIN?.trim();
  const origin = req.headers.get("origin");
  if (allowed && origin && origin === allowed) {
    return {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
  }
  return {};
}

function json(req: Request, status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(req),
      ...extra,
    },
  });
}

/** Respons untuk kiriman tanpa JavaScript (form-urlencoded): teks yang terbaca atau redirect. */
function plain(req: Request, status: number, text: string, extra: Record<string, string> = {}) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", ...corsHeaders(req), ...extra },
  });
}

async function parseBody(req: Request): Promise<Parsed | null> {
  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > MAX_BODY_BYTES) return null;
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return null;
  const ct = (req.headers.get("content-type") ?? "").toLowerCase();
  if (ct.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(text);
    const body: Record<string, unknown> = {};
    for (const key of new Set(params.keys())) {
      const all = params.getAll(key);
      body[key] = key === "kebutuhan" ? all : all[0];
    }
    return { body, isForm: true };
  }
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return { body: parsed as Record<string, unknown>, isForm: false };
  } catch {
    return null;
  }
}

function log(entry: Record<string, unknown>) {
  // Tidak pernah memuat nama, kontak, bisnis, atau cerita.
  console.info(JSON.stringify({ at: new Date().toISOString(), scope: "leads", ...entry }));
}

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export async function GET(req: Request) {
  return json(req, 405, { error: "Metode tidak diizinkan." }, { Allow: "POST" });
}

export async function POST(req: Request) {
  const started = Date.now();
  const ip = clientIp(req);

  // 1. Pembatasan laju per IP (sebelum apa pun).
  const rl = limiter.hit(ip);
  if (!rl.allowed) {
    log({ event: "rate_limited", retryAfter: rl.retryAfterSec });
    return json(req, 429, { error: MESSAGES_ID.tooMany }, { "Retry-After": String(rl.retryAfterSec) });
  }

  // 2. Bentuk body dan batas ukuran. Pesan 400 selalu Indonesia (locale belum terbaca).
  const parsed = await parseBody(req);
  if (!parsed) return json(req, 400, { error: MESSAGES_ID.badBody });
  const { body, isForm } = parsed;
  // Locale hanya memengaruhi pesan buatan endpoint ini; tidak diteruskan ke hulu.
  const MESSAGES = messagesFor(body.locale as string | undefined);
  // Tujuan redirect untuk kiriman tanpa JavaScript, sesuai bahasa halaman asal.
  const doneUrl = `${body.locale === "en" ? "/en" : "/"}?terkirim=1#kontak`;

  // 3. Honeypot: balas 201 palsu tanpa menyimpan atau meneruskan.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    log({ event: "honeypot" });
    const id = newLeadId();
    return isForm ? plain(req, 200, "Terima kasih.") : json(req, 201, { id });
  }

  // 4. Validasi.
  const result = validateLead(body, MESSAGES);
  if (!result.ok) {
    if (isForm) {
      const lines = Object.entries(result.errors).map(([k, v]) => `${k}: ${v}`);
      return plain(req, 422, `Periksa isian berikut:\n${lines.join("\n")}`);
    }
    return json(req, 422, { errors: result.errors });
  }
  const payload = { ...result.data, privacy_version: PRIVACY_POLICY_VERSION };

  // 5. Captcha. Token reCAPTCHA sekali pakai: bila ada sistem internal (LEADS_API_URL), token diteruskan
  //    dan diverifikasi di sana; landing memverifikasi sendiri hanya pada mode webhook/log.
  if (!process.env.LEADS_API_URL?.trim()) {
    const c = await verifyCaptchaLocally(payload, ip);
    if (c.provider !== "none") log({ event: "captcha", provider: c.provider, ok: c.ok, score: c.score, reason: c.reason });
    if (!c.ok) return json(req, 422, { errors: { captcha: MESSAGES.captcha } });
  }

  // 6. Idempotensi: kiriman identik dalam 10 menit tidak diteruskan ulang.
  const hash = leadHash(payload.kontak, payload.cerita);
  const existing = idem.get(hash);
  if (existing) {
    log({ event: "duplicate", id: existing });
    return isForm ? plain(req, 303, "", { Location: doneUrl }) : json(req, 201, { id: existing });
  }

  // 7. Teruskan.
  const id = newLeadId();
  const fwd = await forwardLead(payload, { id, ip, messages: MESSAGES });
  log({ event: "forwarded", id, target: fwd.target, status: fwd.status, ms: Date.now() - started });

  if (fwd.status === 201) idem.set(hash, fwd.body.id);

  if (isForm) {
    if (fwd.status === 201) return plain(req, 303, "", { Location: doneUrl });
    const msg = "error" in fwd.body ? fwd.body.error : MESSAGES.forwardFailed;
    return plain(req, fwd.status, msg);
  }
  return json(req, fwd.status, fwd.body);
}
