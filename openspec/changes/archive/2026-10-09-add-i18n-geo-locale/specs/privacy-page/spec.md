## MODIFIED Requirements

### Requirement: Halaman kebijakan privasi
Sistem SHALL menyediakan halaman kebijakan privasi dalam dua locale dengan isi yang setara: `/privasi` berbahasa Indonesia (title "Kebijakan privasi | Fawz Tech") dan `/en/privacy` berbahasa Inggris (title "Privacy policy | Fawz Tech"), keduanya dirender oleh satu komponen dari kamus locale, dengan header dan footer yang sama dengan halaman utama, dan isi minimum: siapa pengendali data (Fawz Tech, Bintaro Sektor 2), data yang dikumpulkan dari form (nama, kontak, nama bisnis, kebutuhan, cerita, UTM, halaman asal, waktu persetujuan), tujuan (menghubungi dan menindaklanjuti permintaan), dasar persetujuan, masa simpan (24 bulan untuk prospek yang tidak berlanjut, lalu dianonimkan), hak pemilik data (akses, koreksi, hapus, tarik persetujuan), cara mengajukan permintaan penghapusan lewat email kontak, pihak ketiga yang memproses (penyedia hosting, Cloudflare Turnstile bila aktif, alat analitik bila aktif), dan tanggal versi kebijakan yang diformat sesuai locale. `/en/privasi` dan `/privacy` MUST 404.

#### Scenario: Konten minimum ada
- **WHEN** halaman `/privasi` dirender
- **THEN** semua bagian di atas ada sebagai `h2` dan tanggal versi ditampilkan dalam format "9 Oktober 2026"

#### Scenario: Versi Inggris
- **WHEN** halaman `/en/privacy` dirender
- **THEN** jumlah `h2` sama dengan `/privasi`, teks berbahasa Inggris, dan tanggal versi "9 October 2026"

#### Scenario: Email kontak dari konfigurasi
- **WHEN** email kontak dikonfigurasi
- **THEN** bagian permintaan penghapusan menampilkan tautan `mailto:`; bila masih placeholder, teks placeholder ditampilkan apa adanya

#### Scenario: Path silang tidak ada
- **WHEN** `/en/privasi` atau `/privacy` diminta
- **THEN** respons 404
