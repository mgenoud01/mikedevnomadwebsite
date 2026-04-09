"use client";

import Link from "next/link";
import { Article } from "@/lib/articles";

const CATEGORY_COLORS: Record<string, string> = {
  Nomadisme: "#f59e0b", Voyage: "#0d9488", Développement: "#6366f1",
  Sécurité: "#ef4444", Lifestyle: "#f97316",
};

export default function BlogClient({ articles }: { articles: Article[] }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "72px 32px 96px" }}>
      <div style={{ marginBottom: "56px" }}>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#1c1917", lineHeight: 0.95, marginBottom: "16px" }}>
          Blog
        </h1>
        <p style={{ color: "rgba(28,25,23,0.45)", fontSize: "15px", lineHeight: 1.7, maxWidth: "420px" }}>
          Thoughts on nomadism, code and life in motion.
        </p>
      </div>

      {articles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 40px", border: "2px dashed rgba(245,158,11,0.2)", borderRadius: "16px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✍️</div>
          <p style={{ color: "rgba(28,25,23,0.4)", fontSize: "16px" }}>No articles published yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {articles.map((a) => {
            const color = CATEGORY_COLORS[a.categorie] || "#f59e0b";
            return (
              <Link key={a.id} href={`/nomade/blog/${a.slug}`} style={{ textDecoration: "none" }}>
                <article style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "transform 0.2s, box-shadow 0.2s", height: "100%", display: "flex", flexDirection: "column" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
                >
                  {a.photoCouverture ? (
                    <img src={a.photoCouverture} alt={a.titre} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: "6px", background: color }} />
                  )}
                  <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <span style={{ background: `${color}15`, color, fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.05em" }}>{a.categorie}</span>
                      <span style={{ color: "rgba(28,25,23,0.3)", fontSize: "11px", fontFamily: "var(--font-mono)" }}>{new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <h2 style={{ fontWeight: 800, fontSize: "16px", color: "#1c1917", letterSpacing: "-0.02em", marginBottom: "10px", lineHeight: 1.3 }}>{a.titre}</h2>
                    {a.resume && <p style={{ color: "rgba(28,25,23,0.45)", fontSize: "13px", lineHeight: 1.65, flex: 1 }}>{a.resume.slice(0, 100)}…</p>}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px" }}>
                      {a.tags.slice(0, 3).map((t) => (
                        <span key={t} style={{ background: "rgba(245,158,11,0.07)", color: "#b45309", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontFamily: "var(--font-mono)" }}>#{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
