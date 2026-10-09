## ADDED Requirements

### Requirement: Kamus bertipe per locale
Naskah SHALL disimpan di `content/id.ts` (sumber tipe `Dictionary`) dan `content/en.ts` yang dideklarasikan `satisfies Dictionary`, sehingga kunci yang hilang atau berlebih di `en` gagal pada `tsc`. `getDictionary(locale)` SHALL mengembalikan kamus yang sesuai. Komponen MUST NOT memuat string antarmuka secara literal di luar kamus.

#### Scenario: Kunci hilang
- **WHEN** satu kunci dihapus dari `content/en.ts`
- **THEN** `npx tsc --noEmit` gagal dengan galat tipe

#### Scenario: Kelengkapan kamus
- **WHEN** uji `lib/i18n/dictionary.test.ts` dijalankan
- **THEN** himpunan kunci daun `en` sama dengan `id`, tidak ada nilai string kosong, dan `contact.form.success` di keduanya memuat `{X}`

### Requirement: Cakupan terjemahan Inggris
Versi `en` SHALL menerjemahkan seluruh naskah: navigasi dan tombol header, hero (tagline resmi "The right system for your business, built together."), masalah, layanan, cara kerja, kontak, seluruh label/teks bantu/pesan form, footer (label "Privacy policy"), halaman privasi, halaman not-found, metadata (title "Fawz Tech | Custom Software House", description "Fawz Tech builds custom software with you: Web, Mobile, Desktop, and UI/UX. The right system for your business. Tell us your idea."), pesan WhatsApp terisi ("Hello Fawz Tech, I'd like to discuss an app for my business."), dan pesan sukses ("Thank you. We'll get back to you within {X} business days.").

#### Scenario: Tidak ada teks Indonesia di halaman Inggris
- **WHEN** `/en` dan `/en/privacy` dirender
- **THEN** teks yang tampak tidak memuat kata "Ceritakan", "Kirim", "Kebijakan privasi", "Wajib diisi", atau "Layanan"

#### Scenario: Urutan dan nama layanan
- **WHEN** seksi Layanan `/en` dibaca
- **THEN** judul blok berurutan "Web", "Mobile", "Desktop", "UI/UX"

#### Scenario: Pesan WhatsApp Inggris
- **WHEN** tombol WhatsApp di `/en` diperiksa dengan nomor terkonfigurasi
- **THEN** `href` memuat teks Inggris yang di-encode, bukan teks Indonesia

### Requirement: Suara dan gaya bahasa Inggris
Teks Inggris SHALL memakai "we" untuk Fawz Tech dan "you/your" untuk klien, kalimat pendek dan aktif, sentence case pada judul, tanpa klaim atau angka yang tidak ada di versi Indonesia, dan tanpa frasa yang dilarang panduan desain ("best solution", "revolutionary", "one-stop solution"). Nama "Fawz Tech" ditulis dua kata.

#### Scenario: Frasa terlarang
- **WHEN** `content/en.ts` dicari untuk "best solution", "revolutionary", "one-stop", "FawzTech", "FAWZ TECH"
- **THEN** tidak ada kecocokan

### Requirement: Pesan validasi dan status dalam dua bahasa
`lib/leads/messages.ts` SHALL menyediakan `MESSAGES_ID` (identik dengan pesan saat ini) dan `MESSAGES_EN` dengan kunci yang sama: `required` "This field is required", `contact` "Enter a valid Indonesian WhatsApp number (08… or +62…) or email address", `storyMax` "Maximum 1,000 characters", `needs` "Unknown option", `consent` "Please tick the consent box to continue", `tooLong` "Too long", `turnstile` "Verification failed. Reload the page and try again.", `badBody` "Unrecognised request format.", `tooMany` "Too many attempts. Please try again in a few minutes.", `forwardFailed` "Sending failed. Try again or contact us on WhatsApp.", `notConfigured` "The form is not active yet. Contact us on WhatsApp."

#### Scenario: Kunci pesan identik
- **WHEN** kunci `MESSAGES_EN` dibandingkan dengan `MESSAGES_ID`
- **THEN** himpunannya sama persis

### Requirement: Format tanggal per locale
`formatDate(iso, locale)` SHALL menghasilkan "9 Oktober 2026" untuk `id` dan "9 October 2026" untuk `en`.

#### Scenario: Tanggal versi privasi
- **WHEN** `/privasi` dan `/en/privacy` dirender dengan `PRIVACY_POLICY_VERSION` "2026-10-09"
- **THEN** masing-masing menampilkan "9 Oktober 2026" dan "9 October 2026"
