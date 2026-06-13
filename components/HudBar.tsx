"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HudNavLink = { href: string; label: string };

const DEFAULT_NAV: HudNavLink[] = [
  { href: "/pro", label: "Pro" },
  { href: "/nomade", label: "Nomad" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function HudBar({ nav = DEFAULT_NAV }: { nav?: HudNavLink[] }) {
  const [utc, setUtc] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setUtc(`${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/[.92] backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-6 py-3 font-mono text-[12.5px] tracking-[.04em]">
        <Link
          href="/"
          className="font-display text-[15px] font-bold tracking-[.06em] text-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
        >
          MIKEDEV<span className="text-amber">//</span>NOMAD
        </Link>

        <div className="flex items-center gap-2 whitespace-nowrap text-mint">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          AVAILABLE — FREELANCE WORK
        </div>

        <div className="hidden text-muted md:block" suppressHydrationWarning>
          UTC {utc ?? "--:--:--"}
        </div>

        <nav className="hidden gap-5 md:flex">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="uppercase text-muted transition-colors hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
