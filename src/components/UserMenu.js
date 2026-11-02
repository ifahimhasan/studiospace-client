"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, PlusCircle, CalendarCheck, Building2 } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { clearJwt } from "@/lib/api";
import Avatar from "./Avatar";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
];

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  async function logout() {
    setOpen(false);
    await clearJwt();
    await signOut();
    toast.success("You are logged out. See you on set soon.");
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-ln pr-2 pl-1"
      >
        <Avatar user={user} size={36} ring />
        <ChevronDown size={16} />
      </button>

      {open && (
        <div role="menu" className="absolute top-full right-0 z-30 w-[260px] pt-2.5">
          <div className="rounded-2xl border border-ln bg-sf p-2 shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
            <div className="mb-1.5 border-b border-ln px-3 pt-3 pb-3.5">
              <div className="truncate font-semibold">{user.name}</div>
              <div className="truncate text-[13px] text-mu">{user.email}</div>
            </div>
            {ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-[10px] px-3 py-[11px] text-[15px] hover:bg-sf2"
              >
                <Icon size={17} className="text-mu" />
                {label}
              </Link>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="mt-1.5 flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border-t border-ln px-3 py-[11px] text-left text-[15px] text-acct hover:bg-sf2"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
