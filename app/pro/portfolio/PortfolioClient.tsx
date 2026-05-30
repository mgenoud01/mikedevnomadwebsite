"use client";

import { useState } from "react";
import { Project } from "@/lib/projects";

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  "done":        { color: "#00ff99", bg: "rgba(0,255,153,0.08)", label: "Done" },
  "in-progress": { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", label: "In progress" },
  "archived":    { color: "#64748b", bg: "rgba(100,116,139,0.08)", label: "Archived" },
};

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

function getCoverImage(p: Project): string | null {
  if (p.images && p.images.length > 0) return p.images[0];
  if (p.image) return p.image;
  return null;
}

export default function PortfolioClient({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  function openProject(p: Project) {
    setSelected(p);
    setImgIndex(0);
  }

  function closeModal() {
    setSelected(null);
    setImgIndex(0);
    setLightboxImg(null);
  }

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 32px 96px" }}>

      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "rgba(0,255,153,0.5)", fontSize: "12px", letterSpacing: "0.12em", marginBottom: "16px" }}>
          $ ls -la ./projects
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", lineHeight: 0.95, marginBottom: "14px" }}>
          Portfolio
        </h1>
        <p style={{ color: "rgba(230,237,243,0.45)", fontSize: "15px", lineHeight: 1.7 }}>
          Personal projects, open-source work and ongoing builds.
        </p>
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "12px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
          <p style={{ color: "rgba(255,255,255,0.3)" }}>No projects yet — add them from the admin.</p>
        </div>
      ) : (
        <>
          {/* Featured — grande grille */}
          {featured.length > 0 && (
            <div style={{ marginBottom: "48px" }}>
              <p style={{ color: "rgba(0,255,153,0.4)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px", fontFamily: "var(--font-mono)" }}>
                ★ Featured
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                {featured.map((p) => <ProjectCard key={p.id} project={p} onClick={() => openProject(p)} />)}
              </div>
            </div>
          )}

          {/* Reste */}
          {rest.length > 0 && (
            <div>
              {featured.length > 0 && (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px", fontFamily: "var(--font-mono)" }}>
                  All projects
                </p>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {rest.map((p) => <ProjectCard key={p.id} project={p} onClick={() => openProject(p)} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Modal projet ─────────────────────────────────────────────── */}
      {selected && (() => {
        const ss = STATUS_STYLE[selected.status] || STATUS_STYLE["done"];
        const allImages = [
          ...(selected.images || []),
          ...(selected.image && !(selected.images || []).includes(selected.image) ? [selected.image] : []),
        ];
        const embedUrl = getEmbedUrl(selected.video || "");

        return (
          <div
            onClick={closeModal}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backdropFilter: "blur(6px)" }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#0e1c2f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", width: "100%", maxWidth: "780px", maxHeight: "90vh", overflow: "auto", position: "relative" }}
            >
              {/* Close */}
              <button onClick={closeModal} style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10, background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.6)", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}>✕</button>

              {/* ── Vidéo en haut si dispo ── */}
              {embedUrl && (
                <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: "20px 20px 0 0", overflow: "hidden" }}>
                  <iframe
                    src={embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              )}

              {/* ── Photo principale cliquable ── */}
              {!embedUrl && allImages.length > 0 && (
                <div
                  onClick={() => setLightboxImg(allImages[imgIndex])}
                  style={{ borderRadius: "20px 20px 0 0", overflow: "hidden", background: "#000", cursor: "zoom-in", position: "relative" }}
                >
                  <img
                    src={allImages[imgIndex]}
                    alt={selected.titre}
                    style={{ width: "100%", height: "340px", objectFit: "cover", display: "block", transition: "transform 0.3s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.02)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                  <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.7)", fontSize: "11px", padding: "4px 10px", borderRadius: "6px", pointerEvents: "none" }}>
                    🔍 Agrandir
                  </div>
                </div>
              )}

              {/* ── Strip de miniatures ── */}
              {allImages.length > 1 && (
                <div style={{ display: "flex", gap: "6px", padding: "10px 12px", background: "rgba(0,0,0,0.3)", overflowX: "auto" }}>
                  {allImages.map((url, i) => (
                    <button key={i} onClick={() => setImgIndex(i)} style={{
                      flexShrink: 0, padding: 0, border: `2px solid ${i === imgIndex ? "#00ff99" : "transparent"}`,
                      borderRadius: "7px", overflow: "hidden", cursor: "pointer", background: "none", transition: "border-color 0.15s",
                    }}>
                      <img src={url} alt="" style={{ width: "72px", height: "52px", objectFit: "cover", display: "block", opacity: i === imgIndex ? 1 : 0.55, transition: "opacity 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = i === imgIndex ? "1" : "0.55"; }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* ── Placeholder si aucune image ni vidéo ── */}
              {!embedUrl && allImages.length === 0 && (
                <div style={{ height: "100px", background: "rgba(255,255,255,0.03)", borderRadius: "20px 20px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>💻</div>
              )}

              {/* Contenu */}
              <div style={{ padding: "28px 32px 32px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px", gap: "12px" }}>
                  <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.02em" }}>{selected.titre}</h2>
                  <span style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: "11px", padding: "4px 10px", borderRadius: "6px", border: `1px solid ${ss.color}40`, color: ss.color, background: ss.bg }}>
                    {ss.label}
                  </span>
                </div>

                {/* Description complète */}
                <p style={{ color: "rgba(230,237,243,0.6)", fontSize: "14px", lineHeight: 1.8, marginBottom: "24px", whiteSpace: "pre-wrap" }}>
                  {selected.description}
                </p>

                {/* Stack */}
                {selected.stack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
                    {selected.stack.map((s) => (
                      <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "4px 10px", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)", borderRadius: "4px" }}>{s}</span>
                    ))}
                  </div>
                )}

                {/* Liens */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {selected.lien && (
                    <a href={selected.lien} target="_blank" rel="noopener noreferrer"
                      style={{ background: "#00ff99", color: "#0e1c2f", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "8px", textDecoration: "none" }}>
                      🌐 Live demo →
                    </a>
                  )}
                  {selected.github && (
                    <a href={selected.github} target="_blank" rel="noopener noreferrer"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "13px", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ── Lightbox plein écran ── */}
            {lightboxImg && (
              <div
                onClick={() => setLightboxImg(null)}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", cursor: "zoom-out" }}
              >
                <button
                  onClick={() => setLightboxImg(null)}
                  style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "18px", zIndex: 310 }}
                >✕</button>
                {/* Navigation gauche */}
                {allImages.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); const ni = (imgIndex - 1 + allImages.length) % allImages.length; setImgIndex(ni); setLightboxImg(allImages[ni]); }}
                    style={{ position: "absolute", left: "20px", background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", fontSize: "22px", zIndex: 310 }}
                  >‹</button>
                )}
                <img
                  src={lightboxImg}
                  alt=""
                  onClick={(e) => e.stopPropagation()}
                  style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: "8px", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}
                />
                {/* Navigation droite */}
                {allImages.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); const ni = (imgIndex + 1) % allImages.length; setImgIndex(ni); setLightboxImg(allImages[ni]); }}
                    style={{ position: "absolute", right: "20px", background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", fontSize: "22px", zIndex: 310 }}
                  >›</button>
                )}
                {allImages.length > 1 && (
                  <p style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                    {imgIndex + 1} / {allImages.length}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const ss = STATUS_STYLE[project.status] || STATUS_STYLE["done"];
  const cover = getCoverImage(project);
  const photoCount = (project.images || []).length + (project.image ? 1 : 0);
  const hasVideo = !!project.video;

  return (
    <div
      onClick={onClick}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.borderColor = "rgba(0,255,153,0.2)"; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.boxShadow = "none"; }}
    >
      {/* Image / placeholder */}
      <div style={{ height: "200px", background: "rgba(255,255,255,0.03)", position: "relative", overflow: "hidden" }}>
        {cover ? (
          <img src={cover} alt={project.titre} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>💻</div>
        )}
        {/* Badges overlay */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
          {project.featured && (
            <span style={{ background: "rgba(245,158,11,0.9)", color: "#000", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px" }}>★ FEATURED</span>
          )}
        </div>
        <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "6px" }}>
          {hasVideo && <span style={{ background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "10px", padding: "3px 8px", borderRadius: "20px" }}>▶ Video</span>}
          {photoCount > 1 && <span style={{ background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "10px", padding: "3px 8px", borderRadius: "20px" }}>🖼 {photoCount}</span>}
        </div>
        {/* Status bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "24px 14px 10px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", padding: "2px 8px", borderRadius: "4px", border: `1px solid ${ss.color}50`, color: ss.color, background: ss.bg }}>
            {ss.label}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: "18px 20px 20px" }}>
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.02em", marginBottom: "8px" }}>{project.titre}</h2>
        <p style={{ color: "rgba(230,237,243,0.45)", fontSize: "13px", lineHeight: 1.65, marginBottom: "14px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>
          {project.description}
        </p>
        {/* Stack */}
        {project.stack.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
            {project.stack.slice(0, 4).map((s) => (
              <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "2px 8px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", borderRadius: "4px" }}>{s}</span>
            ))}
            {project.stack.length > 4 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", padding: "2px 6px" }}>+{project.stack.length - 4}</span>}
          </div>
        )}
        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(0,255,153,0.5)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
            {hasVideo || photoCount > 0 ? "See project →" : "Read more →"}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            {project.github && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>GitHub</span>}
            {project.lien && <span style={{ color: "rgba(0,255,153,0.4)", fontSize: "11px" }}>Live</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
