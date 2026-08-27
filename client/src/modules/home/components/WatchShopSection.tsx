import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ReelCard from "./ReelCard";
import { Sparkles } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const REELS = [
  {
    title: "Mirror Latkan Making",
    views: "15.4K",
    likes: 340,
    img: "/images/category/Latkan.webp",
    video: "https://www.youtube.com/watch?v=mUhOAuy-Oek",
    relatedProduct: { name: "Handmade Mirror Latkan Pair", price: "₹499", img: "/images/category/Latkan.webp", link: "/shop?category=latkan" }
  },
  {
    title: "Gift Hamper Unboxing",
    views: "12.8K",
    likes: 280,
    img: "/images/category/Gift Hamper.webp",
    video: "https://www.youtube.com/watch?v=mUhOAuy-Oek",
    relatedProduct: { name: "Festive Keychain Gift Hamper", price: "₹599", img: "/images/category/Gift Hamper.webp", link: "/shop?category=gift-hamper" }
  },
  {
    title: "Statement Earrings Drop",
    views: "9.1K",
    likes: 212,
    img: "/images/category/Earrings.webp",
    video: "https://www.youtube.com/watch?v=mUhOAuy-Oek",
    relatedProduct: { name: "Handcrafted Mirror Earrings", price: "₹349", img: "/images/category/Earrings.webp", link: "/shop?category=earrings" }
  },
  {
    title: "Festive Choli Styling",
    views: "8.5K",
    likes: 196,
    img: "/images/category/Choli.webp",
    video: "https://www.youtube.com/watch?v=mUhOAuy-Oek",
    relatedProduct: { name: "Embroidered Kids & Adult Choli", price: "₹899", img: "/images/category/Choli.webp", link: "/shop?category=choli" }
  },
  {
    title: "Heritage Necklaces",
    views: "6.7K",
    likes: 154,
    img: "/images/category/Necklace.webp",
    video: "https://www.youtube.com/watch?v=mUhOAuy-Oek",
    relatedProduct: { name: "Beaded Heritage Necklace Set", price: "₹799", img: "/images/category/Necklace.webp", link: "/shop?category=necklace" }
  },
  {
    title: "Behind The Scenes Macrame",
    views: "5.8K",
    likes: 128,
    img: "/images/grace_every_thread.jpg",
    video: "https://www.youtube.com/watch?v=mUhOAuy-Oek",
    relatedProduct: { name: "Artisan Macrame Wall Hanging", price: "₹849", img: "/images/grace_every_thread.jpg", link: "/shop?category=macrame-hanging" }
  },
];

export default function WatchShopSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".reel-card", {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-[#FAF8F4] py-16 md:py-24 overflow-hidden border-t border-[#EDE5DA]">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-maroon">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase">Artisan Reels</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold tracking-tight text-brand-maroon uppercase">
          WATCH & SHOP HANDMADE
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-brand-ink/70 max-w-lg mx-auto font-light">
          See the making, styling, and real customer unboxings directly from our studio
        </p>
      </div>

      {/* MOBILE & TABLET SLIDER VIEW: visible on < lg */}
      <div className="relative block lg:hidden px-4 lg:px-12 max-w-[800px] mx-auto">
        <Swiper
          modules={[Pagination, Navigation]}
          grabCursor
          loop={true}
          speed={600}
          autoplay={false}
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 24 }
          }}
          pagination={{ clickable: true, el: ".reels-pagination", bulletClass: "reels-bullet", bulletActiveClass: "reels-bullet-active" }}
          navigation={{ prevEl: ".reels-prev", nextEl: ".reels-next" }}
          className="w-full pb-6"
        >
          {REELS.map((r, i) => (
            <SwiperSlide key={i}>
              <ReelCard r={r} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <button className="reels-prev absolute left-6 md:left-2 top-[calc(50%-24px)] -translate-y-1/2 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/90 border border-brand-gold/30 text-brand-maroon shadow-md hover:bg-brand-maroon hover:text-white transition-all duration-300 cursor-pointer">
          <FiChevronLeft size={20} />
        </button>
        <button className="reels-next absolute right-6 md:right-2 top-[calc(50%-24px)] -translate-y-1/2 z-30 grid h-10 w-10 place-items-center rounded-full bg-white/90 border border-brand-gold/30 text-brand-maroon shadow-md hover:bg-brand-maroon hover:text-white transition-all duration-300 cursor-pointer">
          <FiChevronRight size={20} />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="reels-pagination flex justify-center gap-2 mt-4" />
      </div>

      {/* DESKTOP FLEX VIEW: visible on >= lg */}
      <div className="hidden lg:flex no-scrollbar gap-5 overflow-x-auto snap-x scroll-smooth px-5 md:px-8 max-w-[1500px] mx-auto justify-center">
        {REELS.map((r, i) => (
          <ReelCard key={i} r={r} />
        ))}
      </div>
    </section>
  );
}
