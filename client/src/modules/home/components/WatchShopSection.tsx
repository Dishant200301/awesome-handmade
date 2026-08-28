import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination, Navigation, Mousewheel, FreeMode } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Sparkles } from "lucide-react";
import ReelCard, { ReelItem } from "./ReelCard";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const REELS: ReelItem[] = [
  {
    id: 1,
    title: "Bead Craft & Latkan Making",
    description: "Handmade Saree Kuchu & Mirror Latkan Craft ✨🪡 #shorts",
    views: "18.4K",
    likes: 420,
    img: "/images/home/reels/latkan-bead-craft.webp",
    video: "/images/home/reels/latkan-bead-craft.mp4",
    brand: "Awesome Handmade",
    relatedProduct: {
      name: "Handmade Mirror Latkan Pair",
      price: "₹499",
      img: "/images/home/reels/latkan-bead-craft.webp",
      link: "/shop?category=latkan",
    },
  },
  {
    id: 2,
    title: "Woolen Latkan & Saree Kuchu Craft",
    description: "Artisan Woolen Latkan & Sewing Hacks 🌸🪡 #shorts",
    views: "24.1K",
    likes: 580,
    img: "/images/home/reels/woolen-latkan-craft.webp",
    video: "/images/home/reels/woolen-latkan-craft.mp4",
    brand: "Awesome Handmade",
    relatedProduct: {
      name: "Woolen Designer Latkan Pair",
      price: "₹399",
      img: "/images/home/reels/woolen-latkan-craft.webp",
      link: "/shop?category=latkan",
    },
  },
  {
    id: 3,
    title: "Tricolor Tassel Latkan Making",
    description: "Festive Tricolor Silk Tassel Latkan 🇮🇳✨ #shorts",
    views: "15.9K",
    likes: 310,
    img: "/images/home/reels/tricolor-tassel-latkan.webp",
    video: "/images/home/reels/tricolor-tassel-latkan.mp4",
    brand: "Awesome Handmade",
    relatedProduct: {
      name: "Tricolor Silk Tassel Pair",
      price: "₹349",
      img: "/images/home/reels/tricolor-tassel-latkan.webp",
      link: "/shop?category=latkan",
    },
  },
  {
    id: 4,
    title: "Mirror Craft & Waist Belt Making",
    description: "Double Side Mirror Belt Craft Idea 💃✨ #shorts",
    views: "32.6K",
    likes: 890,
    img: "/images/home/reels/mirror-craft-belt.webp",
    video: "/images/home/reels/mirror-craft-belt.mp4",
    brand: "Awesome Handmade",
    relatedProduct: {
      name: "Handcrafted Mirror Waist Belt",
      price: "₹549",
      img: "/images/home/reels/mirror-craft-belt.webp",
      link: "/shop?category=waist-belt",
    },
  },
  {
    id: 5,
    title: "Couple Rakhi Making at Home",
    description: "Handcrafted Couple Rakhi Making Idea 💑🎀 #shorts",
    views: "19.2K",
    likes: 440,
    img: "/images/home/reels/couple-rakhi-making.webp",
    video: "/images/home/reels/couple-rakhi-making.mp4",
    brand: "Awesome Handmade",
    relatedProduct: {
      name: "Festive Couple Rakhi Set",
      price: "₹299",
      img: "/images/home/reels/couple-rakhi-making.webp",
      link: "/shop?category=bracelet",
    },
  },
  {
    id: 6,
    title: "Wool Flower & Hairband Craft",
    description: "Floral Hairband & Hair Accessories Craft 🌺🎀 #shorts",
    views: "11.7K",
    likes: 265,
    img: "/images/home/reels/flower-hairband-craft.webp",
    video: "/images/home/reels/flower-hairband-craft.mp4",
    brand: "Awesome Handmade",
    relatedProduct: {
      name: "Handmade Floral Hair Band",
      price: "₹249",
      img: "/images/home/reels/flower-hairband-craft.webp",
      link: "/shop?category=hair-accessories",
    },
  },
  {
    id: 7,
    title: "Easy Dupatta Tassel & Fabric Latkan",
    description: "Easy Dupatta Tassel Idea & Fabric Latkan 🌸✨ #shorts",
    views: "14.3K",
    likes: 330,
    img: "/images/home/reels/dupatta-tassel-latkan.webp",
    video: "/images/home/reels/dupatta-tassel-latkan.mp4",
    brand: "Awesome Handmade",
    relatedProduct: {
      name: "Artisan Fabric Dupatta Tassels",
      price: "₹299",
      img: "/images/home/reels/dupatta-tassel-latkan.webp",
      link: "/shop?category=latkan",
    },
  },
  {
    id: 8,
    title: "Festive Handmade Rakhi Making",
    description: "Festive Handmade Rakhi Gift Idea 🎁✨ #shorts",
    views: "21.0K",
    likes: 512,
    img: "/images/home/reels/festive-rakhi-making.webp",
    video: "/images/home/reels/festive-rakhi-making.mp4",
    brand: "Awesome Handmade",
    relatedProduct: {
      name: "Artisan Rakhi Gift Hamper",
      price: "₹599",
      img: "/images/home/reels/festive-rakhi-making.webp",
      link: "/shop?category=gift-hamper",
    },
  },
];

