## ADDED Requirements

### Requirement: Metadata dokumen
Halaman SHALL memakai `<html lang="id">`, title "Fawz Tech | Software House Aplikasi Custom", dan meta description "Fawz Tech membangun aplikasi custom bersama kamu: Web, Mobile, Desktop, dan UI/UX. Sistem yang pas untuk bisnismu. Ceritakan idemu." `metadataBase` dan canonical MUST berasal dari `SITE_URL`; bila kosong, fallback `http://localhost:3000` dipakai dan peringatan dicetak saat build.

#### Scenario: Head halaman utama
- **WHEN** `<head>` `/` diperiksa
- **THEN** `title`, `meta[name=description]`, dan `link[rel=canonical]` sesuai nilai di atas

### Requirement: Open Graph dan Twitter
Halaman SHALL menyertakan `og:type=website`, `og:locale=id_ID`, `og:title` dan `og:description` sama dengan metadata dokumen, `og:image` absolut ke `/og-image-1200x630.png` (1200×630, alt "Fawz Tech"), `og:site_name=Fawz Tech`, dan `twitter:card=summary_large_image`.

#### Scenario: Pratinjau berbagi
- **WHEN** tag OG dibaca oleh pemindai tautan
- **THEN** gambar yang ditampilkan adalah `og-image-1200x630.png` dari handoff dengan URL absolut

### Requirement: Favicon dan manifest
Sistem SHALL menyajikan `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, dan `site.webmanifest` dari root situs, dengan tag `<head>` sesuai `head-snippet.html` dan `theme-color` `#0B2A4A`. Ikon Nexvoid lama MUST dihapus.

#### Scenario: Berkas favicon tersedia
- **WHEN** `/favicon.svg`, `/apple-touch-icon.png`, dan `/site.webmanifest` diminta
- **THEN** masing-masing dibalas `200` dengan tipe konten yang benar

### Requirement: Data terstruktur
Halaman SHALL menyertakan JSON-LD `Organization` dengan `name` "Fawz Tech", `url` dari `SITE_URL`, `logo` absolut ke `fawz-tech-logo-primary.svg`, `address.streetAddress` "Bintaro Sektor 2", `addressCountry` "ID", dan `email`/`telephone`/`sameAs` hanya bila nilai konfigurasi bukan placeholder. JSON-LD lama Nexvoid (`WebSite`, alamat Bandung) MUST dihapus.

#### Scenario: Kontak masih placeholder
- **WHEN** email dan telepon belum dikonfigurasi
- **THEN** JSON-LD tidak memuat properti `email`, `telephone`, atau `sameAs`, dan tetap valid

### Requirement: Robots dan sitemap
`robots.txt` SHALL mengizinkan semua agen untuk `/`, melarang `/api/`, dan menunjuk `sitemap.xml` di `SITE_URL`. `sitemap.xml` SHALL memuat `/` dan `/privasi` saja (tanpa anchor).

#### Scenario: Sitemap
- **WHEN** `/sitemap.xml` diminta
- **THEN** berisi tepat dua URL: `<SITE_URL>/` dan `<SITE_URL>/privasi`

### Requirement: Analitik opsional tanpa cookie
Bila `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` dikonfigurasi, sistem SHALL memuat skrip Plausible dengan `defer`; bila tidak, tidak ada skrip analitik. Pengiriman form sukses dan klik WhatsApp SHALL memicu event `lead_submitted` dan `whatsapp_click` bila `window.plausible` tersedia.

#### Scenario: Tanpa analitik
- **WHEN** variabel domain Plausible kosong
- **THEN** tidak ada permintaan ke `plausible.io` dan tidak ada galat konsol

### Requirement: Performa
Halaman utama SHALL mencapai Lighthouse mobile ≥ 90 untuk Performance, Accessibility, Best Practices, dan SEO, dengan LCP < 2,5 detik dan CLS < 0,1 pada koneksi 4G simulasi. Semua `img` MUST memiliki `width` dan `height`; total JavaScript klien halaman utama MUST < 120 KB gzip (baseline Next 14 App Router sekitar 95 KB; kode halaman sendiri < 15 KB).

#### Scenario: Audit Lighthouse
- **WHEN** `npm run build && npm start` lalu Lighthouse mobile dijalankan terhadap `/`
- **THEN** keempat skor ≥ 90
