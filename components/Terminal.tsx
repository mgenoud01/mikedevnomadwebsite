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
      [<><span className="text-muted">[ok]</span> identité chargée : <span className="text-amber">MIKEDEV//NOMAD</span></>, 400],
      [<><span className="text-muted">[ok]</span> statut : <span className="text-mint">DISPONIBLE</span></>, 750],
      [<><span className="text-muted">[ok]</span> périmètre : sécurité · infra · monitoring</>, 1100],
      [<>Tapez <span className="text-amber">help</span> pour explorer.</>, 1500],
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
      makeLine(<span className="text-amber">Commandes disponibles :</span>),
      makeLine("  whoami     — qui suis-je"),
      makeLine("  services   — ce que je propose"),
      makeLine("  stack      — outils & technologies"),
      makeLine("  travel     — d'où je travaille"),
      makeLine("  contact    — me joindre"),
      makeLine("  clear      — nettoyer l'écran"),
    ],
    whoami: () => [
      makeLine(<><span className="text-amber">Mike Genoud</span> — développeur full-stack & cybersécurité 🇨🇭</>),
      makeLine(<span className="text-muted">{bio}</span>),
      makeLine(<span className="text-muted">Mode : freelance · remote-first · rigueur suisse.</span>),
    ],
    services: () => [
      makeLine(<><span className="text-amber">[SEC-01]</span> Audit & Pentest</>),
      makeLine(<><span className="text-amber">[OPS-02]</span> Infrastructure & DevOps (K8s)</>),
      makeLine(<><span className="text-amber">[MON-03]</span> Monitoring & Détection (Wazuh, Zabbix, Grafana)</>),
      makeLine(<><span className="text-amber">[DEV-04]</span> Développement sécurisé</>),
    ],
    stack: () => [
      makeLine(skills.join(" · ")),
    ],
    travel: () => [
      makeLine("Basé en Suisse 🇨🇭 — opérationnel depuis n'importe où."),
      makeLine(<span className="text-muted">Connexion sécurisée, VPN, discipline des horaires.</span>),
    ],
    contact: () => [
      makeLine(<><span className="text-mint">→</span> <a href={`mailto:${contactEmail}`} className="underline hover:no-underline">{contactEmail}</a></>),
      makeLine(<span className="text-muted">Réponse &lt; 24h ouvrées, quel que soit le fuseau.</span>),
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
        makeLine(<><span className="text-muted">commande inconnue : {cmd} — tapez </span><span className="text-amber">help</span></>),
      ]);
    }
  }

  return (
    <div
      className="overflow-hidden rounded-term border border-line bg-panel-2 shadow-term"
      aria-label="Terminal interactif"
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
          aria-label="Tapez une commande, par exemple help"
          className="flex-1 bg-transparent text-mist caret-amber outline-none"
        />
      </div>
    </div>
  );
}
