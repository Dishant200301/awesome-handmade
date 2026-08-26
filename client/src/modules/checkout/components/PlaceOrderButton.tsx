import React from "react";
import { Loader2, ArrowRight, Lock } from "lucide-react";

interface PlaceOrderButtonProps {
  grandTotal: number;
  isSubmitting: boolean;
  onClick: () => void;
}

export const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  grandTotal,
  isSubmitting,
  onClick
}) => {
  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={onClick}
      className="w-full py-4 px-6 bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-bold tracking-[0.16em] uppercase rounded-xl transition-all shadow-md flex items-center justify-between gap-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
    >
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
        <span>
          {isSubmitting ? "Processing Order..." : "Place Order"}
        </span>
      </div>

      {isSubmitting ? (
        <Loader2 className="w-5 h-5 animate-spin text-white" />
      ) : (
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-extrabold text-white">
            ₹{grandTotal.toLocaleString("en-IN")}
          </span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </button>
  );
};

export default PlaceOrderButton;
