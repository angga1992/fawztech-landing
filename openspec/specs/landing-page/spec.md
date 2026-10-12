# landing-page

## Purpose

Struktur, isi, dan perilaku tiap seksi landing page Fawz Tech sesuai LANDING-BRIEF (pembaruan Oktober 2026): header, hero, siapa kami, masalah, visi, misi, nilai, layanan, cara kerja, katalog, portofolio + studi kasus (bergerbang izin klien), cara bekerja sama, kontak, footer. Testimoni dan Tim tidak ada.

## Requirements

### Requirement: Struktur halaman
Landing page SHALL berupa satu halaman `/` dengan urutan seksi: header sticky, Hero (`#atas`), Siapa kami (`#tentang`), Masalah (`#masalah`), Visi (`#visi`), Misi (`#misi`), Nilai (`#nilai`), Layanan (`#layanan`), Cara kerja (`#cara-kerja`), Katalog (`#katalog`), Portofolio (`#portofolio`, hanya bila ada klien yang diizinkan), Cara bekerja sama (`#kerja-sama`), Ajakan dan form (`#kontak`), footer. Halaman MUST memakai landmark `header`, `main`, `footer`, tautan lompat "Lewati ke konten" sebagai elemen fokus pertama, tepat satu `<h1>`, dan `<h2>` per seksi. Seksi testimoni dan tim MUST NOT dirender.

#### Scenario: Urutan dan landmark
- **WHEN** DOM halaman `/` diperiksa
- **THEN** elemen `header`, `main#utama`, dan `footer` ada; `main` memuat seksi dengan id `atas`, `tentang`, `masalah`, `visi`, `misi`, `nilai`, `layanan`, `cara-kerja`, `katalog`, (`portofolio`), `kerja-sama`, `kontak` dalam urutan itu; tidak ada seksi testimoni atau tim

### Requirement: Portofolio bergerbang izin klien
Seksi `#portofolio` SHALL merender kartu klien hanya untuk slug yang ada di `NEXT_PUBLIC_PORTFOLIO_CLIENTS` (`arfindo-bersinar`, `menya-sakura`, `museum-nasional`, `kkara`, atau `all`). Bila tidak ada slug yang diizinkan, seksi dan tautan nav "Portofolio" MUST NOT dirender. Studi kasus Arfindo (gambar `portfolio/arfindo-qms-dashboard-blurred.jpg` dengan `alt` deskriptif, `width`/`height`, dimuat lazy; tiga blok Tantangan, Yang kami bangun, Hasil tanpa angka) tayang hanya bila `arfindo-bersinar` diizinkan. Berkas `-original` MUST NOT ada di `public/`.

#### Scenario: Tanpa izin
- **WHEN** `NEXT_PUBLIC_PORTFOLIO_CLIENTS` kosong
- **THEN** tidak ada elemen `#portofolio` dan tidak ada tautan nav ke `#portofolio`

#### Scenario: Sebagian izin
- **WHEN** `NEXT_PUBLIC_PORTFOLIO_CLIENTS=menya-sakura,kkara`
- **THEN** hanya dua kartu itu tampil dan blok studi kasus Arfindo tidak dirender

#### Scenario: Tautan lompat
- **WHEN** pengguna menekan Tab pertama kali di halaman
- **THEN** tautan "Lewati ke konten" muncul dan mengaktifkannya memindahkan fokus ke `main`

#### Scenario: Konten Nexvoid hilang
- **WHEN** kode sumber dan `public/` dicari untuk string "Nexvoid", "nexvoid", daftar klien lama, atau kutipan testimoni lama
- **THEN** tidak ada kecocokan

