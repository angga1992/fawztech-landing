## Context
Form prospek sudah punya honeypot, rate limit, idempotensi, dan Turnstile opsional (`lib/leads/turnstile.ts`, widget di `LeadForm.tsx`). Token captcha diteruskan ke sistem internal lewat `POST /api/leads` → `POST /api/public/leads`. reCAPTCHA v3 berbeda dari Turnstile: tanpa widget, token dibuat saat `grecaptcha.execute()` dengan nama aksi, dan server menerima skor 0,0–1,0.

## Goals / Non-Goals
**Goals:** anti-bot berbasis skor pada form prospek tanpa tantangan ke pengguna; verifikasi tepat satu kali di server; dampak Lighthouse minimal; Turnstile tetap bisa dipakai bila tim berubah pikiran.
**Non-Goals:** reCAPTCHA pada login sistem internal (sudah ada rate limit + 2FA), reCAPTCHA Enterprise, CSP (belum ada di proyek; dicatat sebagai tindak lanjut).

## Decisions
- **D1 Penyedia dipilih dari env, reCAPTCHA diprioritaskan.** `lib/captcha/provider.ts`: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` → `recaptcha`; selain itu `NEXT_PUBLIC_TURNSTILE_SITE_KEY` → `turnstile`; selain itu `none`. Satu penyedia aktif per deploy. Alternatif ditolak: mengganti Turnstile sepenuhnya (menghapus opsi yang disarankan brief).
- **D2 Skrip dimuat saat interaksi pertama dengan form, token diminta saat submit.** Google menyarankan memuat di semua halaman untuk skor lebih akurat, tetapi itu menambah ±100 KB JS pihak ketiga di LCP; dengan pemuatan saat fokus pertama, skor tetap dihitung dari interaksi pengguna di form. Token diambil tepat sebelum `fetch` (berlaku 2 menit, sekali pakai); bila `grecaptcha` tidak tersedia (diblokir pemblokir iklan/jaringan), token kosong dikirim dan server yang memutuskan.
- **D3 Verifikasi tepat sekali: di sistem internal bila ada, di landing hanya dalam mode webhook/log.** Token reCAPTCHA sekali pakai; bila landing memverifikasi lalu hulu memverifikasi lagi, hulu selalu gagal. Karena itu `/api/leads` meneruskan `recaptcha_token` apa adanya ke `LEADS_API_URL`, dan memverifikasi sendiri hanya ketika `LEADS_API_URL` kosong dan `RECAPTCHA_SECRET_KEY` terisi. Pemeriksaan `hostname` dari respons Google memastikan token dibuat di domain landing.
- **D4 Aturan verifikasi.** `siteverify` dengan `secret`, `response`, `remoteip`; timeout 5 s; lolos bila `success === true`, `action === "lead_submit"`, `score >= RECAPTCHA_MIN_SCORE` (bawaan 0,5), dan `hostname` ∈ `RECAPTCHA_HOSTNAMES` (bawaan: hostname `SITE_URL`; `localhost` diizinkan di luar produksi). Google tidak terjangkau → gagal tertutup (ditolak) dengan log; skor dicatat di log tanpa data pribadi.
- **D5 Field galat `captcha`, pesan dua bahasa.** `MESSAGES.captcha` menggantikan `turnstile` (alias `turnstile` dipertahankan agar hulu lama tetap tampil). Form menampilkan `errors.captcha` sebagai galat form dengan tautan WhatsApp.
- **D6 Atribusi.** Badge disembunyikan (`.grecaptcha-badge{visibility:hidden}`) dan teks wajib Google ditampilkan di bawah tombol kirim dengan tautan ke Privacy Policy dan Terms of Service Google, dari kamus. Kebijakan privasi menambah "Google reCAPTCHA" pada daftar pihak ketiga.
- **D7 Kontrak ke hulu.** Payload menambah `recaptcha_token` (string, boleh kosong) di samping `turnstile_token`. Sistem internal menentukan penyedia dari secret yang dikonfigurasi (change `add-recaptcha-verification`).

## Risks / Trade-offs
- [Skor rendah untuk pengguna sah (VPN, browser privasi)] → ambang 0,5 dapat diturunkan lewat `RECAPTCHA_MIN_SCORE`; skor dicatat di hulu untuk kalibrasi; pesan galat menawarkan WhatsApp.
- [Skrip Google diblokir pengguna] → token kosong; server menolak bila secret dikonfigurasi (keamanan diutamakan), pengguna diarahkan ke WhatsApp.
- [Dampak performa] → pemuatan malas; verifikasi ulang Lighthouse mobile setelah implementasi.
- [Privasi: data perangkat ke Google] → disebut di kebijakan privasi; tim bisnis meninjau.
- [Kunci belum ada] → tanpa `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` perilaku sama seperti sekarang.
