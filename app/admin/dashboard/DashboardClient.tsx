"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Voyage } from "@/lib/voyages";

export default function DashboardClient({ voyages: initialVoyages }: { voyages: Voyage[] }) {
  const [voyages, setVoyages] = useState(initialVoyages);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce voyage ?")) return;
    await fetch(`/api/admin/voyages/${id}`, { method: "DELETE" });
    setVoyages((v) => v.filter((voyage) => voyage.id !== id));
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
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Image src="/images/mikedev_white.png" alt="Logo" width={30} height={30} style={{ objectFit: "contain" }} />
          <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>Admin Studio</span>
          <span style={{
            background: "rgba(0,255,153,0.1)",
            color: "#00ff99",
            fontSize: "10px",
            padding: "3px 8px",
            borderRadius: "20px",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-mono)",
          }}>NOMADE</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/admin/settings" style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "12px",
            textDecoration: "none",
            padding: "7px 14px",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "8px",
            transition: "all 0.15s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"; }}
          >
            ⚙️ Paramètres
          </Link>
          <Link href="/nomade" target="_blank" style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "12px",
            textDecoration: "none",
            padding: "7px 14px",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "8px",
            transition: "all 0.15s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"; }}
          >
            Voir le site →
          </Link>
          <button onClick={handleLogout} style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.3)",
            fontSize: "12px",
            padding: "7px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ff5050"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,80,80,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 40px" }}>

        {/* ── Sections nav ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "40px" }}>
          {[
            { href: "/admin/dashboard", label: "✈️ Voyages", active: true },
            { href: "/admin/galerie", label: "📸 Galerie" },
            { href: "/admin/nomade", label: "📱 Réseaux" },
            { href: "/admin/pro/projects", label: "💻 PRO" },
          ].map((s) => (
            <Link key={s.href} href={s.href} style={{ textAlign: "center", padding: "14px", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "13px", background: s.active ? "rgba(0,255,153,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${s.active ? "rgba(0,255,153,0.25)" : "rgba(255,255,255,0.07)"}`, color: s.active ? "#00ff99" : "rgba(255,255,255,0.4)", transition: "all 0.15s" }}>
              {s.label}
            </Link>
          ))}
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>
              Mes Voyages
            </h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              {voyages.length} voyage{voyages.length > 1 ? "s" : ""} publiés
            </p>
          </div>
          <Link href="/admin/voyages/new" style={{
            background: "#00ff99",
            color: "#0d1117",
            fontWeight: 700,
            fontSize: "13px",
            padding: "12px 24px",
            borderRadius: "10px",
            textDecoration: "none",
            letterSpacing: "0.03em",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.15s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
          >
            + Nouveau voyage
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Total voyages", value: voyages.length, color: "#00ff99" },
            { label: "Mis en avant", value: voyages.filter((v) => v.miseEnAvant).length, color: "#f59e0b" },
            { label: "Pays visités", value: new Set(voyages.map((v) => v.pays)).size, color: "#818cf8" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "24px",
            }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: stat.color, marginBottom: "6px" }}>
                {stat.value}
              </div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Voyages grid */}
        {voyages.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 40px",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: "16px",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✈️</div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px", marginBottom: "24px" }}>
              Aucun voyage pour l'instant
            </p>
            <Link href="/admin/voyages/new" style={{
              background: "#00ff99", color: "#0d1117", fontWeight: 700,
              padding: "12px 28px", borderRadius: "10px", textDecoration: "none", fontSize: "13px",
            }}>
              Créer mon premier voyage
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {voyages.map((voyage) => (
              <div key={voyage.id} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                {/* Cover */}
                <div style={{ height: "160px", background: "rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
                  {voyage.photoCouverture ? (
                    <img src={voyage.photoCouverture} alt={voyage.titre}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                      {voyage.emoji || "🌍"}
                    </div>
                  )}
                  {voyage.miseEnAvant && (
                    <span style={{
                      position: "absolute", top: "12px", right: "12px",
                      background: "#f59e0b", color: "#000",
                      fontSize: "10px", fontWeight: 700, padding: "3px 8px",
                      borderRadius: "20px", letterSpacing: "0.05em",
                    }}>⭐ À LA UNE</span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "18px" }}>{voyage.emoji}</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>{voyage.pays}</span>
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", letterSpacing: "-0.01em" }}>
                    {voyage.titre}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", lineHeight: 1.6, marginBottom: "16px" }}>
                    {voyage.resume ? voyage.resume.slice(0, 80) + "..." : "Pas de résumé"}
                  </p>

                  {/* Tags */}
                  {voyage.hashtags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                      {voyage.hashtags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{
                          background: "rgba(0,255,153,0.07)",
                          color: "rgba(0,255,153,0.6)",
                          fontSize: "10px",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          fontFamily: "var(--font-mono)",
                        }}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link href={`/admin/voyages/${voyage.id}/edit`} style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "9px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                      textDecoration: "none",
                      fontWeight: 600,
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)"; }}
                    >
                      ✏️ Modifier
                    </Link>
                    <button onClick={() => handleDelete(voyage.id)} style={{
                      padding: "9px 14px",
                      background: "transparent",
                      border: "1px solid rgba(255,80,80,0.15)",
                      borderRadius: "8px",
                      color: "rgba(255,80,80,0.5)",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,80,80,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#ff5050"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,80,80,0.5)"; }}
                    >
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
