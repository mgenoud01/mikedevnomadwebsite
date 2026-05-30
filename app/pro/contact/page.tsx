"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erreur lors de l'envoi");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMsg("Erreur réseau — réessaie dans quelques instants");
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    color: "#f0f0f5",
    fontSize: "14px",
    fontFamily: "var(--font-inter)",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "72px 32px 96px" }}>

      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(0,255,153,0.4)",
            fontSize: "12px",
            letterSpacing: "0.12em",
            marginBottom: "20px",
          }}
        >
          $ ./send-message.sh
        </p>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            lineHeight: 0.95,
            marginBottom: "16px",
          }}
        >
          Contact
        </h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px", lineHeight: 1.7 }}>
          Projet, mission freelance, collaboration — je réponds sous 48h.
        </p>
      </div>

      {status === "sent" ? (
        <div
          style={{
            padding: "48px 40px",
            borderRadius: "8px",
            border: "1px solid rgba(0,255,153,0.2)",
            background: "rgba(0,255,153,0.04)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1px solid rgba(0,255,153,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "20px",
              color: "#00ff99",
            }}
          >
            ✓
          </div>
          <p style={{ color: "#00ff99", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
            Message envoyé
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
            Je reviendrai vers vous rapidement.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Nom
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,153,0.35)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,153,0.35)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              placeholder="Décrivez votre projet ou votre besoin..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,153,0.35)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          {status === "error" && (
            <p style={{ color: "#ff6b6b", fontSize: "13px", background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.2)", padding: "10px 14px", borderRadius: "6px" }}>
              ⚠️ {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              padding: "14px 32px",
              background: status === "sending" ? "rgba(0,255,153,0.4)" : "#00ff99",
              color: "#030308",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: "6px",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.15s",
              alignSelf: "flex-start",
            }}
            onMouseEnter={(e) => {
              if (status === "sending") return;
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = "#ffffff";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = status === "sending" ? "rgba(0,255,153,0.4)" : "#00ff99";
              el.style.transform = "translateY(0)";
            }}
          >
            {status === "sending" ? "Envoi en cours..." : "Envoyer →"}
          </button>
        </form>
      )}

      {/* Socials */}
      <div
        style={{
          marginTop: "56px",
          paddingTop: "32px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          gap: "24px",
        }}
      >
        {[
          { label: "GitHub", href: "#" },
          { label: "LinkedIn", href: "#" },
          { label: "Twitter / X", href: "#" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.25)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#00ff99")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.25)")}
          >
            {s.label} →
          </a>
        ))}
      </div>
    </div>
  );
}
