# Fawz Tech – Landing page

Landing page Fawz Tech (software house aplikasi custom: Web, Mobile, Desktop, UI/UX). Dibangun dengan Next.js 14, Tailwind, dan TypeScript, mengikuti paket handoff `fawz-tech-dev-handoff` (panduan desain, aset brand, brief landing page) dan kontrak API prospek dari `internal-app.md`.

> Folder repo ini masih bernama `nextvoid` dari proyek sebelumnya. Aman untuk diganti nama, misalnya `mv nextvoid fawz-tech-landing`; tidak ada yang bergantung pada nama folder.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi nilai yang tersedia
npm run dev                  # http://localhost:3000
npm test                     # uji validasi dan API prospek
npm run build && npm start   # produksi
```

## Struktur

```
middleware.ts         deteksi bahasa (cookie > negara > Accept-Language), rewrite /→/id, redirect /en
app/
  [locale]/layout.tsx       html lang, metadata dasar, JSON-LD, tautan lompat
  [locale]/page.tsx         Header, Hero, Masalah, Layanan, Cara kerja, Kontak, Footer
  [locale]/privasi/page.tsx kebijakan privasi Indonesia (/privasi)
  [locale]/privacy/page.tsx kebijakan privasi Inggris (/en/privacy)
  [locale]/not-found.tsx    404 berbahasa sesuai locale
  api/leads/route.ts        POST /api/leads: validasi, anti-spam, penerusan
  components/               seksi halaman dan komponen ui/
  styles/fonts.css          @font-face (salinan fonts.css handoff); woff2 di public/fonts/
  styles/tokens.css         token desain (salinan 02-assets/brand/tokens.css)
