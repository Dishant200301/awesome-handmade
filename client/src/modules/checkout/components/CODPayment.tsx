import React from "react";
import { Banknote, CheckCircle, Info } from "lucide-react";

interface CODPaymentProps {
  isAvailable?: boolean;
}

export const CODPayment: React.FC<CODPaymentProps> = ({ isAvailable = true }) => {
  return (
    <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2 font-sans animate-in fade-in">
      <div className="flex items-center gap-2">
        <Banknote className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="text-xs font-bold text-amber-900 uppercase">
          Cash on Delivery (COD)
        </span>
      </div>

      {isAvailable ? (
        <div className="flex items-start gap-2 text-xs text-amber-800">
          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Cash on Delivery is available for your pincode. Pay in cash or UPI when your order arrives.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2 text-xs text-rose-800">
          <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Cash on Delivery is not available for this order or selected location. Please use UPI or Card.
          </p>
        </div>
      )}
    </div>
  );
};

export default CODPayment;
