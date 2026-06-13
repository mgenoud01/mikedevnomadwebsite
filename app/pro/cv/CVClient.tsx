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
    <div className="mx-auto max-w-[900px] px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="mb-5 font-mono text-[12px] uppercase tracking-[.12em] text-mint">
          // cat ./mike.resume.json
        </p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[0.95] tracking-tight text-white">
          CV
        </h1>
        <p className="mt-3 font-mono text-[14px] text-muted">
          Developer · Cybersecurity · Digital nomad
        </p>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-12 rounded-card border border-line bg-panel-2 p-6">
          <p className="text-[15px] leading-[1.8] text-mist">{profile.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { v: `${profile.yearsExp}+`, l: "years exp." },
          { v: `${profile.projectsShipped}+`, l: "projects" },
          { v: `${profile.ctfPodiums}`, l: "CTF podiums" },
        ].map((s) => (
          <div key={s.l} className="rounded-card border border-line bg-panel-2 p-5 text-center">
            <p className="mb-1 font-display text-[2rem] font-bold tracking-tight text-white">{s.v}</p>
            <p className="font-mono text-[10px] uppercase tracking-[.1em] text-muted">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Work Experience */}
      {work.length > 0 && (
        <section className="mb-14">
          <p className="mb-7 font-mono text-[11px] uppercase tracking-[.18em] text-mint">
            // Experience
          </p>
          <div className="flex flex-col">
            {work.map((exp, i) => (
              <div key={exp.id} className="relative flex gap-8 pb-8 last:pb-0">
                {i < work.length - 1 && <div className="absolute bottom-0 left-[95px] top-6 w-px bg-line" />}
                <div className="w-[90px] shrink-0 pt-0.5">
                  <span className="whitespace-nowrap font-mono text-[11px] text-muted">{formatPeriod(exp)}</span>
                </div>
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-mint/40 bg-mint/15" />
                <div className="flex-1 pb-7">
                  <p className="mb-1 text-[16px] font-semibold tracking-tight text-white">{exp.poste}</p>
                  <p className={`font-mono text-[12px] tracking-[.06em] text-mint ${exp.lieu ? "mb-1" : "mb-2"}`}>{exp.entreprise}</p>
                  {exp.lieu && <p className="mb-2 font-mono text-[11px] text-muted">📍 {exp.lieu}</p>}
                  {exp.description && <p className="mb-2.5 text-[14px] leading-[1.7] text-mist">{exp.description}</p>}
                  {exp.competences.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.competences.map((c) => (
                        <span key={c} className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted">{c}</span>
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
        <section className="mb-14">
          <p className="mb-7 font-mono text-[11px] uppercase tracking-[.18em] text-mint">
            // Education
          </p>
          <div className="flex flex-col gap-4">
            {education.map((exp) => (
              <div key={exp.id} className="rounded-card border border-line bg-panel-2 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-[15px] font-semibold text-white">{exp.poste}</p>
                    <p className="font-mono text-[12px] text-mint">{exp.entreprise}</p>
                  </div>
                  <span className="font-mono text-[11px] text-muted">{formatPeriod(exp)}</span>
                </div>
                {exp.description && <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <section>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[.18em] text-mint">
            // Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span key={s} className="rounded border border-mint/20 bg-mint/[0.05] px-3 py-1.5 font-mono text-[12px] tracking-[.04em] text-mint">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Liens */}
      {(profile.email || profile.github || profile.linkedin) && (
        <div className="mt-12 flex flex-wrap gap-5 border-t border-line pt-8">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="font-mono text-[12px] text-mint hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]">
              ✉ {profile.email}
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] text-muted hover:text-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]">
              GitHub →
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] text-muted hover:text-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]">
              LinkedIn →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
