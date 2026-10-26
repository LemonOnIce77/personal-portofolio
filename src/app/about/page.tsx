import Link from "next/link";

export const metadata = {
  title: "About",
  description: "Latar belakang, rekam jejak, dan riwayat akademis Aditya Warman.",
};

const experiences = [
  {
    role: "Chief Operating Officer",
    organization: "RAKIT (STEM Educational Kit)",
    period: "Agu 2026 – Sep 2026",
    type: "Inkubasi Bisnis",
    description:
      "Memimpin perancangan operasional produk kit edukasi STEM dalam program Telkom University Incubation Batch 24, menyelaraskan alur perakitan perangkat keras, dan memvalidasi model produk ke pengguna.",
  },
  {
    role: "Chief Marketing Officer",
    organization: "Charmera",
    period: "Okt 2026 – Sekarang",
    type: "Student Venture",
    description:
      "Menyusun strategi pemasaran digital dan branding untuk produk aksesoris kustom, mengelola aktivasi kampanye media sosial, dan merancang pengalaman photobooth interaktif.",
  },
  {
    role: "Head of Events (Koor Acara)",
    organization: "Felicity 4.0 - Telkom Art",
    period: "Jul 2026 – Okt 2026",
    type: "Organisasi Kampus",
    description:
      "Mengorkestrasi perhelatan pameran seni tahunan Dies Natalis Telkom Art bertema Ancient Rome, mengarahkan jalannya rundown lintas divisi, dan mengelola manajemen panggung.",
  },
  {
    role: "Staff Magang Departemen PMDB",
    organization: "Himpunan Mahasiswa Sistem Informasi",
    period: "2025",
    type: "Organisasi Mahasiswa",
    description:
      "Terlibat aktif dalam development softskills, perencanaan program kerja himpunan, koordinasi delegasi mahasiswa, dan fasilitasi kegiatan akademik serta sosial di lingkup program studi.",
  },
];

