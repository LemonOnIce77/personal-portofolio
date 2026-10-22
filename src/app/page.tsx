import Link from "next/link";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

const portfolioData = {
  name: "Muhammad Yaumil Aditya Warman",
  role: "Information Systems Student & Tech Enthusiast",
  bio: "Mahasiswa Sistem Informasi yang antusias dalam web development, perancangan sistem, dan eksplorasi teknologi modern. Senang membangun solusi digital yang fungsional dan terstruktur.",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:adityawarman.emil@gmail.com",
  },
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Laravel",
    "Tailwind CSS",
    "Prisma",
    "Docker",
    "Git",
    "Figma",
  ],
  projects: [
    {
      title: "Mentora",
      description: "Platform peer-tutoring dan pertukaran keahlian antar mahasiswa berbasis web yang interaktif.",
      tags: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS"],
      github: "https://github.com",
    },
    {
      title: "ParkiRek",
      description: "Sistem informasi manajemen parkir digital terintegrasi untuk efisiensi mobilitas kampus.",
      tags: ["Laravel", "PHP", "Bootstrap", "MySQL"],
      github: "https://github.com",
    },
    {
      title: "Cashless Payment Case Study",
      description: "Riset analisis proses bisnis integrasi payment gateway digital untuk optimasi alur transaksi.",
      tags: ["Business Analysis", "Figma", "Process Flow"],
      link: "https://notion.so",
    },
  ] as Project[],
};

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function CodeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function Home() {
  const { name, role, bio, socials, skills, projects } = portfolioData;

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-neutral-950 text-neutral-100 ${bodyFont.className}`}>
      
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/70 border-b border-neutral-800/80">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className={`${headingFont.className} font-bold text-neutral-100 hover:text-white transition`}>
            emil<span className="text-neutral-500">.dev</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-neutral-400">
            <Link href="#about" className="hover:text-neutral-100 transition duration-200">Tentang</Link>
            <Link href="#projects" className="hover:text-neutral-100 transition duration-200">Proyek</Link>
            <Link href="#skills" className="hover:text-neutral-100 transition duration-200">Skills</Link>
            <Link href="#contact" className="hover:text-neutral-100 transition duration-200">Kontak</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-24">
        {/* Hero Section */}
        <section id="about" className="pt-8 animate-fade-in opacity-0">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for collaborations
            </span>
            <h1 className={`${headingFont.className} text-4xl sm:text-5xl font-bold tracking-tight text-neutral-100`}>
              Halo, aku {name}.
            </h1>
            <p className="text-xl text-neutral-400 font-medium">{role}</p>
            <p className="text-neutral-300 max-w-2xl leading-relaxed text-base pt-2">
              {bio}
            </p>

            <div className="flex gap-4 pt-4">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-600 hover:-translate-y-0.5 transition duration-200"
                aria-label="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-600 hover:-translate-y-0.5 transition duration-200"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={socials.email}
                className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-600 hover:-translate-y-0.5 transition duration-200"
                aria-label="Email"
              >
                <MailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="space-y-6 animate-fade-in opacity-0 delay-100">
          <div>
            <h2 className={`${headingFont.className} text-2xl font-bold tracking-tight`}>Featured Projects</h2>
            <p className="text-neutral-400 text-sm mt-1">
              Beberapa proyek dan eksplorasi yang pernah saya kembangkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project: Project, index: number) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80 hover:-translate-y-1 transition duration-200 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className={`${headingFont.className} font-bold text-lg text-neutral-100 group-hover:text-white transition`}>
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition">
                          <CodeIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition">
                          <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-md bg-neutral-800/60 text-neutral-300 border border-neutral-800 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="space-y-6 animate-fade-in opacity-0 delay-200">
          <div>
            <h2 className={`${headingFont.className} text-2xl font-bold tracking-tight`}>Skills & Tech Stack</h2>
            <p className="text-neutral-400 text-sm mt-1">Teknologi dan tools yang sering saya gunakan.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill: string) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm hover:border-neutral-700 hover:scale-105 transition duration-200 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 border-t border-neutral-900 text-center space-y-4 animate-fade-in opacity-0 delay-300">
          <h2 className={`${headingFont.className} text-2xl font-bold tracking-tight`}>Ayo Terhubung</h2>
          <p className="text-neutral-400 max-w-md mx-auto text-sm">
            Tertarik untuk berdiskusi seputar teknologi, project ideas, atau sekadar bertukar sapa?
          </p>
          <div>
            <a
              href={socials.email}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-100 text-neutral-950 font-semibold text-sm hover:bg-neutral-200 hover:scale-105 transition duration-200"
            >
              <MailIcon className="w-4 h-4" /> Kirim Pesan
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {name}. Built with Next.js & Tailwind CSS.
      </footer>
    </div>
  );
} 