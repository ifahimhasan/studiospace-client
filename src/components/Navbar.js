"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { useSession } from "@/lib/auth-client";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const isActive = (pathname, href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [pathname]);

  const user = session?.user;
  const loginHref = pathname && pathname !== "/login" && pathname !== "/register" ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";

  return (
    <header className="sticky top-0 z-40 border-b border-ln bg-bg">
      <nav aria-label="Main" className="container-ss flex h-[72px] items-center gap-8">
        <Logo />

        <div className="hidden gap-7 text-[15px] font-medium lg:flex">
          {LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`py-6 transition-colors ${active ? "border-b-2 border-acc pb-[22px] text-tx" : "text-mu hover:text-tx"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <ThemeToggle />
          {isPending ? (
            <span className="skel h-11 w-[78px] rounded-full" aria-label="Loading account" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden gap-2.5 sm:flex">
              <Link href={loginHref} className="btn-line h-11 px-5 text-[15px]">
                Login
              </Link>
              <Link href="/register" className="btn-main h-11 px-5 text-[15px]">
                Register
              </Link>
            </div>
          )}
          <button
            type="button"
            className="icon-btn lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-ln bg-bg lg:hidden">
          <div className="container-ss flex flex-col py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3 py-3 text-[15px] ${isActive(pathname, l.href) ? "bg-sf2 font-semibold text-tx" : "text-mu"}`}
              >
                {l.label}
              </Link>
            ))}
            {!user && !isPending && (
              <div className="mt-2 flex gap-2.5 sm:hidden">
                <Link href={loginHref} className="btn-line h-11 flex-1">
                  Login
                </Link>
                <Link href="/register" className="btn-main h-11 flex-1">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
