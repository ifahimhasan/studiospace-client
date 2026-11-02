"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";

const WishlistContext = createContext(null);

/** Keeps the logged-in user's saved studio ids so every heart icon stays in sync. */
export function WishlistProvider({ children }) {
  const { data: session } = useSession();
  const [ids, setIds] = useState(() => new Set());
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) {
      setIds(new Set());
      return;
    }
    api("/wishlist/ids")
      .then((list) => setIds(new Set(list)))
      .catch(() => {});
  }, [email]);

  const toggle = useCallback(async (studioId) => {
    const { saved } = await api(`/wishlist/${studioId}`, { method: "POST" });
    setIds((prev) => {
      const next = new Set(prev);
      saved ? next.add(studioId) : next.delete(studioId);
      return next;
    });
    return saved;
  }, []);

  return <WishlistContext.Provider value={{ ids, toggle, loggedIn: Boolean(email) }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const router = useRouter();
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");

  async function toggleWithFeedback(studioId, title) {
    if (!ctx.loggedIn) {
      toast.info("Log in to save studios to your wishlist.", {
        action: { label: "Log in", onClick: () => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`) },
      });
      return;
    }
    try {
      const saved = await ctx.toggle(studioId);
      toast.success(saved ? `Saved ${title} to your wishlist.` : `Removed ${title} from your wishlist.`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return { isSaved: (id) => ctx.ids.has(id), toggle: toggleWithFeedback };
}
