"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Article } from "@/lib/articles";

const CATEGORY_COLORS: Record<string, string> = {
  Nomadisme: "#f59e0b", Voyage: "#0d9488", Développement: "#6366f1",
  Sécurité: "#ef4444", Lifestyle: "#f97316",
};

export default function ArticleClient({ article }: { article: Article }) {
  const color = CATEGORY_COLORS[article.categorie] || "#f59e0b";

  return (
    <div style={{ color: "#1c1917", fontFamily: "var(--font-inter)" }}>
      {/* Cover */}
      {article.photoCouverture ? (
        <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
          <img src={article.photoCouverture} alt={article.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: "36px", left: 0, right: 0, maxWidth: "760px", margin: "0 auto", padding: "0 32px" }}>
            <Link href="/nomade/blog" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "10px" }}>← Blog</Link>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{article.titre}</h1>
          </div>
        </div>
      ) : (
        <div style={{ borderBottom: "1px solid rgba(245,158,11,0.1)", padding: "56px 32px 40px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <Link href="/nomade/blog" style={{ color: "rgba(28,25,23,0.4)", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "16px" }}>← Blog</Link>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#1c1917", letterSpacing: "-0.04em", lineHeight: 1 }}>{article.titre}</h1>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 32px 96px" }}>
        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
          <span style={{ background: `${color}15`, color, fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px" }}>{article.categorie}</span>
          <span style={{ color: "rgba(28,25,23,0.35)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
            {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          {article.tags.map((t) => (
            <span key={t} style={{ background: "rgba(245,158,11,0.07)", color: "#b45309", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontFamily: "var(--font-mono)" }}>#{t}</span>
          ))}
        </div>

        {/* Résumé */}
        {article.resume && (
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: "rgba(28,25,23,0.6)", marginBottom: "40px", fontStyle: "italic", borderLeft: `3px solid ${color}`, paddingLeft: "20px" }}>
            {article.resume}
          </p>
        )}

        {/* Contenu */}
        {article.contenu && (
          <div style={{ fontSize: "16px", lineHeight: 1.9, color: "rgba(28,25,23,0.75)" }}>
            <ReactMarkdown components={{
              h1: ({ children }) => <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#1c1917", letterSpacing: "-0.03em", margin: "40px 0 16px" }}>{children}</h1>,
              h2: ({ children }) => <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1c1917", letterSpacing: "-0.02em", margin: "36px 0 14px" }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1c1917", margin: "28px 0 12px" }}>{children}</h3>,
              p: ({ children }) => <p style={{ marginBottom: "20px", lineHeight: 1.9 }}>{children}</p>,
              ul: ({ children }) => <ul style={{ paddingLeft: "24px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ paddingLeft: "24px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>{children}</ol>,
              li: ({ children }) => <li style={{ lineHeight: 1.8 }}>{children}</li>,
              strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#1c1917" }}>{children}</strong>,
              em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
              blockquote: ({ children }) => <blockquote style={{ borderLeft: `3px solid ${color}`, paddingLeft: "20px", margin: "28px 0", color: "rgba(28,25,23,0.55)", fontStyle: "italic" }}>{children}</blockquote>,
              code: ({ children }) => <code style={{ fontFamily: "var(--font-mono)", background: "rgba(245,158,11,0.08)", color: "#b45309", padding: "2px 7px", borderRadius: "4px", fontSize: "14px" }}>{children}</code>,
              hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(245,158,11,0.15)", margin: "36px 0" }} />,
            }}>
              {article.contenu}
            </ReactMarkdown>
          </div>
        )}

        <div style={{ marginTop: "56px", paddingTop: "32px", borderTop: "1px solid rgba(245,158,11,0.1)" }}>
          <Link href="/nomade/blog" style={{ color: "#b45309", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>← Back to blog</Link>
        </div>
      </div>
    </div>
  );
}
