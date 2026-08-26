import React from "react";
import { CartItem } from "@/modules/product/types/product";
import { Coupon, ShippingMethod } from "../types/checkout";
import { CheckoutProductItem } from "./CheckoutProductItem";
import { CouponInput } from "./CouponInput";
import { PriceBreakdown } from "./PriceBreakdown";
import { PlaceOrderButton } from "./PlaceOrderButton";
import { ShoppingBag } from "lucide-react";

interface OrderSummaryProps {
  cartItems: CartItem[];
  shippingMethod: ShippingMethod;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  shippingMethod,
  appliedCoupon,
  onApplyCoupon,
  onUpdateQuantity,
  onRemoveItem,
  isSubmitting,
  onPlaceOrder
}) => {
  // Calculate Subtotal & Grand Total
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
  const grandTotal = Math.max(0, subtotal - couponDiscountAmount + shippingPrice);

  return (
    <div className="p-6 sm:p-7 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-zinc-900 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 uppercase tracking-tight">
            Order Summary ({cartItems.length} items)
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-zinc-900">
          ₹{subtotal.toLocaleString("en-IN")}
        </span>
      </div>

      {/* DYNAMIC PRODUCT ITEMS LIST */}
      <div className="divide-y divide-zinc-100 max-h-[380px] overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <CheckoutProductItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>

      {/* COUPON INPUT */}
      <div className="pt-2">
        <CouponInput
          subtotal={subtotal}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={onApplyCoupon}
        />
      </div>

      {/* PRICE BREAKDOWN */}
      <PriceBreakdown
        cartItems={cartItems}
        shippingMethod={shippingMethod}
        appliedCoupon={appliedCoupon}
      />

      {/* PLACE ORDER BUTTON */}
      <div className="pt-2">
        <PlaceOrderButton
          grandTotal={grandTotal}
          isSubmitting={isSubmitting}
          onClick={onPlaceOrder}
        />
      </div>
    </div>
  );
};

export default OrderSummary;
