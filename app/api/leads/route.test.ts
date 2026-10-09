import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";
import { resetLeadState } from "@/lib/leads/state";
import { MESSAGES } from "@/lib/leads/schema";

const valid = {
  nama: "Budi Santoso",
  kontak: "08123456789",
  bisnis: "CV Maju Jaya",
  kebutuhan: ["web"],
  cerita: "Kami mau merapikan pemesanan dari chat ke satu sistem.",
  setuju: true,
  website: "",
  turnstile_token: "",
  utm_source: "instagram",
  utm_medium: "bio",
  utm_campaign: "launch",
  page_url: "https://domainanda.id/",
  referrer: "",
};

let ipCounter = 0;
function req(body: unknown, init: { ip?: string; contentType?: string; method?: string; raw?: string } = {}) {
  ipCounter += 1;
  const ip = init.ip ?? `10.0.0.${ipCounter}`;
  const text = init.raw ?? (typeof body === "string" ? body : JSON.stringify(body));
  return new Request("http://localhost/api/leads", {
    method: init.method ?? "POST",
    headers: {
      "content-type": init.contentType ?? "application/json",
      "x-forwarded-for": ip,
      "content-length": String(Buffer.byteLength(text)),
    },
    body: text,
  });
}

const fetchMock = vi.fn();
const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

