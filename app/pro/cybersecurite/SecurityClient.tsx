"use client";

import { CTFEntry } from "@/lib/ctf";

const DIFF_COLOR: Record<string, string> = {
  Easy: "#5FD3BC", Medium: "#FFB454", Hard: "#f97316", Insane: "#ef4444",
};

export default function SecurityClient({ entries }: { entries: CTFEntry[] }) {
  return (
    <div className="mx-auto max-w-[1000px] px-6 py-16 md:py-24">
      <div style={{ marginBottom: "56px" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "rgba(95,211,188,0.6)", fontSize: "12px", letterSpacing: "0.12em", marginBottom: "20px" }}>
          $ nmap --open -sV target
        </p>
        <h1 className="font-display" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 0.95, marginBottom: "16px" }}>
          Cybersécurité
        </h1>
        <p style={{ color: "rgba(230,237,243,0.5)", fontSize: "15px", maxWidth: "440px", lineHeight: 1.7 }}>
          Ethical hacking, write-ups CTF et recherche en sécurité. Je casse les systèmes pour mieux comprendre comment les construire.
        </p>
      </div>

      {/* CTF entries */}
      <section style={{ marginBottom: "64px" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--mint)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "20px" }}>
          // CTF Write-ups
        </p>

        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", border: "1px dashed var(--line)", borderRadius: "12px" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔐</div>
            <p style={{ color: "rgba(255,255,255,0.3)" }}>Aucun write-up pour le moment — ajoute-les depuis l&apos;admin.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {entries.map((w) => {
              const color = DIFF_COLOR[w.difficulte] || "#8FA39C";
              return (
                <div key={w.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 22px", background: "var(--panel-2)",
                  border: "1px solid var(--line)", borderRadius: "8px",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--mint)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--line)"; }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <p style={{ color: "#ffffff", fontWeight: 600, fontSize: "15px" }}>{w.nom}</p>
                      {w.tags.slice(0, 2).map((t) => (
                        <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "1px 7px", border: "1px solid var(--line)", color: "var(--muted)", borderRadius: "3px" }}>#{t}</span>
                      ))}
                    </div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)", letterSpacing: "0.06em" }}>
                      {w.categorie} · {w.plateforme} · {w.date}
                    </p>
                    {w.description && <p style={{ color: "rgba(230,237,243,0.4)", fontSize: "13px", marginTop: "6px", lineHeight: 1.6 }}>{w.description}</p>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, marginLeft: "16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "4px 12px", borderRadius: "4px", border: `1px solid ${color}30`, color, background: `${color}0a`, letterSpacing: "0.08em" }}>
                      {w.difficulte}
                    </span>
                    {w.writeup && (
                      <a href={w.writeup} target="_blank" rel="noopener noreferrer" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--mint)", textDecoration: "none" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
                      >
                        writeup →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
