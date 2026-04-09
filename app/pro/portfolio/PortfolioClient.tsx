"use client";

import { Project } from "@/lib/projects";

const STATUS_STYLE: Record<string, { color: string }> = {
  "done":        { color: "#00ff99" },
  "in-progress": { color: "#f59e0b" },
  "archived":    { color: "#64748b" },
};
const STATUS_LABEL: Record<string, string> = {
  "done": "Done", "in-progress": "In progress", "archived": "Archived",
};

export default function PortfolioClient({ projects }: { projects: Project[] }) {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "72px 32px 96px" }}>
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "rgba(0,255,153,0.5)", fontSize: "12px", letterSpacing: "0.12em", marginBottom: "20px" }}>
          $ ls -la ./projects
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 0.95, marginBottom: "16px" }}>
          Portfolio
        </h1>
        <p style={{ color: "rgba(230,237,243,0.5)", fontSize: "15px", maxWidth: "400px", lineHeight: 1.7 }}>
          Personal projects, open-source work and ongoing builds.
        </p>
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "12px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
          <p style={{ color: "rgba(255,255,255,0.3)" }}>No projects yet — add them from the admin.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {projects.map((p, i) => {
            const ss = STATUS_STYLE[p.status] || { color: "#64748b" };
            return (
              <a key={p.id} href={p.lien || "#"} target={p.lien ? "_blank" : undefined} rel="noopener noreferrer" style={{
                display: "block", padding: "28px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                textDecoration: "none", transition: "background 0.2s, border-color 0.2s, transform 0.15s",
                overflow: "hidden", position: "relative",
              }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(0,255,153,0.05)"; el.style.borderColor = "rgba(0,255,153,0.2)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(255,255,255,0.03)"; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.12em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {p.image && <img src={p.image} alt={p.titre} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} />}
                    <h2 style={{ color: "#ffffff", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.02em" }}>{p.titre}</h2>
                    {p.featured && <span style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: 600 }}>★ Featured</span>}
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "4px 10px", borderRadius: "4px", border: `1px solid ${ss.color}30`, color: ss.color, background: `${ss.color}0a`, flexShrink: 0, letterSpacing: "0.06em" }}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>

                <p style={{ color: "rgba(230,237,243,0.5)", fontSize: "14px", lineHeight: 1.75, marginBottom: "20px", maxWidth: "680px" }}>
                  {p.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {p.stack.map((s) => (
                      <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "3px 10px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", borderRadius: "4px", letterSpacing: "0.04em" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>GitHub →</a>}
                    {p.lien && <span style={{ color: "rgba(0,255,153,0.5)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>view →</span>}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
