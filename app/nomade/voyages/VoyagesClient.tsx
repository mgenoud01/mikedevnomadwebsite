"use client";

import Link from "next/link";
import { Voyage } from "@/lib/voyages";

export default function VoyagesClient({ voyages }: { voyages: Voyage[] }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "72px 32px 96px" }}>

      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <h1 style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900,
          letterSpacing: "-0.04em", color: "#1c1917", lineHeight: 0.95, marginBottom: "16px",
        }}>
          Trips
        </h1>
        <p style={{ color: "rgba(28,25,23,0.45)", fontSize: "15px", lineHeight: 1.7, maxWidth: "420px" }}>
          Stories and practical tips for coding around the world.
        </p>
      </div>

      {voyages.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 40px",
          border: "2px dashed rgba(245,158,11,0.2)", borderRadius: "16px",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✈️</div>
          <p style={{ color: "rgba(28,25,23,0.4)", fontSize: "16px" }}>
            No trips published yet.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {voyages.map((v) => (
            <Link key={v.id} href={`/nomade/voyages/${v.slug}`} style={{ textDecoration: "none" }}>
              <article style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                display: "grid",
                gridTemplateColumns: v.photoCouverture ? "280px 1fr" : "1fr",
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                }}
              >
                {/* Cover photo */}
                {v.photoCouverture && (
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={v.photoCouverture} alt={v.titre}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    {v.miseEnAvant && (
                      <span style={{
                        position: "absolute", top: "12px", left: "12px",
                        background: "#f59e0b", color: "#fff",
                        fontSize: "10px", fontWeight: 700, padding: "4px 10px",
                        borderRadius: "20px", letterSpacing: "0.05em",
                      }}>⭐ À LA UNE</span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {/* Accent top bar (no photo) */}
                  {!v.photoCouverture && (
                    <div style={{ height: "3px", background: "#f59e0b", marginBottom: "20px", borderRadius: "2px", width: "40px" }} />
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "32px" }}>{v.emoji || "🌍"}</span>
                    <div>
                      <h2 style={{ color: "#1c1917", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.03em", marginBottom: "2px" }}>
                        {v.titre}
                      </h2>
                      <p style={{ fontFamily: "var(--font-mono)", color: "rgba(28,25,23,0.35)", fontSize: "11px", letterSpacing: "0.06em" }}>
                        {v.pays}{v.dateDebut ? ` · ${new Date(v.dateDebut).getFullYear()}` : ""}
                        {v.budgetJour ? ` · ~${v.budgetJour}€/jour` : ""}
                      </p>
                    </div>
                  </div>

                  {v.resume && (
                    <p style={{ color: "rgba(28,25,23,0.5)", fontSize: "14px", lineHeight: 1.75, marginBottom: "16px" }}>
                      {v.resume.slice(0, 140)}{v.resume.length > 140 ? "…" : ""}
                    </p>
                  )}

                  {/* Hashtags */}
                  {v.hashtags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                      {v.hashtags.slice(0, 4).map((tag) => (
                        <span key={tag} style={{
                          padding: "4px 10px", borderRadius: "100px",
                          border: "1px solid rgba(245,158,11,0.25)",
                          background: "rgba(245,158,11,0.06)",
                          color: "#b45309", fontSize: "11px", fontFamily: "var(--font-mono)",
                        }}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b" }}>
                    Read the story →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
