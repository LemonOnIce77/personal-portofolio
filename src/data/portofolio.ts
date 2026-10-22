export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

export const portfolioData = {
  name: "Muhammad Yaumil Aditya Warman",
  role: "Information Systems Student & Tech Enthusiast",
  bio: "Mahasiswa Sistem Informasi yang antusias dalam web development, perancangan sistem, dan eksplorasi teknologi modern. Senang membangun solusi digital yang fungsional dan terstruktur.",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:emailkamu@example.com",
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
      description: "Platform peer-tutoring dan pertukaran keahlian mahasiswa berbasis web yang interaktif.",
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
      description: "Riset analisis proses bisnis integrasi payment gateway digital untuk optimasi transaksi pengguna.",
      tags: ["Business Analysis", "Figma", "Process Flow"],
      link: "https://notion.so",
    },
  ] as Project[],
};