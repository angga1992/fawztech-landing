import { MemoryIdempotencyStore, MemoryRateLimiter } from "./rate-limit";

// Singleton per instance proses. Cukup untuk satu server; lihat design.md untuk multi-instance.
export const limiter = new MemoryRateLimiter();
export const idem = new MemoryIdempotencyStore();

/** Hanya untuk uji otomatis. */
export function resetLeadState() {
  limiter.reset();
  idem.reset();
}
