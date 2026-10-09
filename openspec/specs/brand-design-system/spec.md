# brand-design-system

## Purpose

Token desain Fawz Tech (warna, font, radius) sebagai sumber tunggal, font self-host, pemakaian logo, komponen tombol/eyebrow/form, tema gelap lewat `data-theme`, dan aturan aksesibilitas WCAG 2.2 AA untuk seluruh landing page.

## Requirements

### Requirement: Token desain tunggal
Sistem SHALL memakai `tokens.css` dari handoff Fawz Tech (disalin tanpa perubahan nilai) sebagai satu-satunya sumber variabel warna, font, dan radius. Tailwind dan CSS kustom MUST mereferensikan variabel `--fawz-*`, bukan menyalin nilai hex.

#### Scenario: Tailwind memakai variabel token
- **WHEN** developer memakai kelas `bg-action`, `text-ink`, `border-line`, atau `rounded-md`
- **THEN** nilai yang dirender berasal dari `var(--fawz-action)`, `var(--fawz-ink)`, `var(--fawz-line)`, dan `var(--fawz-radius-md)` (12px)

#### Scenario: Tidak ada warna brand yang ditulis literal di komponen
- **WHEN** repositori dicari untuk string hex palet (`#0B2A4A`, `#F5A623`, `#0B7A7C`, dan lainnya) di luar `tokens.css` dan file SVG
- **THEN** tidak ada kecocokan di `app/**/*.tsx` dan `app/globals.css`

### Requirement: Tema gelap lewat atribut data
Sistem SHALL mendukung tema gelap melalui `<html data-theme="dark">` menggunakan override yang sudah ada di `tokens.css`. Tema terang MUST menjadi default. Hero, seksi kontak, dan footer MUST memakai `navy-900` secara eksplisit sehingga tampil sama di kedua tema.

#### Scenario: Atribut data-theme diaktifkan
- **WHEN** `data-theme="dark"` ditambahkan ke elemen `html`
- **THEN** latar halaman menjadi `#071A2F`, teks `#F1F5F9`, dan tombol utama di latar terang menjadi amber dengan teks `#071A2F`

#### Scenario: Logo mengikuti tema
- **WHEN** `data-theme="dark"` aktif pada elemen `html`
- **THEN** header menampilkan `fawz-tech-logo-primary-on-dark.svg`, dan tanpa atribut itu menampilkan `fawz-tech-logo-primary.svg`; `prefers-color-scheme` sendiri tidak mengubah logo karena tema terang adalah default

### Requirement: Font self-host
Sistem SHALL memuat Plus Jakarta Sans (400, 500, 600, 700, 800) dan JetBrains Mono (500) dari berkas woff2 di repositori, dengan `font-display: swap`. Hanya Plus Jakarta Sans 400 dan 800 yang MUST di-preload. Tidak ada permintaan ke CDN font.

#### Scenario: Tidak ada permintaan font eksternal
- **WHEN** halaman dimuat dan permintaan jaringan diperiksa
- **THEN** tidak ada permintaan ke `fonts.googleapis.com` atau `fonts.gstatic.com`, dan semua font berasal dari origin situs

#### Scenario: Preload terbatas
- **WHEN** `<head>` halaman diperiksa
- **THEN** tepat dua `<link rel="preload" as="font">` ada, untuk Plus Jakarta Sans 400 dan 800

### Requirement: Skala tipografi
Sistem SHALL menyediakan gaya `display-xl` (56/60, 800, -0.025em), `display-lg` (40/46, 800, -0.02em), `display-md` (28/34, 700, -0.01em), `headline` (20/28, 700), `body` (16/26, 400), `body-sm` (14/22, 400), `label` (13/18, 600, 0.01em), dan `code` (13/20, 500, mono). Di viewport < 640px `display-xl` MUST menjadi 40/44 dan `display-lg` 32/38. Judul MUST memakai sentence case dan rata kiri.

#### Scenario: Judul hero di desktop dan mobile
- **WHEN** hero dirender pada lebar 1280px
- **THEN** H1 berukuran 56px dengan tinggi baris 60px dan berat 800
- **WHEN** hero dirender pada lebar 360px
- **THEN** H1 berukuran 40px dengan tinggi baris 44px

#### Scenario: Eyebrow
- **WHEN** eyebrow seksi dirender
- **THEN** memakai JetBrains Mono 13px, huruf kapital, `letter-spacing: 0.08em`, berwarna `teal-600` di latar terang dan `amber-500` di latar navy

### Requirement: Komponen tombol
Sistem SHALL menyediakan tombol dengan varian `primary` (latar `action`, teks `on-action`), `amber` (latar `amber-500`, teks `#071A2F`, dipakai di atas navy), `secondary` (transparan, outline 1px `line-strong`, teks `ink`), dan `ghost` (transparan, outline, teks putih di atas navy). Semua tombol MUST memakai `radius-md`, gaya `label`, padding `13px 20px`, tinggi minimal 44px, cincin fokus 2px `focus-ring` dengan offset 2px, dan keadaan nonaktif opasitas 0.5 dengan `cursor: not-allowed`. Setiap layar (seksi) MUST memiliki paling banyak satu tombol utama.

#### Scenario: Fokus keyboard terlihat
- **WHEN** pengguna menekan Tab hingga tombol apa pun mendapat fokus
- **THEN** cincin fokus 2px berwarna `focus-ring` tampak dengan offset 2px dan tidak dihapus oleh gaya lain

#### Scenario: Hover tombol utama
- **WHEN** kursor berada di atas tombol `primary` di tema terang
- **THEN** latar berubah menjadi `navy-500`; untuk tombol `amber`, latar menjadi `#FFB94A`

### Requirement: Larangan visual panduan desain
Sistem MUST NOT memakai amber sebagai warna teks atau ikon di latar terang, gradien, glow, glassmorphism, bayangan tebal, parallax, carousel otomatis, atau pop-up. Pemisah MUST berupa garis `line` 1px. Logo MUST selalu dari berkas SVG handoff tanpa pewarnaan ulang, bayangan, atau distorsi.

#### Scenario: Audit CSS lama
- **WHEN** `globals.css` dan komponen diperiksa setelah refactor
- **THEN** tidak ada `linear-gradient`, `radial-gradient`, `backdrop-blur`, `filter: blur`, atau utilitas `glow-orb`, `noise`, `shimmer`, `grid-bg`

#### Scenario: Amber hanya di latar navy
- **WHEN** elemen dengan warna teks `amber-500` dicari
- **THEN** setiap elemen tersebut berada di dalam konteks berlatar `navy-900` atau `navy-700`

### Requirement: Aksesibilitas dasar
Sistem SHALL memenuhi WCAG 2.2 AA: kontras teks minimal 4.5:1 (teks besar 3:1), semua elemen interaktif dapat dijangkau keyboard dengan fokus terlihat, area sentuh minimal 44×44px, gambar dekoratif `alt=""`, logo `alt="Fawz Tech"`, status tidak disampaikan lewat warna saja, dan `prefers-reduced-motion` menonaktifkan animasi non-esensial.

#### Scenario: Reduced motion
- **WHEN** sistem operasi pengguna mengaktifkan `prefers-reduced-motion: reduce`
- **THEN** tidak ada transisi atau animasi pudar-masuk yang berjalan dan gulir anchor tidak halus

#### Scenario: Area sentuh
- **WHEN** tombol, tautan navigasi, dan opsi kotak centang diukur di viewport 360px
- **THEN** setiap target berukuran minimal 44×44px
