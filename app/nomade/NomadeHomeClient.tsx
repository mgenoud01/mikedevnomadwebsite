import Link from "next/link";
import { Voyage } from "@/lib/voyages";
import TimezoneWidget from "@/components/TimezoneWidget";
import TopoBackground from "@/components/TopoBackground";

const sections = [
  { href: "/nomade/voyages", num: "01", title: "Voyages", desc: "Récits, conseils & itinéraires.", tag: "trips" },
  { href: "/nomade/galerie", num: "02", title: "Galerie", desc: "Photos prises aux quatre coins du monde.", tag: "photos" },
];

export default function NomadeHomeClient({ voyages, tiktok = "", instagram = "" }: { voyages: Voyage[]; tiktok?: string; instagram?: string }) {
  // Pays uniques depuis les vrais voyages
  const pays = Array.from(new Set(voyages.map((v) => v.pays))).slice(0, 8);
  const featured = voyages.filter((v) => v.miseEnAvant).slice(0, 3);
  const recent = voyages.slice(0, 3);
  const displayed = featured.length > 0 ? featured : recent;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <TopoBackground />
        <div className="relative mx-auto grid max-w-[1180px] gap-12 px-6 py-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-24">
          <div>
            <div className="mb-4 font-mono text-[13px] uppercase tracking-[.14em] text-mint">
              // Nomad · Remote-first
            </div>

            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-mint/25 bg-mint/[0.07] px-4 py-2">
              <span className="text-[12px]" aria-hidden="true">🌍</span>
              <span className="font-mono text-[11px] uppercase tracking-[.18em] text-mint">
                En déplacement, quelque part dans le monde
              </span>
            </div>

            <h1 className="font-display text-[clamp(34px,4.6vw,58px)] font-bold leading-[1.08] text-white">
              Développeur &<br />
              <span className="text-mint">nomade digital.</span>
            </h1>

            <p className="mt-5 max-w-[46ch] font-body text-[18.5px] text-muted">
              Je code depuis des cafés à Tokyo, des hostels à Lisbonne et des plages en Thaïlande — bienvenue dans ma vie de nomade.
            </p>

            {/* Réseaux sociaux */}
            {(tiktok || instagram) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {tiktok && (
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-panel-2 px-4 py-2.5 text-mist transition-colors hover:border-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
                    </svg>
                    <span className="font-mono text-[13px] font-semibold">TikTok</span>
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-panel-2 px-4 py-2.5 text-mist transition-colors hover:border-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    <span className="font-mono text-[13px] font-semibold">Instagram</span>
                  </a>
                )}
              </div>
            )}

            {/* Pays visités */}
            {pays.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {pays.map((p) => {
                  const v = voyages.find((vv) => vv.pays === p)!;
                  return (
                    <span key={p} className="inline-flex items-center gap-2 rounded-full border border-line bg-panel-2 px-3.5 py-1.5 font-mono text-[13px] text-mist">
                      <span aria-hidden="true">{v.emoji || "🌍"}</span>
                      {p}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <TimezoneWidget />
        </div>
      </section>

      {/* ── Derniers voyages ──────────────────────────────────── */}
      {displayed.length > 0 && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-24">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="font-mono text-[13px] tracking-[.12em] text-mint">
                  [ {featured.length > 0 ? "FEATURED" : "LATEST"} ]
                </span>
                <h2 className="font-display text-[clamp(26px,3vw,38px)] font-bold text-white">
                  {featured.length > 0 ? "Voyages à la une" : "Derniers voyages"}
                </h2>
              </div>
              <Link
                href="/nomade/voyages"
                className="font-mono text-[13px] font-semibold text-mint hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
              >
                Voir tout →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((v) => (
                <Link
                  key={v.id}
                  href={`/nomade/voyages/${v.slug}`}
                  className="overflow-hidden rounded-card border border-line bg-panel-2 transition-all hover:-translate-y-1 hover:border-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
                >
                  {v.photoCouverture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.photoCouverture} alt={v.titre} className="h-[180px] w-full object-cover" />
                  ) : (
                    <div className="flex h-[100px] items-center justify-center bg-ink text-[40px]">
                      {v.emoji || "🌍"}
                    </div>
                  )}
                  <div className="p-5">
                    <p className="mb-1.5 font-mono text-[11px] text-muted">{v.pays}</p>
                    <h3 className="mb-2 font-display text-[16px] font-semibold text-white">{v.titre}</h3>
                    {v.resume && (
                      <p className="text-[13px] leading-relaxed text-muted">{v.resume.slice(0, 80)}…</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Explorer ──────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-24">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[.2em] text-muted">// explore</p>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-card border border-line bg-panel-2 p-6 transition-all hover:-translate-y-1 hover:border-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px]"
              >
                <span className="mb-3.5 block font-mono text-[11.5px] tracking-[.1em] text-mint">{s.num}</span>
                <h3 className="mb-2 font-display text-[18.5px] text-white">{s.title}</h3>
                <p className="mb-4 text-[14px] text-muted">{s.desc}</p>
                <span className="font-mono text-[13px] font-semibold text-mint">Explorer →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
