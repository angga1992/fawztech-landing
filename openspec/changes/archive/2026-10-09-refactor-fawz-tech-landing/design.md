## Context

Repo saat ini: Next.js 14 (App Router), Tailwind 3, TypeScript, `framer-motion`, font dari Google (`next/font/google`). Satu halaman `app/page.tsx` yang merangkai 10 komponen brand Nexvoid. Form kontak hanya mengubah state lokal tanpa mengirim data. Tidak ada route handler, tidak ada uji otomatis, tidak ada `.env.example`.

Sumber kebenaran untuk perubahan ini:

- `fawz-tech-dev-handoff/01-design-guide/DESIGN-GUIDE.md` dan `02-assets/brand/tokens.css` (token menang bila ada selisih).
- `fawz-tech-dev-handoff/03-landing-page/LANDING-BRIEF.md`, `content/landing-copy.json`, `reference/index.html` (acuan tata letak, bukan kode produksi).
- `internal-app.md` bagian "Integrasi landing page": kontrak `POST /api/public/leads`, validasi, respons, anti-spam, dan keamanan.

Batasan: desktop target utama tetapi semua seksi harus nyaman di HP; WCAG 2.2 AA; Lighthouse mobile ≥ 90; JavaScript seminimal mungkin; bahasa Indonesia; kontak masih placeholder sampai tim bisnis mengisi.

## Goals / Non-Goals

**Goals:**
- Landing page Fawz Tech yang setia pada brief dan panduan desain, siap tayang begitu placeholder kontak diisi lewat env.
- Form prospek yang tervalidasi di klien dan server, tahan spam, dan meneruskan data dengan bentuk persis seperti kontrak `POST /api/public/leads` di `internal-app.md`.
- Satu sumber token desain (`tokens.css`) yang dipakai Tailwind dan CSS, termasuk tema gelap.
- Performa dan aksesibilitas terukur: font self-host, SVG berdimensi, tanpa framework animasi.

**Non-Goals:**
- Membangun sistem internal Fawz Tech (16 fitur di `internal-app.md`). Repo ini hanya *klien* dari API prospek.
- Menyimpan prospek di database lokal, mengirim email dari landing page, atau mengelola status prospek.
- Seksi portofolio/testimoni (`#cerita`), halaman tim, halaman bahasa Inggris (`/en`), blog.
- Toggle tema gelap di UI (token disiapkan; hero dan kontak sudah gelap di kedua tema).
- Pengecekan merek dagang, teks hukum final kebijakan privasi, pemilihan alat analitik.

## Decisions

### D1. Form mengirim ke route handler same-origin `POST /api/leads`, bukan langsung ke sistem internal
Browser mengirim ke `/api/leads` di aplikasi Next ini. Handler memvalidasi dengan aturan yang sama dengan `internal-app.md`, lalu meneruskan ke `LEADS_API_URL` (yaitu `POST /api/public/leads` sistem internal) dengan body yang identik.

Alasan: (1) sistem internal belum ada, jadi landing page harus tetap berfungsi dengan webhook cadangan; (2) menghindari ketergantungan CORS dan membuat rahasia Turnstile tetap di server; (3) pembatasan laju dan honeypot bisa ditangani lebih dekat ke pengguna.
Alternatif ditolak: *fetch langsung dari browser ke sistem internal* (butuh CORS, tidak ada fallback); *Server Action* (lebih sulit diuji sebagai kontrak HTTP dan tidak bisa dipakai ulang oleh klien lain).

### D2. Rantai tujuan prospek: `LEADS_API_URL` → `LEADS_WEBHOOK_URL` → mode log
- Bila `LEADS_API_URL` terisi: teruskan, dan petakan respons sistem internal (201/422/429) ke klien apa adanya.
- Bila hanya `LEADS_WEBHOOK_URL`: POST JSON yang sama ke webhook (n8n, Make, Apps Script, atau layanan email) dan balas 201.
- Bila keduanya kosong: di `development` catat ke konsol dan balas 201; di `production` balas 503 dengan pesan Indonesia dan catat galat.
Alasan: brief landing page hanya mensyaratkan "kirim ke email tim (dan simpan di CRM atau spreadsheet)"; webhook generik memenuhi itu tanpa dependensi SDK email.

