"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import StudioCard, { StudioCardSkeleton } from "../StudioCard";
import { EmptyState } from "../ui";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";

const SORTS = [
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];
const RATES = [
  { value: "", label: "Any" },
  { value: "50", label: "$50 / hr" },
  { value: "100", label: "$100 / hr" },
  { value: "200", label: "$200 / hr" },
];

export default function ExploreStudios() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "rating";
  const maxRate = params.get("maxRate") || "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [text, setText] = useState(search);
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => setText(search), [search]);

  function update(patch) {
    const q = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)));
    if (!("page" in patch)) q.delete("page");
    router.replace(`${pathname}${q.toString() ? `?${q}` : ""}`, { scroll: false });
  }

  // Debounce typing into the URL.
  useEffect(() => {
    if (text === search) return;
    const t = setTimeout(() => update({ search: text.trim() }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const query = useMemo(() => {
    const q = new URLSearchParams({ sort, page: String(page), limit: "9" });
    if (category) q.set("category", category);
    if (search) q.set("search", search);
    if (maxRate) q.set("maxRate", maxRate);
    return q.toString();
  }, [category, search, sort, maxRate, page]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api(`/studios?${query}`)
      .then((d) => alive && setData(d))
      .catch((e) => alive && toast.error(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [query]);

  const countLabel = loading
    ? "Looking for open rooms…"
    : `${data.total} ${data.total === 1 ? "space" : "spaces"} available${category ? ` in ${category}` : ""}`;

  return (
    <div className="container-ss pt-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3.5">
          <div className="eyebrow">Explore studios</div>
          <h1 className="h-section">Find your next room</h1>
          <p className="lead" aria-live="polite">
            {countLabel}
          </p>
        </div>
        <label className="flex h-[52px] w-full max-w-[420px] items-center gap-2.5 rounded-full border border-ln bg-sf px-[18px]">
          <Search size={18} className="text-mu" />
          <span className="sr-only">Search studios</span>
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search by name, city or category"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-tx outline-none placeholder:text-mu/70"
          />
        </label>
      </div>

      <div className="sticky top-[72px] z-10 mt-8 flex flex-wrap items-center gap-2.5 border-y border-ln bg-bg py-3.5">
        {["", ...CATEGORIES].map((c) => {
          const on = c === category;
          return (
            <button key={c || "all"} type="button" aria-pressed={on} onClick={() => update({ category: c })} className={`chip ${on ? "chip-on" : ""}`}>
              {c || "All"}
            </button>
          );
        })}
        <div className="ml-auto flex flex-wrap gap-2.5">
          <label className="inline-flex h-11 items-center gap-2 rounded-full border border-ln px-3.5 text-sm text-mu">
            Max rate
            <select value={maxRate} onChange={(e) => update({ maxRate: e.target.value })} className="cursor-pointer bg-transparent text-sm text-tx outline-none">
              {RATES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex h-11 items-center gap-2 rounded-full border border-ln px-3.5 text-sm text-mu">
            Sort
            <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="cursor-pointer bg-transparent text-sm text-tx outline-none">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div aria-busy="true" aria-label="Loading studios" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : data.items.length ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((s) => (
                <StudioCard key={String(s._id)} studio={s} />
              ))}
            </div>
            {data.pages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
                <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })} className="icon-btn disabled:opacity-40">
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-current={n === page ? "page" : undefined}
                    onClick={() => update({ page: String(n) })}
                    className={`h-11 w-11 cursor-pointer rounded-full font-semibold ${n === page ? "bg-acc text-on" : "border border-ln text-tx"}`}
                  >
                    {n}
                  </button>
                ))}
                <button type="button" aria-label="Next page" disabled={page >= data.pages} onClick={() => update({ page: String(page + 1) })} className="icon-btn disabled:opacity-40">
                  <ChevronRight size={18} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <EmptyState
            title={search || category || maxRate ? "No studios match that search" : "No studios listed yet"}
            text="Try a different city or category, or clear your filters to see every space on StudioSpace."
            action="Clear filters"
            onAction={() => {
              setText("");
              router.replace(pathname, { scroll: false });
            }}
            secondary={
              <Link href="/add-studio" className="btn-line">
                List your own space
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
