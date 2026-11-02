"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { PASSWORD_RULES, passwordProblems } from "@/lib/password";
import GoogleButton from "./GoogleButton";
import { OrDivider, safeRedirect } from "./AuthShell";

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get("redirect"));

  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const problems = passwordProblems(form.password);
  const pwInvalid = (touched || form.password.length > 0) && problems.length > 0;

  async function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (form.name.trim().length < 2) return toast.error("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error("Please enter a valid email address.");
    if (form.image && !/^https?:\/\/.+/i.test(form.image)) return toast.error("Photo URL must start with http:// or https://");
    if (problems.length) return toast.error(`Password needs ${problems.join(", ")}.`);

    setBusy(true);
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.image.trim() || undefined,
    });
    setBusy(false);
    if (error) {
      const msg = /exist/i.test(error.message || "") ? "An account with this email already exists. Try logging in." : error.message || "Registration failed.";
      toast.error(msg);
      return;
    }
    toast.success("Account created. Please log in to continue.");
    const q = new URLSearchParams({ email: form.email.trim() });
    if (redirectTo !== "/") q.set("redirect", redirectTo);
    router.push(`/login?${q}`);
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="reg-h" className="flex flex-col gap-3.5">
      <div>
        <h1 id="reg-h" className="font-display text-[40px] font-bold tracking-[-0.03em]">
          Create your account
        </h1>
        <p className="mt-2 text-mu">Book studios or list your own in minutes.</p>
      </div>

      <label className="label-ss">
        Name
        <input type="text" autoComplete="name" value={form.name} onChange={set("name")} placeholder="Your full name" className="field h-[50px] rounded-[14px]" />
      </label>
      <label className="label-ss">
        Email
        <input type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="field h-[50px] rounded-[14px]" />
      </label>
      <label className="label-ss">
        Photo URL
        <input type="url" value={form.image} onChange={set("image")} placeholder="https://…/avatar.jpg" className="field h-[50px] rounded-[14px]" />
      </label>
      <div className="label-ss">
        <label htmlFor="reg-password">Password</label>
        <div className="relative">
          <input
            id="reg-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
            onBlur={() => setTouched(true)}
            aria-invalid={pwInvalid}
            aria-describedby="pw-rules"
            placeholder="At least 6 characters"
            className={`field h-[50px] rounded-[14px] pr-12 ${pwInvalid ? "border-err" : ""}`}
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
      <ul id="pw-rules" aria-label="Password rules" className="flex flex-col gap-1.5 text-sm">
        {PASSWORD_RULES.map((r) => {
          const ok = r.test(form.password);
          const tone = ok ? "text-ok" : pwInvalid ? "text-err" : "text-mu";
          return (
            <li key={r.id} className={`flex items-center gap-2 ${tone}`}>
              {ok ? <Check size={16} /> : <X size={16} />}
              {r.label}
            </li>
          );
        })}
      </ul>
      {pwInvalid && (
        <p role="alert" className="text-sm text-err">
          Password needs {problems.join(", ")}.
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-main h-[52px] text-base">
        {busy && <span className="loading loading-spinner loading-sm" />}
        Register
      </button>

      <OrDivider />
      <GoogleButton redirectTo="/" label="Sign up with Google" />

      <p className="text-center text-[15px] text-mu">
        Already have an account?{" "}
        <Link href={`/login${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="font-medium text-acct hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
