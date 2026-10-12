// Naskah bahasa Indonesia. Setara dengan 03-landing-page/content/landing-copy.json dari paket handoff,
// ditambah teks privasi, not-found, dan pengalih bahasa. Berkas ini menjadi sumber tipe `Dictionary`;
// content/en.ts harus memiliki kunci yang sama persis. Komponen tidak memuat naskah literal.

export const id = {
  locale: "id",
  meta: {
    title: "Fawz Tech | Solusi Perangkat Lunak Custom & Strategis",
    description:
      "Fawz Tech mengembangkan solusi perangkat lunak custom: Web, Mobile, Desktop, dan UI/UX yang dirancang khusus untuk mengoptimalkan operasional bisnis Anda.",
    ogImage: "/og-image-1200x630.png",
    ogLocale: "id_ID",
    orgDescription: "Software house spesialis aplikasi custom: Web, Mobile, Desktop, UI/UX.",
  },
  skipLink: "Lewati ke konten",
  header: {
    logoAria: "Fawz Tech, kembali ke atas",
    navAria: "Navigasi Utama",
    menuOpen: "Buka menu",
    menuClose: "Tutup menu",
  },
  switcher: {
    /** Ganti {lang} dengan nama bahasa tujuan. */
    switchTo: "Ubah bahasa ke {lang}",
    labelId: "Bahasa Indonesia",
    labelEn: "English",
  },
  nav: [
    { label: "Layanan", href: "#layanan" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    // Tautan #portofolio otomatis disembunyikan bila belum ada klien yang mengizinkan (lib/site.ts).
    { label: "Portofolio", href: "#portofolio" },
    { label: "Kontak", href: "#kontak" },
  ],
  navCta: { label: "Konsultasi Sekarang", href: "#kontak" },
  hero: {
    eyebrow: "Software House · Solusi Custom",
    h1: "Solusi Perangkat Lunak Tepat Guna, Dikembangkan Secara Kolaboratif.",
    sub: "Pengembangan Web, Mobile, dan Desktop yang dirancang berdasarkan alur kerja spesifik bisnis Anda, bukan sekadar menggunakan template.",
    ctaPrimary: { label: "Diskusikan Ide Anda", href: "#kontak" },
    ctaSecondary: { label: "Pelajari Cara Kami Bekerja", href: "#cara-kerja" },
    strip: "Web · Mobile · Desktop · UI/UX",
  },
  problem: {
    eyebrow: "Tantangan Operasional",
    h2: "Setiap Bisnis Memiliki Keunikan, Namun Solusi Umum Seringkali Membatasi.",
    points: [
      { title: "Operasional yang Terhambat Keterbatasan Aplikasi", text: "Perangkat lunak siap pakai seringkali gagal beradaptasi dengan alur kerja spesifik perusahaan Anda." },
      {
        title: "Sulitnya Menemukan Mitra Teknologi yang Relevan",
        text: "Membangun tim IT internal membutuhkan biaya besar, sementara ketergantungan pada tenaga lepas membawa risiko kontinuitas.",
      },
      { title: "Fragmentasi Data di Berbagai Platform", text: "Informasi operasional yang tersebar di spreadsheet dan percakapan chat menciptakan risiko inefisiensi yang tinggi." },
    ],
    closing:
      "Fawz Tech hadir untuk menjembatani celah tersebut: kami mempelajari proses bisnis Anda secara mendalam sebelum mentransformasikannya ke dalam sistem yang handal.",
  },
  services: {
    eyebrow: "Layanan Kami",
    h2: "Solusi yang Kami Hadirkan",
    items: [
      {
        name: "Web",
        text: "Aplikasi web dan dasbor operasional yang dioptimalkan untuk efisiensi alur kerja bisnis Anda.",
        image: "/illustrations/hero-dashboard.svg",
        width: 960,
        height: 640,
      },
      {
        name: "Mobile",
        text: "Solusi Android dan iOS yang dirancang untuk kemudahan akses bagi pelanggan maupun tim lapangan.",
        image: "/illustrations/app-mobile.svg",
        width: 420,
        height: 760,
      },
      {
        name: "Desktop",
        text: "Aplikasi lintas platform (Windows, macOS, Linux) untuk menunjang produktivitas dengan performa maksimal.",
        image: "/illustrations/app-desktop.svg",
        width: 960,
        height: 624,
      },
      {
        name: "UI/UX",
        text: "Riset pengguna dan perancangan prototipe yang divalidasi sebelum tahap pengembangan dimulai.",
        image: "/illustrations/uiux-wireframe-to-design.svg",
        width: 960,
        height: 640,
      },
    ],
  },
  process: {
    eyebrow: "Metodologi",
    h2: "Transformasi Visi Menjadi Solusi Digital yang Berdampak",
    steps: [
      {
        n: "01",
        name: "Discovery",
        text: "Kami mempelajari alur kerja Anda untuk menetapkan tujuan, ruang lingkup, serta estimasi yang akurat.",
        image: "/illustrations/process-1-discovery.svg",
      },
      {
        n: "02",
        name: "Design",
        text: "Penyusunan wireframe dan prototipe interaktif yang dapat Anda uji sebelum proses pengodean.",
        image: "/illustrations/process-2-design.svg",
      },
      {
        n: "03",
        name: "Build",
        text: "Pengembangan bertahap dengan demonstrasi rutin untuk memastikan progres berjalan sesuai harapan.",
        image: "/illustrations/process-3-build.svg",
      },
      {
        n: "04",
        name: "Launch & Support",
        text: "Rilis sistem yang terencana, pelatihan tim, serta dukungan berkelanjutan pasca-implementasi.",
        image: "/illustrations/process-4-launch.svg",
      },
    ],
  },
  about: {
    eyebrow: "Siapa Kami",
    h2: "Fawz Tech Berdiri Sejak 2022.",
    text: "Kami melihat aplikasi yang tersedia di pasaran sering kali tidak benar-benar memahami bisnis Anda. Kami percaya setiap bisnis berhak mendapatkan perlakuan yang khusus.",
    /** Slogan pendiri; di deck tertulis "Bisnis Anda, Cara Anda". */
    slogan: "Bisnis Anda, Cara Anda.",
    image: "/illustrations/team-meeting.svg",
    stats: [
      { big: "2022", label: "tahun kami memulai" },
      { big: "Fawz", label: "kemenangan, keberhasilan" },
    ],
  },
  vision: {
    eyebrow: "Visi",
    h2: "Setiap Bisnis Memiliki Sistem yang Benar-Benar Sesuai dengan Cara Kerjanya.",
    text: "Kami ingin menjadi mitra teknologi yang pertama dipanggil saat bisnis membutuhkan sistem baru.",
  },
  mission: {
    eyebrow: "Misi",
    h2: "Empat Janji Kami.",
    items: [
      { n: "01", title: "Mendengarkan Terlebih Dahulu", text: "Memahami proses Anda sebelum menulis kode.", image: "/illustrations/mission-1-listen.svg" },
      { n: "02", title: "Membangun Bersama", text: "Anda ikut merancang dan melihat demo secara rutin.", image: "/illustrations/mission-2-together.svg" },
      { n: "03", title: "Membuat yang Benar-Benar Dipakai", text: "Sederhana, cepat, dan digunakan setiap hari.", image: "/illustrations/mission-3-used.svg" },
      { n: "04", title: "Merawat Setelah Rilis", text: "Pelatihan dan dukungan berkelanjutan.", image: "/illustrations/mission-4-care.svg" },
    ],
  },
  values: {
    eyebrow: "Nilai Kami",
    h2: "Lima Nilai Kami.",
    items: [
      { title: "Bersama", text: "Klien ikut merancang." },
      { title: "Pas", text: "Mengikuti proses Anda." },
      { title: "Jelas", text: "Harga dan jadwal terbuka." },
      { title: "Tuntas", text: "Tetap hadir setelah peluncuran." },
      { title: "Jujur", text: "Berani mengatakan tidak perlu." },
    ],
  },
  catalogue: {
    eyebrow: "Katalog",
    h2: "Titik Awal yang Dapat Anda Pilih.",
    sub: "Setiap modul disesuaikan dengan proses bisnis Anda.",
    items: [
      { name: "Finance Accounting", text: "Pembukuan dan laporan keuangan." },
      { name: "Preventive & Corrective Maintenance", text: "Jadwal perawatan dan tiket perbaikan." },
      { name: "Security Web & Mobile Apps", text: "Pengamanan aplikasi web dan mobile." },
      { name: "E-commerce", text: "Toko online dengan pembayaran." },
      { name: "Smart Building & Smart Housing System", text: "Kontrol dan monitoring gedung dan hunian." },
      { name: "School & University System", text: "Akademik, siswa, dan administrasi." },
      { name: "Sistem Kasir dan Stok", text: "Dapat berjalan offline." },
      { name: "Absensi dan HR", text: "Pengajuan cuti tanpa kertas." },
    ],
  },
  // Tayang hanya untuk klien yang slug-nya ada di NEXT_PUBLIC_PORTFOLIO_CLIENTS (izin klien). Tanpa angka hasil.
  portfolio: {
    eyebrow: "Portofolio",
    h2: "Sebagian Pekerjaan Kami.",
    items: [
      { slug: "arfindo-bersinar", client: "Arfindo Bersinar", title: "Quality Management System", type: "Web \u00b7 Mobile" },
      { slug: "menya-sakura", client: "Menya Sakura", title: "Aplikasi Loyalty Customer", type: "Mobile" },
      { slug: "museum-nasional", client: "Museum Nasional Indonesia", title: "Aplikasi Showcase Artefak", type: "Desktop" },
      { slug: "kkara", client: "KKARA", title: "Aplikasi Manajemen Koperasi", type: "Web" },
    ],
    caseStudy: {
      slug: "arfindo-bersinar",
      eyebrow: "Studi Kasus",
      title: "Arfindo Bersinar: Quality Management System",
      image: "/portfolio/arfindo-qms-dashboard-blurred.jpg",
      imageAlt: "Tampilan dashboard Arfindo QMS: menu operasional, ringkasan PO, dan daftar pekerjaan",
      caption: "Dashboard Arfindo QMS",
      blocks: [
        { label: "Tantangan", text: "Alur bisnis berjalan sepenuhnya manual. Dibutuhkan sistem yang membuat setiap proses terkontrol." },
        {
          label: "Yang Kami Bangun",
          text: "Sistem manajemen mutu: daftar PO (barang, service, kalibrasi), pekerjaan per orang, daftar masalah, tiket komplain, data master, dan hak akses per peran.",
        },
        { label: "Hasil", text: "Proses yang dahulu manual kini berjalan dalam satu sistem: tercatat, memiliki penanggung jawab, dan terpantau melalui dashboard." },
      ],
    },
  },
  engage: {
    eyebrow: "Cara Bekerja Sama",
    h2: "Tiga Cara Memulai.",
    items: [
      { n: "A", title: "Proyek Terdefinisi", text: "Harga dan jadwal ditetapkan setelah discovery.", image: "/illustrations/engage-1-project.svg" },
      { n: "B", title: "Tim Bulanan", text: "Kapasitas per bulan dengan prioritas yang disepakati bersama.", image: "/illustrations/engage-2-monthly-team.svg" },
      { n: "C", title: "Perawatan", text: "Perbaikan dan pembaruan untuk sistem yang sudah berjalan.", image: "/illustrations/engage-3-support.svg" },
    ],
  },
  contact: {
    eyebrow: "Hubungi Kami",
    h2: "Mari Diskusikan Visi Anda.",
    sub: "Sampaikan kebutuhan Anda melalui pesan singkat, dan mari kita mulai dengan sesi diskusi strategis.",
    /** Label tombol WhatsApp melayang (pojok kanan bawah). */
    whatsappFloatLabel: "Chat lewat WhatsApp",
    whatsappLabel: "Hubungi melalui WhatsApp",
    whatsappPrefill: "Halo Fawz Tech, saya ingin berdiskusi tentang aplikasi untuk bisnis saya.",
    form: {
      submit: "Kirim Permintaan",
      submitting: "Mengirim…",
      labels: {
        nama: "Nama Lengkap",
        kontak: "WhatsApp atau Email",
        bisnis: "Nama Perusahaan",
        bisnisOptional: "(opsional)",
        kebutuhan: "Layanan yang Dibutuhkan",
        cerita: "Deskripsikan Kebutuhan Anda",
        ceritaHint: "Sampaikan poin-poin utama, seperti proses operasional yang ingin Anda optimalkan.",
        setujuBefore: "Saya setuju bahwa data saya akan digunakan untuk keperluan komunikasi sesuai dengan ",
        setujuLink: "Kebijakan Privasi",
        setujuAfter: ".",
      },
      needs: [
        { value: "web", label: "Web" },
        { value: "mobile", label: "Mobile" },
        { value: "desktop", label: "Desktop" },
        { value: "uiux", label: "UI/UX" },
        { value: "belum", label: "Belum ditentukan" },
      ],
      /** Ganti {X} dengan janji waktu balas dari konfigurasi. */
      success: "Terima kasih. Kami akan menghubungi Anda kembali dalam {X} hari kerja.",
      /** Ganti {n} dengan sisa karakter. */
      remaining: "Tersisa {n} karakter.",
      honeypotLabel: "Jangan diisi",
      openWhatsApp: "Buka WhatsApp",
    },
  },
  footer: {
    privacyLabel: "Kebijakan Privasi",
    copyright: "Fawz Tech",
  },
  privacy: {
    metaTitle: "Kebijakan Privasi",
    metaDescription: "Informasi mengenai pengumpulan, penggunaan, dan penyimpanan data yang Anda kirimkan melalui situs ini.",
    eyebrow: "Kebijakan Privasi",
    h1: "Kebijakan Privasi Fawz Tech",
    /** Ganti {date} dengan tanggal versi terformat. */
    version: "Versi {date}.",
    /** Token: {name}, {address}, {months}, {email}. */
    sections: [
      {
        h2: "Pengendali Data",
        blocks: [{ p: "{name}, yang beralamat di {address}, bertindak sebagai pengendali data atas informasi yang Anda kirimkan melalui situs ini." }],
      },
      {
        h2: "Informasi yang Kami Kumpulkan",
        blocks: [
          { p: "Saat Anda mengisi formulir \u201cDiskusikan Ide Anda\u201d, kami mengumpulkan:" },
          {
            ul: [
              "Nama lengkap;",
              "Nomor WhatsApp atau alamat email;",
              "Nama perusahaan atau bisnis (jika dicantumkan);",
              "Jenis layanan yang dipilih dan deskripsi kebutuhan yang Anda berikan;",
              "Halaman asal, parameter kampanye (UTM), dan alamat perujuk;",
              "Waktu persetujuan dan versi kebijakan privasi yang disetujui.",
            ],
          },
          { p: "Kami hanya meminta informasi yang diperlukan untuk menindaklanjuti permintaan Anda." },
        ],
      },
      {
        h2: "Tujuan Penggunaan Data",
        blocks: [
          {
            p: "Data digunakan untuk menghubungi Anda, memahami kebutuhan operasional Anda, serta menindaklanjuti permintaan konsultasi atau estimasi biaya. Kami berkomitmen untuk tidak menjual data Anda atau menggunakannya untuk keperluan iklan pihak ketiga.",
          },
        ],
      },
      {
        h2: "Dasar Hukum Pemrosesan",
        blocks: [
          {
            p: "Pemrosesan data dilakukan berdasarkan persetujuan yang Anda berikan melalui kotak centang pada formulir. Anda berhak menarik kembali persetujuan tersebut kapan saja tanpa memengaruhi keabsahan pemrosesan yang telah dilakukan sebelumnya.",
          },
        ],
      },
      {
        h2: "Masa Penyimpanan Data",
        blocks: [
          {
            p: "Data dari calon klien yang tidak berlanjut ke tahap kerja sama akan disimpan maksimal {months} bulan setelah komunikasi terakhir, sebelum dianonymkan. Data klien akan disimpan selama masa kerja sama berlangsung dan sesuai dengan kewajiban administrasi serta perpajakan yang berlaku.",
          },
        ],
      },
      {
        h2: "Hak-Hak Anda",
        blocks: [
          {
            ul: [
              "Mengakses dan meminta salinan data Anda;",
              "Memperbaiki data yang tidak akurat;",
              "Meminta penghapusan atau anonimisasi data;",
              "Menarik kembali persetujuan pemrosesan data.",
            ],
          },
        ],
      },
      {
        h2: "Prosedur Pengajuan Permintaan",
        blocks: [
          {
            p: "Anda dapat mengirimkan permintaan melalui email ke {email}. Kami akan merespons dalam jangka waktu yang wajar dan berhak meminta verifikasi identitas sebelum memproses permintaan tersebut.",
          },
        ],
      },
      {
        h2: "Pihak Ketiga dalam Pemrosesan Data",
        blocks: [
          {
            ul: [
              "Penyedia layanan hosting yang mengoperasikan situs dan sistem internal kami;",
              "Cloudflare Turnstile untuk perlindungan terhadap spam (jika diaktifkan);",
              "Layanan analitik tanpa cookie untuk pengumpulan statistik kunjungan agregat (jika diaktifkan).",
            ],
          },
          { p: "Pihak-pihak tersebut hanya memproses data berdasarkan instruksi ketat dari kami." },
        ],
      },
      {
        h2: "Perubahan Kebijakan",
        blocks: [
          {
            p: "Apabila terdapat perubahan pada kebijakan ini, tanggal versi di atas akan diperbarui. Versi kebijakan yang Anda setujui saat mengirimkan formulir akan tetap tercatat bersama data Anda.",
          },
        ],
      },
    ],
  },
  notFound: {
    metaTitle: "Halaman Tidak Ditemukan",
    h1: "Halaman Tidak Ditemukan",
    text: "Alamat yang Anda tuju tidak tersedia atau telah dipindahkan.",
    homeId: "Kembali ke Beranda",
    homeEn: "Go to the English homepage",
  },
} as const;

/** Lebarkan literal `as const` menjadi string/number agar content/en.ts bisa `satisfies Dictionary`. */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof id>;
