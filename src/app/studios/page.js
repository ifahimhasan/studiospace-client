import { Suspense } from "react";
import ExploreStudios from "@/components/studios/ExploreStudios";
import { StudioCardSkeleton } from "@/components/StudioCard";

export const metadata = { title: "Explore Studios" };

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="container-ss grid grid-cols-1 gap-5 pt-40 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <ExploreStudios />
    </Suspense>
  );
}
