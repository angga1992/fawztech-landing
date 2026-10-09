# site-metadata

## Purpose

Metadata dokumen, Open Graph/Twitter, favicon dan manifest, JSON-LD Organization, robots dan sitemap, analitik opsional tanpa cookie, serta target performa Lighthouse untuk landing page.

## Requirements

### Requirement: Metadata dokumen
Setiap halaman SHALL memakai `<html lang>` sesuai locale (`id` atau `en`), title dan meta description dari kamus locale: `id` "Fawz Tech | Software House Aplikasi Custom" / "Fawz Tech membangun aplikasi custom bersama kamu: Web, Mobile, Desktop, dan UI/UX. Sistem yang pas untuk bisnismu. Ceritakan idemu."; `en` "Fawz Tech | Custom Software House" / "Fawz Tech builds custom software with you: Web, Mobile, Desktop, and UI/UX. The right system for your business. Tell us your idea." `metadataBase` MUST berasal dari `SITE_URL`; canonical MUST menunjuk URL locale itu sendiri (`/`, `/en`, `/privasi`, `/en/privacy`); bila `SITE_URL` kosong, fallback `http://localhost:3000` dipakai dan peringatan dicetak saat build.

#### Scenario: Head halaman utama
- **WHEN** `<head>` `/` diperiksa
- **THEN** `lang="id"`, `title`, `meta[name=description]`, dan `link[rel=canonical]` (`<SITE_URL>/`) sesuai nilai di atas

#### Scenario: Head halaman Inggris
- **WHEN** `<head>` `/en` diperiksa
- **THEN** `lang="en"`, title "Fawz Tech | Custom Software House", dan canonical `<SITE_URL>/en`

### Requirement: Open Graph dan Twitter
Halaman SHALL menyertakan `og:type=website`, `og:locale` sesuai locale (`id_ID` atau `en_US`) dan `og:locale:alternate` untuk locale lainnya, `og:title` dan `og:description` sama dengan metadata dokumen locale itu, `og:url` URL locale itu, `og:image` absolut ke `/og-image-1200x630.png` (1200×630, alt "Fawz Tech"), `og:site_name=Fawz Tech`, dan `twitter:card=summary_large_image`.

#### Scenario: Pratinjau berbagi
- **WHEN** tag OG dibaca oleh pemindai tautan
- **THEN** gambar yang ditampilkan adalah `og-image-1200x630.png` dari handoff dengan URL absolut

#### Scenario: OG locale Inggris
- **WHEN** `/en` diperiksa
- **THEN** `og:locale=en_US` dan `og:locale:alternate=id_ID`

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
`robots.txt` SHALL mengizinkan semua agen untuk `/`, melarang `/api/`, dan menunjuk `sitemap.xml` di `SITE_URL`. `sitemap.xml` SHALL memuat `/`, `/privasi`, `/en`, dan `/en/privacy` (tanpa anchor), masing-masing dengan `xhtml:link rel="alternate" hreflang` untuk `id`, `en`, dan `x-default` (menunjuk versi `id`).

#### Scenario: Sitemap
- **WHEN** `/sitemap.xml` diminta
- **THEN** berisi tepat empat URL: `<SITE_URL>/`, `<SITE_URL>/privasi`, `<SITE_URL>/en`, `<SITE_URL>/en/privacy`, dan entri `/` memuat `hreflang="en"` ke `<SITE_URL>/en` serta `hreflang="x-default"` ke `<SITE_URL>/`

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

### Requirement: Alternatif hreflang pada halaman
Setiap halaman SHALL memuat `<link rel="alternate" hreflang="id">`, `hreflang="en"`, dan `hreflang="x-default"` (menunjuk versi `id`) dengan URL absolut ke halaman padanan, sehingga crawler mengindeks kedua bahasa walau redirect geo aktif.

#### Scenario: Hreflang beranda
- **WHEN** `<head>` `/` dan `/en` diperiksa
- **THEN** keduanya memuat `hreflang="id"` → `<SITE_URL>/`, `hreflang="en"` → `<SITE_URL>/en`, `hreflang="x-default"` → `<SITE_URL>/`

#### Scenario: Hreflang privasi
- **WHEN** `<head>` `/en/privacy` diperiksa
- **THEN** memuat `hreflang="id"` → `<SITE_URL>/privasi` dan `hreflang="en"` → `<SITE_URL>/en/privacy`
