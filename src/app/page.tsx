import Link from "next/link";
import Image from "next/image";
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
  role: "Information Systems Student & Business Tech Enthusiast",
  bio: "An Information Systems student passionate about web development, system design, and exploring modern technology. I enjoy building digital solutions that are functional and well structured.",
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
      description: "An interactive web platform for peer tutoring and skill sharing among university students.",
      tags: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS"],
      github: "https://github.com",
    },
    {
      title: "ParkiRek",
      description: "An integrated digital parking management system designed to improve campus mobility.",
      tags: ["Laravel", "PHP", "Bootstrap", "MySQL"],
      github: "https://github.com",
    },
    {
      title: "Cashless Payment Case Study",
      description: "A business process analysis of digital payment gateway integration to streamline transactions.",
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
    <div className={`relative isolate min-h-screen flex flex-col justify-between bg-[#070709] text-neutral-100 overflow-hidden ${bodyFont.className}`}>
      
      {/* Softly shifting color with a fine polka-dot texture */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 background-aurora" />
        <div className="aurora-orb aurora-orb-purple" />
        <div className="aurora-orb aurora-orb-red" />
        <div className="aurora-orb aurora-orb-orange" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.32) 0.7px, transparent 0.9px)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 px-1 sm:px-2 pt-3 pb-2">
        <div className="liquid-glass max-w-6xl mx-auto pl-0.5 pr-6 sm:pl-1 sm:pr-8 h-20 rounded-2xl flex items-center justify-between">
          <Link href="/" className={`${headingFont.className} text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-100 hover:text-white transition`}>
            Emil<span className="text-purple-400">Aditya</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium text-neutral-400">
            <Link href="#about" className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white transition duration-200">About</Link>
            <Link href="#projects" className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white transition duration-200">Project</Link>
            <Link href="#skills" className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white transition duration-200">Skills</Link>
            <Link href="#contact" className="px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-400/10 hover:text-white transition duration-200">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-24">
        {/* Hero Section (Centered with Photo) */}
        <section id="about" className="pt-8 text-center flex flex-col items-center animate-fade-in opacity-0">
          <div className="flex flex-col items-center gap-5 max-w-2xl">
            {/* Foto Profil dengan Ring Glow Ungu */}
            <div className="relative group mb-3">
              {/* Aura Glow di belakang foto */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-500 opacity-75 blur-lg group-hover:opacity-100 transition duration-500 animate-pulse" />
              
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-purple-300/80 bg-neutral-900 shadow-[0_0_22px_rgba(168,85,247,0.45)]">
                <Image
                  src="/Portofolio PFP.jpg"
                  alt={name}
                  fill
                  sizes="160px"
                  priority
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Badge Status */}
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for collaborations
            </span>

            {/* Title / Glowing Name */}
            <h1 className={`${headingFont.className} text-4xl sm:text-5xl font-bold tracking-tight text-neutral-100 leading-tight`}>
              Hello, I&apos;m{" "}
              <span className="relative inline-block bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-300 bg-clip-text text-transparent [text-shadow:0_0_25px_rgba(168,85,247,0.45)]">
                {name}
              </span>
            </h1>

            {/* Role & Bio */}
            <p className="text-xl text-neutral-400 font-medium">{role}</p>
            <p className="text-neutral-300 leading-relaxed text-base">
              {bio}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-600 hover:-translate-y-0.5 transition duration-200"
                aria-label="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-600 hover:-translate-y-0.5 transition duration-200"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={socials.email}
                className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-600 hover:-translate-y-0.5 transition duration-200"
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
              A selection of projects and experiments I&apos;ve worked on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project: Project, index: number) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-neutral-800/80 bg-neutral-900/30 hover:border-purple-500/50 hover:bg-neutral-900/60 hover:-translate-y-1 transition duration-200 flex flex-col justify-between group shadow-sm backdrop-blur-sm"
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
            <p className="text-neutral-400 text-sm mt-1">Technologies and tools I use regularly.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill: string) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-sm hover:border-purple-500/40 hover:scale-105 transition duration-200 cursor-default backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="dynamic-stroke relative py-16 text-center space-y-6 animate-fade-in opacity-0 delay-300">
          <h2 className={`${headingFont.className} text-3xl sm:text-4xl font-bold tracking-tight`}>Let's Connect</h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-base leading-relaxed">
            Interested in discussing technology, project ideas, or just saying hello?
          </p>
          <div>
            <a
              href={socials.email}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-neutral-100 text-neutral-950 font-semibold text-base hover:bg-neutral-200 hover:scale-105 transition duration-200 shadow-lg shadow-purple-900/20"
            >
              <MailIcon className="w-5 h-5" /> Send a Message
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-900/80 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {name}. Built with Next.js & Tailwind CSS.
      </footer>
    </div>
  );
}
