const WORDS = ["Photo Studios", "Sound Stages", "Podcast Rooms", "Music Suites", "Art Workshops", "Cyc Walls"];

export default function Marquee() {
  const items = [...WORDS, ...WORDS];
  return (
    <div aria-hidden="true" className="mt-14 overflow-hidden border-y border-ln py-[22px]">
      <div className="marquee-track flex w-max gap-10 font-display text-[34px] font-bold tracking-[-0.02em] whitespace-nowrap">
        {items.map((w, k) => (
          <span key={`${w}-${k}`} className="inline-flex items-center gap-10">
            <span className={k % 2 ? "text-outline" : "text-tx"}>{w}</span>
            <span className="text-[22px] text-acc">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
