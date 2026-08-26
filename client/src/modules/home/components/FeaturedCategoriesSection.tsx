import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface CategoryItem {
  key: string;
  name: string;
  image: string;
}

const CATEGORIES_CIRCULAR: CategoryItem[] = [
  { key: "earrings", name: "Earrings", image: "/images/category/Earrings.webp" },
  { key: "necklace", name: "Necklace", image: "/images/category/Necklace.webp" },
  { key: "latkan", name: "Latkan", image: "/images/category/Latkan.webp" },
  { key: "choli", name: "Choli", image: "/images/category/Choli.webp" },
  { key: "gift_hamper", name: "Gift Hamper", image: "/images/category/Gift Hamper.webp" },
  { key: "bracelet", name: "Bracelet", image: "/images/category/Bracelet.webp" },
  { key: "anklet", name: "Anklet", image: "/images/category/Anklet.webp" },
  { key: "tassel", name: "Tassel", image: "/images/category/Tassel.webp" },
  { key: "waist_belt", name: "Waist Belt", image: "/images/category/Waist Belt.webp" },
  { key: "watch", name: "Watch", image: "/images/category/Watch.webp" },
  { key: "krishna_outfit", name: "Krishna Outfit", image: "/images/category/Krishna outfit.webp" },
  { key: "macrame", name: "Macrame Art", image: "/images/grace_every_thread.jpg" },
  { key: "bras", name: "Everyday Bras", image: "/images/home/sports_bra.png" },
  { key: "shapewear", name: "Shapewear", image: "/images/home/shapewear.png" },
  { key: "panties", name: "Cotton Panties", image: "/images/home/panties.png" },
  { key: "sets", name: "Athleisure", image: "/images/home/athleisure.png" },
];

const FEATURED_CURATED_GRID = [
  {
    key: "latkan",
    title: "MIRROR LATKAN",
    subtitle: "Exquisite handmade mirror latkans and tassels for festive blouses & lehengas",
    tag: "SHOP LATKANS",
    img: "/images/category/Latkan.webp",
    badge: "Trending",
  },
  {
    key: "necklace",
    title: "HERITAGE JEWELLERY",
    subtitle: "Artisan handcrafted necklaces and mirror jewellery sets for celebrations",
    tag: "EXPLORE JEWELLERY",
    img: "/images/category/Necklace.webp",
    badge: "Best Seller",
  },
  {
    key: "choli",
    title: "FESTIVE CHOLI",
    subtitle: "Embroidered and mirror-work traditional cholis for kids and adults",
    tag: "SHOP CHOLI",
    img: "/images/category/Choli.webp",
    badge: "New Arrival",
  },
  {
    key: "gift_hamper",
    title: "GIFT HAMPERS",
    subtitle: "Thoughtfully curated festive hampers with macrame keychains & keepsakes",
    tag: "VIEW HAMPERS",
    img: "/images/category/Gift Hamper.webp",
    badge: "Gift Special",
  },
  {
    key: "earrings",
    title: "STATEMENT EARRINGS",
    subtitle: "Lightweight handcrafted mirror & beaded earrings for every occasion",
    tag: "SHOP EARRINGS",
    img: "/images/category/Earrings.webp",
    badge: "Most Loved",
  },
  {
    key: "traditional",
    title: "TRADITIONAL EDIT",
    subtitle: "Timeless handcrafted creations celebrating India's rich festive heritage",
    tag: "EXPLORE TRADITION",
    img: "/images/hero_twirl_tradition.jpg",
    badge: "Artisan Craft",
  },
];

interface FeaturedCategoriesProps {
  onSelectCategory?: (key: string) => void;
}

