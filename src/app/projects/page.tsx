"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { projectsData, ProjectItem } from "@/data/projects";
import { supabase } from "@/lib/supabase";
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
  weight: ["400", "500", "600"],
});

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
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

interface DbProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link?: string | null;
  github?: string | null;
  order_index: number;
}

const CATEGORIES = [
  "All",
  "Web App",
  "Business Systems",
  "Data & AI",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // DB projects for admin reorder/edit/delete
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  // Edit modal
  const [editingProject, setEditingProject] = useState<DbProject | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load DB projects
  const loadDbProjects = useCallback(async () => {
    setIsLoadingDb(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      setDbProjects(
        data.map((p: Record<string, unknown>, idx: number) => ({
          id: p.id as number,
          title: (p.title as string) ?? "",
          description: (p.description as string) ?? "",
          tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
          link: (p.link as string) ?? null,
          github: (p.github as string) ?? null,
          order_index: (p.order_index as number) ?? idx + 1,
        }))
      );
    }
    setIsLoadingDb(false);
  }, []);

  // Check admin session
  useEffect(() => {
    setIsMounted(true);
    loadDbProjects();

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAdmin(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadDbProjects]);

  // Drag reorder (admin only, works on DB projects)
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !isAdmin) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(dbProjects);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const updatedProjects = reordered.map((proj, idx) => ({
      ...proj,
      order_index: idx + 1,
    }));

    setDbProjects(updatedProjects);
    setSavingOrder(true);

    try {
      await Promise.all(
        updatedProjects.map((proj) =>
          supabase
            .from("projects")
            .update({ order_index: proj.order_index })
            .eq("id", proj.id)
        )
      );
      showToast("Urutan proyek berhasil disimpan!", "success");
    } catch {
      showToast("Gagal menyimpan urutan.", "error");
      await loadDbProjects();
    } finally {
      setSavingOrder(false);
    }
  };

  // Open edit modal
  const openEdit = (proj: DbProject) => {
    setEditingProject(proj);
    setEditTitle(proj.title);
    setEditDescription(proj.description);
    setEditTags(proj.tags.join(", "));
    setEditGithub(proj.github || "");
    setEditLink(proj.link || "");
  };

  // Submit edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setEditSubmitting(true);

    const payload = {
      title: editTitle,
      description: editDescription,
      tags: editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      github: editGithub.trim() || null,
      link: editLink.trim() || null,
    };

    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", editingProject.id);

    if (error) {
      showToast("Gagal mengupdate: " + error.message, "error");
    } else {
      showToast("Proyek berhasil diperbarui!", "success");
      setEditingProject(null);
      await loadDbProjects();
    }
    setEditSubmitting(false);
  };

  // Delete project
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      showToast("Gagal menghapus: " + error.message, "error");
    } else {
      showToast("Proyek berhasil dihapus.", "success");
      setDbProjects((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  };

  // Use static data for display (public), DB data for admin features
  // When admin: show DB projects (they can drag/edit/delete)
  // When public: show static data with filters
  const filteredStaticProjects = useMemo(() => {
    return projectsData
      .filter((project) => {
        const matchesCategory =
          activeCategory === "All" || project.category === activeCategory;
        const matchesSearch =
          searchQuery.trim() === "" ||
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.solution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.techStack.some((tech) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => a.order - b.order);
  }, [activeCategory, searchQuery]);

  // For admin: filter DB projects
  const filteredDbProjects = useMemo(() => {
    if (!isAdmin) return dbProjects;
    if (searchQuery.trim() === "") return dbProjects;
    return dbProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [dbProjects, searchQuery, isAdmin]);

  return (
    <div
      className={`relative isolate min-h-screen bg-[#070709] text-neutral-100 overflow-x-hidden selection:bg-purple-900/40 selection:text-white ${bodyFont.className}`}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-xs font-medium shadow-xl border backdrop-blur-md animate-fade-in ${
            toast.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/15 border-red-500/30 text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Dynamic Background Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-40 right-1/2 translate-x-1/2 w-[760px] h-[520px] bg-purple-600/15 blur-[160px] rounded-full -z-10"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 -right-32 w-[520px] h-[520px] bg-sky-500/10 blur-[150px] rounded-full -z-10"
        />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.32) 0.7px, transparent 0.9px)",
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400 hover:text-white transition duration-200 group"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Home</span>
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-300">
                Admin Mode
              </span>
              {savingOrder && (
                <span className="text-xs text-purple-400 animate-pulse ml-2">
                  Saving...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Page Header */}
        <section className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-200 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Complete Project Archive</span>
          </div>

          <h1
            className={`${headingFont.className} text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight`}
          >
            Curated Works & Engineering Projects
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Kumpulan seluruh sistem informasi, aplikasi web terdistribusi,
            inisiatif ventura digital, dan studi kasus arsitektur yang dirancang
            untuk memberikan dampak operasional serta nilai bisnis terukur.
          </p>
        </section>

        {/* Interactive Filters & Search */}
        <section className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Category Filter Chips — only for public view */}
            {!isAdmin && (
              <div className="flex flex-wrap items-center gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition duration-200 border cursor-pointer select-none ${
                        isActive
                          ? "bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                          : "bg-neutral-900/50 text-neutral-400 border-neutral-800/80 hover:text-neutral-200 hover:border-neutral-700 hover:bg-neutral-900"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {isAdmin && (
              <p className="text-[11px] font-mono text-neutral-500">
                Drag & drop untuk mengubah urutan • Klik Edit / Hapus untuk
                mengelola
              </p>
            )}

            {/* Live Search Input */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tech, topic, or title..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition backdrop-blur-md"
              />
            </div>
          </div>

          {/* Result Count Indicator */}
          <div className="text-[11px] font-mono text-neutral-500">
            Showing{" "}
            {isAdmin
              ? `${filteredDbProjects.length} of ${dbProjects.length}`
              : `${filteredStaticProjects.length} of ${projectsData.length}`}{" "}
            projects
          </div>
        </section>

        {/* ====== ADMIN VIEW: Draggable DB Projects ====== */}
        {isAdmin && isMounted ? (
          <section className="space-y-6">
            {isLoadingDb ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl border border-neutral-800 bg-neutral-900/30 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredDbProjects.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border border-neutral-800/60 bg-neutral-900/20 backdrop-blur-sm space-y-3">
                <p className="text-neutral-400 text-sm">
                  Tidak ada proyek ditemukan.
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="projects-page-list">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 rounded-2xl ${
                        snapshot.isDraggingOver
                          ? "bg-purple-500/[0.03] ring-1 ring-purple-500/10 p-3 -m-3"
                          : ""
                      }`}
                    >
                      {filteredDbProjects.map((proj, index) => (
                        <Draggable
                          key={proj.id}
                          draggableId={String(proj.id)}
                          index={index}
                          isDragDisabled={searchQuery.trim() !== ""}
                        >
                          {(provided, snapshot) => (
                            <article
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style}
                              className={`p-6 sm:p-8 rounded-2xl border bg-neutral-900/25 backdrop-blur-md shadow-lg space-y-5 group ${
                                snapshot.isDragging
                                  ? "border-purple-500/50 bg-neutral-900/80 shadow-2xl shadow-purple-500/10 z-50 cursor-grabbing"
                                  : "border-neutral-800/80 hover:border-purple-500/50 hover:bg-neutral-900/40 transition-colors duration-200"
                              }`}
                            >
                              {/* Admin Action Bar */}
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  {/* Drag Handle */}
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 transition p-1"
                                    title="Drag untuk mengubah urutan"
                                  >
                                    <GripIcon className="w-5 h-5" />
                                  </div>
                                  <span className="text-[10px] font-mono text-neutral-600 bg-neutral-800/50 px-2 py-0.5 rounded">
                                    #{proj.order_index}
                                  </span>
                                  <h2
                                    className={`${headingFont.className} text-lg sm:text-xl font-bold text-white tracking-tight leading-snug`}
                                  >
                                    {proj.title}
                                  </h2>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => openEdit(proj)}
                                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition"
                                  >
                                    Edit
                                  </button>
                                  {deletingId === proj.id ? (
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => handleDelete(proj.id)}
                                        className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[11px] font-medium transition"
                                      >
                                        Ya, Hapus
                                      </button>
                                      <button
                                        onClick={() => setDeletingId(null)}
                                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-[11px] transition"
                                      >
                                        Batal
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setDeletingId(proj.id)}
                                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition"
                                    >
                                      Hapus
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Project Content */}
                              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                                {proj.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {proj.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md bg-neutral-800/50 border border-neutral-800 text-neutral-300 font-mono"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Links */}
                              {(proj.github || proj.link) && (
                                <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/60">
                                  {proj.github && (
                                    <a
                                      href={proj.github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:border-purple-400 text-xs font-mono transition duration-200 mt-2"
                                    >
                                      <CodeIcon className="w-3.5 h-3.5" />
                                      <span>Source</span>
                                    </a>
                                  )}
                                  {proj.link && (
                                    <a
                                      href={proj.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:border-sky-400 text-xs font-mono transition duration-200 mt-2"
                                    >
                                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                                      <span>Preview</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </article>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </section>
        ) : (
          /* ====== PUBLIC VIEW: Static Projects ====== */
          <section className="space-y-6">
            {filteredStaticProjects.length === 0 ? (
              <div className="py-20 text-center rounded-2xl border border-neutral-800/60 bg-neutral-900/20 backdrop-blur-sm space-y-3">
                <p className="text-neutral-400 text-sm">
                  Tidak ada proyek yang sesuai dengan kriteria pencarian.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="text-xs font-mono text-purple-400 hover:text-purple-300 underline"
                >
                  Reset Filter & Pencarian
                </button>
              </div>
            ) : (
              filteredStaticProjects.map((project: ProjectItem) => (
                <article
                  key={project.id}
                  className="p-6 sm:p-8 rounded-2xl border border-neutral-800/80 bg-neutral-900/25 backdrop-blur-md hover:border-purple-500/50 hover:bg-neutral-900/40 transition duration-300 shadow-lg space-y-6 group"
                >
                  {/* Card Top: Role, Category, Period & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-purple-950/40 border border-purple-500/30 text-purple-200">
                          {project.category}
                        </span>
                        <span className="text-neutral-600 text-xs">•</span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {project.period}
                        </span>
                        {project.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/40 border border-sky-500/30 text-sky-200 ml-1">
                            Featured
                          </span>
                        )}
                      </div>

                      <h2
                        className={`${headingFont.className} text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition duration-200 tracking-tight leading-snug`}
                      >
                        {project.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                        Role:{" "}
                        <span className="text-neutral-200">{project.role}</span>
                      </p>
                    </div>

                    {/* External Links */}
                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:border-purple-400 text-xs font-mono transition duration-200"
                          aria-label={`GitHub Repo ${project.title}`}
                        >
                          <CodeIcon className="w-3.5 h-3.5" />
                          <span>Source</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:border-sky-400 text-xs font-mono transition duration-200"
                          aria-label={`Live Demo ${project.title}`}
                        >
                          <ExternalLinkIcon className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Problem & Solution Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
                    <div className="p-4 rounded-xl border border-neutral-800/60 bg-neutral-950/40 space-y-1.5">
                      <span className="text-rose-300 font-mono text-[11px] font-semibold tracking-wide uppercase">
                        Problem Statement
                      </span>
                      <p className="text-neutral-400 leading-relaxed font-normal">
                        {project.problem}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-800/60 bg-neutral-950/40 space-y-1.5">
                      <span className="text-emerald-300 font-mono text-[11px] font-semibold tracking-wide uppercase">
                        Engineering & Product Solution
                      </span>
                      <p className="text-neutral-300 leading-relaxed font-normal">
                        {project.solution}
                      </p>
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  {project.impactMetrics &&
                    project.impactMetrics.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase font-semibold">
                          Key Outcomes & Metrics:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          {project.impactMetrics.map((metric, idx) => (
                            <li
                              key={idx}
                              className="px-3 py-2 rounded-lg bg-neutral-950/50 border border-neutral-800/70 text-neutral-300 flex items-start gap-2"
                            >
                              <span className="text-purple-400 shrink-0 font-bold">
                                ✓
                              </span>
                              <span className="leading-tight">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-800/60">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md bg-neutral-800/50 border border-neutral-800 text-neutral-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {/* Footer Navigation Link */}
        <div className="pt-8 text-center border-t border-neutral-800/60">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400 hover:text-white transition duration-200"
          >
            <span>← Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </main>

      {/* ====== EDIT MODAL ====== */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProject(null);
          }}
        >
          <div className="w-full max-w-lg bg-[#0f0f13] border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">
                Edit Proyek #{editingProject.id}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-neutral-500 hover:text-white text-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 resize-none transition"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  TAGS (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  required
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  GITHUB URL (opsional)
                </label>
                <input
                  type="url"
                  value={editGithub}
                  onChange={(e) => setEditGithub(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  LIVE LINK (opsional)
                </label>
                <input
                  type="url"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition disabled:opacity-50"
                >
                  {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
