import React, { useState, useEffect } from 'react';
import { AttributeMaster, ProductAttributeAssignment } from '../types/attribute.types';
import { AttributeService } from '../services/attributeService';
import { ProductAttributeCard } from './ProductAttributeCard';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sliders, Plus, RefreshCw, Layers, Check, Search, X } from 'lucide-react';

interface ProductAttributeSectionProps {
  value: ProductAttributeAssignment[];
  onChange: (attributes: ProductAttributeAssignment[]) => void;
}

export const ProductAttributeSection: React.FC<ProductAttributeSectionProps> = ({
  value = [],
  onChange
}) => {
  const [globalAttributes, setGlobalAttributes] = useState<AttributeMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSelector, setShowAddSelector] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState('');

  const fetchGlobalAttributes = async () => {
    setLoading(true);
    try {
      const attrs = await AttributeService.getAttributes({ status: 'Active' });
      setGlobalAttributes(attrs);
    } catch (e) {
      console.error('Failed to fetch global attributes master:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalAttributes();
    const handleSync = () => fetchGlobalAttributes();
    window.addEventListener('aaramly_attribute_sync', handleSync);
    return () => window.removeEventListener('aaramly_attribute_sync', handleSync);
  }, []);

  // Assigned attribute IDs set for duplicate prevention
  const assignedIds = new Set(value.map((pa) => pa.attributeId));

  // Available unassigned global attributes
  const unassignedAttributes = globalAttributes.filter((ga) => {
    const isUnassigned = !assignedIds.has(ga.id);
    const matchesSearch =
      !selectorSearch.trim() ||
      ga.name.toLowerCase().includes(selectorSearch.toLowerCase()) ||
      ga.slug.toLowerCase().includes(selectorSearch.toLowerCase());
    return isUnassigned && matchesSearch;
  });

  const handleAddGlobalAttribute = (attr: AttributeMaster) => {
    const isVariantEligible = attr.usage === 'VARIANT' || attr.usage === 'BOTH';
    const firstTwoVals = attr.values ? attr.values.slice(0, 3).map((v) => v.value) : [];

    const newAssignment: ProductAttributeAssignment = {
      attributeId: attr.id,
      attributeName: attr.name,
      attributeSlug: attr.slug,
      type: attr.type,
      sortOrder: value.length + 1,
      useForVariants: isVariantEligible,
      selectedValues: firstTwoVals,
      customValues: [],
      showInHighlights: attr.showInHighlights
    };

    onChange([...value, newAssignment]);
    setSelectorSearch('');
    setShowAddSelector(false);
  };

  const handleUpdateAssignment = (index: number, updated: ProductAttributeAssignment) => {
    const next = [...value];
    next[index] = updated;
    onChange(next);
  };

  const handleRemoveAssignment = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white border border-neutral-200 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <RefreshCw className="w-4 h-4 animate-spin text-black" />
          <span>Loading dynamic attribute master...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl space-y-6 font-sans">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-black shrink-0" />
            <h2 className="text-sm font-bold text-black tracking-tight uppercase">Product Attributes Configuration</h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal mt-0.5">
            Select the required attributes for this product and toggle which attributes generate variants.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowAddSelector(!showAddSelector)}
          className="bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-4 py-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Attribute</span>
        </Button>
      </div>

      {/* UNASSIGNED GLOBAL ATTRIBUTE SELECTOR MODAL / DROPDOWN */}
      {showAddSelector && (
        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              Available Global Attributes Master ({unassignedAttributes.length} unassigned)
            </span>
            <button
              type="button"
              onClick={() => setShowAddSelector(false)}
              className="text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search unassigned global attribute..."
              value={selectorSearch}
              onChange={(e) => setSelectorSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-md text-xs font-medium text-black focus:outline-none focus:border-black"
            />
          </div>

          {unassignedAttributes.length === 0 ? (
            <p className="text-xs text-neutral-500 italic p-3 text-center bg-white rounded-lg border border-neutral-200">
              All active global attributes are already assigned to this product!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {unassignedAttributes.map((ga) => (
                <button
                  key={ga.id}
                  type="button"
                  onClick={() => handleAddGlobalAttribute(ga)}
                  className="p-2.5 rounded-lg border border-neutral-200 bg-white hover:bg-black hover:text-white transition-all text-left group cursor-pointer flex flex-col justify-between"
                >
                  <span className="font-bold text-xs group-hover:text-white text-black block truncate">{ga.name}</span>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-neutral-500 group-hover:text-neutral-300 font-mono">{ga.type}</span>
                    <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ASSIGNED ATTRIBUTES CARDS LIST */}
      {value.length === 0 ? (
        <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
          <Sliders className="w-8 h-8 text-neutral-400 mx-auto" />
          <h4 className="text-xs font-bold text-black">No Attributes Assigned to This Product</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Click "+ Add Attribute" above to assign required attributes (Color, Size, Cup Type, Material, etc.).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {value.map((assignment, idx) => {
            const attrMaster = globalAttributes.find((ga) => ga.id === assignment.attributeId) || {
              id: assignment.attributeId,
              name: assignment.attributeName,
              slug: assignment.attributeSlug,
              type: assignment.type,
              usage: 'BOTH',
              showInHighlights: true,
              isRequired: false,
              sortOrder: assignment.sortOrder,
              status: 'active',
              isActive: true,
              values: assignment.selectedValues.map((v) => ({ id: v, label: v, value: v, status: 'active', sortOrder: 1 }))
            };

            return (
              <ProductAttributeCard
                key={assignment.attributeId || idx}
                attribute={attrMaster}
                assignment={assignment}
                onUpdateAssignment={(updated) => handleUpdateAssignment(idx, updated)}
                onRemoveAssignment={() => handleRemoveAssignment(idx)}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
};
