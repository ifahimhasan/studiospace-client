import Link from "next/link";
import { ArrowUpRight, Camera, Clapperboard, Mic, Music, Palette } from "lucide-react";
import { SectionHeading } from "../ui";
import { CATEGORY_CARDS } from "@/lib/constants";

const ICONS = { "Photo Studio": Camera, "Film Stage": Clapperboard, "Podcast Lounge": Mic, "Music Suite": Music, Workshop: Palette };

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=75`;
const PHOTOS = {
  "Photo Studio": img("1586232702178-f044c5f4d4b7"),
  "Film Stage": img("1632187981988-40f3cbaeef5e"),
  "Podcast Lounge": img("1478737270239-2f02b77fc618"),
  "Music Suite": img("1535406208535-1429839cfd13"),
  Workshop: img("1723717275425-eb4a16b5d2da"),
};

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
              className={`group lift relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-ln bg-sf2 p-6 text-white lg:col-span-2 ${
                big ? "p-7 sm:row-span-2" : ""
              }`}
            >
              <img
                src={PHOTOS[c.value]}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

              <div className="relative flex items-start justify-between">
                <span
                  className={`inline-flex items-center justify-center bg-acc text-on ${big ? "h-14 w-14 rounded-2xl" : "h-12 w-12 rounded-[14px]"}`}
                >
                  <Icon size={big ? 26 : 22} strokeWidth={1.8} />
                </span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-sm transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="relative">
                <div className={`font-display font-bold ${big ? "text-[36px] tracking-[-0.02em]" : "text-[26px]"}`}>{c.label}</div>
                <div className="mt-1.5 text-white/80">{c.sub}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}