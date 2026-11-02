"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Download } from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ConfirmModal } from "@/components/Modal";
import { EmptyState, StatusBadge } from "@/components/ui";
import StudioImage from "@/components/StudioImage";
import { api } from "@/lib/api";
import { BOOKING_STATUSES } from "@/lib/constants";
import { dateLabel, minutesToLabel, money } from "@/lib/format";
import { downloadInvoice } from "@/lib/invoice";

function Bookings() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("All");
  const [toCancel, setToCancel] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/bookings/mine")
      .then(setItems)
      .catch((e) => {
        toast.error(e.message);
        setItems([]);
      });
  }, []);

  async function confirmCancel() {
    setBusy(true);
    try {
      const updated = await api(`/bookings/${toCancel._id}/cancel`, { method: "PATCH" });
      setItems((list) => list.map((b) => (b._id === updated._id ? updated : b)));
      toast.success("Booking cancelled. The slot is free for others again.");
      setToCancel(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function invoice(b) {
    try {
      await downloadInvoice(b);
      toast.success("Receipt downloaded.");
    } catch {
      toast.error("Couldn't create the PDF. Please try again.");
    }
  }

  const list = items || [];
  const shown = filter === "All" ? list : list.filter((b) => b.status === filter);
  const count = (s) => (s === "All" ? list.length : list.filter((b) => b.status === s).length);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <div className="eyebrow">My bookings</div>
        <h1 className="font-display text-[clamp(34px,4vw,44px)] font-bold tracking-[-0.03em]">Your studio hours</h1>
      </div>

      <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {["All", ...BOOKING_STATUSES].map((s) => (
          <button key={s} type="button" role="tab" aria-selected={filter === s} onClick={() => setFilter(s)} className={`chip ${filter === s ? "chip-on" : ""}`}>
            {s} · {count(s)}
          </button>
        ))}
      </div>

      {items === null ? (
        <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading bookings">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card-ss flex items-center gap-5 p-4">
              <div className="skel h-[84px] w-28" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="skel h-5 w-1/2" />
                <div className="skel h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={30} />}
          title={filter === "All" ? "No bookings yet" : `No ${filter.toLowerCase()} bookings`}
          text="When you book studio hours they show up here with their status, from Pending to Completed."
          action="Explore studios"
          actionHref="/studios"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((b) => (
            <article key={b._id} className="card-ss flex min-h-24 flex-wrap items-center gap-5 p-4">
              <StudioImage src={b.studioImage} alt={`${b.studioTitle} photo`} className="h-[84px] w-28 shrink-0 rounded-[14px] border border-ln" label={false} />
              <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-1.5">
                <Link href={`/studios/${b.studioId}`} className="font-display text-xl font-bold hover:text-acct">
                  {b.studioTitle}
                </Link>
                <div className="flex flex-wrap gap-3.5 text-sm text-mu">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={15} />
                    {dateLabel(b.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={15} />
                    {minutesToLabel(b.startMin)} – {minutesToLabel(b.endMin)}
                  </span>
                </div>
                {b.status === "Cancelled" && b.cancelReason && <div className="text-[13px] text-mu">{b.cancelReason}</div>}
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-xs text-mu">TOTAL</div>
                <div className="text-lg font-semibold">{money(b.total)}</div>
              </div>
              <StatusBadge status={b.status} />
              <div className="flex shrink-0 flex-wrap gap-2">
                {b.status === "Pending" && (
                  <button type="button" onClick={() => setToCancel(b)} className="inline-flex h-10 cursor-pointer items-center rounded-full border border-ln px-3.5 text-sm font-semibold hover:border-err hover:text-err">
                    Cancel Booking
                  </button>
                )}
                {(b.status === "Confirmed" || b.status === "Completed") && (
                  <button type="button" onClick={() => invoice(b)} className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-ln px-3.5 text-sm font-semibold hover:border-acc">
                    <Download size={15} /> Invoice PDF
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(toCancel)}
        onClose={() => !busy && setToCancel(null)}
        onConfirm={confirmCancel}
        busy={busy}
        title="Cancel this booking?"
        text={toCancel ? `${toCancel.studioTitle} on ${dateLabel(toCancel.date)} will be released so other creators can book it.` : ""}
        confirmLabel="Yes, cancel"
        cancelLabel="Keep booking"
      />
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <DashboardShell active="/my-bookings">
      <Bookings />
    </DashboardShell>
  );
}
