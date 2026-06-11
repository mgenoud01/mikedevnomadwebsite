"use client";

import { useState } from "react";
import { Photo } from "@/lib/galerie";

type VoyageMini = { id: string; titre: string; emoji: string; pays: string };

export default function GalerieClient({ photos, voyages }: { photos: Photo[]; voyages: VoyageMini[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<string>("all");

  const filtered = activeAlbum === "all"
    ? photos
    : activeAlbum === "general"
    ? photos.filter((p) => !p.voyageId)
    : photos.filter((p) => p.voyageId === activeAlbum);

  const activeVoyage = voyages.find((v) => v.id === activeAlbum);
  const albumsWithPhotos = voyages.filter((v) => photos.some((p) => p.voyageId === v.id));

  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 32px 96px" }}>
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <h1 className="font-display" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, letterSpacing: "-0.04em", color: "#ffffff", marginBottom: "12px" }}>Gallery</h1>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>Photos from around the world.</p>
      </div>

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>

        {/* ── Sidebar albums (si plusieurs) */}
        {albumsWithPhotos.length > 0 && (
          <div style={{ width: "200px", flexShrink: 0, position: "sticky", top: "96px" }}>
            <p style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Albums</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <button onClick={() => setActiveAlbum("all")} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]" style={{
                textAlign: "left", padding: "9px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: activeAlbum === "all" ? "rgba(95,211,188,0.08)" : "transparent",
                color: activeAlbum === "all" ? "var(--mint)" : "var(--muted)",
                fontSize: "13px", fontWeight: activeAlbum === "all" ? 700 : 400,
              }}>
                🌍 All photos
                <span style={{ float: "right", fontSize: "11px", opacity: 0.5 }}>{photos.length}</span>
              </button>
              {albumsWithPhotos.map((v) => {
                const count = photos.filter((p) => p.voyageId === v.id).length;
                const isActive = activeAlbum === v.id;
                return (
                  <button key={v.id} onClick={() => setActiveAlbum(v.id)} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]" style={{
                    textAlign: "left", padding: "9px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
                    background: isActive ? "rgba(95,211,188,0.08)" : "transparent",
                    color: isActive ? "var(--mint)" : "var(--muted)",
                    fontSize: "13px", fontWeight: isActive ? 700 : 400,
                  }}>
                    {v.emoji} {v.titre}
                    <span style={{ float: "right", fontSize: "11px", opacity: 0.5 }}>{count}</span>
                  </button>
                );
              })}
              {photos.some((p) => !p.voyageId) && (
                <button onClick={() => setActiveAlbum("general")} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]" style={{
                  textAlign: "left", padding: "9px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
                  background: activeAlbum === "general" ? "rgba(95,211,188,0.08)" : "transparent",
                  color: activeAlbum === "general" ? "var(--mint)" : "var(--muted)",
                  fontSize: "13px", fontWeight: activeAlbum === "general" ? 700 : 400,
                }}>
                  🌐 Other
                  <span style={{ float: "right", fontSize: "11px", opacity: 0.5 }}>{photos.filter((p) => !p.voyageId).length}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Grille photos */}
        <div style={{ flex: 1 }}>
          {activeVoyage && (
            <div style={{ marginBottom: "24px" }}>
              <h2 className="font-display" style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
                {activeVoyage.emoji} {activeVoyage.titre}
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>{filtered.length} photo{filtered.length > 1 ? "s" : ""}</p>
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", border: "2px dashed var(--line)", borderRadius: "16px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📸</div>
              <p style={{ color: "var(--muted)", fontSize: "16px" }}>No photos yet.</p>
            </div>
          ) : (
            <div style={{ columns: "3 240px", columnGap: "12px" }}>
              {filtered.map((p) => (
                <div key={p.id} onClick={() => setSelected(p)} style={{ breakInside: "avoid", marginBottom: "12px", borderRadius: "10px", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  <img src={p.url} alt={p.titre} style={{ width: "100%", display: "block", transition: "transform 0.3s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                  {(p.titre || p.lieu) && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.6))", padding: "20px 12px 10px", opacity: 0, transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}>
                      <p style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{p.titre}</p>
                      {p.lieu && <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}>📍 {p.lieu}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "18px" }}>✕</button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh" }}>
            <img src={selected.url} alt={selected.titre} style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "8px" }} />
            {(selected.titre || selected.lieu || selected.description) && (
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                {selected.titre && <p style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{selected.titre}</p>}
                {selected.lieu && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>📍 {[selected.lieu, selected.pays].filter(Boolean).join(", ")}</p>}
                {selected.description && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "8px" }}>{selected.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
