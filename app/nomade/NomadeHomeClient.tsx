"use client";

import Link from "next/link";
import { Voyage } from "@/lib/voyages";

const sections = [
  { href: "/nomade/voyages", label: "Trips", desc: "Stories, tips & itineraries", icon: "✈️", accent: "#f59e0b" },
  { href: "/nomade/galerie", label: "Gallery", desc: "Photos from around the world", icon: "📸", accent: "#0d9488" },
  { href: "/nomade/blog", label: "Blog", desc: "Thoughts on nomadic life", icon: "✍️", accent: "#f97316" },
];

export default function NomadeHomeClient({ voyages }: { voyages: Voyage[] }) {
  // Pays uniques depuis les vrais voyages
  const pays = Array.from(new Set(voyages.map((v) => v.pays))).slice(0, 8);
  const featured = voyages.filter((v) => v.miseEnAvant).slice(0, 3);
  const recent = voyages.slice(0, 3);
  const displayed = featured.length > 0 ? featured : recent;

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "96px 32px 80px" }}>
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

          <p style={{ color: "rgba(28,25,23,0.45)", fontSize: "17px", lineHeight: 1.8, maxWidth: "480px", marginBottom: "48px" }}>
            I code from Tokyo cafés, Lisbon hostels
            and Thailand beaches. Welcome to my nomad life.
          </p>

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
        <section style={{ padding: "64px 32px", maxWidth: "900px", margin: "0 auto" }}>
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
