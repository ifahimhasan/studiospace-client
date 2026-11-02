import Link from "next/link";
import { Camera, Clapperboard, Mic, Music, Palette } from "lucide-react";
import { SectionHeading } from "../ui";
import { CATEGORY_CARDS } from "@/lib/constants";

const ICONS = { "Photo Studio": Camera, "Film Stage": Clapperboard, "Podcast Lounge": Mic, "Music Suite": Music, Workshop: Palette };

export default function CategoryGrid() {
  return (
    <section aria-labelledby="cat-h" className="container-ss pt-[120px]">
      <SectionHeading
        id="cat-h"
        eyebrow="02 — Browse by category"
        title="Pick the room by the work"
        lead="Each category opens Explore Studios with that filter already applied."
      />
      <div className="mt-10 grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {CATEGORY_CARDS.map((c, i) => {
          const Icon = ICONS[c.value];
          const big = i === 0;
          return (
            <Link
              key={c.value}
              href={`/studios?category=${encodeURIComponent(c.value)}`}
              className={`lift flex flex-col justify-between rounded-[24px] border border-ln p-6 lg:col-span-2 ${
                big ? "stripes sm:row-span-2 p-7" : "bg-sf"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center ${
                  big ? "h-14 w-14 rounded-2xl bg-acc text-on" : "h-12 w-12 rounded-[14px] bg-sf2"
                }`}
              >
                <Icon size={big ? 26 : 22} strokeWidth={1.8} />
              </span>
              <div>
                <div className={`font-display font-bold ${big ? "text-[36px] tracking-[-0.02em]" : "text-[26px]"}`}>{c.label}</div>
                <div className="mt-1.5 text-mu">{c.sub}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
