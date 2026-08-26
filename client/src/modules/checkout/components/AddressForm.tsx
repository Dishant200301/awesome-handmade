import React, { useState } from "react";
import { ShippingAddress } from "../types/checkout";
import { SavedAddressCard } from "./SavedAddressCard";
import { MapPin, Plus, ChevronDown } from "lucide-react";

interface AddressFormProps {
  address: ShippingAddress;
  onChangeAddress: (address: ShippingAddress) => void;
  savedAddresses?: ShippingAddress[];
  onSelectSavedAddress?: (saved: ShippingAddress) => void;
  errors?: Record<string, string>;
}

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi NCR", "Jammu and Kashmir", "Ladakh"
];

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onChangeAddress,
  savedAddresses = [],
  onSelectSavedAddress,
  errors = {}
}) => {
  const [showSavedSelector, setShowSavedSelector] = useState(savedAddresses.length > 0);

  return (
    <div className="p-6 sm:p-7 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold text-xs shrink-0">
            2
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 uppercase tracking-tight">
              Delivery Address
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              Enter your shipping destination address in India.
            </p>
          </div>
        </div>

        {savedAddresses.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSavedSelector(!showSavedSelector)}
            className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showSavedSelector ? "+ Enter Custom Address" : "Select Saved Address"}
          </button>
        )}
      </div>

      {/* SAVED ADDRESSES SELECTOR LIST */}
      {showSavedSelector && savedAddresses.length > 0 ? (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Select Saved Address ({savedAddresses.length})
          </label>
          <div className="grid grid-cols-1 gap-3">
            {savedAddresses.map((sa, idx) => {
              const isSelected = address.pincode === sa.pincode && address.addressLine1 === sa.addressLine1;
              return (
                <SavedAddressCard
                  key={sa.id || idx}
                  address={sa}
                  isSelected={isSelected}
                  onSelect={() => {
                    onChangeAddress(sa);
                    onSelectSavedAddress?.(sa);
                  }}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setShowSavedSelector(false)}
            className="text-xs font-bold text-zinc-900 hover:text-black flex items-center gap-1 pt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        </div>
      ) : (
        /* ADDRESS FORM FIELDS */
        <div className="space-y-4 text-xs">
          {/* FIRST & LAST NAME GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                First Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul"
                value={address.firstName}
                onChange={(e) => onChangeAddress({ ...address, firstName: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium text-zinc-900 focus:outline-none transition-all ${
                  errors.firstName ? "border-red-400 bg-red-50/20" : "border-zinc-200 focus:border-zinc-900"
                }`}
              />
              {errors.firstName && <p className="text-[11px] font-semibold text-red-600">{errors.firstName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Last Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sharma"
                value={address.lastName}
                onChange={(e) => onChangeAddress({ ...address, lastName: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium text-zinc-900 focus:outline-none transition-all ${
                  errors.lastName ? "border-red-400 bg-red-50/20" : "border-zinc-200 focus:border-zinc-900"
                }`}
              />
              {errors.lastName && <p className="text-[11px] font-semibold text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          {/* ADDRESS LINE 1 & 2 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Address Line 1 (Flat, House No., Building, Street) *
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Sunshine Heights, Linking Road"
              value={address.addressLine1}
              onChange={(e) => onChangeAddress({ ...address, addressLine1: e.target.value })}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium text-zinc-900 focus:outline-none transition-all ${
                errors.addressLine1 ? "border-red-400 bg-red-50/20" : "border-zinc-200 focus:border-zinc-900"
              }`}
            />
            {errors.addressLine1 && <p className="text-[11px] font-semibold text-red-600">{errors.addressLine1}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Address Line 2 (Area, Landmark - Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Near Bandra Station"
              value={address.addressLine2 || ""}
              onChange={(e) => onChangeAddress({ ...address, addressLine2: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900"
            />
          </div>

          {/* COUNTRY, STATE, CITY, PINCODE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Country *
              </label>
              <input
                type="text"
                disabled
                value={address.country || "India"}
                className="w-full px-3.5 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                State *
              </label>
              <div className="relative">
                <select
                  value={address.state || "Maharashtra"}
                  onChange={(e) => onChangeAddress({ ...address, state: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium text-zinc-900 focus:outline-none appearance-none cursor-pointer ${
                    errors.state ? "border-red-400" : "border-zinc-200 focus:border-zinc-900"
                  }`}
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.state && <p className="text-[11px] font-semibold text-red-600">{errors.state}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                City *
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={address.city}
                onChange={(e) => onChangeAddress({ ...address, city: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-medium text-zinc-900 focus:outline-none transition-all ${
                  errors.city ? "border-red-400 bg-red-50/20" : "border-zinc-200 focus:border-zinc-900"
                }`}
              />
              {errors.city && <p className="text-[11px] font-semibold text-red-600">{errors.city}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Pincode *
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit PIN"
                value={address.pincode}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, "");
                  onChangeAddress({ ...address, pincode: cleaned });
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none transition-all ${
                  errors.pincode ? "border-red-400 bg-red-50/20" : "border-zinc-200 focus:border-zinc-900"
                }`}
              />
              {errors.pincode && <p className="text-[11px] font-semibold text-red-600">{errors.pincode}</p>}
            </div>
          </div>

          {/* SAVE ADDRESS CHECKBOX */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={address.saveAddress !== false}
                onChange={(e) => onChangeAddress({ ...address, saveAddress: e.target.checked })}
                className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 cursor-pointer"
              />
              <span className="text-xs font-semibold text-zinc-800">
                Save this address for future orders
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
