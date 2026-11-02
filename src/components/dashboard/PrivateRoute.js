"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "../ui";

/**
 * Client-side guard for private pages. The middleware already blocks visitors
 * without a session cookie; this waits for the session on reload (so logged-in
 * users are never bounced to Login) and handles expired sessions.
 */
export default function PrivateRoute({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session?.user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [isPending, session, pathname, router]);

  if (isPending || !session?.user) return <Spinner className="min-h-[50vh]" label="Checking your session…" />;
  return typeof children === "function" ? children(session.user) : children;
}
