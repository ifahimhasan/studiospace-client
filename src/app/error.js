"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function Error({ reset }) {
  return (
    <div className="container-ss py-14">
      <EmptyState
        title="Something went wrong on set"
        text="We couldn't load this page. Try again, or head back home and pick another studio."
        action="Try again"
        onAction={reset}
        secondary={
          <Link href="/" className="btn-line">
            Return to Home
          </Link>
        }
      />
    </div>
  );
}
