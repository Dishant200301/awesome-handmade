import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/modules/core/components/Navbar";
import Footer from "@/modules/core/components/Footer";
import { ProductBreadcrumb } from "../components/ProductBreadcrumb";
import { VerticalGallery } from "../components/VerticalGallery";
import { ProductInfo } from "../components/ProductInfo";
import { SizeChartModal } from "../components/SizeChartModal";
import { FloatingStickyCart } from "../components/FloatingStickyCart";
import { MobileStickyBottomBar } from "../components/MobileStickyBottomBar";
import { BenefitsSection } from "../components/BenefitsSection";
import { ProductDescriptionSection } from "../components/ProductDescriptionSection";
import { WashingInstructionsSection } from "../components/WashingInstructionsSection";
import { ManufacturingDetailsSection } from "../components/ManufacturingDetailsSection";
import { CustomerReviewsSection } from "../components/CustomerReviewsSection";
import { RelatedProductsSection } from "../components/RelatedProductsSection";
import { ProductColorVariation } from "../types/product";
import { getLiveProductById, subscribeToProductStore } from "@/modules/core/lib/apiStore";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState(() => getLiveProductById(id));
  const { addRecentlyViewed } = useRecentlyViewed();


  const prodAny = product as any;

  const [selectedColor, setSelectedColor] = useState<string>(
    () => product.colors?.[0]?.colorName || product.variations[0]?.colorName || "Black"
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    () => product.colors?.[0]?.sizes?.[0] || product.variations[0]?.size || product.availableSizes[0] || "S"
  );

  // Dynamic computation of active variation based on Color AND Size selection
  const activeVariation: ProductColorVariation = React.useMemo(() => {
    // Find matching color configuration object
    const colorObj = (product.colors || []).find(
      (c) => c.colorName.toLowerCase() === (selectedColor || "").toLowerCase()
    );

    // Build color images (Main Image + Gallery Images for selected color)
    const colorMain = colorObj?.mainImage || colorObj?.displayImage || colorObj?.galleryImages?.[0] || prodAny.image || "";
    const colorGallery = colorObj?.galleryImages || [];
    const allUrls = Array.from(new Set([colorMain, ...colorGallery].filter(Boolean)));
    const colorImages = allUrls.map((gUrl, idx) => ({
      id: `img-gal-${idx}`,
      url: gUrl,
      alt: `${product.name} - ${selectedColor} View ${idx + 1}`
    }));

    if (!product.variations || product.variations.length === 0) {
      return {
        id: "v-default",
        colorName: selectedColor || "DEFAULT",
        colorHex: colorObj?.colorHex || "#000000",
        size: selectedSize,
        thumbnail: colorObj?.displayImage || colorObj?.mainImage || prodAny.image || "",
        price: prodAny.price || 799,
        originalPrice: prodAny.originalPrice || 1299,
        discountPercentage: 38,
        sku: product.defaultSku || "AAR-SKU-100",
        stock: 50,
        images: colorImages.length > 0 ? colorImages : (Array.isArray(prodAny.images) && prodAny.images.length > 0 ? prodAny.images.map((u: string, i: number) => ({ id: `img-${i}`, url: u, alt: product.name })) : [])
      };
    }

    // 1. Try exact match for both Color AND Size
    const exactMatch = product.variations.find(
      (v) =>
        (v.colorName || "").toLowerCase() === (selectedColor || "").toLowerCase() &&
        ((v.size || "").toLowerCase() === (selectedSize || "").toLowerCase() ||
          (v.sizeName || "").toLowerCase() === (selectedSize || "").toLowerCase())
    );

    if (exactMatch) {
      const finalImages = colorImages.length > 0
        ? colorImages
        : (exactMatch.images && exactMatch.images.length > 0 ? exactMatch.images : [
          { id: "img-thumb", url: exactMatch.thumbnail || prodAny.image, alt: product.name }
        ]);

      return {
        ...exactMatch,
        size: selectedSize,
        images: finalImages
      };
    }

    // 2. Fallback to Color match
    const colorMatch = product.variations.find(
      (v) => (v.colorName || "").toLowerCase() === (selectedColor || "").toLowerCase()
    );

    if (colorMatch) {
      const finalImages = colorImages.length > 0
        ? colorImages
        : (colorMatch.images && colorMatch.images.length > 0 ? colorMatch.images : [
          { id: "img-thumb", url: colorMatch.thumbnail || prodAny.image, alt: product.name }
        ]);

      return {
        ...colorMatch,
        size: selectedSize,
        images: finalImages
      };
    }

    // 3. Default to first variation
    return product.variations[0];
  }, [product.colors, product.variations, selectedColor, selectedSize, prodAny]);

  const [hoverVariation, setHoverVariation] = useState<ProductColorVariation | null>(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Subscribe to live API product store updates from Admin
  useEffect(() => {
    const updateProduct = () => {
      const live = getLiveProductById(id);
      setProduct(live);
      if (live && live.id) {
        addRecentlyViewed(live);
      }
    };


    updateProduct();
    const unsubscribe = subscribeToProductStore(updateProduct);
    return () => unsubscribe();
  }, [id]);

  // Sync selectedColor and selectedSize whenever product updates
  useEffect(() => {
    const validColors = product.colors && product.colors.length > 0
      ? product.colors.map(c => c.colorName)
      : (product.variations || []).map(v => v.colorName).filter(Boolean);

    if (validColors.length > 0) {
      const colorExists = validColors.some(
        (cName) => (cName || "").toLowerCase() === (selectedColor || "").toLowerCase()
      );
      if (!colorExists) {
        const firstColor = validColors[0];
        setSelectedColor(firstColor);
        const colorObj = (product.colors || []).find(c => c.colorName.toLowerCase() === firstColor.toLowerCase());
        if (colorObj?.sizes && colorObj.sizes.length > 0) {
          setSelectedSize(colorObj.sizes[0]);
        }
      }
    }

    if (!selectedSize || (product.availableSizes && !product.availableSizes.includes(selectedSize))) {
      const fallbackSize = (product.colors?.[0]?.sizes?.[0]) || (product.availableSizes?.[0]) || "S";
      setSelectedSize(fallbackSize);
    }
  }, [product, selectedColor, selectedSize]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  const displayedVariation = hoverVariation || activeVariation;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white pb-16 md:pb-0 overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Container */}
      <div className="pt-10 md:pt-12">
        {/* Breadcrumb */}
        <ProductBreadcrumb productName={product.name} />

        {/* TOP PRODUCT HERO SECTION */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Image Gallery (50% Width on Tablet & Laptop) */}
            <div className="w-full">
              <VerticalGallery
                images={displayedVariation.images && displayedVariation.images.length > 0 ? displayedVariation.images : [
                  { id: "img-1", url: prodAny.image || "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=800", alt: product.name }
                ]}
                sku={displayedVariation.sku}
              />
            </div>

            {/* Right Column: Product Information (50% Width on Tablet & Laptop) */}
            <div className="w-full">
              <ProductInfo
                product={product}
                activeVariation={activeVariation}
                onSelectVariation={(v) => {
                  setSelectedColor(v.colorName);
                  const colorObj = (product.colors || []).find(
                    (c) => c.colorName.toLowerCase() === v.colorName.toLowerCase()
                  );
                  const colorSizes = (colorObj?.sizes && colorObj.sizes.length > 0)
                    ? colorObj.sizes
                    : (product.variations || [])
                      .filter((varItem) => (varItem.colorName || "").toLowerCase() === (v.colorName || "").toLowerCase())
                      .map((varItem) => varItem.size || varItem.sizeName)
                      .filter((s): s is string => Boolean(s));
                  if (colorSizes.length > 0 && !colorSizes.includes(selectedSize)) {
                    setSelectedSize(colorSizes[0]);
                  }
                }}
                onHoverVariation={setHoverVariation}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                onOpenSizeChart={() => setIsSizeChartOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* BENEFITS SECTION */}
        <BenefitsSection />

        {/* PRODUCT DESCRIPTION & FEATURE CARDS */}
        <ProductDescriptionSection
          cards={product.descriptionCards}
          selectedColor={selectedColor}
          idealForPills={product.idealForPills}
          fullDescription={product.fullDescription}
          shortDescription={product.shortDescription}
        />

        {/* WASHING INSTRUCTIONS */}
        <WashingInstructionsSection instructions={product.washingInstructions} />

        
        {/* CUSTOMER REVIEWS */}
        <div id="customer-reviews">
          <CustomerReviewsSection />
        </div>

        {/* RELATED PRODUCTS / LOVED TOGETHER */}
        <RelatedProductsSection currentProduct={product} />
      </div>

      {/* FLOATING STICKY CART */}
      <FloatingStickyCart />

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <MobileStickyBottomBar
        productId={product.id}
        productName={product.name}
        brand={product.brand}
        activeVariation={activeVariation}
        selectedSize={selectedSize}
      />

      {/* SIZE CHART MODAL */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        sizeChart={product.sizeChart}
        sizeChartConfig={(product as any).sizeChart || product.sizeChartConfig}
        sizeGuide={product.sizeGuide}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