### D3. Validasi dan normalisasi hidup di modul murni `lib/leads/` yang diuji
`lib/leads/schema.ts` berisi fungsi murni: `normalizePhone` (`08…`, `+62…`, `62…` → `62…`), `isEmail`, `validateLead(input): { ok, data } | { ok: false, errors: Record<field, string> }`, konstanta `NEEDS = ["web","mobile","desktop","uiux","belum"]`, batas `cerita` 1.000 karakter. Form klien memakai modul yang sama untuk pesan galat yang konsisten dengan server. Tanpa Zod: aturan kecil dan pesan harus persis berbahasa Indonesia.
Alasan: `internal-app.md` mewajibkan uji otomatis untuk validasi API prospek; fungsi murni mudah diuji dengan Vitest tanpa menjalankan Next.

### D4. Anti-spam di handler: honeypot, rate limit in-memory, idempotensi, Turnstile opsional
- Honeypot `website`: bila terisi, balas `201 {"id": "…"}` palsu tanpa meneruskan.
- Rate limit per IP (`x-forwarded-for` pertama) 5/menit dan 20/jam dengan Map in-memory + pembersihan berkala. Idempotensi: hash SHA-256 dari `kontak + cerita` ditolak bila muncul lagi dalam 10 menit (balas 201 dengan id yang sama).
- Turnstile: bila `TURNSTILE_SECRET_KEY` terisi, verifikasi `turnstile_token` ke `siteverify`; bila gagal balas 422 pada field `turnstile`. Bila kosong, langkah dilewati (dev/staging).
- Batas body 16 KB diperiksa dari `content-length` dan panjang teks.
Trade-off: Map in-memory tidak konsisten antar instance serverless; cukup untuk satu instance/VPS dan sistem internal tetap memegang pembatasan laju final. Didokumentasikan sebagai risiko.

### D5. Token desain: `tokens.css` disalin apa adanya ke `public/brand/` dan di-import ke `globals.css`; Tailwind mereferensikan variabelnya
`tailwind.config.ts` mendefinisikan `colors.navy.{900,700,500}`, `amber.{500,200}`, `teal.{600,400}`, `mist.100`, dan token semantik `surface`, `surface-raised`, `surface-sunken`, `ink`, `ink-muted`, `line`, `line-strong`, `action`, `on-action`, `link`, `focus`, `danger` sebagai `var(--fawz-*)`. `borderRadius` → `sm: 6px`, `md: 12px`, `lg: 20px`, `pill: 999px`. `fontFamily.sans` → `var(--fawz-font-sans)`, `mono` → `var(--fawz-font-mono)`. Skala tipografi (`display-xl`, `display-lg`, `display-md`, `headline`, `body`, `body-sm`, `label`, `code`) didefinisikan sebagai `fontSize` Tailwind dengan line-height, weight, dan tracking sesuai tabel panduan; varian mobile lewat responsive prefix.
Alasan: file handoff menyatakan token adalah sumber kebenaran; menyalin nilai hex ke Tailwind akan membuat dua sumber. Tema gelap otomatis ikut lewat `[data-theme="dark"]`.

### D6. Font self-host lewat `fonts.css` handoff dan preload manual (bukan `next/font/local`)
Enam woff2 dari handoff diletakkan di `public/fonts/`, dan `02-assets/fonts/fonts.css` disalin ke `app/styles/fonts.css` (path diubah ke `/fonts/…`) lalu di-import dari `globals.css`. `layout.tsx` menambahkan dua `<link rel="preload" as="font">` untuk Plus Jakarta Sans 400 dan 800 saja. `tokens.css` tetap menjadi sumber `--fawz-font-sans`/`--fawz-font-mono` tanpa override.
Alasan: `next/font/local` mem-preload **semua** berkas dalam satu deklarasi `localFont` (tidak ada opsi preload per berat), sehingga lima woff2 ikut di-preload dan melanggar brief §7 ("preload Plus Jakarta Sans 400 dan 800 saja"). Memecah menjadi dua `localFont` menghasilkan dua nama family berbeda sehingga berat 500–700 tidak dipilih browser. Diverifikasi: dengan `next/font/local` head memuat 5 preload; dengan pendekatan ini tepat 2.
Alternatif ditolak: `next/font/local` (alasan di atas); Google Fonts (dilarang panduan desain).

