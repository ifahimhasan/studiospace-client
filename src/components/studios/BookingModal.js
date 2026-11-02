"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import Modal from "../Modal";
import { api } from "@/lib/api";
import { dateLabel, minutesToHHMM, minutesToLabel, money, todayIso } from "@/lib/format";

const START_OPTIONS = Array.from({ length: 33 }, (_, i) => 6 * 60 + i * 30); // 6:00 AM – 10:00 PM
const HOUR_OPTIONS = [1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12];

export default function BookingModal({ open, onClose, studio }) {
  const [date, setDate] = useState(todayIso());
  const [start, setStart] = useState(10 * 60);
  const [hours, setHours] = useState(2);
  const [note, setNote] = useState("");
  const [taken, setTaken] = useState([]);
  const [loadingTaken, setLoadingTaken] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const end = start + hours * 60;

  useEffect(() => {
    if (!open || !date) return;
    let alive = true;
    setLoadingTaken(true);
    api(`/studios/${studio._id}/booked?date=${date}`)
      .then((t) => alive && setTaken(t))
      .catch(() => alive && setTaken([]))
      .finally(() => alive && setLoadingTaken(false));
    return () => {
      alive = false;
    };
  }, [open, date, studio._id]);

  useEffect(() => {
    if (open) {
      setError("");
      setDone(null);
    }
  }, [open]);

  const overlaps = useMemo(() => taken.find((t) => t.startMin < end && t.endMin > start), [taken, start, end]);
  const subtotal = Math.round(studio.hourlyRate * hours * 100) / 100;
  const total = subtotal + (studio.securityDeposit || 0);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!date || date < todayIso()) return setError("Pick today or a future date.");
    if (end > 24 * 60) return setError("Your booking has to end by midnight.");
    if (overlaps) return setError(`That time overlaps a confirmed booking (${minutesToLabel(overlaps.startMin)} – ${minutesToLabel(overlaps.endMin)}).`);
    setBusy(true);
    try {
      const booking = await api("/bookings", {
        method: "POST",
        body: { studioId: studio._id, date, startTime: minutesToHHMM(start), endTime: minutesToHHMM(end), note },
      });
      toast.success("Booking request sent. Status: Pending.");
      setDone(booking);
    } catch (err) {
      setError(err.message);
      toast.error(err.status === 409 ? "That slot is already taken." : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={studio.title} eyebrow="BOOK WORKSPACE" labelledBy="booking-title">
      {done ? (
        <div className="flex flex-col gap-4">
          <p className="leading-relaxed text-mu">
            Your request for <span className="text-tx">{dateLabel(done.date)}</span>, {minutesToLabel(done.startMin)} – {minutesToLabel(done.endMin)} is
            in. The host will confirm it soon. You can track it any time.
          </p>
          <div className="flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="btn-line h-[46px]">
              Close
            </button>
            <Link href="/my-bookings" className="btn-main h-[46px]">
              Go to My Bookings
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="label-ss">
            Date
            <input type="date" required min={todayIso()} value={date} onChange={(e) => setDate(e.target.value)} className="field bg-bg" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="label-ss">
              Start time
              <select value={start} onChange={(e) => setStart(Number(e.target.value))} className="field cursor-pointer bg-bg">
                {START_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {minutesToLabel(m)}
                  </option>
                ))}
              </select>
            </label>
            <label className="label-ss">
              Hours
              <select value={hours} onChange={(e) => setHours(Number(e.target.value))} className="field cursor-pointer bg-bg">
                {HOUR_OPTIONS.map((h) => (
                  <option key={h} value={h}>
                    {h} {h === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-start gap-2 text-sm text-mu">
            <Clock size={16} className="mt-0.5 shrink-0" />
            {loadingTaken ? (
              <span>Checking availability…</span>
            ) : taken.length ? (
              <span>Already confirmed that day: {taken.map((t) => `${minutesToLabel(t.startMin)} – ${minutesToLabel(t.endMin)}`).join(", ")}</span>
            ) : (
              <span>No confirmed bookings that day yet.</span>
            )}
          </div>

          {(error || overlaps) && (
            <div role="alert" className="rounded-[14px] border border-err px-3.5 py-3 text-sm leading-relaxed text-err">
              {error || `This slot overlaps a confirmed booking (${minutesToLabel(overlaps.startMin)} – ${minutesToLabel(overlaps.endMin)}). Choose another time.`}
            </div>
          )}

          <label className="label-ss">
            Note to host (optional)
            <textarea
              rows={3}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Crew size, gear you are bringing, load-in needs"
              className="field-area bg-bg"
            />
          </label>

          <div className="flex flex-col gap-1.5 rounded-[14px] border border-ln bg-bg p-3.5 text-[15px]">
            <div className="flex justify-between text-mu">
              <span>
                {minutesToLabel(start)} – {minutesToLabel(end % (24 * 60))} · {money(studio.hourlyRate)} × {hours} h
              </span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-mu">
              <span>Security deposit (refundable)</span>
              <span>{money(studio.securityDeposit || 0)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2.5">
            <button type="button" onClick={onClose} className="btn-line h-12">
              Cancel
            </button>
            <button type="submit" disabled={busy || Boolean(overlaps)} className="btn-main">
              {busy && <span className="loading loading-spinner loading-sm" />}
              Send booking request
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
