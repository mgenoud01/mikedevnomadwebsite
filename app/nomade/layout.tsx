import HudBar from "@/components/HudBar";

const nomadeNav = [
  { href: "/nomade", label: "Home" },
  { href: "/nomade/voyages", label: "Trips" },
  { href: "/nomade/galerie", label: "Gallery" },
  { href: "/pro", label: "Pro" },
];

export default function NomadeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "var(--ink)", color: "var(--mist)", fontFamily: "var(--font-body)" }}
    >
      <HudBar nav={nomadeNav} />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line px-5 py-7 text-center font-mono text-[12.5px] text-muted">
        MIKEDEV<span className="text-amber">//</span>NOMAD — made with ❤️ and lots of hotel wifi
      </footer>
    </div>
  );
}