### D7. Hapus `framer-motion`; animasi CSS saja
Pudar-masuk ringan memakai `IntersectionObserver` kecil (satu hook `useReveal`, ≤ 30 baris) yang menambah kelas `is-visible`; transisi CSS 200 ms; `@media (prefers-reduced-motion: reduce)` mematikan transisi. Hanya `Header` (menu mobile), `LeadForm`, dan komponen reveal yang menjadi client component; sisanya server component.
Alasan: brief mensyaratkan JavaScript minimal dan Lighthouse ≥ 90; `framer-motion` menambah ±30 KB gzip tanpa manfaat di sini.

### D8. Konfigurasi situs dan placeholder terpusat di `lib/site.ts`
Satu objek `site` yang membaca `process.env` dengan fallback placeholder dalam kurung siku persis seperti naskah (`[nama@domainanda.id]`, `[+62 8xx xxxx xxxx]`, `[X]`). Komponen tidak pernah menulis kontak secara literal. `.env.example` mendaftar semua variabel dengan komentar. Nomor WhatsApp dinormalkan ke `62…` lewat fungsi yang sama dengan validasi prospek.
Alasan: brief bagian 9 mendaftar item yang harus diisi tim bisnis; memusatkannya membuat pengisian satu langkah dan placeholder tidak tercecer.

### D9. Struktur komponen baru
```
app/
  layout.tsx            font, metadata, JSON-LD, skip link, tema
  page.tsx              Header, Hero, Problem, Services, Process, Contact, Footer
  privasi/page.tsx      kebijakan privasi
  api/leads/route.ts    handler POST
  styles/fonts.css      @font-face (salinan fonts.css handoff)
  styles/tokens.css     token (salinan tokens.css handoff + selector .theme-dark)
  components/
    Header.tsx          sticky, menu mobile (client)
    Hero.tsx
    Problem.tsx
    Services.tsx        bento 7/5 + 5/7
    Process.tsx         tangga
    Contact.tsx         judul + WhatsApp + <LeadForm/>
    LeadForm.tsx        (client)
    Footer.tsx
    ui/Button.tsx       variant: primary | amber | ghost | secondary
    ui/Eyebrow.tsx
    ui/Reveal.tsx       (client)
lib/
  site.ts
  leads/schema.ts       validasi + normalisasi (murni)
  leads/rate-limit.ts
  leads/forward.ts      LEADS_API_URL / webhook / log
  wa.ts                 bangun URL wa.me
public/
  svg/ illustrations/ fonts/ brand/ favicon files di root, og-image-1200x630.png
```
Komponen `Marquee`, `Stats`, `Solutions`, `Clients`, `Nav`, `Services` lama dihapus (bukan diubah) agar tidak ada sisa gaya Nexvoid.

### D10. Tata letak Layanan dan Cara kerja mengikuti prototipe, bukan kartu seragam
Layanan: grid 12 kolom di ≥ 768 px, blok Web (navy, span 7), Mobile (amber, span 5), Desktop (teal, span 5), UI/UX (putih + garis, span 7); satu kolom di mobile. Cara kerja: 4 kolom di ≥ 1024 px dengan `margin-bottom` bertingkat 0/40/80/120 px (`align-items: end`), blok terakhir mendapat aksen amber; 2 kolom di 768 px; 1 kolom di mobile tanpa tangga. Ini memenuhi larangan "kartu putih seragam" di panduan desain.

