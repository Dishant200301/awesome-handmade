import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Tag } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: 1,
    text: "free express shipping on orders over ₹999",
    code: "FREESHIP",
  },
  {
    id: 2,
    text: "Extra 15% off your first handmade order",
    code: "AOCIND15",
  },
  {
    id: 3,
    text: "100% authentic Gujarati artisan handcrafted guarantee",
    code: "TRYNOW",
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-rotate announcements every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? ANNOUNCEMENTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  return (
    <div className="w-full bg-[#f5f2ee] text-zinc-900 border-b border-zinc-200/80 font-sans select-none overflow-hidden relative z-50">
      <div className="mx-auto max-w-[1400px] h-10 md:h-11 px-4 sm:px-6 flex items-center justify-between text-center text-xs md:text-[13px] font-semibold tracking-wider">
       

        {/* Announcement Message Swiper / Fade */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-center justify-center gap-2 flex-wrap"
            >
              <span>{current.text}</span>
             
            </motion.div>
          </AnimatePresence>
        </div>

       
      </div>
    </div>
  );
};

export default AnnouncementBar;
