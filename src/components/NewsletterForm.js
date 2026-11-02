"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're on the list. New studios land in your inbox monthly.");
    setEmail("");
  }

  return (
    <form onSubmit={submit} aria-label="Newsletter" className="flex flex-col gap-3">
      <div className="font-mono text-xs tracking-[0.08em] text-mu">NEWSLETTER</div>
      <p className="text-[15px] leading-relaxed text-mu">New studios and host tips, once a month.</p>
      <label htmlFor="nl-email" className="text-sm">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id="nl-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className="h-12 min-w-0 flex-1 rounded-full border border-ln bg-bg px-4 text-tx placeholder:text-mu/70 focus:border-acc focus:outline-none"
        />
        <button type="submit" className="btn-main px-[18px]">
          Subscribe
        </button>
      </div>
    </form>
  );
}
