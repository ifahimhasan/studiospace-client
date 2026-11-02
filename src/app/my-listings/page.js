"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ConfirmModal } from "@/components/Modal";
import { EmptyState } from "@/components/ui";
import StudioImage from "@/components/StudioImage";
import { api } from "@/lib/api";
import { formatRating, money } from "@/lib/format";

function Listings() {
  const [items, setItems] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/studios/mine")
      .then(setItems)
      .catch((e) => {
        toast.error(e.message);
        setItems([]);
      });
  }, []);

  async function confirmDelete() {
    setBusy(true);
    try {
      await api(`/studios/${toDelete._id}`, { method: "DELETE" });
      setItems((list) => list.filter((s) => s._id !== toDelete._id));
      toast.success(`“${toDelete.title}” was deleted.`);
      setToDelete(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  const avg = items?.length ? Math.round(items.reduce((a, s) => a + s.hourlyRate, 0) / items.length) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <div className="eyebrow">My studio listings</div>
          <h1 className="font-display text-[clamp(34px,4vw,44px)] font-bold tracking-[-0.03em]">Spaces you host</h1>
        </div>
        <Link href="/add-studio" className="btn-main">
          <Plus size={18} /> Add New Studio
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="card-ss rounded-[18px] p-5">
          <div className="font-mono text-xs text-mu">ACTIVE LISTINGS</div>
          <div className="mt-1.5 font-display text-[34px] font-bold">{items ? items.length : "—"}</div>
        </div>
        <div className="card-ss rounded-[18px] p-5">
          <div className="font-mono text-xs text-mu">AVERAGE RATE</div>
          <div className="mt-1.5 font-display text-[34px] font-bold">
            {items ? money(avg) : "—"}
            <span className="font-sans text-base font-normal text-mu"> / hr</span>
          </div>
        </div>
      </div>

      {items === null ? (
        <div className="card-ss flex flex-col gap-4 p-5" aria-busy="true" aria-label="Loading listings">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="skel h-12 w-16" />
              <div className="skel h-4 flex-1" />
              <div className="skel h-10 w-44 rounded-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Building2 size={30} />}
          title="You are not hosting any studios yet"
          text="List your first space and start taking hourly bookings from photographers, filmmakers and podcasters."
          action="Add your first studio"
          actionHref="/add-studio"
        />
      ) : (
        <div className="card-ss overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-[15px]">
            <thead>
              <tr className="text-left font-mono text-xs tracking-[0.06em] text-mu">
                <th scope="col" className="px-5 py-4 font-medium">STUDIO</th>
                <th scope="col" className="p-4 font-medium">CATEGORY</th>
                <th scope="col" className="p-4 font-medium">RATE</th>
                <th scope="col" className="p-4 font-medium">RATING</th>
                <th scope="col" className="px-5 py-4 text-right font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id} className="border-t border-ln hover:bg-sf2">
                  <td className="px-5 py-3.5">
                    <Link href={`/studios/${s._id}`} className="flex items-center gap-3.5">
                      <StudioImage src={s.image} alt={`${s.title} thumbnail`} className="h-12 w-16 shrink-0 rounded-[10px] border border-ln" label={false} />
                      <span>
                        <span className="block font-semibold">{s.title}</span>
                        <span className="block text-[13px] text-mu">{s.location}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full border border-ln px-2.5 py-1 text-[13px]">{s.category}</span>
                  </td>
                  <td className="p-4 font-semibold">{money(s.hourlyRate)} / hr</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1">
                      <Star size={14} fill="#FFB020" stroke="#FFB020" /> {formatRating(s.rating)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Link href={`/studios/edit/${s._id}`} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ln px-3.5 text-sm font-semibold hover:border-acc">
                        <Pencil size={15} /> Update
                      </Link>
                      <button type="button" onClick={() => setToDelete(s)} className="btn-danger">
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => !busy && setToDelete(null)}
        onConfirm={confirmDelete}
        busy={busy}
        title={toDelete ? `Delete “${toDelete.title}”?` : "Delete listing?"}
        text="This removes the listing for good. Creators will no longer find it, open requests are cancelled, and you cannot undo this."
        confirmLabel="Yes, delete"
        cancelLabel="Keep listing"
      />
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <DashboardShell active="/my-listings">
      <Listings />
    </DashboardShell>
  );
}
