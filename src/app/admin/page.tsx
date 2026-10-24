"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link?: string | null;
  github?: string | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State Form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [github, setGithub] = useState("");
  const [link, setLink] = useState("");

  // 1. Cek Sesi Autentikasi
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/");
        return;
      }
      await fetchProjects();
    }
    checkAuth();
  }, [router]);

  // 2. Ambil Data Proyek
  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  // 3. Simpan Proyek (Tambah Baru atau Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      tags: tagsArray,
      github: github.trim() || null,
      link: link.trim() || null,
    };

    if (editingId) {
      // Mode Edit
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert("Gagal mengupdate proyek: " + error.message);
      } else {
        resetForm();
        await fetchProjects();
      }
    } else {
      // Mode Tambah Baru
      const { error } = await supabase.from("projects").insert([payload]);

      if (error) {
        alert("Gagal menambahkan proyek: " + error.message);
      } else {
        resetForm();
        await fetchProjects();
      }
    }

    setSubmitting(false);
  };

  // 4. Set State untuk Edit
  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTags(project.tags ? project.tags.join(", ") : "");
    setGithub(project.github || "");
    setLink(project.link || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 5. Batalkan Mode Edit
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setTags("");
    setGithub("");
    setLink("");
  };

  // 6. Hapus Proyek
  const handleDelete = async (id: number) => {
    if (!confirm(`Hapus proyek #${id}? Tindakan ini tidak bisa dibatalkan.`)) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus: " + error.message);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    }
  };

  // 7. Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Admin Management</h1>
            <p className="text-neutral-400 text-xs mt-1">Kelola konten proyek portofolio secara langsung</p>
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
          
          {/* Panel Form (Tambah / Edit) */}
          <div className="lg:col-span-1 bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">
                {editingId ? `Edit Proyek #${editingId}` : "Tambah Proyek Baru"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Batal
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-neutral-400 mb-1">TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Mentora"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">DESCRIPTION</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi ringkas proyek..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">TAGS (pisahkan dengan koma)</label>
                <input
                  type="text"
                  required
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">GITHUB URL (opsional)</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">LIVE LINK (opsional)</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://myproject.com"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-purple-500"
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

          {/* Panel Daftar Proyek */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-white text-sm">
              Daftar Proyek Aktif ({projects.length})
            </h2>

            {loading ? (
              <p className="text-neutral-500 text-xs italic">Memuat data dari database...</p>
            ) : projects.length === 0 ? (
              <p className="text-neutral-500 text-xs italic">Belum ada proyek tersimpan.</p>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/30 flex flex-col sm:flex-row items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-500">#{proj.id}</span>
                        <h3 className="font-semibold text-white text-sm">{proj.title}</h3>
                      </div>
                      <p className="text-neutral-400 text-xs leading-relaxed">{proj.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
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
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-500">
                          {proj.github && <span>Repo: {proj.github}</span>}
                          {proj.link && <span>Live: {proj.link}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(proj)}
                        className="px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}