### Requirement: Header
Header SHALL sticky di atas dengan latar `surface` dan garis bawah `line` 1px, berisi logo (tinggi 32px, tautan ke beranda locale aktif), tautan navigasi dari kamus, pengalih bahasa berupa toggle bendera (lihat spec `locale-routing`), dan tombol utama "Konsultasi Sekarang"/"Start a Consultation" ke seksi kontak. Teks diambil dari kamus locale aktif. Tata letak desktop (logo, tautan, tombol utama, toggle paling kanan) berlaku pada viewport ≥ 1024px. Di bawah 1024px baris header MUST hanya memuat logo, tombol utama satu baris (`white-space: nowrap`), dan tombol menu 44×44px yang tidak menyusut; tautan navigasi, toggle bendera beserta label bahasa, dan tombol utama MUST berada di panel menu yang dibuka tombol dengan `aria-expanded`/`aria-controls`, menutup saat tautan dipilih atau Escape. Di bawah 640px logo MUST berupa tanda F saja (`fawz-tech-mark.svg`) agar baris muat di 360px tanpa gulir horizontal.

#### Scenario: Desktop
- **WHEN** lebar viewport ≥ 1024px
- **THEN** logo, tautan navigasi, tombol utama, dan toggle bendera tampak dalam satu baris tanpa tombol menu dan tanpa gulir horizontal

#### Scenario: Mobile 360px
- **WHEN** lebar viewport 360px
- **THEN** baris header memuat tanda F, tombol utama satu baris, dan tombol menu 44×44px; `document.documentElement.scrollWidth` sama dengan lebar viewport

#### Scenario: Menu mobile
- **WHEN** lebar viewport < 1024px dan tombol menu diaktifkan
- **THEN** `aria-expanded` menjadi `true`, panel menampilkan tautan navigasi (tinggi baris ≥ 44px), toggle bendera dengan label bahasa aktif, dan tombol utama; mengaktifkan tautan atau menekan Escape menutup panel

#### Scenario: Header berbahasa Inggris
- **WHEN** `/en` dirender
- **THEN** tautan header dan tombol utama memakai teks kamus Inggris, dan toggle menandai bendera Inggris sebagai aktif

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
Seksi SHALL berlatar `surface` (Cara kerja yang berlatar `surface-sunken`) dengan eyebrow "LAYANAN", H2 "Apa yang kami bangun", dan empat blok berurutan tetap Web, Mobile, Desktop, UI/UX dengan warna: Web `navy-700` teks putih, Mobile `amber-500` teks `navy-900`, Desktop `teal-600` teks putih, UI/UX putih bergaris `line` teks `ink`. Di ≥ 768px blok disusun bento 12 kolom (7/5 lalu 5/7); di mobile satu kolom. Setiap blok memuat ilustrasi sesuai naskah dengan `alt=""`.

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

### Requirement: Perilaku gulir dan animasi
Tautan anchor SHALL menggulir halus dengan `scroll-padding-top` setinggi header sticky. Animasi SHALL terbatas pada pudar-masuk ≤ 250ms saat seksi masuk viewport, dinonaktifkan pada `prefers-reduced-motion`. Halaman MUST NOT memakai parallax, carousel otomatis, atau pop-up, dan MUST NOT bergantung pada pustaka animasi.

#### Scenario: Offset header
- **WHEN** pengguna mengklik "Layanan" di header
- **THEN** H2 seksi Layanan tampak penuh di bawah header, tidak tertutup

#### Scenario: Tanpa framer-motion
- **WHEN** `package.json` diperiksa
- **THEN** `framer-motion` tidak ada di dependensi

### Requirement: Naskah dari satu sumber
Semua teks seksi SHALL berasal dari kamus per locale (`content/id.ts`, `content/en.ts`) yang isinya setara `landing-copy.json` untuk `id`, diakses lewat `getDictionary(locale)`, sehingga perubahan naskah tidak memerlukan penyuntingan komponen dan kedua bahasa memiliki struktur kunci yang sama.

#### Scenario: Mengubah naskah
- **WHEN** teks H2 seksi Layanan diubah di `content/id.ts`
- **THEN** halaman `/` menampilkan teks baru tanpa perubahan pada komponen, dan `/en` tidak berubah

#### Scenario: Komponen tanpa string literal
- **WHEN** `app/components/**/*.tsx` dicari untuk teks "Ceritakan", "Layanan", "Services"
- **THEN** tidak ada kecocokan di luar komentar
