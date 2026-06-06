"use client";

import Link from "next/link";
import { Voyage } from "@/lib/voyages";

const sections = [
  { href: "/nomade/voyages", label: "Trips", desc: "Stories, tips & itineraries", icon: "✈️", accent: "#f59e0b" },
  { href: "/nomade/galerie", label: "Gallery", desc: "Photos from around the world", icon: "📸", accent: "#0d9488" },
];

export default function NomadeHomeClient({ voyages, tiktok = "", instagram = "" }: { voyages: Voyage[]; tiktok?: string; instagram?: string }) {
  // Pays uniques depuis les vrais voyages
  const pays = Array.from(new Set(voyages.map((v) => v.pays))).slice(0, 8);
  const featured = voyages.filter((v) => v.miseEnAvant).slice(0, 3);
  const recent = voyages.slice(0, 3);
  const displayed = featured.length > 0 ? featured : recent;

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero-pad inner-pad" style={{ position: "relative", overflow: "hidden", padding: "96px 32px 80px" }}>
        <div className="animate-float" style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: "500px", height: "500px",
          background: "rgba(245,158,11,0.14)", borderRadius: "50%",
          filter: "blur(100px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-5%",
          width: "400px", height: "400px",
          background: "rgba(13,148,136,0.12)", borderRadius: "50%",
          filter: "blur(80px)", pointerEvents: "none",
          animation: "float 8s ease-in-out infinite 2s reverse",
        }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 18px", borderRadius: "100px",
            border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.07)",
            marginBottom: "32px",
          }}>
            <span style={{ fontSize: "14px" }}>🗺️</span>
            <span style={{ color: "#b45309", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Currently somewhere in the world
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, lineHeight: 0.92,
            letterSpacing: "-0.05em", color: "#1c1917", marginBottom: "28px",
          }}>
            Developer &<br />
            <span className="text-gradient-nomade">World Traveler.</span>
          </h1>

          <p style={{ color: "rgba(28,25,23,0.45)", fontSize: "17px", lineHeight: 1.8, maxWidth: "480px", marginBottom: "32px" }}>
            I code from Tokyo cafés, Lisbon hostels
            and Thailand beaches. Welcome to my nomad life.
          </p>

          {/* Réseaux sociaux */}
          {(tiktok || instagram) && (
            <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 18px", borderRadius: "100px",
                  border: "1px solid rgba(0,0,0,0.1)", background: "#fff",
                  textDecoration: "none", transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
                >
                  {/* Icône TikTok SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" fill="#000000"/>
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: "13px", color: "#000" }}>TikTok</span>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 18px", borderRadius: "100px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  textDecoration: "none", transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: "0 2px 8px rgba(220,39,67,0.25)",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 6px 20px rgba(220,39,67,0.35)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 2px 8px rgba(220,39,67,0.25)"; }}
                >
                  {/* Icône Instagram SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="white"/>
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: "13px", color: "#fff" }}>Instagram</span>
                </a>
              )}
            </div>
          )}

          {/* Pays visités */}
          {pays.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {pays.map((p) => {
                const v = voyages.find((vv) => vv.pays === p)!;
                return (
                  <div key={p} style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "8px 16px", borderRadius: "100px",
                    border: "1px solid rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.06)",
                  }}>
                    <span style={{ fontSize: "16px" }}>{v.emoji || "🌍"}</span>
                    <span style={{ color: "#1c1917", fontWeight: 600, fontSize: "13px" }}>{p}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div style={{ height: "1px", background: "rgba(245,158,11,0.1)", margin: "0 32px" }} />

      {/* ── Derniers voyages ──────────────────────────── */}
      {displayed.length > 0 && (
        <section className="inner-pad" style={{ padding: "64px 32px", maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1c1917", letterSpacing: "-0.03em" }}>
              {featured.length > 0 ? "⭐ Featured" : "✈️ Latest Trips"}
            </h2>
            <Link href="/nomade/voyages" style={{ color: "#f59e0b", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
              See all →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {displayed.map((v) => (
              <Link key={v.id} href={`/nomade/voyages/${v.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff", border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "14px", overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                  }}
                >
                  {v.photoCouverture ? (
                    <img src={v.photoCouverture} alt={v.titre}
                      style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ height: "100px", background: "rgba(245,158,11,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                      {v.emoji || "🌍"}
                    </div>
                  )}
                  <div style={{ padding: "18px 20px" }}>
                    <p style={{ color: "rgba(28,25,23,0.35)", fontSize: "11px", fontFamily: "var(--font-mono)", marginBottom: "6px" }}>
                      {v.pays}
                    </p>
                    <h3 style={{ color: "#1c1917", fontWeight: 800, fontSize: "16px", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                      {v.titre}
                    </h3>
                    {v.resume && (
                      <p style={{ color: "rgba(28,25,23,0.45)", fontSize: "13px", lineHeight: 1.6 }}>
                        {v.resume.slice(0, 80)}…
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: "1px", background: "rgba(245,158,11,0.1)", margin: "0 32px" }} />

      {/* ── Sections nav ─────────────────────────────── */}
      <section style={{ padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {sections.map((s) => (
            <Link key={s.href} href={s.href} style={{
              display: "block", padding: "32px 28px", background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px",
              textDecoration: "none", transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
                el.style.borderColor = `${s.accent}30`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                el.style.borderColor = "rgba(0,0,0,0.06)";
              }}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: `${s.accent}12`, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "20px",
              }}>
                {s.icon}
              </div>
              <h2 style={{ color: "#1c1917", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                {s.label}
              </h2>
              <p style={{ color: "#78716c", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>{s.desc}</p>
              <span style={{ fontSize: "13px", fontWeight: 600, color: s.accent }}>Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
