import type { Locale } from "@/lib/i18n/config";

/** Pesan galat dan status buatan landing page, per locale. Pesan dari sistem internal tidak diterjemahkan. */
export const MESSAGES_ID = {
  required: "Wajib diisi",
  contact: "Isi nomor WhatsApp (08… atau +62…) atau email yang valid",
  storyMax: "Maksimal 1.000 karakter",
  needs: "Pilihan tidak dikenali",
  consent: "Centang persetujuan untuk melanjutkan",
  tooLong: "Terlalu panjang",
  captcha: "Verifikasi gagal. Muat ulang halaman dan coba lagi.",
  /** Alias lama; sistem internal versi awal memakai kunci ini. */
  turnstile: "Verifikasi gagal. Muat ulang halaman dan coba lagi.",
  badBody: "Bentuk data tidak dikenali.",
  tooMany: "Terlalu banyak percobaan. Coba lagi beberapa menit.",
  forwardFailed: "Pengiriman gagal. Coba lagi atau hubungi kami lewat WhatsApp.",
  notConfigured: "Form belum aktif. Hubungi kami lewat WhatsApp.",
} as const;

export type Messages = { readonly [K in keyof typeof MESSAGES_ID]: string };

export const MESSAGES_EN: Messages = {
  required: "This field is required",
  contact: "Enter a valid Indonesian WhatsApp number (08… or +62…) or email address",
  storyMax: "Maximum 1,000 characters",
  needs: "Unknown option",
  consent: "Please tick the consent box to continue",
  tooLong: "Too long",
  captcha: "Verification failed. Reload the page and try again.",
  turnstile: "Verification failed. Reload the page and try again.",
  badBody: "Unrecognised request format.",
  tooMany: "Too many attempts. Please try again in a few minutes.",
  forwardFailed: "Sending failed. Try again or contact us on WhatsApp.",
  notConfigured: "The form is not active yet. Contact us on WhatsApp.",
};

export function messagesFor(locale: Locale | string | undefined | null): Messages {
  return locale === "en" ? MESSAGES_EN : MESSAGES_ID;
}
