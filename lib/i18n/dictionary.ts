import { en } from "@/content/en";
import { id, type Dictionary } from "@/content/id";
import type { Locale } from "./config";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { id, en: en as unknown as Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Ganti token {X} dengan nilai. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}

/** Irisan kamus untuk Header (client component): hindari mengirim seluruh naskah ke payload RSC. */
export type HeaderDictionary = Pick<Dictionary, "header" | "switcher" | "nav" | "navCta">;
export function headerDictionary(t: Dictionary): HeaderDictionary {
  return { header: t.header, switcher: t.switcher, nav: t.nav, navCta: t.navCta };
}
