"use client";

import { useState, KeyboardEvent } from "react";
import Link from "next/link";
import { CTFEntry } from "@/lib/ctf";

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

const DIFFICULTY_COLORS: Record<CTFEntry["difficulte"], string> = {
  Easy: "#00ff99",
  Medium: "#f59e0b",
  Hard: "#f97316",
  Insane: "#ef4444",
};

const EMPTY_FORM = {
  nom: "",
  categorie: "",
  difficulte: "Easy" as CTFEntry["difficulte"],
  plateforme: "",
  date: "",
  description: "",
  writeup: "",
  tags: [] as string[],
};

function TagInput({ tags, onChange, placeholder, color }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string; color?: string }) {
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
  const tagColor = color || "rgba(255,100,100,0.7)";
  const tagBg = color ? `${color}15` : "rgba(255,100,100,0.1)";
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
        <span key={tag} style={{ background: tagBg, color: tagColor, fontSize: "12px", padding: "3px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
          #{tag}
          <button onClick={() => onChange(tags.filter((t) => t !== tag))} style={{ background: "none", border: "none", color: tagColor, cursor: "pointer", padding: 0, fontSize: "12px", opacity: 0.6 }}>×</button>
        </span>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} onBlur={addTag}
        placeholder={placeholder || "Ajouter..."} style={{ background: "none", border: "none", color: "#fff", outline: "none", fontSize: "13px", minWidth: "120px", flex: 1 }} />
    </div>
  );
}

export default function SecurityAdminClient({ ctfEntries: initialEntries }: { ctfEntries: CTFEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
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

  function openEdit(e: CTFEntry) {
    setForm({
      nom: e.nom,
      categorie: e.categorie,
      difficulte: e.difficulte,
      plateforme: e.plateforme,
      date: e.date,
      description: e.description,
      writeup: e.writeup,
      tags: e.tags,
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
    if (!form.nom.trim()) { setError("Le nom est requis"); return; }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/ctf/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setEntries((es) => es.map((e) => (e.id === editingId ? updated : e)));
      } else {
        const res = await fetch("/api/admin/ctf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setEntries((es) => [created, ...es]);
      }
      cancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette entrée CTF ?")) return;
    await fetch(`/api/admin/ctf/${id}`, { method: "DELETE" });
    setEntries((es) => es.filter((e) => e.id !== id));
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
            { href: "/admin/pro/resume", label: "💼 Expériences" },
            { href: "/admin/pro/security", label: "🔐 CTF / Sécu", active: true },
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
            <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>CTF & Sécurité</h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              {entries.length} entrée{entries.length !== 1 ? "s" : ""}
            </p>
          </div>
          {!showForm && (
            <button onClick={openCreate} style={{
              background: "#00ff99", color: "#0d1117", fontWeight: 700,
              fontSize: "13px", padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer",
            }}>+ Nouvelle entrée CTF</button>
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
              {editingId ? "Modifier" : "Nouvelle entrée CTF"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={LABEL_STYLE}>Nom du challenge *</label>
                <input value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                  style={INPUT_STYLE} placeholder="HackTheBox — Sandworm" />
              </div>

              <div>
                <label style={LABEL_STYLE}>Plateforme</label>
                <input value={form.plateforme} onChange={(e) => setForm((f) => ({ ...f, plateforme: e.target.value }))}
                  style={INPUT_STYLE} placeholder="HackTheBox, TryHackMe..." />
              </div>

              <div>
                <label style={LABEL_STYLE}>Catégorie</label>
                <input value={form.categorie} onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
                  style={INPUT_STYLE} placeholder="Web, Pwn, Crypto, Forensics..." />
              </div>

              <div>
                <label style={LABEL_STYLE}>Difficulté</label>
                <select value={form.difficulte} onChange={(e) => setForm((f) => ({ ...f, difficulte: e.target.value as CTFEntry["difficulte"] }))}
                  style={{ ...INPUT_STYLE, cursor: "pointer" }}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Insane">Insane</option>
                </select>
                <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: DIFFICULTY_COLORS[form.difficulte] }} />
                  <span style={{ fontSize: "11px", color: DIFFICULTY_COLORS[form.difficulte] }}>{form.difficulte}</span>
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>Date</label>
                <input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  style={INPUT_STYLE} placeholder="2024-03" />
              </div>

              <div>
                <label style={LABEL_STYLE}>Writeup URL</label>
                <input value={form.writeup} onChange={(e) => setForm((f) => ({ ...f, writeup: e.target.value }))}
                  style={INPUT_STYLE} placeholder="https://..." />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  style={{ ...INPUT_STYLE, minHeight: "90px", resize: "vertical" }} placeholder="Brève description du challenge..." />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>Tags</label>
                <TagInput tags={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} placeholder="SSTI, SSRF, PrivEsc..." />
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
        {entries.length === 0 && !showForm && (
          <div style={{ textAlign: "center", padding: "80px 40px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px", marginBottom: "24px" }}>Aucun CTF enregistré</p>
            <button onClick={openCreate} style={{
              background: "#00ff99", color: "#0d1117", fontWeight: 700,
              padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px",
            }}>Ajouter un CTF</button>
          </div>
        )}

        {/* CTF cards grid */}
        {entries.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {entries.map((entry) => (
              <div key={entry.id} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "20px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{entry.nom}</h3>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>{entry.plateforme}{entry.categorie ? ` · ${entry.categorie}` : ""}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span style={{
                      background: `${DIFFICULTY_COLORS[entry.difficulte]}18`,
                      color: DIFFICULTY_COLORS[entry.difficulte],
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "20px",
                    }}>
                      {entry.difficulte}
                    </span>
                    {entry.date && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>{entry.date}</span>}
                  </div>
                </div>

                {entry.description && (
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", lineHeight: 1.6, marginBottom: "12px" }}>
                    {entry.description.slice(0, 100)}{entry.description.length > 100 ? "..." : ""}
                  </p>
                )}

                {entry.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
                    {entry.tags.map((tag) => (
                      <span key={tag} style={{ background: "rgba(255,100,100,0.08)", color: "rgba(255,100,100,0.7)", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontFamily: "monospace" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {entry.writeup && (
                  <a href={entry.writeup} target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-block", marginBottom: "14px",
                    color: "#00ff99", fontSize: "12px", textDecoration: "none",
                  }}>
                    📝 Writeup →
                  </a>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEdit(entry)} style={{
                    flex: 1, padding: "8px", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
                    color: "#fff", fontSize: "12px", cursor: "pointer", fontWeight: 600,
                  }}>✏️ Modifier</button>
                  <button onClick={() => handleDelete(entry.id)} style={{
                    padding: "8px 14px", background: "transparent",
                    border: "1px solid rgba(255,80,80,0.15)", borderRadius: "8px",
                    color: "rgba(255,80,80,0.5)", fontSize: "12px", cursor: "pointer",
                  }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
