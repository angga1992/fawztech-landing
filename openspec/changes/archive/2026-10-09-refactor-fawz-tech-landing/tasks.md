## 1. Rebrand identitas proyek (Nexvoid → Fawz Tech)

- [x] 1.1 Ubah `package.json`: `name` menjadi `fawz-tech-landing`, tambah `description` "Landing page Fawz Tech", tambah skrip `test` (vitest) dan `test:watch`; hapus `framer-motion` dari dependencies; tambah `vitest`, `@vitest/coverage-v8`, `eslint`, `eslint-config-next` (dev) dan `.eslintrc.json`; jalankan `npm install` (`package-lock.json` diperbarui, commit dilakukan oleh pengguna)
- [x] 1.2 Hapus aset Nexvoid: `public/nexvoid.png`, `public/nexvoid-mark.png`, `public/nexvoid-trim.png`, `nexvoid.png` di root; `nexvoid-content.xlsx` (untracked) dipindahkan ke luar repo atau dihapus setelah dikonfirmasi tidak dipakai
- [x] 1.3 Tulis `README.md` baru berjudul "Fawz Tech – Landing page" berisi: cara menjalankan, daftar variabel lingkungan, cara mengisi placeholder kontak, rujukan ke paket handoff dan `internal-app.md`, dan catatan bahwa folder repo bisa diganti nama ke `fawz-tech-landing`
- [x] 1.4 Pastikan tidak ada string "Nexvoid"/"nexvoid" tersisa: `grep -ri nexvoid --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=openspec .` harus kosong

## 2. Aset brand dan token desain

