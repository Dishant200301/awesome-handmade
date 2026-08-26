import React from "react";
import { Coupon, ShippingMethod } from "../types/checkout";
import { CartItem } from "@/modules/product/types/product";

interface PriceBreakdownProps {
  cartItems: CartItem[];
  shippingMethod: ShippingMethod;
  appliedCoupon: Coupon | null;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  cartItems,
  shippingMethod,
  appliedCoupon
}) => {
  // Subtotal (Sale price sum)
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Original Price Sum for discount calculation
  const originalSubtotal = cartItems.reduce((acc, item) => {
    const orig = item.originalPrice && item.originalPrice > item.price ? item.originalPrice : item.price;
    return acc + orig * item.quantity;
  }, 0);

  const productSavings = Math.max(0, originalSubtotal - subtotal);

  // Coupon Discount Calculation
  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      couponDiscountAmount = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && couponDiscountAmount > appliedCoupon.maxDiscount) {
        couponDiscountAmount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === "fixed") {
      couponDiscountAmount = appliedCoupon.discountValue;
    }
  }

  const shippingPrice = appliedCoupon?.freeShipping ? 0 : shippingMethod.price;
  const estimatedTax = Math.round(subtotal * 0.05); // 5% GST (Informational/Inclusive)
  const grandTotal = Math.max(0, subtotal - couponDiscountAmount + shippingPrice);

  return (
    <div className="space-y-3 pt-3 border-t border-zinc-200 text-xs font-sans text-zinc-800">
      <div className="flex justify-between items-center">
        <span className="text-zinc-600">Subtotal ({cartItems.length} items)</span>
        <span className="font-bold text-zinc-900 font-mono">
          ₹{subtotal.toLocaleString("en-IN")}
        </span>
      </div>

      {productSavings > 0 && (
        <div className="flex justify-between items-center text-emerald-700">
          <span className="font-medium">Product Retail Savings</span>
          <span className="font-bold font-mono">
            -₹{productSavings.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {appliedCoupon && couponDiscountAmount > 0 && (
        <div className="flex justify-between items-center text-emerald-700 font-semibold">
          <span>Coupon Discount ({appliedCoupon.code})</span>
          <span className="font-bold font-mono">
            -₹{couponDiscountAmount.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-zinc-600">Shipping ({shippingMethod.name})</span>
        <span className="font-bold text-zinc-900">
          {shippingPrice === 0 ? (
            <span className="text-emerald-700 font-bold uppercase">FREE</span>
          ) : (
            <span className="font-mono">₹{shippingPrice}</span>
          )}
        </span>
      </div>

      <div className="flex justify-between items-center text-zinc-500">
        <span>Estimated GST (5% Incl.)</span>
        <span className="font-mono">₹{estimatedTax.toLocaleString("en-IN")}</span>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-zinc-300 font-bold text-base text-zinc-900">
        <span>Grand Total</span>
        <span className="text-lg font-extrabold text-black font-mono">
          ₹{grandTotal.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
