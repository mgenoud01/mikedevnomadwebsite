"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { Project } from "@/lib/projects";

const INPUT_STYLE = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  padding: "11px 14px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
  boxSizing: "border-box" as const,
};

const LABEL_STYLE = {
  color: "rgba(255,255,255,0.35)",
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  display: "block",
  marginBottom: "6px",
};

const STATUS_COLORS: Record<string, string> = {
  done: "#00ff99",
  "in-progress": "#f59e0b",
  archived: "rgba(255,255,255,0.3)",
};

const STATUS_LABELS: Record<string, string> = {
  done: "Done",
  "in-progress": "In Progress",
  archived: "Archived",
};

const EMPTY_FORM = {
  titre: "",
  description: "",
  stack: [] as string[],
  lien: "",
  github: "",
  image: "",
  images: [] as string[],
  video: "",
  featured: false,
  status: "done" as Project["status"],
};

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      padding: "8px 12px",
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      alignItems: "center",
      minHeight: "44px",
    }}>
      {tags.map((tag) => (
        <span key={tag} style={{
          background: "rgba(0,255,153,0.1)",
          color: "#00ff99",
          fontSize: "12px",
          padding: "3px 10px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}>
          {tag}
          <button onClick={() => onChange(tags.filter((t) => t !== tag))} style={{
            background: "none",
            border: "none",
            color: "rgba(0,255,153,0.5)",
            cursor: "pointer",
            padding: 0,
            fontSize: "12px",
            lineHeight: 1,
          }}>×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={addTag}
        placeholder={placeholder || "Ajouter..."}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          outline: "none",
          fontSize: "13px",
          minWidth: "120px",
          flex: 1,
        }}
      />
    </div>
  );
}

export default function ProjectsAdminClient({ projects: initialProjects }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(p: Project) {
    setForm({
      titre: p.titre,
      description: p.description,
      stack: p.stack,
      lien: p.lien,
      github: p.github,
      image: p.image,
      images: p.images || [],
      video: p.video || "",
      featured: p.featured,
      status: p.status,
    });
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setError("");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "mikedevnomad/pro");
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
        if (json.url) urls.push(json.url);
      }
      if (urls.length > 0) {
        setForm((f) => ({ ...f, images: [...(f.images || []), ...urls] }));
      }
    } catch (err: any) {
      setError(`Upload échoué : ${err.message}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }


  async function handleSubmit() {
    if (!form.titre.trim()) { setError("Le titre est requis"); return; }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error || "Erreur serveur"); return; }
        setProjects((ps) => ps.map((p) => (p.id === editingId ? json : p)));
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error || "Erreur serveur"); return; }
        setProjects((ps) => [json, ...ps]);
      }
      cancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects((ps) => ps.filter((p) => p.id !== id));
  }

  async function toggleFeatured(p: Project) {
    const res = await fetch(`/api/admin/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    const updated = await res.json();
    setProjects((ps) => ps.map((x) => (x.id === p.id ? updated : x)));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#fff" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 40px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(7,7,16,0.9)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/admin/dashboard" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
            ← Dashboard
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>PRO Admin</span>
          <span style={{
            background: "rgba(0,255,153,0.1)",
            color: "#00ff99",
            fontSize: "10px",
            padding: "3px 8px",
            borderRadius: "20px",
            letterSpacing: "0.1em",
          }}>PRO</span>
        </div>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>
        {/* Sub-nav */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "36px" }}>
          {[
            { href: "/admin/pro/projects", label: "💻 Projets", active: true },
            { href: "/admin/pro/resume", label: "💼 Expériences" },
            { href: "/admin/pro/security", label: "🔐 CTF / Sécu" },
            { href: "/admin/pro/profile", label: "👤 Profil PRO" },
          ].map((s) => (
            <Link key={s.href} href={s.href} style={{
              textAlign: "center",
              padding: "12px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "13px",
              background: s.active ? "rgba(0,255,153,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${s.active ? "rgba(0,255,153,0.25)" : "rgba(255,255,255,0.07)"}`,
              color: s.active ? "#00ff99" : "rgba(255,255,255,0.4)",
            }}>
              {s.label}
            </Link>
          ))}
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>Projets</h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              {projects.length} projet{projects.length !== 1 ? "s" : ""} · {projects.filter((p) => p.featured).length} mis en avant
            </p>
          </div>
          {!showForm && (
            <button onClick={openCreate} style={{
              background: "#00ff99",
              color: "#0d1117",
              fontWeight: 700,
              fontSize: "13px",
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}>
              + Nouveau projet
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px",
            padding: "32px",
            marginBottom: "32px",
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>
              {editingId ? "Modifier le projet" : "Nouveau projet"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Titre *</label>
                <input value={form.titre} onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))} style={INPUT_STYLE} placeholder="Mon super projet" />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  style={{ ...INPUT_STYLE, minHeight: "100px", resize: "vertical" }} placeholder="Description du projet..." />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Stack technique</label>
                <TagInput tags={form.stack} onChange={(stack) => setForm((f) => ({ ...f, stack }))} placeholder="Next.js, TypeScript..." />
              </div>

              <div>
                <label style={LABEL_STYLE}>Lien live</label>
                <input value={form.lien} onChange={(e) => setForm((f) => ({ ...f, lien: e.target.value }))} style={INPUT_STYLE} placeholder="https://..." />
              </div>

              <div>
                <label style={LABEL_STYLE}>GitHub</label>
                <input value={form.github} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} style={INPUT_STYLE} placeholder="https://github.com/..." />
              </div>

              <div>
                <label style={LABEL_STYLE}>Statut</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Project["status"] }))}
                  style={{ ...INPUT_STYLE, cursor: "pointer" }}>
                  <option value="done">Done</option>
                  <option value="in-progress">In Progress</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "24px" }}>
                <label style={{ ...LABEL_STYLE, marginBottom: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))} style={{
                    width: "40px",
                    height: "22px",
                    borderRadius: "11px",
                    background: form.featured ? "#00ff99" : "rgba(255,255,255,0.1)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}>
                    <div style={{
                      position: "absolute",
                      top: "3px",
                      left: form.featured ? "21px" : "3px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: form.featured ? "#0d1117" : "rgba(255,255,255,0.4)",
                      transition: "left 0.2s",
                    }} />
                  </div>
                  <span>Featured</span>
                </label>
              </div>

              {/* Photos multiples */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Photos du projet (plusieurs acceptées)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
                    background: "rgba(0,255,153,0.08)", border: "1px solid rgba(0,255,153,0.2)",
                    borderRadius: "10px", color: "#00ff99", padding: "11px 20px",
                    cursor: uploading ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap",
                  }}>
                    {uploading ? "Upload..." : "📤 Ajouter des photos"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                    onChange={handleImageUpload} />
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
                    {(form.images || []).length} photo{(form.images || []).length !== 1 ? "s" : ""}
                  </span>
                </div>
                {(form.images || []).length > 0 && (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {(form.images || []).map((url, i) => (
                      <div key={i} style={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                        <img src={url} alt="" style={{ width: "100px", height: "70px", objectFit: "cover", display: "block" }} />
                        <button onClick={() => setForm((f) => ({ ...f, images: (f.images || []).filter((_, j) => j !== i) }))}
                          style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", width: "20px", height: "20px", borderRadius: "50%", cursor: "pointer", fontSize: "10px", padding: 0 }}>✕</button>
                        {i === 0 && <span style={{ position: "absolute", bottom: "4px", left: "4px", background: "rgba(0,0,0,0.7)", color: "#00ff99", fontSize: "9px", padding: "1px 5px", borderRadius: "4px" }}>Cover</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vidéo */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Vidéo de présentation (YouTube ou Vimeo)</label>
                <input value={form.video || ""} onChange={(e) => setForm((f) => ({ ...f, video: e.target.value }))}
                  style={INPUT_STYLE} placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..." />
                {form.video && (
                  <p style={{ color: "rgba(0,255,153,0.5)", fontSize: "11px", marginTop: "6px" }}>✓ Vidéo détectée — sera affichée en haut du modal</p>
                )}
              </div>
            </div>

            {error && <p style={{ color: "#ff5050", fontSize: "13px", marginTop: "16px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button onClick={handleSubmit} disabled={saving} style={{
                background: "#00ff99",
                color: "#0d1117",
                fontWeight: 700,
                fontSize: "13px",
                padding: "12px 28px",
                borderRadius: "10px",
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? "Sauvegarde..." : editingId ? "Mettre à jour" : "Créer le projet"}
              </button>
              <button onClick={cancelForm} style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                padding: "12px 20px",
                cursor: "pointer",
              }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Projects list */}
        {projects.length === 0 && !showForm ? (
          <div style={{
            textAlign: "center",
            padding: "80px 40px",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: "16px",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💻</div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px", marginBottom: "24px" }}>Aucun projet pour l'instant</p>
            <button onClick={openCreate} style={{
              background: "#00ff99", color: "#0d1117", fontWeight: 700,
              padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px",
            }}>
              Créer mon premier projet
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {projects.map((project) => (
              <div key={project.id} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                overflow: "hidden",
              }}>
                {/* Image */}
                <div style={{ height: "160px", background: "rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                  {project.image ? (
                    <img src={project.image} alt={project.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>💻</div>
                  )}
                  {project.featured && (
                    <span style={{
                      position: "absolute", top: "12px", right: "12px",
                      background: "#f59e0b", color: "#000",
                      fontSize: "10px", fontWeight: 700, padding: "3px 8px",
                      borderRadius: "20px",
                    }}>⭐ FEATURED</span>
                  )}
                  <span style={{
                    position: "absolute", bottom: "12px", left: "12px",
                    background: "rgba(0,0,0,0.7)",
                    color: STATUS_COLORS[project.status],
                    fontSize: "10px", fontWeight: 700, padding: "3px 8px",
                    borderRadius: "20px",
                  }}>
                    {STATUS_LABELS[project.status]}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>{project.titre}</h3>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", lineHeight: 1.6, marginBottom: "12px" }}>
                    {project.description ? project.description.slice(0, 90) + (project.description.length > 90 ? "..." : "") : "Pas de description"}
                  </p>

                  {/* Stack */}
                  {project.stack.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
                      {project.stack.slice(0, 5).map((tech) => (
                        <span key={tech} style={{
                          background: "rgba(0,255,153,0.07)",
                          color: "rgba(0,255,153,0.7)",
                          fontSize: "10px",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          fontFamily: "monospace",
                        }}>{tech}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => openEdit(project)} style={{
                      flex: 1,
                      padding: "9px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}>
                      ✏️ Modifier
                    </button>
                    <button onClick={() => toggleFeatured(project)} style={{
                      padding: "9px 12px",
                      background: project.featured ? "rgba(245,158,11,0.1)" : "transparent",
                      border: `1px solid ${project.featured ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "8px",
                      color: project.featured ? "#f59e0b" : "rgba(255,255,255,0.3)",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}>
                      ⭐
                    </button>
                    <button onClick={() => handleDelete(project.id)} style={{
                      padding: "9px 12px",
                      background: "transparent",
                      border: "1px solid rgba(255,80,80,0.15)",
                      borderRadius: "8px",
                      color: "rgba(255,80,80,0.5)",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
