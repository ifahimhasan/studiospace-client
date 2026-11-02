"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, CalendarCheck, LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { clearJwt } from "@/lib/api";
import PrivateRoute from "./PrivateRoute";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
];

export default function DashboardShell({ children, active }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = active || pathname;

  async function logout() {
    await clearJwt();
    await signOut();
    toast.success("You are logged out.");
    router.push("/");
    router.refresh();
  }

  return (
    <PrivateRoute>
      {(user) => (
        <div className="container-ss flex flex-wrap items-start gap-8 pt-8">
          <nav aria-label="Dashboard" className="flex w-full flex-row flex-wrap gap-1 text-[15px] lg:w-[240px] lg:flex-col">
            <div className="hidden px-3 pb-2.5 font-mono text-xs text-mu lg:block">DASHBOARD</div>
            {NAV.map(({ href, label, icon: Icon }) => {
              const on = current === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-3 ${on ? "bg-sf2 font-semibold shadow-[inset_3px_0_0_var(--acc)]" : "hover:bg-sf2"}`}
                >
                  <Icon size={17} className={on ? "text-acct" : "text-mu"} />
                  {label}
                </Link>
              );
            })}
            <button type="button" onClick={logout} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-3 text-left text-acct hover:bg-sf2">
              <LogOut size={17} /> Logout
            </button>
          </nav>
          <div className="min-w-0 flex-[999_1_560px]">{typeof children === "function" ? children(user) : children}</div>
        </div>
      )}
    </PrivateRoute>
  );
}
