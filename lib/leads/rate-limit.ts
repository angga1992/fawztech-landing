import { createHash, randomUUID } from "node:crypto";

export type RateLimitWindow = { windowMs: number; max: number };

export interface RateLimiter {
  /** Catat satu permintaan untuk kunci dan beri tahu apakah masih diizinkan. */
  hit(key: string, now?: number): { allowed: boolean; retryAfterSec: number };
}

/** Batas per IP: 5 per menit dan 20 per jam (bawaan). In-memory, per instance proses. */
export const DEFAULT_WINDOWS: RateLimitWindow[] = [
  { windowMs: 60_000, max: 5 },
  { windowMs: 3_600_000, max: 20 },
];

export class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();
  private calls = 0;
  private readonly maxWindow: number;

  constructor(private readonly windows: RateLimitWindow[] = DEFAULT_WINDOWS) {
    this.maxWindow = Math.max(...windows.map((w) => w.windowMs));
  }

  hit(key: string, now = Date.now()) {
    this.maybeCleanup(now);
    const list = (this.hits.get(key) ?? []).filter((t) => now - t < this.maxWindow);
    let retryAfterSec = 0;
    for (const w of this.windows) {
      const inWindow = list.filter((t) => now - t < w.windowMs);
      if (inWindow.length >= w.max) {
        const oldest = Math.min(...inWindow);
        retryAfterSec = Math.max(retryAfterSec, Math.ceil((w.windowMs - (now - oldest)) / 1000));
      }
    }
    if (retryAfterSec > 0) {
      this.hits.set(key, list);
      return { allowed: false, retryAfterSec };
    }
    list.push(now);
    this.hits.set(key, list);
    return { allowed: true, retryAfterSec: 0 };
  }

  private maybeCleanup(now: number) {
    this.calls += 1;
    if (this.calls % 200 !== 0) return;
    for (const [k, list] of this.hits) {
      const kept = list.filter((t) => now - t < this.maxWindow);
      if (kept.length === 0) this.hits.delete(k);
      else this.hits.set(k, kept);
    }
  }

  reset() {
    this.hits.clear();
  }
}

/** Tolak kiriman identik dalam 10 menit; kembalikan id yang sama. */
export class MemoryIdempotencyStore {
  private entries = new Map<string, { id: string; at: number }>();

  constructor(private readonly ttlMs = 10 * 60_000) {}

  get(hash: string, now = Date.now()): string | undefined {
    const e = this.entries.get(hash);
    if (!e) return undefined;
    if (now - e.at > this.ttlMs) {
      this.entries.delete(hash);
      return undefined;
    }
    return e.id;
  }

  set(hash: string, id: string, now = Date.now()) {
    if (this.entries.size > 5000) {
      for (const [k, e] of this.entries) if (now - e.at > this.ttlMs) this.entries.delete(k);
    }
    this.entries.set(hash, { id, at: now });
  }

  reset() {
    this.entries.clear();
  }
}

export function leadHash(kontak: string, cerita: string): string {
  return createHash("sha256").update(`${kontak}\n${cerita}`).digest("hex");
}

export function newLeadId(): string {
  return randomUUID();
}
