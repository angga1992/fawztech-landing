## Context

Landing page Fawz Tech (Next.js 14 App Router, tanpa pustaka i18n) berbahasa Indonesia saja: `app/page.tsx`, `app/privasi/page.tsx`, naskah di `content/landing.ts`, pesan validasi di `lib/leads/schema.ts` (`MESSAGES`, berbahasa Indonesia karena kontrak `internal-app.md`), dan halaman diprerender statis. Hosting belum ditetapkan (pertanyaan terbuka di `internal-app.md`), jadi sumber data negara pengunjung belum pasti.

Perilaku yang diminta: pengunjung dari Indonesia melihat bahasa Indonesia, pengunjung dari negara lain melihat bahasa Inggris, dengan pilihan manual yang diingat.

## Goals / Non-Goals

**Goals:**
- Dua locale penuh (`id`, `en`) dengan URL yang stabil dan dapat diindeks terpisah.
- Deteksi negara otomatis pada kunjungan pertama; pilihan manual mengalahkan deteksi.
- Tidak merusak SEO versi Indonesia (`/` tetap Indonesia untuk crawler) dan tidak membuat halaman menjadi dinamis.
- Tanpa dependensi baru; kamus bertipe agar kunci yang hilang gagal saat `tsc`.
- Kontrak ke sistem internal tidak berubah.

**Non-Goals:**
- Bahasa ketiga, terjemahan otomatis, atau CMS.
- Mengubah bahasa pesan 422 yang berasal dari sistem internal (hulu).
- Deteksi lokasi lewat GPS/IP lookup pihak ketiga di klien.
- Mata uang atau format angka (landing page tidak menampilkan harga).

## Decisions

### D1. URL: Indonesia tanpa awalan (`/`, `/privasi`), Inggris berawalan (`/en`, `/en/privacy`)
Struktur route `app/[locale]/` dengan `generateStaticParams` → `id`, `en` dan `dynamicParams = false`. Middleware me-*rewrite* permintaan tanpa awalan ke `/id/...` secara internal (URL di browser tetap `/`), dan me-*redirect* `/id/...` → `/...` (301) agar hanya ada satu URL kanonik per halaman.
Alasan: URL Indonesia yang sudah ada tidak berubah (tidak ada redirect massal, tautan WhatsApp/sosial tetap berlaku); versi Inggris mendapat URL sendiri untuk `hreflang`. Alternatif ditolak: `/id` dan `/en` keduanya berawalan (mengubah URL utama yang sudah tayang); satu URL dengan konten berganti berdasarkan geo (crawler melihat satu bahasa, tidak bisa diindeks dua versi).

### D2. Kamus bertipe per locale, bukan pustaka i18n
`content/id.ts` mendefinisikan objek naskah dan mengekspor `type Dictionary = typeof id`; `content/en.ts` dideklarasikan `satisfies Dictionary` sehingga kunci yang kurang atau lebih gagal di `tsc`. `lib/i18n/dictionary.ts` mengekspor `getDictionary(locale)`. Komponen seksi menerima `t` (kamus) lewat prop dari halaman; komponen klien (`Header`, `LeadForm`) menerima hanya irisan kamus yang dibutuhkan sebagai prop agar bundel klien tidak memuat seluruh naskah dua bahasa.
Alasan: hanya dua locale dan tidak ada pluralisasi/ICU; next-intl atau i18next menambah ±10 KB dan konfigurasi tanpa manfaat di sini. Alternatif ditolak: JSON mentah (tidak ada pemeriksaan tipe).

### D3. Resolver locale murni di `lib/i18n/resolve.ts` dengan prioritas cookie > geo > Accept-Language > `id`
```
resolveLocale({ pathname, cookie, country, acceptLanguage, userAgent }) →
  { action: "pass" | "rewrite" | "redirect", locale, target? }
```
Aturan:
1. Path berawalan `/en` → `pass` (locale `en`). Path berawalan `/id` → `redirect` ke path tanpa awalan (301).
2. Path tanpa awalan: bila UA adalah bot (daftar: googlebot, bingbot, duckduckbot, yandex, baiduspider, facebookexternalhit, twitterbot, linkedinbot, whatsapp, telegrambot, slackbot, applebot) → `rewrite` ke `/id/...` tanpa redirect.
3. Bila cookie `NEXT_LOCALE` valid → `en` berarti `redirect` 302 ke `/en/...`; `id` berarti `rewrite`.
4. Bila `country` ada: `ID` → `rewrite`; selain itu → `redirect` 302 ke `/en/...`.
5. Bila `country` kosong: `Accept-Language` dengan `id` (atau `ms`) berbobot tertinggi → `rewrite`; bahasa lain yang dikenali → `redirect` ke `/en`; tidak ada header → `rewrite` (`id`).
Negara dibaca oleh middleware dari header pertama yang ada di daftar: nilai `GEO_COUNTRY_HEADER` (opsional), `x-vercel-ip-country`, `cf-ipcountry`, `cloudfront-viewer-country`, `x-country-code`. Nilai `XX`/`T1` (tidak diketahui) dianggap kosong.
Alasan: fungsi murni dapat diuji tanpa Next; cookie di atas geo karena pilihan eksplisit harus menang (pengguna Indonesia di luar negeri); bot tidak diarahkan karena Googlebot merayapi dari AS dan akan kehilangan versi Indonesia. Redirect 302 (bukan 301) karena bergantung pada pengunjung.

