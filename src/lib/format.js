export const formatRating = (r) => (r ? Number(r).toFixed(1) : "New");

export const money = (n) =>
  `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: Number(n) % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

/** 870 -> "2:30 PM" */
export function minutesToLabel(total) {
  const h24 = Math.floor(total / 60) % 24;
  const m = total % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** 870 -> "14:30" */
export const minutesToHHMM = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** "2026-11-14" -> "Sat, Nov 14, 2026" (no timezone shift) */
export function dateLabel(iso) {
  const [y, mo, d] = String(iso).split("-").map(Number);
  if (!y) return iso;
  return new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Today's date in the browser's time zone, as YYYY-MM-DD */
export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
