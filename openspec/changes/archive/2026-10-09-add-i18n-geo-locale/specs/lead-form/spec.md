## MODIFIED Requirements

### Requirement: Validasi sisi klien
Form SHALL memvalidasi sebelum mengirim dengan aturan yang sama dengan server (`lib/leads/schema.ts`): `nama`, `kontak`, `cerita`, dan `setuju` wajib; `kontak` harus nomor WhatsApp Indonesia (`08…`, `+62…`, `62…`, 9–15 digit setelah normalisasi) atau email valid. Pesan galat diambil dari kamus pesan locale aktif (`MESSAGES_ID` atau `MESSAGES_EN`). Galat MUST ditampilkan per field di bawah input dengan kata ("Wajib diisi"/"This field is required" atau pesan format kontak), warna `danger`, `aria-invalid="true"`, dan `aria-describedby` ke pesan galat. Fokus MUST pindah ke field pertama yang galat.

#### Scenario: Kirim kosong
- **WHEN** pengguna menekan "Kirim cerita" tanpa mengisi apa pun di `/`
- **THEN** `nama`, `kontak`, `cerita`, dan `setuju` menampilkan "Wajib diisi", tidak ada permintaan jaringan, dan fokus berada di `nama`

#### Scenario: Kirim kosong berbahasa Inggris
- **WHEN** pengguna menekan "Send your story" tanpa mengisi apa pun di `/en`
- **THEN** field wajib menampilkan "This field is required" dan `setuju` menampilkan "Please tick the consent box to continue"

#### Scenario: Kontak tidak valid
- **WHEN** `kontak` diisi "halo" dan form dikirim
- **THEN** pesan "Isi nomor WhatsApp (08… atau +62…) atau email yang valid" tampil di bawah `kontak` dan tidak ada permintaan jaringan

#### Scenario: Kontak valid dalam berbagai bentuk
- **WHEN** `kontak` diisi "0812-3456-789", "+62 812 3456 789", atau "budi@contoh.id"
- **THEN** validasi klien lolos

### Requirement: Pengiriman dan status
Form SHALL mengirim `POST /api/leads` dengan JSON sesuai kontrak `internal-app.md` (`nama`, `kontak`, `bisnis`, `kebutuhan`, `cerita`, `setuju`, `website`, `turnstile_token`, `utm_source`, `utm_medium`, `utm_campaign`, `page_url`, `referrer`) ditambah `privacy_version` dan `locale` (`"id"` atau `"en"`). Selama mengirim, tombol MUST nonaktif dan berlabel "Mengirim…"/"Sending…". Saat `201`, form MUST diganti pesan sukses dari kamus ("Terima kasih. Kami akan menghubungimu dalam <X> hari kerja." / "Thank you. We'll get back to you within <X> business days.") dengan `role="status"`. Saat `422`, pesan per field dari respons MUST ditampilkan. Saat `429`, pesan `tooMany` dari kamus. Saat galat lain atau jaringan putus, pesan `forwardFailed` dari kamus ditampilkan dan data isian MUST tetap ada.

#### Scenario: Sukses
- **WHEN** server membalas `201`
- **THEN** pesan sukses tampil menggantikan form, dibacakan pembaca layar, dan tidak ada data isian yang tersisa di DOM

#### Scenario: Payload memuat locale
- **WHEN** form di `/en` dikirim
- **THEN** body JSON memuat `"locale": "en"`

#### Scenario: Galat validasi dari server
- **WHEN** server membalas `422 {"errors": {"kontak": "…"}}`
- **THEN** pesan tersebut tampil di bawah field `kontak` dan fokus pindah ke sana

#### Scenario: Jaringan gagal
- **WHEN** `fetch` melempar galat
- **THEN** pesan galat umum tampil dengan `role="alert"`, tombol kembali aktif, dan isian pengguna tidak hilang
