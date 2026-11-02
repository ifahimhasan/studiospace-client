import Link from "next/link";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import { InstagramLogo, LinkedInLogo, XLogo, YouTubeLogo } from "./icons";
import { CATEGORY_CARDS } from "@/lib/constants";

const SOCIALS = [
  { href: "https://x.com", label: "StudioSpace on X", Icon: XLogo },
  { href: "https://instagram.com", label: "StudioSpace on Instagram", Icon: InstagramLogo },
  { href: "https://youtube.com", label: "StudioSpace on YouTube", Icon: YouTubeLogo },
  { href: "https://linkedin.com", label: "StudioSpace on LinkedIn", Icon: LinkedInLogo },
];

export default function Footer() {
  return (
    <footer className="mt-[120px] overflow-hidden border-t border-ln bg-sf">
      <div className="container-ss grid grid-cols-1 gap-10 pt-16 pb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-[15px] leading-relaxed text-mu">
            Our mission: put every idle studio to work, so creators can book the right room by the hour and hosts earn from the hours it sits empty.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} className="lift icon-btn">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Quick links" className="flex flex-col gap-3">
          <div className="font-mono text-xs tracking-[0.08em] text-mu">QUICK LINKS</div>
          <Link href="/" className="hover:text-acct">Home</Link>
          <Link href="/studios" className="hover:text-acct">Explore Studios</Link>
          <Link href="/how-it-works" className="hover:text-acct">How It Works</Link>
          <Link href="/about" className="hover:text-acct">About Us</Link>
          <Link href="/add-studio" className="hover:text-acct">Host Your Space</Link>
        </nav>

        <nav aria-label="Popular categories" className="flex flex-col gap-3">
          <div className="font-mono text-xs tracking-[0.08em] text-mu">POPULAR CATEGORIES</div>
          {CATEGORY_CARDS.map((c) => (
            <Link key={c.value} href={`/studios?category=${encodeURIComponent(c.value)}`} className="hover:text-acct">
              {c.label}
            </Link>
          ))}
        </nav>

        <NewsletterForm />
      </div>

      <div
        aria-hidden="true"
        className="container-ss font-display text-[clamp(72px,15.5vw,230px)] leading-[0.82] font-extrabold tracking-[-0.05em] whitespace-nowrap text-transparent select-none"
        style={{ WebkitTextStroke: "1px var(--ln)", transform: "translateY(14%)" }}
      >
        StudioSpace
      </div>

      <div className="relative bg-sf">
        <div className="container-ss flex flex-wrap justify-between gap-4 border-t border-ln pt-5 pb-7 text-sm text-mu">
          <span>© {new Date().getFullYear()} StudioSpace. All rights reserved.</span>
          <span className="flex gap-5">
            <Link href="/about#terms" className="hover:text-tx">Terms of Service</Link>
            <Link href="/about#privacy" className="hover:text-tx">Privacy Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
