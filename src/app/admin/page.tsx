"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link?: string | null;
  github?: string | null;
  order_index: number;
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

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [github, setGithub] = useState("");
  const [link, setLink] = useState("");

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Check authentication
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/");
        return;
      }
      await fetchProjects();
    }
    checkAuth();
  }, [router]);

  // 2. Fetch projects (ordered by order_index)
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && data) {
      setProjects(
        data.map((p: Record<string, unknown>, idx: number) => ({
          ...p,
          order_index: (p.order_index as number) ?? idx + 1,
        })) as Project[]
      );
    }
    setLoading(false);
  }, []);

  // 3. Submit (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      title,
      description,
      tags: tagsArray,
      github: github.trim() || null,
      link: link.trim() || null,
    };

    if (editingId) {
      // Update
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        showToast("Gagal mengupdate proyek: " + error.message, "error");
      } else {
        showToast("Proyek berhasil diperbarui!", "success");
        resetForm();
        await fetchProjects();
      }
    } else {
      // Create — assign order_index as last
      payload.order_index = projects.length + 1;
      const { error } = await supabase.from("projects").insert([payload]);

      if (error) {
        showToast("Gagal menambahkan proyek: " + error.message, "error");
      } else {
        showToast("Proyek baru berhasil ditambahkan!", "success");
        resetForm();
        await fetchProjects();
      }
    }

    setSubmitting(false);
  };

  // 4. Set form for editing
  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTags(project.tags ? project.tags.join(", ") : "");
    setGithub(project.github || "");
    setLink(project.link || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 5. Reset form
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTags("");
    setGithub("");
    setLink("");
  };

  // 6. Delete project
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      showToast("Gagal menghapus: " + error.message, "error");
    } else {
      showToast("Proyek berhasil dihapus.", "success");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    }
    setDeletingId(null);
  };

  // 7. Drag and drop reorder
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(projects);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const updatedProjects = reordered.map((proj, idx) => ({
      ...proj,
      order_index: idx + 1,
    }));

    setProjects(updatedProjects);
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
      showToast("Gagal menyimpan urutan proyek.", "error");
      await fetchProjects();
    } finally {
      setSavingOrder(false);
    }
  };

  // 8. Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 p-4 sm:p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
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

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Admin Management
            </h1>
            <p className="text-neutral-400 text-xs mt-1">
              Kelola konten proyek portofolio — buat, edit, hapus, dan atur
              urutan dengan drag & drop
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition"
            >
              Lihat Web Utama
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs text-red-400 transition"
            >
              Keluar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Panel (Create / Edit) */}
          <div className="lg:col-span-1 bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">
                {editingId
                  ? `Edit Proyek #${editingId}`
                  : "Tambah Proyek Baru"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-neutral-400 hover:text-white transition"
                >
                  Batal
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Mentora"
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi ringkas proyek..."
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
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  GITHUB URL (opsional)
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">
                  LIVE LINK (opsional)
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://myproject.com"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition disabled:opacity-50 mt-2"
              >
                {submitting
                  ? "Menyimpan..."
                  : editingId
                    ? "Simpan Perubahan"
                    : "Tambahkan Proyek"}
              </button>
            </form>
          </div>

          {/* Project List Panel with Drag & Drop */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">
                Daftar Proyek Aktif ({projects.length})
              </h2>
              {savingOrder && (
                <span className="text-xs text-purple-400 animate-pulse">
                  Menyimpan urutan...
                </span>
              )}
            </div>

            <p className="text-neutral-500 text-[11px] -mt-2">
              Drag & drop untuk mengubah urutan tampil di halaman utama
            </p>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl border border-neutral-800 bg-neutral-900/30 animate-pulse"
                  />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
                <p className="text-neutral-500 text-sm">
                  Belum ada proyek tersimpan.
                </p>
                <p className="text-neutral-600 text-xs mt-1">
                  Gunakan form di sebelah kiri untuk menambah proyek pertama.
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="admin-projects-list">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 rounded-xl ${
                        snapshot.isDraggingOver
                          ? "bg-purple-500/[0.03] ring-1 ring-purple-500/10 p-2 -m-2"
                          : ""
                      }`}
                    >
                      {projects.map((proj, index) => (
                        <Draggable
                          key={proj.id}
                          draggableId={String(proj.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style}
                              className={`p-4 sm:p-5 rounded-xl border bg-neutral-900/30 flex items-start gap-3 ${
                                snapshot.isDragging
                                  ? "border-purple-500/40 shadow-2xl shadow-purple-500/10 bg-neutral-900/80 z-50"
                                  : "border-neutral-800 hover:border-neutral-700 transition-colors"
                              } ${
                                editingId === proj.id
                                  ? "ring-1 ring-purple-500/30 border-purple-500/20"
                                  : ""
                              }`}
                            >
                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="pt-0.5 cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 transition shrink-0"
                                title="Drag untuk mengubah urutan"
                              >
                                <GripIcon className="w-4 h-4" />
                              </div>

                              {/* Project Info */}
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-mono text-neutral-600 bg-neutral-800/50 px-1.5 py-0.5 rounded">
                                    #{proj.order_index}
                                  </span>
                                  <h3 className="font-semibold text-white text-sm truncate">
                                    {proj.title}
                                  </h3>
                                </div>
                                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">
                                  {proj.description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {proj.tags?.map((t, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>

                                {(proj.github || proj.link) && (
                                  <div className="flex items-center gap-3 pt-0.5 text-[11px] text-neutral-500">
                                    {proj.github && (
                                      <a
                                        href={proj.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-neutral-300 transition truncate"
                                      >
                                        GitHub ↗
                                      </a>
                                    )}
                                    {proj.link && (
                                      <a
                                        href={proj.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-neutral-300 transition truncate"
                                      >
                                        Live ↗
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 shrink-0">
                                <button
                                  onClick={() => handleEdit(proj)}
                                  className="px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition"
                                >
                                  Edit
                                </button>
                                {deletingId === proj.id ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleDelete(proj.id)}
                                      className="px-2 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-medium transition"
                                    >
                                      Ya
                                    </button>
                                    <button
                                      onClick={() => setDeletingId(null)}
                                      className="px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-[10px] transition"
                                    >
                                      Batal
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeletingId(proj.id)}
                                    className="px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition"
                                  >
                                    Hapus
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
