"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { submitContactForm } from "./actions";
import { useRouter } from "next/navigation";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github?: string | null;
  link?: string | null;
}

const portfolioData = {
  name: "Muhammad Yaumil Aditya Warman",
  role: "Undergraduate Information Systems Student & Business Tech Enthusiast",
  bio: "An Information Systems student passionate about the intersection of business, product, and technology. Driven by curiosity and a continuous desire to learn, I’m constantly exploring how technology can be leveraged to solve real-world problems, create meaningful digital products, and deliver practical value. I strive to continuously develop my skills, broaden my perspective, and grow into a professional who bridges business needs with technological possibilities.",
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
};

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function CodeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default function Home() {
  const { name, role, bio, socials, skills } = portfolioData;
  const router = useRouter();

  // --- STATE DATA & ADMIN ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  // Modal Login Admin
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState("");

  // Modal Tambah / Edit Proyek
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    id: number;
    title: string;
    description: string;
    tags: string;
    github: string;
    link: string;
  } | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Form Kontak
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // --- FETCH DATA PROYEK ---
  // Ambil status saat web dimuat
  const loadSiteSettings = useCallback(async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("is_available")
      .eq("id", 1)
      .single();

    if (data !== null && data !== undefined) {
      setIsAvailable(data.is_available);
    }
  }, []);

  // Jalankan fungsi load di useEffect
  useEffect(() => {
    loadSiteSettings();
  }, [loadSiteSettings]);

  const handleToggleAvailability = async () => {
    // Cek apakah admin aktif
    if (!isAdmin) {
      alert(
        "Kamu belum login sebagai admin. Klik simbol © di footer untuk login.",
      );
      return;
    }

    if (isTogglingAvailability) return;

    const nextState = !isAvailable;
    setIsTogglingAvailability(true);

    // Update ke database
    const { error } = await supabase
      .from("site_settings")
      .update({
        is_available: nextState,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      alert("Gagal memperbarui status: " + error.message);
    } else {
      setIsAvailable(nextState);
    }

    setIsTogglingAvailability(false);
  };

  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data) {
      setProjects(
        data.map((project) => ({
          id: project.id,
          title: project.title ?? "",
          description: project.description ?? "",
          tags: Array.isArray(project.tags) ? project.tags : [],
          link: project.link ?? null,
          github: project.github ?? null,
        })),
      );
    }
    setIsLoadingProjects(false);
  }, []);

  // --- CEK SESI ADMIN & SUBSCRIPTION ---
  useEffect(() => {
    loadProjects();

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    }
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAdmin(!!session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadProjects]);

  // --- HANDLER LOGIN ADMIN ---
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoggingIn(true);
    setAdminLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      setAdminLoginError(error.message);
      setIsAdminLoggingIn(false);
      return;
    }

    setIsAdminLoggingIn(false);
    setIsAdminModalOpen(false);
    setAdminEmail("");
    setAdminPassword("");
  };

  // --- HANDLER LOGOUT ADMIN ---
  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  // --- HANDLER HAPUS PROYEK ---
  const handleDeleteProject = async (id: number, title: string) => {
    if (!confirm(`Hapus proyek "${title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      loadProjects();
    } else {
      alert("Gagal menghapus proyek: " + error.message);
    }
  };

  // --- HANDLER SIMPAN (TAMBAH / UPDATE) PROYEK ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsSavingProject(true);
    const isNew = !editingProject.id;
    const tagsArray = editingProject.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: editingProject.title,
      description: editingProject.description,
      tags: tagsArray,
      github: editingProject.github.trim() || null,
      link: editingProject.link.trim() || null,
    };

    const res = isNew
      ? await supabase.from("projects").insert([payload])
      : await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingProject.id);

    if (!res.error) {
      setIsProjectModalOpen(false);
      setEditingProject(null);
      await loadProjects();
    } else {
      alert("Gagal menyimpan proyek: " + res.error.message);
    }
    setIsSavingProject(false);
  };

  // --- HANDLER SUBMIT FORM KONTAK ---
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSubmitStatus("success");
        formElement.reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Terjadi kesalahan.");
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      setErrorMessage("Gagal terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative isolate min-h-screen flex flex-col justify-between bg-[#070709] text-neutral-100 overflow-x-hidden ${bodyFont.className}`}
    >
      {/* Background Aurora Effect */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 background-aurora" />
        <div className="aurora-orb aurora-orb-purple" />
        <div className="aurora-orb aurora-orb-red" />
        <div className="aurora-orb aurora-orb-orange" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.32) 0.7px, transparent 0.9px)",
            backgroundSize: "10px 10px",
          }}
        />
      </div>

      {/* FLOATING ADMIN TOOLBAR (Responsive: di mobile melayang di bawah layar agar tidak menutupi navbar, di desktop di pojok kanan atas) */}
      {isAdmin && (
        <aside
          aria-label="Admin Control Bar"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:bottom-auto sm:top-4 sm:right-4 z-50 flex items-center gap-2 sm:gap-2.5 bg-neutral-900/95 border border-purple-500/40 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-2xl animate-fade-in w-max max-w-[95vw]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-mono text-purple-300 font-medium whitespace-nowrap">
            Admin Mode
          </span>
          <button
            onClick={() => {
              setEditingProject({
                id: 0,
                title: "",
                description: "",
                tags: "",
                github: "",
                link: "",
              });
              setIsProjectModalOpen(true);
            }}
            className="text-[11px] sm:text-xs bg-purple-600 hover:bg-purple-500 text-white px-2.5 sm:px-3 py-1 rounded-full font-medium transition whitespace-nowrap"
          >
            + Proyek
          </button>
          <button
            onClick={handleAdminLogout}
            className="text-[11px] sm:text-xs text-neutral-400 hover:text-red-400 transition ml-1 whitespace-nowrap"
          >
            Logout
          </button>
        </aside>
      )}

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
        <div className="liquid-glass max-w-6xl mx-auto h-14 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-between px-4 sm:px-8 border border-white/5 shadow-lg">
          {/* Logo Personal Branding */}
          <Link
            href="/"
            className="hover:opacity-80 transition duration-200 flex items-center"
          >
            <Image
              src="/Logo Personal Branding.png"
              alt="Brand Logo"
              width={180}
              height={60}
              priority
              className="h-9 sm:h-16 w-auto object-contain"
            />
          </Link>

          {/* Navigasi */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base font-medium text-white">
            <Link
              href="#about"
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/[0.15] transition duration-200"
            >
              About
            </Link>
            <Link
              href="#projects"
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/[0.15] transition duration-200"
            >
              Projects
            </Link>
            <Link
              href="#skills"
              className="hidden sm:inline-block px-3 py-2 rounded-lg hover:bg-white/[0.15] transition duration-200"
            >
              Skills
            </Link>
            <Link
              href="#contact"
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white bg-purple-500/20 hover:bg-purple-500/40 transition duration-200"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex-1 w-full space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <section
          id="about"
          className="pt-4 sm:pt-8 text-center flex flex-col items-center animate-fade-in opacity-0"
        >
          <div className="flex flex-col items-center gap-4 sm:gap-5 max-w-3xl">
            {/* Foto Profil */}
            <div className="relative group mb-2 sm:mb-3">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-500 opacity-75 blur-lg group-hover:opacity-100 transition duration-500 animate-pulse" />

              <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-purple-300/80 bg-neutral-900 shadow-[0_0_22px_rgba(168,85,247,0.45)]">
                <Image
                  src="/Portofolio PFP.jpg"
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 112px, 160px"
                  priority
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Badge Status BARU (Switchable khusus Admin) */}
            <button
              type="button"
              onClick={handleToggleAvailability}
              disabled={!isAdmin || isTogglingAvailability}
              title={isAdmin ? "Klik untuk ganti status (Admin)" : ""}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 text-[11px] sm:text-xs font-mono rounded-full border transition duration-200 select-none ${
                isAvailable
                  ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300"
                  : "bg-neutral-900/80 border-neutral-800 text-neutral-400"
              } ${
                isAdmin
                  ? "cursor-pointer hover:border-purple-500 hover:scale-105 active:scale-95 ring-1 ring-purple-500/30"
                  : "cursor-default"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isAvailable
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-neutral-600"
                }`}
              />
              <span>
                {isAvailable
                  ? "Available for collaborations"
                  : "Currently focused on ongoing projects"}
              </span>
              {isAdmin && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-purple-900/60 text-purple-200 ml-1">
                  {isTogglingAvailability ? "..." : "switch"}
                </span>
              )}
            </button>

            {/* Title */}
            <h1
              className={`${headingFont.className} text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-100 leading-tight w-full`}
            >
              Hello, I&apos;m{" "}
              <span className="relative inline-block bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-300 bg-clip-text text-transparent [text-shadow:0_0_25px_rgba(168,85,247,0.45)] break-words">
                {name}
              </span>
            </h1>

            {/* Role & Bio */}
            <div className="space-y-3 sm:space-y-4 max-w-2xl px-2">
              <p className="text-base sm:text-xl text-neutral-200 font-semibold tracking-wide leading-snug">
                {role}
              </p>
              <p className="text-neutral-300 leading-relaxed text-xs sm:text-base font-medium">
                {bio}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row justify-center items-center gap-3 pt-2 w-full max-w-xs sm:max-w-none">
              <a
                href="#projects"
                className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-full bg-purple-600 text-white text-xs sm:text-sm font-semibold hover:bg-purple-500 hover:scale-105 transition duration-200 shadow-[0_0_20px_rgba(147,51,234,0.4)] text-center"
              >
                View Projects
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-full border border-neutral-600 bg-neutral-900/50 text-neutral-200 text-xs sm:text-sm font-semibold hover:border-neutral-300 hover:text-white hover:bg-neutral-800 hover:scale-105 transition duration-200 backdrop-blur-sm text-center"
              >
                Download CV
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 sm:p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-600 transition duration-200"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 sm:p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-600 transition duration-200"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href={socials.email}
                className="p-2 sm:p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-600 transition duration-200"
                aria-label="Email"
              >
                <MailIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          className="space-y-6 animate-fade-in opacity-0 delay-100"
        >
          <div>
            <h2
              className={`${headingFont.className} text-xl sm:text-2xl font-bold tracking-tight`}
            >
              Featured Projects
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              A selection of projects and experiments I&apos;ve worked on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingProjects ? (
              <p className="text-neutral-500 text-xs sm:text-sm italic col-span-full">
                Memuat proyek dari database...
              </p>
            ) : projects.length === 0 ? (
              <p className="text-neutral-500 text-xs sm:text-sm italic col-span-full">
                Belum ada proyek yang tersedia.
              </p>
            ) : (
              projects.map((project, index) => (
                <div
                  key={project.id || index}
                  className="relative p-5 sm:p-6 rounded-xl border border-neutral-800/80 bg-neutral-900/30 hover:border-purple-500/50 hover:bg-neutral-900/60 transition duration-200 flex flex-col justify-between group shadow-sm backdrop-blur-sm"
                >
                  {/* Action Buttons Khusus Admin (posisi disesuaikan agar tidak menabrak judul di mobile) */}
                  {isAdmin && (
                    <div className="flex sm:absolute sm:top-4 sm:right-4 z-20 items-center gap-1.5 mb-3 sm:mb-0 justify-end">
                      <button
                        onClick={() => {
                          setEditingProject({
                            id: project.id,
                            title: project.title,
                            description: project.description,
                            tags: project.tags ? project.tags.join(", ") : "",
                            github: project.github || "",
                            link: project.link || "",
                          });
                          setIsProjectModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-[11px] bg-neutral-800/90 border border-neutral-700 text-neutral-200 rounded hover:border-purple-400 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProject(project.id, project.title)
                        }
                        className="px-2.5 py-1 text-[11px] bg-red-950/80 border border-red-800/60 text-red-300 rounded hover:bg-red-900 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className={`${headingFont.className} font-bold text-base sm:text-lg text-neutral-100 group-hover:text-white transition leading-snug`}
                      >
                        {project.title}
                      </h3>
                      <div className="flex gap-2 shrink-0 pt-0.5">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-400 hover:text-white transition p-1"
                            aria-label="Github link"
                          >
                            <CodeIcon className="w-4 h-4" />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-400 hover:text-white transition p-1"
                            aria-label="Demo link"
                          >
                            <ExternalLinkIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-neutral-400 text-xs sm:text-sm mt-2.5 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                    {project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-neutral-800/60 text-neutral-300 border border-neutral-800 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Skills Section */}
        <section
          id="skills"
          className="space-y-6 animate-fade-in opacity-0 delay-200"
        >
          <div>
            <h2
              className={`${headingFont.className} text-xl sm:text-2xl font-bold tracking-tight`}
            >
              Skills & Tech Stack
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Technologies and tools I use regularly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {skills.map((skill: string) => (
              <span
                key={skill}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-neutral-900/50 border border-neutral-800 text-neutral-300 text-xs sm:text-sm hover:border-purple-500/40 transition duration-200 cursor-default backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="dynamic-stroke relative py-8 sm:py-16 text-center space-y-4 sm:space-y-6 animate-fade-in opacity-0 delay-300"
        >
          <h2
            className={`${headingFont.className} text-2xl sm:text-4xl font-bold tracking-tight`}
          >
            Let&apos;s Connect
          </h2>
          <p className="text-white/85 max-w-lg mx-auto text-xs sm:text-base leading-relaxed px-2">
            Open to discussing potential collaborations, professional
            opportunities, or innovative project ideas.
          </p>

          <form
            onSubmit={handleContactSubmit}
            className="max-w-md mx-auto mt-6 bg-neutral-900/30 p-4 sm:p-8 rounded-2xl border border-neutral-800/80 backdrop-blur-sm text-left space-y-3.5 sm:space-y-4 shadow-xl"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-medium text-neutral-400 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg bg-neutral-950/50 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-neutral-400 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg bg-neutral-950/50 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition disabled:opacity-50"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-xs sm:text-sm font-medium text-neutral-400 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                disabled={isSubmitting}
                rows={4}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg bg-neutral-950/50 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition resize-none disabled:opacity-50"
                placeholder="How can I help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center items-center gap-2 px-6 py-2.5 sm:py-3 mt-1 sm:mt-2 rounded-lg bg-neutral-100 text-neutral-950 font-semibold text-sm sm:text-base hover:bg-neutral-200 transition duration-200 shadow-lg shadow-purple-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <MailIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Send Message
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <p className="text-emerald-400 text-xs sm:text-sm text-center mt-3 animate-fade-in">
                Message sent successfully! I&apos;ll get back to you soon.
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-400 text-xs sm:text-sm text-center mt-3 animate-fade-in">
                {errorMessage}
              </p>
            )}
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 sm:py-8 text-center text-xs text-neutral-500 select-none pb-20 sm:pb-8">
        <span
          onClick={() => setIsAdminModalOpen(true)}
          className="cursor-pointer p-2 hover:text-neutral-300 transition inline-block"
          title=""
        >
          ©
        </span>{" "}
        2026 {name}. Built with Next.js & Tailwind CSS.
      </footer>

      {/* Modal Login Admin (Responsive & Scroll-safe) */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-[#0e0e12] border border-neutral-800 shadow-2xl space-y-4 my-auto">
            <button
              onClick={() => {
                setIsAdminModalOpen(false);
                setAdminLoginError("");
              }}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white text-base p-1"
            >
              ✕
            </button>

            <div>
              <h3
                className={`${headingFont.className} text-lg sm:text-xl font-bold text-white tracking-tight`}
              >
                Admin Portal
              </h3>
              <p className="text-neutral-400 text-xs mt-1">
                Akses khusus pengelola portofolio
              </p>
            </div>

            {adminLoginError && (
              <div className="p-2.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                {adminLoginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isAdminLoggingIn}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition disabled:opacity-50 mt-2"
              >
                {isAdminLoggingIn ? "Memverifikasi..." : "Masuk ke Dashboard"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Proyek (Responsive & Max-Height Scrollable untuk Layar HP) */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-2xl bg-[#0f0f13] border border-neutral-800 shadow-2xl space-y-4 text-xs my-auto">
            <div className="flex justify-between items-center sticky top-0 bg-[#0f0f13] pb-2 z-10 border-b border-neutral-800/60">
              <h3
                className={`${headingFont.className} text-sm sm:text-base font-bold text-white tracking-tight`}
              >
                {editingProject.id
                  ? `Edit Proyek #${editingProject.id}`
                  : "Tambah Proyek Baru"}
              </h3>
              <button
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setEditingProject(null);
                }}
                className="text-neutral-500 hover:text-white text-base p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3.5 pt-1">
              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: e.target.value,
                    })
                  }
                  placeholder="Nama Proyek"
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  placeholder="Deskripsi singkat proyek..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 resize-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  TAGS (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.tags}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tags: e.target.value,
                    })
                  }
                  placeholder="Next.js, TypeScript, Tailwind"
                  className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-neutral-400 mb-1">
                    GITHUB REPO (opsional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.github}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        github: e.target.value,
                      })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-neutral-400 mb-1">
                    LIVE DEMO (opsional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.link}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        link: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition disabled:opacity-50"
                >
                  {isSavingProject ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
