import React, { useState } from 'react';
import { ProductAttributeAssignment, ProductVariantConfig } from '../types/attribute.types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Badge } from './ui/badge';
import { Layers, Plus, Trash2, Edit2, Check, AlertCircle, RefreshCw, Sparkles, X, Upload, UploadCloud } from 'lucide-react';

interface VariantGeneratorSectionProps {
  productAttributes: ProductAttributeAssignment[];
  variants: ProductVariantConfig[];
  onChangeVariants: (variants: ProductVariantConfig[]) => void;
  baseSku?: string;
  defaultPrice?: number;
  defaultMrp?: number;
  defaultStock?: number;
}

export const VariantGeneratorSection: React.FC<VariantGeneratorSectionProps> = ({
  productAttributes = [],
  variants = [],
  onChangeVariants,
  baseSku = 'AAR-SKU',
  defaultPrice = 799,
  defaultMrp = 1299,
  defaultStock = 50
}) => {
  const [skuError, setSkuError] = useState<string | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [editingVariantConfig, setEditingVariantConfig] = useState<ProductVariantConfig | null>(null);
  const [newVariantGalleryUrl, setNewVariantGalleryUrl] = useState('');

  // Manual new variant state
  const [manualSku, setManualSku] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrice, setManualPrice] = useState(defaultPrice);
  const [manualMrp, setManualMrp] = useState(defaultMrp);
  const [manualStock, setManualStock] = useState(defaultStock);
  const [manualAttrValues, setManualAttrValues] = useState<Record<string, string>>({});

  // Filter product attributes marked `useForVariants: true` and have selectedValues
  const variantDefiningAttrs = productAttributes.filter(
    (pa) => pa.useForVariants && pa.selectedValues && pa.selectedValues.length > 0
  );

  // Generate Cartesian Product of selected values
  const handleGenerateVariants = () => {
    setSkuError(null);
    setDuplicateError(null);

    if (variantDefiningAttrs.length === 0) {
      alert('No product attributes are marked "Use for Variants". Please toggle "Use for Variants" on at least one attribute above (e.g. Color or Size).');
      return;
    }

    // Helper for Cartesian Product
    const cartesian = (arrays: string[][]): string[][] => {
      return arrays.reduce<string[][]>(
        (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
        [[]]
      );
    };

    const valueArrays = variantDefiningAttrs.map((pa) => pa.selectedValues);
    const combinations = cartesian(valueArrays);

    const generated: ProductVariantConfig[] = [];
    const usedSkus = new Set<string>();

    combinations.forEach((combo, idx) => {
      const attrMap: Record<string, string> = {};
      variantDefiningAttrs.forEach((pa, i) => {
        attrMap[pa.attributeName] = combo[i];
      });

      // Find existing matching variant to retain custom price/stock/SKU if already set
      const existing = variants.find((v) => {
        if (!v.attributeValues) return false;
        return variantDefiningAttrs.every((pa) => v.attributeValues[pa.attributeName] === attrMap[pa.attributeName]);
      });

      if (existing) {
        generated.push(existing);
        usedSkus.add(existing.sku);
      } else {
        const skuSuffix = combo.map((c) => c.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '')).join('-');
        let genSku = `${baseSku || 'AAR'}-${skuSuffix}`;
        if (usedSkus.has(genSku)) {
          genSku = `${genSku}-${idx + 1}`;
        }
        usedSkus.add(genSku);

        const colorName = attrMap['Color'] || combo[0] || '';
        const sizeName = attrMap['Size'] || combo[1] || '';
        const generatedTitle = `${combo.join(' / ')}`;

        generated.push({
          id: `var-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
          sku: genSku,
          title: generatedTitle,
          colorName,
          sizeName,
          price: defaultPrice,
          originalPrice: defaultMrp,
          comparePrice: defaultMrp,
          stock: defaultStock,
          status: 'Active',
          attributeValues: attrMap
        });
      }
    });

    onChangeVariants(generated);
  };

  // Add Manual Variant
  const handleAddManualVariant = (e: React.FormEvent) => {
    e.preventDefault();
    setSkuError(null);
    setDuplicateError(null);

    const trimmedSku = manualSku.trim();
    if (!trimmedSku) {
      setSkuError('Please enter a SKU.');
      return;
    }

    // Check SKU uniqueness
    if (variants.some((v) => v.sku.toLowerCase() === trimmedSku.toLowerCase())) {
      setSkuError('SKU already exists. Please use a unique SKU.');
      return;
    }

    // Check variant combination uniqueness
    const isDuplicateCombo = variants.some((v) => {
      if (!v.attributeValues) return false;
      return Object.keys(manualAttrValues).length > 0 &&
        Object.keys(manualAttrValues).every((k) => v.attributeValues[k] === manualAttrValues[k]);
    });

    if (isDuplicateCombo) {
      setDuplicateError('Duplicate variant combination is not allowed. A variant with these exact attribute values already exists.');
      return;
    }

    const newVar: ProductVariantConfig = {
      id: `var-manual-${Date.now()}`,
      sku: trimmedSku,
      title: manualTitle.trim() || Object.values(manualAttrValues).join(' / '),
      colorName: manualAttrValues['Color'] || '',
      sizeName: manualAttrValues['Size'] || '',
      price: Number(manualPrice) || defaultPrice,
      originalPrice: Number(manualMrp) || defaultMrp,
      comparePrice: Number(manualMrp) || defaultMrp,
      stock: Number(manualStock) || defaultStock,
      status: 'Active',
      attributeValues: manualAttrValues
    };

    onChangeVariants([...variants, newVar]);
    setShowAddVariantModal(false);
    setManualSku('');
    setManualTitle('');
  };

  // Delete Variant
  const handleDeleteVariant = (id: string) => {
    onChangeVariants(variants.filter((v) => v.id !== id));
  };

  // Update Individual Variant Field
  const handleUpdateVariantField = (id: string, field: keyof ProductVariantConfig, val: any) => {
    setSkuError(null);
    if (field === 'sku') {
      const trimmed = String(val).trim();
      const duplicateSku = variants.some((v) => v.id !== id && v.sku.toLowerCase() === trimmed.toLowerCase());
      if (duplicateSku) {
        setSkuError(`SKU "${trimmed}" already exists. Please use a unique SKU.`);
      }
    }

    onChangeVariants(
      variants.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  };

  // Save Editing Variant Drawer Modal
  const handleSaveVariantModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariantConfig) return;

    onChangeVariants(
      variants.map((v) => (v.id === editingVariantConfig.id ? editingVariantConfig : v))
    );
    setEditingVariantConfig(null);
  };

  return (
    <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl space-y-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-purple-600 shrink-0" />
            <h2 className="text-sm font-bold text-black tracking-tight uppercase">Variant Matrix &amp; Customization Center</h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal mt-0.5">
            Customize Title, Gallery Images, SKU, Price, Size &amp; Stock, and Description Info per variant/color combination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleGenerateVariants}
            className="bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-4 py-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Variants</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddVariantModal(!showAddVariantModal)}
            className="text-xs font-semibold text-black border-neutral-200 hover:bg-neutral-50 h-9"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Manual Variant</span>
          </Button>
        </div>
      </div>

      {/* VALIDATION ERRORS BANNER */}
      {(skuError || duplicateError) && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{skuError || duplicateError}</span>
        </div>
      )}

      {/* VARIANT-DEFINING ATTRIBUTES SUMMARY */}
      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
        <span className="text-xs font-bold text-black uppercase tracking-wider block">
          Variant-Defining Attributes ({variantDefiningAttrs.length})
        </span>
        {variantDefiningAttrs.length === 0 ? (
          <p className="text-xs text-neutral-500 italic">
            No attributes are marked "Use for Variants". Check "Use for Variants" on attribute cards above to generate combinations.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {variantDefiningAttrs.map((pa) => (
              <div key={pa.attributeId} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-white px-3 py-1 rounded-lg border border-neutral-200">
                <span>{pa.attributeName}:</span>
                <span className="text-purple-700 font-bold">{pa.selectedValues.join(', ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED VARIANT EDITING MODAL */}
      {editingVariantConfig && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <h3 className="font-bold text-black text-base uppercase">Edit Variant Specifications</h3>
                <p className="text-xs text-neutral-500">
                  Customizing SKU: <span className="font-mono font-bold text-black">{editingVariantConfig.sku}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingVariantConfig(null)}
                className="p-1 text-neutral-400 hover:text-black transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVariantModal} className="space-y-5">
              {/* VARIANT TITLE */}
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                  Variant Specific Title *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Aaramly Seamless Bralette - Midnight Black / Medium"
                  value={editingVariantConfig.title || ''}
                  onChange={(e) => setEditingVariantConfig({ ...editingVariantConfig, title: e.target.value })}
                  className="bg-white border-neutral-300 text-xs font-bold text-black"
                />
              </div>

              {/* SKU & PRICING */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Variant SKU *</label>
                  <Input
                    type="text"
                    required
                    value={editingVariantConfig.sku}
                    onChange={(e) => setEditingVariantConfig({ ...editingVariantConfig, sku: e.target.value })}
                    className="bg-white border-neutral-300 text-xs font-mono font-bold text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Sale Price (₹)</label>
                  <Input
                    type="number"
                    value={editingVariantConfig.price}
                    onChange={(e) => setEditingVariantConfig({ ...editingVariantConfig, price: Number(e.target.value) })}
                    className="bg-white border-neutral-300 text-xs font-bold text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Compare MRP (₹)</label>
                  <Input
                    type="number"
                    value={editingVariantConfig.comparePrice || editingVariantConfig.originalPrice || defaultMrp}
                    onChange={(e) =>
                      setEditingVariantConfig({
                        ...editingVariantConfig,
                        comparePrice: Number(e.target.value),
                        originalPrice: Number(e.target.value)
                      })
                    }
                    className="bg-white border-neutral-300 text-xs text-neutral-700"
                  />
                </div>
              </div>

              {/* STOCK & SIZE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Stock Quantity</label>
                  <Input
                    type="number"
                    value={editingVariantConfig.stock}
                    onChange={(e) => setEditingVariantConfig({ ...editingVariantConfig, stock: Number(e.target.value) })}
                    className="bg-white border-neutral-300 text-xs font-bold text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Status</label>
                  <Select
                    value={editingVariantConfig.status || 'Active'}
                    onValueChange={(val: any) => setEditingVariantConfig({ ...editingVariantConfig, status: val })}
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                      { value: 'Out of Stock', label: 'Out of Stock' }
                    ]}
                  />
                </div>
              </div>

              {/* VARIANT MAIN IMAGE */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Variant Main Image
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setEditingVariantConfig({ ...editingVariantConfig, image: reader.result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs font-bold text-neutral-400">OR</span>
                  <Input
                    type="text"
                    placeholder="Paste main image URL..."
                    value={editingVariantConfig.image || ''}
                    onChange={(e) => setEditingVariantConfig({ ...editingVariantConfig, image: e.target.value })}
                    className="bg-white border-neutral-300 text-xs font-medium text-black flex-1 min-w-[200px]"
                  />
                </div>
              </div>

              {/* VARIANT GALLERY IMAGES */}
              <div className="space-y-3 pt-2 border-t border-neutral-200">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Variant Specific Gallery Images ({editingVariantConfig.galleryImages ? editingVariantConfig.galleryImages.length : 0})
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs shrink-0">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>Upload Local Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;

                        const readPromises = Array.from(files).map((file) => {
                          return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                resolve(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        });

                        const dataUrls = await Promise.all(readPromises);
                        if (dataUrls.length > 0) {
                          setEditingVariantConfig((prev) => {
                            if (!prev) return prev;
                            const currentGal = prev.galleryImages || [];
                            return { ...prev, galleryImages: [...currentGal, ...dataUrls] };
                          });
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <span className="text-xs font-bold text-neutral-400">OR</span>
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <Input
                      type="text"
                      placeholder="Add variant gallery image URL..."
                      value={newVariantGalleryUrl}
                      onChange={(e) => setNewVariantGalleryUrl(e.target.value)}
                      className="bg-white border-neutral-300 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (!newVariantGalleryUrl.trim()) return;
                        const nextGallery = [...(editingVariantConfig.galleryImages || []), newVariantGalleryUrl.trim()];
                        setEditingVariantConfig({ ...editingVariantConfig, galleryImages: nextGallery });
                        setNewVariantGalleryUrl('');
                      }}
                      className="bg-black text-white text-xs px-3 h-8 shrink-0"
                    >
                      Add URL
                    </Button>
                  </div>
                </div>

                {editingVariantConfig.galleryImages && editingVariantConfig.galleryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {editingVariantConfig.galleryImages.map((imgUrl, i) => (
                      <div key={i} className="relative w-16 h-20 rounded border border-neutral-200 overflow-hidden bg-neutral-50 shadow-2xs">
                        <img src={imgUrl} alt={`Variant gallery ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const nextGallery = (editingVariantConfig.galleryImages || []).filter((_, idx) => idx !== i);
                            setEditingVariantConfig({ ...editingVariantConfig, galleryImages: nextGallery });
                          }}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* VARIANT PRODUCT INFO / DESCRIPTION */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-200">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Variant Specific Product Info / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter variant-specific features, fabric details, sizing notes or care instructions..."
                  value={editingVariantConfig.productInfo || ''}
                  onChange={(e) => setEditingVariantConfig({ ...editingVariantConfig, productInfo: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 p-2.5 text-xs text-black focus:border-black focus:outline-none bg-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingVariantConfig(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-5">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VARIANT MATRIX TABLE */}
      {variants.length === 0 ? (
        <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
          <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
          <h4 className="text-xs font-bold text-black">No Variants Generated</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Click "Generate Variants" above to compute purchasable combinations or click "Add Manual Variant".
          </p>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-bold uppercase text-[11px] text-neutral-700">
                  <th className="p-3">Variant Title &amp; Combination</th>
                  <th className="p-3">SKU Code</th>
                  <th className="p-3">Sale Price (₹)</th>
                  <th className="p-3">Compare MRP (₹)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {variants.map((v, idx) => {
                  const comboStr = v.attributeValues
                    ? Object.entries(v.attributeValues).map(([k, val]) => `${val}`).join(' / ')
                    : `${v.colorName || ''} ${v.sizeName || ''}`.trim() || 'Standard';

                  return (
                    <tr key={v.id || idx} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="p-3">
                        <div className="space-y-1">
                          <input
                            type="text"
                            placeholder="Variant Title..."
                            value={v.title || comboStr}
                            onChange={(e) => handleUpdateVariantField(v.id, 'title', e.target.value)}
                            className="w-48 bg-white border border-neutral-200 rounded px-2 py-1 text-xs font-bold text-black focus:outline-none focus:border-black block"
                          />
                          <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-900 border-purple-200">
                            {comboStr}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleUpdateVariantField(v.id, 'sku', e.target.value)}
                          className="w-36 bg-white border border-neutral-200 rounded px-2 py-1 text-xs font-mono font-semibold text-black focus:outline-none focus:border-black"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleUpdateVariantField(v.id, 'price', Number(e.target.value))}
                          className="w-24 bg-white border border-neutral-200 rounded px-2 py-1 text-xs font-semibold text-black focus:outline-none focus:border-black"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={v.comparePrice || v.originalPrice || defaultMrp}
                          onChange={(e) => handleUpdateVariantField(v.id, 'originalPrice', Number(e.target.value))}
                          className="w-24 bg-white border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-600 focus:outline-none focus:border-black"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleUpdateVariantField(v.id, 'stock', Number(e.target.value))}
                          className="w-20 bg-white border border-neutral-200 rounded px-2 py-1 text-xs font-bold text-black focus:outline-none focus:border-black"
                        />
                      </td>
                      <td className="p-3">
                        <Select
                          value={v.status || 'Active'}
                          onValueChange={(val) => handleUpdateVariantField(v.id, 'status', val)}
                          options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Inactive', label: 'Inactive' },
                            { value: 'Out of Stock', label: 'Out of Stock' }
                          ]}
                        />
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingVariantConfig(v)}
                            className="h-7 w-7 text-neutral-600 hover:text-black hover:bg-neutral-100"
                            title="Edit full variant details (Title, Gallery, Description)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteVariant(v.id)}
                            className="h-7 w-7 text-neutral-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete variant combination"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
};
