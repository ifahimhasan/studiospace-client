import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="container-ss py-14">
      <section
        aria-labelledby="nf-h"
        className="card-ss flex flex-wrap items-center justify-center gap-12 rounded-[28px] px-8 py-14"
      >
        <svg role="img" aria-label="Empty studio: a light stand pointed at a blank backdrop" width="320" height="260" viewBox="0 0 320 260" fill="none" className="max-w-full">
          <rect x="150" y="30" width="150" height="190" rx="6" fill="var(--sf2)" stroke="var(--ln)" strokeWidth="2" />
          <path d="M150 220 Q225 250 300 220" stroke="var(--ln)" strokeWidth="2" />
          <path d="M60 230 L60 110" stroke="var(--tx)" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 230 L30 250 M60 230 L90 250 M60 230 L60 252" stroke="var(--tx)" strokeWidth="4" strokeLinecap="round" />
          <rect x="34" y="70" width="56" height="44" rx="8" fill="var(--acc)" transform="rotate(-12 62 92)" />
          <path d="M92 80 L170 60 L180 160 L92 112 Z" fill="var(--acc)" opacity=".16" />
          <text x="225" y="140" textAnchor="middle" fontFamily="'Bricolage Grotesque Variable', sans-serif" fontWeight="800" fontSize="64" fill="var(--tx)">
            404
          </text>
          <circle className="rec-dot" cx="282" cy="48" r="6" fill="var(--acc)" />
        </svg>
        <div className="flex max-w-[420px] flex-col gap-3.5">
          <div className="font-mono text-[13px] text-acct">ERROR 404 · SCENE NOT FOUND</div>
          <h1 id="nf-h" className="font-display text-[40px] leading-[1.05] font-bold tracking-[-0.03em]">
            This set has been struck.
          </h1>
          <p className="text-[17px] leading-relaxed text-mu">
            The page you are looking for moved or never existed. Head back and find another room to shoot in.
          </p>
          <Link href="/" className="btn-main h-[52px] self-start px-[26px]">
            Return to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
