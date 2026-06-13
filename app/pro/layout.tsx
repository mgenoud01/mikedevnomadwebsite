import HudBar from "@/components/HudBar";

const proNav = [
  { href: "/pro/portfolio", label: "Portfolio" },
  { href: "/pro/cv", label: "CV" },
  { href: "/pro/cybersecurite", label: "Security" },
  { href: "/pro/contact", label: "Contact" },
  { href: "/nomade", label: "Nomad" },
];

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col pro-scrollbar"
      style={{ background: "var(--ink)", color: "var(--mist)", fontFamily: "var(--font-body)" }}
    >
      <HudBar nav={proNav} />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line px-5 py-7 text-center font-mono text-[12.5px] text-muted">
        MIKEDEV<span className="text-amber">//</span>NOMAD{" "}
        <span className="animate-cursor-blink text-mint">▊</span>
      </footer>
    </div>
  );
}
