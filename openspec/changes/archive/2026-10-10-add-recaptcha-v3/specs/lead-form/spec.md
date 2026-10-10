## MODIFIED Requirements

### Requirement: Pengiriman dan status
Form SHALL mengirim `POST /api/leads` dengan JSON sesuai kontrak `internal-app.md` (`nama`, `kontak`, `bisnis`, `kebutuhan`, `cerita`, `setuju`, `website`, `turnstile_token`, `utm_source`, `utm_medium`, `utm_campaign`, `page_url`, `referrer`) ditambah `privacy_version`, `locale` (`"id"` atau `"en"`), dan `recaptcha_token` (kosong bila penyedia bukan reCAPTCHA). Selama mengirim, tombol MUST nonaktif dan berlabel "Mengirim…"/"Sending…". Saat `201`, form MUST diganti pesan sukses dari kamus ("Terima kasih. Kami akan menghubungimu dalam <X> hari kerja." / "Thank you. We'll get back to you within <X> business days.") dengan `role="status"`. Saat `422`, pesan per field dari respons MUST ditampilkan; galat `captcha` (atau `turnstile`) ditampilkan sebagai galat form dengan tautan WhatsApp. Saat `429`, pesan `tooMany` dari kamus. Saat galat lain atau jaringan putus, pesan `forwardFailed` dari kamus ditampilkan dan data isian MUST tetap ada.

#### Scenario: Sukses
- **WHEN** server membalas `201`
- **THEN** pesan sukses tampil menggantikan form, dibacakan pembaca layar, dan tidak ada data isian yang tersisa di DOM

#### Scenario: Payload memuat locale
- **WHEN** form di `/en` dikirim
- **THEN** body JSON memuat `"locale": "en"`

#### Scenario: Galat validasi dari server
- **WHEN** server membalas `422 {"errors": {"kontak": "…"}}`
- **THEN** pesan tersebut tampil di bawah field `kontak` dan fokus pindah ke sana

#### Scenario: Galat captcha dari server
- **WHEN** server membalas `422 {"errors": {"captcha": "Verifikasi gagal. …"}}`
- **THEN** pesan tampil dengan `role="alert"` beserta tautan "Buka WhatsApp", isian tetap ada

#### Scenario: Jaringan gagal
- **WHEN** `fetch` melempar galat
- **THEN** pesan galat umum tampil dengan `role="alert"`, tombol kembali aktif, dan isian pengguna tidak hilang

### Requirement: Captcha opsional berpenyedia
Form SHALL mengikuti penyedia captcha aktif (spec `captcha-provider`): `recaptcha` → skrip dimuat malas dan token diminta saat kirim; `turnstile` → widget Cloudflare dimuat malas setelah interaksi pertama dan `turnstile_token` disertakan; `none` → tidak ada skrip pihak ketiga dan kedua token kosong. Form MUST tetap berfungsi pada ketiga mode.

#### Scenario: Tanpa penyedia
- **WHEN** kedua site key kosong
- **THEN** tidak ada skrip `google.com/recaptcha` maupun `challenges.cloudflare.com` dimuat dan pengiriman berhasil

#### Scenario: Turnstile tetap didukung
- **WHEN** hanya `NEXT_PUBLIC_TURNSTILE_SITE_KEY` terisi
- **THEN** widget Turnstile dimuat setelah interaksi pertama dan `turnstile_token` dikirim

## RENAMED Requirements

- FROM: `### Requirement: Turnstile opsional`
- TO: `### Requirement: Captcha opsional berpenyedia`
