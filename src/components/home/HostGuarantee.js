import Link from "next/link";
import { BadgeCheck, Headphones, ShieldCheck, Wrench } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Liability protection", text: "Every confirmed booking is covered, so hosts and creators are not left exposed if something goes wrong on set." },
  { icon: BadgeCheck, title: "Verified profiles", text: "Hosts and creators sign in with a verified account before they can list a space or request a slot." },
  { icon: Wrench, title: "Equipment safety", text: "Security deposits and clear house rules protect the lights, mics and gear that come with each room." },
  { icon: Headphones, title: "24/7 host support", text: "A real person answers day or night when a booking, payment or key handover needs sorting." },
];

export default function HostGuarantee() {
  return (
    <section id="guarantee" aria-labelledby="trust-h" className="container-ss pt-[120px]">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex min-h-[420px] flex-col justify-between gap-8 rounded-[28px] bg-acc p-8 text-on sm:p-12">
          <div className="font-mono text-[13px] tracking-[0.08em]">04 — HOST GUARANTEE &amp; CREATOR SUPPORT</div>
          <h2 id="trust-h" className="font-display text-[clamp(36px,4.4vw,60px)] leading-none font-extrabold tracking-[-0.03em]">
            Book with confidence. Host without the worry.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/add-studio" className="inline-flex h-[52px] items-center rounded-full bg-on px-[26px] font-semibold text-[#F4F2EE] transition hover:-translate-y-0.5">
              Host Your Space
            </Link>
            <Link href="/studios" className="inline-flex h-[52px] items-center rounded-full border-[1.5px] border-on px-[26px] font-semibold text-on transition hover:-translate-y-0.5">
              Find a studio
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-ss flex flex-col gap-3 p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sf2 text-acct">
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <div className="text-lg font-semibold">{title}</div>
              <p className="text-[15px] leading-relaxed text-mu">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
