"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Photo } from "@/lib/galerie";

type VoyageMini = { id: string; titre: string; slug: string; emoji: string; pays: string };

const INPUT: React.CSSProperties = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "var(--font-inter)" };
const LABEL: React.CSSProperties = { display: "block", color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" };
const focus = (e: any) => { e.target.style.borderColor = "rgba(0,255,153,0.35)"; };
const blur = (e: any) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; };

export default function GalerieAdminClient({ photos: initial, voyages }: { photos: Photo[]; voyages: VoyageMini[] }) {
  const [photos, setPhotos] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Photo>>({});
  const [activeAlbum, setActiveAlbum] = useState<string>("general");
  const fileRef = useRef<HTMLInputElement>(null);

  const currentVoyage = voyages.find((v) => v.id === activeAlbum);

  function getCloudinaryFolder(): string {
    if (activeAlbum === "general") return "mikedevnomad/galerie";
    const v = voyages.find((x) => x.id === activeAlbum);
    return v ? `mikedevnomad/voyages/${v.slug}` : "mikedevnomad/galerie";
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const folder = getCloudinaryFolder();

    try {
      // Étape 1 : upload toutes les photos vers Cloudinary en parallèle
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("folder", folder);
          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok || !data.url) throw new Error(data.error || "Upload Cloudinary échoué");
          return { file, url: data.url as string };
        })
      );

      // Étape 2 : 1 seule écriture blob — on envoie aussi les photos déjà en place
      // pour éviter tout risque de read-stale côté serveur
      const saveRes = await fetch("/api/admin/galerie/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPhotos: uploadResults.map(({ file, url }) => ({
            url,
            titre: file.name.replace(/\.[^/.]+$/, ""),
            lieu: "",
            pays: currentVoyage?.pays || "",
            description: "",
            miseEnAvant: false,
            voyageId: activeAlbum === "general" ? undefined : activeAlbum,
          })),
          keepPhotos: photos, // toutes les photos actuelles du client
        }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => ({}));
        alert(`Erreur sauvegarde : ${err.error || "Inconnue"}`);
        return;
      }

      const created = await saveRes.json();
      // Mise à jour immédiate de l'état client (sans attendre le rechargement)
      setPhotos((prev) => [...created, ...prev]);
    } catch (err: any) {
      alert(`Erreur upload : ${err.message}`);
      return;
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }

    // Étape 3 : recharge depuis le serveur pour confirmer l'état réel du blob
    const freshRes = await fetch("/api/admin/galerie");
    if (freshRes.ok) setPhotos(await freshRes.json());
  }

  async function handleClearAll() {
    if (!confirm("⚠️ Effacer TOUTES les photos ? Cette action est irréversible.")) return;
    const res = await fetch("/api/admin/galerie/reset", { method: "POST" });
    if (res.ok) setPhotos([]);
    else alert("Erreur lors de la suppression");
  }

  function startEdit(p: Photo) {
    setEditingId(p.id);
    setEditForm({ titre: p.titre, lieu: p.lieu, pays: p.pays, description: p.description, miseEnAvant: p.miseEnAvant });
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/admin/galerie/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
    const updated = await res.json();
    setPhotos((p) => p.map((x) => x.id === id ? updated : x));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    await fetch(`/api/admin/galerie/${id}`, { method: "DELETE" });
    setPhotos((p) => p.filter((x) => x.id !== id));
  }

  async function toggleFeatured(photo: Photo) {
    const res = await fetch(`/api/admin/galerie/${photo.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ miseEnAvant: !photo.miseEnAvant }) });
    const updated = await res.json();
    setPhotos((p) => p.map((x) => x.id === photo.id ? updated : x));
  }

  const filteredPhotos = activeAlbum === "general"
    ? photos.filter((p) => !p.voyageId)
    : photos.filter((p) => p.voyageId === activeAlbum);

  const albumLabel = activeAlbum === "general"
    ? "Galerie générale"
    : currentVoyage ? `${currentVoyage.emoji} ${currentVoyage.titre}` : "Album";

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#fff", fontFamily: "var(--font-inter)" }}>
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "13px" }}>← Dashboard</Link>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>📸 Galerie</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ background: uploading ? "rgba(0,255,153,0.4)" : "#00ff99", color: "#0d1117", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: uploading ? "not-allowed" : "pointer" }}>
            {uploading ? "Upload en cours..." : `+ Ajouter dans « ${albumLabel} »`}
          </button>
          {photos.length > 0 && (
            <button onClick={handleClearAll} style={{ background: "rgba(255,60,60,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,60,60,0.2)", fontWeight: 600, fontSize: "12px", padding: "10px 16px", borderRadius: "10px", cursor: "pointer" }}>
              🗑️ Tout effacer
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: "none" }} />
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 40px" }}>
        <div style={{ display: "flex", gap: "32px" }}>

          {/* ── Sidebar albums */}
          <div style={{ width: "220px", flexShrink: 0 }}>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Albums</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {/* Galerie générale */}
              <button onClick={() => setActiveAlbum("general")} style={{
                textAlign: "left", padding: "10px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: activeAlbum === "general" ? "rgba(0,255,153,0.1)" : "transparent",
                color: activeAlbum === "general" ? "#00ff99" : "rgba(255,255,255,0.5)",
                fontSize: "13px", fontWeight: activeAlbum === "general" ? 700 : 400,
                transition: "all 0.15s",
              }}>
                🌐 Galerie générale
                <span style={{ float: "right", fontSize: "11px", opacity: 0.5 }}>
                  {photos.filter((p) => !p.voyageId).length}
                </span>
              </button>

              {/* Un album par voyage */}
              {voyages.map((v) => {
                const count = photos.filter((p) => p.voyageId === v.id).length;
                const isActive = activeAlbum === v.id;
                return (
                  <button key={v.id} onClick={() => setActiveAlbum(v.id)} style={{
                    textAlign: "left", padding: "10px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
                    background: isActive ? "rgba(0,255,153,0.1)" : "transparent",
                    color: isActive ? "#00ff99" : "rgba(255,255,255,0.5)",
                    fontSize: "13px", fontWeight: isActive ? 700 : 400,
                    transition: "all 0.15s",
                  }}>
                    {v.emoji} {v.titre}
                    <span style={{ float: "right", fontSize: "11px", opacity: 0.5 }}>{count}</span>
                  </button>
                );
              })}

              {voyages.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", padding: "10px 14px" }}>
                  Aucun voyage créé
                </p>
              )}
            </div>
          </div>

          {/* ── Contenu album */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "4px" }}>{albumLabel}</h1>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                  {filteredPhotos.length} photo{filteredPhotos.length > 1 ? "s" : ""}
                  {activeAlbum !== "general" && currentVoyage && (
                    <span> · Cloudinary : <code style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>mikedevnomad/voyages/{currentVoyage.slug}</code></span>
                  )}
                </p>
              </div>
            </div>

            {/* Upload zone */}
            <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed rgba(255,255,255,0.08)", borderRadius: "14px", padding: "28px", textAlign: "center", cursor: "pointer", marginBottom: "28px", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,153,0.25)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(0,255,153,0.02)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{uploading ? "⏳" : "☁️"}</div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                {uploading ? "Upload vers Cloudinary..." : `Glisser ou cliquer pour ajouter dans « ${albumLabel} »`}
              </p>
              <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px", marginTop: "4px" }}>JPG, PNG, WEBP · Plusieurs photos acceptées</p>
            </div>

            {filteredPhotos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", border: "2px dashed rgba(255,255,255,0.06)", borderRadius: "16px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📸</div>
                <p style={{ color: "rgba(255,255,255,0.3)" }}>Aucune photo dans cet album</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
                {filteredPhotos.map((p) => (
                  <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
                    <div style={{ position: "relative", aspectRatio: "4/3" }}>
                      <img src={p.url} alt={p.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "6px" }}>
                        <button onClick={() => toggleFeatured(p)} title="Mettre en avant" style={{ background: p.miseEnAvant ? "#f59e0b" : "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "12px" }}>⭐</button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: "rgba(255,80,80,0.7)", border: "none", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "11px" }}>✕</button>
                      </div>
                      {p.miseEnAvant && <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "#f59e0b", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>À LA UNE</span>}
                    </div>

                    {editingId === p.id ? (
                      <div style={{ padding: "14px" }}>
                        <input style={{ ...INPUT, marginBottom: "8px" }} placeholder="Titre" value={editForm.titre || ""} onChange={(e) => setEditForm((f) => ({ ...f, titre: e.target.value }))} onFocus={focus} onBlur={blur} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                          <input style={INPUT} placeholder="Lieu" value={editForm.lieu || ""} onChange={(e) => setEditForm((f) => ({ ...f, lieu: e.target.value }))} onFocus={focus} onBlur={blur} />
                          <input style={INPUT} placeholder="Pays" value={editForm.pays || ""} onChange={(e) => setEditForm((f) => ({ ...f, pays: e.target.value }))} onFocus={focus} onBlur={blur} />
                        </div>
                        <textarea style={{ ...INPUT, height: "56px", resize: "none" } as any} placeholder="Description" value={editForm.description || ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} onFocus={focus} onBlur={blur} />
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                          <button onClick={() => saveEdit(p.id)} style={{ flex: 1, background: "#00ff99", color: "#0d1117", fontWeight: 700, fontSize: "12px", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer" }}>✓ OK</button>
                          <button onClick={() => setEditingId(null)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>✕</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "12px 14px" }}>
                        <p style={{ fontWeight: 600, fontSize: "13px", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.titre || "Sans titre"}</p>
                        {(p.lieu || p.pays) && <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "8px" }}>📍 {[p.lieu, p.pays].filter(Boolean).join(", ")}</p>}
                        <button onClick={() => startEdit(p)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", width: "100%" }}>✏️ Modifier</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
