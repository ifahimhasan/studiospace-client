"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import StudioImage from "../StudioImage";

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

const SLIDES = [
  {
    tag: "PHOTO · FILM · AUDIO",
    title: "Rent the room your next shoot deserves.",
    sub: "Cyc walls, sound stages, podcast lounges and music suites, booked by the hour from hosts who build for creators.",
    studio: "Northlight Cyc Studio · Brooklyn",
    rate: 65,
    image: u("1726650680145-d441d5882bdb"),
    alt: "Photo studio with a white backdrop and lighting",
  },
  {
    tag: "SOUND STAGES",
    title: "Roll camera on a stage built for it.",
    sub: "Lit, soundproofed stages with grip on hand. Pick your hours and see the full price before you book.",
    studio: "Soundstage 7 · Burbank",
    rate: 180,
    image: u("1471341971476-ae15ff5dd4ea"),
    alt: "Camera and lights set up on a film stage",
  },
  {
    tag: "FOR HOSTS",
    title: "Your empty studio is someone’s next record.",
    sub: "List your space in minutes, set your hourly rate, and get paid for the hours it would sit idle.",
    studio: "Analog Room Recording Suite · Nashville",
    rate: 85,
    image: u("1598488035139-bdbb2231ce04"),
    alt: "Music recording studio with a mixing console and guitars",
  },
];

export default function HeroSlider() {
  const swiperRef = useRef(null);
  const [active, setActive] = useState(0);

  return (
    <section aria-label="Featured spaces slider" className="container-ss pt-7">
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, EffectFade, A11y, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={700}
        keyboard={{ enabled: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActive(s.realIndex)}
      >
        {SLIDES.map((s, i) => (
          <SwiperSlide key={s.title}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="flex min-h-[560px] flex-col justify-between gap-10 rounded-[28px] border border-ln bg-sf p-8 sm:p-12">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2.5 font-mono text-[13px] tracking-[0.08em] text-acct">
                    <span className="h-2 w-2 rounded-full bg-acc" />
                    {s.tag}
                  </div>
                  {i === 0 ? (
                    <h1 className="font-display text-[clamp(40px,5.6vw,76px)] leading-[0.98] font-extrabold tracking-[-0.035em]">{s.title}</h1>
                  ) : (
                    <p className="font-display text-[clamp(40px,5.6vw,76px)] leading-[0.98] font-extrabold tracking-[-0.035em]">{s.title}</p>
                  )}
                  <p className="max-w-[520px] text-lg leading-relaxed text-mu">{s.sub}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/studios" className="btn-main h-[52px] px-[26px] text-base">
                      Explore Studios <ArrowRight size={18} />
                    </Link>
                    <Link href="/studios" className="btn-line h-[52px] px-[26px] text-base">
                      Host Your Space
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" aria-label="Previous slide" onClick={() => swiperRef.current?.slidePrev()} className="icon-btn h-12 w-12">
                    <ArrowLeft size={18} />
                  </button>
                  <button type="button" aria-label="Next slide" onClick={() => swiperRef.current?.slideNext()} className="icon-btn h-12 w-12">
                    <ArrowRight size={18} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {SLIDES.map((d, k) => (
                      <button
                        key={d.tag}
                        type="button"
                        aria-label={`Go to slide ${k + 1}`}
                        aria-current={k === active}
                        onClick={() => swiperRef.current?.slideToLoop(k)}
                        className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${k === active ? "w-7 bg-acc" : "w-2 bg-ln"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-auto font-mono text-[13px] text-mu">0{i + 1} / 03</span>
                </div>
              </div>

              <div className="grid grid-rows-[1fr_auto] gap-4">
                <div className="relative min-h-[400px] overflow-hidden rounded-[28px] border border-ln">
                  <StudioImage src={s.image} alt={s.alt} className="absolute inset-0 h-full w-full" />
                  <span className="absolute top-5 right-5 flex items-center gap-2 rounded-lg border border-ln bg-bg px-2.5 py-1.5 font-mono text-xs">
                    <span className="rec-dot h-[7px] w-[7px] rounded-full bg-acc" />
                    REC
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-[20px] border border-ln bg-sf px-5 py-[18px]">
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs tracking-[0.06em] text-mu">NOW SHOWING</div>
                    <div className="mt-1 truncate text-[17px] font-semibold">{s.studio}</div>
                  </div>
                  <div className="font-display text-[22px] font-bold">
                    ${s.rate}
                    <span className="font-sans text-sm font-normal text-mu"> / hr</span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
