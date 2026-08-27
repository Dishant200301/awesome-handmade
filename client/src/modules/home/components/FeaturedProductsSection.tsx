import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { CATEGORY_TABS } from "../lib/products";
import ProductCard from "./ProductCard";
import { subscribeToProductStore, getLiveProductsList } from "@/modules/core/lib/apiStore";
import { Sparkles } from "lucide-react";

import "swiper/css";

interface FeaturedProps {
  activeTab?: string;
  setActiveTab?: (t: string) => void;
}

export default function FeaturedProductsSection({ activeTab, setActiveTab }: FeaturedProps) {
  const [localTab, setLocalTab] = useState("all");
  const tab = activeTab !== undefined ? activeTab : localTab;
  const setTab = setActiveTab !== undefined ? setActiveTab : setLocalTab;

  const [liveList, setLiveList] = useState(getLiveProductsList);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);

  useEffect(() => {
    const update = () => setLiveList([...getLiveProductsList()]);
    const unsub = subscribeToProductStore(update);
    return () => unsub();
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".prod-card", {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" }
      });
    }, ref);
    return () => ctx.revert();
  }, [tab, liveList]);

  // Dynamic products from live store matching Awesome Handmade catalog
  const filteredProducts = liveList
    .filter((lp) => {
      if (!tab || tab === "all") return true;
      const catSlug = (lp.categorySlug || lp.category || "").toLowerCase();
      const name = (lp.name || "").toLowerCase();
      if (tab === "latkan") return catSlug.includes("latkan") || catSlug.includes("tassel") || name.includes("latkan");
      if (tab === "earrings") return catSlug.includes("earring") || catSlug.includes("jhumka") || name.includes("earring");
      if (tab === "choli") return catSlug.includes("choli") || name.includes("choli");
      if (tab === "gift-hamper") return catSlug.includes("gift") || catSlug.includes("hamper") || catSlug.includes("keychain");
      if (tab === "necklace") return catSlug.includes("necklace") || name.includes("necklace");
      if (tab === "bracelet") return catSlug.includes("bracelet") || catSlug.includes("anklet") || catSlug.includes("payal");
      return catSlug.includes(tab);
    })
    .map((lp) => ({
      id: lp.id,
      code: lp.defaultSku || lp.sku || "AWH-001",
      name: lp.name,
      tagline: lp.subtitle || lp.shortDescription || "100% Handcrafted in Surat",
      price: lp.price,
      originalPrice: lp.originalPrice || Math.round(lp.price * 2),
      discountPercentage: lp.discountPercentage || 50,
      image: lp.image || (Array.isArray(lp.images) ? lp.images[0] : "/images/category/Latkan.webp"),
      hoverImage: lp.hoverImage || (Array.isArray(lp.images) && lp.images[1] ? lp.images[1] : lp.image),
      rating: lp.rating || 4.9,
      category: lp.category || "latkan",
    }));

  return (
    <section id="new-arrivals" ref={ref} className="mx-auto max-w-[1500px] px-4 sm:px-6 md:px-8 py-12 md:py-24">
      {/* Top Categories Heading & Category Filter Tabs */}
      <div className="mb-8 md:mb-12 flex flex-col items-center text-center">
        
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-brand-maroon uppercase">
          FEATURED HANDMADE PRODUCTS
        </h2>
       

        {/* Scrollable Category Filter Tabs */}
        <div className="w-full max-w-3xl mt-5 md:mt-8 px-0 overflow-x-auto no-scrollbar">
          <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 min-w-max mx-auto px-4 border-b border-[#EDE5DA]">
            {CATEGORY_TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setActiveIndex(0);
                    swiperRef?.slideTo(0);
                  }}
                  className={`relative pb-3 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive ? "text-brand-maroon font-bold" : "text-brand-ink/60 hover:text-brand-maroon"
                  }`}
                >
                  {t.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-maroon"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Grid Layout (4 Columns) */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {filteredProducts.slice(0, 8).map((product) => (
          <div key={product.id} className="prod-card">
            <ProductCard p={product} />
          </div>
        ))}
      </div>

      {/* Tablet Layout (2 Columns Grid) */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-5">
        {filteredProducts.slice(0, 6).map((product) => (
          <div key={product.id} className="prod-card">
            <ProductCard p={product} />
          </div>
        ))}
      </div>

      {/* Mobile Touch Carousel Layout */}
      <div className="sm:hidden -mx-4 px-4 overflow-hidden">
        <Swiper
          onSwiper={setSwiperRef}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          spaceBetween={16}
          slidesPerView={1.2}
          centeredSlides={false}
          className="w-full pb-6"
        >
          {filteredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="prod-card w-full">
                <ProductCard p={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile Carousel Indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-2">
          {filteredProducts.slice(0, Math.min(filteredProducts.length, 6)).map((_, idx) => (
            <button
              key={idx}
              onClick={() => swiperRef?.slideTo(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === idx ? "w-6 bg-brand-maroon" : "w-1.5 bg-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
