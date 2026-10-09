# locale-routing

## Purpose

Struktur URL per locale (Indonesia tanpa awalan, Inggris di `/en`), deteksi negara di middleware dengan prioritas cookie > geo > Accept-Language > Indonesia, pengecualian bot dan aset, pengalih bahasa berupa toggle bendera, dan cookie pilihan manual.

## Requirements

### Requirement: Struktur URL per locale
Sistem SHALL menyajikan dua locale: `id` tanpa awalan (`/`, `/privasi`) dan `en` dengan awalan (`/en`, `/en/privacy`). Permintaan ke `/id` atau `/id/...` MUST dialihkan permanen (301) ke path tanpa awalan. Locale selain `id` dan `en` pada posisi awalan MUST menghasilkan status 404 dengan halaman not-found berbahasa sesuai locale terdeteksi yang menautkan ke `/` dan `/en`; karena batasan Next 14 pada root layout dinamis, isi halaman not-found tampil setelah hidrasi JavaScript (HTML mentah hanya kerangka minimal).

#### Scenario: Halaman Inggris
- **WHEN** `/en` diminta
- **THEN** respons 200 berisi halaman utama berbahasa Inggris dengan `<html lang="en">`

#### Scenario: Awalan id dialihkan
- **WHEN** `/id/privasi` diminta
- **THEN** respons 301 dengan `Location: /privasi`

#### Scenario: Locale tidak dikenal
- **WHEN** `/fr` diminta
- **THEN** respons berstatus 404 dan, setelah hidrasi, halaman menampilkan judul not-found serta tautan ke `/` dan `/en`

### Requirement: Deteksi negara di middleware
Untuk permintaan tanpa awalan locale, middleware SHALL membaca kode negara dari header pertama yang ada di urutan: nilai `GEO_COUNTRY_HEADER` (bila dikonfigurasi), `x-vercel-ip-country`, `cf-ipcountry`, `cloudfront-viewer-country`, `x-country-code`; nilai `XX`, `T1`, atau kosong dianggap tidak diketahui. Bila negara `ID` → sajikan Indonesia. Bila negara diketahui dan bukan `ID` → redirect 302 ke path padanan berawalan `/en`. Bila tidak diketahui → gunakan `Accept-Language`: bahasa berbobot tertinggi `id` atau `ms` → Indonesia; bahasa lain → `/en`; tanpa header → Indonesia. Respons redirect MUST membawa `Cache-Control: private, no-store` dan `Vary: Cookie`.

#### Scenario: Pengunjung dari luar Indonesia
- **WHEN** `/` diminta dengan header `x-country-code: US` tanpa cookie
- **THEN** respons 302 dengan `Location: /en`, `Cache-Control: private, no-store`, dan `Vary: Cookie`

#### Scenario: Pengunjung dari Indonesia
- **WHEN** `/privasi` diminta dengan `cf-ipcountry: ID`
- **THEN** respons 200 halaman privasi berbahasa Indonesia tanpa redirect

#### Scenario: Negara tidak diketahui, Accept-Language Inggris
- **WHEN** `/` diminta tanpa header negara dan `Accept-Language: en-US,en;q=0.9`
- **THEN** respons 302 ke `/en`

#### Scenario: Negara tidak diketahui, tanpa Accept-Language
- **WHEN** `/` diminta tanpa header negara dan tanpa `Accept-Language`
- **THEN** respons 200 berbahasa Indonesia

#### Scenario: Header kustom
- **WHEN** `GEO_COUNTRY_HEADER=x-geo` dan `/` diminta dengan `x-geo: SG`
- **THEN** respons 302 ke `/en`

#### Scenario: Query dan anchor dipertahankan
- **WHEN** `/?utm_source=ig` diminta dari negara `AU`
- **THEN** `Location` adalah `/en?utm_source=ig`

### Requirement: Pilihan manual lewat cookie
Cookie `NEXT_LOCALE` bernilai `id` atau `en` MUST mengalahkan deteksi negara dan `Accept-Language`. Cookie SHALL dipasang hanya ketika permintaan membawa query `lang=id` atau `lang=en` (dari pengalih bahasa): middleware memasang cookie (`Max-Age` 1 tahun, `Path=/`, `SameSite=Lax`, `Secure` di HTTPS) lalu redirect 302 ke URL yang sama tanpa query `lang`. Deteksi geo MUST NOT memasang cookie.

#### Scenario: Cookie en mengalahkan negara ID
- **WHEN** `/` diminta dengan `cf-ipcountry: ID` dan cookie `NEXT_LOCALE=en`
- **THEN** respons 302 ke `/en`

#### Scenario: Cookie id mengalahkan negara US
- **WHEN** `/` diminta dengan `x-country-code: US` dan cookie `NEXT_LOCALE=id`
- **THEN** respons 200 berbahasa Indonesia

