"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export default function QuickSearch() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [where, setWhere] = useState("");

  function submit(e) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    if (where.trim()) q.set("search", where.trim());
    router.push(`/studios${q.toString() ? `?${q}` : ""}`);
  }

  return (
    <div className="container-ss">
      <form onSubmit={submit} aria-label="Quick studio search" className="mt-4 flex flex-wrap items-stretch gap-2 rounded-[20px] border border-ln bg-sf p-2.5">
        <label className="flex min-w-[200px] flex-[1_1_220px] flex-col gap-0.5 rounded-[14px] bg-sf2 px-4 py-2.5">
          <span className="font-mono text-xs text-mu">WHAT ARE YOU MAKING?</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="cursor-pointer bg-transparent py-0.5 text-[15px] text-tx outline-none">
            <option value="">Any kind of space</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[200px] flex-[1_1_220px] flex-col gap-0.5 rounded-[14px] bg-sf2 px-4 py-2.5">
          <span className="font-mono text-xs text-mu">WHERE OR WHAT</span>
          <input
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            type="text"
            placeholder="City, neighbourhood or studio name"
            className="bg-transparent py-0.5 text-[15px] text-tx outline-none placeholder:text-mu/70"
          />
        </label>
        <button type="submit" className="btn-main h-auto min-h-14 flex-none rounded-[14px] px-7">
          <Search size={18} /> Search studios
        </button>
      </form>
    </div>
  );
}