### D4. Cookie `NEXT_LOCALE` hanya dipasang saat pilihan eksplisit
Pengalih bahasa di header adalah tautan biasa (`<a href="/en…">` atau `<a href="/…">`) ke halaman padanan; middleware memasang cookie `NEXT_LOCALE` (1 tahun, `SameSite=Lax`, `Path=/`) ketika permintaan membawa query `?lang=id|en`, lalu redirect ke URL bersih. Deteksi geo tidak memasang cookie.
Alasan: pengalih bekerja tanpa JavaScript; cookie hanya mencatat keputusan manusia, bukan tebakan sistem, sehingga pengunjung yang pindah negara tetap dideteksi ulang. Pemetaan path padanan (`/privasi` ↔ `/en/privacy`) ada di `lib/i18n/routes.ts` dan dipakai pengalih, `hreflang`, dan sitemap.

### D5. Middleware matcher sempit; halaman tetap statis
`middleware.ts` `matcher: ["/((?!api|_next|fonts|svg|illustrations|brand|.*\\..*).*)"]`. Middleware tidak membaca body dan tidak memanggil layanan luar; keputusan O(1) dari header. Halaman `/` dan `/en` tetap diprerender; hanya respons redirect yang dibuat per permintaan.
Risiko cache CDN: respons redirect geo MUST membawa `Vary: Cookie` dan `Cache-Control: private, no-store` agar CDN tidak menyimpan redirect untuk semua pengunjung.

### D6. Pesan API mengikuti locale hanya untuk pesan buatan landing page
`validateLead(input, messages = MESSAGES_ID)` menerima kamus pesan; `MESSAGES_EN` ditambahkan di `lib/leads/messages.ts`. `POST /api/leads` membaca `locale` dari body (`"id"` default, `"en"` diizinkan), memakai kamus itu untuk 400/422/429/502/503 miliknya sendiri, lalu **menghapus** `locale` sebelum menyusun payload hulu. Pesan 422 dari sistem internal diteruskan apa adanya (berbahasa Indonesia).
Alasan: kontrak `internal-app.md` menetapkan field payload dan bahasa pesan hulu; landing page tidak boleh menambah field. Pesan validasi klien dan server tetap satu sumber (kamus pesan), hanya bahasanya dipilih.

### D7. Terjemahan Inggris: sumber dan suara
Teks Inggris disusun dari `MESSAGING-KIT.md` (tagline Inggris resmi) dan terjemahan `landing-copy.json`. Suara: "we" untuk Fawz Tech, "you/your" untuk klien; urutan layanan tetap Web, Mobile, Desktop, UI/UX; judul sentence case; tidak ada klaim baru. Istilah yang tetap: "Discovery", "Build", "Launch and support". Title: "Fawz Tech | Custom Software House"; description: "Fawz Tech builds custom software with you: Web, Mobile, Desktop, and UI/UX. The right system for your business. Tell us your idea." Pesan WhatsApp Inggris: "Hello Fawz Tech, I'd like to discuss an app for my business." Pesan sukses: "Thank you. We'll get back to you within {X} business days."
Halaman privasi Inggris memakai `PRIVACY_POLICY_VERSION` yang sama (satu kebijakan, dua bahasa); `formatDate(iso, locale)` menghasilkan "9 Oktober 2026" / "9 October 2026".

### D8. Metadata per locale
`generateMetadata({ params })` di `app/[locale]/layout.tsx` dan halaman: `title`, `description`, `openGraph.locale` (`id_ID`/`en_US`) dengan `alternateLocale`, `alternates.canonical` ke URL locale itu, `alternates.languages` `{ id: "/", en: "/en", "x-default": "/" }` (untuk privasi: `/privasi`, `/en/privacy`). `<html lang>` dari `params.locale`. JSON-LD `Organization` memakai `description` sesuai locale; `inLanguage` ditambahkan. Sitemap memuat empat URL dengan `alternates.languages`.

