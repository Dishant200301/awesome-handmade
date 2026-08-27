import React from "react";

export default function ExplainerSection() {
  return (
    <section 
      id="artisan-craftsmanship" 
      aria-label="Artisan Craftsmanship & Details"
      className="w-full p-0 m-0 overflow-hidden bg-transparent"
    >
      <div className="w-full p-0 m-0">
        <img
          src="/images/banner/banner.png"
          alt="Artisan Craftsmanship & Details - Handmade Necklace, Crafted with colour, culture & love"
          className="w-full h-auto block select-none pointer-events-none"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}

