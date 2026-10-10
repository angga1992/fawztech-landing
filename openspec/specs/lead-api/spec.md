# lead-api

## Purpose

Endpoint `POST /api/leads` pada landing page: validasi server sesuai kontrak `POST /api/public/leads` sistem internal, normalisasi kontak, anti-spam, idempotensi, dan penerusan ke sistem internal atau webhook cadangan tanpa membocorkan data pribadi ke log.

## Requirements

### Requirement: Endpoint dan bentuk permintaan
Sistem SHALL menyediakan `POST /api/leads` yang menerima JSON UTF-8 atau `application/x-www-form-urlencoded` dengan field `nama`, `kontak`, `bisnis`, `kebutuhan` (array string), `cerita`, `setuju` (boolean atau "on"), `website`, `turnstile_token`, `utm_source`, `utm_medium`, `utm_campaign`, `page_url`, `referrer`, dan opsional `locale` (`"id"` default; `"en"` diizinkan; nilai lain dianggap `"id"`). Pesan galat yang dibuat endpoint ini (400, 422 validasi, 422 Turnstile, 429, 502, 503) MUST memakai kamus pesan sesuai `locale`. Metode lain MUST dibalas `405`. Body lebih dari 16 KB atau bentuk yang tidak dapat di-parse MUST dibalas `400` dengan pesan `badBody` (locale hanya bisa dibaca bila body ter-parse; bila tidak, Indonesia). Respons MUST NOT memuat data internal apa pun selain yang ditentukan di sini, dan endpoint MUST NOT memasang cookie.

#### Scenario: Body terlalu besar
- **WHEN** permintaan dikirim dengan `content-length` 20.000
- **THEN** respons `400` dengan pesan Indonesia dan tidak ada penerusan

#### Scenario: JSON rusak
- **WHEN** body berisi `{"nama": ` (tidak lengkap)
- **THEN** respons `400 {"error": "Bentuk data tidak dikenali."}`

#### Scenario: Metode GET
- **WHEN** `GET /api/leads` dipanggil
- **THEN** respons `405` dengan header `Allow: POST`

#### Scenario: Validasi gagal dengan locale en
- **WHEN** body `{"locale": "en", "nama": "", "kontak": "", "cerita": "", "setuju": false}`
- **THEN** respons `422` dengan `errors.nama` = "This field is required" dan `errors.setuju` = "Please tick the consent box to continue"

#### Scenario: Locale tidak dikenal
- **WHEN** body memuat `"locale": "fr"` dan `nama` kosong
- **THEN** respons `422` dengan pesan Indonesia

### Requirement: Validasi server
Sistem SHALL memvalidasi: `nama` wajib (1–120 karakter setelah trim); `kontak` wajib dan harus nomor WhatsApp Indonesia (`08…`, `+62…`, `62…`, dengan spasi/strip/titik diabaikan, 9–15 digit setelah normalisasi ke `62…`) atau email valid; `cerita` wajib dan ≤ 1.000 karakter; `setuju` harus `true`; `kebutuhan` hanya boleh berisi nilai dari `web`, `mobile`, `desktop`, `uiux`, `belum` (duplikat dihapus); `bisnis` ≤ 120 karakter; field UTM, `page_url`, `referrer` ≤ 500 karakter. Galat MUST dibalas `422 {"errors": {"<field>": "<pesan Indonesia>"}}` dengan semua field yang gagal sekaligus.

#### Scenario: Field wajib kosong
- **WHEN** body `{"nama": "", "kontak": "", "cerita": "", "setuju": false}`
- **THEN** respons `422` dengan `errors.nama`, `errors.kontak`, `errors.cerita` = "Wajib diisi" dan `errors.setuju` = "Centang persetujuan untuk melanjutkan"

#### Scenario: Normalisasi nomor
- **WHEN** `kontak` = "+62 812-3456-7890", "0812 3456 7890", atau "628123456789"
- **THEN** validasi lolos dan nilai yang diteruskan adalah "628123456789" (atau digit setara)

#### Scenario: Email valid
- **WHEN** `kontak` = "Budi@Contoh.ID"
- **THEN** validasi lolos dan nilai diteruskan sebagai "budi@contoh.id"

#### Scenario: Cerita terlalu panjang
- **WHEN** `cerita` berisi 1.001 karakter
- **THEN** respons `422` dengan `errors.cerita` = "Maksimal 1.000 karakter"

#### Scenario: Kebutuhan di luar daftar
- **WHEN** `kebutuhan` = `["web", "blockchain"]`
- **THEN** respons `422` dengan `errors.kebutuhan` = "Pilihan tidak dikenali"

### Requirement: Anti-spam
Sistem SHALL: (1) bila `website` terisi, membalas `201 {"id": "<uuid>"}` tanpa menyimpan atau meneruskan; (2) membatasi laju per IP klien (dari `x-forwarded-for` pertama atau alamat soket) 5 permintaan per menit dan 20 per jam, membalas `429 {"error": "Terlalu banyak percobaan. Coba lagi beberapa menit."}` dengan header `Retry-After`; (3) menolak kiriman identik (hash dari `kontak` ternormalisasi + `cerita`) dalam 10 menit dengan membalas `201` dan `id` yang sama tanpa meneruskan ulang; (4) captcha: bila `LEADS_API_URL` terisi, token (`recaptcha_token` dan `turnstile_token`) MUST diteruskan apa adanya ke hulu tanpa diverifikasi di landing (token sekali pakai; hulu memverifikasi); bila `LEADS_API_URL` kosong dan `RECAPTCHA_SECRET_KEY` terisi, landing memverifikasi `recaptcha_token` sesuai spec `captcha-provider` dan membalas `422 {"errors": {"captcha": "Verifikasi gagal. Muat ulang halaman dan coba lagi."}}` (pesan sesuai locale) bila gagal; bila `LEADS_API_URL` kosong dan `TURNSTILE_SECRET_KEY` terisi, memverifikasi `turnstile_token` dengan pesan yang sama. Pemeriksaan rate limit dan honeypot MUST berjalan sebelum validasi. Log MUST memuat `score` dan `reason` tanpa token atau data pribadi.

