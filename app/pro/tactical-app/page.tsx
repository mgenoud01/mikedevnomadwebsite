const features = [
  {
    num: "01",
    title: "Gestion d'équipes",
    desc: "Assignation de rôles, suivi des disponibilités et coordination en temps réel.",
  },
  {
    num: "02",
    title: "Opérations tactiques",
    desc: "Planification de missions avec timeline, checklist et rapport d'après-action.",
  },
  {
    num: "03",
    title: "Communication chiffrée",
    desc: "Messagerie interne end-to-end encrypted. Aucune donnée stockée en clair.",
  },
  {
    num: "04",
    title: "Dashboard analytique",
    desc: "KPIs, heatmaps et tableaux de bord exportables PDF/CSV.",
  },
];

const stack = [
  { layer: "Frontend", items: ["Next.js 14", "TypeScript", "Tailwind CSS"] },
  { layer: "Backend", items: ["Node.js", "Fastify", "PostgreSQL", "Redis"] },
  { layer: "Temps réel", items: ["WebSocket", "Socket.io"] },
  { layer: "Infra", items: ["Docker", "AWS ECS", "GitHub Actions"] },
  { layer: "Sécurité", items: ["JWT", "RBAC", "Rate limiting", "OWASP"] },
];

export default function TacticalAppPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-6 py-16 md:py-24">

      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(95,211,188,0.6)",
            fontSize: "12px",
            letterSpacing: "0.12em",
            marginBottom: "20px",
          }}
        >
          $ git log --oneline tactical-app/
        </p>

        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "4px",
            border: "1px solid rgba(255,180,84,0.25)",
            background: "rgba(255,180,84,0.06)",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--amber)",
              boxShadow: "0 0 8px var(--amber)",
              animation: "blink 2s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--amber)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            En développement actif
          </span>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            lineHeight: 0.95,
            marginBottom: "20px",
          }}
        >
          TacticalApp
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "16px",
            lineHeight: 1.8,
            maxWidth: "520px",
          }}
        >
          Une application SaaS de gestion tactique pour organisations, équipes et événements complexes.
          Sécurité by design, architecture temps réel.
        </p>
      </div>

      {/* Features */}
      <section style={{ marginBottom: "64px" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--mint)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          // Fonctionnalités clés
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "3px",
          }}
        >
          {features.map((f) => (
            <div
              key={f.num}
              style={{
                padding: "28px 24px",
                background: "var(--panel-2)",
                border: "1px solid var(--line)",
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "rgba(95,211,188,0.25)",
                  letterSpacing: "-0.04em",
                  display: "block",
                  marginBottom: "16px",
                }}
              >
                {f.num}
              </span>
              <h3
                className="font-display"
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "16px",
                  letterSpacing: "-0.01em",
                  marginBottom: "8px",
                }}
              >
                {f.title}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--mint)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          // Stack technique
        </p>
        <div
          style={{
            border: "1px solid var(--line)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {stack.map((s, i) => (
            <div
              key={s.layer}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                padding: "16px 24px",
                borderBottom: i < stack.length - 1 ? "1px solid var(--line)" : "none",
                background: i % 2 === 0 ? "var(--panel-2)" : "transparent",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--mint)",
                  letterSpacing: "0.08em",
                  width: "90px",
                  flexShrink: 0,
                  textTransform: "uppercase",
                }}
              >
                {s.layer}
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {s.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      padding: "3px 10px",
                      border: "1px solid var(--line)",
                      color: "var(--muted)",
                      borderRadius: "3px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
