"use client";

import { Experience } from "@/lib/experience";
import { ProProfile } from "@/lib/proProfile";


export default function CVClient({ experiences, profile }: { experiences: Experience[]; profile: ProProfile }) {
  const byDateDesc = (a: Experience, b: Experience) =>
    new Date(b.dateDebut || 0).getTime() - new Date(a.dateDebut || 0).getTime();
  const work = experiences.filter((e) => e.type === "work").sort(byDateDesc);
  const education = experiences.filter((e) => e.type === "education").sort(byDateDesc);

  function formatPeriod(e: Experience) {
    const start = e.dateDebut ? new Date(e.dateDebut).getFullYear() : "";
    const end = e.actuel ? "present" : e.dateFin ? new Date(e.dateFin).getFullYear() : "";
    return `${start} — ${end}`;
  }

  return (
    <div className="page-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "72px 32px 96px" }}>
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "rgba(0,255,153,0.5)", fontSize: "12px", letterSpacing: "0.12em", marginBottom: "20px" }}>
          $ cat ./mike.resume.json
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 0.95, marginBottom: "12px" }}>
          Resume
        </h1>
        <p style={{ color: "rgba(230,237,243,0.5)", fontSize: "14px", letterSpacing: "0.04em" }}>
          Developer · Cybersecurity · Digital Nomad
        </p>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div style={{ background: "rgba(0,255,153,0.04)", border: "1px solid rgba(0,255,153,0.12)", borderRadius: "10px", padding: "20px 24px", marginBottom: "48px" }}>
          <p style={{ color: "rgba(230,237,243,0.7)", fontSize: "15px", lineHeight: 1.8 }}>{profile.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="stats-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "56px" }}>
        {[
          { v: `${profile.yearsExp}+`, l: "years exp." },
          { v: `${profile.projectsShipped}+`, l: "projects" },
          { v: `${profile.ctfPodiums}`, l: "CTF podiums" },
        ].map((s) => (
          <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", marginBottom: "4px" }}>{s.v}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Work Experience */}
      {work.length > 0 && (
        <section style={{ marginBottom: "56px" }}>
          <p style={{ fontFamily: "var(--font-mono)", color: "rgba(0,255,153,0.55)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "28px" }}>
            // Experience
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {work.map((exp, i) => (
              <div key={exp.id} style={{ display: "flex", gap: "32px", paddingBottom: i < work.length - 1 ? "32px" : "0", position: "relative" }}>
                {i < work.length - 1 && <div style={{ position: "absolute", left: "95px", top: "24px", bottom: "0", width: "1px", background: "rgba(255,255,255,0.06)" }} />}
                <div style={{ width: "90px", flexShrink: 0, paddingTop: "2px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{formatPeriod(exp)}</span>
                </div>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", border: "1px solid rgba(0,255,153,0.4)", background: "rgba(0,255,153,0.15)", flexShrink: 0, marginTop: "6px" }} />
                <div style={{ flex: 1, paddingBottom: "28px" }}>
                  <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.01em", marginBottom: "4px" }}>{exp.poste}</p>
                  <p style={{ fontFamily: "var(--font-mono)", color: "rgba(0,255,153,0.6)", fontSize: "12px", letterSpacing: "0.06em", marginBottom: exp.lieu ? "4px" : "8px" }}>{exp.entreprise}</p>
                  {exp.lieu && <p style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)", fontSize: "11px", marginBottom: "8px" }}>📍 {exp.lieu}</p>}
                  {exp.description && <p style={{ color: "rgba(230,237,243,0.5)", fontSize: "14px", lineHeight: 1.7, marginBottom: "10px" }}>{exp.description}</p>}
                  {exp.competences.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {exp.competences.map((c) => (
                        <span key={c} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "2px 8px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", borderRadius: "3px" }}>{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: "56px" }}>
          <p style={{ fontFamily: "var(--font-mono)", color: "rgba(0,255,153,0.55)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "28px" }}>
            // Education
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {education.map((exp) => (
              <div key={exp.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{exp.poste}</p>
                    <p style={{ fontFamily: "var(--font-mono)", color: "rgba(0,255,153,0.55)", fontSize: "12px" }}>{exp.entreprise}</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>{formatPeriod(exp)}</span>
                </div>
                {exp.description && <p style={{ color: "rgba(230,237,243,0.45)", fontSize: "13px", lineHeight: 1.7, marginTop: "10px" }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <section>
          <p style={{ fontFamily: "var(--font-mono)", color: "rgba(0,255,153,0.55)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "20px" }}>
            // Skills
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {profile.skills.map((s) => (
              <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: "12px", padding: "5px 12px", border: "1px solid rgba(0,255,153,0.18)", color: "rgba(0,255,153,0.7)", borderRadius: "4px", background: "rgba(0,255,153,0.05)", letterSpacing: "0.04em" }}>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Social links */}
      {(profile.email || profile.github || profile.linkedin) && (
        <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {profile.email && <a href={`mailto:${profile.email}`} style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(0,255,153,0.55)", textDecoration: "none" }}>✉ {profile.email}</a>}
          {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>GitHub →</a>}
          {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>LinkedIn →</a>}
        </div>
      )}
    </div>
  );
}
