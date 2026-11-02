import Link from "next/link";
import { CATEGORY_CARDS } from "@/lib/constants";

export const metadata = { title: "About Us" };

const VALUES = [
  { title: "Made for makers", text: "Every listing is built around what creators actually check first: the light, the sound, the power and the load-in." },
  { title: "Fair to hosts", text: "Hosts set their own rates and deposits, approve every request and keep control of their calendar." },
  { title: "Clear up front", text: "Hourly rate, deposit and total are shown before you book. No surprise fees at the door." },
];

export default function AboutPage() {
  return (
    <div className="container-ss pt-14">
      <div className="eyebrow">About us</div>
      <h1 className="mt-3.5 max-w-[860px] font-display text-[clamp(40px,5.2vw,68px)] leading-[1] font-extrabold tracking-[-0.035em]">
        We put idle studios to work.
      </h1>
      <p className="lead mt-5 max-w-[680px]">
        Photographers, filmmakers, podcasters and musicians need the right room for a few hours, not a year-long lease. Meanwhile great studios
        sit empty between sessions. StudioSpace is the marketplace in the middle: hosts list their spaces, creators book them by the hour.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="card-ss p-7">
            <div className="font-display text-[26px] font-bold">{v.title}</div>
            <p className="mt-3 leading-relaxed text-mu">{v.text}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="cats-h" className="pt-[100px]">
        <h2 id="cats-h" className="h-section">What you can book</h2>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {CATEGORY_CARDS.map((c) => (
            <Link key={c.value} href={`/studios?category=${encodeURIComponent(c.value)}`} className="chip">
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section id="terms" aria-labelledby="terms-h" className="pt-[100px]">
        <h2 id="terms-h" className="font-display text-[30px] font-bold">Terms of Service</h2>
        <p className="mt-3 max-w-[760px] leading-relaxed text-mu">
          Hosts are responsible for the accuracy of their listings and the safety of their space. Creators agree to follow each studio&apos;s house
          rules and are liable for damage beyond normal use, which may be taken from the security deposit. Pending requests can be cancelled at
          any time; confirmed bookings are handled directly with the host.
        </p>
      </section>

      <section id="privacy" aria-labelledby="privacy-h" className="pt-12">
        <h2 id="privacy-h" className="font-display text-[30px] font-bold">Privacy Policy</h2>
        <p className="mt-3 max-w-[760px] leading-relaxed text-mu">
          We store your name, email and profile photo to run your account, and your listings and bookings to run the marketplace. Your sign-in
          token is kept in a secure, HTTP-only cookie. We never sell your data.
        </p>
      </section>
    </div>
  );
}