content/id.ts, en.ts  naskah per bahasa (id setara landing-copy.json)
lib/i18n/             locale, resolver, routes, kamus, metadata, format tanggal
lib/site.ts           konfigurasi situs dan placeholder kontak
lib/leads/            validasi, normalisasi, pesan dua bahasa, rate limit, Turnstile, penerusan
public/               logo (svg/), ilustrasi, favicon, og-image, brand/
```

## Variabel lingkungan

Lihat `.env.example`. Ringkasnya:

| Variabel | Fungsi |
| --- | --- |
| `SITE_URL` | URL publik untuk canonical, Open Graph, sitemap, JSON-LD |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` | Kontak di footer, JSON-LD, halaman privasi |
| `NEXT_PUBLIC_WA_NUMBER` | Nomor WhatsApp (`08…`/`+62…`/`62…`). Tombol WhatsApp disembunyikan bila kosong |
| `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_LINKEDIN` | Tautan sosial di footer |
| `NEXT_PUBLIC_REPLY_DAYS` | Angka hari kerja pada pesan sukses form |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analitik tanpa cookie (opsional) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_MIN_SCORE`, `RECAPTCHA_HOSTNAMES` | Google reCAPTCHA v3 pada form prospek (penyedia utama) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile (alternatif; dipakai hanya bila site key reCAPTCHA kosong) |
| `LEADS_API_URL`, `LEADS_API_TOKEN` | Endpoint `POST /api/public/leads` sistem internal Fawz Tech |
| `LEADS_WEBHOOK_URL` | Webhook cadangan (n8n, Make, Apps Script) bila sistem internal belum ada |
| `LEADS_ALLOWED_ORIGIN` | Origin lain yang boleh memanggil `/api/leads` (opsional) |
| `GEO_COUNTRY_HEADER` | Nama header kustom berisi kode negara, bila proxy tidak memakai header Vercel/Cloudflare/CloudFront |

Nilai yang kosong memakai placeholder dari naskah (`[nama@domainanda.id]`, `[X] hari kerja`, dan seterusnya) dan `next build` mencetak peringatan `[fawz] Nilai berikut masih placeholder`.

## Bahasa dan deteksi negara

Dua locale: Indonesia tanpa awalan (`/`, `/privasi`) dan Inggris di `/en` (`/en`, `/en/privacy`). Naskah ada di `content/id.ts` (sumber tipe) dan `content/en.ts` (`satisfies Dictionary`, jadi kunci yang hilang gagal di `tsc`). Naskah Inggris diterjemahkan tim dev dan perlu ditinjau tim bisnis.

Pengalih bahasa di header berupa toggle bendera (paling kanan, setelah tombol utama); menekan toggle membuka halaman padanan dengan `?lang=` sehingga cookie terpasang.

`middleware.ts` menentukan bahasa untuk URL tanpa awalan dengan prioritas: cookie `NEXT_LOCALE` (dipasang hanya saat pengunjung menekan pengalih "ID | EN") → kode negara dari header geo (`ID` → Indonesia, lainnya → redirect 302 ke `/en…`) → `Accept-Language` → Indonesia. Crawler tidak pernah diarahkan; setiap halaman memuat `hreflang`. Header negara dibaca dari `GEO_COUNTRY_HEADER` (opsional), lalu `x-vercel-ip-country`, `cf-ipcountry`, `cloudfront-viewer-country`, `x-country-code`.

Uji lokal:

```bash
curl -i -H "x-country-code: US" http://localhost:3000/        # 302 → /en
curl -i -H "x-country-code: ID" http://localhost:3000/        # 200 Indonesia
curl -i --cookie "NEXT_LOCALE=id" -H "x-country-code: US" http://localhost:3000/   # 200 Indonesia
```

Pesan 422 yang berasal dari sistem internal tetap berbahasa Indonesia (kontrak `internal-app.md`); pesan buatan landing page mengikuti field `locale` di body.

Batasan Next 14: karena root layout berada di `app/[locale]/`, respons 404 berstatus benar tetapi isi halaman not-found berbahasa baru tampil setelah hidrasi JavaScript.

## Captcha (reCAPTCHA v3)

Penyedia dipilih dari env: reCAPTCHA v3 bila `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` diisi, Turnstile bila hanya site key Turnstile, tanpa captcha bila keduanya kosong. Skrip Google dimuat saat pengguna pertama kali berinteraksi dengan form (bukan saat halaman dibuka), dan token diminta saat kirim dengan aksi `lead_submit`. Badge disembunyikan; teks atribusi Google tampil di bawah tombol kirim.

Token reCAPTCHA sekali pakai, jadi verifikasi terjadi tepat sekali: di sistem internal bila `LEADS_API_URL` terisi (token diteruskan apa adanya), atau di landing pada mode webhook/log. Aturan verifikasi: `success`, `action = lead_submit`, skor ≥ `RECAPTCHA_MIN_SCORE` (0,5), hostname ∈ `RECAPTCHA_HOSTNAMES` (bawaan hostname `SITE_URL`; `localhost` diizinkan di luar produksi). Google tidak terjangkau → ditolak. Buat kunci di Google reCAPTCHA Admin (tipe v3) dengan domain landing dan `localhost`.

## Alur prospek

Form "Ceritakan idemu" → `POST /api/leads` (same-origin) → validasi sesuai `internal-app.md` (kontak dinormalkan ke `62…`, cerita ≤ 1.000 karakter, `kebutuhan` dari daftar tetap, `setuju` wajib) → honeypot, rate limit 5/menit dan 20/jam per IP, Turnstile opsional, idempotensi 10 menit → diteruskan ke `LEADS_API_URL`, atau `LEADS_WEBHOOK_URL`, atau dicatat ke konsol (hanya development). Di produksi tanpa tujuan, API membalas 503.

Rate limit disimpan di memori proses. Untuk deploy multi-instance, ganti implementasi `RateLimiter` di `lib/leads/rate-limit.ts` dengan penyimpanan bersama.

## Desain

- Token: `app/styles/tokens.css` adalah sumber kebenaran; Tailwind memetakan `bg-action`, `text-ink`, `rounded-md`, dan sebagainya ke variabel `--fawz-*`.
- Tema gelap: `<html data-theme="dark">`. Seksi navy memakai kelas `theme-dark` agar token semantik otomatis gelap.
- Amber tidak pernah menjadi warna teks di latar terang. Eyebrow memakai teal di latar terang, amber di latar navy.
- Seksi portofolio dan testimoni sengaja tidak ada sampai ada data klien nyata dan izin.

## Yang masih harus diisi tim bisnis

Domain, email, nomor WhatsApp, Instagram, LinkedIn, alamat lengkap, janji waktu balas, akun Turnstile, alat analitik, dan tinjauan hukum teks `/privasi` (naikkan `PRIVACY_POLICY_VERSION` di `lib/privacy.ts` setelah diubah).
