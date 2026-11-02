"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn, useSession } from "@/lib/auth-client";
import { syncJwt } from "@/lib/api";
import GoogleButton from "./GoogleButton";
import { OrDivider, safeRedirect } from "./AuthShell";
import Modal from "../Modal";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get("redirect"));
  const { data: session, isPending } = useSession();

  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // Already signed in (e.g. back button): go where they wanted.
  useEffect(() => {
    if (!isPending && session?.user && !busy) router.replace(redirectTo);
  }, [isPending, session, busy, redirectTo, router]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password.");
      toast.error("Enter your email and password.");
      return;
    }
    setBusy(true);
    const { error: err } = await signIn.email({ email, password });
    if (err) {
      const msg = err.status === 401 || /invalid/i.test(err.message || "") ? "Email or password is incorrect." : err.message || "Login failed. Try again.";
      setError(msg);
      toast.error(`Login failed: ${msg}`);
      setBusy(false);
      return;
    }
    await syncJwt();
    toast.success("Welcome back to StudioSpace.");
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <>
      <form onSubmit={submit} noValidate aria-labelledby="login-h" className="flex flex-col gap-4">
        <div>
          <h1 id="login-h" className="font-display text-[40px] font-bold tracking-[-0.03em]">
            Welcome back
          </h1>
          <p className="mt-2 text-mu">Log in to continue to your bookings.</p>
        </div>

        <label className="label-ss">
          Email
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field h-[50px] rounded-[14px]" />
        </label>

        <div className="label-ss">
          <span className="flex justify-between">
            <label htmlFor="login-password">Password</label>
            <button type="button" onClick={() => setForgotOpen(true)} className="cursor-pointer font-medium text-acct hover:underline">
              Forgot password?
            </button>
          </span>
          <div className="relative">
            <input
              id="login-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="field h-[50px] rounded-[14px] pr-12"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((s) => !s)}
              className="absolute top-1/2 right-2 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center text-mu"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-err px-3.5 py-2.5 text-sm text-err">
            {error}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-main h-[52px] text-base">
          {busy && <span className="loading loading-spinner loading-sm" />}
          Login
        </button>

        <OrDivider />
        <GoogleButton redirectTo={redirectTo} />

        <p className="text-center text-[15px] text-mu">
          New to StudioSpace?{" "}
          <Link href={`/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="font-medium text-acct hover:underline">
            Create an account
          </Link>
        </p>
      </form>

      <Modal open={forgotOpen} onClose={() => setForgotOpen(false)} title="Reset your password" eyebrow="FORGOT PASSWORD" labelledBy="forgot-title" size="max-w-[440px]">
        <p className="leading-relaxed text-mu">
          Password reset by email isn&apos;t switched on for this demo yet. Log in with Google instead, or create a new account with a different
          email.
        </p>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={() => setForgotOpen(false)} className="btn-main h-[46px]">
            Got it
          </button>
        </div>
      </Modal>
    </>
  );
}
