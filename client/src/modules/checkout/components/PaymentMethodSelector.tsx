import React from "react";
import { PaymentMethodType, UPIPaymentDetails, CardPaymentDetails } from "../types/checkout";
import { UPIPaymentForm } from "./UPIPaymentForm";
import { CardPaymentForm } from "./CardPaymentForm";
import { CODPayment } from "./CODPayment";
import { CreditCard, Smartphone, Building2, Banknote, ShieldCheck } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedPayment: PaymentMethodType;
  onSelectPayment: (method: PaymentMethodType) => void;
  upiDetails: UPIPaymentDetails;
  onChangeUPIDetails: (details: UPIPaymentDetails) => void;
  cardDetails: CardPaymentDetails;
  onChangeCardDetails: (details: CardPaymentDetails) => void;
  errors?: Record<string, string>;
}

export const PAYMENT_METHODS: { id: PaymentMethodType; name: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "upi", name: "Instant UPI (GPay, PhonePe, Paytm)", icon: Smartphone },
  { id: "card", name: "Credit / Debit Card", icon: CreditCard },
  { id: "netbanking", name: "Net Banking (All Indian Banks)", icon: Building2 },
  { id: "cod", name: "Cash on Delivery (COD)", icon: Banknote },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPayment,
  onSelectPayment,
  upiDetails,
  onChangeUPIDetails,
  cardDetails,
  onChangeCardDetails,
  errors = {}
}) => {
  return (
    <div className="p-6 sm:p-7 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold text-xs shrink-0">
            4
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 uppercase tracking-tight">
              Payment Method
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              Choose your payment mode. Transactions are encrypted &amp; 100% secure.
            </p>
          </div>
        </div>
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
      </div>

      {/* OPTIONS RADIO LIST */}
      <div className="space-y-3">
        {PAYMENT_METHODS.map((pm) => {
          const Icon = pm.icon;
          const isSelected = selectedPayment === pm.id;
          return (
            <div key={pm.id} className="space-y-3">
              <label
                onClick={() => onSelectPayment(pm.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-white border-zinc-900 shadow-md ring-1 ring-zinc-900"
                    : "bg-zinc-50/70 border-zinc-200 hover:border-zinc-400 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={isSelected}
                    onChange={() => onSelectPayment(pm.id)}
                    className="w-4 h-4 text-zinc-900 cursor-pointer"
                  />
                  <Icon className={`w-4 h-4 ${isSelected ? "text-zinc-900" : "text-zinc-500"}`} />
                  <span className="font-bold text-xs text-zinc-900">
                    {pm.name}
                  </span>
                </div>
              </label>

              {/* EXPANDED INNER FORM */}
              {isSelected && pm.id === "upi" && (
                <UPIPaymentForm
                  upiDetails={upiDetails}
                  onChangeUPIDetails={onChangeUPIDetails}
                  error={errors.upiVpa}
                />
              )}

              {isSelected && pm.id === "card" && (
                <CardPaymentForm
                  cardDetails={cardDetails}
                  onChangeCardDetails={onChangeCardDetails}
                  errors={errors}
                />
              )}

              {isSelected && pm.id === "netbanking" && (
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-700 font-medium">
                  Select your bank at the next step via secure Net Banking gateway (SBI, HDFC, ICICI, Axis, Kotak, etc.).
                </div>
              )}

              {isSelected && pm.id === "cod" && (
                <CODPayment isAvailable={true} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
