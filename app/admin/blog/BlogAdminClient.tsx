"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Article } from "@/lib/articles";

const CATEGORIES = ["Nomadisme", "Voyage", "Développement", "Sécurité", "Lifestyle"];

const INPUT: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "var(--font-inter)",
};
const LABEL: React.CSSProperties = {
  display: "block", color: "rgba(255,255,255,0.35)", fontSize: "11px",
  letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px",
};
const CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px", padding: "28px", marginBottom: "20px",
};

export default function BlogAdminClient({ articles: initial }: { articles: Article[] }) {
  const [articles, setArticles] = useState(initial);
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState("");

  const emptyForm = { titre: "", categorie: "Nomadisme", date: new Date().toISOString().split("T")[0], resume: "", photoCouverture: "", contenu: "", tags: [] as string[], publie: true };
  const [form, setForm] = useState(emptyForm);

  function set(k: string, v: any) { setForm((f) => ({ ...f, [k]: v })); }
  const focus = (e: any) => { e.target.style.borderColor = "rgba(0,255,153,0.35)"; };
  const blur = (e: any) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; };

  function startCreate() { setForm(emptyForm); setCreating(true); setEditing(null); }
  function startEdit(a: Article) { setForm({ titre: a.titre, categorie: a.categorie, date: a.date, resume: a.resume, photoCouverture: a.photoCouverture, contenu: a.contenu, tags: a.tags, publie: a.publie }); setEditing(a); setCreating(false); }
  function cancel() { setCreating(false); setEditing(null); }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingCover(true);
    const fd = new FormData(); fd.append("file", file); fd.append("folder", "mikedevnomad/blog");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    set("photoCouverture", data.url);
    setUploadingCover(false);
  }

  async function handleSave() {
    if (!form.titre) return alert("Titre obligatoire");
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/articles/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const json = await res.json();
        if (!res.ok) { alert(json.error || "Erreur serveur"); return; }
        setArticles((a) => a.map((x) => x.id === editing.id ? json : x));
      } else {
        const res = await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const json = await res.json();
        if (!res.ok) { alert(json.error || "Erreur serveur"); return; }
        setArticles((a) => [json, ...a]);
      }
      cancel();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    setArticles((a) => a.filter((x) => x.id !== id));
  }

  async function togglePublie(article: Article) {
    const res = await fetch(`/api/admin/articles/${article.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publie: !article.publie }) });
    const updated = await res.json();
    setArticles((a) => a.map((x) => x.id === article.id ? updated : x));
  }

  const showForm = creating || !!editing;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#fff", fontFamily: "var(--font-inter)" }}>
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "13px" }}>← Dashboard</Link>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: "15px" }}>✍️ Blog</span>
        </div>
        {!showForm && (
          <button onClick={startCreate} style={{ background: "#00ff99", color: "#0d1117", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
            + Nouvel article
          </button>
        )}
      </header>

      <main style={{ maxWidth: "820px", margin: "0 auto", padding: "48px 40px" }}>
        {showForm ? (
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "32px", letterSpacing: "-0.02em" }}>
              {editing ? "Modifier l'article" : "Nouvel article"}
            </h2>

            <div style={CARD}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={LABEL}>Titre *</label>
                  <input style={INPUT} value={form.titre} onChange={(e) => set("titre", e.target.value)} placeholder="Mon voyage au Japon..." onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={LABEL}>Catégorie</label>
                  <select style={{ ...INPUT, cursor: "pointer" }} value={form.categorie} onChange={(e) => set("categorie", e.target.value)} onFocus={focus} onBlur={blur}>
                    {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#0d1117" }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={LABEL}>Date</label>
                  <input type="date" style={INPUT} value={form.date} onChange={(e) => set("date", e.target.value)} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={LABEL}>Résumé</label>
                  <textarea style={{ ...INPUT, height: "70px", resize: "vertical" } as any} value={form.resume} onChange={(e) => set("resume", e.target.value)} placeholder="Un bref résumé..." onFocus={focus} onBlur={blur} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="publie" checked={form.publie} onChange={(e) => set("publie", e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                <label htmlFor="publie" style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", cursor: "pointer" }}>Publier cet article</label>
              </div>
            </div>

            {/* Cover */}
            <div style={CARD}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "16px" }}>📸 Image de couverture</div>
              {form.photoCouverture ? (
                <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", marginBottom: "12px" }}>
                  <img src={form.photoCouverture} alt="" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  <button onClick={() => set("photoCouverture", "")} style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>✕ Changer</button>
                </div>
              ) : (
                <div onClick={() => coverRef.current?.click()} style={{ border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "10px", padding: "40px", textAlign: "center", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,153,0.3)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                  {uploadingCover ? <p style={{ color: "rgba(255,255,255,0.4)" }}>Upload...</p> : <><div style={{ fontSize: "28px", marginBottom: "8px" }}>🖼️</div><p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>Cliquer pour uploader</p></>}
                </div>
              )}
              <input ref={coverRef} type="file" accept="image/*" onChange={uploadCover} style={{ display: "none" }} />
            </div>

            {/* Tags */}
            <div style={CARD}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "16px" }}># Tags</div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <input style={{ ...INPUT, flex: 1 }} value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) { set("tags", [...form.tags, tagInput.trim()]); setTagInput(""); } }}
                  placeholder="japon, tokyo..." onFocus={focus} onBlur={blur} />
                <button onClick={() => { if (tagInput.trim()) { set("tags", [...form.tags, tagInput.trim()]); setTagInput(""); } }} style={{ background: "rgba(0,255,153,0.1)", color: "#00ff99", border: "1px solid rgba(0,255,153,0.2)", padding: "11px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}>+</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {form.tags.map((t) => (
                  <span key={t} style={{ background: "rgba(0,255,153,0.07)", border: "1px solid rgba(0,255,153,0.15)", color: "rgba(0,255,153,0.8)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "6px" }}>
                    #{t} <span onClick={() => set("tags", form.tags.filter((x) => x !== t))} style={{ cursor: "pointer", opacity: 0.5, fontSize: "10px" }}>✕</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Contenu */}
            <div style={CARD}>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "16px" }}>✍️ Contenu</div>
              <textarea style={{ ...INPUT, height: "320px", resize: "vertical", lineHeight: "1.7" } as any} value={form.contenu} onChange={(e) => set("contenu", e.target.value)} placeholder="Écris ton article ici... (Markdown supporté)" onFocus={focus} onBlur={blur} />
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "8px" }}>**gras**, *italique*, ## titre, - liste</p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: saving ? "rgba(0,255,153,0.4)" : "#00ff99", color: "#0d1117", fontWeight: 700, fontSize: "14px", padding: "14px", borderRadius: "10px", border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Sauvegarde..." : editing ? "💾 Sauvegarder" : "✅ Publier"}
              </button>
              <button onClick={cancel} style={{ padding: "14px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}>Annuler</button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "6px" }}>Articles</h1>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>{articles.length} article{articles.length > 1 ? "s" : ""}</p>
            </div>

            {articles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", border: "2px dashed rgba(255,255,255,0.08)", borderRadius: "16px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>✍️</div>
                <p style={{ color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>Aucun article pour l'instant</p>
                <button onClick={startCreate} style={{ background: "#00ff99", color: "#0d1117", fontWeight: 700, padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer" }}>Écrire mon premier article</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {articles.map((a) => (
                  <div key={a.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden", display: "grid", gridTemplateColumns: a.photoCouverture ? "120px 1fr" : "1fr" }}>
                    {a.photoCouverture && <img src={a.photoCouverture} alt={a.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ background: "rgba(0,255,153,0.08)", color: "#00ff99", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontFamily: "var(--font-mono)" }}>{a.categorie}</span>
                          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>{a.date}</span>
                          {!a.publie && <span style={{ background: "rgba(255,80,80,0.1)", color: "#ff5050", fontSize: "10px", padding: "2px 8px", borderRadius: "20px" }}>Brouillon</span>}
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.titre}</h3>
                        {a.resume && <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.resume}</p>}
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button onClick={() => togglePublie(a)} title={a.publie ? "Dépublier" : "Publier"} style={{ background: a.publie ? "rgba(0,255,153,0.08)" : "rgba(255,255,255,0.05)", border: `1px solid ${a.publie ? "rgba(0,255,153,0.2)" : "rgba(255,255,255,0.08)"}`, color: a.publie ? "#00ff99" : "rgba(255,255,255,0.3)", padding: "7px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>
                          {a.publie ? "✓ Publié" : "○ Brouillon"}
                        </button>
                        <button onClick={() => startEdit(a)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "7px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>✏️</button>
                        <button onClick={() => handleDelete(a.id)} style={{ background: "transparent", border: "1px solid rgba(255,80,80,0.15)", color: "rgba(255,80,80,0.5)", padding: "7px 10px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
