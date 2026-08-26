import React, { useState } from 'react';
import { AttributeMaster, ProductAttributeAssignment } from '../types/attribute.types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, Plus, Trash2, Sliders, Layers, Sparkles, X } from 'lucide-react';

interface ProductAttributeCardProps {
  attribute: AttributeMaster;
  assignment: ProductAttributeAssignment;
  onUpdateAssignment: (updated: ProductAttributeAssignment) => void;
  onRemoveAssignment: () => void;
}

export const ProductAttributeCard: React.FC<ProductAttributeCardProps> = ({
  attribute,
  assignment,
  onUpdateAssignment,
  onRemoveAssignment
}) => {
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customValInput, setCustomValInput] = useState('');

  const globalValues = attribute.values || [];
  const selectedValues = assignment.selectedValues || [];
  const customValues = assignment.customValues || [];

  const handleToggleGlobalValue = (valStr: string) => {
    const exists = selectedValues.includes(valStr);
    const updatedSelected = exists
      ? selectedValues.filter((v) => v !== valStr)
      : [...selectedValues, valStr];

    onUpdateAssignment({
      ...assignment,
      selectedValues: updatedSelected
    });
  };

  const handleAddCustomValue = () => {
    if (!customValInput.trim()) return;
    const newVal = customValInput.trim();
    if (selectedValues.includes(newVal) || customValues.includes(newVal)) {
      alert('This value is already added to the product.');
      return;
    }

    onUpdateAssignment({
      ...assignment,
      selectedValues: [...selectedValues, newVal],
      customValues: [...customValues, newVal]
    });

    setCustomValInput('');
    setShowAddCustomModal(false);
  };

  const handleRemoveCustomValue = (valStr: string) => {
    onUpdateAssignment({
      ...assignment,
      selectedValues: selectedValues.filter((v) => v !== valStr),
      customValues: customValues.filter((v) => v !== valStr)
    });
  };

  const handleToggleUseForVariants = (useForVar: boolean) => {
    onUpdateAssignment({
      ...assignment,
      useForVariants: useForVar
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-white shadow-2xs space-y-4 font-sans">
      {/* CARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-black shrink-0 font-bold text-xs">
            #{assignment.sortOrder || 1}
          </div>
          <div>
            <h3 className="font-bold text-black text-xs sm:text-sm flex items-center gap-2">
              <span>{attribute.name}</span>
              <Badge variant="outline" className="text-[10px] uppercase font-semibold bg-neutral-50 text-neutral-700 border-neutral-200">
                {attribute.type}
              </Badge>
            </h3>
            <p className="text-[11px] text-neutral-500 font-normal">
              Slug: <code className="text-neutral-700">{attribute.slug}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* USE FOR VARIANTS TOGGLE */}
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={assignment.useForVariants}
              onChange={(e) => handleToggleUseForVariants(e.target.checked)}
              className="w-4 h-4 rounded text-black cursor-pointer"
            />
            <span className="text-xs font-bold text-black flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>Use for Variants</span>
            </span>
          </label>

          {/* REMOVE FROM PRODUCT BUTTON */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemoveAssignment}
            className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50"
            title="Remove attribute from this product"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* VALUES SELECTION SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-black uppercase tracking-wider">
            Select Supported Values ({selectedValues.length} selected)
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddCustomModal(!showAddCustomModal)}
            className="text-[11px] h-7 px-2.5 text-black border-neutral-200 hover:bg-neutral-50 font-semibold"
          >
            <Plus className="w-3 h-3" />
            <span>Add Custom Value</span>
          </Button>
        </div>

        {/* CUSTOM VALUE INPUT FORM */}
        {showAddCustomModal && (
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center gap-2 animate-in fade-in">
            <Input
              type="text"
              placeholder={`Enter product-specific ${attribute.name} value (e.g. Rose Gold)...`}
              value={customValInput}
              onChange={(e) => setCustomValInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomValue();
                }
              }}
              className="bg-white border-neutral-200 text-xs font-medium flex-1 text-black"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddCustomValue}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-3 h-8"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAddCustomModal(false)}
              className="text-xs text-neutral-500 h-8"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* GLOBAL VALUES CHECKBOX PILLS */}
        <div className="flex flex-wrap gap-2 pt-1">
          {globalValues.map((val) => {
            const isSelected = selectedValues.includes(val.value);
            return (
              <button
                key={val.id}
                type="button"
                onClick={() => handleToggleGlobalValue(val.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-2xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {val.colorCode && (
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: val.colorCode }}
                  />
                )}
                <span>{val.label}</span>
                {isSelected && <Check className="w-3 h-3 text-white stroke-[3] ml-0.5" />}
              </button>
            );
          })}

          {/* CUSTOM VALUES PILLS */}
          {customValues.map((val) => {
            return (
              <div
                key={val}
                className="px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs"
              >
                <span>{val} (Custom)</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomValue(val)}
                  className="text-amber-700 hover:text-red-700 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {selectedValues.length === 0 && (
          <p className="text-[11px] text-amber-700 font-medium italic pt-1">
            ⚠️ Please select at least one value for this attribute.
          </p>
        )}
      </div>
    </div>
  );
};
