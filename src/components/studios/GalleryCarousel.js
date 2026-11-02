"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation, Thumbs } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/thumbs";
import StudioImage from "../StudioImage";

export default function GalleryCarousel({ images, title }) {
  const [thumbs, setThumbs] = useState(null);
  const [index, setIndex] = useState(0);
  const [main, setMain] = useState(null);
  const list = images.length ? images : [""];

  return (
    <section aria-label={`${title} gallery`} className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-[24px] border border-ln">
        <Swiper
          modules={[Navigation, Thumbs, A11y, Keyboard]}
          thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
          keyboard={{ enabled: true }}
          onSwiper={setMain}
          onSlideChange={(s) => setIndex(s.activeIndex)}
          className="aspect-[16/9] w-full"
        >
          {list.map((src, i) => (
            <SwiperSlide key={`${src}-${i}`}>
              <StudioImage src={src} alt={`${title} photo ${i + 1}`} className="h-full w-full" label={title} />
            </SwiperSlide>
          ))}
        </Swiper>
        {list.length > 1 && (
          <div className="absolute right-4 bottom-4 z-10 flex items-center gap-2">
            <span className="rounded-lg border border-ln bg-bg px-2.5 py-1.5 font-mono text-xs">
              {index + 1} / {list.length}
            </span>
            <button type="button" aria-label="Previous photo" onClick={() => main?.slidePrev()} className="icon-btn bg-bg">
              <ArrowLeft size={16} />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => main?.slideNext()} className="icon-btn bg-bg">
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      {list.length > 1 && (
        <Swiper modules={[Thumbs]} onSwiper={setThumbs} watchSlidesProgress slidesPerView={3.2} spaceBetween={12} breakpoints={{ 640: { slidesPerView: 5 } }}>
          {list.map((src, i) => (
            <SwiperSlide key={`t-${src}-${i}`}>
              <button
                type="button"
                aria-label={`Show photo ${i + 1}`}
                className={`block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border-2 ${i === index ? "border-acc" : "border-transparent opacity-70"}`}
              >
                <StudioImage src={src} alt="" className="h-full w-full" label={false} />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
