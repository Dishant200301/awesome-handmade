import React from "react";
import { ShippingAddress } from "../types/checkout";
import { Check, Edit2, Trash2, MapPin } from "lucide-react";

interface SavedAddressCardProps {
  address: ShippingAddress;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SavedAddressCard: React.FC<SavedAddressCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative font-sans ${
        isSelected
          ? "bg-white border-zinc-900 shadow-md ring-1 ring-zinc-900"
          : "bg-zinc-50/70 border-zinc-200 hover:border-zinc-400 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-zinc-900" : "text-zinc-400"}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-zinc-900">
                {address.firstName} {address.lastName}
              </span>
              {isSelected && (
                <span className="bg-zinc-900 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Default
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 font-normal mt-1 leading-relaxed">
              {address.addressLine1}
              {address.addressLine2 && `, ${address.addressLine2}`}
              <br />
              {address.city}, {address.state} — <strong className="font-mono text-zinc-800">{address.pincode}</strong>
              <br />
              Phone: {address.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 text-zinc-400 hover:text-zinc-900 rounded"
              title="Edit Address"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-zinc-400 hover:text-red-600 rounded"
              title="Delete Address"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedAddressCard;
