"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Voyage, Resto, Endroit } from "@/lib/voyages";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

const INPUT = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
  fontFamily: "var(--font-inter)",
};

const LABEL = {
  display: "block" as const,
  color: "rgba(255,255,255,0.35)",
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  marginBottom: "8px",
};

const CARD = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "28px",
  marginBottom: "24px",
};

const SECTION_TITLE = {
  fontSize: "16px",
  fontWeight: 700 as const,
  marginBottom: "20px",
  color: "#fff",
  display: "flex" as const,
  alignItems: "center" as const,
  gap: "10px",
};

export default function VoyageForm({ voyage }: { voyage?: Voyage }) {
  const isEdit = !!voyage;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGalerie, setUploadingGalerie] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    titre: voyage?.titre || "",
    pays: voyage?.pays || "",
    emoji: voyage?.emoji || "🌍",
    dateDebut: voyage?.dateDebut || "",
    dateFin: voyage?.dateFin || "",
    resume: voyage?.resume || "",
    photoCouverture: voyage?.photoCouverture || "",
    budgetJour: voyage?.budgetJour || 0,
    contenu: voyage?.contenu || "",
    miseEnAvant: voyage?.miseEnAvant || false,
    hashtags: voyage?.hashtags || [],
    conseils: voyage?.conseils || [],
    restos: voyage?.restos || [],
    endroits: voyage?.endroits || [],
    galerie: voyage?.galerie || [],
  });

  const [hashtagInput, setHashtagInput] = useState("");
  const [conseilInput, setConseilInput] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);
  const galerieRef = useRef<HTMLInputElement>(null);

  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function voyageFolder() {
    const base = voyage?.id || form.titre || "nouveau";
    return "mikedevnomad/voyages/" + base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function uploadFile(file: File): Promise<string> {
    return uploadToCloudinary(file, voyageFolder());
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setErrorMsg(null);
    try {
      const url = await uploadFile(file);
      set("photoCouverture", url);
    } catch (err: any) {
      setErrorMsg(`Upload couverture échoué : ${err.message}`);
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleGalerieUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGalerie(true);
    setErrorMsg(null);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      set("galerie", [...form.galerie, ...urls]);
    } catch (err: any) {
      setErrorMsg(`Upload galerie échoué : ${err.message}`);
    } finally {
      setUploadingGalerie(false);
    }
  }

  function addHashtag() {
    const tag = hashtagInput.replace("#", "").trim();
    if (tag && !form.hashtags.includes(tag)) {
      set("hashtags", [...form.hashtags, tag]);
    }
    setHashtagInput("");
  }

  function addConseil() {
    if (conseilInput.trim()) {
      set("conseils", [...form.conseils, conseilInput.trim()]);
      setConseilInput("");
    }
  }

  function addResto() {
    const r: Resto = { id: `r_${Date.now()}`, nom: "", description: "", note: 5, photo: "", adresse: "" };
    set("restos", [...form.restos, r]);
  }

  function updateResto(id: string, key: string, value: any) {
    set("restos", form.restos.map((r) => r.id === id ? { ...r, [key]: value } : r));
  }

  function removeResto(id: string) {
    set("restos", form.restos.filter((r) => r.id !== id));
  }

  function addEndroit() {
    const e: Endroit = { id: `e_${Date.now()}`, nom: "", description: "", conseil: "", photo: "", type: "Autre" };
    set("endroits", [...form.endroits, e]);
  }

  function updateEndroit(id: string, key: string, value: any) {
    set("endroits", form.endroits.map((e) => e.id === id ? { ...e, [key]: value } : e));
  }

  function removeEndroit(id: string) {
    set("endroits", form.endroits.filter((e) => e.id !== id));
  }

  async function handleSave() {
    if (!form.titre || !form.pays) return alert("Titre et pays obligatoires");
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/voyages/${voyage!.id}` : "/api/admin/voyages";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Erreur ${res.status} : ${data.error || "Impossible de sauvegarder"}`);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      alert("Erreur réseau — impossible de joindre le serveur");
    } finally {
      setSaving(false);
    }
  }

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(0,255,153,0.3)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#fff", fontFamily: "var(--font-inter)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 40px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(7,7,16,0.95)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "13px" }}>
            ← Dashboard
          </Link>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>
            {isEdit ? `Modifier : ${voyage!.titre}` : "Nouveau voyage"}
          </span>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          background: saving ? "rgba(0,255,153,0.4)" : "#00ff99",
          color: "#0d1117",
          fontWeight: 700,
          fontSize: "13px",
          padding: "10px 24px",
          borderRadius: "10px",
          border: "none",
          cursor: saving ? "not-allowed" : "pointer",
          letterSpacing: "0.03em",
          transition: "transform 0.15s",
        }}
          onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
        >
          {saving ? "Sauvegarde..." : isEdit ? "💾 Sauvegarder" : "✅ Publier"}
        </button>
      </header>

      {/* ── Bannière d'erreur ── */}
      {errorMsg && (
        <div style={{
          background: "rgba(255,60,60,0.12)", border: "1px solid rgba(255,60,60,0.3)",
          color: "#ff6b6b", padding: "14px 24px", fontSize: "13px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>
      )}

      <main style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 40px" }}>

        {/* ── Infos de base */}
        <div style={CARD}>
          <div style={SECTION_TITLE}>🗺️ Informations générales</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={LABEL}>Titre du voyage *</label>
              <input style={INPUT} value={form.titre} onChange={(e) => set("titre", e.target.value)}
                placeholder="Ex: 3 mois au Japon" onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={LABEL}>Pays *</label>
              <input style={INPUT} value={form.pays} onChange={(e) => set("pays", e.target.value)}
                placeholder="Ex: Japon" onFocus={inputFocus} onBlur={inputBlur} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={LABEL}>Emoji</label>
              <input style={INPUT} value={form.emoji} onChange={(e) => set("emoji", e.target.value)}
                placeholder="🇯🇵" onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={LABEL}>Date début</label>
              <input style={INPUT} type="date" value={form.dateDebut} onChange={(e) => set("dateDebut", e.target.value)}
                onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={LABEL}>Date fin</label>
              <input style={INPUT} type="date" value={form.dateFin} onChange={(e) => set("dateFin", e.target.value)}
                onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={LABEL}>Budget/jour (€)</label>
              <input style={INPUT} type="number" value={form.budgetJour} onChange={(e) => set("budgetJour", Number(e.target.value))}
                placeholder="80" onFocus={inputFocus} onBlur={inputBlur} />
            </div>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={LABEL}>Résumé court</label>
            <textarea style={{ ...INPUT, height: "80px", resize: "vertical" } as any}
              value={form.resume} onChange={(e) => set("resume", e.target.value)}
              placeholder="Un aperçu rapide de ce voyage..." onFocus={inputFocus} onBlur={inputBlur} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input type="checkbox" id="mea" checked={form.miseEnAvant}
              onChange={(e) => set("miseEnAvant", e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }} />
            <label htmlFor="mea" style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", cursor: "pointer" }}>
              ⭐ Mettre ce voyage à la une
            </label>
          </div>
        </div>

        {/* ── Photo couverture */}
        <div style={CARD}>
          <div style={SECTION_TITLE}>📸 Photo de couverture</div>
          {form.photoCouverture ? (
            <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
              <img src={form.photoCouverture} alt="cover"
                style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }} />
              <button onClick={() => set("photoCouverture", "")} style={{
                position: "absolute", top: "12px", right: "12px",
                background: "rgba(0,0,0,0.7)", border: "none", color: "#fff",
                padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px",
              }}>✕ Changer</button>
            </div>
          ) : (
            <div onClick={() => coverRef.current?.click()} style={{
              border: "2px dashed rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "48px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "16px",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,153,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              {uploadingCover ? (
                <p style={{ color: "rgba(255,255,255,0.4)" }}>Upload en cours...</p>
              ) : (
                <>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>🖼️</div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                    Cliquer pour uploader une photo
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", marginTop: "6px" }}>
                    JPG, PNG, WEBP — max 10MB
                  </p>
                </>
              )}
            </div>
          )}
          <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} />
        </div>

        {/* ── Restos */}
        <div style={CARD}>
          <div style={{ ...SECTION_TITLE, justifyContent: "space-between" }}>
            <span>🍜 Restaurants & Nourriture</span>
            <button onClick={addResto} style={{
              background: "rgba(0,255,153,0.1)", color: "#00ff99", border: "1px solid rgba(0,255,153,0.2)",
              padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600,
            }}>+ Ajouter</button>
          </div>
          {form.restos.map((r) => (
            <div key={r.id} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px", padding: "20px", marginBottom: "12px",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={LABEL}>Nom</label>
                  <input style={INPUT} value={r.nom} onChange={(e) => updateResto(r.id, "nom", e.target.value)}
                    placeholder="Ramen Ichiran" onFocus={inputFocus} onBlur={inputBlur} />
                </div>
                <div>
                  <label style={LABEL}>Adresse / Quartier</label>
                  <input style={INPUT} value={r.adresse} onChange={(e) => updateResto(r.id, "adresse", e.target.value)}
                    placeholder="Shibuya, Tokyo" onFocus={inputFocus} onBlur={inputBlur} />
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={LABEL}>Description</label>
                <textarea style={{ ...INPUT, height: "60px", resize: "vertical" } as any}
                  value={r.description} onChange={(e) => updateResto(r.id, "description", e.target.value)}
                  placeholder="Un ramen incroyable, bouillon riche..." onFocus={inputFocus} onBlur={inputBlur} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <label style={{ ...LABEL, margin: 0 }}>Note :</label>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} onClick={() => updateResto(r.id, "note", n)}
                      style={{ fontSize: "20px", cursor: "pointer", opacity: n <= r.note ? 1 : 0.25, transition: "opacity 0.15s" }}>
                      ⭐
                    </span>
                  ))}
                </div>
                <button onClick={() => removeResto(r.id)} style={{
                  background: "transparent", border: "none", color: "rgba(255,80,80,0.5)",
                  cursor: "pointer", fontSize: "12px",
                }}>🗑️ Supprimer</button>
              </div>
            </div>
          ))}
          {form.restos.length === 0 && (
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", textAlign: "center", padding: "20px" }}>
              Aucun restaurant ajouté
            </p>
          )}
        </div>

        {/* ── Endroits */}
        <div style={CARD}>
          <div style={{ ...SECTION_TITLE, justifyContent: "space-between" }}>
            <span>📍 Endroits à visiter</span>
            <button onClick={addEndroit} style={{
              background: "rgba(0,255,153,0.1)", color: "#00ff99", border: "1px solid rgba(0,255,153,0.2)",
              padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600,
            }}>+ Ajouter</button>
          </div>
          {form.endroits.map((e) => (
            <div key={e.id} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px", padding: "20px", marginBottom: "12px",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={LABEL}>Nom du lieu</label>
                  <input style={INPUT} value={e.nom} onChange={(ev) => updateEndroit(e.id, "nom", ev.target.value)}
                    placeholder="Temple Fushimi Inari" onFocus={inputFocus} onBlur={inputBlur} />
                </div>
                <div>
                  <label style={LABEL}>Type</label>
                  <select style={{ ...INPUT, cursor: "pointer" }} value={e.type}
                    onChange={(ev) => updateEndroit(e.id, "type", ev.target.value)}
                    onFocus={inputFocus} onBlur={inputBlur}>
                    {["Temple", "Musée", "Nature", "Plage", "Ville", "Marché", "Autre"].map((t) => (
                      <option key={t} value={t} style={{ background: "#0d1117" }}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={LABEL}>Description</label>
                <textarea style={{ ...INPUT, height: "60px", resize: "vertical" } as any}
                  value={e.description} onChange={(ev) => updateEndroit(e.id, "description", ev.target.value)}
                  placeholder="Ce que j'ai aimé..." onFocus={inputFocus} onBlur={inputBlur} />
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={LABEL}>Conseil pratique</label>
                  <input style={INPUT} value={e.conseil} onChange={(ev) => updateEndroit(e.id, "conseil", ev.target.value)}
                    placeholder="Y aller tôt le matin pour éviter la foule" onFocus={inputFocus} onBlur={inputBlur} />
                </div>
                <button onClick={() => removeEndroit(e.id)} style={{
                  background: "transparent", border: "none", color: "rgba(255,80,80,0.5)",
                  cursor: "pointer", fontSize: "12px", paddingBottom: "11px",
                }}>🗑️</button>
              </div>
            </div>
          ))}
          {form.endroits.length === 0 && (
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", textAlign: "center", padding: "20px" }}>
              Aucun endroit ajouté
            </p>
          )}
        </div>

        {/* ── Galerie */}
        <div style={CARD}>
          <div style={{ ...SECTION_TITLE, justifyContent: "space-between" }}>
            <span>🖼️ Galerie photos</span>
            <button onClick={() => galerieRef.current?.click()} disabled={uploadingGalerie} style={{
              background: "rgba(0,255,153,0.1)", color: "#00ff99", border: "1px solid rgba(0,255,153,0.2)",
              padding: "7px 16px", borderRadius: "8px", cursor: uploadingGalerie ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 600,
            }}>{uploadingGalerie ? "Upload en cours..." : "+ Ajouter des photos"}</button>
          </div>
          <input ref={galerieRef} type="file" accept="image/*" multiple onChange={handleGalerieUpload} style={{ display: "none" }} />
          {form.galerie.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {form.galerie.map((url, i) => (
                <div key={i} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "1" }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => set("galerie", form.galerie.filter((_, j) => j !== i))}
                    style={{
                      position: "absolute", top: "6px", right: "6px",
                      background: "rgba(0,0,0,0.7)", border: "none", color: "#fff",
                      width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", fontSize: "10px",
                    }}>✕</button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", textAlign: "center", padding: "20px" }}>
              Aucune photo dans la galerie
            </p>
          )}
        </div>

        {/* ── Conseils */}
        <div style={CARD}>
          <div style={SECTION_TITLE}>💡 Conseils pratiques</div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <input style={{ ...INPUT, flex: 1 }} value={conseilInput}
              onChange={(e) => setConseilInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addConseil(); }}
              placeholder="Ex: Acheter la JR Pass à l'avance..." onFocus={inputFocus} onBlur={inputBlur} />
            <button onClick={addConseil} style={{
              background: "rgba(0,255,153,0.1)", color: "#00ff99", border: "1px solid rgba(0,255,153,0.2)",
              padding: "11px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap",
            }}>+ Ajouter</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {form.conseils.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(255,255,255,0.04)", padding: "10px 14px", borderRadius: "8px",
              }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>💡 {c}</span>
                <button onClick={() => set("conseils", form.conseils.filter((_, j) => j !== i))}
                  style={{ background: "none", border: "none", color: "rgba(255,80,80,0.5)", cursor: "pointer" }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hashtags */}
        <div style={CARD}>
          <div style={SECTION_TITLE}># Hashtags</div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <input style={{ ...INPUT, flex: 1 }} value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addHashtag(); }}
              placeholder="Ex: japon, tokyo, streetfood..." onFocus={inputFocus} onBlur={inputBlur} />
            <button onClick={addHashtag} style={{
              background: "rgba(0,255,153,0.1)", color: "#00ff99", border: "1px solid rgba(0,255,153,0.2)",
              padding: "11px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: 600,
            }}>+ Ajouter</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {form.hashtags.map((tag) => (
              <span key={tag} style={{
                background: "rgba(0,255,153,0.07)", border: "1px solid rgba(0,255,153,0.15)",
                color: "rgba(0,255,153,0.8)", padding: "5px 12px", borderRadius: "20px",
                fontSize: "12px", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "8px",
              }}>
                #{tag}
                <span onClick={() => set("hashtags", form.hashtags.filter((t) => t !== tag))}
                  style={{ cursor: "pointer", opacity: 0.5, fontSize: "10px" }}>✕</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Article */}
        <div style={CARD}>
          <div style={SECTION_TITLE}>✍️ Article complet</div>
          <textarea
            style={{ ...INPUT, height: "260px", resize: "vertical", lineHeight: "1.7" } as any}
            value={form.contenu}
            onChange={(e) => set("contenu", e.target.value)}
            placeholder="Raconte ton voyage en détail... (Markdown supporté)"
            onFocus={inputFocus} onBlur={inputBlur}
          />
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "8px" }}>
            Markdown supporté : **gras**, *italique*, ## titres, - listes
          </p>
        </div>

        {/* Save button */}
        <div style={{ textAlign: "center", paddingBottom: "48px" }}>
          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? "rgba(0,255,153,0.4)" : "#00ff99",
            color: "#0d1117", fontWeight: 800, fontSize: "15px",
            padding: "16px 48px", borderRadius: "12px", border: "none",
            cursor: saving ? "not-allowed" : "pointer", letterSpacing: "0.03em",
            transition: "transform 0.15s",
          }}
            onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            {saving ? "Sauvegarde..." : isEdit ? "💾 Sauvegarder les modifications" : "✅ Publier le voyage"}
          </button>
        </div>
      </main>
    </div>
  );
}
