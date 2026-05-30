"use client";

import { useState, KeyboardEvent } from "react";
import Link from "next/link";
import { ProProfile } from "@/lib/proProfile";

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
        <span key={tag} style={{
          background: "rgba(0,255,153,0.1)",
          color: "#00ff99",
          fontSize: "12px",
          padding: "3px 10px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "monospace",
        }}>
          {tag}
          <button onClick={() => onChange(tags.filter((t) => t !== tag))} style={{ background: "none", border: "none", color: "rgba(0,255,153,0.5)", cursor: "pointer", padding: 0, fontSize: "12px" }}>×</button>
        </span>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} onBlur={addTag}
        placeholder={placeholder || "Ajouter..."} style={{ background: "none", border: "none", color: "#fff", outline: "none", fontSize: "13px", minWidth: "120px", flex: 1 }} />
    </div>
  );
}

export default function ProfileAdminClient({ profile: initialProfile }: { profile: ProProfile }) {
  const [form, setForm] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/proProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { setError("Erreur lors de la sauvegarde"); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
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
            { href: "/admin/pro/security", label: "🔐 CTF / Sécu" },
            { href: "/admin/pro/profile", label: "👤 Profil PRO", active: true },
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

        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>Profil PRO</h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Informations affichées sur votre page portfolio professionnelle</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "32px",
            marginBottom: "24px",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
              Présentation
            </h2>
            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label style={LABEL_STYLE}>Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  style={{ ...INPUT_STYLE, minHeight: "120px", resize: "vertical" }}
                  placeholder="Décrivez-vous en quelques phrases..." />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>Disponible pour missions</label>
                <div onClick={() => setForm((f) => ({ ...f, disponible: !f.disponible }))} style={{
                  width: "48px", height: "26px", borderRadius: "13px",
                  background: form.disponible ? "#00ff99" : "rgba(255,255,255,0.1)",
                  position: "relative", cursor: "pointer", transition: "background 0.2s",
                }}>
                  <div style={{
                    position: "absolute", top: "4px",
                    left: form.disponible ? "25px" : "4px",
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: form.disponible ? "#0d1117" : "rgba(255,255,255,0.4)",
                    transition: "left 0.2s",
                  }} />
                </div>
                <span style={{ fontSize: "13px", color: form.disponible ? "#00ff99" : "rgba(255,255,255,0.3)" }}>
                  {form.disponible ? "Disponible" : "Non disponible"}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "32px",
            marginBottom: "24px",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
              Statistiques
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              <div>
                <label style={LABEL_STYLE}>Années d'expérience</label>
                <input type="number" min={0} value={form.yearsExp}
                  onChange={(e) => setForm((f) => ({ ...f, yearsExp: parseInt(e.target.value) || 0 }))}
                  style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Projets livrés</label>
                <input type="number" min={0} value={form.projectsShipped}
                  onChange={(e) => setForm((f) => ({ ...f, projectsShipped: parseInt(e.target.value) || 0 }))}
                  style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Podiums CTF</label>
                <input type="number" min={0} value={form.ctfPodiums}
                  onChange={(e) => setForm((f) => ({ ...f, ctfPodiums: parseInt(e.target.value) || 0 }))}
                  style={INPUT_STYLE} />
              </div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "32px",
            marginBottom: "24px",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
              Liens & Contact
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={LABEL_STYLE}>Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={INPUT_STYLE} placeholder="contact@example.com" />
              </div>
              <div>
                <label style={LABEL_STYLE}>GitHub</label>
                <input value={form.github}
                  onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                  style={INPUT_STYLE} placeholder="https://github.com/username" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={LABEL_STYLE}>LinkedIn</label>
                <input value={form.linkedin}
                  onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                  style={INPUT_STYLE} placeholder="https://linkedin.com/in/username" />
              </div>
              <div>
                <label style={LABEL_STYLE}>🎵 TikTok</label>
                <input value={(form as any).tiktok || ""}
                  onChange={(e) => setForm((f) => ({ ...f, tiktok: e.target.value } as any))}
                  style={INPUT_STYLE} placeholder="https://tiktok.com/@username" />
              </div>
              <div>
                <label style={LABEL_STYLE}>📸 Instagram</label>
                <input value={(form as any).instagram || ""}
                  onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value } as any))}
                  style={INPUT_STYLE} placeholder="https://instagram.com/username" />
              </div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "32px",
            marginBottom: "24px",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
              Compétences techniques
            </h2>
            <TagInput
              tags={form.skills}
              onChange={(skills) => setForm((f) => ({ ...f, skills }))}
              placeholder="TypeScript, Rust, Docker..."
            />
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "8px" }}>
              Appuyez sur Entrée ou virgule pour ajouter une compétence
            </p>
          </div>

          {error && (
            <p style={{ color: "#ff5050", fontSize: "13px", marginBottom: "16px" }}>{error}</p>
          )}

          {saved && (
            <div style={{
              background: "rgba(0,255,153,0.08)",
              border: "1px solid rgba(0,255,153,0.2)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "16px",
              color: "#00ff99",
              fontSize: "13px",
            }}>
              ✓ Profil sauvegardé avec succès
            </div>
          )}

          <button type="submit" disabled={saving} style={{
            background: "#00ff99",
            color: "#0d1117",
            fontWeight: 700,
            fontSize: "14px",
            padding: "14px 36px",
            borderRadius: "10px",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Sauvegarde en cours..." : "Sauvegarder le profil"}
          </button>
        </form>
      </main>
    </div>
  );
}
