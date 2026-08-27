import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BentoItem {
  id: string;
  image: string;
  slug: string;
  alt: string;
}

const BENTO_ITEMS: BentoItem[] = [
  {
    id: "choli",
    image: "/images/home/Bento Grid/Choli.png",
    slug: "choli",
    alt: "Handmade Choli",
  },
  {
    id: "jewellery",
    image: "/images/home/Bento Grid/Jewellery.png",
    slug: "necklace",
    alt: "Handmade Jewellery",
  },
  {
    id: "latkan",
    image: "/images/home/Bento Grid/Latkan.png",
    slug: "latkan",
    alt: "Handmade Latkan",
  },
  {
    id: "tassel",
    image: "/images/home/Bento Grid/Tassel.png",
    slug: "tassel",
    alt: "Handmade Tassel",
  },
  {
    id: "watch",
    image: "/images/home/Bento Grid/Watch.png",
    slug: "watch",
    alt: "Handmade Watch",
  },
  {
    id: "hair-accessories",
    image: "/images/home/Bento Grid/Hair Accessories.png",
    slug: "hair-accessories",
    alt: "Handmade Hair Accessories",
  },
];

export default function BentoGridSection() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full py-6 sm:py-10 md:py-12 lg:py-16">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-5 sm:mb-7 md:mb-9 lg:mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[34px] lg:text-4xl font-bold tracking-[0.1em] text-brand-maroon uppercase">
            EXPLORE OUR CATEGORIES
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP, LAPTOP & TABLET VIEW: Exact 1:1 Aspect Ratio (Zero Crop)        */}
        {/* ========================================================================= */}
        <div className="hidden md:flex md:flex-row gap-3.5 sm:gap-4 lg:gap-5 items-stretch w-full">
          {/* LEFT COLUMN: ~35% width */}
          <div className="w-[35%] flex flex-col gap-3.5 sm:gap-4 lg:gap-5 justify-between shrink-0">
            {/* Choli Card (Exact Aspect 1098x1740) */}
            <Link
              to="/shop?category=choli"
              className="group relative w-full aspect-[1098/1740] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 block isolate [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)] cursor-pointer"
            >
              <img
                src="/images/home/Bento Grid/Choli.png"
                alt="Handmade Choli"
                className="w-full h-full object-cover object-center rounded-2xl lg:rounded-3xl group-hover:scale-104 transition-transform duration-700 ease-out will-change-transform pointer-events-none"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-black/0 group-hover:bg-black/8 transition-colors duration-300 pointer-events-none" />
            </Link>

            {/* Watch Card (Exact Aspect 826x832) */}
            <Link
              to="/shop?category=watch"
              className="group relative w-full aspect-[826/832] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 block isolate [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)] cursor-pointer"
            >
              <img
                src="/images/home/Bento Grid/Watch.png"
                alt="Handmade Watch"
                className="w-full h-full object-cover object-center rounded-2xl lg:rounded-3xl group-hover:scale-104 transition-transform duration-700 ease-out will-change-transform pointer-events-none"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-black/0 group-hover:bg-black/8 transition-colors duration-300 pointer-events-none" />
            </Link>
          </div>

          {/* RIGHT COLUMN: ~65% width */}
          <div className="w-[65%] flex flex-col gap-3.5 sm:gap-4 lg:gap-5 justify-between shrink-0">
            {/* Jewellery Card (Exact Aspect 1732x830) */}
            <Link
              to="/shop?category=necklace"
              className="group relative w-full aspect-[1732/830] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 block isolate [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)] cursor-pointer"
            >
              <img
                src="/images/home/Bento Grid/Jewellery.png"
                alt="Handmade Jewellery"
                className="w-full h-full object-cover object-center rounded-2xl lg:rounded-3xl group-hover:scale-104 transition-transform duration-700 ease-out will-change-transform pointer-events-none"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-black/0 group-hover:bg-black/8 transition-colors duration-300 pointer-events-none" />
            </Link>

            {/* Middle Row: Latkan & Tassel (Exact Aspects 826x830 each) */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5">
              {/* Latkan */}
              <Link
                to="/shop?category=latkan"
                className="group relative w-full aspect-[826/830] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 block isolate [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)] cursor-pointer"
              >
                <img
                  src="/images/home/Bento Grid/Latkan.png"
                  alt="Handmade Latkan"
                  className="w-full h-full object-cover object-center rounded-2xl lg:rounded-3xl group-hover:scale-104 transition-transform duration-700 ease-out will-change-transform pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-black/0 group-hover:bg-black/8 transition-colors duration-300 pointer-events-none" />
              </Link>

              {/* Tassel */}
              <Link
                to="/shop?category=tassel"
                className="group relative w-full aspect-[826/830] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 block isolate [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)] cursor-pointer"
              >
                <img
                  src="/images/home/Bento Grid/Tassel.png"
                  alt="Handmade Tassel"
                  className="w-full h-full object-cover object-center rounded-2xl lg:rounded-3xl group-hover:scale-104 transition-transform duration-700 ease-out will-change-transform pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-black/0 group-hover:bg-black/8 transition-colors duration-300 pointer-events-none" />
              </Link>
            </div>

            {/* Hair Accessories Card (Exact Aspect 2004x832) */}
            <Link
              to="/shop?category=hair-accessories"
              className="group relative w-full aspect-[2004/832] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 block isolate [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)] cursor-pointer"
            >
              <img
                src="/images/home/Bento Grid/Hair Accessories.png"
                alt="Handmade Hair Accessories"
                className="w-full h-full object-cover object-center rounded-2xl lg:rounded-3xl group-hover:scale-104 transition-transform duration-700 ease-out will-change-transform pointer-events-none"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-black/0 group-hover:bg-black/8 transition-colors duration-300 pointer-events-none" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW: 1 Slide Carousel with Navigation Arrows & Pagination Dots   */}
        {/* ========================================================================= */}
        <div className="block md:hidden relative w-full">
          <div className="relative">
            {/* Swiper Slider: 1 Slide per View */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              onSwiper={setSwiperInstance}
              slidesPerView={1}
              spaceBetween={16}
              loop={true}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="w-full"
            >
              {BENTO_ITEMS.map((item) => (
                <SwiperSlide key={item.id}>
                  {/* Uniform Same Card Ratio across all slides in mobile */}
                  <Link
                    to={`/shop?category=${item.slug}`}
                    className="relative w-full aspect-[4/4.4] sm:aspect-square max-h-[380px] rounded-2xl overflow-hidden shadow-md block active:scale-[0.99] transition-transform duration-200 isolate [transform:translateZ(0)] [mask-image:-webkit-radial-gradient(white,black)] cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover object-center rounded-2xl pointer-events-none"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/0 active:bg-black/8 transition-colors duration-200 pointer-events-none" />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Left Navigation Arrow Button - Vertically Centered on Left */}
            <button
              onClick={() => swiperInstance?.slidePrev()}
              aria-label="Previous category"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md text-brand-maroon flex items-center justify-center hover:bg-white active:scale-95 transition-all duration-200 border border-black/10 cursor-pointer"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>

            {/* Right Navigation Arrow Button - Vertically Centered on Right */}
            <button
              onClick={() => swiperInstance?.slideNext()}
              aria-label="Next category"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md text-brand-maroon flex items-center justify-center hover:bg-white active:scale-95 transition-all duration-200 border border-black/10 cursor-pointer"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Bottom Pagination Dots - Horizontally Centered */}
          <div className="flex justify-center items-center gap-2 mt-5">
            {BENTO_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => swiperInstance?.slideToLoop(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? "w-7 bg-brand-maroon"
                    : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
