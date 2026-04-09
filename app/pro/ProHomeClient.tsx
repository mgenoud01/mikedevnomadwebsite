"use client";

import Link from "next/link";
import { ProProfile } from "@/lib/proProfile";

const sections = [
  { href: "/pro/portfolio", num: "01", title: "Portfolio",    desc: "Projects, tech stack & achievements.",        tag: "work",       accent: "#6366f1" },
  { href: "/pro/cv",        num: "02", title: "Resume",       desc: "Experience, skills & background.",            tag: "background", accent: "#0ea5e9" },
  { href: "/pro/cybersecurite", num: "03", title: "Security", desc: "CTF, write-ups, research & tools.",          tag: "Security+",  accent: "#00ff99" },
  { href: "/pro/contact",   num: "04", title: "Contact",      desc: "Available for freelance — let's talk.",      tag: "Open",       accent: "#f59e0b" },
];

export default function ProHomeClient({ profile }: { profile: ProProfile }) {
  const stats = [
    { value: `${profile.yearsExp}+`, label: "years exp.",   icon: "📅" },
    { value: `${profile.projectsShipped}+`, label: "projects", icon: "🚀" },
    { value: `${profile.ctfPodiums}`,  label: "CTF podiums", icon: "🏆" },
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "72px 32px 96px" }}>

      {/* Terminal prompt */}
      <div style={{
        fontFamily: "var(--font-mono)", color: "#00ff99", fontSize: "13px", letterSpacing: "0.06em",
        marginBottom: "40px", display: "flex", alignItems: "center", gap: "8px",
        background: "rgba(0,255,153,0.06)", border: "1px solid rgba(0,255,153,0.15)",
        borderRadius: "8px", padding: "10px 16px", width: "fit-content",
      }}>
        <span style={{ color: "rgba(0,255,153,0.5)" }}>$</span>
        <span>whoami</span>
        <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 4px" }}>→</span>
        <span style={{ color: "#e6edf3", fontWeight: 600 }}>Mike Genoud</span>
        {profile.disponible && (
          <span style={{ marginLeft: "8px", background: "rgba(0,255,153,0.1)", color: "#00ff99", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: 600, letterSpacing: "0.08em" }}>
            ● available
          </span>
        )}
        <span style={{ width: "7px", height: "14px", background: "#00ff99", display: "inline-block", marginLeft: "4px", animation: "blink 1s step-end infinite" }} />
      </div>

      {/* Hero */}
      <h1 style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.05em", color: "#ffffff", marginBottom: "24px" }}>
        Mike,<br />
        <span className="text-gradient-pro">Dev & Sec.</span>
      </h1>

      <p style={{ color: "rgba(230,237,243,0.7)", fontSize: "17px", lineHeight: 1.8, maxWidth: "500px", marginBottom: "48px" }}>
        {profile.bio}
      </p>

      {/* Skills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "64px" }}>
        {profile.skills.map((s) => (
          <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: "12px", padding: "6px 14px", border: "1px solid rgba(0,255,153,0.2)", color: "rgba(0,255,153,0.75)", letterSpacing: "0.05em", background: "rgba(0,255,153,0.06)", borderRadius: "6px", fontWeight: 600 }}>
            {s}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "72px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
            <p style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 1, marginBottom: "6px" }}>{s.value}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Section label */}
      <p style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
        // explore
      </p>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {sections.map((section) => (
          <Link key={section.href} href={section.href} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 24px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none",
            borderRadius: "10px", transition: "background 0.2s, border-color 0.2s, transform 0.15s",
          }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `${section.accent}10`; el.style.borderColor = `${section.accent}40`; el.style.transform = "translateX(4px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.transform = "translateX(0)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)", fontSize: "11px", letterSpacing: "0.1em", width: "22px", flexShrink: 0 }}>{section.num}</span>
              <div>
                <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.01em", marginBottom: "3px" }}>{section.title}</p>
                <p style={{ color: "rgba(230,237,243,0.5)", fontSize: "13px" }}>{section.desc}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: section.accent, letterSpacing: "0.06em", background: `${section.accent}15`, border: `1px solid ${section.accent}30`, padding: "3px 10px", borderRadius: "20px" }}>{section.tag}</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