export default function FeaturedCategoriesSection({ onSelectCategory }: FeaturedCategoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(6);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const startX = useRef<number>(0);
  const isMouseDown = useRef<boolean>(false);
  const hasMoved = useRef<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      let count = 6;
      if (w < 640) {
        count = 3;
      } else if (w < 1024) {
        count = 4;
      } else if (w < 1280) {
        count = 5;
      }
      setItemsVisible(count);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, CATEGORIES_CIRCULAR.length - itemsVisible);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsVisible, maxIndex, currentIndex]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isMouseDown.current = true;
    hasMoved.current = false;
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMouseDown.current) return;
    const diff = e.touches[0].clientX - startX.current;
    if (Math.abs(diff) > 5) {
      hasMoved.current = true;
    }
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    setIsDragging(false);

    if (dragOffset < -35) {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    } else if (dragOffset > 35) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
    setDragOffset(0);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    hasMoved.current = false;
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 5) {
      hasMoved.current = true;
    }
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    setIsDragging(false);

    if (dragOffset < -35) {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    } else if (dragOffset > 35) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isMouseDown.current) {
      handleMouseUp();
    }
  };

  const handleCategoryClick = (e: React.MouseEvent, key: string) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(key);
      const featuredSection = document.getElementById("featured");
      if (featuredSection) {
        const headerOffset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = featuredSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  return (
    <section id="categories" className="py-14 md:py-24 bg-[#FFFDF9] border-b border-zinc-200/80 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-[#80a17d]/15 border border-[#80a17d]/30 text-[#2e5d4e]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase">Comfort Essentials</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 uppercase">
            SHOP BY CATEGORY
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto font-light">
            Wire-free and zero-feel intimates tailored for every body and routine
          </p>
        </div>

        {/* 1-by-1 Continuous Sliding Track for Circular Category Icons */}
        <div
          className={`relative overflow-hidden w-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex w-full"
            style={{
              transform: `translateX(calc(-${currentIndex * (100 / itemsVisible)}% + ${dragOffset}px))`,
              transition: isDragging ? "none" : "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {CATEGORIES_CIRCULAR.map((cat) => (
              <div
                key={cat.key}
                style={{ width: `${100 / itemsVisible}%` }}
                className="shrink-0 px-1.5 sm:px-2 md:px-3 select-none"
              >
                <a
                  href="#featured"
                  onClick={(e) => handleCategoryClick(e, cat.key)}
                  className="group flex flex-col items-center text-center cursor-pointer pointer-events-auto"
                  draggable={false}
                >
                  <div className="relative aspect-square w-full max-w-[110px] sm:max-w-[135px] md:max-w-[150px] mx-auto rounded-full overflow-hidden bg-white shadow-xs border border-zinc-200 group-hover:shadow-lg group-hover:border-[#2e5d4e] transition-all duration-300">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center rounded-full group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-[#2e5d4e]/0 group-hover:bg-[#2e5d4e]/10 rounded-full transition-colors duration-300" />
                  </div>

                  <h3 className="mt-2.5 sm:mt-3 text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-[#2e5d4e] transition-colors text-center leading-tight line-clamp-2">
                    {cat.name}
                  </h3>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Pagination Dots */}
        <div className="flex items-center justify-center mt-6 md:mt-8 mb-14 md:mb-20">
          {[...Array(5)].map((_, idx) => {
            const activeDotIndex = maxIndex > 0 ? Math.min(4, Math.round((currentIndex / maxIndex) * 4)) : 0;
            const isActive = idx === activeDotIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const targetIndex = maxIndex > 0 ? Math.round((idx / 4) * maxIndex) : 0;
                  setCurrentIndex(targetIndex);
                }}
                className="relative flex items-center justify-center focus:outline-none transition-all duration-300 cursor-pointer p-1"
                aria-label={`Go to category position ${idx + 1}`}
              >
                {isActive ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#2e5d4e] transition-all duration-300 scale-105">
                    <span className="h-2 w-2 rounded-full bg-[#2e5d4e]" />
                  </div>
                ) : (
                  <div className="flex h-4 w-4 items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 hover:bg-zinc-500 transition-colors" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* FEATURED CURATED BENTO GRID */}
        <div className="pt-6 border-t border-zinc-200/80">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-[#2e5d4e]">
              CURATED INTIMATES EDIT
            </p>
            <h3 className="mt-1 font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
              Signature Collection Highlights
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {FEATURED_CURATED_GRID.map((feat) => (
              <a
                key={feat.key}
                href="#featured"
                onClick={(e) => handleCategoryClick(e, feat.key)}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/5] bg-[#F5F2EE] shadow-md hover:shadow-2xl transition-all duration-500 border border-black/5 block"
              >
                <img
                  src={feat.img}
                  alt={feat.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300" />

                {feat.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/90 text-zinc-900 backdrop-blur-md shadow-xs">
                      {feat.badge}
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8 flex flex-col items-start text-left z-10">
                  <h4 className="font-heading text-xl sm:text-2xl font-bold tracking-wider uppercase text-white leading-tight">
                    {feat.title}
                  </h4>
                  <p className="mt-1 text-xs text-white/85 line-clamp-2 max-w-[280px]">
                    {feat.subtitle}
                  </p>
                  
                  <div className="mt-4 inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#a2c39f] group-hover:text-white uppercase transition-colors">
                    <span>{feat.tag}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
