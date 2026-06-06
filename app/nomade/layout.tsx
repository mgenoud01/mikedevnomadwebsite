"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/nomade", label: "Home" },
  { href: "/nomade/voyages", label: "Trips" },
  { href: "/nomade/galerie", label: "Gallery" },
];

export default function NomadeLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "#faf7f0", color: "#1c1917", fontFamily: "var(--font-inter)",
    }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,247,240,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(245,158,11,0.1)",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto", padding: "0 20px", height: "58px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/nomade" style={{
            fontWeight: 900, fontSize: "17px", textDecoration: "none",
            letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ fontSize: "14px" }}>🌍</span>
            <span className="text-gradient-nomade">DevNomad</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ gap: "2px" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{
                fontSize: "13px", color: "#78716c", padding: "6px 14px",
                borderRadius: "20px", textDecoration: "none", fontWeight: 500,
                transition: "color 0.15s ease, background 0.15s ease", letterSpacing: "-0.01em",
              }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#1c1917"; el.style.background = "rgba(245,158,11,0.1)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#78716c"; el.style.background = "transparent"; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/pro" className="nav-switcher" style={{
              fontSize: "11px", color: "#78716c", textDecoration: "none",
              letterSpacing: "0.06em", padding: "6px 14px",
              border: "1px solid rgba(0,0,0,0.1)", borderRadius: "20px",
              fontWeight: 500, transition: "all 0.15s ease", textTransform: "uppercase",
            }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#1c1917"; el.style.borderColor = "rgba(0,0,0,0.2)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#78716c"; el.style.borderColor = "rgba(0,0,0,0.1)"; }}
            >
              ← PRO
            </Link>

            {/* Hamburger */}
            <button
              className="nav-mobile-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: "#1c1917", background: "transparent", border: "none", cursor: "pointer", fontSize: "20px", padding: "6px" }}
              aria-label="Menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: "rgba(250,247,240,0.98)", borderTop: "1px solid rgba(245,158,11,0.1)",
            padding: "16px 20px 24px",
          }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                display: "block", fontSize: "16px", color: "#1c1917",
                padding: "13px 8px", borderBottom: "1px solid rgba(0,0,0,0.06)",
                textDecoration: "none", fontWeight: 600,
              }}>
                {link.label}
              </Link>
            ))}
            <Link href="/pro" onClick={() => setMenuOpen(false)} style={{
              display: "block", fontSize: "14px", color: "#78716c",
              padding: "14px 8px", textDecoration: "none", fontWeight: 500, marginTop: "4px",
            }}>
              ← PRO
            </Link>
          </div>
        )}
      </header>

      {/* ── Content ────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(245,158,11,0.1)", padding: "32px 20px", textAlign: "center" }}>
        <p style={{ color: "rgba(28,25,23,0.3)", fontSize: "13px" }}>
          Made with ❤️ and a lot of hotel WiFi
        </p>
      </footer>
    </div>
  );
}
