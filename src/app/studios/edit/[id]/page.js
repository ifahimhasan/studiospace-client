"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StudioForm from "@/components/dashboard/StudioForm";
import { EmptyState, Spinner } from "@/components/ui";
import { api } from "@/lib/api";

function EditLoader({ user }) {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, studio: null, error: "" });

  useEffect(() => {
    api(`/studios/${id}`)
      .then((studio) => setState({ loading: false, studio, error: "" }))
      .catch((e) => setState({ loading: false, studio: null, error: e.message }));
  }, [id]);

  if (state.loading) return <Spinner className="min-h-[40vh]" label="Loading your listing…" />;
  if (!state.studio) return <EmptyState title="Studio not found" text={state.error} action="Back to My Listings" actionHref="/my-listings" />;
  if (state.studio.ownerEmail !== user.email.toLowerCase())
    return <EmptyState title="This isn't your listing" text="Only the host who created a studio can edit it." action="Back to My Listings" actionHref="/my-listings" />;
  return <StudioForm user={user} studio={state.studio} />;
}

export default function EditStudioPage() {
  return <DashboardShell active="/my-listings">{(user) => <EditLoader user={user} />}</DashboardShell>;
}
