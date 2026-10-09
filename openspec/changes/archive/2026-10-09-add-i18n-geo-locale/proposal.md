## Why

Landing page Fawz Tech saat ini hanya berbahasa Indonesia, padahal paket handoff sudah menyiapkan tagline dan bahasa Inggris ("The right system for your business, built together.") dan prospek dari luar Indonesia tidak bisa membaca halaman maupun mengisi form. Pengunjung harus langsung mendapat bahasa yang tepat tanpa mencari tombol: Indonesia untuk pengunjung dari Indonesia, Inggris untuk pengunjung dari negara lain, dengan pilihan manual yang diingat.

## What Changes

- Dua locale: `id` (default, URL tanpa awalan: `/`, `/privasi`) dan `en` (`/en`, `/en/privacy`). Semua seksi, form, pesan galat, halaman privasi, dan metadata diterjemahkan ke bahasa Inggris dengan suara brand yang sama (jelas, hangat, "you").
- Deteksi lokasi di middleware: negara dari header geo penyedia hosting (Vercel, Cloudflare, CloudFront) atau header kustom; pengunjung dari luar Indonesia yang membuka URL tanpa awalan locale diarahkan ke `/en…`. Bila negara tidak diketahui, pakai `Accept-Language`; bila tetap tidak diketahui, Indonesia.
- Pilihan manual lewat pengalih bahasa "ID | EN" di header, disimpan di cookie `NEXT_LOCALE` yang mengalahkan deteksi geo. Bot mesin pencari tidak pernah diarahkan, dan setiap halaman menyatakan alternatif `hreflang` (id, en, x-default) agar kedua versi terindeks.
- **BREAKING** Struktur route berubah: halaman pindah ke segmen `app/[locale]/`; `content/landing.ts` menjadi kamus per locale (`content/id.ts`, `content/en.ts`) dengan tipe yang sama sehingga tidak ada kunci yang tertinggal.
- Form prospek: validasi klien memakai pesan sesuai locale; `POST /api/leads` menerima field `locale` untuk pesan 422/429/5xx-nya sendiri, tetapi payload ke sistem internal tetap persis kontrak `internal-app.md` (field `locale` tidak diteruskan).
- Pesan WhatsApp terisi, pesan sukses form, dan format tanggal pada halaman privasi mengikuti locale.
- Sitemap memuat `/`, `/privasi`, `/en`, `/en/privacy`; `og:locale` per halaman dengan `og:locale:alternate`; `<html lang>` per locale.
- Uji otomatis untuk fungsi penentu locale (negara, cookie, `Accept-Language`, bot) dan kelengkapan kamus.

## Capabilities

### New Capabilities
- `locale-routing`: struktur URL per locale, deteksi negara di middleware, prioritas cookie > geo > Accept-Language > default, pengecualian bot dan aset, pengalih bahasa, cookie.
- `english-translation`: cakupan dan kualitas terjemahan Inggris: kamus bertipe, semua naskah seksi, form, privasi, metadata, pesan WhatsApp; aturan suara dan istilah.

### Modified Capabilities
- `landing-page`: header memuat pengalih bahasa; naskah berasal dari kamus per locale; tautan internal (privasi, anchor) mengikuti locale.
- `lead-form`: pesan validasi dan status mengikuti locale; payload menyertakan `locale`.
- `lead-api`: menerima `locale` opsional untuk pesan respons; tidak meneruskannya ke hulu.
- `site-metadata`: metadata, `lang`, Open Graph, canonical, `hreflang`, dan sitemap per locale.
- `privacy-page`: versi Inggris di `/en/privacy` dengan konten dan versi kebijakan yang sama; tanggal diformat per locale.

## Impact

- **Kode:** `app/page.tsx`, `app/privasi/page.tsx`, `app/layout.tsx` pindah ke `app/[locale]/…`; baru: `middleware.ts`, `lib/i18n/` (konfigurasi locale, resolver, kamus), `content/id.ts`, `content/en.ts`, pengalih bahasa di `Header.tsx`; `LeadForm.tsx`, `route.ts`, `sitemap.ts`, `lib/privacy.ts` diubah. Semua komponen seksi menerima kamus lewat prop atau helper `getDictionary(locale)`.
- **Dependensi:** tidak ada pustaka i18n baru; middleware bawaan Next 14.
- **Hosting:** deteksi negara bergantung pada header geo penyedia (`x-vercel-ip-country`, `cf-ipcountry`, `cloudfront-viewer-country`) atau header yang dikonfigurasi lewat `GEO_COUNTRY_HEADER`. Tanpa header, fallback `Accept-Language`. Middleware membuat respons `/` tetap statis (hanya redirect yang dinamis).
- **SEO:** halaman `/` tetap berbahasa Indonesia untuk crawler; `/en` diindeks terpisah lewat `hreflang`. Redirect geo memakai 302 dan tidak berlaku untuk bot.
- **Konten:** naskah Inggris adalah terjemahan oleh tim dev dari `landing-copy.json` dan `MESSAGING-KIT.md`; perlu ditinjau tim bisnis sebelum tayang, seperti halnya teks privasi.
