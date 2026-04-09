"use client";

import Link from "next/link";

const navLinks = [
  { href: "/pro", label: "home" },
  { href: "/pro/portfolio", label: "portfolio" },
  { href: "/pro/cv", label: "cv" },
  { href: "/pro/cybersecurite", label: "security" },
  { href: "/pro/contact", label: "contact" },
];

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col pro-scrollbar"
      style={{ background: "#0e1c2f", color: "#e6edf3", fontFamily: "var(--font-inter)" }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(14,28,47,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "0 32px", height: "58px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/pro" style={{
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px",
            color: "#00ff99", textDecoration: "none", letterSpacing: "0.04em",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            mike
            <span style={{ color: "rgba(255,255,255,0.3)" }}>@devnomad</span>
            <span style={{ color: "rgba(0,255,153,0.5)" }}>:~$</span>
            <span style={{
              width: "6px", height: "13px", background: "#00ff99",
              display: "inline-block",
              animation: "blink 1s step-end infinite", marginLeft: "2px",
            }} />
          </Link>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: "var(--font-mono)", fontSize: "12px",
                color: "rgba(255,255,255,0.5)", padding: "5px 12px",
                borderRadius: "4px", textDecoration: "none",
                letterSpacing: "0.06em", transition: "color 0.15s ease, background 0.15s ease",
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "#00ff99";
                  el.style.background = "rgba(0,255,153,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "rgba(255,255,255,0.5)";
                  el.style.background = "transparent";
                }}
              >
                ~/{link.label}
              </Link>
            ))}
          </nav>

          {/* Universe switcher */}
          <Link href="/nomade" style={{
            fontSize: "11px", color: "rgba(255,255,255,0.4)",
            textDecoration: "none", letterSpacing: "0.08em",
            transition: "color 0.15s ease, border-color 0.15s ease",
            padding: "6px 14px",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "4px", fontWeight: 500,
            textTransform: "uppercase",
          }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "#f59e0b";
              el.style.borderColor = "rgba(245,158,11,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "rgba(255,255,255,0.4)";
              el.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            🌍 Nomad →
          </Link>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "28px 32px", textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          color: "rgba(255,255,255,0.3)",
          fontSize: "12px", letterSpacing: "0.08em",
        }}>
          mike@devnomad:~${" "}
          <span style={{ color: "rgba(0,255,153,0.6)", animation: "blink 1s step-end infinite" }}>▊</span>
        </p>
      </footer>
    </div>
  );
}
