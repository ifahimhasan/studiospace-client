"use client";

import { useState } from "react";

export function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("") || "?";
}

export default function Avatar({ user, size = 40, ring = false }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size };
  const ringCls = ring ? "border-2 border-acc" : "border border-ln";
  if (user?.image && !broken) {
    return (
      <img
        src={user.image}
        alt={user.name || "Profile photo"}
        style={style}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`shrink-0 rounded-full object-cover ${ringCls}`}
      />
    );
  }
  return (
    <span style={style} className={`inline-flex shrink-0 items-center justify-center rounded-full bg-sf2 text-sm font-semibold ${ringCls}`}>
      {initials(user?.name)}
    </span>
  );
}