### D9. Struktur berkas
```
middleware.ts
lib/i18n/
  config.ts        LOCALES, DEFAULT_LOCALE, COOKIE_NAME, BOT_UA_RE, GEO_HEADERS
  resolve.ts       resolveLocale (murni) + parseAcceptLanguage
  routes.ts        pathFor(locale, key), alternatePath(pathname)
  dictionary.ts    getDictionary(locale), type Dictionary
  format.ts        formatDate(iso, locale)
content/id.ts      (dari content/landing.ts + teks privasi + label pengalih)
content/en.ts
app/[locale]/layout.tsx   html lang, metadata, JSON-LD, skip link, Plausible
app/[locale]/page.tsx
app/[locale]/privasi/page.tsx     (id)   ← satu komponen PrivacyPage(dict)
app/[locale]/privacy/page.tsx     (en)   ← notFound() bila locale tidak cocok
app/[locale]/not-found.tsx
```
`app/layout.tsx`, `app/page.tsx`, `app/privasi/` dihapus. Pengujian: `lib/i18n/resolve.test.ts`, `lib/i18n/dictionary.test.ts` (kunci `en` = kunci `id`, tidak ada string kosong, placeholder `{X}` ada di kedua), `app/api/leads/route.test.ts` ditambah kasus `locale: "en"`.

## Risks / Trade-offs

- [Header negara tidak tersedia di hosting yang dipilih] → fallback `Accept-Language`, dan `GEO_COUNTRY_HEADER` memungkinkan proxy mana pun (Nginx `geoip2`) mengirim header kustom. Didokumentasikan di README dan `.env.example`.
- [CDN menyimpan respons redirect geo untuk semua pengunjung] → `Cache-Control: private, no-store` dan `Vary: Cookie` pada redirect; halaman statisnya sendiri tetap dapat di-cache.
- [Pengunjung Indonesia di luar negeri mendapat Inggris] → pengalih bahasa selalu tampak di header dan pilihannya disimpan 1 tahun.
- [Crawler melihat redirect dan kehilangan versi id] → bot dikecualikan dari redirect; `hreflang` dua arah + `x-default`; redirect 302.
- [Terjemahan Inggris belum ditinjau tim bisnis] → kamus terpisah, mudah disunting; catatan di README seperti teks privasi.
- [Middleware menambah latensi per permintaan] → hanya header, tanpa I/O; matcher mengecualikan aset.
- [Pesan 422 hulu tetap Indonesia untuk pengguna Inggris] → jarang terjadi karena validasi klien sudah dalam bahasa Inggris; diterima sebagai batasan kontrak.
- [Root layout berada di segmen dinamis `[locale]`, sehingga Next 14.2 merender respons 404 dengan kerangka HTML minimal (`<html id="__next_error__">`) dan baru menampilkan `app/[locale]/not-found.tsx` setelah hidrasi] → Diterima: status HTTP tetap 404 (yang dibaca crawler), pengguna dengan JavaScript melihat halaman 404 berbahasa (locale dari header `x-locale` yang dipasang middleware). Alternatif yang dicoba dan ditolak: `app/not-found.tsx` di root (Next menolak build tanpa root layout) dan root layout statis `app/layout.tsx` (tidak bisa mengatur `<html lang>` per locale tanpa membuat semua halaman dinamis). Layout `[locale]` tidak boleh memanggil `notFound()` karena pohon not-found dirender tanpa params.

## Migration Plan

1. Tambah `lib/i18n/*`, `content/id.ts` (salin dari `landing.ts`), `content/en.ts`, uji resolver dan kamus.
2. Pindahkan halaman ke `app/[locale]/`, ubah komponen menerima kamus; `tsc` harus hijau sebelum menghapus berkas lama.
3. Tambah `middleware.ts`; verifikasi `/`, `/en`, `/id` (redirect), `/privasi`, `/en/privacy`, redirect geo dengan header `x-country-code: US`, bot UA tidak diarahkan, cookie lewat `?lang=`.
4. Metadata, sitemap, `hreflang`; Lighthouse ulang untuk `/` dan `/en`.
5. README dan `.env.example` (`GEO_COUNTRY_HEADER`).
Rollback: `git revert`; URL Indonesia tidak berubah sehingga tidak ada tautan rusak setelah rollback.

## Open Questions

- Hosting final menentukan header negara; sampai itu ada, fallback `Accept-Language` yang berlaku di produksi.
- Apakah tim bisnis ingin versi Inggris dari pesan WhatsApp pembuka juga dipakai di akun WhatsApp (balasan tetap manusia).
- Siapa yang meninjau naskah Inggris sebelum tayang.