export default function WatchShopSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    const p = swiper.progress || 0;
    setActiveDot(Math.min(3, Math.max(0, Math.round(p * 3))));
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    const p = swiper.progress || 0;
    setActiveDot(Math.min(3, Math.max(0, Math.round(p * 3))));
  };

  const handleDotClick = (index: number) => {
    if (!swiperRef.current) return;
    const targetProgress = index / 3;
    swiperRef.current.setProgress(targetProgress, 400);
    setActiveDot(index);
    setIsBeginning(swiperRef.current.isBeginning);
    setIsEnd(swiperRef.current.isEnd);
  };

  return (
    <section className="bg-[#FAF8F4] py-16 md:py-24 border-t border-[#EDE5DA] overflow-hidden w-full">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-2.5 px-3.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-maroon shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase">
            Artisan Reels
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold tracking-tight text-brand-maroon uppercase">
          WATCH &amp; SHOP HANDMADE
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-brand-ink/75 max-w-lg mx-auto font-light leading-relaxed">
          Discover behind the scenes, craft making, and styling guides directly from our artisans
        </p>
      </div>

      {/* Carousel Container - Left and Right padding/margin across all devices */}
      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 group/carousel">
        {/* Swiper Slider */}
        <Swiper
          modules={[Pagination, Navigation, Mousewheel, FreeMode]}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          onProgress={(swiper, p) => {
            setActiveDot(Math.min(3, Math.max(0, Math.round(p * 3))));
          }}
          grabCursor={true}
          simulateTouch={true}
          touchRatio={1.2}
          resistanceRatio={0.85}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.8,
            momentumVelocityRatio: 0.8,
            sticky: false,
          }}
          speed={400}
          mousewheel={{
            forceToAxis: true,
            releaseOnEdges: true,
            sensitivity: 1,
          }}
          slidesPerView={1.25}
          centeredSlides={true}
          spaceBetween={14}
          breakpoints={{
            0: {
              slidesPerView: 1.25,
              centeredSlides: true,
              spaceBetween: 14,
              freeMode: {
                enabled: true,
                momentum: true,
                sticky: false,
              },
            },
            640: {
              slidesPerView: 2.5,
              centeredSlides: false,
              spaceBetween: 18,
              freeMode: {
                enabled: true,
                momentum: true,
                sticky: false,
              },
            },
            1024: {
              slidesPerView: 4,
              centeredSlides: false,
              spaceBetween: 20,
              freeMode: {
                enabled: true,
                momentum: true,
                sticky: false,
              },
            },
            1280: {
              slidesPerView: 5,
              centeredSlides: false,
              spaceBetween: 20,
              freeMode: {
                enabled: true,
                momentum: true,
                sticky: false,
              },
            },
          }}
          className="w-full pb-4 !overflow-hidden"
        >
          {REELS.map((reel) => (
            <SwiperSlide key={reel.id}>
              <ReelCard r={reel} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Left Arrow (Disappears when at the beginning) */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className={`absolute left-1.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-brand-gold/30 text-brand-maroon shadow-lg flex items-center justify-center hover:bg-brand-maroon hover:text-white transition-all duration-300 cursor-pointer ${
            isBeginning
              ? "opacity-0 pointer-events-none scale-75"
              : "opacity-100 scale-100"
          }`}
          aria-label="Previous reel"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* Right Arrow (Disappears when at the end) */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className={`absolute right-1.5 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-brand-gold/30 text-brand-maroon shadow-lg flex items-center justify-center hover:bg-brand-maroon hover:text-white transition-all duration-300 cursor-pointer ${
            isEnd
              ? "opacity-0 pointer-events-none scale-75"
              : "opacity-100 scale-100"
          }`}
          aria-label="Next reel"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Simple 4-Dot Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8 select-none">
        {[0, 1, 2, 3].map((index) => {
          const isActive = activeDot === index;
          return (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "w-7 bg-brand-maroon shadow-xs"
                  : "w-2.5 bg-brand-gold/35 hover:bg-brand-maroon/50"
              }`}
              aria-label={`Go to slide section ${index + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
