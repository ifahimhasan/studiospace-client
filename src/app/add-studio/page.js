"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import StudioForm from "@/components/dashboard/StudioForm";

export default function AddStudioPage() {
  return <DashboardShell active="/add-studio">{(user) => <StudioForm user={user} />}</DashboardShell>;
}
