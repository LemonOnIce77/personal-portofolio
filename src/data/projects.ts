export interface ProjectItem {
  id: string;
  title: string;
  category: "Web App" | "Business Systems" | "Data & AI" | "Mobile";
  role: string;
  period: string;
  featured: boolean;
  order: number;
  problem: string;
  solution: string;
  impactMetrics: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: "jasawarga-platform",
    title: "Jasawarga - Civic Services & Neighborhood Management Platform",
    category: "Business Systems",
    role: "Full-Stack Developer & Systems Analyst",
    period: "2026 (Ongoing)",
    featured: true,
    order: 1,
    problem:
      "Pengelolaan administrasi kependudukan tingkat RT/RW dan pengajuan layanan surat warga masih didominasi pencatatan manual dan birokrasi luring, menimbulkan inefisiensi arsip serta keterlambatan validasi dokumen perizinan.",
    solution:
      "Mengembangkan platform layanan tata kelola warga terpadu berbasis cloud dengan otomatisasi verifikasi pengajuan surat, pelaporan insiden lingkungan, dan transparansi iuran kas secara real-time.",
    impactMetrics: [
      "Tahap pengembangan arsitektur sistem inti dan database schema",
      "Otomatisasi alur permohonan surat warga digital end-to-end",
      "Penerapan sistem audit kas lingkungan transparan berbasis RLS",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    githubUrl: "https://github.com/LemonOnIce77",
    liveUrl: "https://github.com/LemonOnIce77",
  },
  {
    id: "rakit-stem-platform",
    title: "RAKIT STEM Learning Management & Operations Kit",
    category: "Business Systems",
    role: "Chief Operating Officer & Lead Systems Analyst",
    period: "2026",
    featured: true,
    order: 2,
    problem:
      "Distribusi kit edukasi robotika dan materi ajar STEM lintas sekolah mitra sering terhambat oleh pencatatan inventaris manual dan ketidaksiapan modul ajar interaktif bagi instruktur.",
    solution:
      "Merancang alur operasional perakitan terintegrasi dan modul platform digital yang memfasilitasi pelacakan kit fisik, modul kurikulum langkah demi langkah, dan evaluasi hasil belajar siswa secara real-time.",
    impactMetrics: [
      "Mempersingkat siklus penyiapan kit hingga 40%",
      "Diinkubasi resmi pada Telkom University Incubation Batch 24",
      "Diadopsi pada pilot project edukasi teknologi praktis",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    githubUrl: "https://github.com/LemonOnIce77",
    liveUrl: "https://github.com/LemonOnIce77",
  },
  {
    id: "charmera-commerce",
    title: "Charmera Digital Photobooth & Custom Charm Experience",
    category: "Web App",
    role: "Chief Marketing Officer & Product Strategist",
    period: "2026",
    featured: true,
    order: 3,
    problem:
      "Tingginya antusiasme audiens muda terhadap photostrip fisik dan italian charms custom sering kali terhambat proses pemesanan manual via DM media sosial yang lambat dan rentan salah catat.",
    solution:
      "Membangun funnel digital terpadu yang memadukan katalog interaktif, live charm preview, dan integrasi pemesanan booth otomatis saat event luring berlangsung.",
    impactMetrics: [
      "Meningkatkan conversion rate pemesanan event hingga 3x lipat",
      "Mengurangi durasi rekap pesanan kustom menjadi hitungan menit",
      "Memperluas jangkauan aktivasi brand di segmen mahasiswa",
    ],
    techStack: ["React", "Next.js", "Tailwind CSS", "Supabase", "Figma"],
    githubUrl: "https://github.com/LemonOnIce77",
    liveUrl: "https://github.com/LemonOnIce77",
  },
  {
    id: "prep-tracker-doc-clinic",
    title: "Collaborative Student Prep Tracker & Document Clinic",
    category: "Web App",
    role: "Full-Stack Developer & Software Architect",
    period: "2026",
    featured: true,
    order: 4,
    problem:
      "Mahasiswa tingkat akhir kesulitan melacak revisi berkas administratif dan persiapan sidang secara berkesinambungan akibat umpan balik dosen penguji yang tersebar di berbagai kanal.",
    solution:
      "Membangun aplikasi manajemen dokumen kolaboratif berbasis Next.js dan Supabase dengan audit trail status revisi, sinkronisasi tenggat waktu, dan formulir bedah dokumen terpadu.",
    impactMetrics: [
      "Mereduksi miskomunikasi riwayat revisi berkas akademik hingga 65%",
      "Lolos uji fungsional software engineering coursework",
      "Mendukung otentikasi peran multi-user berbasis RLS Supabase",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    githubUrl: "https://github.com/LemonOnIce77",
    liveUrl: "https://github.com/LemonOnIce77",
  },
  {
    id: "felicity-event-systems",
    title: "Felicity 4.0 Art Exhibition Management Platform",
    category: "Business Systems",
    role: "Head of Events & Operations Coordinator",
    period: "2026",
    featured: false,
    order: 5,
    problem:
      "Manajemen panggung dan koordinasi rundown multi-divisi pada perhelatan seni bertema Ancient Rome rentan terhadap delay jadwal akibat sirkulasi informasi rundown cetak yang statis.",
    solution:
      "Merancang protokol sistem koordinasi alur waktu digital dengan integrasi pembaruan jadwal live untuk stage crew, pengisi acara, dan tim ticketing.",
    impactMetrics: [
      "Mengurangi tingkat keterlambatan jadwal panggung menjadi 0%",
      "Mengordinasikan alur ratusan artis dan pengisi acara",
      "Mencapai kepuasan audiens ribuan pengunjung pameran",
    ],
    techStack: ["Next.js", "Tailwind CSS", "Notion API", "TypeScript"],
    githubUrl: "https://github.com/LemonOnIce77",
    liveUrl: "https://github.com/LemonOnIce77",
  },
  {
    id: "bi-sales-pipeline-analytics",
    title: "Enterprise Revenue Pipeline & Sales BI Dashboard",
    category: "Data & AI",
    role: "Business Analyst & Data Engineer",
    period: "2025 - 2026",
    featured: false,
    order: 6,
    problem:
      "Tim manajemen bisnis kesulitan mengidentifikasi titik kebocoran pada sales funnel dan memproyeksikan target pendapatan bulanan karena data transaksi masih terisolasi di spreadsheet.",
    solution:
      "Membangun pipeline visualisasi metrik performa operasional dan tren konversi penjualan dengan pembersihan data Python serta integrasi dashboard analitik interaktif.",
    impactMetrics: [
      "Menyediakan insight performa mingguan secara otomatis",
      "Mempercepat waktu agregasi laporan keuangan operasional hingga 80%",
      "Membantu identifikasi segmen pelanggan bernilai tinggi",
    ],
    techStack: ["Python", "Pandas", "PostgreSQL", "PowerBI", "Laravel"],
    githubUrl: "https://github.com/LemonOnIce77",
    liveUrl: "https://github.com/LemonOnIce77",
  },
  {
    id: "hmsi-academic-portal",
    title: "HMSI Student Resource & Event Accreditation Hub",
    category: "Business Systems",
    role: "Internal Operations Staff",
    period: "2025",
    featured: false,
    order: 7,
    problem:
      "Penyebaran informasi program kerja akademik himpunan dan modul pembelajaran sering terkubur di grup obrolan instan tanpa repositori yang terorganisir.",
    solution:
      "Mengembangkan direktori repositori materi terpusat, papan pengumuman kegiatan, dan formulir pendaftaran acara himpunan mahasiswa Sistem Informasi.",
    impactMetrics: [
      "Digunakan aktif oleh ratusan mahasiswa aktif Sistem Informasi",
      "Meningkatkan partisipasi kegiatan himpunan sebesar 35%",
    ],
    techStack: ["PHP", "Laravel", "Tailwind CSS", "MySQL"],
    githubUrl: "https://github.com/LemonOnIce77",
    liveUrl: "https://github.com/LemonOnIce77",
  },
];