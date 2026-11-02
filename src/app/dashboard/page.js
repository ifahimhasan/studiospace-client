"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Heart, Inbox, X } from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StudioCard from "@/components/StudioCard";
import { EmptyState, StatusBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { dateLabel, minutesToLabel, money } from "@/lib/format";

function Overview({ user }) {
  const [data, setData] = useState(null);
  const [acting, setActing] = useState("");

  useEffect(() => {
    Promise.all([api("/studios/mine"), api("/bookings/mine"), api("/bookings/host"), api("/wishlist")])
      .then(([studios, mine, requests, saved]) => setData({ studios, mine, requests, saved }))
      .catch((e) => {
        toast.error(e.message);
        setData({ studios: [], mine: [], requests: [], saved: [] });
      });
  }, []);

  async function decide(b, status) {
    setActing(b._id + status);
    try {
      const updated = await api(`/bookings/${b._id}/status`, { method: "PATCH", body: { status } });
      setData((d) => ({ ...d, requests: d.requests.map((r) => (r._id === updated._id ? updated : r)) }));
      toast.success(status === "Confirmed" ? "Booking confirmed. That slot is now blocked for others." : "Request declined.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setActing("");
    }
  }

  const stats = data && [
    { label: "STUDIOS YOU HOST", value: data.studios.length, href: "/my-listings" },
    { label: "YOUR BOOKINGS", value: data.mine.length, href: "/my-bookings" },
    { label: "REQUESTS TO REVIEW", value: data.requests.filter((r) => r.status === "Pending").length, href: "#requests" },
    { label: "SAVED STUDIOS", value: data.saved.length, href: "#saved" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2.5">
        <div className="eyebrow">Dashboard</div>
        <h1 className="font-display text-[clamp(34px,4vw,44px)] font-bold tracking-[-0.03em]">Hi, {user.name.split(" ")[0]}</h1>
        <p className="text-mu">Everything you host, book and save, in one place.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {(stats || [0, 1, 2, 3]).map((s, i) =>
          stats ? (
            <Link key={s.label} href={s.href} className="lift card-ss rounded-[18px] p-5">
              <div className="font-mono text-xs text-mu">{s.label}</div>
              <div className="mt-1.5 font-display text-[34px] font-bold">{s.value}</div>
            </Link>
          ) : (
            <div key={i} className="skel h-[104px] rounded-[18px]" />
          )
        )}
      </div>

      <section id="requests" aria-labelledby="req-h" className="flex scroll-mt-24 flex-col gap-4">
        <h2 id="req-h" className="font-display text-[28px] font-bold">Booking requests on your studios</h2>
        {!data ? (
          <div className="skel h-24 rounded-[22px]" />
        ) : data.requests.length === 0 ? (
          <EmptyState
            icon={<Inbox size={30} />}
            title="No requests yet"
            text="When creators book one of your studios, their requests land here for you to confirm or decline."
            action={data.studios.length ? "View your listings" : "List a studio"}
            actionHref={data.studios.length ? "/my-listings" : "/add-studio"}
          />
        ) : (
          <div className="card-ss overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-[15px]">
              <thead>
                <tr className="text-left font-mono text-xs tracking-[0.06em] text-mu">
                  <th scope="col" className="px-5 py-4 font-medium">STUDIO</th>
                  <th scope="col" className="p-4 font-medium">CREATOR</th>
                  <th scope="col" className="p-4 font-medium">WHEN</th>
                  <th scope="col" className="p-4 font-medium">TOTAL</th>
                  <th scope="col" className="p-4 font-medium">STATUS</th>
                  <th scope="col" className="px-5 py-4 text-right font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.requests.map((r) => (
                  <tr key={r._id} className="border-t border-ln align-middle">
                    <td className="px-5 py-3.5 font-semibold">{r.studioTitle}</td>
                    <td className="p-4">
                      <div>{r.userName}</div>
                      <div className="text-[13px] text-mu">{r.userEmail}</div>
                      {r.note && <div className="mt-1 max-w-[260px] text-[13px] text-mu italic">“{r.note}”</div>}
                    </td>
                    <td className="p-4">
                      <div>{dateLabel(r.date)}</div>
                      <div className="text-[13px] text-mu">
                        {minutesToLabel(r.startMin)} – {minutesToLabel(r.endMin)}
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{money(r.total)}</td>
                    <td className="p-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {r.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={Boolean(acting)}
                            onClick={() => decide(r, "Confirmed")}
                            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-acc px-3.5 text-sm font-semibold text-on disabled:opacity-60"
                          >
                            {acting === r._id + "Confirmed" ? <span className="loading loading-spinner loading-xs" /> : <Check size={15} />}
                            Confirm
                          </button>
                          <button type="button" disabled={Boolean(acting)} onClick={() => decide(r, "Cancelled")} className="btn-danger disabled:opacity-60">
                            <X size={15} /> Decline
                          </button>
                        </div>
                      ) : (
                        <div className="text-right text-sm text-mu">—</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="saved" aria-labelledby="saved-h" className="flex scroll-mt-24 flex-col gap-4">
        <h2 id="saved-h" className="font-display text-[28px] font-bold">Saved studios</h2>
        {!data ? (
          <div className="skel h-40 rounded-[22px]" />
        ) : data.saved.length === 0 ? (
          <EmptyState
            icon={<Heart size={30} />}
            title="Your wishlist is empty"
            text="Tap the heart on any studio card to save it here for later."
            action="Browse studios"
            actionHref="/studios"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {data.saved.map((s) => (
              <StudioCard key={s._id} studio={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardShell active="/dashboard">{(user) => <Overview user={user} />}</DashboardShell>;
}
