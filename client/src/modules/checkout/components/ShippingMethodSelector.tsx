import React from "react";
import { ShippingMethod } from "../types/checkout";
import { Truck, Zap, ShieldCheck } from "lucide-react";

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "Delivered directly to your doorstep in 5–7 business days",
    estimatedDays: "5–7 Business Days",
    price: 0
  },
  {
    id: "express",
    name: "Express Air Delivery",
    description: "Priority dispatch & fast air delivery in 2–3 business days",
    estimatedDays: "2–3 Business Days",
    price: 99
  }
];

interface ShippingMethodSelectorProps {
  selectedMethod: ShippingMethod;
  onSelectMethod: (method: ShippingMethod) => void;
}

export const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod
}) => {
  return (
    <div className="p-6 sm:p-7 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold text-xs shrink-0">
            3
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 uppercase tracking-tight">
              Shipping Method
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              Select your preferred delivery speed.
            </p>
          </div>
        </div>
        <Truck className="w-4 h-4 text-zinc-400 shrink-0" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {SHIPPING_METHODS.map((method) => {
          const isSelected = selectedMethod.id === method.id;
          return (
            <label
              key={method.id}
              onClick={() => onSelectMethod(method)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-zinc-900 shadow-md ring-1 ring-zinc-900"
                  : "bg-zinc-50/70 border-zinc-200 hover:border-zinc-400 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="shipping_method"
                    checked={isSelected}
                    onChange={() => onSelectMethod(method)}
                    className="w-4 h-4 text-zinc-900 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                      {method.id === "express" ? (
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      {method.name}
                    </span>
                    <span className="text-[11px] text-zinc-500 block font-normal mt-0.5">
                      {method.estimatedDays}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-xs text-zinc-900 block">
                    {method.price === 0 ? "FREE" : `₹${method.price}`}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 font-normal mt-3 border-t border-zinc-100 pt-2">
                {method.description}
              </p>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingMethodSelector;
