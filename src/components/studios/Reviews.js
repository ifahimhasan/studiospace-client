"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import Avatar from "../Avatar";
import { formatRating } from "@/lib/format";

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });

export default function Reviews({ studio, initial }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initial);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const canReview = session?.user && session.user.email.toLowerCase() !== studio.ownerEmail;

  async function submit(e) {
    e.preventDefault();
    if (text.trim().length < 10) return toast.error("Write at least 10 characters.");
    setBusy(true);
    try {
      await api(`/studios/${studio._id}/reviews`, { method: "POST", body: { rating, text } });
      setReviews(await api(`/studios/${studio._id}/reviews`));
      setText("");
      toast.success("Thanks! Your review is live.");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="rv-h" className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3.5">
        <h2 id="rv-h" className="font-display text-[30px] font-bold tracking-[-0.02em]">
          Reviews
        </h2>
        <span className="text-mu">
          {formatRating(studio.rating)} average · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {reviews.length === 0 && <p className="text-mu">No reviews yet. Be the first to share how your session went.</p>}

      {reviews.map((r) => (
        <article key={r._id} className="flex flex-col gap-2.5 border-t border-ln pt-[18px]">
          <div className="flex items-center gap-3">
            <Avatar user={{ name: r.userName, image: r.userImage }} size={40} />
            <div>
              <div className="font-semibold">{r.userName}</div>
              <div className="text-[13px] text-mu">{fmt(r.createdAt)}</div>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold">
              <Star size={14} fill="#FFB020" stroke="#FFB020" />
              {r.rating}.0
            </span>
          </div>
          <p className="leading-relaxed text-mu">{r.text}</p>
        </article>
      ))}

      {canReview && (
        <form onSubmit={submit} className="card-ss mt-2 flex flex-col gap-3 p-5">
          <div className="font-semibold">Leave a review</div>
          <div className="flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className="cursor-pointer p-1"
              >
                <Star size={22} fill={n <= rating ? "#FFB020" : "none"} stroke={n <= rating ? "#FFB020" : "currentColor"} />
              </button>
            ))}
          </div>
          <label className="label-ss">
            Your review
            <textarea rows={3} maxLength={600} value={text} onChange={(e) => setText(e.target.value)} placeholder="How was the light, the sound, the host?" className="field-area" />
          </label>
          <button type="submit" disabled={busy} className="btn-main self-end">
            {busy && <span className="loading loading-spinner loading-sm" />}
            Post review
          </button>
        </form>
      )}
    </section>
  );
}
