import { describe, expect, it } from "vitest";
import { MAX_STORY, MESSAGES, isEmail, normalizeContact, normalizePhone, validateLead } from "./schema";

const valid = {
  nama: "Budi Santoso",
  kontak: "08123456789",
  bisnis: "CV Maju Jaya",
  kebutuhan: ["web", "mobile"],
  cerita: "Kami mau merapikan pemesanan dari chat ke satu sistem.",
  setuju: true,
};

describe("normalizePhone", () => {
  it("menormalkan 08…, +62…, 62… ke 62…", () => {
    expect(normalizePhone("08123456789")).toBe("628123456789");
    expect(normalizePhone("+628123456789")).toBe("628123456789");
    expect(normalizePhone("628123456789")).toBe("628123456789");
  });
  it("mengabaikan spasi, strip, titik, dan kurung", () => {
    expect(normalizePhone("+62 812-3456-7890")).toBe("6281234567890");
    expect(normalizePhone("0812 3456 7890")).toBe("6281234567890");
    expect(normalizePhone("(0812) 3456.7890")).toBe("6281234567890");
  });
  it("menolak nomor non-Indonesia, huruf, terlalu pendek, atau terlalu panjang", () => {
    expect(normalizePhone("+1 555 123 4567")).toBeNull();
    expect(normalizePhone("halo")).toBeNull();
    expect(normalizePhone("0812")).toBeNull();
    expect(normalizePhone("0812345678901234")).toBeNull();
  });
});

describe("isEmail / normalizeContact", () => {
  it("menerima email valid dan menurunkan huruf", () => {
    expect(isEmail("budi@contoh.id")).toBe(true);
    expect(normalizeContact("Budi@Contoh.ID")).toEqual({ kind: "email", value: "budi@contoh.id" });
  });
  it("menolak email tidak valid", () => {
    expect(isEmail("budi@")).toBe(false);
    expect(isEmail("budi contoh.id")).toBe(false);
    expect(normalizeContact("budi@contoh")).toBeNull();
  });
  it("mengenali nomor telepon", () => {
    expect(normalizeContact(" 0812-3456-789 ")).toEqual({ kind: "phone", value: "628123456789" });
  });
});

describe("validateLead", () => {
  it("meloloskan input valid dan menormalkan kontak", () => {
    const r = validateLead(valid);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.kontak).toBe("628123456789");
      expect(r.data.kebutuhan).toEqual(["web", "mobile"]);
      expect(r.data.setuju).toBe(true);
      expect(r.data.website).toBe("");
    }
  });

  it("menandai semua field wajib yang kosong sekaligus", () => {
    const r = validateLead({ nama: "", kontak: "", cerita: "", setuju: false });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.nama).toBe(MESSAGES.required);
      expect(r.errors.kontak).toBe(MESSAGES.required);
      expect(r.errors.cerita).toBe(MESSAGES.required);
      expect(r.errors.setuju).toBe(MESSAGES.consent);
    }
  });

  it("menolak kontak tidak valid dengan pesan format", () => {
    const r = validateLead({ ...valid, kontak: "halo" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.kontak).toBe(MESSAGES.contact);
  });

  it("menerima cerita 1.000 karakter dan menolak 1.001", () => {
    expect(validateLead({ ...valid, cerita: "a".repeat(MAX_STORY) }).ok).toBe(true);
    const r = validateLead({ ...valid, cerita: "a".repeat(MAX_STORY + 1) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.cerita).toBe(MESSAGES.storyMax);
  });

  it("menolak kebutuhan di luar daftar dan menghapus duplikat", () => {
    const bad = validateLead({ ...valid, kebutuhan: ["web", "blockchain"] });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.errors.kebutuhan).toBe(MESSAGES.needs);
    const dup = validateLead({ ...valid, kebutuhan: ["web", "web", "uiux"] });
    expect(dup.ok).toBe(true);
    if (dup.ok) expect(dup.data.kebutuhan).toEqual(["web", "uiux"]);
  });

  it("menerima kebutuhan sebagai string tunggal (form-urlencoded) dan setuju 'on'", () => {
    const r = validateLead({ ...valid, kebutuhan: "desktop", setuju: "on" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.kebutuhan).toEqual(["desktop"]);
  });

  it("menolak setuju false", () => {
    const r = validateLead({ ...valid, setuju: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.setuju).toBe(MESSAGES.consent);
  });

  it("menolak nama dan bisnis terlalu panjang", () => {
    const r = validateLead({ ...valid, nama: "a".repeat(121), bisnis: "b".repeat(121) });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.nama).toBe(MESSAGES.tooLong);
      expect(r.errors.bisnis).toBe(MESSAGES.tooLong);
    }
  });

  it("memotong field meta ke 500 karakter dan meneruskan UTM", () => {
    const r = validateLead({ ...valid, utm_source: "instagram", page_url: "x".repeat(600) });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.utm_source).toBe("instagram");
      expect(r.data.page_url.length).toBe(500);
    }
  });
});

describe("validateLead dengan kamus pesan lain", () => {
  it("memakai pesan Inggris bila diberikan", async () => {
    const { MESSAGES_EN, MESSAGES_ID } = await import("./messages");
    expect(Object.keys(MESSAGES_EN).sort()).toEqual(Object.keys(MESSAGES_ID).sort());
    const r = validateLead({ nama: "", kontak: "halo", cerita: "x".repeat(1001), setuju: false, kebutuhan: ["zzz"] }, MESSAGES_EN);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.nama).toBe("This field is required");
      expect(r.errors.kontak).toBe(MESSAGES_EN.contact);
      expect(r.errors.cerita).toBe("Maximum 1,000 characters");
      expect(r.errors.kebutuhan).toBe("Unknown option");
      expect(r.errors.setuju).toBe("Please tick the consent box to continue");
    }
  });
  it("membuang field locale dari payload", () => {
    const r = validateLead({ ...valid, locale: "en" });
    expect(r.ok).toBe(true);
    if (r.ok) expect("locale" in r.data).toBe(false);
  });
});