#### Scenario: Memilih bahasa
- **WHEN** `/en?lang=en` diminta
- **THEN** respons 302 ke `/en` dengan header `Set-Cookie` `NEXT_LOCALE=en` (`Max-Age=31536000`, `Path=/`, `SameSite=Lax`)

#### Scenario: Geo tidak memasang cookie
- **WHEN** `/` diminta dari negara `US` tanpa cookie
- **THEN** respons redirect tidak memuat header `Set-Cookie`

### Requirement: Bot tidak diarahkan
Permintaan dengan `User-Agent` yang cocok dengan daftar crawler (Googlebot, Bingbot, DuckDuckBot, YandexBot, Baiduspider, facebookexternalhit, Twitterbot, LinkedInBot, WhatsApp, TelegramBot, Slackbot, Applebot) MUST NOT dialihkan berdasarkan negara atau `Accept-Language`; path tanpa awalan selalu disajikan dalam bahasa Indonesia dan `/en` dalam bahasa Inggris.

#### Scenario: Googlebot dari AS
- **WHEN** `/` diminta dengan UA Googlebot dan `x-vercel-ip-country: US`
- **THEN** respons 200 berbahasa Indonesia tanpa redirect

#### Scenario: Pemindai tautan WhatsApp
- **WHEN** `/en` diminta dengan UA `WhatsApp/2.23`
- **THEN** respons 200 berbahasa Inggris

### Requirement: Cakupan middleware
Middleware MUST hanya berjalan untuk route halaman: path yang diawali `/api`, `/_next`, `/fonts`, `/svg`, `/illustrations`, `/brand`, atau yang memuat titik (berkas statis seperti `/favicon.svg`, `/sitemap.xml`) MUST dilewati. Middleware MUST NOT membaca body atau memanggil layanan luar.

#### Scenario: Aset tidak terpengaruh
- **WHEN** `/sitemap.xml` atau `/fonts/plus-jakarta-sans-latin-400-normal.woff2` diminta dari negara `US`
- **THEN** respons 200 langsung tanpa redirect

#### Scenario: API tidak terpengaruh
- **WHEN** `POST /api/leads` dikirim dari negara `US`
- **THEN** handler menerima permintaan tanpa redirect

### Requirement: Pengalih bahasa
Header SHALL memuat pengalih bahasa berupa **toggle bendera** di posisi paling kanan header, setelah tombol utama "Mulai konsultasi"/"Start a consultation": satu tautan berbentuk pil berisi dua bendera (Indonesia dan Inggris sebagai SVG inline, `aria-hidden`), bendera locale aktif ditonjolkan (chip terang) dan yang lain diredupkan, tanpa teks. Tautan MUST memiliki `aria-label` dan `title` "Ganti bahasa ke English"/"Switch language to Bahasa Indonesia" (nama bahasa tujuan), `hreflang` dan `lang` locale tujuan, tinggi minimal 44px, dan menuju halaman padanan di locale lain dengan query `?lang=<locale>` sehingga bekerja tanpa JavaScript. Pemetaan padanan: `/` ↔ `/en`, `/privasi` ↔ `/en/privacy`; path lain memetakan ke beranda locale tujuan. Toggle MUST tetap tampak di mobile tanpa membuka menu.

#### Scenario: Dari privasi Indonesia ke Inggris
- **WHEN** pengunjung di `/privasi` mengaktifkan toggle
- **THEN** browser menuju `/en/privacy?lang=en`, lalu dialihkan ke `/en/privacy` dengan cookie terpasang

#### Scenario: Posisi dan isi toggle
- **WHEN** header `/` dirender pada lebar ≥ 768px
- **THEN** urutan elemen adalah logo, tautan navigasi, tombol utama, lalu toggle sebagai elemen terakhir; toggle memuat dua `svg aria-hidden` dan tidak memuat teks "ID" atau "EN"

#### Scenario: Label aksesibel
- **WHEN** toggle di `/en` diperiksa
- **THEN** `aria-label` berbunyi "Switch language to Bahasa Indonesia", `hreflang="id"`, dan `href` adalah `/?lang=id`

#### Scenario: Area sentuh dan fokus
- **WHEN** toggle diperiksa di viewport 360px
- **THEN** tingginya minimal 44px dengan cincin fokus `focus-ring`

### Requirement: Resolver locale dapat diuji
Logika penentuan (`resolveLocale`) SHALL berupa fungsi murni tanpa ketergantungan pada Next.js yang menerima `pathname`, `cookie`, `country`, `acceptLanguage`, `userAgent` dan mengembalikan `pass`, `rewrite`, atau `redirect` beserta locale dan target. Uji unit SHALL mencakup semua skenario di requirement sebelumnya.

#### Scenario: Uji resolver
- **WHEN** `npm test` dijalankan
- **THEN** `lib/i18n/resolve.test.ts` lulus dengan kasus negara ID/US/kosong, cookie, Accept-Language, bot, awalan `/id`, dan pelestarian query
