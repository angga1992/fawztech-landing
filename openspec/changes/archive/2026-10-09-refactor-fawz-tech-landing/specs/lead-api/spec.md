## ADDED Requirements

### Requirement: Endpoint dan bentuk permintaan
Sistem SHALL menyediakan `POST /api/leads` yang menerima JSON UTF-8 atau `application/x-www-form-urlencoded` dengan field `nama`, `kontak`, `bisnis`, `kebutuhan` (array string), `cerita`, `setuju` (boolean atau "on"), `website`, `turnstile_token`, `utm_source`, `utm_medium`, `utm_campaign`, `page_url`, `referrer`. Metode lain MUST dibalas `405`. Body lebih dari 16 KB atau bentuk yang tidak dapat di-parse MUST dibalas `400 {"error": "Bentuk data tidak dikenali."}`. Respons MUST NOT memuat data internal apa pun selain yang ditentukan di sini, dan endpoint MUST NOT memasang cookie.

#### Scenario: Body terlalu besar
- **WHEN** permintaan dikirim dengan `content-length` 20.000
- **THEN** respons `400` dengan pesan Indonesia dan tidak ada penerusan

#### Scenario: JSON rusak
- **WHEN** body berisi `{"nama": ` (tidak lengkap)
- **THEN** respons `400 {"error": "Bentuk data tidak dikenali."}`

#### Scenario: Metode GET
- **WHEN** `GET /api/leads` dipanggil
- **THEN** respons `405` dengan header `Allow: POST`

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
Sistem SHALL: (1) bila `website` terisi, membalas `201 {"id": "<uuid>"}` tanpa menyimpan atau meneruskan; (2) membatasi laju per IP klien (dari `x-forwarded-for` pertama atau alamat soket) 5 permintaan per menit dan 20 per jam, membalas `429 {"error": "Terlalu banyak percobaan. Coba lagi beberapa menit."}` dengan header `Retry-After`; (3) menolak kiriman identik (hash dari `kontak` ternormalisasi + `cerita`) dalam 10 menit dengan membalas `201` dan `id` yang sama tanpa meneruskan ulang; (4) bila `TURNSTILE_SECRET_KEY` dikonfigurasi, memverifikasi `turnstile_token` ke Cloudflare dan membalas `422 {"errors": {"turnstile": "Verifikasi gagal. Muat ulang halaman dan coba lagi."}}` bila gagal. Pemeriksaan rate limit dan honeypot MUST berjalan sebelum validasi.

#### Scenario: Honeypot terisi
- **WHEN** body valid tetapi `website` = "http://spam"
- **THEN** respons `201` dengan `id` acak, tidak ada panggilan ke `LEADS_API_URL`/webhook, dan tidak ada log berisi data pribadi

#### Scenario: Melampaui batas per menit
- **WHEN** IP yang sama mengirim permintaan ke-6 dalam 60 detik
- **THEN** respons `429` dengan `Retry-After` dan tidak ada penerusan

#### Scenario: Kiriman ganda
- **WHEN** payload yang sama dikirim dua kali dalam 10 menit
- **THEN** kedua respons `201` memuat `id` yang sama dan penerusan hanya terjadi sekali

#### Scenario: Turnstile tidak dikonfigurasi
- **WHEN** `TURNSTILE_SECRET_KEY` kosong
- **THEN** verifikasi dilewati dan permintaan valid diproses

### Requirement: Penerusan ke sistem internal atau cadangan
Setelah valid, sistem SHALL menyusun payload persis sesuai kontrak `POST /api/public/leads` di `internal-app.md` (`kontak` sudah dinormalkan) dan: bila `LEADS_API_URL` terisi, meneruskan dengan header `Content-Type: application/json`, `X-Forwarded-For` IP klien asli, dan `Authorization: Bearer <LEADS_API_TOKEN>` bila dikonfigurasi, lalu memetakan respons hulu (`201` → `201` dengan `id` hulu; `422` → `422` dengan `errors` hulu; `429` → `429`; lainnya → `502 {"error": "Pengiriman gagal. Coba lagi atau hubungi kami lewat WhatsApp."}`); bila hanya `LEADS_WEBHOOK_URL` terisi, mengirim payload yang sama ditambah `id` dan `received_at` ke webhook dan membalas `201`; bila keduanya kosong, membalas `201` dan mencatat payload ke log hanya di lingkungan `development`, dan membalas `503 {"error": "Form belum aktif. Hubungi kami lewat WhatsApp."}` di `production`. Timeout penerusan MUST 8 detik.

#### Scenario: Diteruskan ke sistem internal
- **WHEN** `LEADS_API_URL` = "https://internal.example/api/public/leads" dan body valid
- **THEN** satu permintaan POST dikirim ke URL itu dengan body yang memuat `kontak` = "62…" dan semua field UTM, dan respons ke klien adalah `201` dengan `id` dari hulu

#### Scenario: Hulu membalas 422
- **WHEN** sistem internal membalas `422 {"errors": {"kontak": "Nomor sudah terdaftar"}}`
- **THEN** klien menerima `422` dengan `errors` yang sama

#### Scenario: Hulu timeout
- **WHEN** sistem internal tidak membalas dalam 8 detik
- **THEN** klien menerima `502` dengan pesan Indonesia dan galat dicatat tanpa data pribadi

#### Scenario: Hanya webhook
- **WHEN** `LEADS_API_URL` kosong dan `LEADS_WEBHOOK_URL` terisi
- **THEN** payload dikirim ke webhook dan klien menerima `201`

#### Scenario: Produksi tanpa tujuan
- **WHEN** `NODE_ENV=production`, `LEADS_API_URL` dan `LEADS_WEBHOOK_URL` kosong
- **THEN** respons `503` dengan pesan Indonesia

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
