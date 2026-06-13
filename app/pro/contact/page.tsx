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
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `[Contact] Message from ${form.name}`,
          from_name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message || "Error sending message");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMsg("Network error — try again in a moment");
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "var(--panel-2)",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    color: "var(--mist)",
    fontSize: "14px",
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <div className="mx-auto max-w-[640px] px-6 py-16 md:py-24">

      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(95,211,188,0.6)",
            fontSize: "12px",
            letterSpacing: "0.12em",
            marginBottom: "20px",
          }}
        >
          $ ./send-message.sh
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            lineHeight: 0.95,
            marginBottom: "16px",
          }}
        >
          Contact
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.7 }}>
          Project, freelance work, collaboration — I reply within 48h.
        </p>
      </div>

      {status === "sent" ? (
        <div
          style={{
            padding: "48px 40px",
            borderRadius: "8px",
            border: "1px solid rgba(95,211,188,0.25)",
            background: "rgba(95,211,188,0.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1px solid rgba(95,211,188,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "20px",
              color: "var(--mint)",
            }}
          >
            ✓
          </div>
          <p style={{ color: "var(--mint)", fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>
            Message sent
          </p>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>
            I&apos;ll get back to you shortly.
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
                color: "var(--muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--amber)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--muted)",
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
              onFocus={(e) => (e.target.style.borderColor = "var(--amber)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--muted)",
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
              placeholder="Describe your project or what you need..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--amber)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
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
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
            style={{
              padding: "14px 32px",
              background: status === "sending" ? "rgba(255,180,84,0.4)" : "var(--amber)",
              color: "var(--ink)",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: "4px",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              transition: "transform 0.15s",
              alignSelf: "flex-start",
            }}
            onMouseEnter={(e) => {
              if (status === "sending") return;
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = "translateY(0)";
            }}
          >
            {status === "sending" ? "Sending..." : "Send →"}
          </button>
        </form>
      )}

      {/* Socials */}
      <div
        style={{
          marginTop: "56px",
          paddingTop: "32px",
          borderTop: "1px solid var(--line)",
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
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--muted)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--mint)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)")}
          >
            {s.label} →
          </a>
        ))}
      </div>
    </div>
  );
}