const academics = [
  {
    institution: "Telkom University",
    degree: "S1 Sistem Informasi (Undergraduate)",
    period: "2024 – 2028 (Expected)",
    highlights:
      "Fokus kajian pada Analisis & Perancangan Sistem, Rekayasa Perangkat Lunak, Arsitektur Basis Data, dan Pengembangan Produk Digital.",
  },
  {
    institution: "SMA 3 Taruna Angkasa Jawa Timur",
    degree: "Pendidikan Sekolah Menengah Atas (IPA)",
    period: "2021 – 2024",
    highlights:
      "Fokus Softskill pada Kepemimpinan, Manajemen waktu, dan Kedisplinan.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 selection:bg-purple-900/40 selection:text-white overflow-hidden">
      {/* 1. Ambient Glow Efek (Top Center & Right Accent) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/2 translate-x-1/2 w-[760px] h-[520px] bg-purple-600/20 blur-[150px] rounded-full -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-32 w-[500px] h-[500px] bg-sky-500/15 blur-[140px] rounded-full -z-10"
      />

      {/* 2. Dynamic Grid Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#26262615_1px,transparent_1px),linear-gradient(to_bottom,#26262615_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] -z-10"
      />

      {/* Main Container */}
      <main className="px-6 py-20 sm:py-28 max-w-3xl mx-auto space-y-24 animate-fade-in relative">
        {/* Top Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base sm:text-lg font-mono text-neutral-400 hover:text-white transition duration-200 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Header Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 text-sm sm:text-base font-mono rounded-full border border-neutral-800/70 bg-neutral-900/40 backdrop-blur-md text-neutral-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Biography & Academic Background</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            About Me
          </h1>

          <p className="text-xl sm:text-2xl text-neutral-200 leading-relaxed font-normal">
            Menjembatani analisis bisnis, arsitektur sistem informasi, dan pengembangan produk digital modern.
          </p>
        </section>

        {/* Narrative Section */}
        <section className="space-y-6 text-lg sm:text-xl text-neutral-300 leading-relaxed border-t border-neutral-900/80 pt-12">
          <p>
            Saya adalah mahasiswa Sistem Informasi yang mendalami persimpangan antara bisnis, produk digital, dan rekayasa perangkat lunak. Fokus utama saya adalah memahami alur kebutuhan pengguna serta menerjemahkannya ke dalam solusi arsitektur perangkat lunak yang terstruktur, efisien, dan bernilai nyata.
          </p>
          <p>
            Selain menulis kode dengan arsitektur yang bersih, saya aktif mengambil peran dalam manajemen operasional, pemasaran ventura digital, serta kepemimpinan acara berskala besar untuk terus mengasah kemampuan eksekusi dan komunikasi lintas fungsi.
          </p>
        </section>

        {/* Experience Section */}
        <section className="space-y-12 border-t border-neutral-900/80 pt-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Experience & Leadership
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 mt-2">
              Rekam jejak kepemimpinan, dan keterlibatan organisasi.
            </p>
          </div>

          <div className="relative border-l border-neutral-800/80 ml-2 space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="relative pl-7 sm:pl-9 group">
                <div className="absolute -left-[6px] top-2.5 w-3 h-3 rounded-full bg-neutral-700 border-2 border-neutral-950 group-hover:bg-purple-400 group-hover:shadow-[0_0_14px_rgba(192,132,252,0.8)] transition duration-200" />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-purple-300 transition duration-200">
                    {exp.role}
                  </h3>
                  <span className="text-sm font-mono text-neutral-400">
                    {exp.period}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-3.5">
                  <span className="text-base sm:text-lg text-neutral-200 font-medium">
                    {exp.organization}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs sm:text-sm font-mono px-3 py-1 rounded-md bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 text-neutral-300">
                    {exp.type}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Academics Section */}
        <section className="space-y-10 border-t border-neutral-900/80 pt-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Past Academics & Education
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 mt-2">
              Latar belakang pendidikan formal dan bidang kajian utama.
            </p>
          </div>

          <div className="relative border-l border-neutral-800/80 ml-2 space-y-10">
            {academics.map((edu, index) => (
              <div key={index} className="relative pl-7 sm:pl-9 group">
                <div className="absolute -left-[6px] top-2.5 w-3 h-3 rounded-full bg-neutral-700 border-2 border-neutral-950 group-hover:bg-sky-400 group-hover:shadow-[0_0_14px_rgba(56,189,248,0.8)] transition duration-200" />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-sky-300 transition duration-200">
                    {edu.institution}
                  </h3>
                  <span className="text-sm font-mono text-neutral-400">
                    {edu.period}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-neutral-200 font-medium mb-2.5">
                  {edu.degree}
                </p>

                <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
                  {edu.highlights}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Curated Toolkit Section */}
        <section className="space-y-8 border-t border-neutral-900/80 pt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Tools & Technologies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm sm:text-base font-mono">
            <div className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/20 backdrop-blur-md hover:border-purple-500/40 hover:bg-neutral-900/40 transition duration-200">
              <span className="text-neutral-100 font-bold block mb-3 text-base sm:text-lg">
                Development & Data
              </span>
              <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL, PHP/Laravel, Python.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/20 backdrop-blur-md hover:border-sky-500/40 hover:bg-neutral-900/40 transition duration-200">
              <span className="text-neutral-100 font-bold block mb-3 text-base sm:text-lg">
                Workflow & Infrastructure
              </span>
              <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                Git/GitHub, Docker, REST APIs, Postman, Linux, VS Code, Notion.
              </p>
            </div>
          </div>
        </section>

        {/* Beyond the Screen */}
        <section className="space-y-4 border-t border-neutral-900/80 pt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Beyond the Screen
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Di luar eksplorasi kode dan analisis sistem, saya mengeksplorasi musik, mendengarkan rilisan musik dengan kualitas tinggi, serta menjaga keseimbangan melalui aktivitas lari santai dan kegiatan alam bebas.
          </p>
        </section>
      </main>
    </div>
  );
}