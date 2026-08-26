import React from "react";
import { CheckoutContact } from "../types/checkout";
import { Mail, Phone, UserCheck } from "lucide-react";

interface ContactInformationProps {
  contact: CheckoutContact;
  onChangeContact: (contact: CheckoutContact) => void;
  errors?: { email?: string; phone?: string };
}

export const ContactInformation: React.FC<ContactInformationProps> = ({
  contact,
  onChangeContact,
  errors = {}
}) => {
  return (
    <div className="p-6 sm:p-7 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold text-xs shrink-0">
            1
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 uppercase tracking-tight">
              Contact Information
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              We'll send order updates &amp; tracking info here.
            </p>
          </div>
        </div>
        <UserCheck className="w-4 h-4 text-zinc-400 shrink-0" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* EMAIL INPUT */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="e.g. name@example.com"
              value={contact.email}
              onChange={(e) => onChangeContact({ ...contact, email: e.target.value })}
              className={`w-full pl-9 pr-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium text-zinc-900 focus:outline-none transition-all ${
                errors.email
                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                  : "border-zinc-200 focus:border-zinc-900"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-semibold text-red-600 animate-in fade-in">
              {errors.email}
            </p>
          )}
        </div>

        {/* MOBILE NUMBER INPUT */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Mobile Number *
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center gap-1.5 text-zinc-500 font-semibold text-xs border-r border-zinc-200 pr-2">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>+91</span>
            </div>
            <input
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={contact.phone}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "");
                onChangeContact({ ...contact, phone: cleaned });
              }}
              className={`w-full pl-16 pr-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium text-zinc-900 focus:outline-none transition-all ${
                errors.phone
                  ? "border-red-400 bg-red-50/20 focus:border-red-500"
                  : "border-zinc-200 focus:border-zinc-900"
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] font-semibold text-red-600 animate-in fade-in">
              {errors.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
