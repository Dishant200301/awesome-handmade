import React, { useState } from "react";
import { Coupon } from "../types/checkout";
import { Tag, Check, X, Sparkles } from "lucide-react";

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    description: "10% OFF on all order items",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 499
  },
  {
    code: "AARAMLY100",
    description: "Flat ₹100 OFF on orders above ₹999",
    discountType: "fixed",
    discountValue: 100,
    minOrderValue: 999
  },
  {
    code: "FREESHIP",
    description: "Free Express Air Delivery",
    discountType: "fixed",
    discountValue: 99,
    freeShipping: true
  }
];

interface CouponInputProps {
  subtotal: number;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  subtotal,
  appliedCoupon,
  onApplyCoupon
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setErrorMessage("Please enter a coupon code.");
      return;
    }

    const found = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (!found) {
      setErrorMessage("Invalid coupon code. Try WELCOME10 or AARAMLY100");
      return;
    }

    if (found.minOrderValue && subtotal < found.minOrderValue) {
      setErrorMessage(`Minimum order value of ₹${found.minOrderValue} required for ${found.code}.`);
      return;
    }

    onApplyCoupon(found);
    setCouponCode("");
  };

  const handleRemove = () => {
    onApplyCoupon(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 uppercase tracking-wider">
        <Tag className="w-3.5 h-3.5 text-zinc-700" />
        <span>Apply Promo / Coupon Code</span>
      </div>

      {appliedCoupon ? (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <span className="font-bold text-emerald-900 block font-mono">
                {appliedCoupon.code} Applied
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                {appliedCoupon.description}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="text-xs font-bold text-emerald-800 hover:text-red-600 transition-colors p-1"
            title="Remove Coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter coupon code (e.g. WELCOME10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-bold uppercase text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer shrink-0"
            >
              Apply
            </button>
          </div>

          {errorMessage && (
            <p className="text-[11px] font-semibold text-red-600 animate-in fade-in">
              {errorMessage}
            </p>
          )}

          {/* QUICK PROMO BADGES */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-zinc-400 font-medium">Available:</span>
            {AVAILABLE_COUPONS.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCouponCode(c.code);
                  setErrorMessage(null);
                }}
                className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800 hover:bg-zinc-900 hover:text-white px-2 py-0.5 rounded-md transition-all border border-zinc-200 cursor-pointer"
              >
                {c.code}
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
};

export default CouponInput;