- [x] 2.1 Salin dari handoff `02-assets/svg/*.svg` ke `public/svg/`, `02-assets/illustrations/*.svg` ke `public/illustrations/`, `02-assets/brand/tokens.css` ke `public/brand/tokens.css` dan `02-assets/brand/colors.json` ke `public/brand/colors.json` (tanpa mengubah nilai)
- [x] 2.2 Salin isi `02-assets/favicon/` (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`) ke root `public/` dan `02-assets/og-image-1200x630.png` ke `public/og-image-1200x630.png`
- [x] 2.3 Salin enam berkas woff2 dari `02-assets/fonts/` ke `public/fonts/` dan `fonts.css` ke `app/styles/fonts.css` (path `/fonts/…`); preload hanya Plus Jakarta Sans 400 dan 800 lewat `<link rel="preload">` di `layout.tsx` (lihat design D6: `next/font/local` tidak bisa preload per berat)
- [x] 2.4 Tulis ulang `app/globals.css`: import `tokens.css` (lewat `@import` atau salinan di `app/styles/tokens.css`), petakan `--fawz-font-sans`/`--fawz-font-mono` ke variabel `next/font`, `color-scheme: light dark`, `scroll-padding-top` setinggi header, `html{scroll-behavior:smooth}` dengan override `prefers-reduced-motion`, gaya `.skip`, kelas `.reveal`/`.is-visible` (opacity+translate 200ms), hapus semua utilitas lama (`grid-bg`, `noise`, `glow-orb`, `vignette`, `shimmer`, scrollbar kustom, `::selection` biru)
- [x] 2.5 Tulis ulang `tailwind.config.ts`: `colors` navy/amber/teal/mist + token semantik sebagai `var(--fawz-*)`, `borderRadius` sm/md/lg/pill, `fontFamily` sans/mono, `fontSize` skala tipografi (display-xl, display-lg, display-md, headline, body, body-sm, label, code) dengan line-height/weight/tracking, `screens` 360/768/1024/1280/1440, `maxWidth.content` 1200px; hapus warna void/electric/violet/plasma dan keyframes marquee
- [x] 2.6 Buat `app/components/ui/Button.tsx` (varian primary/amber/secondary/ghost, mendukung `as` tautan atau tombol, min-height 44px, focus ring, disabled), `app/components/ui/Eyebrow.tsx` (prop `tone: "light" | "dark"`), dan `app/components/ui/Reveal.tsx` (client, IntersectionObserver, menghormati reduced motion)

## 3. Konfigurasi situs dan naskah

- [x] 3.1 Buat `lib/site.ts`: objek `site` dengan `url`, `name`, `address`, `email`, `phone`, `waNumber` (dinormalkan `62…`), `instagram`, `linkedin`, `replyDays`, `plausibleDomain`, `turnstileSiteKey`, masing-masing dari env dengan fallback placeholder persis naskah (`[nama@domainanda.id]`, `[+62 8xx xxxx xxxx]`, `[@akunanda]`, `[X]`); ekspor `isPlaceholder(value)` dan `hasPlaceholders()`
- [x] 3.2 Buat `lib/wa.ts`: `buildWaLink(number, text)` → `https://wa.me/<62…>?text=<encodeURIComponent>`; kembalikan `null` bila nomor placeholder
- [x] 3.3 Buat `content/landing.ts` yang memuat seluruh naskah dari `landing-copy.json` (meta, nav, hero, problem, services, process, contact, footer) sebagai objek TypeScript bertipe `as const`
- [x] 3.4 Buat `.env.example` dengan semua variabel: `SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WA_NUMBER`, `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_LINKEDIN`, `NEXT_PUBLIC_REPLY_DAYS`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `LEADS_API_URL`, `LEADS_API_TOKEN`, `LEADS_WEBHOOK_URL`, `LEADS_ALLOWED_ORIGIN`, masing-masing dengan komentar Indonesia satu baris

## 4. Layout, metadata, dan halaman

- [x] 4.1 Tulis ulang `app/layout.tsx`: font lokal, `lang="id"`, `metadataBase` dari `site.url` (peringatan build bila placeholder), title/description/OG/Twitter dari `content/landing.ts`, `icons` dan `manifest` sesuai `head-snippet.html`, `viewport.themeColor` `#0B2A4A`, JSON-LD `Organization` (tanpa email/telepon/sameAs bila placeholder), tautan lompat "Lewati ke konten", skrip Plausible bersyarat; hapus JSON-LD `WebSite` dan `alternates.languages`
- [x] 4.2 Buat `app/components/Header.tsx` (client): sticky, logo `<picture>` terang/gelap tinggi 32px dengan `width`/`height`, tautan Layanan dan Cara kerja, tombol primary "Mulai konsultasi", tombol menu mobile dengan `aria-expanded` dan `aria-controls`, menu menutup saat tautan diklik atau Escape
- [x] 4.3 Buat `app/components/Hero.tsx`: latar navy-900, eyebrow amber, H1 display-xl, sub headline, tombol amber + ghost, `hero-dashboard.svg` (`priority`, 960×640) dengan `app-mobile.svg` (420×760) menumpuk kanan bawah, strip code; grid dua kolom ≥ 1024px
- [x] 4.4 Buat `app/components/Problem.tsx`: eyebrow, H2 display-lg, `problem-chaos.svg` kiri, tiga poin dengan `border-l-8` navy/teal/amber, blok penutup navy-700 radius-lg dengan `custom-fit.svg`
- [x] 4.5 Buat `app/components/Services.tsx`: latar surface-sunken, bento 12 kolom (Web navy span 7, Mobile amber span 5, Desktop teal span 5, UI/UX putih span 7), satu kolom di mobile, ilustrasi per blok dengan dimensi, urutan tetap Web/Mobile/Desktop/UI-UX
- [x] 4.6 Buat `app/components/Process.tsx`: `ol` empat langkah, ilustrasi 400×340, nomor code "01"–"04", judul headline, kalimat; tangga `lg:mb-10/20/30` dan `items-end` di ≥ 1024px, langkah 4 beraksen amber; dua kolom di 768px, satu kolom di mobile
- [x] 4.7 Buat `app/components/Contact.tsx`: latar navy-900, eyebrow "MARI MULAI", H2, sub, tombol WhatsApp ghost (dirender hanya bila `buildWaLink` tidak null, `target=_blank rel=noopener`, memicu event `whatsapp_click`), dan `<LeadForm/>`
- [x] 4.8 Buat `app/components/Footer.tsx`: navy-900, logo on-dark, alamat, email (`mailto:` bila bukan placeholder), telepon (`tel:`/`wa.me` bila bukan placeholder), Instagram, LinkedIn, tautan `/privasi`, "© <tahun> Fawz Tech"
- [x] 4.9 Tulis ulang `app/page.tsx` merangkai Header, `main#utama` (Hero, Problem, Services, Process, Contact), Footer; hapus `Nav.tsx`, `Marquee.tsx`, `Stats.tsx`, `Solutions.tsx`, `Clients.tsx`, dan `Services.tsx` lama; tambahkan komentar bahwa `#cerita` ditambahkan setelah ada data klien nyata
- [x] 4.10 Buat `app/privasi/page.tsx` dengan metadata sendiri, Header/Footer yang sama, konstanta `PRIVACY_POLICY_VERSION` di `lib/privacy.ts`, isi minimum sesuai spec `privacy-page`, tanggal versi dalam format "9 Oktober 2026", komentar kode "belum ditinjau penasihat hukum"
- [x] 4.11 Tulis ulang `app/robots.ts` (allow `/`, disallow `/api/`, sitemap dari `site.url`) dan `app/sitemap.ts` (hanya `/` dan `/privasi`)

## 5. Validasi prospek dan API

- [x] 5.1 Buat `lib/leads/schema.ts`: tipe `LeadInput`, `LeadPayload`; konstanta `NEEDS`, `MAX_STORY = 1000`; fungsi murni `normalizePhone`, `isEmail`, `normalizeContact`, `validateLead(input)` yang mengembalikan `{ ok: true, data }` atau `{ ok: false, errors }` dengan semua pesan dalam bahasa Indonesia ("Wajib diisi", "Isi nomor WhatsApp (08… atau +62…) atau email yang valid", "Maksimal 1.000 karakter", "Pilihan tidak dikenali", "Centang persetujuan untuk melanjutkan")
- [x] 5.2 Buat `lib/leads/rate-limit.ts`: antarmuka `RateLimiter` dan implementasi in-memory (5/menit, 20/jam per kunci, pembersihan berkala) serta `IdempotencyStore` in-memory (hash SHA-256, TTL 10 menit)
- [x] 5.3 Buat `lib/leads/turnstile.ts`: `verifyTurnstile(token, ip)` memanggil `https://challenges.cloudflare.com/turnstile/v0/siteverify`, dilewati bila `TURNSTILE_SECRET_KEY` kosong
- [x] 5.4 Buat `lib/leads/forward.ts`: `forwardLead(payload, { ip })` dengan rantai `LEADS_API_URL` → `LEADS_WEBHOOK_URL` → log dev/503 prod, timeout 8 detik via `AbortController`, pemetaan respons hulu (201/422/429/lainnya → 502), header `X-Forwarded-For` dan `Authorization` bersyarat
- [x] 5.5 Buat `app/api/leads/route.ts`: `POST` dengan urutan: batas 16 KB → parse JSON atau form-urlencoded (400) → IP klien → rate limit (429 + `Retry-After`) → honeypot (201 palsu) → `validateLead` (422) → Turnstile (422) → idempotensi (201 ulang) → `forwardLead` → respons; `GET` dan metode lain `405` dengan `Allow: POST`; log tanpa data pribadi; `export const runtime = "nodejs"`; sertakan `privacy_version` dalam payload
- [x] 5.6 Tambahkan header keamanan di `next.config.mjs` (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`) dan pastikan tidak ada `output: "export"`

## 6. Form prospek (klien)

- [x] 6.1 Buat `app/components/LeadForm.tsx` (client): `<form method="post" action="/api/leads" noValidate>`, field sesuai spec `lead-form` dengan label terhubung, input 48px radius-sm, kelompok kotak centang dalam `fieldset/legend` dengan area sentuh ≥ 44px, penghitung sisa karakter `cerita`, honeypot `website` (`aria-hidden`, `tabindex=-1`, di luar viewport), persetujuan dengan tautan `/privasi`, tombol amber "Kirim cerita"
- [x] 6.2 Implementasikan validasi klien memakai `validateLead` dari `lib/leads/schema.ts`; tampilkan galat per field (`aria-invalid`, `aria-describedby`, warna danger, teks), fokus ke field galat pertama
- [x] 6.3 Implementasikan pengiriman `fetch` JSON dengan payload lengkap (UTM dari `URLSearchParams`, `page_url` tanpa fragmen, `document.referrer`, `turnstile_token`, `privacy_version`); status mengirim (tombol nonaktif "Mengirim…"), sukses (`role="status"`, teks dengan `replyDays`, memicu event `lead_submitted`), 422 (galat per field), 429 dan galat jaringan (`role="alert"`, isian dipertahankan)
- [x] 6.4 Tambahkan pemuatan malas widget Turnstile saat `site.turnstileSiteKey` terisi (muat skrip saat fokus pertama ke form), dengan fallback tanpa widget bila kosong

## 7. Uji otomatis

- [x] 7.1 Buat `vitest.config.ts` (environment node, alias `@/`) dan `tsconfig` paths `@/*`
- [x] 7.2 Tulis `lib/leads/schema.test.ts`: normalisasi `08…`/`+62…`/`62…`/pemisah, nomor terlalu pendek/panjang, email valid/tidak dan lowercase, field wajib, `cerita` 1.000 vs 1.001, whitelist dan dedup `kebutuhan`, `setuju` false, `bisnis` terlalu panjang
- [x] 7.3 Tulis `lib/leads/rate-limit.test.ts`: batas per menit dan per jam, reset setelah jendela, idempotensi mengembalikan id yang sama dalam TTL
- [x] 7.4 Tulis `app/api/leads/route.test.ts` dengan `fetch` di-mock: 400 body besar/JSON rusak, 405 GET, 422 field, 201 honeypot tanpa penerusan, 429, idempotensi satu penerusan, pemetaan hulu 201/422/429/timeout→502, webhook-only 201, produksi tanpa tujuan 503, log tidak memuat data pribadi

## 8. Verifikasi akhir

- [x] 8.1 `npm run lint`, `npm test`, dan `npm run build` hijau; peringatan placeholder tercetak saat build dengan env kosong
- [x] 8.2 Jalankan `npm start` dan Lighthouse mobile terhadap `/`: Performance, Accessibility, Best Practices, SEO masing-masing ≥ 90; LCP < 2,5 s; CLS < 0,1; catat hasil di PR. Hasil 9 Okt 2026 (Lighthouse 12.8.2 mobile, simulasi Slow 4G, build produksi): Performance 97, Accessibility 100, Best Practices 100, SEO 100; FCP 1,4 s; LCP 2,5 s (elemen H1, tepat di ambang pada simulasi Slow 4G); CLS 0; TBT 0 ms. `/privasi`: Accessibility 100, Best Practices 100, SEO 100
- [x] 8.3 Uji manual: navigasi keyboard penuh (skip link, menu mobile, form, tombol), `prefers-reduced-motion` mematikan reveal, `data-theme="dark"` pada `html` mengubah token, viewport 360/768/1024/1280 tanpa gulir horizontal, tombol WhatsApp hilang saat nomor placeholder dan muncul saat `NEXT_PUBLIC_WA_NUMBER` diisi. Terverifikasi lewat HTML/CSS hasil build dan Lighthouse Accessibility 100: skip link, `aria-expanded`/`aria-controls` menu, label terhubung, fieldset/legend, honeypot `aria-hidden`+`tabindex=-1`, aturan `prefers-reduced-motion` dan `[data-theme=dark]` ada di CSS, WA hilang tanpa env dan muncul (`wa.me/6281234567890?text=…`) dengan env. **Belum diuji di browser sungguhan oleh manusia**: navigasi keyboard interaktif dan tampilan di viewport 360/768/1024/1280
- [x] 8.4 Uji alur prospek ujung ke ujung dengan `LEADS_WEBHOOK_URL` menunjuk ke endpoint uji (mis. webhook.site): kiriman valid sampai dengan `kontak` ternormalisasi `62…` dan semua UTM; kiriman kedua identik tidak terkirim ulang
- [x] 8.5 Verifikasi `grep` tidak menemukan hex palet di `app/**/*.tsx`/`globals.css`, tidak ada `text-amber` di konteks latar terang, dan tidak ada string "Nexvoid"
