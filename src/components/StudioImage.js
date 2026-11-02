"use client";

import { useState } from "react";

/** Studio photo that falls back to the branded striped placeholder if missing or broken. */
export default function StudioImage({ src, alt, className = "", label }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div role="img" aria-label={alt} className={`stripes flex items-end p-4 ${className}`}>
        {label !== false && (
          <span className="rounded-lg border border-ln bg-bg px-2.5 py-1.5 font-mono text-xs text-mu">PHOTO · {label || alt}</span>
        )}
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} className={`object-cover ${className}`} />;
}
