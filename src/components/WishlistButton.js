"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./WishlistProvider";

export default function WishlistButton({ studioId, title, className = "" }) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(studioId);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        toggle(studioId, title);
      }}
      className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ln bg-bg transition hover:scale-105 ${
        saved ? "text-acc" : "text-tx"
      } ${className}`}
    >
      <Heart size={18} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
