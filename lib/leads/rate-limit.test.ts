import { describe, expect, it } from "vitest";
import { MemoryIdempotencyStore, MemoryRateLimiter, leadHash } from "./rate-limit";

describe("MemoryRateLimiter", () => {
  it("mengizinkan 5 per menit lalu menolak yang ke-6 dengan Retry-After", () => {
    const rl = new MemoryRateLimiter();
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rl.hit("ip", t0 + i * 1000).allowed).toBe(true);
    const r = rl.hit("ip", t0 + 5000);
    expect(r.allowed).toBe(false);
    expect(r.retryAfterSec).toBeGreaterThan(0);
    expect(r.retryAfterSec).toBeLessThanOrEqual(60);
  });

  it("mereset setelah jendela satu menit lewat", () => {
    const rl = new MemoryRateLimiter();
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) rl.hit("ip", t0);
    expect(rl.hit("ip", t0 + 61_000).allowed).toBe(true);
  });

  it("membatasi 20 per jam walau tersebar", () => {
    const rl = new MemoryRateLimiter();
    const t0 = 1_000_000;
    for (let i = 0; i < 20; i++) expect(rl.hit("ip", t0 + i * 120_000).allowed).toBe(true);
    expect(rl.hit("ip", t0 + 20 * 120_000).allowed).toBe(false);
    expect(rl.hit("ip", t0 + 3_600_001).allowed).toBe(true);
  });

  it("memisahkan kunci", () => {
    const rl = new MemoryRateLimiter();
    for (let i = 0; i < 5; i++) rl.hit("a", 0);
    expect(rl.hit("b", 0).allowed).toBe(true);
  });
});

describe("MemoryIdempotencyStore", () => {
  it("mengembalikan id yang sama dalam TTL dan melupakan setelahnya", () => {
    const s = new MemoryIdempotencyStore(10 * 60_000);
    const h = leadHash("628123456789", "cerita");
    s.set(h, "id-1", 0);
    expect(s.get(h, 5 * 60_000)).toBe("id-1");
    expect(s.get(h, 11 * 60_000)).toBeUndefined();
  });

  it("hash berbeda untuk isi berbeda", () => {
    expect(leadHash("a", "b")).not.toBe(leadHash("a", "c"));
  });
});
