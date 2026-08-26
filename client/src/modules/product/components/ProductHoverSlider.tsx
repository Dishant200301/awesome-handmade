import React, { useState, useEffect, useMemo } from "react";

interface ProductHoverSliderProps {
  product: any;
  alt: string;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

export const ProductHoverSlider: React.FC<ProductHoverSliderProps> = ({
  product,
  alt,
  className = "relative aspect-[3/3.8] w-full overflow-hidden rounded-[18px] bg-[#f5f2ee]",
  imageClassName = "w-full h-full object-cover shrink-0",
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract all available gallery images cleanly
  const galleryImages = useMemo(() => {
    const p = product || {};
    const list: string[] = [];

    // Main images
    if (p.image) list.push(p.image);
    if (p.img) list.push(p.img);
    if (p.mainImage) list.push(p.mainImage);

    // Gallery array fields
    if (p.images && Array.isArray(p.images)) list.push(...p.images);
    if (p.galleryImages && Array.isArray(p.galleryImages)) list.push(...p.galleryImages);
    if (p.gallery && Array.isArray(p.gallery)) list.push(...p.gallery);

    // Color Media Configurations
    if (p.colorMediaConfigs && Array.isArray(p.colorMediaConfigs)) {
      p.colorMediaConfigs.forEach((c: any) => {
        if (c.mainImage) list.push(c.mainImage);
        if (c.gallery && Array.isArray(c.gallery)) list.push(...c.gallery);
      });
    }

    // Color Swatch object images
    if (p.colors && Array.isArray(p.colors)) {
      p.colors.forEach((c: any) => {
        if (c.mainImage) list.push(c.mainImage);
        if (c.displayImage) list.push(c.displayImage);
        if (c.galleryImages && Array.isArray(c.galleryImages)) list.push(...c.galleryImages);
      });
    }

    // Hover image fallbacks
    if (p.hoverImg) list.push(p.hoverImg);
    if (p.hoverImage) list.push(p.hoverImage);

    // Deduplicate while preserving order & filtering out falsy strings
    const unique = Array.from(new Set(list.filter((img) => typeof img === "string" && img.trim().length > 0)));

    if (unique.length === 0) {
      return ["https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=600"];
    }

    return unique;
  }, [product]);

  // Smooth Auto-sliding timer on hover
  useEffect(() => {
    if (!isHovered || galleryImages.length <= 1) {
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 1300); // 1.3 seconds smooth right-to-left transition

    return () => clearInterval(interval);
  }, [isHovered, galleryImages.length]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0);
      }}
      className={className}
    >
      {/* Sliding Images Container (Right-to-Left) */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {galleryImages.map((imgUrl, idx) => (
          <img
            key={`${imgUrl}-${idx}`}
            src={imgUrl}
            alt={`${alt} view ${idx + 1}`}
            loading={idx === 0 ? "eager" : "lazy"}
            className={imageClassName}
          />
        ))}
      </div>

      {/* Badges / Wishlist Button / Overlay Children */}
      {children}
    </div>
  );
};

export default ProductHoverSlider;
