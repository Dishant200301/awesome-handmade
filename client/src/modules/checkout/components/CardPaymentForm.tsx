import React from "react";
import { CardPaymentDetails } from "../types/checkout";
import { CreditCard, ShieldCheck } from "lucide-react";

interface CardPaymentFormProps {
  cardDetails: CardPaymentDetails;
  onChangeCardDetails: (details: CardPaymentDetails) => void;
  errors?: Record<string, string>;
}

export const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  cardDetails,
  onChangeCardDetails,
  errors = {}
}) => {
  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiry = (val: string) => {
    const v = val.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 font-sans animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-zinc-700" />
          <span className="text-xs font-bold text-zinc-900 uppercase">
            Credit / Debit Card Details
          </span>
        </div>
        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-zinc-800 mb-1 uppercase">Card Number *</label>
          <input
            type="text"
            maxLength={19}
            placeholder="XXXX XXXX XXXX XXXX"
            value={cardDetails.cardNumber}
            onChange={(e) => onChangeCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
            className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none ${
              errors.cardNumber ? "border-red-400" : "border-zinc-200 focus:border-zinc-900"
            }`}
          />
          {errors.cardNumber && <p className="text-[11px] font-semibold text-red-600 mt-0.5">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-800 mb-1 uppercase">Expiry Date *</label>
            <input
              type="text"
              maxLength={5}
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChange={(e) => onChangeCardDetails({ ...cardDetails, expiryDate: formatExpiry(e.target.value) })}
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none ${
                errors.expiryDate ? "border-red-400" : "border-zinc-200 focus:border-zinc-900"
              }`}
            />
            {errors.expiryDate && <p className="text-[11px] font-semibold text-red-600 mt-0.5">{errors.expiryDate}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-800 mb-1 uppercase">CVV / CVC *</label>
            <input
              type="password"
              maxLength={4}
              placeholder="***"
              value={cardDetails.cvv}
              onChange={(e) => onChangeCardDetails({ ...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, "") })}
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none ${
                errors.cvv ? "border-red-400" : "border-zinc-200 focus:border-zinc-900"
              }`}
            />
            {errors.cvv && <p className="text-[11px] font-semibold text-red-600 mt-0.5">{errors.cvv}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-zinc-800 mb-1 uppercase">Cardholder Name *</label>
          <input
            type="text"
            placeholder="Name as printed on card"
            value={cardDetails.cardholderName}
            onChange={(e) => onChangeCardDetails({ ...cardDetails, cardholderName: e.target.value })}
            className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-medium text-zinc-900 focus:outline-none ${
              errors.cardholderName ? "border-red-400" : "border-zinc-200 focus:border-zinc-900"
            }`}
          />
          {errors.cardholderName && <p className="text-[11px] font-semibold text-red-600 mt-0.5">{errors.cardholderName}</p>}
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
