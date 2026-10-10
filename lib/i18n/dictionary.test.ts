import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { en } from "@/content/en";
import { id } from "@/content/id";
import { fill, getDictionary } from "./dictionary";

function leaves(obj: unknown, prefix = ""): Map<string, unknown> {
  const out = new Map<string, unknown>();
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object") for (const [kk, vv] of leaves(v, key)) out.set(kk, vv);
      else out.set(key, v);
    }
  }
  return out;
}

describe("kamus id dan en", () => {
  const li = leaves(id);
  const le = leaves(en);

  it("memiliki himpunan kunci daun yang sama", () => {
    expect([...le.keys()].sort()).toEqual([...li.keys()].sort());
  });

  it("tidak memiliki string kosong", () => {
    for (const [k, v] of [...li, ...le]) {
      if (typeof v === "string") expect(v.trim(), k).not.toBe("");
    }
  });

  it("menyimpan placeholder yang dibutuhkan komponen", () => {
    for (const d of [id, en]) {
      expect(d.contact.form.success).toContain("{X}");
      expect(d.contact.form.remaining).toContain("{n}");
      expect(d.contact.form.captchaNotice).toContain("{privacy}");
      expect(d.contact.form.captchaNotice).toContain("{terms}");
      expect(d.contact.form.captchaPrivacy).not.toBe("");
      expect(d.contact.form.captchaTerms).not.toBe("");
      expect(d.privacy.version).toContain("{date}");
      const all = JSON.stringify(d.privacy.sections);
      for (const t of ["{name}", "{address}", "{months}", "{email}"]) expect(all).toContain(t);
    }
  });

  it("urutan layanan tetap Web, Mobile, Desktop, UI/UX dan jumlah seksi privasi sama", () => {
    expect(en.services.items.map((s) => s.name)).toEqual(["Web", "Mobile", "Desktop", "UI/UX"]);
    expect(en.privacy.sections.length).toBe(id.privacy.sections.length);
    expect(en.locale).toBe("en");
    expect(id.locale).toBe("id");
  });

  it("naskah Inggris tanpa frasa terlarang dan nama ditulis dua kata", () => {
    const src = readFileSync(new URL("../../content/en.ts", import.meta.url), "utf8");
    for (const bad of ["best solution", "revolutionary", "one-stop"]) {
      expect(src.toLowerCase().includes(bad), bad).toBe(false);
    }
    for (const bad of ["FawzTech", "FAWZ TECH"]) {
      expect(src.includes(bad), bad).toBe(false);
    }
  });

  it("getDictionary dan fill", () => {
    expect(getDictionary("en").meta.title).toMatch(/^Fawz Tech \| .+/);
    expect(getDictionary("en").meta.title).not.toBe(getDictionary("id").meta.title);
    expect(getDictionary("id").meta.ogLocale).toBe("id_ID");
    expect(fill("Sisa {n} karakter.", { n: 5 })).toBe("Sisa 5 karakter.");
    expect(fill("{a} {b}", { a: "x" })).toBe("x {b}");
  });
});