#### Scenario: Honeypot terisi
- **WHEN** body valid tetapi `website` = "http://spam"
- **THEN** respons `201` dengan `id` acak, tidak ada panggilan ke `LEADS_API_URL`/webhook, dan tidak ada log berisi data pribadi

#### Scenario: Melampaui batas per menit
- **WHEN** IP yang sama mengirim permintaan ke-6 dalam 60 detik
- **THEN** respons `429` dengan `Retry-After` dan tidak ada penerusan

#### Scenario: Kiriman ganda
- **WHEN** payload yang sama dikirim dua kali dalam 10 menit
- **THEN** kedua respons `201` memuat `id` yang sama dan penerusan hanya terjadi sekali

#### Scenario: Token diteruskan ke hulu tanpa verifikasi lokal
- **WHEN** `LEADS_API_URL` dan `RECAPTCHA_SECRET_KEY` keduanya terisi dan body memuat `recaptcha_token`
- **THEN** tidak ada panggilan ke `siteverify` dari landing dan body ke hulu memuat `recaptcha_token` yang sama

#### Scenario: Verifikasi lokal pada mode webhook
- **WHEN** `LEADS_API_URL` kosong, `RECAPTCHA_SECRET_KEY` terisi, dan Google membalas skor 0,1
- **THEN** respons `422` dengan `errors.captcha` dan tidak ada penerusan ke webhook

#### Scenario: Tanpa captcha dikonfigurasi
- **WHEN** `RECAPTCHA_SECRET_KEY` dan `TURNSTILE_SECRET_KEY` kosong
- **THEN** verifikasi dilewati dan permintaan valid diproses

### Requirement: Penerusan ke sistem internal atau cadangan
Setelah valid, sistem SHALL menyusun payload persis sesuai kontrak `POST /api/public/leads` di `internal-app.md` (`kontak` sudah dinormalkan, ditambah `privacy_version`; field `locale` MUST dihapus dan tidak diteruskan) dan: bila `LEADS_API_URL` terisi, meneruskan dengan header `Content-Type: application/json`, `X-Forwarded-For` IP klien asli, dan `Authorization: Bearer <LEADS_API_TOKEN>` bila dikonfigurasi, lalu memetakan respons hulu (`201` → `201` dengan `id` hulu; `422` → `422` dengan `errors` hulu apa adanya; `429` → `429` dengan pesan `tooMany` sesuai locale; lainnya → `502` dengan pesan `forwardFailed` sesuai locale); bila hanya `LEADS_WEBHOOK_URL` terisi, mengirim payload yang sama ditambah `id` dan `received_at` ke webhook dan membalas `201`; bila keduanya kosong, membalas `201` dan mencatat payload ke log hanya di lingkungan `development`, dan membalas `503` dengan pesan `notConfigured` sesuai locale di `production`. Timeout penerusan MUST 8 detik.

#### Scenario: Diteruskan ke sistem internal
- **WHEN** `LEADS_API_URL` = "https://internal.example/api/public/leads" dan body valid dengan `locale: "en"`
- **THEN** satu permintaan POST dikirim ke URL itu dengan body yang memuat `kontak` = "62…", semua field UTM, dan tidak memuat kunci `locale`; respons ke klien adalah `201` dengan `id` dari hulu

#### Scenario: Hulu membalas 422
- **WHEN** sistem internal membalas `422 {"errors": {"kontak": "Nomor sudah terdaftar"}}`
- **THEN** klien menerima `422` dengan `errors` yang sama

#### Scenario: Hulu timeout
- **WHEN** sistem internal tidak membalas dalam 8 detik
- **THEN** klien menerima `502` dengan pesan sesuai locale dan galat dicatat tanpa data pribadi

#### Scenario: Hanya webhook
- **WHEN** `LEADS_API_URL` kosong dan `LEADS_WEBHOOK_URL` terisi
- **THEN** payload dikirim ke webhook dan klien menerima `201`

#### Scenario: Produksi tanpa tujuan
- **WHEN** `NODE_ENV=production`, `LEADS_API_URL` dan `LEADS_WEBHOOK_URL` kosong, `locale: "en"`
- **THEN** respons `503 {"error": "The form is not active yet. Contact us on WhatsApp."}`

### Requirement: Log dan privasi
Sistem MUST NOT menulis `nama`, `kontak`, `bisnis`, atau `cerita` ke log aplikasi di `production`. Log MUST berisi hanya `id`, status, tujuan penerusan, durasi, dan jenis galat.

#### Scenario: Galat penerusan dicatat
- **WHEN** penerusan gagal
- **THEN** entri log memuat `id`, `target`, `status`, dan pesan galat teknis, tanpa field pribadi

### Requirement: Uji otomatis
Modul validasi dan normalisasi SHALL memiliki uji unit (Vitest) yang mencakup: normalisasi nomor (`08`, `+62`, `62`, pemisah), email valid/tidak, field wajib, batas 1.000 karakter, whitelist `kebutuhan`, `setuju` wajib `true`, dan honeypot. Route handler SHALL memiliki uji yang mencakup `400`, `422`, `429`, `201` honeypot, idempotensi, dan pemetaan respons hulu dengan `fetch` yang di-mock.

#### Scenario: Menjalankan uji
- **WHEN** `npm test` dijalankan
- **THEN** semua uji lulus dan mencakup skenario di atas
