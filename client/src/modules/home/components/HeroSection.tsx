import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface HeroSlideData {
  id: string;
  image: string;
  mobileImage?: string;
  eyebrow: string;
  title: string;
  highlightText?: string;
  subtitle: string;
  buttonText: string;
  link: string;
  tag?: string;
}

const HERO_SLIDES: HeroSlideData[] = [
  {
    id: "slide-1",
    image: "/images/home/hero/hero-1.webp",
    mobileImage: "/images/home/hero/hero-moble-1.png",
    eyebrow: "Aaramly Classic",
    title: "Designed To\nDisappear",
    highlightText: "Zero-Feel Comfort",
    subtitle: "Experience wire-free freedom. A lightweight, seamless fit that goes unnoticed under any outfit.",
    buttonText: "EXPLORE COLLECTION",
    link: "#featured",
    tag: "EVERYDAY ESSENTIALS",
  },
  {
    id: "slide-2",
    image: "/images/home/hero/hero-2.webp",
    mobileImage: "/images/home/hero/hero-moble-2.png",
    eyebrow: "Signature Edit",
    title: "Support Without\nThe Poke",
    highlightText: "Ultra-Soft CloudFit",
    subtitle: "Perfect full-coverage wirefree bras with breathable mesh and cloud-like removable pads.",
    buttonText: "SHOP BEST SELLERS",
    link: "#featured",
    tag: "NEWLY LAUNCHED",
  },
  {
    id: "slide-3",
    image: "/images/home/hero/hero-3.webp",
    mobileImage: "/images/home/hero/hero-moble-3.png",
    eyebrow: "Premium Studio",
    title: "Comfort Is Non\nNegotiable",
    highlightText: "Invisible Confidence",
    subtitle: "Invisible support and perfect coverage for backless, strapless, and plunge necklines.",
    buttonText: "DISCOVER INTIMATES",
    link: "#featured",
    tag: "SIGNATURE EDIT",
  },
  {
    id: "slide-4",
    image: "/images/home/hero/hero-4.webp",
    mobileImage: "/images/home/hero/hero-moble-2.png",
    eyebrow: "Active Athleisure",
    title: "Moves With\nEvery Step",
    highlightText: "Flexible 4-Way Stretch",
    subtitle: "High-performance sports bras and seamless leggings engineered for workouts and everyday lounging.",
    buttonText: "SHOP ATHLEISURE",
    link: "#featured",
    tag: "TRENDING NOW",
  },
  {
    id: "slide-5",
    image: "/images/home/hero/hero-5.webp",
    mobileImage: "/images/home/hero/hero-moble-1.png",
    eyebrow: "Seamless Sculpt",
    title: "Flawless Silhouette\nAll Day Long",
    highlightText: "Targeted Tummy Control",
    subtitle: "Ultra-thin, breathable shapewear that contours smoothly under bodycon dresses and sarees.",
    buttonText: "VIEW SHAPEWEAR",
    link: "#featured",
    tag: "SCULPT & SMOOTH",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const hasMoved = useRef<boolean>(false);

  const totalSlides = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setDragOffset(0);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setDragOffset(0);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setDragOffset(0);
  };

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (isPaused || isDraggingState) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isDraggingState, nextSlide]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    hasMoved.current = false;
    dragStartX.current = e.touches[0].clientX;
    setIsDraggingState(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.touches[0].clientX - dragStartX.current;
    if (Math.abs(diff) > 5) {
      hasMoved.current = true;
    }
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);
    setIsPaused(false);

    if (dragOffset < -50) {
      nextSlide();
    } else if (dragOffset > 50) {
      prevSlide();
    }
    setDragOffset(0);
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    hasMoved.current = false;
    dragStartX.current = e.clientX;
    setIsDraggingState(true);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 5) {
      hasMoved.current = true;
    }
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);
    setIsPaused(false);

    if (dragOffset < -50) {
      nextSlide();
    } else if (dragOffset > 50) {
      prevSlide();
    }
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
    setIsPaused(false);
  };

  const handleButtonClick = (e: React.MouseEvent, href: string) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.replace("#", ""));
      if (el) {
        const headerOffset = 90;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="home"
      aria-label="Aaramly Hero Showcase"
      className="relative w-full overflow-hidden select-none bg-[#FAF8F4]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Carousel Track Container */}
      <div
        className={`relative w-full min-h-[460px] sm:min-h-[520px] md:min-h-[600px] lg:min-h-[660px] aspect-[16/9] md:aspect-[21/9] max-h-[760px] overflow-hidden bg-zinc-100 select-none ${
          isDraggingState ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Track */}
        <div
          className="flex w-full h-full"
          style={{
            transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
            transition: isDraggingState ? "none" : "transform 600ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className="relative w-full h-full shrink-0 select-none overflow-hidden"
            >
              {/* Image / Picture */}
              <picture className="absolute inset-0 w-full h-full">
                {slide.mobileImage && (
                  <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                )}
                <img
                  src={slide.image}
                  alt={slide.title.replace("\n", " ")}
                  className="w-full h-full object-cover object-top select-none pointer-events-none transition-transform duration-1000 scale-100"
                  loading={index === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
              </picture>

              {/* Gradient Overlays for Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent sm:from-black/75 sm:via-black/40 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

              {/* Slide Content Overlay */}
              <div className="relative z-10 flex h-full items-center">
                <div className="mx-auto max-w-[1400px] w-full px-5 sm:px-8 md:px-12 py-10 md:py-16">
                  <div className="max-w-xl text-left text-white">
                    
                    {/* Eyebrow Tag */}
                    {slide.eyebrow && (
                      <div className="inline-flex items-center gap-2 mb-2 sm:mb-3 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                        <Sparkles className="w-3.5 h-3.5 text-[#80a17d] animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-white/95">
                          {slide.eyebrow}
                        </span>
                      </div>
                    )}

                    {/* Main Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] uppercase whitespace-pre-line drop-shadow-md">
                      {slide.title}
                    </h1>

                    {/* Highlight Text */}
                    {slide.highlightText && (
                      <p className="mt-1.5 sm:mt-2 text-sm sm:text-lg md:text-xl font-medium text-[#a2c39f] drop-shadow-sm">
                        🌿 {slide.highlightText}
                      </p>
                    )}

                    {/* Subtitle */}
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-white/90 font-light leading-relaxed max-w-md line-clamp-3 sm:line-clamp-none drop-shadow-sm">
                      {slide.subtitle}
                    </p>

                    {/* CTA Button */}
                    <div className="mt-6 sm:mt-8 flex items-center gap-3.5">
                      <a
                        href={slide.link}
                        onClick={(e) => handleButtonClick(e, slide.link)}
                        className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#2e5d4e] hover:bg-[#23483c] text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-[#2e5d4e]/40 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Left Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#2e5d4e] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#2e5d4e] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-3 sm:bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 sm:gap-3.5 pointer-events-auto bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
          {HERO_SLIDES.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className="relative flex items-center justify-center focus:outline-none transition-all duration-300 cursor-pointer p-0.5"
                aria-label={`Go to slide ${index + 1}`}
              >
                {isActive ? (
                  <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border-2 border-[#80a17d] transition-all duration-300 scale-110">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white shadow-sm" />
                  </div>
                ) : (
                  <div className="flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/50 hover:bg-white transition-colors" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