### D11. Tema gelap: dukung `data-theme="dark"` tanpa toggle; logo mengikuti `data-theme`, bukan `prefers-color-scheme`
`tokens.css` sudah memuat override `[data-theme="dark"]`; salinan di `app/styles/tokens.css` menambah selector `.theme-dark` (nilai tidak diubah) sehingga seksi navy (hero, kontak, footer, blok Web) memakai token semantik gelap tanpa hex literal di komponen. `html` memakai `color-scheme: light`; `[data-theme="dark"]` dan `.theme-dark` memakai `color-scheme: dark`. Logo dirender dua `<img>` (`.logo-light`/`.logo-dark`) yang ditukar CSS berdasarkan `data-theme`.
Alasan: brief §5 menetapkan tema terang sebagai default; bila logo mengikuti `prefers-color-scheme` (contoh di panduan desain), pengguna dengan OS gelap akan melihat logo versi on-dark di halaman yang masih terang. Hero, kontak, dan footer selalu `navy-900` eksplisit sehingga identik di kedua tema. Tidak ada toggle UI (non-goal).

## Risks / Trade-offs

- [Rate limit in-memory tidak berbagi state antar instance serverless] → Dokumentasikan; sistem internal tetap menjadi pembatas akhir; bila deploy ke platform multi-instance, ganti dengan KV/Upstash lewat antarmuka `RateLimiter` yang sudah dipisah.
- [Sistem internal belum ada saat landing tayang] → Rantai fallback D2; webhook ke email/spreadsheet memenuhi brief sampai `LEADS_API_URL` diisi; tidak ada perubahan kode saat beralih.
- [Kontrak `internal-app.md` berubah saat sistem internal dibangun] → Payload dibangun dari satu tipe `LeadPayload` di `lib/leads/schema.ts`; perubahan terpusat dan uji otomatis menangkap regresi bentuk data.
- [Placeholder kontak lolos ke produksi] → `lib/site.ts` mengekspor `hasPlaceholders()`; `next build` mencetak peringatan, dan tombol WhatsApp disembunyikan bila nomor masih placeholder, bukan menautkan ke `62XXXXXXXXXX`.
- [Amber dipakai sebagai teks di latar terang secara tidak sengaja] → Tidak ada utilitas `text-amber-*` di Tailwind safelist; eyebrow di latar terang memakai `teal-600`, di latar gelap `amber-500` lewat kelas konteks `.dark`.
- [Turnstile dilewati di produksi karena env kosong] → `hasPlaceholders()` juga memeriksa `TURNSTILE_SECRET_KEY` di `production` dan mencetak peringatan; honeypot dan rate limit tetap aktif.
- [Teks kebijakan privasi belum ditinjau hukum] → Halaman menampilkan isi minimum (tujuan, data yang dikumpulkan, masa simpan 24 bulan, kontak penghapusan) dan komentar kode "tinjau penasihat hukum"; tidak diblokir karena form wajib menautkannya.
- [Menghapus `framer-motion` mengubah rasa animasi] → Disengaja; brief melarang parallax/carousel dan membatasi animasi 250 ms.

## Migration Plan

1. Salin aset handoff ke `public/` dan `app/fonts/`; tambah `tokens.css`.
2. Ganti `layout.tsx`, `globals.css`, `tailwind.config.ts`; build harus hijau walau komponen lama masih ada.
3. Tulis komponen baru dan `page.tsx`; hapus komponen dan aset Nexvoid; hapus `framer-motion`.
4. Tambah `lib/leads/*`, route handler, Vitest, dan uji.
5. Tambah `/privasi`, metadata, sitemap, robots, `.env.example`.
6. Verifikasi: `npm run build`, `npm test`, Lighthouse mobile lokal, uji keyboard dan reduced-motion.
Rollback: satu commit `init: Nexvoid landing page` tetap di riwayat; `git revert` perubahan ini mengembalikan situs lama.

## Open Questions

- Nilai final: domain, email, nomor WhatsApp, Instagram, LinkedIn, alamat lengkap, janji waktu balas `[X]`. Diisi lewat env; tidak memblokir implementasi.
- Apakah sistem internal akan menerima prospek dari IP server landing page (bukan IP pengguna)? Handler meneruskan `X-Forwarded-For` asli agar rate limit sistem internal tetap per pengguna.
- Pilihan analitik (Plausible tanpa cookie vs GA4 dengan banner). Implementasi menyediakan slot `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` saja.
- Platform hosting (VPS vs Vercel) menentukan apakah rate limit in-memory cukup.
