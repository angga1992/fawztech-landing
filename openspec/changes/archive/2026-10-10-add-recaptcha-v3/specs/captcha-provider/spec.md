## ADDED Requirements

### Requirement: Pemilihan penyedia captcha
Sistem SHALL menentukan penyedia captcha dari env: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` terisi → `recaptcha`; selain itu `NEXT_PUBLIC_TURNSTILE_SITE_KEY` terisi → `turnstile`; selain itu `none`. Hanya satu penyedia aktif.

#### Scenario: reCAPTCHA diprioritaskan
- **WHEN** kedua site key terisi
- **THEN** penyedia aktif adalah `recaptcha` dan skrip Turnstile tidak dimuat

### Requirement: Pemuatan skrip reCAPTCHA v3 secara malas
Bila penyedia `recaptcha`, form SHALL memuat `https://www.google.com/recaptcha/api.js?render=<site key>` hanya setelah interaksi pertama pengguna dengan form (fokus atau ketik), bukan saat halaman dimuat, dan MUST NOT memuat skrip apa pun bila penyedia `none`.

#### Scenario: Halaman dibuka tanpa interaksi
- **WHEN** `/` dimuat dan pengguna tidak menyentuh form
- **THEN** tidak ada permintaan ke `www.google.com/recaptcha` atau `www.gstatic.com/recaptcha`

#### Scenario: Interaksi pertama
- **WHEN** pengguna memfokuskan field apa pun di form
- **THEN** skrip reCAPTCHA dimuat sekali

### Requirement: Token diminta saat kirim
Saat form dikirim, sistem SHALL memanggil `grecaptcha.execute(siteKey, { action: "lead_submit" })` dan menyertakan hasilnya sebagai `recaptcha_token` dalam payload. Bila `grecaptcha` tidak tersedia atau `execute` gagal dalam 5 detik, form MUST tetap mengirim dengan `recaptcha_token` kosong (server memutuskan).

#### Scenario: Token disertakan
- **WHEN** skrip termuat dan form dikirim
- **THEN** body JSON memuat `recaptcha_token` tidak kosong dan `turnstile_token` kosong

#### Scenario: Skrip diblokir
- **WHEN** skrip gagal dimuat dan form dikirim
- **THEN** body memuat `recaptcha_token` kosong dan pengiriman tetap dilakukan

### Requirement: Atribusi Google
Bila penyedia `recaptcha`, badge reCAPTCHA SHALL disembunyikan dan teks atribusi dari kamus ("Situs ini dilindungi reCAPTCHA; Kebijakan Privasi dan Persyaratan Layanan Google berlaku." / "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.") ditampilkan di bawah tombol kirim dengan tautan ke `https://policies.google.com/privacy` dan `https://policies.google.com/terms`.

#### Scenario: Atribusi tampil
- **WHEN** form dirender dengan penyedia `recaptcha`
- **THEN** teks atribusi dan kedua tautan ada di DOM; tanpa penyedia, teks tidak ada

### Requirement: Verifikasi server reCAPTCHA v3
`verifyRecaptcha(token, ip)` SHALL memanggil `https://www.google.com/recaptcha/api/siteverify` (timeout 5 detik) dan mengembalikan `{ ok, score, reason }`; `ok` hanya bila `success === true`, `action === "lead_submit"`, `score >= RECAPTCHA_MIN_SCORE` (bawaan 0,5), dan `hostname` termasuk dalam `RECAPTCHA_HOSTNAMES` (bawaan hostname `SITE_URL`; `localhost` diizinkan di luar produksi). Token kosong, Google tidak terjangkau, atau respons tidak valid MUST menghasilkan `ok: false`. Secret MUST NOT muncul di log.

#### Scenario: Skor cukup
- **WHEN** Google membalas `{success:true, score:0.9, action:"lead_submit", hostname:"domainanda.id"}`
- **THEN** `ok: true` dengan `score: 0.9`

#### Scenario: Skor rendah
- **WHEN** Google membalas `score: 0.2`
- **THEN** `ok: false` dengan `reason: "low_score"`

#### Scenario: Aksi berbeda
- **WHEN** `action` bukan `lead_submit`
- **THEN** `ok: false` dengan `reason: "action_mismatch"`

#### Scenario: Google timeout
- **WHEN** permintaan `siteverify` melebihi 5 detik
- **THEN** `ok: false` dengan `reason: "unavailable"`