beforeEach(() => {
  resetLeadState();
  fetchMock.mockReset();
  infoSpy.mockClear();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("LEADS_API_URL", "");
  vi.stubEnv("LEADS_WEBHOOK_URL", "");
  vi.stubEnv("LEADS_API_TOKEN", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const upstream = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("POST /api/leads", () => {
  it("405 untuk GET", async () => {
    const res = await GET(new Request("http://localhost/api/leads", { method: "GET" }));
    expect(res.status).toBe(405);
    expect(res.headers.get("Allow")).toBe("POST");
  });

  it("400 untuk body terlalu besar", async () => {
    const r = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "20000", "x-forwarded-for": "1.1.1.1" },
      body: "{}",
    });
    const res = await POST(r);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: MESSAGES.badBody });
  });

  it("400 untuk JSON rusak", async () => {
    const res = await POST(req(null, { raw: '{"nama": ' }));
    expect(res.status).toBe(400);
  });

  it("422 dengan pesan per field", async () => {
    const res = await POST(req({ nama: "", kontak: "halo", cerita: "", setuju: false }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.nama).toBe(MESSAGES.required);
    expect(json.errors.kontak).toBe(MESSAGES.contact);
    expect(json.errors.setuju).toBe(MESSAGES.consent);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("201 palsu untuk honeypot tanpa penerusan dan tanpa data pribadi di log", async () => {
    vi.stubEnv("LEADS_API_URL", "https://internal.example/api/public/leads");
    const res = await POST(req({ ...valid, website: "http://spam" }));
    expect(res.status).toBe(201);
    expect(typeof (await res.json()).id).toBe("string");
    expect(fetchMock).not.toHaveBeenCalled();
    const logged = infoSpy.mock.calls.map((c) => String(c[0])).join("\n");
    expect(logged).not.toContain("Budi");
    expect(logged).not.toContain("0812");
  });

  it("429 setelah 5 permintaan dari IP yang sama dalam semenit", async () => {
    for (let i = 0; i < 5; i++) await POST(req({ nama: "" }, { ip: "9.9.9.9" }));
    const res = await POST(req(valid, { ip: "9.9.9.9" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
    expect(await res.json()).toEqual({ error: MESSAGES.tooMany });
  });

  it("meneruskan ke LEADS_API_URL dengan kontak ternormalisasi dan UTM, memakai id hulu", async () => {
    vi.stubEnv("LEADS_API_URL", "https://internal.example/api/public/leads");
    vi.stubEnv("LEADS_API_TOKEN", "rahasia");
    fetchMock.mockResolvedValueOnce(upstream(201, { id: "hulu-1" }));
    const res = await POST(req(valid, { ip: "5.5.5.5" }));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ id: "hulu-1" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://internal.example/api/public/leads");
    const sent = JSON.parse(init.body);
    expect(sent.kontak).toBe("628123456789");
    expect(sent.utm_source).toBe("instagram");
    expect(sent.utm_campaign).toBe("launch");
    expect(sent.privacy_version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(init.headers["X-Forwarded-For"]).toBe("5.5.5.5");
    expect(init.headers.Authorization).toBe("Bearer rahasia");
  });

  it("memetakan 422 hulu apa adanya", async () => {
    vi.stubEnv("LEADS_API_URL", "https://internal.example/api/public/leads");
    fetchMock.mockResolvedValueOnce(upstream(422, { errors: { kontak: "Nomor sudah terdaftar" } }));
    const res = await POST(req(valid));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ errors: { kontak: "Nomor sudah terdaftar" } });
  });

  it("memetakan 429 hulu", async () => {
    vi.stubEnv("LEADS_API_URL", "https://internal.example/api/public/leads");
    fetchMock.mockResolvedValueOnce(upstream(429, {}));
    const res = await POST(req(valid));
    expect(res.status).toBe(429);
  });

  it("502 bila hulu gagal atau timeout", async () => {
    vi.stubEnv("LEADS_API_URL", "https://internal.example/api/public/leads");
    fetchMock.mockRejectedValueOnce(new DOMException("aborted", "AbortError"));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: MESSAGES.forwardFailed });
  });

  it("idempotensi: kiriman identik dalam 10 menit tidak diteruskan ulang dan id sama", async () => {
    vi.stubEnv("LEADS_API_URL", "https://internal.example/api/public/leads");
    fetchMock.mockResolvedValue(upstream(201, { id: "hulu-2" }));
    const a = await (await POST(req(valid, { ip: "7.7.7.7" }))).json();
    const b = await (await POST(req(valid, { ip: "7.7.7.8" }))).json();
    expect(a.id).toBe("hulu-2");
    expect(b.id).toBe("hulu-2");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("hanya webhook: 201 dan payload memuat id serta received_at", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hook.example/x");
    fetchMock.mockResolvedValueOnce(new Response("ok", { status: 200 }));
    const res = await POST(req(valid));
    expect(res.status).toBe(201);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.id).toBeTruthy();
    expect(sent.received_at).toBeTruthy();
    expect(sent.kontak).toBe("628123456789");
  });

  it("produksi tanpa tujuan: 503", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = await POST(req(valid));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: MESSAGES.notConfigured });
  });

  it("development tanpa tujuan: 201 (mode log)", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = await POST(req(valid));
    expect(res.status).toBe(201);
  });

  it("Turnstile gagal: 422 pada field turnstile", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    fetchMock.mockResolvedValueOnce(upstream(200, { success: false }));
    const res = await POST(req({ ...valid, turnstile_token: "tok" }));
    expect(res.status).toBe(422);
    expect((await res.json()).errors.turnstile).toBe(MESSAGES.turnstile);
  });

  it("form-urlencoded: sukses → 303 ke /?terkirim=1#kontak; galat → teks terbaca", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const form = new URLSearchParams();
    form.set("nama", "Budi");
    form.set("kontak", "08123456789");
    form.append("kebutuhan", "web");
    form.append("kebutuhan", "uiux");
    form.set("cerita", "Halo");
    form.set("setuju", "on");
    const ok = await POST(req(null, { raw: form.toString(), contentType: "application/x-www-form-urlencoded" }));
    expect(ok.status).toBe(303);
    expect(ok.headers.get("Location")).toBe("/?terkirim=1#kontak");

    const bad = await POST(req(null, { raw: "nama=", contentType: "application/x-www-form-urlencoded" }));
    expect(bad.status).toBe(422);
    expect(bad.headers.get("content-type")).toContain("text/plain");
    expect(await bad.text()).toContain("kontak");
  });

  it("log penerusan tidak memuat data pribadi", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hook.example/x");
    fetchMock.mockResolvedValueOnce(new Response("ok", { status: 200 }));
    await POST(req(valid));
    const logged = infoSpy.mock.calls.map((c) => String(c[0])).join("\n");
    expect(logged).toContain("forwarded");
    expect(logged).not.toContain("Budi");
    expect(logged).not.toContain("628123456789");
    expect(logged).not.toContain("Maju Jaya");
  });

  it("locale en: pesan 422 berbahasa Inggris", async () => {
    const res = await POST(req({ locale: "en", nama: "", kontak: "", cerita: "", setuju: false }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors.nama).toBe("This field is required");
    expect(json.errors.setuju).toBe("Please tick the consent box to continue");
  });

  it("locale tidak dikenal: pesan Indonesia", async () => {
    const res = await POST(req({ locale: "fr", nama: "" }));
    expect((await res.json()).errors.nama).toBe(MESSAGES.required);
  });

  it("locale tidak diteruskan ke hulu maupun webhook", async () => {
    vi.stubEnv("LEADS_API_URL", "https://internal.example/api/public/leads");
    fetchMock.mockResolvedValueOnce(upstream(201, { id: "hulu-9" }));
    await POST(req({ ...valid, locale: "en" }));
    expect("locale" in JSON.parse(fetchMock.mock.calls[0][1].body)).toBe(false);

    vi.stubEnv("LEADS_API_URL", "");
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hook.example/x");
    fetchMock.mockResolvedValueOnce(new Response("ok", { status: 200 }));
    await POST(req({ ...valid, cerita: "cerita lain", locale: "en" }));
    expect("locale" in JSON.parse(fetchMock.mock.calls[1][1].body)).toBe(false);
  });

  it("locale en: 503 produksi dan 502 hulu berbahasa Inggris, 422 hulu apa adanya", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const r503 = await POST(req({ ...valid, locale: "en" }));
    expect(r503.status).toBe(503);
    expect(await r503.json()).toEqual({ error: "The form is not active yet. Contact us on WhatsApp." });

    vi.stubEnv("LEADS_API_URL", "https://internal.example/api/public/leads");
    fetchMock.mockRejectedValueOnce(new Error("down"));
    const r502 = await POST(req({ ...valid, cerita: "lain", locale: "en" }));
    expect(await r502.json()).toEqual({ error: "Sending failed. Try again or contact us on WhatsApp." });

    fetchMock.mockResolvedValueOnce(upstream(422, { errors: { kontak: "Nomor sudah terdaftar" } }));
    const r422 = await POST(req({ ...valid, cerita: "lain lagi", locale: "en" }));
    expect(await r422.json()).toEqual({ errors: { kontak: "Nomor sudah terdaftar" } });
  });
});
