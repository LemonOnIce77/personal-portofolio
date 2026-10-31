"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { submitContactForm } from "./actions";
import { useRouter } from "next/navigation";
import { projectsData, ProjectItem } from "@/data/projects";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

interface EditableProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github?: string | null;
  link?: string | null;
  order_index?: number;
}

const portfolioData = {
  name: "Muhammad Yaumil Aditya Warman",
  role: "Undergraduate Information Systems Student & Business Tech Enthusiast",
  bio: "An Information Systems student passionate about the intersection of business, product, and technology. Driven to continuously learn and explore how technology can solve real-world problems, create meaningful digital products, and deliver business value.",
  socials: {
    github: "https://github.com/LemonOnIce77",
    linkedin: "https://www.linkedin.com/in/muhammad-yaumil-aditya-warman/",
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

function EyeIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function GripIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}

function ProjectImagePlaceholder({
  title,
  tags = [],
  index = 0,
  className = "",
  onClick,
  showHoverPrompt = true,
}: {
  title: string;
  tags?: string[];
  index?: number;
  className?: string;
  onClick?: () => void;
  showHoverPrompt?: boolean;
}) {
  const gradients = [
    "from-purple-900/50 via-indigo-950/70 to-neutral-950",
    "from-violet-900/50 via-fuchsia-950/70 to-neutral-950",
    "from-blue-900/50 via-purple-950/70 to-neutral-950",
    "from-emerald-950/50 via-indigo-950/70 to-neutral-950",
  ];
  const accents = ["#a855f7", "#ec4899", "#3b82f6", "#10b981"];
  const gradient = gradients[index % gradients.length];
  const accent = accents[index % accents.length];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800/80 bg-gradient-to-br ${gradient} group/placeholder select-none transition-all duration-300 hover:border-purple-500/50 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Chrome Window Top Bar */}
      <div className="absolute top-0 inset-x-0 h-6 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between px-2.5 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500/80" />
          <span className="w-2 h-2 rounded-full bg-amber-500/80" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
        </div>
        <div className="text-[9px] font-mono text-neutral-400 truncate max-w-[150px] px-2 py-0.5 rounded bg-neutral-900/90 border border-neutral-800">
          preview://{slug || "project"}.dev
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
        </div>
      </div>

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 pt-6 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Center Mockup Content */}
      <div className="absolute inset-0 pt-6 flex flex-col items-center justify-center p-4 text-center">
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 shadow-xl transition-transform duration-300 group-hover/placeholder:scale-110"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${accent}33, #0a0a0f)`,
            border: `1px solid ${accent}55`,
          }}
        >
          <CodeIcon className="w-5 h-5 text-purple-300" />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-neutral-100 truncate max-w-[90%] drop-shadow">
          {title}
        </span>
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80" />
            <span>{tags.slice(0, 2).join(" • ")}</span>
          </div>
        )}
      </div>

      {/* Hover Overlay with "View Overview" Prompt */}
      {showHoverPrompt && (
        <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-[2px] opacity-0 group-hover/placeholder:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
          <span className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition">
            <EyeIcon className="w-3.5 h-3.5" />
            <span>Quick Overview</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { name, role, bio, socials } = portfolioData;
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- STATE DATA & ADMIN ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<EditableProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  // --- DYNAMIC SKILLS & TECH STACK ---
  // Automatically incorporates base skills + tags from current/new projects + static archive
  const allSkills = useMemo(() => {
    const map = new Map<string, string>();

    // 1. Base portfolio skills
    portfolioData.skills.forEach((s) => {
      const trimmed = s.trim();
      if (trimmed) map.set(trimmed.toLowerCase(), trimmed);
    });

    // 2. Active projects tags from database or state
    projects.forEach((proj) => {
      if (Array.isArray(proj.tags)) {
        proj.tags.forEach((tag) => {
          const trimmed = tag.trim();
          if (trimmed && !map.has(trimmed.toLowerCase())) {
            map.set(trimmed.toLowerCase(), trimmed);
          }
        });
      }
    });

    // 3. Static project archive techStack
    projectsData.forEach((item) => {
      if (Array.isArray(item.techStack)) {
        item.techStack.forEach((tech) => {
          const trimmed = tech.trim();
          if (trimmed && !map.has(trimmed.toLowerCase())) {
            map.set(trimmed.toLowerCase(), trimmed);
          }
        });
      }
    });

    return Array.from(map.values());
  }, [projects]);

  // Split into two lines for opposing gliding animations
  const { line1Skills, line2Skills } = useMemo(() => {
    const line1: string[] = [];
    const line2: string[] = [];
    allSkills.forEach((skill, idx) => {
      if (idx % 2 === 0) {
        line1.push(skill);
      } else {
        line2.push(skill);
      }
    });
    return { line1Skills: line1, line2Skills: line2 };
  }, [allSkills]);

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

  // --- SCROLL-DRIVEN TRANSITION & LEFT-TO-RIGHT DRAWER ---
  const projectsSectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const drawerTrackRef = useRef<HTMLDivElement>(null);
  const [drawerProject, setDrawerProject] = useState<EditableProject | null>(null);

  // Scroll listener tracking proximity to Featured Projects section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (projectsSectionRef.current) {
            const rect = projectsSectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // start: section top enters bottom of window (progress = 0)
            // end: section top is ~20% from viewport top (progress = 1)
            const start = windowHeight;
            const end = windowHeight * 0.2;
            const rawProgress = (start - rect.top) / (start - end);
            const clamped = Math.min(Math.max(rawProgress, 0), 1);
            setScrollProgress(clamped);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation for Left-to-Right Drawer (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerProject(null);
      }
    };
    if (drawerProject) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [drawerProject]);

  // --- AUTO-SLIDE RIGHT TO LEFT EVERY 5 SECONDS ---
  const [isProjectsInView, setIsProjectsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Detect when user is viewing Featured Projects
  useEffect(() => {
    if (!projectsSectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProjectsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(projectsSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Automatically slide from right to left every 5 seconds
  useEffect(() => {
    if (!isProjectsInView || drawerProject || isHovered) return;

    const interval = setInterval(() => {
      if (drawerTrackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = drawerTrackRef.current;
        const scrollAmount = 370;

        // If reaching or near the end, loop back smoothly to the beginning
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          drawerTrackRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          drawerTrackRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isProjectsInView, drawerProject, isHovered]);

  const handleScrollTrack = (direction: "left" | "right") => {
    if (drawerTrackRef.current) {
      const scrollAmount = 360;
      drawerTrackRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleDrawerNavigate = (direction: "prev" | "next") => {
    if (!drawerProject || projects.length === 0) return;
    const currentIndex = projects.findIndex((p) => p.id === drawerProject.id);
    if (currentIndex === -1) return;
    if (direction === "next") {
      const nextIndex = (currentIndex + 1) % projects.length;
      setDrawerProject(projects[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
      setDrawerProject(projects[prevIndex]);
    }
  };

  // --- FETCH DATA SETTINGS & PROYEK ---
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

  useEffect(() => {
    loadSiteSettings();
  }, [loadSiteSettings]);

  const handleToggleAvailability = async () => {
    if (!isAdmin) {
      alert("Kamu belum login sebagai admin. Klik simbol © di footer untuk login.");
      return;
    }

    if (isTogglingAvailability) return;

    const nextState = !isAvailable;
    setIsTogglingAvailability(true);

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
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      setProjects(
        data.map((project, idx) => ({
          id: project.id,
          title: project.title ?? "",
          description: project.description ?? "",
          tags: Array.isArray(project.tags) ? project.tags : [],
          link: project.link ?? null,
          github: project.github ?? null,
          order_index: project.order_index ?? idx,
        }))
      );
    } else {
      // Fallback ke data terpusat jika data database belum terisi
      const fallbackList: EditableProject[] = projectsData.map((item, idx) => ({
        id: idx + 1,
        title: item.title,
        description: item.solution,
        tags: item.techStack,
        github: item.githubUrl ?? null,
        link: item.liveUrl ?? null,
        order_index: item.order,
      }));
      setProjects(fallbackList);
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
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadProjects]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !isAdmin) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(projects);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const updatedProjects = reordered.map((proj, idx) => ({
      ...proj,
      order_index: idx + 1,
    }));

    setProjects(updatedProjects);

    try {
      await Promise.all(
        updatedProjects.map((proj) =>
          supabase
            .from("projects")
            .update({ order_index: proj.order_index })
            .eq("id", proj.id)
        )
      );
    } catch (err) {
      console.error("Gagal menyimpan urutan:", err);
    }
  };

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

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const handleDeleteProject = async (id: number, title: string) => {
    if (!confirm(`Hapus proyek "${title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      loadProjects();
    } else {
      alert("Gagal menghapus proyek: " + error.message);
    }
  };

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
      : await supabase.from("projects").update(payload).eq("id", editingProject.id);

    if (!res.error) {
      setIsProjectModalOpen(false);
      setEditingProject(null);
      await loadProjects();
    } else {
      alert("Gagal menyimpan proyek: " + res.error.message);
    }
    setIsSavingProject(false);
  };

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

      {/* FLOATING ADMIN TOOLBAR */}
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

          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base font-medium text-white">
            <Link
              href="/about"
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/[0.15] transition duration-200"
            >
              About
            </Link>
            <Link
              href="/projects"
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
          className="pt-4 sm:pt-8 text-center flex flex-col items-center animate-fade-in"
        >
          <div className="flex flex-col items-center gap-4 sm:gap-5 max-w-3xl">
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

            <button
              type="button"
              onClick={handleToggleAvailability}
              disabled={!isAdmin || isTogglingAvailability}
              title={isAdmin ? "Klik untuk ganti status (Admin)" : ""}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 text-[11px] sm:text-xs font-mono rounded-full border transition duration-200 select-none ${isAvailable
                  ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300"
                  : "bg-sky-950/30 border-sky-500/40 text-sky-200"
                } ${isAdmin
                  ? "cursor-pointer hover:border-sky-400 hover:scale-105 active:scale-95 ring-1 ring-sky-500/30"
                  : "cursor-default"
                }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${isAvailable ? "bg-emerald-400 animate-pulse" : "bg-sky-400"
                  }`}
              />
              <span>
                {isAvailable
                  ? "Available for collaborations"
                  : "Currently focused on ongoing projects"}
              </span>
              {isAdmin && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-sky-900/60 text-sky-200 ml-1">
                  {isTogglingAvailability ? "..." : "switch"}
                </span>
              )}
            </button>

            <h1
              className={`${headingFont.className} text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-100 leading-tight w-full`}
            >
              Hello, I&apos;m{" "}
              <span className="relative inline-block bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-300 bg-clip-text text-transparent [text-shadow:0_0_25px_rgba(168,85,247,0.45)] break-words">
                {name}
              </span>
            </h1>

            <div className="space-y-3 sm:space-y-4 max-w-2xl px-2">
              <p className="text-base sm:text-xl text-neutral-200 font-semibold tracking-wide leading-snug">
                {role}
              </p>
              <p className="text-neutral-300 leading-relaxed text-xs sm:text-base font-medium">
                {bio}
              </p>
            </div>

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
            </div>
          </div>
        </section>

        {/* Featured Projects Section dengan Scroll Transition & Left-to-Right Drawer */}
        <section
          id="projects"
          ref={projectsSectionRef}
          style={{
            transform: `translateX(${(1 - scrollProgress) * -45}px)`,
            opacity: Math.max(0.3, scrollProgress),
            transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out",
          }}
          className="space-y-6"
        >
          {/* Header Section: Judul, Subtitle, Direct CTA, & Horizontal Track Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800/60 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Interactive Showcase • Auto-slide 5s</span>
              </div>
              <h2
                className={`${headingFont.className} text-xl sm:text-2xl font-bold tracking-tight text-white`}
              >
                Featured Projects
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                A selection of high-impact systems and engineering works I&apos;ve built.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {/* Horizontal Scroll Controls */}
              <div className="flex items-center gap-1.5 bg-neutral-900/60 border border-neutral-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => handleScrollTrack("left")}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                  title="Scroll Left"
                  aria-label="Scroll Projects Left"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollTrack("right")}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                  title="Scroll Right"
                  aria-label="Scroll Projects Right"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Direct CTA Link ke Halaman /projects */}
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-purple-300 hover:text-purple-200 transition duration-200 group py-1"
              >
                <span>View All</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
            </div>
          </div>

          {isMounted && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="projects-list"
                direction="horizontal"
                isDropDisabled={!isAdmin}
              >
                {(provided, snapshot) => (
                  <div
                    ref={(el) => {
                      provided.innerRef(el);
                      drawerTrackRef.current = el;
                    }}
                    {...provided.droppableProps}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onTouchEnd={() => setIsHovered(false)}
                    className={`flex gap-4 overflow-x-auto snap-x scroll-smooth pb-4 pt-1 px-1 no-scrollbar rounded-2xl ${
                      snapshot.isDraggingOver
                        ? "bg-purple-950/10 ring-1 ring-purple-500/20"
                        : ""
                    }`}
                  >
                    {isLoadingProjects ? (
                      <p className="text-neutral-500 text-xs sm:text-sm italic col-span-full">
                        Memuat proyek dari database...
                      </p>
                    ) : projects.length === 0 ? (
                      <p className="text-neutral-500 text-xs sm:text-sm italic col-span-full">
                        Belum ada proyek yang tersedia.
                      </p>
                    ) : (
                      // Menampilkan proyek unggulan di Horizontal Drawer Track
                      projects.slice(0, 6).map((project, index) => (
                        <Draggable
                          key={project.id}
                          draggableId={String(project.id)}
                          index={index}
                          isDragDisabled={!isAdmin}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style}
                              className={`w-[290px] sm:w-[350px] shrink-0 snap-start p-4 sm:p-5 rounded-2xl border bg-neutral-900/30 flex flex-col justify-between group shadow-sm backdrop-blur-sm relative transition-all duration-200 ${
                                snapshot.isDragging
                                  ? "border-purple-500 bg-neutral-900/95 shadow-2xl z-50 ring-2 ring-purple-500/60 cursor-grabbing"
                                  : "border-neutral-800/80 hover:border-purple-500/50 hover:bg-neutral-900/60"
                              }`}
                            >
                              {/* Action Bar Admin */}
                              {isAdmin && (
                                <div className="flex sm:absolute sm:top-4 sm:right-4 z-30 items-center gap-1.5 mb-2 sm:mb-0 justify-between sm:justify-end">
                                  <span
                                    {...provided.dragHandleProps}
                                    title="Tahan & geser untuk atur posisi"
                                    className="cursor-grab active:cursor-grabbing p-1 text-neutral-400 hover:text-purple-300 transition select-none flex items-center gap-1 text-[11px] font-mono bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800"
                                  >
                                    <GripIcon className="w-3 h-3" /> Geser
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProject({
                                          id: project.id,
                                          title: project.title,
                                          description: project.description,
                                          tags: project.tags
                                            ? project.tags.join(", ")
                                            : "",
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
                                      type="button"
                                      onClick={() =>
                                        handleDeleteProject(
                                          project.id,
                                          project.title
                                        )
                                      }
                                      className="px-2.5 py-1 text-[11px] bg-red-950/80 border border-red-800/60 text-red-300 rounded hover:bg-red-900 transition"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-3.5">
                                {/* Image Placeholder with Click to Open Drawer */}
                                <ProjectImagePlaceholder
                                  title={project.title}
                                  tags={project.tags}
                                  index={index}
                                  onClick={() => setDrawerProject(project)}
                                />

                                <div>
                                  <div className="flex items-start justify-between gap-3">
                                    <h3
                                      onClick={() => setDrawerProject(project)}
                                      className={`${headingFont.className} font-bold text-base text-neutral-100 group-hover:text-purple-300 transition leading-snug cursor-pointer line-clamp-1`}
                                    >
                                      {project.title}
                                    </h3>
                                  </div>
                                  <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed line-clamp-2">
                                    {project.description}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-neutral-800/60 mt-3 space-y-3">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                  {project.tags.slice(0, 3).map((tag: string) => (
                                    <span
                                      key={tag}
                                      className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800/60 text-neutral-300 border border-neutral-800 font-mono"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                {/* Actions: Overview Button + External Links */}
                                <div className="flex items-center justify-between gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setDrawerProject(project)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono transition"
                                  >
                                    <EyeIcon className="w-3.5 h-3.5" />
                                    <span>Overview</span>
                                  </button>

                                  <div className="flex items-center gap-1">
                                    {project.github && (
                                      <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-neutral-400 hover:text-white transition p-1.5 rounded-lg hover:bg-neutral-800"
                                        aria-label="Github link"
                                        title="Source Code"
                                      >
                                        <CodeIcon className="w-4 h-4" />
                                      </a>
                                    )}
                                    {project.link && (
                                      <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-neutral-400 hover:text-white transition p-1.5 rounded-lg hover:bg-neutral-800"
                                        aria-label="Demo link"
                                        title="Live Preview"
                                      >
                                        <ExternalLinkIcon className="w-4 h-4" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {/* Footer Card Navigation Link */}
          <div className="pt-2 flex justify-between items-center text-xs font-mono text-neutral-400">
            <span className="hidden sm:inline">
              ← Geser atau gunakan tombol panah untuk menjelajah →
            </span>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-purple-500/50 text-neutral-300 hover:text-white transition duration-200 group"
            >
              <span>Explore All Projects Archive ({projects.length})</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* Skills Section with Two-Line Opposing Gliding Marquee */}
        <section
          id="skills"
          className="space-y-6 animate-fade-in opacity-0 delay-200 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-800/60 pb-4">
            <div>
              <h2
                className={`${headingFont.className} text-xl sm:text-2xl font-bold tracking-tight text-white`}
              >
                Skills & Tech Stack
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Technologies, frameworks, and tools dynamically synchronized with featured projects.
              </p>
            </div>
            <span className="text-[11px] font-mono text-purple-300 bg-purple-950/30 border border-purple-500/30 px-2.5 py-1 rounded-full w-max">
              {allSkills.length} Technologies
            </span>
          </div>

          <div className="space-y-3.5 py-2">
            {/* 1st Line: Gliding from Right to Left */}
            <div className="relative overflow-hidden mask-marquee py-0.5">
              <div className="animate-glide-left flex items-center gap-3">
                {[...line1Skills, ...line1Skills, ...line1Skills, ...line1Skills].map(
                  (skill, idx) => (
                    <span
                      key={`l1-${skill}-${idx}`}
                      className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-200 text-xs sm:text-sm font-medium hover:border-purple-500/50 hover:bg-neutral-900 hover:text-white transition-colors duration-200 cursor-default backdrop-blur-sm shadow-sm shrink-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{skill}</span>
                    </span>
                  )
                )}
              </div>
            </div>

            {/* 2nd Line: Gliding from Left to Right */}
            <div className="relative overflow-hidden mask-marquee py-0.5">
              <div className="animate-glide-right flex items-center gap-3">
                {[...line2Skills, ...line2Skills, ...line2Skills, ...line2Skills].map(
                  (skill, idx) => (
                    <span
                      key={`l2-${skill}-${idx}`}
                      className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-200 text-xs sm:text-sm font-medium hover:border-purple-500/50 hover:bg-neutral-900 hover:text-white transition-colors duration-200 cursor-default backdrop-blur-sm shadow-sm shrink-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{skill}</span>
                    </span>
                  )
                )}
              </div>
            </div>
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

          <div className="relative max-w-md mx-auto mt-6 group">
            {/* Ambient Subtle Glow behind the form */}
            <div
              aria-hidden="true"
              className="form-glow-blur absolute -inset-1 rounded-2xl opacity-25 group-hover:opacity-45 transition duration-1000 pointer-events-none"
            />

            {/* Glowing Shiny Border Wrapper */}
            <div className="form-glow-border relative rounded-2xl p-[1px] overflow-hidden shadow-2xl">
              <form
                onSubmit={handleContactSubmit}
                className="relative z-10 bg-[#09090e]/95 backdrop-blur-xl p-5 sm:p-8 rounded-[15px] text-left space-y-3.5 sm:space-y-4"
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
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg bg-neutral-950/70 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition disabled:opacity-50"
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
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg bg-neutral-950/70 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition disabled:opacity-50"
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
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg bg-neutral-950/70 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition resize-none disabled:opacity-50"
                    placeholder="How can I help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center gap-2 px-6 py-2.5 sm:py-3 mt-1 sm:mt-2 rounded-lg bg-neutral-100 text-neutral-950 font-semibold text-sm sm:text-base hover:bg-white hover:shadow-[0_0_24px_rgba(168,85,247,0.35)] transition-all duration-300 shadow-lg shadow-purple-900/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
            </div>
          </div>
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

      {/* ====== LEFT-TO-RIGHT PROJECT OVERVIEW DRAWER ====== */}
      {drawerProject && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerProject(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
          />

          {/* Slide-over Drawer Panel from Left to Right */}
          <aside
            aria-label="Project Overview Drawer"
            className="fixed inset-y-0 left-0 w-full max-w-md sm:max-w-xl bg-[#0c0c10] border-r border-neutral-800 shadow-2xl flex flex-col z-50 animate-slide-left overflow-y-auto"
          >
            {/* Drawer Sticky Top Header */}
            <div className="sticky top-0 bg-[#0c0c10]/95 backdrop-blur-md z-20 border-b border-neutral-800/80 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-xs font-mono text-purple-300 uppercase tracking-wider font-semibold">
                  Project Overview
                </span>
                {drawerProject.order_index && (
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    #{drawerProject.order_index}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Prev & Next inside Drawer */}
                <div className="flex items-center gap-1 border border-neutral-800 rounded-lg p-0.5 bg-neutral-900/60">
                  <button
                    type="button"
                    onClick={() => handleDrawerNavigate("prev")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition"
                    title="Previous Project (←)"
                    aria-label="Previous Project"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDrawerNavigate("next")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition"
                    title="Next Project (→)"
                    aria-label="Next Project"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerProject(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                  title="Close Drawer (Esc)"
                  aria-label="Close Overview Drawer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="p-5 sm:p-6 space-y-6 flex-1">
              {/* Large Image Placeholder */}
              <div className="space-y-2">
                <ProjectImagePlaceholder
                  title={drawerProject.title}
                  tags={drawerProject.tags}
                  index={drawerProject.id}
                  showHoverPrompt={false}
                  className="shadow-2xl ring-1 ring-purple-500/20"
                />
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 px-1">
                  <span>Image Preview Placeholder</span>
                  <span>Interactive 16:9 Showcase</span>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h3
                  className={`${headingFont.className} text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug`}
                >
                  {drawerProject.title}
                </h3>
              </div>

              {/* Overview Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Overview & Architecture
                </h4>
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 text-sm text-neutral-300 leading-relaxed">
                  {drawerProject.description}
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Tech Stack & Tools
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {drawerProject.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-purple-200 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* External Action Links */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  {drawerProject.link && (
                    <a
                      href={drawerProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition shadow-lg shadow-purple-600/25"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                      <span>Launch Live Demo</span>
                    </a>
                  )}
                  {drawerProject.github && (
                    <a
                      href={drawerProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-medium transition"
                    >
                      <CodeIcon className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      const proj = drawerProject;
                      setDrawerProject(null);
                      setEditingProject({
                        id: proj.id,
                        title: proj.title,
                        description: proj.description,
                        tags: proj.tags ? proj.tags.join(", ") : "",
                        github: proj.github || "",
                        link: proj.link || "",
                      });
                      setIsProjectModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition"
                  >
                    Edit This Project in Admin
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Modal Login Admin */}
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

      {/* Modal Tambah / Edit Proyek */}
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