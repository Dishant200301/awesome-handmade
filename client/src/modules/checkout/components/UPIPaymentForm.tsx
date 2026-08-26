import React from "react";
import { UPIPaymentDetails } from "../types/checkout";
import { Smartphone, CheckCircle } from "lucide-react";

interface UPIPaymentFormProps {
  upiDetails: UPIPaymentDetails;
  onChangeUPIDetails: (details: UPIPaymentDetails) => void;
  error?: string;
}

export const UPI_APPS = [
  { name: "Google Pay", color: "bg-blue-50 text-blue-800 border-blue-200" },
  { name: "PhonePe", color: "bg-purple-50 text-purple-800 border-purple-200" },
  { name: "Paytm", color: "bg-cyan-50 text-cyan-800 border-cyan-200" },
  { name: "BHIM", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
];

export const UPIPaymentForm: React.FC<UPIPaymentFormProps> = ({
  upiDetails,
  onChangeUPIDetails,
  error
}) => {
  return (
    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 font-sans animate-in fade-in">
      <div className="flex items-center gap-2">
        <Smartphone className="w-4 h-4 text-zinc-700" />
        <span className="text-xs font-bold text-zinc-900 uppercase">
          Pay via Instant UPI / VPA
        </span>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-zinc-800">
          Virtual Payment Address (UPI ID) *
        </label>
        <input
          type="text"
          placeholder="e.g. mobileNumber@upi or username@okicici"
          value={upiDetails.vpa}
          onChange={(e) => onChangeUPIDetails({ vpa: e.target.value })}
          className={`w-full px-3.5 py-2 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none transition-all ${
            error ? "border-red-400 bg-red-50/20" : "border-zinc-200 focus:border-zinc-900"
          }`}
        />
        {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
      </div>

      {/* SUPPORTED UPI APPS BADGES */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[10px] text-zinc-400 font-medium">Supported Apps:</span>
        {UPI_APPS.map((app) => (
          <span key={app.name} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${app.color}`}>
            {app.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UPIPaymentForm;
