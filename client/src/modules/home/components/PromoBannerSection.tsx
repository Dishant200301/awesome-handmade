import React from 'react';
import { IMG } from '@/data/catalog';

export default function PromoBannerSection() {
  return (
    <section aria-label="Festive Collection Banner" className="w-full py-8 sm:py-12 bg-[#FDFBF7]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <a
          href="#best-sellers"
          className="block w-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer border border-[#EDE5DA] group"
        >
          {/* Full-width single promotional banner image from catalog */}
          <div className="relative aspect-[21/9] sm:aspect-[2.4/1] md:aspect-[2.8/1] max-h-[500px] overflow-hidden bg-brand-cream">
            <img
              src={IMG.banner}
              alt="Awesome Handmade - Festive Handcrafted Choli, Jewellery and Traditional Indian Accessories Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
            <div className="absolute left-6 sm:left-12 bottom-6 sm:bottom-12 text-white max-w-xl">
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-brand-gold text-brand-ink mb-3 inline-block">
                Festive Edition 2026
              </span>
              <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase leading-tight">
                Traditional Craft, Contemporary Grace
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/85 font-light">
                Explore hand-cut mirrors, bridal latkans, and heirloom jewellery made in Surat
              </p>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
