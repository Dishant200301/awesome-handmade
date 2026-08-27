import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { subscribeToProductStore, getLiveProductsList } from "@/modules/core/lib/apiStore";
import { Sparkles } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

export default function BestSellingSection() {
  const [liveList, setLiveList] = useState(getLiveProductsList);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => setLiveList([...getLiveProductsList()]);
    const unsub = subscribeToProductStore(update);
    return () => unsub();
  }, []);

  const productsList = liveList.map((p) => ({
    id: p.id,
    name: p.name,
    img: p.image || (Array.isArray(p.images) ? p.images[0] : "/images/category/Latkan.webp"),
    tags: p.idealForPills || [p.category || "Handcrafted", "Surat Artisan Craft", "Festive Wear"],
  }));

  if (productsList.length === 0) {
    return null;
  }

  const current = productsList[active % productsList.length] || productsList[0];

  return (
    <section className="bg-[#FAF8F4] py-16 md:py-24 overflow-hidden border-y border-[#EDE5DA]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-maroon">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase">Customer Favourites</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl text-brand-maroon tracking-tight font-bold uppercase">
            TRENDING HANDMADE CREATIONS
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-brand-ink/70 max-w-lg mx-auto font-light">
            Loved by thousands of brides and festival celebrants across India
          </p>
        </div>

        <div className="relative px-2 sm:px-12 md:px-6 lg:px-10">
          <Swiper
            modules={[Autoplay, Navigation]}
            grabCursor
            centeredSlides={true}
            loop={productsList.length > 1}
            speed={700}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            slidesPerView={1}
            spaceBetween={0}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 0, centeredSlides: true },
              768: { slidesPerView: 1, spaceBetween: 0, centeredSlides: true },
              1024: { slidesPerView: Math.min(3, productsList.length), spaceBetween: 36, centeredSlides: true },
            }}
            navigation={{ prevEl: ".bs-prev", nextEl: ".bs-next" }}
            onSlideChange={(sw) => setActive(sw.realIndex)}
            className="buzz-swiper py-8! max-lg:overflow-hidden lg:overflow-visible"
          >
            {productsList.map((p) => (
              <SwiperSlide key={p.id}>
                {({ isActive }) => (
                  <div className={`relative aspect-3/4 overflow-hidden rounded-[26px] md:rounded-[32px] bg-[#EDE5DA] shadow-md transition-all duration-500 origin-center ${
                    isActive ? "scale-100 opacity-100 shadow-2xl ring-2 ring-brand-gold/40" : "scale-[0.88] opacity-[0.45]"
                  }`}>
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          <button
            aria-label="Previous"
            className="bs-prev absolute left-0 lg:-left-4 top-1/2 -translate-y-1/2 z-30 grid h-10 w-10 place-items-center rounded-full border border-brand-gold/30 bg-white text-brand-maroon shadow-md hover:bg-brand-maroon hover:text-white transition-all duration-300 cursor-pointer"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            aria-label="Next"
            className="bs-next absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 z-30 grid h-10 w-10 place-items-center rounded-full border border-brand-gold/30 bg-white text-brand-maroon shadow-md hover:bg-brand-maroon hover:text-white transition-all duration-300 cursor-pointer"
          >
            <FiChevronRight size={18} />
          </button>
        </div>

        {/* Dynamic product info below Swiper */}
        {current && (
          <div className="mt-8 text-center max-w-xl mx-auto px-4">
            <h3 className="font-heading text-lg md:text-xl font-bold text-brand-ink leading-snug">
              {current.name}
            </h3>
            <div className="mt-3.5 flex flex-wrap justify-center gap-2">
              {(current.tags || []).map((tag: string, idx: number) => (
                <span key={idx} className="rounded-full bg-brand-gold/15 text-brand-maroon border border-brand-gold/30 px-4 py-1 text-[11px] font-bold tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
