import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";

export default function CuratedEditSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);

  const cards = [
    {
      price: "199",
      img: "/images/category/Earrings.webp",
      borderColor: "border-brand-maroon",
      textColor: "text-brand-maroon",
      lineColor: "bg-brand-maroon",
    },
    {
      price: "299",
      img: "/images/category/Latkan.webp",
      borderColor: "border-brand-gold",
      textColor: "text-brand-maroon",
      lineColor: "bg-brand-gold",
    },
    {
      price: "499",
      img: "/images/category/Necklace.webp",
      borderColor: "border-brand-maroon",
      textColor: "text-brand-maroon",
      lineColor: "bg-brand-maroon",
    },
    {
      price: "999",
      img: "/images/category/Choli.webp",
      borderColor: "border-brand-gold",
      textColor: "text-brand-maroon",
      lineColor: "bg-brand-gold",
    },
  ];

  return (
    <section id="curated-edit" className="bg-white py-8 md:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Mobile View (Matches reference image) */}
        <div className="block md:hidden">
          {/* Mobile Section Title with Flanking Lines */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-[1.5px] w-8 sm:w-12 bg-[#e06b47]" />
            <h2 className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-[#1b3d32] uppercase">
              UNDER COLLECTION
            </h2>
            <span className="h-[1.5px] w-8 sm:w-12 bg-[#e06b47]" />
          </div>

          {/* Swiper Carousel for Cards */}
          <Swiper
            onSwiper={setSwiperRef}
            spaceBetween={12}
            slidesPerView={2.5}
            breakpoints={{
              480: { slidesPerView: 1.25, spaceBetween: 14 },
              640: { slidesPerView: 1.6, spaceBetween: 16 },
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full !py-2"
          >
            {cards.map((c, i) => (
              <SwiperSlide key={i}>
                <div
                  className={`flex flex-col bg-[#e3f0ec] rounded-[26px] border-[4px] ${c.borderColor} overflow-hidden shadow-sm select-none`}
                >
                  {/* Top: Image Frame */}
                  <div className="relative w-full aspect-[4/4.5] overflow-hidden bg-white">
                    {/* Brand mark for 3rd card as seen in reference */}
                    {i === 2 && (
                      <div className="absolute top-2 left-2.5 z-10 text-[#2e5d4e] font-semibold text-[13px] tracking-tight opacity-90 leading-none">
                        A
                      </div>
                    )}
                    <img
                      src={c.img}
                      alt={`Under ${c.price} Store`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom: Price & Badge Content */}
                  <div className="flex flex-col items-center justify-center py-3.5 px-2 bg-[#e3f0ec]">
                    {/* UNDER badge with flanking lines */}
                    <div className="flex items-center justify-center gap-2 w-full max-w-[130px] mb-1">
                      <span className={`h-[1.5px] w-5 ${c.lineColor}`} />
                      <span
                        className={`text-[10px] font-black tracking-[0.2em] uppercase ${c.textColor}`}
                      >
                        UNDER
                      </span>
                      <span className={`h-[1.5px] w-5 ${c.lineColor}`} />
                    </div>

                    {/* Big Price */}
                    <span
                      className={`text-4xl font-black tracking-tight leading-none mt-1 ${c.textColor}`}
                    >
                      {c.price}
                    </span>

                    {/* STORE */}
                    <span
                      className={`text-[10px] font-black tracking-[0.25em] uppercase leading-none mt-1.5 ${c.textColor}`}
                    >
                      STORE
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Indicators */}
          <div className="flex justify-center items-center gap-2 mt-5">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => swiperRef?.slideTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? "w-6 bg-[#1b3d32]"
                    : "w-2.5 bg-[#c5dcd5]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop View (Preserved completely) */}
        <div className="hidden md:block">
          <h2 className="text-center text-lg md:text-xl font-medium tracking-wide text-zinc-800 mb-8 md:mb-10">
            A bucketful of monsoon steals
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
            {cards.map((c, i) => (
              <div
                key={i}
                className={`flex items-center bg-[#d2e7e4] rounded-[20px] border-[5px] sm:border-[6px] ${c.borderColor} overflow-hidden aspect-[2.2/1] sm:aspect-[2.4/1] md:aspect-[2.6/1] lg:aspect-[2.3/1] shadow-sm select-none`}
              >
                {/* Left Side: Image */}
                <div className="w-[45%] h-full relative overflow-hidden">
                  <img
                    src={c.img}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>

                {/* Right Side: Text */}
                <div className="w-[55%] flex flex-col justify-center items-center text-center p-1 sm:p-2">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-extrabold tracking-[0.15em] text-[#1b3d32] uppercase leading-none">
                    UNDER
                  </span>
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-black tracking-normal text-[#1b3d32] uppercase leading-none mt-1 sm:mt-1.5 whitespace-nowrap">
                    {c.price} STORE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

