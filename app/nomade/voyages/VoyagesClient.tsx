"use client";

import Link from "next/link";
import { Voyage } from "@/lib/voyages";

export default function VoyagesClient({ voyages }: { voyages: Voyage[] }) {
  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh" }}>
    <div className="page-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "72px 32px 96px" }}>

      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <h1 className="font-display" style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700,
          letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 0.95, marginBottom: "16px",
        }}>
          Trips
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.7, maxWidth: "420px" }}>
          Stories and practical tips for coding around the world.
        </p>
      </div>

      {voyages.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 40px",
          border: "2px dashed var(--line)", borderRadius: "16px",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✈️</div>
          <p style={{ color: "var(--muted)", fontSize: "16px" }}>
            No trips published yet.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {voyages.map((v) => (
            <Link key={v.id} href={`/nomade/voyages/${v.slug}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]" style={{ textDecoration: "none" }}>
              <article className={v.photoCouverture ? "trip-card" : ""} style={{
                background: "var(--panel-2)",
                border: "1px solid var(--line)",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "transform 0.2s ease, border-color 0.2s ease",
                display: "grid",
                gridTemplateColumns: v.photoCouverture ? "280px 1fr" : "1fr",
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-3px)";
                  el.style.borderColor = "var(--mint)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "var(--line)";
                }}
              >
                {/* Cover photo */}
                {v.photoCouverture && (
                  <div className="trip-img" style={{ position: "relative", overflow: "hidden", minHeight: "200px" }}>
                    <img src={v.photoCouverture} alt={v.titre}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }} />
                    {v.miseEnAvant && (
                      <span style={{
                        position: "absolute", top: "12px", left: "12px",
                        background: "var(--mint)", color: "var(--ink)",
                        fontSize: "10px", fontWeight: 700, padding: "4px 10px",
                        borderRadius: "20px", letterSpacing: "0.05em",
                      }}>⭐ FEATURED</span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="trip-content-pad" style={{ padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {/* Accent top bar (no photo) */}
                  {!v.photoCouverture && (
                    <div style={{ height: "3px", background: "var(--mint)", marginBottom: "20px", borderRadius: "2px", width: "40px" }} />
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "32px" }}>{v.emoji || "🌍"}</span>
                    <div>
                      <h2 className="font-display" style={{ color: "#ffffff", fontWeight: 700, fontSize: "20px", letterSpacing: "-0.03em", marginBottom: "2px" }}>
                        {v.titre}
                      </h2>
                      <p style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "11px", letterSpacing: "0.06em" }}>
                        {v.pays}{v.dateDebut ? ` · ${new Date(v.dateDebut).getFullYear()}` : ""}
                        {v.budgetJour ? ` · ~${v.budgetJour}€/day` : ""}
                      </p>
                    </div>
                  </div>

                  {v.resume && (
                    <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.75, marginBottom: "16px" }}>
                      {v.resume.slice(0, 140)}{v.resume.length > 140 ? "…" : ""}
                    </p>
                  )}

                  {/* Hashtags */}
                  {v.hashtags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                      {v.hashtags.slice(0, 4).map((tag) => (
                        <span key={tag} style={{
                          padding: "4px 10px", borderRadius: "100px",
                          border: "1px solid rgba(95,211,188,0.25)",
                          background: "rgba(95,211,188,0.07)",
                          color: "var(--mint)", fontSize: "11px", fontFamily: "var(--font-mono)",
                        }}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--mint)" }}>
                    Read the story →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
