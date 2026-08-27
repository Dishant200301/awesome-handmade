import React, { useState, useMemo } from "react";

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

  const { firstImage, secondImage } = useMemo(() => {
    const p = product || {};
    
    // 1. Primary main image (Admin main image, image, or first available image)
    const primary = 
      p.mainImage || 
      p.image || 
      p.img || 
      (Array.isArray(p.images) && p.images[0]) || 
      (Array.isArray(p.colors) && (p.colors[0]?.mainImage || p.colors[0]?.displayImage)) ||
      "/images/category/Latkan.webp";

    // 2. Secondary hover image (First gallery image added in Admin, or images[1], or variation gallery)
    let secondary: string | null = null;

    if (Array.isArray(p.galleryImages) && p.galleryImages.length > 0) {
      for (const item of p.galleryImages) {
        const u = typeof item === "string" ? item : item?.url;
        if (u && typeof u === "string" && u.trim() && u.trim() !== primary) {
          secondary = u.trim();
          break;
        }
      }
    }

    if (!secondary && Array.isArray(p.images) && p.images.length > 1) {
      for (let i = 1; i < p.images.length; i++) {
        const u = typeof p.images[i] === "string" ? p.images[i] : p.images[i]?.url;
        if (u && typeof u === "string" && u.trim() && u.trim() !== primary) {
          secondary = u.trim();
          break;
        }
      }
    }

    if (!secondary && Array.isArray(p.colors) && p.colors.length > 0) {
      const c0 = p.colors[0];
      if (Array.isArray(c0?.galleryImages) && c0.galleryImages.length > 0) {
        for (const item of c0.galleryImages) {
          const u = typeof item === "string" ? item : item?.url;
          if (u && typeof u === "string" && u.trim() && u.trim() !== primary) {
            secondary = u.trim();
            break;
          }
        }
      }
      if (!secondary && p.colors.length > 1) {
        const c1 = p.colors[1];
        const c1Img = c1?.mainImage || c1?.displayImage || (c1?.galleryImages && c1.galleryImages[0]);
        if (c1Img && typeof c1Img === "string" && c1Img.trim() && c1Img.trim() !== primary) {
          secondary = c1Img.trim();
        }
      }
    }

    if (!secondary && (p.hoverImage || p.hoverImg)) {
      const h = p.hoverImage || p.hoverImg;
      if (h && typeof h === "string" && h.trim() && h.trim() !== primary) {
        secondary = h.trim();
      }
    }

    return {
      firstImage: primary,
      secondImage: secondary || primary,
    };
  }, [product]);

  const hasSecondImage = Boolean(secondImage && secondImage !== firstImage);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {/* Primary Image (First image from Admin) */}
      <img
        src={firstImage}
        alt={alt}
        loading="eager"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
          isHovered && hasSecondImage ? "opacity-0 scale-105" : isHovered ? "scale-105" : "opacity-100 scale-100"
        } ${imageClassName}`}
      />

      {/* Secondary Gallery Image (Smooth Fade-in on Hover) */}
      {hasSecondImage && (
        <img
          src={secondImage}
          alt={`${alt} hover view`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
            isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
          } ${imageClassName}`}
        />
      )}

      {/* Badges / Wishlist Button / Overlay Children */}
      {children}
    </div>
  );
};

export default ProductHoverSlider;
