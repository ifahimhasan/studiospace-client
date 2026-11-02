import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import StudioImage from "./StudioImage";
import WishlistButton from "./WishlistButton";
import { formatRating } from "@/lib/format";

export default function StudioCard({ studio }) {
  const id = String(studio._id);
  return (
    <article className="lift card-ss flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <StudioImage src={studio.image} alt={`${studio.title} photo`} className="h-full w-full" label={studio.category} />
        <span className="absolute top-3.5 left-3.5 rounded-full border border-ln bg-bg px-2.5 py-1.5 text-xs font-semibold">{studio.category}</span>
        <WishlistButton studioId={id} title={studio.title} className="absolute top-2.5 right-2.5" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 font-display text-[21px] leading-tight font-bold tracking-[-0.01em]">{studio.title}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-sf2 px-2 py-1 text-sm font-semibold">
            <Star size={14} fill="#FFB020" stroke="#FFB020" />
            {formatRating(studio.rating)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-mu">
          <MapPin size={15} />
          <span className="truncate">{studio.location}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-ln pt-3.5">
          <div>
            <span className="font-display text-2xl font-bold">${studio.hourlyRate}</span>
            <span className="text-sm text-mu"> / hr</span>
          </div>
          <Link href={`/studios/${id}`} className="btn-ink">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="card-ss overflow-hidden" aria-hidden="true">
      <div className="skel aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <div className="skel h-[22px] w-[70%]" />
        <div className="skel h-3.5 w-[45%]" />
        <div className="mt-3.5 flex justify-between">
          <div className="skel h-7 w-20" />
          <div className="skel h-11 w-[120px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
