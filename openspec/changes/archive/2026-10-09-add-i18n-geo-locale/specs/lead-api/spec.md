## MODIFIED Requirements

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
