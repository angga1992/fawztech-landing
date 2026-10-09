## MODIFIED Requirements

### Requirement: Header
Header SHALL sticky di atas dengan latar `surface` dan garis bawah `line` 1px, berisi logo (tinggi 32–36px, tautan ke beranda locale aktif dengan anchor `#atas`), tautan "Layanan"/"Services" (`#layanan`) dan "Cara kerja"/"How we work" (`#cara-kerja`), pengalih bahasa "ID | EN" (lihat spec `locale-routing`), serta tombol utama "Mulai konsultasi"/"Start a consultation" (`#kontak`). Teks diambil dari kamus locale aktif. Di viewport < 768px tautan masuk ke menu yang dibuka tombol dengan `aria-expanded`, sementara logo, pengalih bahasa, dan tombol utama tetap tampak.

#### Scenario: Desktop
- **WHEN** lebar viewport ≥ 768px
- **THEN** logo, dua tautan, pengalih bahasa, dan tombol utama tampak dalam satu baris tanpa tombol menu

#### Scenario: Mobile
- **WHEN** lebar viewport < 768px dan tombol menu diaktifkan
- **THEN** `aria-expanded` menjadi `true`, daftar tautan muncul, dan tautan dapat diaktifkan dengan keyboard; mengaktifkan tautan menutup menu

#### Scenario: Header berbahasa Inggris
- **WHEN** `/en` dirender
- **THEN** tautan header berbunyi "Services", "How we work", tombol "Start a consultation", dan pengalih menandai "EN" sebagai `aria-current="true"`

### Requirement: Seksi Ajakan dan form
Seksi `#kontak` SHALL berlatar `navy-900` dengan eyebrow "MARI MULAI"/"LET'S START", H2 "Ceritakan ide aplikasimu."/"Tell us about your app idea.", sub, tombol "Chat lewat WhatsApp"/"Chat on WhatsApp", dan form prospek (lihat spec `lead-form`) di kolom kanan (desktop) atau di bawah (mobile), semuanya dari kamus locale aktif.

#### Scenario: Tombol WhatsApp
- **WHEN** nomor WhatsApp dikonfigurasi dan tombol diklik di `/`
- **THEN** tautan membuka `https://wa.me/62…?text=` dengan teks "Halo Fawz Tech, saya ingin berdiskusi tentang aplikasi untuk bisnis saya." yang di-encode, di tab baru dengan `rel="noopener"`

#### Scenario: Tombol WhatsApp berbahasa Inggris
- **WHEN** nomor WhatsApp dikonfigurasi dan tombol diklik di `/en`
- **THEN** teks yang di-encode adalah "Hello Fawz Tech, I'd like to discuss an app for my business."

#### Scenario: Nomor masih placeholder
- **WHEN** nomor WhatsApp belum dikonfigurasi
- **THEN** tombol WhatsApp tidak dirender dan tidak ada tautan ke `wa.me/62XXXXXXXXXX`

### Requirement: Footer
Footer SHALL berlatar `navy-900` dan memuat logo versi gelap, "Bintaro Sektor 2", email, telepon/WhatsApp, Instagram, LinkedIn, tautan kebijakan privasi ("Kebijakan privasi" → `/privasi` di `id`; "Privacy policy" → `/en/privacy` di `en`), dan "© <tahun berjalan> Fawz Tech". Nilai kontak diambil dari konfigurasi situs; bila masih placeholder, teks placeholder dalam kurung siku ditampilkan apa adanya tanpa tautan `mailto:`/`tel:`.

#### Scenario: Tahun otomatis
- **WHEN** footer dirender
- **THEN** teks hak cipta memuat tahun saat render, bukan "[Tahun]"

#### Scenario: Kontak terisi
- **WHEN** email dan nomor telepon dikonfigurasi
- **THEN** email menjadi tautan `mailto:` dan nomor menjadi tautan `tel:` atau `https://wa.me/`

#### Scenario: Tautan privasi mengikuti locale
- **WHEN** footer `/en` dirender
- **THEN** tautan privasi berbunyi "Privacy policy" dan menuju `/en/privacy`

### Requirement: Naskah dari satu sumber
Semua teks seksi SHALL berasal dari kamus per locale (`content/id.ts`, `content/en.ts`) yang isinya setara `landing-copy.json` untuk `id`, diakses lewat `getDictionary(locale)`, sehingga perubahan naskah tidak memerlukan penyuntingan komponen dan kedua bahasa memiliki struktur kunci yang sama.

#### Scenario: Mengubah naskah
- **WHEN** teks H2 seksi Layanan diubah di `content/id.ts`
- **THEN** halaman `/` menampilkan teks baru tanpa perubahan pada komponen, dan `/en` tidak berubah

#### Scenario: Komponen tanpa string literal
- **WHEN** `app/components/**/*.tsx` dicari untuk teks "Ceritakan", "Layanan", "Services"
- **THEN** tidak ada kecocokan di luar komentar
