## ADDED Requirements

### Requirement: Struktur halaman
Landing page SHALL berupa satu halaman `/` dengan urutan seksi: header sticky, Hero (`#atas`), Masalah (`#masalah`), Layanan (`#layanan`), Cara kerja (`#cara-kerja`), Ajakan dan form (`#kontak`), footer. Halaman MUST memakai landmark `header`, `main`, `footer`, tautan lompat "Lewati ke konten" sebagai elemen fokus pertama, tepat satu `<h1>`, dan `<h2>` per seksi. Seksi portofolio dan testimoni (`#cerita`) MUST NOT dirender.

#### Scenario: Urutan dan landmark
- **WHEN** DOM halaman `/` diperiksa
- **THEN** elemen `header`, `main#utama`, dan `footer` ada; `main` memuat seksi dengan id `atas`, `masalah`, `layanan`, `cara-kerja`, `kontak` dalam urutan itu; tidak ada elemen dengan id `cerita`

#### Scenario: Tautan lompat
- **WHEN** pengguna menekan Tab pertama kali di halaman
- **THEN** tautan "Lewati ke konten" muncul dan mengaktifkannya memindahkan fokus ke `main`

#### Scenario: Konten Nexvoid hilang
- **WHEN** kode sumber dan `public/` dicari untuk string "Nexvoid", "nexvoid", daftar klien lama, atau kutipan testimoni lama
- **THEN** tidak ada kecocokan

### Requirement: Header
Header SHALL sticky di atas dengan latar `surface` dan garis bawah `line` 1px, berisi logo (tinggi 32–36px, tautan ke `#atas`), tautan "Layanan" (`#layanan`) dan "Cara kerja" (`#cara-kerja`), serta tombol utama "Mulai konsultasi" (`#kontak`). Di viewport < 768px tautan masuk ke menu yang dibuka tombol dengan `aria-expanded`, sementara logo dan tombol utama tetap tampak.

#### Scenario: Desktop
- **WHEN** lebar viewport ≥ 768px
- **THEN** logo, dua tautan, dan tombol utama tampak dalam satu baris tanpa tombol menu

#### Scenario: Mobile
- **WHEN** lebar viewport < 768px dan tombol menu diaktifkan
- **THEN** `aria-expanded` menjadi `true`, daftar tautan muncul, dan tautan dapat diaktifkan dengan keyboard; mengaktifkan tautan menutup menu

### Requirement: Hero
Hero SHALL berlatar `navy-900` dengan eyebrow "SOFTWARE HOUSE · APLIKASI CUSTOM" (amber), H1 "Sistem yang pas untuk bisnismu, dibangun bersama.", sub "Web, Mobile, Desktop, dan UI/UX yang dirancang dari cara kerja bisnismu, bukan template.", tombol amber "Ceritakan idemu" (`#kontak`), tombol ghost "Lihat cara kami bekerja" (`#cara-kerja`), ilustrasi `hero-dashboard.svg` dengan `app-mobile.svg` menumpuk di kanan bawah, dan baris `code` "Web · Mobile · Desktop · UI/UX". Desktop dua kolom (teks kiri, gambar kanan); mobile teks dulu lalu gambar lebar penuh.

#### Scenario: Naskah hero
- **WHEN** hero dirender
- **THEN** teks H1, sub, label tombol, dan strip persis sama dengan `landing-copy.json`

#### Scenario: Ilustrasi hero tanpa permintaan tambahan
- **WHEN** HTML hero diperiksa
- **THEN** `hero-dashboard.svg` ditanam inline sebagai `<svg aria-hidden="true">` dengan `viewBox` (tanpa permintaan jaringan terpisah), dan `app-mobile.svg` berupa `img` dengan `width`, `height`, dan `alt=""`

### Requirement: Seksi Masalah
Seksi SHALL menampilkan eyebrow "MASALAH YANG KAMI LIHAT", H2 "Prosesnya unik. Softwarenya generik.", ilustrasi `problem-chaos.svg` di kiri, tiga poin di kanan dengan garis kiri tebal berwarna navy, teal, dan amber (bukan kartu), lalu blok penutup berlatar `navy-700` berisi kalimat penutup dari naskah dan `custom-fit.svg`.

#### Scenario: Tiga poin dengan garis warna
- **WHEN** seksi `#masalah` dirender
- **THEN** ada tepat tiga poin berjudul "Prosesmu mengikuti aplikasi", "Tidak ada developer yang paham bisnismu", "Data tercecer di spreadsheet dan chat", masing-masing dengan `border-left` 8px berwarna `navy-700`, `teal-600`, `amber-500` secara berurutan

### Requirement: Seksi Layanan
Seksi SHALL berlatar `surface-sunken` dengan eyebrow "LAYANAN", H2 "Apa yang kami bangun", dan empat blok berurutan tetap Web, Mobile, Desktop, UI/UX dengan warna: Web `navy-700` teks putih, Mobile `amber-500` teks `navy-900`, Desktop `teal-600` teks putih, UI/UX putih bergaris `line` teks `ink`. Di ≥ 768px blok disusun bento 12 kolom (7/5 lalu 5/7); di mobile satu kolom. Setiap blok memuat ilustrasi sesuai naskah dengan `alt=""`.

