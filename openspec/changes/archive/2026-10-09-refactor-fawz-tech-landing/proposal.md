## Why

Repo ini masih berisi landing page "Nexvoid" (brand lama, font Google, konten placeholder klien besar, form yang tidak mengirim ke mana pun). Fawz Tech sudah punya paket handoff resmi (`fawz-tech-dev-handoff`: panduan desain, aset brand, brief landing page, naskah) dan brief sistem internal (`internal-app.md`) yang menetapkan kontrak API prospek `POST /api/public/leads`. Landing page harus ditayangkan dengan brand, naskah, dan form yang benar, dan form itu harus langsung menjadi prospek di sistem internal begitu sistem itu tayang.

## What Changes

- **BREAKING** Rebrand penuh Nexvoid menjadi Fawz Tech: nama paket, metadata, logo, warna, font, naskah, dan semua aset `public/nexvoid*` dihapus.
- Pasang aset brand dari handoff ke `public/`: logo SVG, 18 ilustrasi, favicon + `site.webmanifest`, font woff2 self-host, `og-image-1200x630.png`, dan `tokens.css` sebagai sumber tunggal variabel warna, font, dan radius.
- Ganti font Google (Bricolage, Hanken, IBM Plex Mono) dengan Plus Jakarta Sans dan JetBrains Mono self-host lewat `next/font/local`; preload hanya Plus Jakarta Sans 400 dan 800.
- Petakan Tailwind ke token Fawz Tech (`navy`, `amber`, `teal`, `mist`, token semantik `surface`/`ink`/`line`/`action`, `radius-sm/md/lg`) dan hapus utilitas lama (`glow-orb`, `noise`, `shimmer`, `grid-bg`, gradien).
- Susun ulang halaman sesuai LANDING-BRIEF: Header sticky, Hero (`#atas`), Masalah (`#masalah`), Layanan bento (`#layanan`), Cara kerja tangga (`#cara-kerja`), Ajakan + form (`#kontak`), Footer. Seksi Marquee, Stats, Solutions, Clients (portofolio/testimoni) dihapus dan `#cerita` tidak diterbitkan.
- Form "Ceritakan idemu" dengan field, validasi, pesan galat per field, honeypot, persetujuan privasi, dan pesan sukses sesuai naskah; tombol WhatsApp dengan pesan awal terisi.
- Route handler `POST /api/leads` di Next.js yang memvalidasi sesuai kontrak `internal-app.md` (nama, kontak dinormalkan ke `62…` atau email, cerita ≤ 1.000 karakter, `kebutuhan` whitelist, `setuju=true`), menerapkan honeypot, pembatasan laju per IP, verifikasi Turnstile opsional, idempotensi 10 menit, lalu meneruskan payload (termasuk UTM, `page_url`, `referrer`) ke sistem internal (`LEADS_API_URL`) atau webhook cadangan.
- Halaman `/privasi` (kebijakan privasi) berbahasa Indonesia sebagai kerangka yang memuat tujuan, masa simpan, dan kontak penghapusan data; ditandai perlu tinjauan hukum.
- SEO dan berbagi: `lang="id"`, title/description dari naskah, Open Graph dan Twitter card dengan OG image handoff, JSON-LD `Organization`, favicon snippet, `robots.txt` dan `sitemap.xml` dari `SITE_URL`.
- Semua kontak placeholder (domain, email, WhatsApp, Instagram, LinkedIn, janji waktu balas) dipusatkan di satu modul konfigurasi yang dibaca dari variabel lingkungan, dengan `.env.example`.
- Hapus dependensi `framer-motion`; animasi hanya pudar-masuk CSS ≤ 250 ms yang dimatikan pada `prefers-reduced-motion`.
- Tambah uji otomatis (Vitest) untuk validasi dan normalisasi API prospek.

## Capabilities

### New Capabilities
- `brand-design-system`: token warna/font/radius Fawz Tech, font self-host, pemakaian logo, komponen tombol/tautan/form/eyebrow, tema gelap via `data-theme`, aturan aksesibilitas.
- `landing-page`: struktur dan isi tiap seksi landing page (header, hero, masalah, layanan, cara kerja, kontak, footer), perilaku gulir dan animasi, seksi portofolio yang disembunyikan.
- `lead-form`: form "Ceritakan idemu" di sisi klien: field, validasi, pesan galat, honeypot, persetujuan, status kirim/sukses/galat, pengambilan UTM, tombol WhatsApp.
- `lead-api`: endpoint `POST /api/leads` di landing page: validasi server, normalisasi kontak, respons 201/400/422/429, anti-spam, idempotensi, penerusan ke sistem internal atau webhook.
- `site-metadata`: metadata halaman, Open Graph, JSON-LD, favicon/manifest, robots, sitemap, canonical, analitik opsional.
- `privacy-page`: halaman `/privasi` dengan isi minimum yang disyaratkan UU PDP untuk form prospek.

### Modified Capabilities
<!-- Tidak ada spec yang sudah ada di openspec/specs/. -->

## Impact

- **Kode:** hampir seluruh `app/` ditulis ulang (`layout.tsx`, `page.tsx`, `globals.css`, semua `components/`), `tailwind.config.ts`, `app/sitemap.ts`, `app/robots.ts`. File baru: `app/api/leads/route.ts`, `app/privasi/page.tsx`, `lib/leads/*` (validasi, normalisasi, rate limit), `lib/site.ts` (konfigurasi), `.env.example`, `vitest.config.ts`.
- **Aset:** `public/` diisi aset handoff; `public/nexvoid*.png` dan `nexvoid.png` di root dihapus.
- **Dependensi:** hapus `framer-motion`; tambah `vitest` (dev). Tidak ada dependensi runtime baru.
- **Deploy:** route handler membutuhkan runtime Node/Edge (bukan `output: "export"`). Variabel lingkungan baru: `SITE_URL`, `LEADS_API_URL`, `LEADS_WEBHOOK_URL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_WA_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_REPLY_DAYS`, dan sejenisnya.
- **Sistem lain:** sistem internal Fawz Tech (di luar repo ini) harus menyediakan `POST /api/public/leads` sesuai `internal-app.md`; sampai tersedia, webhook cadangan atau mode log dipakai.
- **Hal yang tetap placeholder:** domain, email, nomor WhatsApp, Instagram/LinkedIn, janji waktu balas, alamat lengkap, dan teks hukum kebijakan privasi diisi tim bisnis lewat env/konfigurasi, bukan hardcode.
