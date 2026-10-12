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
  [locale]/page.tsx         Header, Hero, Siapa kami, Masalah, Visi, Misi, Nilai, Layanan, Cara kerja,
                            Katalog, Portofolio + studi kasus (bergerbang izin), Cara bekerja sama, Kontak, Footer
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
public/               logo (svg/), ilustrasi, favicon, og-image, brand/, portfolio/ (hanya tangkapan layar versi blurred)
```

## Docker dan deploy

```bash
docker network create fawz          # sekali; jaringan bersama dengan stack internal (repo fawz-internal)
cp .env.docker.example .env.deploy  # isi LEADS_API_TOKEN (sama dengan stack internal) dan nilai NEXT_PUBLIC_*
scripts/e2e-leads.sh                # uji E2E lokal: build kedua stack, kirim prospek, cek baris di PostgreSQL internal
scripts/deploy.sh                   # build image lokal, kirim ke VPS (ssh "fawztech"), docker compose up di ~/fawztech-landing
```

`docker-compose.yml` hanya berisi service `landing` (terbuka di `127.0.0.1:3000`). Ia bergabung ke jaringan `fawz` yang dibuat stack internal agar prospek bisa diteruskan ke `http://internal:3100/api/public/leads`. Reverse proxy dan HTTPS ditangani nginx + certbot di host: `deploy/nginx/fawztech.id.conf` dipasang `scripts/deploy.sh`, lalu `certbot --nginx --redirect` menambahkan HTTPS untuk `fawztech.id` dan `www`. Jalankan stack internal lebih dulu. `NEXT_PUBLIC_*` dan `SITE_URL` dibakar saat build (halaman statis), jadi mengubahnya berarti build dan deploy ulang. Turnstile diverifikasi di landing saja; token Turnstile sekali pakai, sehingga stack internal tidak memverifikasinya lagi.

## Variabel lingkungan

Lihat `.env.example`. Ringkasnya:

| Variabel | Fungsi |
| --- | --- |
| `SITE_URL` | URL publik untuk canonical, Open Graph, sitemap, JSON-LD |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` | Kontak di footer, JSON-LD, halaman privasi |
| `NEXT_PUBLIC_WA_NUMBER` | Nomor WhatsApp (`08…`/`+62…`/`62…`). Tombol WhatsApp disembunyikan bila kosong |
| `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_LINKEDIN` | Tautan sosial di footer |
| `NEXT_PUBLIC_REPLY_DAYS` | Angka hari kerja pada pesan sukses form |
| `NEXT_PUBLIC_PORTFOLIO_CLIENTS` | Slug klien yang sudah mengizinkan tayang (`arfindo-bersinar,menya-sakura,museum-nasional,kkara` atau `all`). Kosong = seksi Portofolio dan tautan navnya disembunyikan |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analitik tanpa cookie (opsional) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile (opsional; dilewati bila kosong) |
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

## Alur prospek

Form "Ceritakan idemu" → `POST /api/leads` (same-origin) → validasi sesuai `internal-app.md` (kontak dinormalkan ke `62…`, cerita ≤ 1.000 karakter, `kebutuhan` dari daftar tetap, `setuju` wajib) → honeypot, rate limit 5/menit dan 20/jam per IP, Turnstile opsional, idempotensi 10 menit → diteruskan ke `LEADS_API_URL`, atau `LEADS_WEBHOOK_URL`, atau dicatat ke konsol (hanya development). Di produksi tanpa tujuan, API membalas 503.

Rate limit disimpan di memori proses. Untuk deploy multi-instance, ganti implementasi `RateLimiter` di `lib/leads/rate-limit.ts` dengan penyimpanan bersama.

## Navigasi antar seksi

Tautan nav dan tombol CTA menggulir ke seksi tanpa menulis `#id` ke URL (`app/components/ui/AnchorScroll.tsx` mencegat klik anchor di halaman yang sama). Dari halaman lain, header menautkan ke beranda dengan `?s=id`; setelah menggulir, parameter itu dihapus dari URL. Tanpa JavaScript tautan tetap bekerja sebagai anchor biasa.

## Desain

- Token: `app/styles/tokens.css` adalah sumber kebenaran; Tailwind memetakan `bg-action`, `text-ink`, `rounded-md`, dan sebagainya ke variabel `--fawz-*`.
- Tema gelap: `<html data-theme="dark">`. Seksi navy memakai kelas `theme-dark` agar token semantik otomatis gelap.
- Amber tidak pernah menjadi warna teks di latar terang. Eyebrow memakai teal di latar terang, amber di latar navy.
- Portofolio dan studi kasus Arfindo hanya tayang untuk klien yang ada di `NEXT_PUBLIC_PORTFOLIO_CLIENTS` (izin klien, brief §3). Tangkapan layar yang dipakai hanya versi `blurred`; versi `-original` diabaikan git dan tidak boleh dipublikasikan.
- Testimoni dan Tim sengaja tidak ada: slide-nya dihapus dari company profile final (Oktober 2026).
- Naskah memakai sapaan formal "Anda" (deck: "Bisnis Anda, Cara Anda"); handoff menyarankan "kamu" untuk web. Keputusan ada di tim bisnis.

## Yang masih harus diisi tim bisnis

Domain (fawztech.id), Instagram, LinkedIn, alamat lengkap (saat ini "Jl Punai II" tanpa kota dan kode pos), izin klien portofolio (Arfindo Bersinar, Menya Sakura, Museum Nasional Indonesia, KKARA) termasuk persetujuan tangkapan layar Arfindo, akun Turnstile, alat analitik, pengecekan merek dagang (DJKI), dan tinjauan hukum teks `/privasi` (naikkan `PRIVACY_POLICY_VERSION` di `lib/privacy.ts` setelah diubah).
