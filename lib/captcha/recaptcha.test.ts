import { describe, expect, it, vi } from "vitest";
import { allowedHostnames, minScoreFromEnv, verifyRecaptcha } from "./recaptcha";

const reply = (body: unknown, status = 200) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));
const base = { secret: "s3cret", hostnames: ["domainanda.id"], minScore: 0.5, production: true };
const good = { success: true, score: 0.9, action: "lead_submit", hostname: "domainanda.id" };

describe("verifyRecaptcha", () => {
  it("lolos bila success, aksi, hostname, dan skor memenuhi", async () => {
    const f = reply(good);
    const r = await verifyRecaptcha("tok", "1.2.3.4", { ...base, fetchImpl: f });
    expect(r).toEqual({ ok: true, score: 0.9, reason: "ok", hostname: "domainanda.id" });
    const body = f.mock.calls[0][1].body as URLSearchParams;
    expect(body.get("secret")).toBe("s3cret");
    expect(body.get("response")).toBe("tok");
    expect(body.get("remoteip")).toBe("1.2.3.4");
  });
  it("skor rendah", async () => {
    const r = await verifyRecaptcha("tok", "ip", { ...base, fetchImpl: reply({ ...good, score: 0.2 }) });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("low_score");
    expect(r.score).toBe(0.2);
  });
  it("ambang bisa diturunkan", async () => {
    const r = await verifyRecaptcha("tok", "ip", { ...base, minScore: 0.1, fetchImpl: reply({ ...good, score: 0.2 }) });
    expect(r.ok).toBe(true);
  });
  it("aksi berbeda", async () => {
    const r = await verifyRecaptcha("tok", "ip", { ...base, fetchImpl: reply({ ...good, action: "login" }) });
    expect(r.reason).toBe("action_mismatch");
  });
  it("hostname asing", async () => {
    const r = await verifyRecaptcha("tok", "ip", { ...base, fetchImpl: reply({ ...good, hostname: "evil.example" }) });
    expect(r.reason).toBe("hostname_mismatch");
  });
  it("success false", async () => {
    const r = await verifyRecaptcha("tok", "ip", { ...base, fetchImpl: reply({ success: false, "error-codes": ["invalid-input-response"] }) });
    expect(r.reason).toBe("rejected");
  });
  it("Google tidak terjangkau atau timeout → gagal tertutup", async () => {
    expect((await verifyRecaptcha("tok", "ip", { ...base, fetchImpl: vi.fn().mockRejectedValue(new Error("timeout")) })).reason).toBe("unavailable");
    expect((await verifyRecaptcha("tok", "ip", { ...base, fetchImpl: reply({}, 503) })).reason).toBe("unavailable");
  });
  it("token kosong dan secret kosong", async () => {
    expect((await verifyRecaptcha("", "ip", { ...base, fetchImpl: reply(good) })).reason).toBe("missing_token");
    expect((await verifyRecaptcha("tok", "ip", { ...base, secret: "", fetchImpl: reply(good) })).reason).toBe("missing_secret");
  });
});

describe("kunci uji", () => {
  it("kunci uji Google (tanpa score/action) diterima hanya di luar produksi", async () => {
    const testReply = { success: true, challenge_ts: "2026-10-10T01:36:57Z", hostname: "testkey.google.com" };
    expect((await verifyRecaptcha("t", "ip", { ...base, production: false, fetchImpl: reply(testReply) })).ok).toBe(true);
    expect((await verifyRecaptcha("t", "ip", { ...base, production: true, fetchImpl: reply(testReply) })).ok).toBe(false);
  });
});

describe("env helpers", () => {
  it("hostname dari RECAPTCHA_HOSTNAMES atau SITE_URL, localhost di luar produksi", () => {
    expect(allowedHostnames({ RECAPTCHA_HOSTNAMES: "a.id, B.id" }, true)).toEqual(["a.id", "b.id"]);
    expect(allowedHostnames({ SITE_URL: "https://domainanda.id/x" }, true)).toEqual(["domainanda.id"]);
    expect(allowedHostnames({ SITE_URL: "https://domainanda.id" }, false)).toContain("localhost");
  });
  it("ambang dari env dengan fallback 0.5", () => {
    expect(minScoreFromEnv({ RECAPTCHA_MIN_SCORE: "0.3" })).toBe(0.3);
    expect(minScoreFromEnv({ RECAPTCHA_MIN_SCORE: "abc" })).toBe(0.5);
    expect(minScoreFromEnv({ RECAPTCHA_MIN_SCORE: "7" })).toBe(0.5);
  });
});
