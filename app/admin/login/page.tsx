"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Mot de passe incorrect");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-inter)",
    }}>
      {/* Glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(0,255,153,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "0 24px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Image src="/images/mikedev_white.png" alt="Logo" width={52} height={52}
            style={{ objectFit: "contain", marginBottom: "16px" }} />
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
            Admin Studio
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "40px",
        }}>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "8px", letterSpacing: "-0.02em" }}>
            Connexion
          </h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "32px" }}>
            Accès réservé à Mike.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px", fontFamily: "var(--font-mono)" }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${error ? "rgba(255,80,80,0.4)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { if (!error) e.target.style.borderColor = "rgba(0,255,153,0.3)"; }}
                onBlur={(e) => { e.target.style.borderColor = error ? "rgba(255,80,80,0.4)" : "rgba(255,255,255,0.08)"; }}
              />
              {error && <p style={{ color: "#ff5050", fontSize: "12px", marginTop: "8px" }}>{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading ? "rgba(0,255,153,0.4)" : "#00ff99",
                color: "#0d1117",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.06em",
                border: "none",
                borderRadius: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s, transform 0.1s",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              {loading ? "Connexion..." : "Entrer →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
