## ADDED Requirements

### Requirement: Halaman kebijakan privasi
Sistem SHALL menyediakan halaman `/privasi` berbahasa Indonesia dengan title "Kebijakan privasi | Fawz Tech", header dan footer yang sama dengan halaman utama, dan isi minimum: siapa pengendali data (Fawz Tech, Bintaro Sektor 2), data yang dikumpulkan dari form (nama, kontak, nama bisnis, kebutuhan, cerita, UTM, halaman asal, waktu persetujuan), tujuan (menghubungi dan menindaklanjuti permintaan), dasar persetujuan, masa simpan (24 bulan untuk prospek yang tidak berlanjut, lalu dianonimkan), hak pemilik data (akses, koreksi, hapus, tarik persetujuan), cara mengajukan permintaan penghapusan lewat email kontak, pihak ketiga yang memproses (penyedia hosting, Cloudflare Turnstile bila aktif, alat analitik bila aktif), dan tanggal versi kebijakan.

#### Scenario: Konten minimum ada
- **WHEN** halaman `/privasi` dirender
- **THEN** semua bagian di atas ada sebagai `h2` dan tanggal versi ditampilkan dalam format "9 Oktober 2026"

#### Scenario: Email kontak dari konfigurasi
- **WHEN** email kontak dikonfigurasi
- **THEN** bagian permintaan penghapusan menampilkan tautan `mailto:`; bila masih placeholder, teks placeholder ditampilkan apa adanya

### Requirement: Versi kebijakan dikirim bersama prospek
Konstanta versi kebijakan (`PRIVACY_POLICY_VERSION`, format tanggal ISO) SHALL dipakai oleh halaman ini dan disertakan dalam payload prospek sebagai `privacy_version` sehingga sistem internal dapat menyimpan versi yang disetujui.

#### Scenario: Payload memuat versi
- **WHEN** form prospek dikirim
- **THEN** payload ke `/api/leads` dan ke hulu memuat `privacy_version` yang sama dengan tanggal versi di halaman `/privasi`

### Requirement: Penanda tinjauan hukum
Berkas sumber halaman MUST memuat komentar yang menyatakan teks belum ditinjau penasihat hukum, dan halaman MUST NOT menampilkan penanda itu kepada pengunjung.

#### Scenario: Tidak ada placeholder terlihat
- **WHEN** halaman `/privasi` dirender
- **THEN** tidak ada teks "[tinjau]", "TODO", atau "lorem" yang tampak
