"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type TerminalProps = {
  bio: string;
  skills: string[];
  email?: string;
};

type Line = { key: number; content: ReactNode };

let lineSeq = 0;
function makeLine(content: ReactNode): Line {
  lineSeq += 1;
  return { key: lineSeq, content };
}

const PROMPT = (
  <span className="text-mint">mike@field-ops:~$</span>
);

export default function Terminal({ bio, skills, email }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const intro: [ReactNode, number][] = [
      [<>{PROMPT} ./init --mission freelance</>, 0],
      [<><span className="text-muted">[ok]</span> identity loaded: <span className="text-amber">MIKEDEV//NOMAD</span></>, 400],
      [<><span className="text-muted">[ok]</span> status: <span className="text-mint">AVAILABLE</span></>, 750],
      [<><span className="text-muted">[ok]</span> scope: security · infra · monitoring</>, 1100],
      [<>Type <span className="text-amber">help</span> to explore.</>, 1500],
    ];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setLines(intro.map(([content]) => makeLine(content)));
      return;
    }

    const timers = intro.map(([content, delay]) =>
      setTimeout(() => setLines((prev) => [...prev, makeLine(content)]), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [lines]);

  const contactEmail = email && email.trim() ? email : "contact@mikedevnomad.com";

  const commands: Record<string, () => Line[]> = {
    help: () => [
      makeLine(<span className="text-amber">Available commands:</span>),
      makeLine("  whoami     — who I am"),
      makeLine("  services   — what I offer"),
      makeLine("  stack      — tools & technologies"),
      makeLine("  travel     — where I work from"),
      makeLine("  contact    — get in touch"),
      makeLine("  clear      — clear the screen"),
    ],
    whoami: () => [
      makeLine(<><span className="text-amber">Mike Genoud</span> — full-stack developer & cybersecurity 🇨🇭</>),
      makeLine(<span className="text-muted">{bio}</span>),
      makeLine(<span className="text-muted">Mode: freelance · remote-first · Swiss precision.</span>),
    ],
    services: () => [
      makeLine(<><span className="text-amber">[SEC-01]</span> Audit & Pentest</>),
      makeLine(<><span className="text-amber">[OPS-02]</span> Infrastructure & DevOps (K8s)</>),
      makeLine(<><span className="text-amber">[MON-03]</span> Monitoring & Detection (Wazuh, Zabbix, Grafana)</>),
      makeLine(<><span className="text-amber">[DEV-04]</span> Secure development</>),
    ],
    stack: () => [
      makeLine(skills.join(" · ")),
    ],
    travel: () => [
      makeLine("Based in Switzerland 🇨🇭 — operating from anywhere."),
      makeLine(<span className="text-muted">Secure connection, VPN, disciplined scheduling.</span>),
    ],
    contact: () => [
      makeLine(<><span className="text-mint">→</span> <a href={`mailto:${contactEmail}`} className="underline hover:no-underline">{contactEmail}</a></>),
      makeLine(<span className="text-muted">Response &lt; 24h (business days), regardless of timezone.</span>),
    ],
  };

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    const promptLine = makeLine(<>{PROMPT} {raw}</>);
    const handler = commands[cmd];

    if (handler) {
      setLines((prev) => [...prev, promptLine, ...handler()]);
    } else {
      setLines((prev) => [
        ...prev,
        promptLine,
        makeLine(<><span className="text-muted">unknown command: {cmd} — type </span><span className="text-amber">help</span></>),
      ]);
    }
  }

  return (
    <div
      className="overflow-hidden rounded-term border border-line bg-panel-2 shadow-term"
      aria-label="Interactive terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-line bg-panel px-3.5 py-[11px]">
        <i className="block h-[11px] w-[11px] rounded-full bg-[#E2604E]" />
        <i className="block h-[11px] w-[11px] rounded-full bg-amber" />
        <i className="block h-[11px] w-[11px] rounded-full bg-mint" />
        <span className="ml-auto font-mono text-[11.5px] text-muted">mike@field-ops:~</span>
      </div>

      <div
        ref={outputRef}
        className="h-[280px] overflow-y-auto px-[18px] pb-[14px] pt-[18px] font-mono text-[13.5px] leading-[1.7] md:h-[330px]"
      >
        {lines.map((l) => (
          <div key={l.key} className="whitespace-pre-wrap break-words">
            {l.content}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-[18px] pb-4 font-mono text-[13.5px]">
        <label htmlFor="term-in" className="text-mint">$</label>
        <input
          id="term-in"
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              run(value);
              setValue("");
            }
          }}
          autoComplete="off"
          spellCheck={false}
          aria-label="Type a command, e.g. help"
          className="flex-1 bg-transparent text-mist caret-amber outline-none"
        />
      </div>
    </div>
  );
}
