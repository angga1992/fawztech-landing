## MODIFIED Requirements

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
