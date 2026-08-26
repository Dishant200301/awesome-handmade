import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { useWishlist } from "@/modules/product/context/WishlistContext";
import { useCart } from "@/modules/product/context/CartContext";
import { useAuth } from "@/modules/core/context/AuthContext";
import { getLiveProductsList } from "@/modules/core/lib/apiStore";

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const YouTubeIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

/* ---------- BRAND LOGO ---------- */
export function AaramlyLogo({
  className = "",
  showText = true,
  active = true,
}: {
  className?: string;
  showText?: boolean;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src="/images/home/logo.png"
        alt="Aaramly Logo"
        className={`h-7 sm:h-8 md:h-9 w-auto object-contain transition-all duration-300 ${
          active ? "" : "brightness-0"
        }`}
        loading="eager"
      />
      {showText && (
        <img
          src="/images/home/aaramly_text_logo.png"
          alt="Aaramly"
          className={`h-6 sm:h-7 md:h-8 w-auto object-contain transition-all duration-300 ${
            active ? "" : "brightness-0"
          }`}
          loading="eager"
        />
      )}
    </div>
  );
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Shop by Categories", mega: true, key: "categories" },
  { label: "Curated Collections", mega: true, key: "collections" },
  { label: "Bralettes", href: "/shop?category=Bralettes" },
  { label: "Everyday Bras", href: "/shop?category=Everyday Bras" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const announcements = [
  "Free express delivery on prepaid orders above ₹999",
  "100% Wire-Free & Zero Skin-Pinching Comfort Guarantee",
  "Extra 15% OFF your first order with code: AARAMLY15",
  "Try Risk-Free 30-Day Easy Exchanges & Returns",
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { wishlistCount } = useWishlist();
  const { totalItemsCount, totalPrice, setIsCartOpen } = useCart();
  const { isLoggedIn, user, openAuthModal } = useAuth();
  const firstName = user?.name ? user.name.split(" ")[0] : "Account";
  const allProducts = getLiveProductsList();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
        setIsFading(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Close overlays on navigation
  useEffect(() => {
    setMobileOpen(false);
    setOpenMega(null);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMegaEnter = (key: string) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setOpenMega(key);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setOpenMega(null);
    }, 150);
  };

  const handleAccountClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
    } else {
      navigate("/account");
    }
  };

  const searchResults = searchQuery.trim() === ""
    ? []
    : allProducts.filter(p =>
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="w-full bg-[#1A1A1A] text-white select-none relative z-50">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-3 sm:px-6 py-2 min-h-[36px] gap-2">
          <div className="flex-1 text-left overflow-hidden">
            <p className={`text-[11px] font-medium tracking-wide sm:text-xs text-white transition-all duration-300 transform truncate sm:whitespace-normal ${
              isFading ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
            }`}>
              {announcements[announcementIndex]}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-white/80 shrink-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <FacebookIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 hover:bg-[#E1306C] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
            <a
              href="https://wa.me/919824302072"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <WhatsAppIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <YouTubeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Header with Solid Luxury Styling */}
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
          scrolled ? "shadow-md border-b border-zinc-200" : "shadow-xs border-b border-zinc-100"
        }`}
      >
        <div className="bg-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            
            {/* Left: Contact Info (Desktop >= 1130px) */}
            <div className="hidden flex-1 items-center gap-4 text-xs font-medium text-zinc-600 min-[1130px]:flex">
              <a href="tel:+919824302072" className="inline-flex items-center gap-1.5 hover:text-[#80a17d] transition-colors">
                <Phone className="h-4 w-4 text-[#80a17d] stroke-[1.5] shrink-0" /> +91 98243 02072
              </a>
              <a href="mailto:hello@aaramly.com" className="inline-flex items-center gap-1.5 hover:text-[#80a17d] transition-colors">
                <Mail className="h-4 w-4 text-[#80a17d] stroke-[1.5] shrink-0" /> hello@aaramly.com
              </a>
            </div>

            {/* Center / Left: Logo */}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2.5 min-[1130px]:flex-1 min-[1130px]:justify-center group"
            >
              <AaramlyLogo active={true} />
            </Link>

            {/* Right: Search & Action Icons */}
            <div className="flex flex-1 items-center justify-end gap-2 min-[1130px]:gap-3 text-zinc-800">
              
              {/* Desktop Pill Search Bar */}
              <div className="relative hidden min-[1130px]:block w-48 xl:w-56">
                <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-800 transition focus-within:border-[#80a17d] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#80a17d]/20">
                  <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Aaramly..."
                    className="w-full bg-transparent outline-none placeholder:text-zinc-400 text-zinc-800 text-xs"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                      <X className="h-3 w-3 text-zinc-400 hover:text-zinc-700" />
                    </button>
                  )}
                </div>

                {/* Inline Search Autocomplete Dropdown */}
                {searchQuery.trim() !== "" && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-3 shadow-2xl z-50 animate-fade-slide-down">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Matching Products ({searchResults.length})
                    </p>
                    {searchResults.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-2 text-center">No products found</p>
                    ) : (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto">
                        {searchResults.map((prod) => (
                          <Link
                            key={prod.id}
                            to={`/product/${prod.id}`}
                            onClick={() => setSearchQuery("")}
                            className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={prod.image || (prod.images && prod.images[0]) || "/images/home/sports_bra.png"}
                                alt={prod.name}
                                className="h-9 w-9 rounded-md object-cover shrink-0"
                              />
                              <div className="text-left">
                                <p className="text-xs font-medium text-zinc-900 truncate max-w-[150px]">{prod.name}</p>
                                <p className="text-[11px] font-bold text-[#80a17d]">₹{prod.price}</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-[#80a17d] hover:underline">+ View</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop User / Account Icon */}
              <button
                onClick={handleAccountClick}
                aria-label="Account"
                className="hidden min-[1130px]:flex items-center gap-1.5 h-9 px-2 rounded-full text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                title={isLoggedIn ? `Logged in as ${user?.name || "User"}` : "Sign In / Register"}
              >
                <User className="h-4.5 w-4.5 stroke-[1.5]" />
                {isLoggedIn && (
                  <span className="text-xs font-bold text-zinc-900 max-w-[90px] truncate">
                    {firstName}
                  </span>
                )}
              </button>

              {/* Wishlist Button with Badge */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative grid h-9 w-9 place-items-center rounded-full text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                title="My Wishlist"
              >
                <Heart className="h-4.5 w-4.5 stroke-[1.5] text-[#D84A6B]" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-[16px] px-1 place-items-center rounded-full text-[10px] font-bold text-white bg-[#D84A6B] shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button with Total & Badge */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
                className="relative flex items-center gap-1.5 h-9 px-2.5 rounded-full text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
              >
                <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5] text-[#2e5d4e]" />
                {totalItemsCount > 0 && (
                  <span className="grid h-4 min-w-[16px] px-1 place-items-center rounded-full text-[10px] font-bold text-white bg-[#2e5d4e] shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
                {totalPrice > 0 && (
                  <span className="hidden xl:inline text-xs font-bold text-zinc-900 ml-0.5">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </button>

              {/* Mobile & Tablet Hamburger Menu Toggle (< 1130px) */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="grid h-9 w-9 place-items-center rounded-full text-zinc-800 hover:bg-zinc-100 transition min-[1130px]:hidden cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links & Mega Dropdowns (>= 1130px) */}
          <nav className="hidden border-t border-zinc-100 bg-white min-[1130px]:block relative">
            <ul
              className="mx-auto flex max-w-[1500px] items-center justify-center gap-8 px-6 py-2.5 text-sm font-medium text-zinc-700 bg-white"
              onMouseLeave={handleMegaLeave}
            >
              {navLinks.map((link) => (
                <li
                  key={link.label}
                  className="relative py-1"
                  onMouseEnter={() => link.mega ? handleMegaEnter(link.key) : handleMegaLeave()}
                >
                  <Link
                    to={link.href || "#"}
                    className={`inline-flex items-center gap-1.5 py-1 transition ${
                      pathname === link.href || openMega === link.key
                        ? "text-[#2e5d4e] font-semibold border-b-2 border-[#2e5d4e] pb-0.5"
                        : "hover:text-[#2e5d4e]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.mega && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          openMega === link.key ? "rotate-180 text-[#2e5d4e]" : "text-zinc-400"
                        }`}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mega Menu Dropdown: Categories */}
            {openMega === "categories" && (
              <div
                className="absolute left-0 right-0 top-full w-full bg-white border-t border-b border-zinc-200 shadow-2xl animate-fade-slide-down z-50"
                onMouseEnter={() => handleMegaEnter("categories")}
                onMouseLeave={handleMegaLeave}
              >
                <div className="mx-auto max-w-[1500px] px-8 py-8 bg-white">
                  <div className="grid grid-cols-12 gap-8 items-start">
                    
                    {/* Left: 3 Columns of Categories (Col Span 7) */}
                    <div className="col-span-7 grid grid-cols-3 gap-8">
                      {/* Col 1: Everyday & Bras */}
                      <div className="space-y-2.5">
                        <h4 className="font-bold text-sm text-[#2e5d4e] tracking-tight flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#80a17d]" /> Bras & Intimates
                        </h4>
                        <ul className="space-y-2 text-xs text-zinc-600">
                          <li>
                            <Link to="/shop?category=Everyday Bras" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Everyday Wirefree Bras
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Bralettes" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Lace & Cotton Bralettes
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Sports Bra" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Active Sports Bras
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=T-Shirt Bra" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Seamless T-Shirt Bras
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Zero-Feel" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Zero-Feel Comfort Bra
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Col 2: Shapewear & Bottoms */}
                      <div className="space-y-2.5">
                        <h4 className="font-bold text-sm text-[#2e5d4e] tracking-tight flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#80a17d]" /> Shapewear & Bottoms
                        </h4>
                        <ul className="space-y-2 text-xs text-zinc-600">
                          <li>
                            <Link to="/shop?category=Shapewear" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Seamless Body Shapewear
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Panties" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Breathable Pure Cotton Panties
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Period Panty" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Leak-Proof Period Panties
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Innerwear Top" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Camisoles & Innerwear Tops
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Athleisure" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Athleisure Lounge Sets
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Col 3: Accessories */}
                      <div className="space-y-2.5">
                        <h4 className="font-bold text-sm text-[#2e5d4e] tracking-tight flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#80a17d]" /> Accessories & Care
                        </h4>
                        <ul className="space-y-2 text-xs text-zinc-600">
                          <li>
                            <Link to="/shop?category=Accessories" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Silicone Nipple Covers
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Accessories" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Invisible Backless Solutions
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Accessories" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Delicate Bra Wash Bags
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop?category=Accessories" className="hover:text-[#2e5d4e] hover:translate-x-1 inline-block transition-transform">
                              Soft Extenders & Straps
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Right: 3 Visual Highlight Cards (Col Span 5) */}
                    <div className="col-span-5 grid grid-cols-3 gap-4">
                      <Link
                        to="/shop?category=Sports Bra"
                        className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-md hover:shadow-xl transition-all duration-300 bg-[#FAF8F4] border border-zinc-100"
                      >
                        <img
                          src="/images/home/sports_bra.png"
                          alt="Sports Bra"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-2 right-2">
                          <div className="w-full py-2 px-1 bg-white text-zinc-900 font-bold text-[11px] leading-tight text-center rounded-xl shadow-md border border-zinc-100 group-hover:bg-[#2e5d4e] group-hover:text-white transition-colors">
                            Sports Bra
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/shop?category=Panties"
                        className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-md hover:shadow-xl transition-all duration-300 bg-[#FAF8F4] border border-zinc-100"
                      >
                        <img
                          src="/images/home/panties.png"
                          alt="Cotton Panties"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-2 right-2">
                          <div className="w-full py-2 px-1 bg-white text-zinc-900 font-bold text-[11px] leading-tight text-center rounded-xl shadow-md border border-zinc-100 group-hover:bg-[#2e5d4e] group-hover:text-white transition-colors">
                            Panties
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/shop?category=Shapewear"
                        className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-md hover:shadow-xl transition-all duration-300 bg-[#FAF8F4] border border-zinc-100"
                      >
                        <img
                          src="/images/home/shapewear.png"
                          alt="Shapewear"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-2 right-2">
                          <div className="w-full py-2 px-1 bg-white text-zinc-900 font-bold text-[11px] leading-tight text-center rounded-xl shadow-md border border-zinc-100 group-hover:bg-[#2e5d4e] group-hover:text-white transition-colors">
                            Shapewear
                          </div>
                        </div>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Mega Menu Dropdown: Curated Collections */}
            {openMega === "collections" && (
              <div
                className="absolute left-0 right-0 top-full w-full bg-white border-t border-b border-zinc-200 shadow-2xl animate-fade-slide-down z-50"
                onMouseEnter={() => handleMegaEnter("collections")}
                onMouseLeave={handleMegaLeave}
              >
                <div className="mx-auto max-w-[1500px] px-8 py-8 bg-white">
                  <div className="grid grid-cols-4 gap-6">
                    <Link
                      to="/shop?category=Everyday Bras"
                      className="group relative overflow-hidden rounded-2xl aspect-[4/3] block shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img src="/images/home/hero/hero-1.png" alt="Zero Feel Everyday" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="font-bold text-sm block">Zero-Feel Everyday Collection</span>
                        <p className="text-[11px] text-white/80">Invisible & ultra-soft wirefree fit</p>
                      </div>
                    </Link>

                    <Link
                      to="/shop?category=Bralettes"
                      className="group relative overflow-hidden rounded-2xl aspect-[4/3] block shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img src="/images/home/hero/hero-2.png" alt="Lace Bralette Studio" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="font-bold text-sm block">Signature Lace Bralette Studio</span>
                        <p className="text-[11px] text-white/80">Support without the poke</p>
                      </div>
                    </Link>

                    <Link
                      to="/shop?category=Athleisure"
                      className="group relative overflow-hidden rounded-2xl aspect-[4/3] block shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img src="/images/home/athleisure.png" alt="Active Athleisure" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="font-bold text-sm block">Active Comfort & Athleisure</span>
                        <p className="text-[11px] text-white/80">Flexibility for every movement</p>
                      </div>
                    </Link>

                    <Link
                      to="/shop?category=Accessories"
                      className="group relative overflow-hidden rounded-2xl aspect-[4/3] block shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img src="/images/home/hero/hero-3.png" alt="Invisible Silicone" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="font-bold text-sm block">Silicone & Backless Solutions</span>
                        <p className="text-[11px] text-white/80">Seamless confidence all day</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* 3. Mobile Slide-in Left Drawer (< 1130px) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 min-[1130px]:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 bg-[#FAF8F4]">
                  <AaramlyLogo active={true} />
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <X className="h-6 w-6 stroke-[1.5]" />
                  </button>
                </div>

                {/* Mobile Search Input */}
                <div className="p-3 border-b border-zinc-100 bg-[#FAF8F4]">
                  <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800">
                    <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Aaramly..."
                      className="w-full bg-transparent outline-none placeholder:text-zinc-400 text-zinc-800 text-xs"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")}>
                        <X className="h-3 w-3 text-zinc-400 hover:text-zinc-700" />
                      </button>
                    )}
                  </div>

                  {searchQuery.trim() !== "" && (
                    <div className="mt-2 max-h-52 overflow-y-auto space-y-1.5 bg-white p-2 rounded-xl border border-zinc-200 shadow-inner">
                      {searchResults.length === 0 ? (
                        <p className="text-xs text-zinc-500 py-1 text-center">No products found</p>
                      ) : (
                        searchResults.map((prod) => (
                          <Link
                            key={prod.id}
                            to={`/product/${prod.id}`}
                            onClick={() => {
                              setMobileOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={prod.image || (prod.images && prod.images[0]) || "/images/home/sports_bra.png"}
                                alt={prod.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                              <div>
                                <p className="text-xs font-medium text-zinc-900 truncate max-w-[140px]">{prod.name}</p>
                                <p className="text-[10px] font-bold text-[#80a17d]">₹{prod.price}</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-[#80a17d]">+ View</span>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Links */}
                <ul className="px-2 py-2 text-sm font-medium text-zinc-800 bg-white">
                  {navLinks.map((link) =>
                    link.mega ? (
                      <li key={link.label} className="border-b border-zinc-100">
                        <button
                          type="button"
                          onClick={() => setMobileExpanded((v) => (v === link.key ? null : link.key))}
                          className="flex w-full items-center justify-between px-3 py-3 hover:text-[#2e5d4e]"
                        >
                          <span>{link.label}</span>
                          <ChevronDown className={`h-4 w-4 text-[#80a17d] transition-transform ${mobileExpanded === link.key ? "rotate-180" : ""}`} />
                        </button>
                        {mobileExpanded === link.key && (
                          <div className="pb-2 pl-4 animate-fade-slide-down border-l-2 border-[#80a17d]/40 ml-3 mb-2 space-y-1.5 text-xs text-zinc-600">
                            <Link to="/shop?category=Everyday Bras" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-[#2e5d4e]">
                              • Everyday Wirefree Bras
                            </Link>
                            <Link to="/shop?category=Bralettes" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-[#2e5d4e]">
                              • Lace & Cotton Bralettes
                            </Link>
                            <Link to="/shop?category=Shapewear" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-[#2e5d4e]">
                              • Seamless Body Shapewear
                            </Link>
                            <Link to="/shop?category=Panties" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-[#2e5d4e]">
                              • Pure Cotton Panties
                            </Link>
                            <Link to="/shop?category=Accessories" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-[#2e5d4e]">
                              • Silicone Covers & Accessories
                            </Link>
                          </div>
                        )}
                      </li>
                    ) : (
                      <li key={link.label} className="border-b border-zinc-100">
                        <Link
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-3 hover:text-[#2e5d4e]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  )}

                  {/* Wishlist in Mobile */}
                  <li className="border-b border-zinc-100">
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-between px-3 py-3 hover:text-[#2e5d4e]"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-[#D84A6B]" /> Wishlist
                      </span>
                      {wishlistCount > 0 && (
                        <span className="rounded-full bg-[#D84A6B] px-2 py-0.5 text-[10px] font-bold text-white">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </li>

                  {/* Cart in Mobile */}
                  <li className="border-b border-zinc-100">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="flex w-full items-center justify-between px-3 py-3 hover:text-[#2e5d4e] text-left"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-[#2e5d4e]" /> Shopping Bag
                      </span>
                      {totalItemsCount > 0 && (
                        <span className="rounded-full bg-[#2e5d4e] px-2 py-0.5 text-[10px] font-bold text-white">
                          {totalItemsCount}
                        </span>
                      )}
                    </button>
                  </li>

                  {/* Account */}
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        handleAccountClick();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-3 hover:text-[#2e5d4e] text-left"
                    >
                      <User className="h-4 w-4 text-zinc-500" />
                      <span>{isLoggedIn ? `Account (${firstName})` : "Login / Register"}</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-[#FAF8F4] border-t border-zinc-200 text-xs text-zinc-600 space-y-1">
                <p className="font-semibold text-zinc-900">Aaramly Intimates</p>
                <p className="text-[11px]">Wire-Free & Zero-Feel Comfort</p>
                <p className="font-medium text-[#2e5d4e]">+91 98243 02072</p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
