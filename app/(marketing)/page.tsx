"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [hovered, setHovered] = useState<"pro" | "nomade" | null>(null);

  return (
    <main
      className="relative"
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* ── PRO SIDE ────────────────────────────────────────── */}
      <div
        className="relative flex flex-col justify-center items-center overflow-hidden cursor-pointer"
        style={{
          flex: hovered === "nomade" ? "0 0 28%" : hovered === "pro" ? "0 0 72%" : "0 0 50%",
          transition: "flex 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
          background: "#0e1c2f",
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
            background: "linear-gradient(135deg, rgba(3,3,8,0.65) 0%, rgba(3,3,8,0.4) 100%)",
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,153,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,153,0.035) 1px, transparent 1px)",
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
            background: "radial-gradient(circle, rgba(0,255,153,0.14) 0%, transparent 65%)",
            borderRadius: "50%",
            transformOrigin: "center",
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-start px-16 max-w-lg w-full"
          style={{
            opacity: hovered === "nomade" ? 0.35 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* Status badge */}
          <div
            className="mb-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{
              border: "1px solid rgba(0,255,153,0.18)",
              background: "rgba(0,255,153,0.05)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00ff99",
                boxShadow: "0 0 10px #00ff99",
                animation: "blink 2s ease-in-out infinite",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: "#00ff99",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Available for work
            </span>
          </div>

          {/* Big heading */}
          <h1
            style={{
              fontSize: "clamp(4rem, 8vw, 7rem)",
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: "-0.05em",
              color: "#ffffff",
              marginBottom: "20px",
            }}
          >
            MIKE
            <span className="text-gradient-pro">DEV</span>
            <br />
            <span style={{ fontSize: "0.45em", letterSpacing: "0.02em", color: "rgba(0,255,153,0.5)", fontFamily: "var(--font-mono)" }}>
              nomad.com /pro
            </span>
          </h1>

          {/* Sub line */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(0,255,153,0.75)",
              fontSize: "12px",
              letterSpacing: "0.16em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            Full-Stack · Security · DevOps
          </p>

          <p
            style={{
              color: "rgba(255,255,255,0.75)",
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
            className="inline-flex items-center gap-3 group"
            style={{
              padding: "14px 32px",
              background: "#00ff99",
              color: "#030308",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#00ff99";
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
          className="absolute bottom-8 left-8"
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(255,255,255,0.1)",
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
        style={{
          width: "1px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent 100%)",
          flexShrink: 0,
          zIndex: 10,
        }}
      />

      {/* ── LOGO EN HAUT ────────────────────────────────────── */}
      <div
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
          {/* Logo blanc (PRO) */}
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
              filter: "drop-shadow(0 0 12px rgba(0,255,153,0.3))",
              transition: "opacity 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          />
          {/* Logo noir (NOMADE) */}
          <Image
            src="/images/mikedev.png"
            alt="MikeDevNomad"
            width={56}
            height={56}
            style={{
              objectFit: "contain",
              position: "absolute",
              top: 0, left: 0,
              opacity: hovered === "nomade" ? 1 : 0,
              filter: "drop-shadow(0 0 12px rgba(245,158,11,0.3))",
              transition: "opacity 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          />
        </div>
        <span style={{
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: hovered === "nomade" ? "rgba(28,25,23,0.4)" : "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-mono)",
          transition: "color 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
        }}>
          mikedevnomad.com
        </span>
      </div>

      {/* ── NOMADE SIDE ─────────────────────────────────────── */}
      <div
        className="relative flex flex-col justify-center items-center overflow-hidden cursor-pointer"
        style={{
          flex: hovered === "pro" ? "0 0 28%" : hovered === "nomade" ? "0 0 72%" : "0 0 50%",
          transition: "flex 0.75s cubic-bezier(0.76, 0, 0.24, 1)",
          background: "#faf7f0",
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

        {/* Light overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(250,247,240,0.75) 0%, rgba(250,247,240,0.5) 100%)",
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
            background: "rgba(245,158,11,0.22)",
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
            background: "rgba(13,148,136,0.18)",
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
            background: "rgba(249,115,22,0.15)",
            borderRadius: "50%",
            filter: "blur(50px)",
            animation: "float 10s ease-in-out infinite 3s",
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 flex flex-col items-start px-16 max-w-lg w-full"
          style={{
            opacity: hovered === "pro" ? 0.35 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* Badge */}
          <div
            className="mb-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{
              border: "1px solid rgba(245,158,11,0.25)",
              background: "rgba(245,158,11,0.07)",
            }}
          >
            <span style={{ fontSize: "12px" }}>🌍</span>
            <span
              style={{
                color: "#b45309",
                fontSize: "11px",
                letterSpacing: "0.14em",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Currently traveling
            </span>
          </div>

          {/* Big heading */}
          <h1
            style={{
              fontSize: "clamp(4rem, 8vw, 7rem)",
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: "-0.05em",
              color: "#1c1917",
              marginBottom: "20px",
            }}
          >
            MIKE
            <span className="text-gradient-nomade">NOM</span>
            <br />
            <span style={{ fontSize: "0.45em", letterSpacing: "0.02em", color: "rgba(180,83,9,0.55)", fontFamily: "var(--font-mono)" }}>
              ad.com /nomade
            </span>
          </h1>

          {/* Destinations */}
          <p
            style={{
              color: "rgba(28,25,23,0.4)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            🇦🇺 · 🇯🇵 · 🇲🇦 · 🇵🇹 · 🇹🇭 · 🇲🇽
          </p>

          <p
            style={{
              color: "rgba(28,25,23,0.45)",
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
            className="inline-flex items-center gap-3 group"
            style={{
              padding: "14px 32px",
              background: "#f59e0b",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#d97706";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f59e0b";
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
          className="absolute bottom-8 right-8"
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(28,25,23,0.12)",
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
