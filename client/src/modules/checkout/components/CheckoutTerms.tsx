import React from "react";

interface CheckoutTermsProps {
  accepted: boolean;
  onToggleAccepted: (accepted: boolean) => void;
  error?: string;
}

export const CheckoutTerms: React.FC<CheckoutTermsProps> = ({
  accepted,
  onToggleAccepted,
  error
}) => {
  return (
    <div className="space-y-1.5 font-sans">
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onToggleAccepted(e.target.checked)}
          className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 mt-0.5 cursor-pointer"
        />
        <span className="text-xs text-zinc-700 font-normal leading-relaxed">
          I agree to the{" "}
          <a href="#" className="font-bold text-zinc-900 underline hover:text-black">
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="font-bold text-zinc-900 underline hover:text-black">
            Privacy Policy
          </a>.
        </span>
      </label>
      {error && (
        <p className="text-[11px] font-semibold text-red-600 animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default CheckoutTerms;
