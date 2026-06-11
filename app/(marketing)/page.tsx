"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [hovered, setHovered] = useState<"pro" | "nomade" | null>(null);

  return (
    <main
      className="relative landing-main flex-1"
      style={{
        display: "flex",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── PRO SIDE ────────────────────────────────────────── */}
      <div
        className="landing-panel relative flex flex-col justify-center items-center overflow-hidden cursor-pointer"
        style={{
          flex: hovered === "nomade" ? "0 0 28%" : hovered === "pro" ? "0 0 72%" : "0 0 50%",
          transition: "flex 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
          background: "#0E1B1E",
        }}
        onMouseEnter={() => setHovered("pro")}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(14,27,30,0.7) 0%, rgba(14,27,30,0.45) 100%)",
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,180,84,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,84,0.035) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Aurora glow */}
        <div
          className="absolute pointer-events-none animate-aurora"
          style={{
            top: "50%",
            left: "50%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(255,180,84,0.14) 0%, transparent 65%)",
            borderRadius: "50%",
            transformOrigin: "center",
          }}
        />

        {/* Content */}
        <div
          className="landing-content relative z-10 flex flex-col items-start px-16 max-w-lg w-full"
          style={{
            opacity: hovered === "nomade" ? 0.35 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* Eyebrow */}
          <div
            className="landing-sub font-mono mb-3"
            style={{
              fontSize: "13px",
              color: "var(--amber)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            // PRO
          </div>

          {/* Status badge */}
          <div
            className="landing-badge mb-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{
              border: "1px solid rgba(255,180,84,0.18)",
              background: "rgba(255,180,84,0.05)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--amber)",
                boxShadow: "0 0 10px #FFB454",
                animation: "blink 2s ease-in-out infinite",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              className="font-mono"
              style={{
                color: "var(--amber)",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Available for work
            </span>
          </div>

          {/* Big heading */}
          <h1
            className="landing-h1 font-display"
            style={{
              fontSize: "clamp(4rem, 8vw, 7rem)",
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: "-0.005em",
              color: "#ffffff",
              marginBottom: "20px",
            }}
          >
            MIKE
            <span style={{ color: "var(--amber)" }}>DEV</span>
            <br />
            <span className="landing-sub font-mono" style={{ fontSize: "0.45em", letterSpacing: "0.02em", color: "rgba(255,180,84,0.5)" }}>
              nomad.com /pro
            </span>
          </h1>

          {/* Sub line */}
          <p
            className="landing-sub font-mono"
            style={{
              color: "rgba(255,180,84,0.85)",
              fontSize: "12px",
              letterSpacing: "0.16em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            Full-Stack · Security · DevOps
          </p>

          <p
            className="landing-desc font-body"
            style={{
              color: "var(--mist)",
              fontSize: "14px",
              lineHeight: 1.8,
              marginBottom: "44px",
              maxWidth: "300px",
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            }}
          >
            I build secure, performant &
            <br />
            well-architected products.
          </p>

          {/* CTA */}
          <Link
            href="/pro"
            className="landing-cta font-display rounded-btn inline-flex items-center gap-3 group"
            style={{
              padding: "14px 32px",
              background: "var(--amber)",
              color: "var(--ink)",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFD79A";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFB454";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            PRO Universe
            <span style={{ transition: "transform 0.2s" }} className="group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Corner index */}
        <div
          className="landing-corner font-mono absolute bottom-8 left-8"
          style={{
            color: "rgba(143,163,156,0.4)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          01 / Developer
        </div>
      </div>

      {/* ── DIVIDER ─────────────────────────────────────────── */}
      <div
        className="landing-divider"
        style={{
          width: "1px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(35,64,71,0.9) 30%, rgba(35,64,71,0.9) 70%, transparent 100%)",
          flexShrink: 0,
          zIndex: 10,
        }}
      />

      {/* ── LOGO EN HAUT ────────────────────────────────────── */}
      <div
        className="landing-logo"
        style={{
          position: "absolute",
          top: "36px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        <div style={{ position: "relative", width: 56, height: 56 }}>
          {/* Logo (PRO) */}
          <Image
            src="/images/mikedev_white.png"
            alt="MikeDevNomad"
            width={56}
            height={56}
            style={{
              objectFit: "contain",
              position: "absolute",
              top: 0, left: 0,
              opacity: hovered === "nomade" ? 0 : 1,
              filter: "drop-shadow(0 0 12px rgba(255,180,84,0.3))",
              transition: "opacity 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          />
          {/* Logo (NOMADE) */}
          <Image
            src="/images/mikedev_white.png"
            alt="MikeDevNomad"
            width={56}
            height={56}
            style={{
              objectFit: "contain",
              position: "absolute",
              top: 0, left: 0,
              opacity: hovered === "nomade" ? 1 : 0,
              filter: "drop-shadow(0 0 12px rgba(95,211,188,0.3))",
              transition: "opacity 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          />
        </div>
        <span className="font-mono" style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--muted)",
          transition: "color 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
        }}>
          mikedevnomad.com
        </span>
      </div>

      {/* ── NOMADE SIDE ─────────────────────────────────────── */}
      <div
        className="landing-panel relative flex flex-col justify-center items-center overflow-hidden cursor-pointer"
        style={{
          flex: hovered === "pro" ? "0 0 28%" : hovered === "nomade" ? "0 0 72%" : "0 0 50%",
          transition: "flex 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
          background: "#0E1B1E",
        }}
        onMouseEnter={() => setHovered("nomade")}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.32,
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(14,27,30,0.75) 0%, rgba(14,27,30,0.5) 100%)",
          }}
        />

        {/* Gradient orbs */}
        <div
          className="absolute pointer-events-none animate-float"
          style={{
            top: "15%",
            right: "15%",
            width: "350px",
            height: "350px",
            background: "rgba(95,211,188,0.22)",
            borderRadius: "50%",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "15%",
            left: "15%",
            width: "250px",
            height: "250px",
            background: "rgba(95,211,188,0.15)",
            borderRadius: "50%",
            filter: "blur(70px)",
            animation: "float 8s ease-in-out infinite 1.5s reverse",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "40%",
            width: "180px",
            height: "180px",
            background: "rgba(95,211,188,0.12)",
            borderRadius: "50%",
            filter: "blur(50px)",
            animation: "float 10s ease-in-out infinite 3s",
          }}
        />

        {/* Content */}
        <div
          className="landing-content relative z-10 flex flex-col items-start px-16 max-w-lg w-full"
          style={{
            opacity: hovered === "pro" ? 0.35 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* Eyebrow */}
          <div
            className="landing-sub font-mono mb-3"
            style={{
              fontSize: "13px",
              color: "var(--mint)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            // NOMAD
          </div>

          {/* Badge */}
          <div
            className="landing-badge mb-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{
              border: "1px solid rgba(95,211,188,0.25)",
              background: "rgba(95,211,188,0.07)",
            }}
          >
            <span style={{ fontSize: "12px" }}>🌍</span>
            <span
              className="font-mono"
              style={{
                color: "var(--mint)",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Currently traveling
            </span>
          </div>

          {/* Big heading */}
          <h1
            className="landing-h1 font-display"
            style={{
              fontSize: "clamp(4rem, 8vw, 7rem)",
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: "-0.005em",
              color: "#ffffff",
              marginBottom: "20px",
            }}
          >
            MIKE
            <span style={{ color: "var(--mint)" }}>NOM</span>
            <br />
            <span className="landing-sub font-mono" style={{ fontSize: "0.45em", letterSpacing: "0.02em", color: "rgba(95,211,188,0.5)" }}>
              ad.com /nomade
            </span>
          </h1>

          {/* Destinations */}
          <p
            className="landing-sub font-mono"
            style={{
              color: "var(--muted)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            🇦🇺 · 🇯🇵 · 🇲🇦 · 🇵🇹 · 🇹🇭 · 🇲🇽
          </p>

          <p
            className="landing-desc font-body"
            style={{
              color: "var(--mist)",
              fontSize: "14px",
              lineHeight: 1.8,
              marginBottom: "44px",
              maxWidth: "300px",
            }}
          >
            I code from cafés around the world
            <br />
            and share my adventures here.
          </p>

          {/* CTA */}
          <Link
            href="/nomade"
            className="landing-cta font-display rounded-btn inline-flex items-center gap-3 group"
            style={{
              padding: "14px 32px",
              background: "var(--mint)",
              color: "var(--ink)",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8FE5D3";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#5FD3BC";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Nomad Universe
            <span style={{ transition: "transform 0.2s" }} className="group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Corner index */}
        <div
          className="landing-corner font-mono absolute bottom-8 right-8"
          style={{
            color: "rgba(143,163,156,0.4)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          02 / Nomad
        </div>
      </div>
    </main>
  );
}
