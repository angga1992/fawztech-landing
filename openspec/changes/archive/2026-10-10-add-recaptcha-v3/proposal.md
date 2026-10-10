## Why

Form "Ceritakan idemu" adalah satu-satunya pintu masuk publik, dan saat ini perlindungannya hanya honeypot, rate limit per IP, idempotensi, dan Turnstile yang opsional (belum dikonfigurasi). Tim meminta Google reCAPTCHA v3 sebagai lapisan anti-bot yang tidak mengganggu pengguna (tanpa tantangan, berbasis skor). Catatan: brief landing page menyarankan Turnstile/hCaptcha dan menghindari reCAPTCHA yang berat; keputusan tim tetap reCAPTCHA v3, sehingga desain ini meminimalkan dampaknya (skrip dimuat saat pengguna mulai mengisi form, bukan saat halaman dibuka).

## What Changes

- Lapisan captcha dengan penyedia yang dapat dipilih lewat env: **reCAPTCHA v3** (baru, bawaan bila `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` diisi), Turnstile (tetap didukung), atau tanpa captcha (dev).
- Form memuat `api.js` reCAPTCHA secara malas saat interaksi pertama, meminta token dengan aksi `lead_submit` tepat saat kirim (token sekali pakai, berlaku 2 menit), dan mengirimkannya sebagai `recaptcha_token`. Kegagalan memuat skrip tidak memblokir form; server yang memutuskan.
- Teks atribusi wajib Google ditampilkan di bawah tombol kirim (badge disembunyikan), dalam dua bahasa.
- `POST /api/leads` meneruskan `recaptcha_token` ke sistem internal (yang memverifikasi sekali, karena token sekali pakai) dan hanya memverifikasi sendiri ketika berjalan tanpa sistem internal (mode webhook/log). Verifikasi: `success`, `action` = `lead_submit`, `score` ≥ ambang (bawaan 0,5), `hostname` sesuai domain landing; gagal → `422 {"errors": {"captcha": …}}`.
- Pesan galat `captcha` dalam dua bahasa; kebijakan privasi menyebut Google reCAPTCHA sebagai pemroses pihak ketiga.
- Uji unit verifikasi (fetch di-mock) dan uji route.

## Capabilities

### New Capabilities
- `captcha-provider`: pemilihan penyedia captcha (reCAPTCHA v3, Turnstile, none), pemuatan skrip malas, pengambilan token saat kirim, atribusi, dan fungsi verifikasi server reCAPTCHA v3 dengan aturan skor/aksi/hostname.

### Modified Capabilities
- `lead-form`: requirement "Turnstile opsional" menjadi captcha berpenyedia; payload menambah `recaptcha_token`.
- `lead-api`: anti-spam memverifikasi reCAPTCHA v3 hanya dalam mode tanpa sistem internal; meneruskan token ke hulu; field galat `captcha`.
- `privacy-page`: daftar pihak ketiga menyebut Google reCAPTCHA bila aktif.
- `english-translation`: pesan `captcha` dan teks atribusi reCAPTCHA di kedua kamus.

## Impact

- Kode: `lib/captcha/` baru (client loader, verifikasi server), `LeadForm.tsx`, `app/api/leads/route.ts`, `lib/leads/messages.ts`, `lib/leads/schema.ts` (field `recaptcha_token`), `content/id.ts`, `content/en.ts`, `lib/site.ts`, `.env.example`, README.
- Env baru: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_MIN_SCORE`, `RECAPTCHA_HOSTNAMES`.
- Sistem internal: change terpisah `add-recaptcha-verification` di repo `fawz-internal` (verifikasi token hulu, kolom skor).
- Privasi: reCAPTCHA mengirim data perangkat ke Google; tim bisnis perlu memastikan kebijakan privasi final menyebutnya. Akun reCAPTCHA (site key dan secret) harus dibuat tim bisnis di Google Cloud.
