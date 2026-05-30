"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const INPUT: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "var(--font-inter)",
};
const LABEL: React.CSSProperties = {
  display: "block", color: "rgba(255,255,255,0.35)", fontSize: "11px",
  letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px",
};

export default function NomadeAdminPage() {
  const [tiktok, setTiktok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/nomadeProfile")
      .then((r) => r.json())
      .then((d) => { setTiktok(d.tiktok || ""); setInstagram(d.instagram || ""); })
      .catch(() => {});
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/nomadeProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tiktok, instagram }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Erreur"); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Erreur réseau"); }
    finally { setSaving(false); }
  }

  const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(245,158,11,0.4)"; };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#fff", fontFamily: "var(--font-inter)" }}>
      <header style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10, background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "13px" }}>← Dashboard</Link>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>🌍 Profil Nomade</span>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          background: saved ? "rgba(0,255,153,0.2)" : saving ? "rgba(245,158,11,0.4)" : "#f59e0b",
          color: "#0d1117", fontWeight: 700, fontSize: "13px",
          padding: "10px 24px", borderRadius: "10px", border: "none", cursor: saving ? "not-allowed" : "pointer",
        }}>
          {saved ? "✓ Sauvegardé" : saving ? "Sauvegarde..." : "💾 Sauvegarder"}
        </button>
      </header>

      {/* Nav nomade */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 40px", display: "flex", gap: "4px" }}>
        {[
          { href: "/admin/dashboard", label: "✈️ Voyages" },
          { href: "/admin/blog", label: "✍️ Blog" },
          { href: "/admin/galerie", label: "📸 Galerie" },
          { href: "/admin/nomade", label: "📱 Réseaux", active: true },
        ].map((s) => (
          <Link key={s.href} href={s.href} style={{ padding: "10px 16px", fontSize: "12px", fontWeight: (s as any).active ? 700 : 500, textDecoration: "none", color: (s as any).active ? "#f59e0b" : "rgba(255,255,255,0.35)", borderBottom: (s as any).active ? "2px solid #f59e0b" : "2px solid transparent", transition: "color 0.15s" }}>
            {s.label}
          </Link>
        ))}
      </div>

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 40px" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "0" }}>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "32px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "24px" }}>
              📱 Réseaux sociaux Nomade
            </h2>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "28px", lineHeight: 1.6 }}>
              Ces liens apparaissent en évidence sur la page d'accueil Nomade.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={LABEL}>🎵 TikTok</label>
                <input value={tiktok} onChange={(e) => setTiktok(e.target.value)}
                  style={INPUT} placeholder="https://tiktok.com/@tonpseudo"
                  onFocus={focus} onBlur={blur} />
                {tiktok && (
                  <a href={tiktok} target="_blank" rel="noopener noreferrer"
                    style={{ color: "rgba(245,158,11,0.6)", fontSize: "11px", marginTop: "6px", display: "block" }}>
                    ↗ Voir le profil
                  </a>
                )}
              </div>

              <div>
                <label style={LABEL}>📸 Instagram</label>
                <input value={instagram} onChange={(e) => setInstagram(e.target.value)}
                  style={INPUT} placeholder="https://instagram.com/tonpseudo"
                  onFocus={focus} onBlur={blur} />
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer"
                    style={{ color: "rgba(245,158,11,0.6)", fontSize: "11px", marginTop: "6px", display: "block" }}>
                    ↗ Voir le profil
                  </a>
                )}
              </div>
            </div>

            {error && (
              <p style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "16px", background: "rgba(255,60,60,0.08)", padding: "10px 14px", borderRadius: "8px" }}>
                ⚠️ {error}
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
