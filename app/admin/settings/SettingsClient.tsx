"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const INPUT = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
  fontFamily: "var(--font-inter)",
};

const LABEL = {
  display: "block" as const,
  color: "rgba(255,255,255,0.35)",
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  marginBottom: "8px",
};

export default function SettingsClient() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(0,255,153,0.35)"; };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) { setStatus({ type: "error", msg: "Les mots de passe ne correspondent pas" }); return; }
    setLoading(true);
    setStatus(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus({ type: "success", msg: "Mot de passe mis à jour !" });
      setCurrent(""); setNext(""); setConfirm("");
    } else {
      setStatus({ type: "error", msg: data.error });
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#fff", fontFamily: "var(--font-inter)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "13px" }}>
            ← Dashboard
          </Link>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>Paramètres</span>
        </div>
        <Image src="/images/mikedev_white.png" alt="Logo" width={28} height={28} style={{ objectFit: "contain" }} />
      </header>

      <main style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 40px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>Paramètres</h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "40px" }}>Gérer ton accès admin.</p>

        {/* Change password */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          padding: "28px",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px" }}>🔑 Changer le mot de passe</h2>

          {status && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              background: status.type === "success" ? "rgba(0,255,153,0.08)" : "rgba(255,80,80,0.08)",
              border: `1px solid ${status.type === "success" ? "rgba(0,255,153,0.2)" : "rgba(255,80,80,0.2)"}`,
              color: status.type === "success" ? "#00ff99" : "#ff5050",
              fontSize: "13px",
            }}>
              {status.type === "success" ? "✅" : "⚠️"} {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={LABEL}>Mot de passe actuel</label>
              <input type="password" style={INPUT} value={current} onChange={(e) => setCurrent(e.target.value)}
                placeholder="••••••••" onFocus={focus} onBlur={blur} required />
            </div>
            <div>
              <label style={LABEL}>Nouveau mot de passe</label>
              <input type="password" style={INPUT} value={next} onChange={(e) => setNext(e.target.value)}
                placeholder="Min. 8 caractères" onFocus={focus} onBlur={blur} required />
            </div>
            <div>
              <label style={LABEL}>Confirmer</label>
              <input type="password" style={INPUT} value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••" onFocus={focus} onBlur={blur} required />
            </div>
            <button type="submit" disabled={loading} style={{
              background: loading ? "rgba(0,255,153,0.4)" : "#00ff99",
              color: "#0d1117", fontWeight: 700, fontSize: "13px",
              padding: "12px", borderRadius: "10px", border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px", transition: "transform 0.15s",
            }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              {loading ? "Mise à jour..." : "Mettre à jour →"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
