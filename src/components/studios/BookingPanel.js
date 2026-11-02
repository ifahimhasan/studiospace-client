"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { money } from "@/lib/format";
import BookingModal from "./BookingModal";

/** Sticky price card with the "Book Workspace Now" button that opens the booking modal. */
export default function BookingPanel({ studio }) {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isOwner = session?.user?.email?.toLowerCase() === studio.ownerEmail;

  function book() {
    if (!session?.user) {
      toast.info("Log in to book this studio.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setOpen(true);
  }

  return (
    <aside aria-label="Booking" className="card-ss flex flex-col gap-4 rounded-[24px] p-6 lg:sticky lg:top-24">
      <div>
        <span className="font-display text-[34px] font-bold">{money(studio.hourlyRate)}</span>
        <span className="text-mu"> / hr</span>
      </div>
      <dl className="flex flex-col gap-2 text-[15px]">
        <div className="flex justify-between text-mu">
          <dt>Security deposit (refundable)</dt>
          <dd>{money(studio.securityDeposit || 0)}</dd>
        </div>
        <div className="flex justify-between text-mu">
          <dt>Max capacity</dt>
          <dd>{studio.maxCapacity} people</dd>
        </div>
        <div className="flex justify-between text-mu">
          <dt>Minimum booking</dt>
          <dd>1 hour</dd>
        </div>
      </dl>
      {isOwner ? (
        <Link href={`/studios/edit/${studio._id}`} className="btn-line h-[54px] text-base">
          <Pencil size={17} /> Edit your listing
        </Link>
      ) : (
        <button type="button" onClick={book} disabled={isPending} className="btn-main h-[54px] text-base">
          Book Workspace Now
        </button>
      )}
      <p className="text-center text-[13px] text-mu">You won&apos;t be charged yet. Requests stay Pending until the host confirms.</p>
      {!isOwner && <BookingModal open={open} onClose={() => setOpen(false)} studio={studio} />}
    </aside>
  );
}
