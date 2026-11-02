"use client";

import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { GoogleLogo } from "../icons";

export default function GoogleButton({ redirectTo = "/", label = "Continue with Google" }) {
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    const { error } = await signIn.social({ provider: "google", callbackURL: redirectTo, errorCallbackURL: "/login" });
    if (error) {
      toast.error(error.message || "Google sign-in is not available right now.");
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={go} disabled={busy} className="btn-line h-[52px] w-full bg-sf">
      {busy ? <span className="loading loading-spinner loading-sm" /> : <GoogleLogo />}
      {label}
    </button>
  );
}
