import React, { useState, useEffect, useRef } from 'react';
import { heroSlides } from '@/data/catalog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const hasMoved = useRef<boolean>(false);

  const totalSlides = heroSlides.length;

  // Auto-play timer (paused while hovering or dragging)
  useEffect(() => {
    if (isPaused || isDraggingState) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, isDraggingState, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setDragOffset(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setDragOffset(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setDragOffset(0);
  };

  // Touch handlers
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
    } else {
      setDragOffset(0);
    }
  };

  // Mouse drag handlers
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
    } else {
      setDragOffset(0);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
    setIsPaused(false);
  };

  // Suppress link click when user is dragging
  const handleBannerClick = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      id="home"
      aria-label="Promotional Hero Showcase"
      className="relative w-full overflow-hidden select-none bg-[#FAF8F4]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Carousel Track Container with Cursor Grab */}
      <div
        className={`relative w-full aspect-[3352/1412] max-h-[650px] overflow-hidden bg-brand-cream/20 select-none ${
          isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
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
            transition: isDraggingState ? 'none' : 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {heroSlides.map((slideUrl, index) => (
            <div
              key={index}
              className="w-full h-full shrink-0 select-none"
            >
              <a
                href="#categories"
                onClick={handleBannerClick}
                className="block w-full h-full pointer-events-auto"
                draggable={false}
              >
                <img
                  src={slideUrl}
                  alt={`Awesome Handmade Hero Banner ${index + 1}`}
                  className="w-full h-full object-cover object-center select-none pointer-events-none"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </a>
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
          className="absolute left-1.5 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-black/25 hover:bg-brand-maroon text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-1.5 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-black/25 hover:bg-brand-maroon text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        {/* Bottom Pagination Dots (Reference Design: Circle Ring with Center Dot) */}
        <div className="absolute bottom-1.5 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2 pointer-events-auto">
          {heroSlides.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className="relative flex items-center justify-center focus:outline-none transition-all duration-300 cursor-pointer"
                aria-label={`Go to slide ${index + 1}`}
              >
                {isActive ? (
                  <div className="flex h-3.5 w-3.5 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-neutral-800 transition-all duration-300">
                    <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-neutral-900" />
                  </div>
                ) : (
                  <div className="flex h-3.5 w-3.5 sm:h-5 sm:w-5 items-center justify-center">
                    <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-gray-400 hover:bg-gray-600 transition-colors" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
