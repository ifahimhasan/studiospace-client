import { SectionHeading } from "../ui";

const STEPS = [
  { n: "01", title: "Discover Spaces", text: "Filter by category, city and hourly rate. Every listing shows real photos, amenities and host reviews." },
  { n: "02", title: "Select Shoot Hours", text: "Pick a date and the exact hours you need. Slots already confirmed by others are blocked out." },
  { n: "03", title: "Book Instantly", text: "See rate, deposit and total up front, then send your request. Track it from Pending to Confirmed." },
  { n: "04", title: "Create & Produce", text: "Show up, set up and make the work. Leave a review so the next creator knows what to expect." },
];

export default function HowItWorks({ eyebrow = "03 — How booking works", headingAs = "h2" }) {
  return (
    <section id="how" aria-labelledby="how-h" className="container-ss pt-[120px]">
      <SectionHeading id="how-h" as={headingAs} eyebrow={eyebrow} title="From search to set in four steps" />
      <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <li key={s.n} className="card-ss flex min-h-[240px] flex-col gap-4 p-7">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-acct">{s.n}</span>
              <span className="h-px flex-1 bg-ln" />
            </div>
            <div className="font-display text-[26px] font-bold tracking-[-0.01em]">{s.title}</div>
            <p className="leading-relaxed text-mu">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
