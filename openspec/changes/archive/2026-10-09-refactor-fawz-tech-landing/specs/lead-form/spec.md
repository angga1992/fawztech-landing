## ADDED Requirements

### Requirement: Field form
Form "Ceritakan idemu" SHALL memiliki field: `nama` (teks, wajib), `kontak` (teks, wajib, "WhatsApp atau email"), `bisnis` (teks, opsional, "Perusahaan atau bisnis"), `kebutuhan` (kotak centang: Web, Mobile, Desktop, UI/UX, Belum tahu → nilai `web`, `mobile`, `desktop`, `uiux`, `belum`), `cerita` (area teks, wajib, maksimal 1.000 karakter, teks bantu "Boleh singkat. Misalnya: proses apa yang mau dirapikan."), `setuju` (kotak centang wajib dengan teks persetujuan yang menautkan ke `/privasi`), honeypot `website` tersembunyi, dan tombol "Kirim cerita". Setiap input MUST memiliki `<label>` terhubung, tinggi 48px, `radius-sm`, dan `autocomplete` yang sesuai (`name`, `organization`).

#### Scenario: Label terhubung
- **WHEN** setiap input diperiksa
- **THEN** ada `label[for]` yang menunjuk ke `id` input, atau `fieldset`/`legend` untuk kelompok kotak centang

#### Scenario: Honeypot tidak terlihat
- **WHEN** halaman dirender
- **THEN** field `website` berada di luar viewport, `tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"`, dan tidak dapat dijangkau Tab

#### Scenario: Penghitung karakter
- **WHEN** pengguna mengetik di `cerita`
- **THEN** sisa karakter dari 1.000 ditampilkan dan input menolak karakter ke-1.001

### Requirement: Validasi sisi klien
Form SHALL memvalidasi sebelum mengirim dengan aturan yang sama dengan server (`lib/leads/schema.ts`): `nama`, `kontak`, `cerita`, dan `setuju` wajib; `kontak` harus nomor WhatsApp Indonesia (`08…`, `+62…`, `62…`, 9–15 digit setelah normalisasi) atau email valid. Galat MUST ditampilkan per field di bawah input dengan kata ("Wajib diisi" atau "Isi nomor WhatsApp (08… atau +62…) atau email yang valid"), warna `danger`, `aria-invalid="true"`, dan `aria-describedby` ke pesan galat. Fokus MUST pindah ke field pertama yang galat.

#### Scenario: Kirim kosong
- **WHEN** pengguna menekan "Kirim cerita" tanpa mengisi apa pun
- **THEN** `nama`, `kontak`, `cerita`, dan `setuju` menampilkan "Wajib diisi", tidak ada permintaan jaringan, dan fokus berada di `nama`

#### Scenario: Kontak tidak valid
- **WHEN** `kontak` diisi "halo" dan form dikirim
- **THEN** pesan "Isi nomor WhatsApp (08… atau +62…) atau email yang valid" tampil di bawah `kontak` dan tidak ada permintaan jaringan

#### Scenario: Kontak valid dalam berbagai bentuk
- **WHEN** `kontak` diisi "0812-3456-789", "+62 812 3456 789", atau "budi@contoh.id"
- **THEN** validasi klien lolos

### Requirement: Pengiriman dan status
Form SHALL mengirim `POST /api/leads` dengan JSON sesuai kontrak `internal-app.md` (`nama`, `kontak`, `bisnis`, `kebutuhan`, `cerita`, `setuju`, `website`, `turnstile_token`, `utm_source`, `utm_medium`, `utm_campaign`, `page_url`, `referrer`). Selama mengirim, tombol MUST nonaktif dan berlabel "Mengirim…". Saat `201`, form MUST diganti pesan sukses "Terima kasih. Kami akan menghubungimu dalam <X> hari kerja." (X dari konfigurasi) dengan `role="status"`. Saat `422`, pesan per field dari respons MUST ditampilkan. Saat `429`, pesan "Terlalu banyak percobaan. Coba lagi beberapa menit." Saat galat lain atau jaringan putus, pesan umum "Pengiriman gagal. Coba lagi atau hubungi kami lewat WhatsApp." ditampilkan dan data isian MUST tetap ada.

#### Scenario: Sukses
- **WHEN** server membalas `201`
- **THEN** pesan sukses tampil menggantikan form, dibacakan pembaca layar, dan tidak ada data isian yang tersisa di DOM

#### Scenario: Galat validasi dari server
- **WHEN** server membalas `422 {"errors": {"kontak": "…"}}`
- **THEN** pesan tersebut tampil di bawah field `kontak` dan fokus pindah ke sana

#### Scenario: Jaringan gagal
- **WHEN** `fetch` melempar galat
- **THEN** pesan galat umum tampil dengan `role="alert"`, tombol kembali aktif, dan isian pengguna tidak hilang

### Requirement: UTM dan asal halaman
Form SHALL membaca `utm_source`, `utm_medium`, `utm_campaign` dari query string saat halaman dimuat, serta `page_url` (URL saat ini tanpa fragmen) dan `document.referrer`, dan menyertakannya dalam payload. Nilai yang tidak ada dikirim sebagai string kosong.

#### Scenario: Kunjungan dari kampanye
- **WHEN** halaman dibuka dengan `?utm_source=instagram&utm_medium=bio&utm_campaign=launch` dan form dikirim
- **THEN** payload memuat ketiga nilai tersebut dan `page_url` berisi URL halaman

### Requirement: Turnstile opsional
Bila `NEXT_PUBLIC_TURNSTILE_SITE_KEY` dikonfigurasi, form SHALL memuat widget Cloudflare Turnstile secara malas (lazy) setelah interaksi pertama pengguna dengan form dan menyertakan `turnstile_token`. Bila tidak dikonfigurasi, form MUST tetap berfungsi dan mengirim `turnstile_token` kosong.

#### Scenario: Tanpa kunci Turnstile
- **WHEN** variabel site key kosong
- **THEN** tidak ada skrip `challenges.cloudflare.com` dimuat dan pengiriman berhasil

### Requirement: Form tetap bisa dipakai tanpa JavaScript lanjut
Form MUST berupa elemen `<form method="post" action="/api/leads">` dengan `novalidate` sehingga pengiriman tetap sampai ke server bila hidrasi gagal, dan server membalas halaman/teks yang dapat dibaca.

#### Scenario: Hidrasi belum selesai
- **WHEN** pengguna mengirim form sebelum JavaScript aktif
- **THEN** browser mengirim POST ke `/api/leads` dan menerima respons terbaca, bukan galat 405
