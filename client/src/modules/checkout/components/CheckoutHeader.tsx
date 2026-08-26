import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/modules/core/components/Navbar";

interface CheckoutHeaderProps {
  activeStep?: 1 | 2 | 3;
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ activeStep = 2 }) => {
  return (
    <div className="w-full">
      {/* Top Storefront Navbar */}
      <Navbar />

      {/* 3-Step Checkout Progress Bar matching standard eCommerce design 1:1 */}
      <section className="pt-24 pb-6 bg-zinc-50/80 border-b border-zinc-200/80 font-sans selection:bg-black selection:text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 flex items-center justify-center">
          <nav aria-label="Checkout Progress Step Indicator" className="flex items-center gap-2.5 sm:gap-6 text-[11px] sm:text-sm uppercase tracking-wider font-semibold select-none">
            {/* STEP 1: SHOPPING CART */}
            <Link
              to="/cart"
              className={`flex items-center gap-2 transition-colors ${
                activeStep >= 1 ? "text-zinc-900 font-bold hover:text-black" : "text-zinc-400 font-medium"
              }`}
            >
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  activeStep >= 1 ? "bg-zinc-900 text-white shadow-2xs" : "border border-zinc-300 text-zinc-400 bg-white"
                }`}
              >
                1
              </span>
              <span>SHOPPING CART</span>
            </Link>

            {/* DIVIDER LINE 1 */}
            <div className="w-8 sm:w-16 h-[1px] bg-zinc-300 shrink-0" />

            {/* STEP 2: CHECKOUT */}
            <div
              className={`flex items-center gap-2 transition-colors ${
                activeStep >= 2 ? "text-zinc-900 font-bold" : "text-zinc-400 font-medium"
              }`}
            >
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  activeStep >= 2 ? "bg-zinc-900 text-white shadow-2xs" : "border border-zinc-300 text-zinc-400 bg-white"
                }`}
              >
                2
              </span>
              <span>CHECKOUT</span>
            </div>

            {/* DIVIDER LINE 2 */}
            <div className="w-8 sm:w-16 h-[1px] bg-zinc-300 shrink-0" />

            {/* STEP 3: ORDER STATUS */}
            <div
              className={`flex items-center gap-2 transition-colors ${
                activeStep === 3 ? "text-zinc-900 font-bold" : "text-zinc-400 font-medium"
              }`}
            >
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  activeStep === 3 ? "bg-zinc-900 text-white shadow-2xs" : "border border-zinc-300 text-zinc-400 bg-white"
                }`}
              >
                3
              </span>
              <span>ORDER STATUS</span>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default CheckoutHeader;
