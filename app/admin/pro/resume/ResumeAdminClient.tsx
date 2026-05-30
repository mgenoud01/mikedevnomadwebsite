"use client";

import { useState, KeyboardEvent } from "react";
import Link from "next/link";
import { Experience } from "@/lib/experience";

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

const EMPTY_FORM = {
  entreprise: "",
  poste: "",
  dateDebut: "",
  dateFin: "",
  lieu: "",
  description: "",
  competences: [] as string[],
  actuel: false,
  type: "work" as Experience["type"],
};

function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  function addTag() {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  }
  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
    else if (e.key === "Backspace" && !input && tags.length > 0) onChange(tags.slice(0, -1));
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
        <span key={tag} style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
          {tag}
          <button onClick={() => onChange(tags.filter((t) => t !== tag))} style={{ background: "none", border: "none", color: "rgba(129,140,248,0.5)", cursor: "pointer", padding: 0, fontSize: "12px" }}>×</button>
        </span>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} onBlur={addTag}
        placeholder={placeholder || "Ajouter..."} style={{ background: "none", border: "none", color: "#fff", outline: "none", fontSize: "13px", minWidth: "120px", flex: 1 }} />
    </div>
  );
}

export default function ResumeAdminClient({ experiences: initialExperiences }: { experiences: Experience[] }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(e: Experience) {
    setForm({
      entreprise: e.entreprise,
      poste: e.poste,
      dateDebut: e.dateDebut,
      dateFin: e.dateFin,
      lieu: e.lieu,
      description: e.description,
      competences: e.competences,
      actuel: e.actuel,
      type: e.type,
    });
    setEditingId(e.id);
    setShowForm(true);
    setError("");
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setError("");
  }

  async function handleSubmit() {
    if (!form.entreprise.trim() || !form.poste.trim()) { setError("Entreprise et poste sont requis"); return; }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/experiences/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error || "Erreur serveur"); return; }
        setExperiences((es) => es.map((e) => (e.id === editingId ? json : e)));
      } else {
        const res = await fetch("/api/admin/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error || "Erreur serveur"); return; }
        setExperiences((es) => [json, ...es]);
      }
      cancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette expérience ?")) return;
    await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
    setExperiences((es) => es.filter((e) => e.id !== id));
  }

  const workExperiences = experiences.filter((e) => e.type === "work").sort((a, b) => b.dateDebut.localeCompare(a.dateDebut));
  const educationExperiences = experiences.filter((e) => e.type === "education").sort((a, b) => b.dateDebut.localeCompare(a.dateDebut));

  function renderCard(exp: Experience) {
    return (
      <div key={exp.id} style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{exp.poste}</h3>
              {exp.actuel && (
                <span style={{ background: "rgba(0,255,153,0.1)", color: "#00ff99", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: 700 }}>
                  EN COURS
                </span>
              )}
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{exp.entreprise} · {exp.lieu}</p>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", whiteSpace: "nowrap" }}>
            {exp.dateDebut} → {exp.actuel ? "Présent" : exp.dateFin}
          </span>
        </div>
        {exp.description && (
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: 1.6, marginBottom: "12px" }}>
            {exp.description}
          </p>
        )}
        {exp.competences.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
            {exp.competences.map((c) => (
              <span key={c} style={{ background: "rgba(129,140,248,0.1)", color: "#818cf8", fontSize: "10px", padding: "3px 8px", borderRadius: "20px" }}>{c}</span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => openEdit(exp)} style={{
            flex: 1, padding: "8px", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
            color: "#fff", fontSize: "12px", cursor: "pointer", fontWeight: 600,
          }}>✏️ Modifier</button>
          <button onClick={() => handleDelete(exp.id)} style={{
            padding: "8px 14px", background: "transparent",
            border: "1px solid rgba(255,80,80,0.15)", borderRadius: "8px",
            color: "rgba(255,80,80,0.5)", fontSize: "12px", cursor: "pointer",
          }}>🗑️</button>
        </div>
      </div>
    );
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
        gap: "20px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(7,7,16,0.9)",
        backdropFilter: "blur(12px)",
      }}>
        <Link href="/admin/dashboard" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px" }}>← Dashboard</Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
        <span style={{ fontWeight: 700, fontSize: "15px" }}>PRO Admin</span>
        <span style={{ background: "rgba(0,255,153,0.1)", color: "#00ff99", fontSize: "10px", padding: "3px 8px", borderRadius: "20px" }}>PRO</span>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>
        {/* Sub-nav */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "36px" }}>
          {[
            { href: "/admin/pro/projects", label: "💻 Projets" },
            { href: "/admin/pro/resume", label: "💼 Expériences", active: true },
            { href: "/admin/pro/security", label: "🔐 CTF / Sécu" },
            { href: "/admin/pro/profile", label: "👤 Profil PRO" },
          ].map((s) => (
            <Link key={s.href} href={s.href} style={{
              textAlign: "center", padding: "12px", borderRadius: "10px",
              textDecoration: "none", fontWeight: 700, fontSize: "13px",
              background: s.active ? "rgba(0,255,153,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${s.active ? "rgba(0,255,153,0.25)" : "rgba(255,255,255,0.07)"}`,
              color: s.active ? "#00ff99" : "rgba(255,255,255,0.4)",
            }}>{s.label}</Link>
          ))}
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>Expériences & Formation</h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              {workExperiences.length} expérience{workExperiences.length !== 1 ? "s" : ""} · {educationExperiences.length} formation{educationExperiences.length !== 1 ? "s" : ""}
            </p>
          </div>
          {!showForm && (
            <button onClick={openCreate} style={{
              background: "#00ff99", color: "#0d1117", fontWeight: 700,
              fontSize: "13px", padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer",
            }}>
              + Nouvelle entrée
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
              {editingId ? "Modifier" : "Nouvelle entrée"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={LABEL_STYLE}>Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Experience["type"] }))}
                  style={{ ...INPUT_STYLE, cursor: "pointer" }}>
                  <option value="work">Expérience professionnelle</option>
                  <option value="education">Formation / Éducation</option>
                </select>
              </div>

              <div>
                <label style={LABEL_STYLE}>Entreprise / Établissement *</label>
                <input value={form.entreprise} onChange={(e) => setForm((f) => ({ ...f, entreprise: e.target.value }))}
                  style={INPUT_STYLE} placeholder="Nom de l'entreprise" />
              </div>

              <div>
                <label style={LABEL_STYLE}>Poste / Diplôme *</label>
                <input value={form.poste} onChange={(e) => setForm((f) => ({ ...f, poste: e.target.value }))}
                  style={INPUT_STYLE} placeholder="Développeur Full-Stack" />
              </div>

              <div>
                <label style={LABEL_STYLE}>Lieu</label>
                <input value={form.lieu} onChange={(e) => setForm((f) => ({ ...f, lieu: e.target.value }))}
                  style={INPUT_STYLE} placeholder="Paris, France" />
              </div>

              <div>
                <label style={LABEL_STYLE}>Date de début</label>
                <input value={form.dateDebut} onChange={(e) => setForm((f) => ({ ...f, dateDebut: e.target.value }))}
                  style={INPUT_STYLE} placeholder="Jan 2022" />
              </div>

              <div>
                <label style={LABEL_STYLE}>Date de fin</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input value={form.dateFin} onChange={(e) => setForm((f) => ({ ...f, dateFin: e.target.value }))}
                    disabled={form.actuel} style={{ ...INPUT_STYLE, flex: 1, opacity: form.actuel ? 0.4 : 1 }} placeholder="Déc 2023" />
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", whiteSpace: "nowrap" }}>
                    <div onClick={() => setForm((f) => ({ ...f, actuel: !f.actuel }))} style={{
                      width: "36px", height: "20px", borderRadius: "10px",
                      background: form.actuel ? "#00ff99" : "rgba(255,255,255,0.1)",
                      position: "relative", cursor: "pointer", transition: "background 0.2s",
                    }}>
                      <div style={{
                        position: "absolute", top: "3px",
                        left: form.actuel ? "18px" : "3px",
                        width: "14px", height: "14px", borderRadius: "50%",
                        background: form.actuel ? "#0d1117" : "rgba(255,255,255,0.4)",
                        transition: "left 0.2s",
                      }} />
                    </div>
                    <span style={{ ...LABEL_STYLE, marginBottom: 0 }}>En cours</span>
                  </label>
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  style={{ ...INPUT_STYLE, minHeight: "90px", resize: "vertical" }} placeholder="Description du rôle ou de la formation..." />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Compétences</label>
                <TagInput tags={form.competences} onChange={(competences) => setForm((f) => ({ ...f, competences }))} placeholder="React, TypeScript..." />
              </div>
            </div>

            {error && <p style={{ color: "#ff5050", fontSize: "13px", marginTop: "16px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button onClick={handleSubmit} disabled={saving} style={{
                background: "#00ff99", color: "#0d1117", fontWeight: 700, fontSize: "13px",
                padding: "12px 28px", borderRadius: "10px", border: "none",
                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
              }}>
                {saving ? "Sauvegarde..." : editingId ? "Mettre à jour" : "Créer"}
              </button>
              <button onClick={cancelForm} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "rgba(255,255,255,0.5)", fontSize: "13px",
                padding: "12px 20px", cursor: "pointer",
              }}>Annuler</button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {experiences.length === 0 && !showForm && (
          <div style={{ textAlign: "center", padding: "80px 40px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💼</div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px", marginBottom: "24px" }}>Aucune expérience ajoutée</p>
            <button onClick={openCreate} style={{
              background: "#00ff99", color: "#0d1117", fontWeight: 700,
              padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px",
            }}>Ajouter une expérience</button>
          </div>
        )}

        {/* Work section */}
        {workExperiences.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
              💼 Expériences professionnelles
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {workExperiences.map(renderCard)}
            </div>
          </div>
        )}

        {/* Education section */}
        {educationExperiences.length > 0 && (
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
              🎓 Formation
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {educationExperiences.map(renderCard)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
