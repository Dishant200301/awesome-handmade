import React from 'react';
import { AttributeMaster, AttributeValue } from '../types/attribute.types';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Check } from 'lucide-react';

interface DynamicAttributeFieldProps {
  attribute: AttributeMaster;
  value: any;
  onChange: (val: any) => void;
  error?: string;
}

export const DynamicAttributeField: React.FC<DynamicAttributeFieldProps> = ({
  attribute,
  value,
  onChange,
  error
}) => {
  const { name, type, values, isRequired } = attribute;
  const normalizedType = String(type).toUpperCase();

  const renderField = () => {
    switch (normalizedType) {
      case 'TEXT':
        return (
          <Input
            type="text"
            placeholder={`Enter ${name.toLowerCase()}...`}
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white border-neutral-200 text-xs font-medium text-black"
          />
        );

      case 'TEXTAREA':
        return (
          <textarea
            rows={3}
            placeholder={`Enter ${name.toLowerCase()}...`}
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white text-xs font-normal text-black p-3 rounded-lg border border-neutral-200 focus:outline-none focus:border-black transition-all"
          />
        );

      case 'SELECT':
      case 'RADIO': {
        const selectOptions = values && values.length > 0
          ? values.filter((o: AttributeValue) => o.status !== 'inactive').map((o: AttributeValue) => ({ value: o.value, label: o.label }))
          : [{ value: '', label: 'No values defined' }];

        return (
          <Select
            value={value !== undefined && value !== null ? String(value) : (selectOptions[0]?.value || '')}
            onValueChange={(val) => onChange(val)}
            options={selectOptions}
          />
        );
      }

      case 'CHECKBOX':
      case 'BUTTON': {
        const currentArr: string[] = Array.isArray(value)
          ? value
          : (typeof value === 'string' && value.trim() ? value.split(',').map((s) => s.trim()) : []);

        const availableValues = values && values.length > 0
          ? values.filter((o: AttributeValue) => o.status !== 'inactive')
          : [];

        const toggleOption = (optVal: string) => {
          const exists = currentArr.includes(optVal);
          const nextArr = exists ? currentArr.filter((v) => v !== optVal) : [...currentArr, optVal];
          onChange(nextArr);
        };

        if (availableValues.length === 0) {
          return (
            <Input
              type="text"
              placeholder="e.g. Value 1, Value 2 (comma-separated)..."
              value={Array.isArray(value) ? value.join(', ') : (value || '')}
              onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()))}
              className="bg-white border-neutral-200 text-xs text-black"
            />
          );
        }

        return (
          <div className="flex flex-wrap gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
            {availableValues.map((opt: AttributeValue) => {
              const isSelected = currentArr.includes(opt.value);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(opt.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-2xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {opt.colorCode && (
                    <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs shrink-0" style={{ backgroundColor: opt.colorCode }} />
                  )}
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        );
      }

      case 'NUMBER':
        return (
          <Input
            type="number"
            placeholder="e.g. 180"
            value={value !== undefined && value !== null ? value : ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            className="bg-white border-neutral-200 text-xs font-medium text-black"
          />
        );

      case 'BOOLEAN': {
        const isYes = value === true || value === 'Yes' || value === 'yes';
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange('Yes')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                isYes ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onChange('No')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                !isYes ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              No
            </button>
          </div>
        );
      }

      case 'SWATCH':
      case 'COLOR': {
        const colorVal = typeof value === 'string' && value ? value : '#000000';
        return (
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-neutral-200 w-fit">
            <input
              type="color"
              value={colorVal.startsWith('#') ? colorVal : '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer border-0 p-0"
            />
            <Input
              type="text"
              value={colorVal}
              onChange={(e) => onChange(e.target.value)}
              className="w-32 bg-white border-neutral-200 text-xs font-mono uppercase font-bold text-black"
            />
          </div>
        );
      }

      default:
        return (
          <Input
            type="text"
            value={value !== undefined ? String(value) : ''}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white border-neutral-200 text-xs text-black"
          />
        );
    }
  };

  return (
    <div className="space-y-1.5 font-sans">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-black uppercase tracking-wider">
          {name} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <span className="text-[10px] text-neutral-400 font-mono">
          Type: {type}
        </span>
      </div>
      {renderField()}
      {error && <p className="text-[11px] font-semibold text-red-600 mt-1">{error}</p>}
    </div>
  );
};
