import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
  ChevronRight,
} from "lucide-react";
import { useWishlist } from "@/modules/product/context/WishlistContext";
import { useCart } from "@/modules/product/context/CartContext";
import { useAuth } from "@/modules/core/context/AuthContext";
import { getLiveProductsList } from "@/modules/core/lib/apiStore";
import AnnouncementBar from "./AnnouncementBar";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Bralette", href: "/shop?category=Bralettes" },
  { label: "Seamless Bra", href: "/shop?category=Everyday Bras" },
  { label: "Silicone Covers", href: "/shop?category=Accessories" },
  { label: "Contact", href: "/contact" },
];

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
        className={`h-6 sm:h-7 md:h-8 w-auto object-contain transition-all duration-300 ${
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

/* ---------- BADGE COMPONENT ---------- */
function Badge({ count, color = "bg-[#80a17d]" }: { count: number; color?: string }) {
  if (!count || count <= 0) return null;
  return (
    <span
      className={`absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full ${color} px-1 text-[10px] font-bold text-white shadow-xs`}
    >
      {count}
    </span>
  );
}

/* ---------- MAIN NAVBAR COMPONENT ---------- */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { wishlistCount } = useWishlist();
  const { totalItemsCount, totalPrice, setIsCartOpen } = useCart();
  const { isLoggedIn, user, openAuthModal } = useAuth();
  const firstName = user?.name ? user.name.split(" ")[0] : "Account";
  const allProducts = getLiveProductsList();

  // Close overlays on navigation
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Scroll listener: Transparent at top (scrollY <= 10), solid white on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ESC key handler for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const searchResults =
    query.trim().length > 0
      ? allProducts
          .filter(
            (p) =>
              (p.name || "").toLowerCase().includes(query.toLowerCase()) ||
              (p.category || "").toLowerCase().includes(query.toLowerCase()) ||
              (p.brand || "").toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const handleAccountClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
    } else {
      navigate("/account");
    }
  };

  const isBgSolid = scrolled || mobileOpen || searchOpen;

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isBgSolid
            ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs text-zinc-900"
            : "bg-white border-b border-zinc-200/80 shadow-2xs text-zinc-900"
        }`}
      >
        <div className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          
          {/* MOBILE VIEW (< md): Logo on Left + Wishlist Icon (Left of Menu) & Hamburger Menu on Right */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center h-10 cursor-pointer">
              <AaramlyLogo active={isBgSolid} />
            </Link>

            {/* Right: Wishlist Icon (on left side of menu) + Hamburger Menu */}
            <div className="flex items-center gap-3.5 text-zinc-800">
              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative flex items-center cursor-pointer text-zinc-800 hover:text-[#80a17d] transition-colors p-1"
                title="My Wishlist"
              >
                <Heart className="h-5.5 w-5.5 stroke-[1.5]" />
                <Badge count={wishlistCount} color="bg-[#80a17d]" />
              </Link>

              {/* Custom Hamburger Button */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex flex-col items-end justify-center w-7 h-7 gap-1.5 focus:outline-none cursor-pointer p-1 group ml-1"
              >
                <span className="h-[2px] w-6 bg-zinc-900 transition-all group-hover:bg-[#80a17d]" />
                <span className="h-[2px] w-4 bg-zinc-900 transition-all group-hover:w-6 group-hover:bg-[#80a17d]" />
                <span className="h-[2px] w-6 bg-zinc-900 transition-all group-hover:bg-[#80a17d]" />
              </button>
            </div>
          </div>

          {/* TABLET & LAPTOP VIEW (md to xl): Logo on Left + All Icons (Account, Search, Wishlist, Hamburger) on Right */}
          <div className="hidden md:flex xl:hidden items-center justify-between w-full">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center h-10 cursor-pointer">
              <AaramlyLogo active={isBgSolid} />
            </Link>

            {/* Right: All Action Icons (Account, Search, Wishlist) + Hamburger Menu */}
            <div className="flex items-center gap-4 text-zinc-800">
              {/* Account Icon */}
              <button
                onClick={handleAccountClick}
                aria-label="Account"
                className="flex items-center gap-1.5 cursor-pointer text-zinc-800 hover:text-[#80a17d] transition-colors p-1"
                title={isLoggedIn ? `Logged in as ${user?.name || "User"}` : "Sign In / Register"}
              >
                <User className="h-5.5 w-5.5 stroke-[1.5]" />
                {isLoggedIn && (
                  <span className="text-xs font-bold text-zinc-900 tracking-tight max-w-[100px] truncate">
                    {firstName}
                  </span>
                )}
              </button>

              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className="flex items-center cursor-pointer text-zinc-800 hover:text-[#80a17d] transition-colors p-1"
                title="Search Products (Esc to close)"
              >
                <Search className="h-5.5 w-5.5 stroke-[1.5]" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative flex items-center cursor-pointer text-zinc-800 hover:text-[#80a17d] transition-colors p-1"
                title="My Wishlist"
              >
                <Heart className="h-5.5 w-5.5 stroke-[1.5]" />
                <Badge count={wishlistCount} color="bg-[#80a17d]" />
              </Link>

              {/* Custom Hamburger Button */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex flex-col items-end justify-center w-7 h-7 gap-1.5 focus:outline-none cursor-pointer p-1 group ml-1"
              >
                <span className="h-[2px] w-6 bg-zinc-900 transition-all group-hover:bg-[#80a17d]" />
                <span className="h-[2px] w-4 bg-zinc-900 transition-all group-hover:w-6 group-hover:bg-[#80a17d]" />
                <span className="h-[2px] w-6 bg-zinc-900 transition-all group-hover:bg-[#80a17d]" />
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW (>= xl): Logo on Left, Nav Links in Center, Icons on Right */}
          <div className="hidden xl:flex items-center justify-between w-full">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center h-10 cursor-pointer shrink-0">
              <AaramlyLogo active={isBgSolid} />
            </Link>

            {/* Center: Nav Links */}
            <nav className="flex items-center gap-8 mx-auto">
              {NAV_LINKS.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    to={l.href}
                    className={`text-[14px] leading-[20px] font-normal font-['Montserrat',ui-sans-serif,system-ui,sans-serif] not-italic transition-colors duration-200 ${
                      isActive
                        ? "text-[#80a17d] font-semibold"
                        : "text-[rgb(75,75,75)] hover:text-[#80a17d]"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Icons (Account, Search, Wishlist) */}
            <div className="flex items-center gap-5 xl:gap-6 text-zinc-800 shrink-0">
              {/* Account Icon */}
              <button
                onClick={handleAccountClick}
                aria-label="Account"
                className="flex items-center gap-1.5 cursor-pointer text-zinc-800 hover:text-[#80a17d] transition-colors p-1"
                title={isLoggedIn ? `Logged in as ${user?.name || "User"}` : "Sign In / Register"}
              >
                <User className="h-5.5 w-5.5 lg:h-6 lg:w-6 stroke-[1.5]" />
                {isLoggedIn && (
                  <span className="text-xs font-bold text-zinc-900 tracking-tight max-w-[110px] truncate">
                    {firstName}
                  </span>
                )}
              </button>

              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className="flex items-center cursor-pointer text-zinc-800 hover:text-[#80a17d] transition-colors p-1"
                title="Search Products (Esc to close)"
              >
                <Search className="h-5.5 w-5.5 lg:h-6 lg:w-6 stroke-[1.5]" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative flex items-center cursor-pointer text-zinc-800 hover:text-[#80a17d] transition-colors p-1"
                title="My Wishlist"
              >
                <Heart className="h-5.5 w-5.5 lg:h-6 lg:w-6 stroke-[1.5]" />
                <Badge count={wishlistCount} color="bg-[#80a17d]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Full-width Responsive Animated Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden border-t border-zinc-200/80 bg-white shadow-md"
            >
              <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center justify-between gap-4 border-b border-zinc-300 pb-3"
                >
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5] text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for bralettes, contour bras, silicone covers, colors…"
                    className="flex-1 bg-transparent text-sm sm:text-base md:text-lg font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                    className="p-1 rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                    aria-label="Close search"
                    title="Close Search (Esc)"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
                  </button>
                </form>

                {/* Instant Live Search Results */}
                {searchResults.length > 0 && (
                  <div className="border border-zinc-200 bg-white max-h-80 overflow-y-auto rounded-2xl p-3 shadow-lg">
                    <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-2 px-2">
                      Matching Products ({searchResults.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {searchResults.map((r) => (
                        <Link
                          key={r.id}
                          to={`/product/${r.id}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                          <img
                            src={
                              r.image ||
                              (r.images && r.images[0]) ||
                              "https://m.media-amazon.com/images/I/71LtEuQjqXL._SL1500_.jpg"
                            }
                            alt={r.name}
                            className="h-14 w-12 flex-none object-cover rounded-lg bg-zinc-100"
                          />
                          <div className="overflow-hidden">
                            <span className="text-xs font-bold text-zinc-900 group-hover:text-[#80a17d] transition-colors block truncate">
                              {r.name}
                            </span>
                            <span className="text-[11px] font-extrabold text-zinc-600 mt-0.5 block">
                              ₹{r.price}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Slide-in Left Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in Left Side Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
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

              {/* Drawer Navigation Links & Action Buttons */}
              <nav className="flex-1 overflow-y-auto py-2 bg-white">
                {/* Search Option (Mobile View Only < md) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full flex md:hidden items-center justify-between border-b border-zinc-100 px-5 py-3.5 text-[14px] leading-[20px] font-normal font-['Montserrat',ui-sans-serif,system-ui,sans-serif] text-[rgb(75,75,75)] hover:text-[#80a17d] hover:bg-zinc-50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4.5 w-4.5 text-zinc-500 stroke-[1.5]" />
                    <span>Search Catalog</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400 stroke-[1.5]" />
                </button>


                {/* Main Nav Links */}
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5 text-[14px] leading-[20px] font-normal font-['Montserrat',ui-sans-serif,system-ui,sans-serif] text-[rgb(75,75,75)] hover:text-[#80a17d] hover:bg-zinc-50 transition-colors"
                  >
                    <span>{l.label}</span>
                    <ChevronRight className="h-4 w-4 text-zinc-400 stroke-[1.5]" />
                  </Link>
                ))}

                {/* Account Button (Mobile View Only < md) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleAccountClick();
                  }}
                  className="w-full flex md:hidden items-center justify-between border-b border-zinc-100 px-5 py-3.5 text-[14px] leading-[20px] font-normal font-['Montserrat',ui-sans-serif,system-ui,sans-serif] text-[#80a17d] hover:bg-[#80a17d]/5 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-4.5 w-4.5 text-[#80a17d] stroke-[1.5]" />
                    <span>{isLoggedIn ? `My Account (${firstName})` : "Sign In / Register"}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#80a17d] stroke-[1.5]" />
                </button>
              </nav>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-zinc-200 flex justify-between text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                <span>© {new Date().getFullYear()} Aaramly</span>
                <Link to="/privacy" onClick={() => setMobileOpen(false)} className="hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
