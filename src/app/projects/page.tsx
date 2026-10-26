"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { projectsData, ProjectItem } from "@/data/projects";

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

  const filteredProjects = useMemo(() => {
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

  return (
    <div
      className={`relative isolate min-h-screen bg-[#070709] text-neutral-100 overflow-x-hidden selection:bg-purple-900/40 selection:text-white ${bodyFont.className}`}
    >
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
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400 hover:text-white transition duration-200 group"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Home</span>
          </Link>
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
            Kumpulan seluruh sistem informasi, aplikasi web terdistribusi, inisiatif
            ventura digital, dan studi kasus arsitektur yang dirancang untuk memberikan
            dampak operasional serta nilai bisnis terukur.
          </p>
        </section>

        {/* Interactive Filters & Search */}
        <section className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Category Filter Chips */}
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
            Showing {filteredProjects.length} of {projectsData.length} projects
          </div>
        </section>

        {/* Project Cards Comprehensive List */}
        <section className="space-y-6">
          {filteredProjects.length === 0 ? (
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
            filteredProjects.map((project: ProjectItem) => (
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
                      Role: <span className="text-neutral-200">{project.role}</span>
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
                {project.impactMetrics && project.impactMetrics.length > 0 && (
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
                          <span className="text-purple-400 shrink-0 font-bold">✓</span>
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
    </div>
  );
}