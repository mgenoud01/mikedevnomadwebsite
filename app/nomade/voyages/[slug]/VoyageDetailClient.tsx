"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Voyage } from "@/lib/voyages";
import { Photo } from "@/lib/galerie";

const GALLERY_PAGE_SIZE = 12;

export default function VoyageDetailClient({ voyage, galleryPhotos }: { voyage: Voyage; galleryPhotos: Photo[] }) {
  const [lightbox, setLightbox] = useState<{ url: string; titre?: string; lieu?: string } | null>(null);
  const [galleryLimit, setGalleryLimit] = useState(GALLERY_PAGE_SIZE);
  const dateDebut = voyage.dateDebut ? new Date(voyage.dateDebut).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : null;
  const dateFin = voyage.dateFin ? new Date(voyage.dateFin).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : null;

  return (
    <div style={{ color: "#1c1917", fontFamily: "var(--font-inter)" }}>

      {/* ── Hero cover ─────────────────────────────────── */}
      {voyage.photoCouverture ? (
        <div className="hero-img" style={{ position: "relative", height: "480px", overflow: "hidden" }}>
          <img src={voyage.photoCouverture} alt={voyage.titre}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }} />
          <div style={{ position: "absolute", bottom: "40px", left: "0", right: "0", maxWidth: "900px", margin: "0 auto", padding: "0 32px" }}>
            <Link href="/nomade/voyages" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", textDecoration: "none", marginBottom: "12px", display: "inline-block" }}>
              ← All trips
            </Link>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              {voyage.emoji} {voyage.titre}
            </h1>
          </div>
        </div>
      ) : (
        <div style={{ background: "rgba(245,158,11,0.06)", padding: "64px 32px 48px", borderBottom: "1px solid rgba(245,158,11,0.1)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Link href="/nomade/voyages" style={{ color: "rgba(28,25,23,0.4)", fontSize: "13px", textDecoration: "none", marginBottom: "16px", display: "inline-block" }}>
              ← All trips
            </Link>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, color: "#1c1917", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              {voyage.emoji} {voyage.titre}
            </h1>
          </div>
        </div>
      )}

      <div className="page-pad inner-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px 96px" }}>

        {/* ── Infos rapides ──────────────────────────── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "40px",
          padding: "20px 24px", background: "#fff",
          border: "1px solid rgba(0,0,0,0.06)", borderRadius: "14px",
        }}>
          {voyage.pays && <Info icon="📍" label={voyage.pays} />}
          {dateDebut && <Info icon="📅" label={dateFin ? `${dateDebut} → ${dateFin}` : dateDebut} />}
          {voyage.budgetJour ? <Info icon="💶" label={`~${voyage.budgetJour}€ / day`} /> : null}
          {voyage.restos.length > 0 && <Info icon="🍜" label={`${voyage.restos.length} restaurant${voyage.restos.length > 1 ? "s" : ""}`} />}
          {voyage.endroits.length > 0 && <Info icon="📍" label={`${voyage.endroits.length} place${voyage.endroits.length > 1 ? "s" : ""}`} />}
        </div>

        {/* ── Résumé ─────────────────────────────────── */}
        {voyage.resume && (
          <p style={{ fontSize: "18px", lineHeight: 1.8, color: "rgba(28,25,23,0.65)", marginBottom: "48px", maxWidth: "680px" }}>
            {voyage.resume}
          </p>
        )}

        {/* ── Hashtags ────────────────────────────────── */}
        {voyage.hashtags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "48px" }}>
            {voyage.hashtags.map((tag) => (
              <span key={tag} style={{
                padding: "5px 14px", borderRadius: "100px",
                border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.07)",
                color: "#b45309", fontSize: "12px", fontFamily: "var(--font-mono)",
              }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* ── Article ─────────────────────────────────── */}
        {voyage.contenu && (
          <Section title="✍️ The Story">
            <div style={{ fontSize: "16px", lineHeight: 1.9, color: "rgba(28,25,23,0.7)" }}>
              <ReactMarkdown components={{
                h1: ({ children }) => <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#1c1917", letterSpacing: "-0.03em", margin: "40px 0 16px" }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: "21px", fontWeight: 800, color: "#1c1917", letterSpacing: "-0.02em", margin: "36px 0 14px" }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1c1917", margin: "28px 0 12px" }}>{children}</h3>,
                p: ({ children }) => <p style={{ marginBottom: "20px", lineHeight: 1.9 }}>{children}</p>,
                ul: ({ children }) => <ul style={{ paddingLeft: "24px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: "24px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>{children}</ol>,
                li: ({ children }) => <li style={{ lineHeight: 1.8 }}>{children}</li>,
                strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#1c1917" }}>{children}</strong>,
                em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
                blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid #f59e0b", paddingLeft: "20px", margin: "28px 0", color: "rgba(28,25,23,0.55)", fontStyle: "italic" }}>{children}</blockquote>,
                code: ({ children }) => <code style={{ fontFamily: "var(--font-mono)", background: "rgba(245,158,11,0.08)", color: "#b45309", padding: "2px 7px", borderRadius: "4px", fontSize: "14px" }}>{children}</code>,
                hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(245,158,11,0.15)", margin: "36px 0" }} />,
              }}>
                {voyage.contenu}
              </ReactMarkdown>
            </div>
          </Section>
        )}

        {/* ── Restos ──────────────────────────────────── */}
        {voyage.restos.length > 0 && (
          <Section title="🍜 Food & Restaurants">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {voyage.restos.map((r) => (
                <div key={r.id} style={{
                  background: "#fff", border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "14px", overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  {r.photo && (
                    <img src={r.photo} alt={r.nom} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <h3 style={{ fontWeight: 800, fontSize: "15px", color: "#1c1917" }}>{r.nom}</h3>
                      <span style={{ fontSize: "12px" }}>{"⭐".repeat(r.note)}</span>
                    </div>
                    {r.adresse && <p style={{ color: "rgba(28,25,23,0.35)", fontSize: "11px", marginBottom: "8px", fontFamily: "var(--font-mono)" }}>📍 {r.adresse}</p>}
                    {r.description && <p style={{ color: "rgba(28,25,23,0.55)", fontSize: "13px", lineHeight: 1.6 }}>{r.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Endroits ────────────────────────────────── */}
        {voyage.endroits.length > 0 && (
          <Section title="📍 Places to Visit">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {voyage.endroits.map((e) => (
                <div key={e.id} style={{
                  background: "#fff", border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "14px", overflow: "hidden",
                  display: "grid", gridTemplateColumns: e.photo ? "140px 1fr" : "1fr",
                }}>
                  {e.photo && (
                    <img src={e.photo} alt={e.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "18px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <h3 style={{ fontWeight: 800, fontSize: "15px", color: "#1c1917" }}>{e.nom}</h3>
                      {e.type && (
                        <span style={{
                          background: "rgba(245,158,11,0.1)", color: "#b45309",
                          fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: 600,
                        }}>{e.type}</span>
                      )}
                    </div>
                    {e.description && <p style={{ color: "rgba(28,25,23,0.55)", fontSize: "13px", lineHeight: 1.6, marginBottom: "8px" }}>{e.description}</p>}
                    {e.conseil && (
                      <p style={{
                        color: "#b45309", fontSize: "12px", fontStyle: "italic",
                        background: "rgba(245,158,11,0.06)", padding: "8px 12px", borderRadius: "8px",
                      }}>
                        💡 {e.conseil}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Galerie ─────────────────────────────────── */}
        {(voyage.galerie.length > 0 || galleryPhotos.length > 0) && (() => {
          const galleryUrls = new Set(galleryPhotos.map((p) => p.url));
          const extraUrls = voyage.galerie.filter((u) => !galleryUrls.has(u));
          const allPhotos = [
            ...galleryPhotos.map((p) => ({ id: p.id, url: p.url, titre: p.titre, lieu: p.lieu })),
            ...extraUrls.map((url, i) => ({ id: `extra_${i}`, url, titre: "", lieu: "" })),
          ];
          const total = allPhotos.length;
          const visible = allPhotos.slice(0, galleryLimit);
          const hasMore = galleryLimit < total;

          return (
            <Section title={`🖼️ Gallery (${total})`}>
              {/* Grille masonry 3 colonnes */}
              <div style={{ columns: "3 180px", columnGap: "10px" }}>
                {visible.map((p) => (
                  <div key={p.id} onClick={() => setLightbox({ url: p.url, titre: p.titre, lieu: p.lieu })}
                    style={{ breakInside: "avoid", marginBottom: "10px", borderRadius: "10px", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                    <img src={p.url} alt={p.titre} style={{ width: "100%", display: "block", transition: "transform 0.3s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                    />
                    {(p.titre || p.lieu) && (
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.55))", padding: "16px 10px 8px", opacity: 0, transition: "opacity 0.2s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}>
                        {p.titre && <p style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>{p.titre}</p>}
                        {p.lieu && <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px" }}>📍 {p.lieu}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bouton "Voir plus" / résumé */}
              {hasMore ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    onClick={() => setGalleryLimit((l) => l + GALLERY_PAGE_SIZE)}
                    style={{
                      background: "#fff", border: "1.5px solid rgba(0,0,0,0.1)",
                      color: "#1c1917", fontWeight: 600, fontSize: "13px",
                      padding: "12px 28px", borderRadius: "10px", cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0d9488"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.1)"; }}
                  >
                    Voir plus · {total - galleryLimit} photo{total - galleryLimit > 1 ? "s" : ""} restante{total - galleryLimit > 1 ? "s" : ""}
                  </button>
                </div>
              ) : total > GALLERY_PAGE_SIZE ? (
                <p style={{ textAlign: "center", color: "rgba(28,25,23,0.35)", fontSize: "12px", marginTop: "16px" }}>
                  Toutes les {total} photos affichées
                </p>
              ) : null}
            </Section>
          );
        })()}

        {/* ── Conseils ────────────────────────────────── */}
        {voyage.conseils.length > 0 && (
          <Section title="💡 Practical Tips">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {voyage.conseils.map((c, i) => (
                <div key={i} style={{
                  display: "flex", gap: "14px", alignItems: "flex-start",
                  background: "#fff", border: "1px solid rgba(245,158,11,0.12)",
                  borderRadius: "10px", padding: "14px 18px",
                }}>
                  <span style={{ color: "#f59e0b", fontSize: "16px", flexShrink: 0 }}>💡</span>
                  <p style={{ color: "rgba(28,25,23,0.7)", fontSize: "14px", lineHeight: 1.6 }}>{c}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Retour ──────────────────────────────────── */}
        <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid rgba(245,158,11,0.1)" }}>
          <Link href="/nomade/voyages" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            color: "#b45309", fontWeight: 700, fontSize: "14px", textDecoration: "none",
          }}>
            ← Back to trips
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "18px" }}>✕</button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", textAlign: "center" }}>
            <img src={lightbox.url} alt={lightbox.titre} style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "8px" }} />
            {(lightbox.titre || lightbox.lieu) && (
              <div style={{ marginTop: "14px" }}>
                {lightbox.titre && <p style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{lightbox.titre}</p>}
                {lightbox.lieu && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>📍 {lightbox.lieu}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1c1917", marginBottom: "20px", letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Info({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ fontSize: "14px" }}>{icon}</span>
      <span style={{ fontSize: "13px", color: "rgba(28,25,23,0.6)", fontWeight: 500 }}>{label}</span>
    </div>
  );
}
