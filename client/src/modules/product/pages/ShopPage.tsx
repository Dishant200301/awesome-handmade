import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Eye,
} from "lucide-react";
import Navbar from "@/modules/core/components/Navbar";
import Footer from "@/modules/core/components/Footer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useQuickView } from "../context/QuickViewContext";
import ProductHoverSlider from "../components/ProductHoverSlider";
import { CLIENT_SHOP_PRODUCTS } from "../data/productData";
import { ClientShopProduct } from "../types/product";
import {
  fetchLiveProducts,
  subscribeToProductStore,
  getLiveProductsList,
  getLiveFilters,
  subscribeToFilterStore,
} from "@/modules/core/lib/apiStore";

// Shop Categories for Header Bar (3 Core Categories)
const shopCategories = [
  { id: "Bralettes", name: "Bralettes", count: "10 products", img: "https://m.media-amazon.com/images/I/71LtEuQjqXL._SL1500_.jpg" },
  { id: "Everyday Bras", name: "Everyday Bras", count: "8 products", img: "https://m.media-amazon.com/images/I/71hu9PaEBcL._SL1500_.jpg" },
  { id: "Seamless Panties", name: "Seamless Panties", count: "8 products", img: "https://m.media-amazon.com/images/I/51yter5yXjL._SL1500_.jpg" },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { wishlistIds, toggleWishlist, isWishlisted } = useWishlist();
  const { openQuickView, isMobileOrTablet } = useQuickView();

  // Dynamic Filters State
  const [filterConfig, setFilterConfig] = useState(() => getLiveFilters());

  useEffect(() => {
    const unsubscribeFilters = subscribeToFilterStore(() => {
      setFilterConfig(getLiveFilters() || { categories: [], colors: [], sizes: [], maxPrice: 3000 });
    });
    return () => unsubscribeFilters();
  }, []);

  const handleProductClick = (e: React.MouseEvent, productId: string | number) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      e.preventDefault();
      openQuickView(productId);
    }
  };

  // Products State
  const [products, setProducts] = useState<ClientShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Layout View Mode (grid vs list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter States
  const initialCategory = searchParams.get("category") || null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sort & Pagination
  const [sort, setSort] = useState("default");
  const [showPerPage, setShowPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Accordion Sections Toggle
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    color: true,
    size: true,
    rating: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mobile Auto Slider State for Category (5-second transition)
  const [mobileCatIndex, setMobileCatIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileCatIndex((prev) => (prev + 1) % shopCategories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) setSelectedCategory(catFromUrl);
  }, [searchParams]);

  // Load Live & Published Products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        await fetchLiveProducts();
        const stored = getLiveProductsList();
        const published = stored.filter(
          (p: any) => p.isPublished !== false && p.status !== "Draft"
        );
        setProducts(published);
      } catch {
        const stored = getLiveProductsList();
        const published = stored.filter(
          (p: any) => p.isPublished !== false && p.status !== "Draft"
        );
        setProducts(published);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();

    const unsubscribe = subscribeToProductStore(() => {
      const liveList = getLiveProductsList();
      const published = (liveList || []).filter(
        (p: any) => p.isPublished !== false && p.status !== "Draft"
      );
      setProducts(published);
    });

    return () => unsubscribe();
  }, []);

  // Filter Checks
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setMaxPrice(3000);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedRatings([]);
    setSearchQuery("");
    setSort("default");
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category
    if (selectedCategory) {
      if (selectedCategory === "newArrival") {
        list = list.filter((p) => p.labels?.newArrival);
      } else if (selectedCategory === "bestSeller") {
        list = list.filter((p) => p.labels?.bestSeller);
      } else if (selectedCategory === "sale") {
        list = list.filter((p) => p.labels?.sale);
      } else {
        list = list.filter(
          (p) =>
            p.category === selectedCategory ||
            p.categories?.includes(selectedCategory)
        );
      }
    }

    // Max Price
    list = list.filter((p) => p.price <= maxPrice);

    // Color
    if (selectedColors.length > 0) {
      list = list.filter((p) =>
        selectedColors.some(
          (c) =>
            p.attributes?.some(
              (a) =>
                a.name.toLowerCase() === "color" &&
                a.values.some((v: string) =>
                  v.toLowerCase().includes(c.toLowerCase())
                )
            ) ||
            p.variants?.some((v) =>
              v.color?.toLowerCase().includes(c.toLowerCase())
            )
        )
      );
    }

    // Size
    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        selectedSizes.some(
          (s) =>
            p.attributes?.some(
              (a) => a.name.toLowerCase() === "size" && a.values.includes(s)
            ) || p.variants?.some((v) => v.size === s)
        )
      );
    }

    // Rating
    if (selectedRatings.length > 0) {
      list = list.filter((p) =>
        selectedRatings.includes(Math.floor(p.rating || 4.8))
      );
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "newest") {
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }

    return list;
  }, [
    products,
    selectedCategory,
    maxPrice,
    selectedColors,
    selectedSizes,
    selectedRatings,
    searchQuery,
    sort,
  ]);

  const totalResults = filteredProducts.length;
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * showPerPage,
    currentPage * showPerPage
  );
  const totalPages = Math.ceil(totalResults / showPerPage);

  // Sidebar Filter Component (matching Hervia Tea collapsible accordion design)
  const FilterSidebar = (
    <div className="space-y-6 text-zinc-900 font-sans">
      {/* 1. Category Accordion */}
      <div className="border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="flex w-full items-center justify-between text-sm font-semibold tracking-wider text-zinc-900 mb-3 cursor-pointer"
        >
          <span>Categories</span>
          {openSections.categories ? (
            <Minus className="w-6 h-6 stroke-1 text-zinc-800" />
          ) : (
            <Plus className="w-6 h-6 stroke-1 text-zinc-800" />
          )}
        </button>
        {openSections.categories && (
          <ul className="space-y-2 text-xs font-semibold text-zinc-600 tracking-wide">
            {(filterConfig?.categories || []).map((cat: any) => {
              const catKey = cat.key || cat.id || cat.name;
              const rawName = cat.name || catKey;
              // Format uppercase strings to natural Title Case (e.g. BRALETTES -> Bralettes)
              const catName = rawName === rawName.toUpperCase()
                ? rawName.toLowerCase().split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                : rawName;
              const isActive = selectedCategory === catKey;
              return (
                <li key={catKey}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(isActive ? null : catKey);
                      if (!isActive) setSearchParams({ category: catKey });
                      else setSearchParams({});
                    }}
                    className={`flex w-full items-center justify-between text-left hover:text-[#80a17d] transition-colors cursor-pointer ${isActive ? "text-[#80a17d] font-extrabold" : ""
                      }`}
                  >
                    <span>{catName}</span>
                    {cat.count !== undefined && (
                      <span className="text-zinc-400 font-normal text-[10px]">
                        ({cat.count})
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 2. Filter By Price */}
      <div className="border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between text-sm font-semibold tracking-wider text-[#1c1c1e] mb-3 cursor-pointer"
        >
          <span>Filter By Price</span>
          {openSections.price ? (
            <Minus className="w-6 h-6 stroke-1 text-zinc-800" />
          ) : (
            <Plus className="w-6 h-6 stroke-1 text-zinc-800" />
          )}
        </button>
        {openSections.price && (
          <div className="space-y-3">
            <input
              type="range"
              min="200"
              max={filterConfig?.maxPrice || 3000}
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#80a17d]"
            />
            <div className="flex items-center justify-between text-xs font-medium text-zinc-700">
              <span>
                Price: <strong className="text-zinc-900">₹200 — ₹{maxPrice}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Color Filter */}
      <div className="border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => toggleSection("color")}
          className="flex w-full items-center justify-between text-sm font-semibold tracking-wider text-zinc-900 mb-3 cursor-pointer"
        >
          <span>Color</span>
          {openSections.color ? (
            <Minus className="w-6 h-6 stroke-1 text-zinc-800" />
          ) : (
            <Plus className="w-6 h-6 stroke-1 text-zinc-800" />
          )}
        </button>
        {openSections.color && (
          <ul className="space-y-2 text-xs font-semibold text-zinc-600 font-semibold tracking-wide">
            {(filterConfig?.colors || []).map((c: any) => {
              const colorName = typeof c === "string" ? c : c.name;
              const colorHex = typeof c === "object" ? c.hex : null;
              const checked = selectedColors.includes(colorName);
              return (
                <li key={colorName} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    id={`color-${colorName}`}
                    checked={checked}
                    onChange={() => toggleColor(colorName)}
                    className="w-4 h-4 rounded border-zinc-300 text-[#80a17d] focus:ring-[#80a17d]/20 cursor-pointer accent-[#80a17d]"
                  />
                  <label htmlFor={`color-${colorName}`} className="cursor-pointer select-none flex items-center gap-2">
                    {colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-2xs inline-block"
                        style={{ backgroundColor: colorHex }}
                      />
                    )}
                    <span>{colorName}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 4. Size Filter */}
      <div className="border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => toggleSection("size")}
          className="flex w-full items-center justify-between text-sm font-semibold tracking-wider text-zinc-900 mb-3 cursor-pointer"
        >
          <span>Size</span>
          {openSections.size ? (
            <Minus className="w-6 h-6 stroke-1 text-zinc-800" />
          ) : (
            <Plus className="w-6 h-6 stroke-1 text-zinc-800" />
          )}
        </button>
        {openSections.size && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(filterConfig?.sizes || []).map((s: any) => {
              const sizeVal = typeof s === "string" ? s : s.name || s.id;
              const checked = selectedSizes.includes(sizeVal);
              return (
                <button
                  key={sizeVal}
                  type="button"
                  onClick={() => toggleSize(sizeVal)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${checked
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                      : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                >
                  {sizeVal}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Rating Filter */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("rating")}
          className="flex w-full items-center justify-between text-sm font-semibold tracking-wider text-zinc-900 mb-3 cursor-pointer"
        >
          <span>Rating</span>
          {openSections.rating ? (
            <Minus className="w-6 h-6 stroke-1 text-zinc-800" />
          ) : (
            <Plus className="w-6 h-6 stroke-1 text-zinc-800" />
          )}
        </button>
        {openSections.rating && (
          <ul className="space-y-2.5 text-xs text-zinc-600">
            {[
              { stars: 5, count: 8 },
              { stars: 4, count: 14 },
              { stars: 3, count: 2 },
            ].map(({ stars, count }) => {
              const checked = selectedRatings.includes(stars);
              return (
                <li key={stars} className="flex items-center justify-between cursor-pointer">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRating(stars)}
                      className="w-4 h-4 rounded border-zinc-300 text-[#80a17d] focus:ring-[#80a17d]/20 cursor-pointer accent-[#80a17d]"
                    />
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 fill-current ${i >= stars ? "text-zinc-300 fill-zinc-200" : ""
                            }`}
                        />
                      ))}
                    </div>
                  </label>
                  <span className="text-zinc-400 text-[10px]">({count})</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Reset Button */}
      {(selectedCategory ||
        selectedColors.length > 0 ||
        selectedSizes.length > 0 ||
        selectedRatings.length > 0 ||
        maxPrice < 3000) && (
          <button
            type="button"
            onClick={resetFilters}
            className="w-full py-2.5 bg-zinc-100 hover:bg-[#80a17d] hover:text-white text-zinc-900 font-bold text-xs font-semibold tracking-wider transition-colors rounded-xl cursor-pointer"
          >
            RESET ALL FILTERS
          </button>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      {/* TOP SHOP BY CATEGORY CIRCLES SECTION */}
      <section className="bg-white pt-10 pb-8 border-b border-zinc-100">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-extrabold font-semibold tracking-[0.2em] text-[#80a17d] mb-2">
            AARAMLY CATEGORIES
          </p>

          {/* TABLET & LAPTOP/DESKTOP VIEW (>= sm): 3 Columns in 1 Row */}
          <div className="hidden sm:grid grid-cols-3 gap-6 max-w-4xl mx-auto pt-4 items-stretch">
            {shopCategories.map((cat, idx) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(active ? null : cat.id)}
                  className={`group flex flex-col items-center justify-between py-4 px-3 cursor-pointer transition-all duration-300 ${idx !== shopCategories.length - 1 ? "sm:border-r sm:border-zinc-200/80" : ""
                    }`}
                >
                  {/* Category Circle Image */}
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden transition-all duration-300 p-0.5 ${active ? "border-2 border-[#80a17d]" : "border-2 border-transparent"
                      }`}
                  >
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Title & Count */}
                  <div className="mt-3 text-center">
                    <h3
                      className={`text-sm sm:text-base font-bold transition-colors leading-tight ${active ? "text-[#80a17d]" : "text-zinc-900 group-hover:text-[#80a17d]"
                        }`}
                    >
                      {cat.name}
                    </h3>
                    <span className="text-xs italic text-zinc-400 mt-1 block">
                      {cat.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* MOBILE VIEW (< sm): 1 Category Slide per View with 5-Second Auto Scroll + Manual Swipe & Dots */}
          <div className="block sm:hidden pt-4 max-w-xs mx-auto">
            {/* Scrollable Track & Auto Slide Card */}
            <div className="flex flex-col items-center justify-center space-y-3">
              {(() => {
                const cat = shopCategories[mobileCatIndex];
                const active = selectedCategory === cat.id;
                return (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(active ? null : cat.id)}
                    className="group flex flex-col items-center cursor-pointer transition-all duration-500 transform active:scale-95"
                  >
                    <div
                      className={`w-32 h-32 rounded-full overflow-hidden transition-all p-0.5 shadow-sm ${active ? "border-2 border-[#80a17d]" : "border-2 border-transparent"
                        }`}
                    >
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h3
                        className={`text-base font-bold transition-colors ${active ? "text-[#80a17d]" : "text-zinc-900"
                          }`}
                      >
                        {cat.name}
                      </h3>
                      <span className="text-xs italic text-zinc-400 mt-0.5 block">
                        {cat.count}
                      </span>
                    </div>
                  </button>
                );
              })()}

              {/* Manual Dot Controls (5-second auto transition indicators) */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {shopCategories.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setMobileCatIndex(dotIdx)}
                    aria-label={`Go to category ${dotIdx + 1}`}
                    className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${mobileCatIndex === dotIdx
                        ? "w-6 bg-[#80a17d]"
                        : "w-2 bg-zinc-300 hover:bg-zinc-400"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP VIEW & CONTROL BAR (Single Line Grid like Hervia Tea) */}
      <section className="w-full border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-[1400px]">
          {/* DESKTOP & TABLET VIEW */}
          <div className="hidden sm:grid grid-cols-[110px_1fr_auto_110px] lg:grid-cols-[160px_1fr_240px_160px] items-stretch divide-x divide-zinc-200/80 text-xs text-zinc-900">
            {/* Box 1: Left - VIEW Toggles */}
            <div className="flex items-center justify-center py-3.5 px-4">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex lg:hidden items-center gap-1.5 font-bold text-xs font-semibold tracking-widest text-zinc-900 hover:text-[#80a17d] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>FILTER</span>
              </button>

              <div className="hidden lg:flex items-center gap-3">
                <span className="font-bold text-xs font-semibold tracking-widest text-zinc-900">
                  VIEW
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid View"
                  className={`p-1 transition-colors cursor-pointer ${viewMode === "grid" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
                    }`}
                >
                  <LayoutGrid className="w-4.5 h-4.5 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List View"
                  className={`p-1 transition-colors cursor-pointer ${viewMode === "list" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
                    }`}
                >
                  <ListIcon className="w-4.5 h-4.5 stroke-[1.5]" />
                </button>
              </div>
            </div>

            {/* Box 2: Center - Results Count */}
            <div className="flex items-center justify-center py-3.5 px-4 text-xs font-semibold text-zinc-500 whitespace-nowrap">
              Showing 1–{displayedProducts.length} of {totalResults} results
            </div>

            {/* Box 3: Right - SORT BY */}
            <div className="flex items-center justify-center py-3.5 px-4">
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <span className="text-zinc-400 font-semibold text-xs font-semibold tracking-wider shrink-0">
                  SORT BY
                </span>
                <div className="relative flex items-center shrink-0">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-transparent font-bold font-semibold tracking-wider text-zinc-900 text-xs outline-none cursor-pointer pr-4 py-0.5"
                  >
                    <option value="default">DEFAULT</option>
                    <option value="price-asc">PRICE: LOW TO HIGH</option>
                    <option value="price-desc">PRICE: HIGH TO LOW</option>
                    <option value="rating">RATING</option>
                    <option value="newest">NEWEST</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-900 pointer-events-none absolute right-0 stroke-[1.5]" />
                </div>
              </label>
            </div>

            {/* Box 4: Right - SHOW PER PAGE */}
            <div className="flex items-center justify-center py-3.5 px-4">
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <span className="text-zinc-400 font-semibold text-xs font-semibold tracking-wider shrink-0">
                  SHOW
                </span>
                <div className="relative flex items-center shrink-0">
                  <select
                    value={showPerPage}
                    onChange={(e) => setShowPerPage(Number(e.target.value))}
                    className="appearance-none bg-transparent font-bold font-semibold tracking-wider text-zinc-900 text-xs outline-none cursor-pointer pr-4 py-0.5"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-900 pointer-events-none absolute right-0 stroke-[1.5]" />
                </div>
              </label>
            </div>
          </div>

          {/* MOBILE VIEW (< sm) */}
          <div className="grid sm:hidden grid-cols-3 items-stretch divide-x divide-zinc-200/80 text-zinc-900 w-full">
            <div className="flex items-center justify-center py-2.5 px-1 min-w-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-1 font-bold text-[11px] font-semibold tracking-wider text-zinc-900 hover:text-[#80a17d] transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />
                <span>FILTER</span>
              </button>
            </div>

            <div className="flex items-center justify-center py-2.5 px-1 min-w-0 overflow-hidden">
              <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <span className="text-zinc-400 font-bold text-[10px] font-semibold tracking-wider shrink-0">
                  SORT
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent font-bold font-semibold tracking-wider text-zinc-900 text-[10px] outline-none cursor-pointer"
                >
                  <option value="default">DEFAULT</option>
                  <option value="price-asc">LOW</option>
                  <option value="price-desc">HIGH</option>
                  <option value="rating">RATING</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-center py-2.5 px-1 min-w-0 overflow-hidden">
              <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <span className="text-zinc-400 font-bold text-[10px] font-semibold tracking-wider shrink-0">
                  SHOW
                </span>
                <select
                  value={showPerPage}
                  onChange={(e) => setShowPerPage(Number(e.target.value))}
                  className="bg-transparent font-bold font-semibold tracking-wider text-zinc-900 text-[10px] outline-none cursor-pointer"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={36}>36</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN PRODUCTS & FILTERS CONTENT SECTION */}
      <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
          {/* Desktop Left Sidebar Filter */}
          <aside className="hidden lg:block sticky top-24 pr-2">{FilterSidebar}</aside>

          {/* Product Grid / List Display */}
          <section>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-zinc-200/80 p-2.5 space-y-3 animate-pulse">
                    <div className="aspect-[3/3.5] bg-zinc-100 rounded-xl" />
                    <div className="h-4 bg-zinc-100 rounded w-3/4" />
                    <div className="h-3 bg-zinc-100 rounded w-1/2" />
                    <div className="h-9 bg-zinc-100 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 space-y-4">
                <h3 className="text-lg font-bold text-zinc-900">No products found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try adjusting your chosen filters or price range to discover Aaramly products.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-zinc-900 text-white font-bold text-xs font-semibold tracking-wider hover:bg-[#80a17d] transition-colors rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW MODE matching Hervia layout */
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayedProducts.map((p) => {
                  const mainImg =
                    p.images?.[0] ||
                    p.image ||
                    "https://m.media-amazon.com/images/I/71LtEuQjqXL._SL1500_.jpg";
                  const wishlisted = isWishlisted(String(p.id));
                  const discount = p.originalPrice
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={p.id}
                      className="group bg-white rounded-2xl border border-zinc-200/80 p-2 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      {(() => {
                        const cartItem = cartItems.find((item) => String(item.productId) === String(p.id));
                        const itemQuantity = cartItem ? cartItem.quantity : 0;

                        return (
                          <>
                            <div>
                              {/* Image Frame & Badges with Smooth Right-to-Left Auto Slider on Hover */}
                              <Link
                                to={`/product/${p.id}`}
                                onClick={(e) => handleProductClick(e, p.id)}
                                className="block cursor-pointer"
                              >
                                <ProductHoverSlider
                                  product={p}
                                  alt={p.name}
                                  className="relative aspect-[3/3.5] bg-zinc-100 rounded-xl overflow-hidden block"
                                >
                                  {/* Badges */}
                                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                                    {discount > 0 && (
                                      <span className="bg-[#80a17d] text-white text-[9px] font-extrabold font-semibold px-2 py-0.5 rounded-full shadow-xs">
                                        -{discount}%
                                      </span>
                                    )}
                                    {p.labels?.bestSeller && (
                                      <span className="bg-amber-500 text-white text-[9px] font-extrabold font-semibold px-2 py-0.5 rounded-full shadow-xs">
                                        BEST SELLER
                                      </span>
                                    )}
                                  </div>

                                  {/* Wishlist Heart Button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleWishlist(String(p.id));
                                    }}
                                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-xs transition-colors z-10 cursor-pointer ${
                                      wishlisted
                                        ? "bg-rose-500 text-white"
                                        : "bg-white/80 text-zinc-700 hover:bg-white"
                                    }`}
                                    aria-label="Wishlist"
                                  >
                                    <Heart
                                      className={`w-3.5 h-3.5 ${
                                        wishlisted ? "fill-white" : ""
                                      }`}
                                    />
                                  </button>
                                </ProductHoverSlider>
                              </Link>

                              {/* Card Content Body */}
                              <div className="p-2 pt-3 space-y-1.5">
                                <span className="text-[12px] font-semibold tracking-wider text-[#798A7A] block">
                                  {p.category}
                                </span>

                                <Link to={`/product/${p.id}`} onClick={(e) => handleProductClick(e, p.id)}>
                                  <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1 group-hover:text-[#80a17d] transition-colors">
                                    {p.name}
                                  </h3>
                                </Link>

                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-zinc-800">{p.rating || 4.8}</span>
                                  <span className="text-zinc-400 font-normal text-[10px]">
                                    ({p.salesCount || 323})
                                  </span>
                                </div>

                                <div className="flex items-baseline gap-2 pt-0.5">
                                  <span className="text-base font-semibold text-zinc-900">
                                    ₹{p.price}
                                  </span>
                                  {p.originalPrice && p.originalPrice > p.price && (
                                    <span className="text-xs text-zinc-400 line-through font-semibold">
                                      ₹{p.originalPrice}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Add to Bag Button / Green Quantity Stepper */}
                            <div className="p-2 pt-0">
                              {itemQuantity > 0 ? (
                                <div
                                  className="w-full h-10 bg-black text-white text-sm font-medium px-3 rounded-xl shadow-md flex items-center justify-between"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (cartItem) updateQuantity(cartItem.id, cartItem.quantity - 1);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors font-black text-sm cursor-pointer active:scale-90"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-6 h-6 stroke-1" />
                                  </button>
                                  <span className="text-xs font-semibold px-2">{itemQuantity}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (cartItem) updateQuantity(cartItem.id, cartItem.quantity + 1);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors font-black text-sm cursor-pointer active:scale-90"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-6 h-6 stroke-1" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    addToCart({
                                      productId: String(p.id),
                                      productName: p.name,
                                      brand: p.brand || "AARAMLY",
                                      colorName: "Classic Black",
                                      colorHex: "#000000",
                                      size: "S",
                                      price: p.price,
                                      originalPrice: p.originalPrice || p.price,
                                      image: mainImg,
                                      sku: p.sku || "AAR-SKU",
                                      quantity: 1,
                                    })
                                  }
                                  className="w-full h-10 bg-zinc-900 hover:bg-[#80a17d] text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                  <span>Add To Bag</span>
                                </button>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW MODE matching Grid styling & responsive alignment */
              <div className="space-y-4">
                {displayedProducts.map((p) => {
                  const mainImg =
                    p.images?.[0] ||
                    p.image ||
                    "https://m.media-amazon.com/images/I/71LtEuQjqXL._SL1500_.jpg";
                  const wishlisted = isWishlisted(String(p.id));
                  const cartItem = cartItems.find((item) => String(item.productId) === String(p.id));
                  const itemQuantity = cartItem ? cartItem.quantity : 0;
                  const discount = p.originalPrice
                    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={p.id}
                      className="group bg-white border border-zinc-200/80 rounded-2xl p-2 flex flex-row items-start sm:items-center gap-3.5 sm:gap-5 hover:shadow-md transition-all"
                    >
                      {/* Product Image Frame with Top-Right Heart Icon */}
                      <Link
                        to={`/product/${p.id}`}
                        onClick={(e) => handleProductClick(e, p.id)}
                        className="w-28 sm:w-40 md:w-44 aspect-[3/3.5] sm:aspect-square bg-zinc-100 rounded-xl overflow-hidden shrink-0 relative block cursor-pointer"
                      >
                        <img
                          src={mainImg}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                          {discount > 0 && (
                            <span className="bg-[#80a17d] text-white text-[8px] sm:text-[9px] font-extrabold font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                              -{discount}%
                            </span>
                          )}
                        </div>

                        {/* Top Right Heart Wishlist Button inside Image */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(String(p.id));
                          }}
                          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-xs transition-colors z-10 cursor-pointer ${wishlisted
                              ? "bg-rose-500 text-white"
                              : "bg-white/80 text-zinc-700 hover:bg-white"
                            }`}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? "fill-current" : ""}`} />
                        </button>

                        {/* Quick View Hover Button (Tablet & Laptop) */}
                        <div className="absolute inset-x-2 bottom-2 z-20 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openQuickView(p.id);
                            }}
                            className="w-full bg-white/95 hover:bg-black hover:text-white text-zinc-900 font-extrabold text-xs tracking-wider uppercase py-2.5 px-3 rounded-xl shadow-lg border border-white/50 backdrop-blur-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Quick View</span>
                          </button>
                        </div>
                      </Link>

                      {/* Content Details */}
                      <div className="flex-1 text-left space-y-1 sm:space-y-1.5 py-0.5 min-w-0">
                        <span className="text-[11px] sm:text-[12px] font-semibold tracking-wider text-[#798A7A] block">
                          {p.category}
                        </span>

                        <Link to={`/product/${p.id}`} onClick={(e) => handleProductClick(e, p.id)}>
                          <h3 className="font-semibold text-zinc-900 text-xs sm:text-base line-clamp-1 group-hover:text-[#80a17d] transition-colors">
                            {p.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1 text-amber-500 text-[11px] sm:text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-zinc-800">{p.rating || 4.8}</span>
                          <span className="text-zinc-400 font-normal text-[10px]">
                            ({p.salesCount || 323})
                          </span>
                        </div>

                        <p className="text-[11px] sm:text-xs text-zinc-500 line-clamp-1 sm:line-clamp-2 leading-relaxed font-medium">
                          {p.shortDescription || p.fullDescription || "Seamless wire-free contour bra for 360-degree all-day comfort."}
                        </p>

                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="text-sm sm:text-base font-semibold text-zinc-900">
                            ₹{p.price}
                          </span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-[10px] sm:text-xs text-zinc-400 line-through font-semibold">
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Action Area: Matching Width & Height Add to Cart / Stepper */}
                        <div className="pt-1.5 flex items-center gap-2">
                          {itemQuantity > 0 ? (
                            <div
                              className="w-[128px] h-[36px] bg-black text-white text-xs font-medium px-2.5 rounded-xl shadow-xs flex items-center justify-between shrink-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (cartItem) updateQuantity(cartItem.id, cartItem.quantity - 1);
                                }}
                                className="w-5 h-5 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors font-black cursor-pointer active:scale-90"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                              <span className="text-xs font-semibold px-1">{itemQuantity}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (cartItem) updateQuantity(cartItem.id, cartItem.quantity + 1);
                                }}
                                className="w-5 h-5 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors font-black cursor-pointer active:scale-90"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                addToCart({
                                  productId: String(p.id),
                                  productName: p.name,
                                  brand: p.brand || "AARAMLY",
                                  colorName: "Classic Black",
                                  colorHex: "#000000",
                                  size: "S",
                                  price: p.price,
                                  originalPrice: p.originalPrice || p.price,
                                  image: mainImg,
                                  sku: p.sku || "AAR-SKU",
                                  quantity: 1,
                                })
                              }
                              className="w-[128px] h-[36px] bg-zinc-900 hover:bg-[#80a17d] text-white text-[12px] font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION BUTTONS (matching 1 2 3 > screenshot) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-md text-xs font-bold transition-all cursor-pointer ${isActive
                          ? "bg-zinc-900 text-white"
                          : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="w-9 h-9 rounded-md bg-white border border-zinc-200 text-zinc-700 text-xs font-bold hover:bg-zinc-100 transition-all cursor-pointer flex items-center justify-center"
                    aria-label="Next Page"
                  >
                    ›
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE DRAWER FILTERS (Opens from Left side) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-start">
          {/* Clickable Backdrop to close */}
          <div
            className="absolute inset-0"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative bg-white w-full max-w-xs h-full p-6 space-y-6 overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-bold text-zinc-900 text-sm font-semibold tracking-wider">
                Filter Catalog
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-zinc-900 rounded-full hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-6 h-6 stroke-1" />
              </button>
            </div>

            {FilterSidebar}

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-zinc-900 text-white font-semibold py-3 rounded-xl text-sm tracking-wider shadow-md cursor-pointer hover:bg-[#80a17d] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