#### Scenario: Lebar blok tidak seragam
- **WHEN** seksi `#layanan` dirender pada lebar 1280px
- **THEN** blok Web dan UI/UX menempati 7 kolom, blok Mobile dan Desktop 5 kolom

#### Scenario: Urutan layanan
- **WHEN** judul blok dibaca berurutan dalam DOM
- **THEN** urutannya "Web", "Mobile", "Desktop", "UI/UX"

### Requirement: Seksi Cara kerja
Seksi SHALL menampilkan eyebrow "CARA KERJA", H2 "Dari ide ke aplikasi yang dipakai", dan daftar berurutan (`ol`) empat langkah Discovery, Desain, Build, Launch dan rawat, masing-masing dengan ilustrasi di atas, nomor `code` ("01"–"04"), judul `headline`, dan satu kalimat dari naskah. Di ≥ 1024px langkah disusun empat kolom sebagai tangga yang makin tinggi (langkah 2–4 terangkat 40/80/120px) dengan langkah terakhir beraksen amber; di mobile satu kolom tanpa tangga.

#### Scenario: Tangga di desktop
- **WHEN** seksi `#cara-kerja` dirender pada lebar 1280px
- **THEN** keempat langkah berada dalam satu baris dengan tepi bawah yang semakin tinggi dari kiri ke kanan

#### Scenario: Mobile
- **WHEN** seksi dirender pada lebar 360px
- **THEN** langkah bertumpuk satu kolom dengan urutan 01 sampai 04 tanpa offset vertikal

### Requirement: Seksi Ajakan dan form
Seksi `#kontak` SHALL berlatar `navy-900` dengan eyebrow "MARI MULAI", H2 "Ceritakan ide aplikasimu.", sub "Kirim pesan tentang kebutuhanmu, lalu kita mulai dari obrolan singkat.", tombol "Chat lewat WhatsApp", dan form prospek (lihat spec `lead-form`) di kolom kanan (desktop) atau di bawah (mobile).

#### Scenario: Tombol WhatsApp
- **WHEN** nomor WhatsApp dikonfigurasi dan tombol diklik
- **THEN** tautan membuka `https://wa.me/62…?text=` dengan teks "Halo Fawz Tech, saya ingin berdiskusi tentang aplikasi untuk bisnis saya." yang di-encode, di tab baru dengan `rel="noopener"`

#### Scenario: Nomor masih placeholder
- **WHEN** nomor WhatsApp belum dikonfigurasi
- **THEN** tombol WhatsApp tidak dirender dan tidak ada tautan ke `wa.me/62XXXXXXXXXX`

### Requirement: Footer
Footer SHALL berlatar `navy-900` dan memuat logo versi gelap, "Bintaro Sektor 2", email, telepon/WhatsApp, Instagram, LinkedIn, tautan "Kebijakan privasi" ke `/privasi`, dan "© <tahun berjalan> Fawz Tech". Nilai kontak diambil dari konfigurasi situs; bila masih placeholder, teks placeholder dalam kurung siku ditampilkan apa adanya tanpa tautan `mailto:`/`tel:`.

#### Scenario: Tahun otomatis
- **WHEN** footer dirender
- **THEN** teks hak cipta memuat tahun saat render, bukan "[Tahun]"

#### Scenario: Kontak terisi
- **WHEN** email dan nomor telepon dikonfigurasi
- **THEN** email menjadi tautan `mailto:` dan nomor menjadi tautan `tel:` atau `https://wa.me/`

### Requirement: Perilaku gulir dan animasi
Tautan anchor SHALL menggulir halus dengan `scroll-padding-top` setinggi header sticky. Animasi SHALL terbatas pada pudar-masuk ≤ 250ms saat seksi masuk viewport, dinonaktifkan pada `prefers-reduced-motion`. Halaman MUST NOT memakai parallax, carousel otomatis, atau pop-up, dan MUST NOT bergantung pada pustaka animasi.

#### Scenario: Offset header
- **WHEN** pengguna mengklik "Layanan" di header
- **THEN** H2 seksi Layanan tampak penuh di bawah header, tidak tertutup

#### Scenario: Tanpa framer-motion
- **WHEN** `package.json` diperiksa
- **THEN** `framer-motion` tidak ada di dependensi

### Requirement: Naskah dari satu sumber
Semua teks seksi SHALL berasal dari satu modul naskah (`content/landing.ts`) yang isinya setara `landing-copy.json`, sehingga perubahan naskah tidak memerlukan penyuntingan komponen.

#### Scenario: Mengubah naskah
- **WHEN** teks H2 seksi Layanan diubah di modul naskah
- **THEN** halaman menampilkan teks baru tanpa perubahan pada komponen
