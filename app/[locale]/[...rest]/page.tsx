import { notFound } from "next/navigation";

// Semua path yang tidak dikenal di bawah [locale] → not-found.tsx berbahasa sesuai locale.
export default function CatchAll() {
  notFound();
}
