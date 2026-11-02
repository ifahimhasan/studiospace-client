import Link from "next/link";
import HowItWorks from "@/components/home/HowItWorks";
import HostGuarantee from "@/components/home/HostGuarantee";

export const metadata = { title: "How It Works" };

const HOST_STEPS = [
  { n: "01", title: "List your space", text: "Add photos, an hourly rate, a refundable deposit, capacity and the amenities that come with the room." },
  { n: "02", title: "Review requests", text: "Booking requests arrive as Pending on your dashboard. Confirm the ones that fit, decline the rest." },
  { n: "03", title: "Host the session", text: "Confirmed slots are blocked for everyone else, so you never get two crews at the door." },
];

export default function HowItWorksPage() {
  return (
    <>
      <div className="container-ss pt-14">
        <div className="eyebrow">How it works</div>
        <h1 className="mt-3.5 max-w-[820px] font-display text-[clamp(40px,5.2vw,68px)] leading-[1] font-extrabold tracking-[-0.035em]">
          Book a studio in minutes. Host one without the admin.
        </h1>
        <p className="lead mt-5 max-w-[620px]">
          StudioSpace connects creators who need a room for a few hours with hosts whose rooms would otherwise sit empty.
        </p>
      </div>

      <HowItWorks eyebrow="For creators" headingAs="h2" />

      <section aria-labelledby="host-steps-h" className="container-ss pt-[120px]">
        <div className="eyebrow">For hosts</div>
        <h2 id="host-steps-h" className="h-section mt-3.5">Turn idle hours into income</h2>
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {HOST_STEPS.map((s) => (
            <li key={s.n} className="card-ss flex min-h-[220px] flex-col gap-4 p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-acct">{s.n}</span>
                <span className="h-px flex-1 bg-ln" />
              </div>
              <div className="font-display text-[26px] font-bold">{s.title}</div>
              <p className="leading-relaxed text-mu">{s.text}</p>
            </li>
          ))}
        </ol>
        <Link href="/add-studio" className="btn-main mt-8">
          Host Your Space
        </Link>
      </section>

      <HostGuarantee />
    </>
  );
}
