import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { DescriptionCard } from "../types/product";

interface ProductDescriptionSectionProps {
  cards: DescriptionCard[];
  selectedColor?: string;
  idealForPills: string[];
  fullDescription?: string;
  shortDescription?: string;
}

export const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({
  cards,
  selectedColor,
  idealForPills,
  fullDescription,
  shortDescription,
}) => {
  const [activePill, setActivePill] = useState("Everyday Wear");
  const descriptionText = fullDescription || shortDescription || "Super Combed Cotton Elastane Stretch Fabric | Fabric Composition : Cotton and Elastane | Full Coverage Bra with Contoured Shaper Panels | Wirefree and Non-Padded | Broad Fabric Strap at Front for Added Comfort | Contoured Shaper Panel for Extra Support | Label Free for All Day Comfort | Based on the Size Band Of the Bra, the Number Of Hook and Eye Varies for Better Support";

  const displayCards = (cards || []).filter((card) => {
    if (!card.colorName || card.colorName === 'All' || card.colorName.toLowerCase() === 'all' || card.colorName.toLowerCase() === 'general') {
      return true;
    }
    if (!selectedColor) return true;
    return card.colorName.toLowerCase() === selectedColor.toLowerCase();
  });

  return (
    <section id="product-description" className="w-full py-12 px-4 md:px-8 max-w-[1400px] mx-auto space-y-8 scroll-mt-24 font-sans">
      {/* Large Heading matching Home Page Section Titles */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-4xl font-800 text-zinc-900 tracking-tight">
          Product Description
        </h2>
        <div className="w-16 h-1 bg-[#80a17d] rounded-full" />
      </div>

      {/* 4 Feature Image Cards Grid: Horizontal Scroll Row on Mobile, Grid on Tablet & Laptop */}
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible">
        {displayCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-[20px] overflow-hidden aspect-[3/3.8] bg-[#f5f2ee] shadow-sm hover:shadow-xl transition-all duration-500 border border-zinc-200/60 flex flex-col justify-end p-6 text-white shrink-0 w-[72vw] max-w-[280px] sm:w-auto sm:max-w-none"
          >
            {/* Background Image */}
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />

            {/* Content */}
            <div className="relative z-10 space-y-1.5">
              <h3 className="text-xl font-800 tracking-tight leading-tight drop-shadow-sm">
                {card.title}
              </h3>
              <p className="text-xs font-medium text-zinc-200 tracking-wide drop-shadow-xs">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Description Paragraph Bar matching Home Page warm background */}
      <div className="p-6 md:p-8 rounded-[20px] bg-[#f5f2ee] border border-zinc-200/60 text-xs md:text-sm text-zinc-700 leading-relaxed space-y-2">
        <p className="font-semibold text-zinc-800">
          {descriptionText}
        </p>
      </div>

      {/* Ideal For Section with Pill Buttons matching Home Page Filter Tabs */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <span className="text-xs font-montserrat font-700 tracking-[0.15em] text-zinc-900 flex items-center gap-1.5">
          <span>Ideal For:</span>
        </span>

        <div className="flex flex-wrap gap-2.5">
          {idealForPills.map((pill) => {
            const isActive = pill === activePill || (pill === "Everyday" && activePill === "Everyday Wear");
            return (
              <button
                key={pill}
                onClick={() => setActivePill(pill)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer ${isActive
                    ? "bg-zinc-900 text-white shadow-md"
                    : "bg-[#f5f2ee] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/80"
                  }`}
              >
                <FiCheckCircle className={isActive ? "text-white" : "text-zinc-400"} size={14} />
                <span>{pill}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
