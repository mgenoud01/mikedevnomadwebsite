import Link from "next/link";
import { ProProfile } from "@/lib/proProfile";
import Terminal from "@/components/Terminal";
import TopoBackground from "@/components/TopoBackground";

const sections = [
  { href: "/pro/portfolio", num: "01", title: "Portfolio", desc: "Projects, stack & achievements.", tag: "work" },
  { href: "/pro/cv", num: "02", title: "CV", desc: "Experience, skills & background.", tag: "background" },
  { href: "/pro/cybersecurite", num: "03", title: "Security", desc: "CTF, write-ups, research & tools.", tag: "Security+" },
  { href: "/pro/contact", num: "04", title: "Contact", desc: "Available for freelance work.", tag: "Open" },
];

const services = [
  { tag: "SEC-01", title: "Audit & Pentest", desc: "Attack surface assessment, web and network penetration testing, actionable report with prioritized fixes." },
  { tag: "OPS-02", title: "Infrastructure & DevOps", desc: "Kubernetes (K3s), containerization, CI/CD, distributed storage, secrets management — from homelab to production." },
  { tag: "MON-03", title: "Monitoring & Detection", desc: "Wazuh, Zabbix, Prometheus & Grafana deployment: full visibility, alerting and automated response." },
  { tag: "DEV-04", title: "Secure development", desc: "Full-stack applications designed with security in mind from day one: robust authentication, hardening, best practices." },
];

const steps = [
  { title: "Recon", desc: "Precise scoping: boundaries, goals, constraints. No fuzzy engagements." },
  { title: "Plan", desc: "Quoted proposal, clear milestones, defined deliverables before the first line of code." },
  { title: "Execute", desc: "Rigorous execution with regular check-ins, whatever the timezone." },
  { title: "Report", desc: "Clear, actionable report, knowledge transfer, prioritized recommendations." },
];

export default function ProHomeClient({ profile }: { profile: ProProfile }) {
  const stats = [
    { value: `${profile.yearsExp}+`, label: "years exp." },
    { value: `${profile.projectsShipped}+`, label: "projects shipped" },
    { value: `${profile.ctfPodiums}`, label: "CTF podiums" },
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <TopoBackground />
        <div className="relative mx-auto grid max-w-[1180px] gap-12 px-6 py-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-24">
          <div>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[.14em] text-amber">
              // Freelance · Cybersecurity · Infrastructure
            </div>

            {profile.disponible && (
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-mint/25 bg-mint/[0.07] px-4 py-2">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[.18em] text-mint">
                  Available — freelance work
                </span>
              </div>
            )}

            <h1 className="font-display text-[clamp(34px,4.6vw,58px)] font-bold leading-[1.08] text-white">
              Securing your systems,<br />
              deployed from <span className="text-amber">anywhere</span>.
            </h1>

            <p className="mt-5 max-w-[46ch] font-body text-[18.5px] text-muted">
              {profile.bio}
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                href="/pro/contact"
                className="rounded-btn border border-amber bg-amber px-6 py-3 font-display text-[15px] font-semibold tracking-[.05em] text-ink transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
              >
                Start a project
              </Link>
              <a
                href="#services"
                className="rounded-btn border border-amber px-6 py-3 font-display text-[15px] font-semibold tracking-[.05em] text-amber transition-all hover:-translate-y-0.5 hover:bg-amber/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
              >
                View services
              </a>
            </div>
          </div>

          <Terminal bio={profile.bio} skills={profile.skills} email={profile.email} />
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-card border border-line bg-panel-2 p-6 text-center">
                <p className="font-display text-[2.2rem] font-bold leading-none text-white">{s.value}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[.08em] text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────── */}
      <section id="services" className="border-b border-line">
        <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-24">
          <div className="mb-10 flex flex-wrap items-baseline gap-4">
            <span className="font-mono text-[13px] tracking-[.12em] text-amber">[ CAPABILITIES ]</span>
            <h2 className="font-display text-[clamp(26px,3vw,38px)] font-bold text-white">Services</h2>
          </div>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.tag} className="rounded-card border border-line bg-panel-2 p-6 transition-all hover:-translate-y-1 hover:border-amber">
                <span className="mb-3.5 block font-mono text-[11.5px] tracking-[.1em] text-mint">{s.tag}</span>
                <h3 className="mb-2.5 font-display text-[18.5px] text-white">{s.title}</h3>
                <p className="text-[15px] text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack ─────────────────────────────────────────────── */}
      <section id="stack" className="border-b border-line">
        <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-24">
          <div className="mb-10 flex flex-wrap items-baseline gap-4">
            <span className="font-mono text-[13px] tracking-[.12em] text-amber">[ ARSENAL ]</span>
            <h2 className="font-display text-[clamp(26px,3vw,38px)] font-bold text-white">Tech stack</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {profile.skills.map((s) => (
              <span key={s} className="rounded-btn border border-line bg-panel-2 px-3 py-1.5 font-mono text-[13px] text-mist">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Méthode ───────────────────────────────────────────── */}
      <section id="process" className="border-b border-line">
        <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-24">
          <div className="mb-10 flex flex-wrap items-baseline gap-4">
            <span className="font-mono text-[13px] tracking-[.12em] text-amber">[ MODUS OPERANDI ]</span>
            <h2 className="font-display text-[clamp(26px,3vw,38px)] font-bold text-white">Mission method</h2>
          </div>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-card border border-line bg-panel-2 p-6">
                <span className="mb-3 block font-mono text-[13px] text-amber">0{i + 1}</span>
                <h3 className="mb-2 font-display text-[17.5px] text-white">{step.title}</h3>
                <p className="text-[14.5px] text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explorer ──────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-24">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[.2em] text-muted">// explore</p>
          <div className="flex flex-col gap-2">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="flex items-center justify-between rounded-card border border-line bg-panel-2 px-6 py-5 transition-all hover:translate-x-1 hover:border-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
              >
                <div className="flex items-center gap-5">
                  <span className="w-[22px] shrink-0 font-mono text-[11px] tracking-[.1em] text-muted">{section.num}</span>
                  <div>
                    <p className="mb-0.5 font-display text-[16px] font-semibold text-white">{section.title}</p>
                    <p className="text-[13px] text-muted">{section.desc}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3.5">
                  <span className="rounded-full border border-amber/30 bg-amber/10 px-2.5 py-0.5 font-mono text-[11px] tracking-[.06em] text-amber">
                    {section.tag}
                  </span>
                  <span className="text-muted">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
