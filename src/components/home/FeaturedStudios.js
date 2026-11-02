import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StudioCard from "../StudioCard";
import { EmptyState, SectionHeading } from "../ui";
import { serverGet } from "@/lib/server-api";

/** Six top-rated / newest studios, fetched from MongoDB through the API (.limit(6) on the server). */
export default async function FeaturedStudios() {
  const studios = (await serverGet("/studios/featured", { revalidate: 60, fallback: [] })) || [];

  return (
    <section aria-labelledby="featured-h" className="container-ss pt-[110px]">
      <SectionHeading
        id="featured-h"
        eyebrow="01 — Featured studios"
        title="Top-rated rooms, ready this week"
        lead="Six of the highest-rated spaces on StudioSpace right now, pulled live from our listings."
      >
        <Link href="/studios" className="btn-line">
          View all studios <ArrowRight size={16} />
        </Link>
      </SectionHeading>

      <div className="mt-10">
        {studios.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => (
              <StudioCard key={String(s._id)} studio={s} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No studios listed yet"
            text="Be the first host on StudioSpace and your room will show up right here."
            action="List your space"
            actionHref="/add-studio"
          />
        )}
      </div>
    </section>
  );
}
