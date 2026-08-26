import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search, 
  ArrowLeft, 
  AlertCircle,
  Palette
} from 'lucide-react';
import { AttributeMaster, AttributeValue, AttributeDisplayType, AttributeUsage } from '../types/attribute.types';
import { AttributeService } from '../services/attributeService';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';

export const AttributesPage: React.FC = () => {
  // Main State
  const [attributes, setAttributes] = useState<AttributeMaster[]>([]);
  const [loading, setLoading] = useState(true);

  // Sub-view: 'all' | 'create' | 'edit'
  const [subView, setSubView] = useState<'all' | 'create' | 'edit'>('all');
  const [editingAttrId, setEditingAttrId] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterUsage, setFilterUsage] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Form State for Create / Edit Attribute
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formType, setFormType] = useState<AttributeDisplayType>('SELECT');
  const [formUsage, setFormUsage] = useState<AttributeUsage>('PRODUCT');
  const [formShowInHighlights, setFormShowInHighlights] = useState(true);
  const [formIsRequired, setFormIsRequired] = useState(false);
  const [formSortOrder, setFormSortOrder] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formValues, setFormValues] = useState<AttributeValue[]>([]);

  // Attribute Value Form inputs
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [newValLabel, setNewValLabel] = useState('');
  const [newValValue, setNewValValue] = useState('');
  const [newValHex, setNewValHex] = useState('#000000');

  // Delete Warning state
  const [deleteWarning, setDeleteWarning] = useState<{ attrId: string; attrName: string; usedCount: number } | null>(null);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const data = await AttributeService.getAttributes();
      setAttributes(data);
    } catch (e) {
      console.error('Error fetching attributes master:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // Open Create View
  const handleOpenCreateView = () => {
    setEditingAttrId(null);
    setFormName('');
    setFormSlug('');
    setFormType('SELECT');
    setFormUsage('PRODUCT');
    setFormShowInHighlights(true);
    setFormIsRequired(false);
    setFormSortOrder(attributes.length + 1);
    setFormStatus('active');
    setFormValues([]);
    setEditingValueId(null);
    setNewValLabel('');
    setNewValValue('');
    setNewValHex('#000000');
    setSubView('create');
  };

  // Open Edit View
  const handleOpenEditView = (attr: AttributeMaster) => {
    setEditingAttrId(attr.id);
    setFormName(attr.name);
    setFormSlug(attr.slug);
    setFormType(attr.type);
    setFormUsage(attr.usage);
    setFormShowInHighlights(attr.showInHighlights);
    setFormIsRequired(attr.isRequired);
    setFormSortOrder(attr.sortOrder || 1);
    setFormStatus(attr.status || (attr.isActive ? 'active' : 'inactive'));
    setFormValues([...(attr.values || [])]);
    setEditingValueId(null);
    setNewValLabel('');
    setNewValValue('');
    setNewValHex('#000000');
    setSubView('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-slug on name change
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingAttrId) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  // Add or Update Value in Form State
  const handleSaveValueToForm = () => {
    if (!newValLabel.trim()) return;
    const actualVal = newValValue.trim() || newValLabel.trim();

    if (editingValueId) {
      // Update existing value
      setFormValues(
        formValues.map((v) =>
          v.id === editingValueId
            ? {
                ...v,
                label: newValLabel.trim(),
                value: actualVal,
                colorCode: formType === 'SWATCH' || formType === 'COLOR' ? newValHex : undefined
              }
            : v
        )
      );
      setEditingValueId(null);
    } else {
      // Create new value
      const valObj: AttributeValue = {
        id: `val-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        attributeId: editingAttrId || '',
        label: newValLabel.trim(),
        value: actualVal,
        colorCode: formType === 'SWATCH' || formType === 'COLOR' ? newValHex : undefined,
        status: 'active',
        sortOrder: formValues.length + 1
      };
      setFormValues([...formValues, valObj]);
    }

    setNewValLabel('');
    setNewValValue('');
    setNewValHex('#000000');
  };

  // Edit Value inline
  const handleEditValueInForm = (val: AttributeValue) => {
    setEditingValueId(val.id);
    setNewValLabel(val.label);
    setNewValValue(val.value);
    setNewValHex(val.colorCode || '#000000');
  };

  // Soft-Delete / Remove Value from Form State
  const handleRemoveValueFromForm = (valId: string) => {
    setFormValues(formValues.filter((v) => v.id !== valId));
  };

  // Toggle Value Active Status
  const handleToggleValueStatusInForm = (valId: string) => {
    setFormValues(
      formValues.map((v) =>
        v.id === valId ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' } : v
      )
    );
  };

  // Save Attribute
  const handleSaveAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter attribute name.');
      return;
    }

    const payload: Partial<AttributeMaster> = {
      id: editingAttrId || undefined,
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: formType,
      usage: formUsage,
      showInHighlights: formShowInHighlights,
      isRequired: formIsRequired,
      sortOrder: Number(formSortOrder) || 1,
      status: formStatus,
      isActive: formStatus === 'active',
      values: formValues
    };

    await AttributeService.saveAttribute(payload);
    await fetchAttributes();
    setSubView('all');
    setEditingAttrId(null);
  };

  // Toggle Status
  const handleToggleStatus = async (attr: AttributeMaster) => {
    const updatedStatus = (attr.status === 'active' || attr.isActive) ? 'inactive' : 'active';
    await AttributeService.updateStatus(attr.id, updatedStatus);
    fetchAttributes();
  };

  // Delete Attribute Safety Check
  const handleDeleteAttribute = async (attr: AttributeMaster) => {
    const res = await AttributeService.deleteAttribute(attr.id);
    if (!res.success && res.isUsed) {
      setDeleteWarning({
        attrId: attr.id,
        attrName: attr.name,
        usedCount: res.usedCount || 0
      });
      return;
    }
    fetchAttributes();
    if (editingAttrId === attr.id) {
      setSubView('all');
    }
  };

  // Filtered attributes list
  const filteredAttributes = attributes.filter((attr) => {
    const matchesSearch =
      attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (attr.values && attr.values.some((v) => v.label.toLowerCase().includes(searchTerm.toLowerCase()) || v.value.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesType = filterType === 'All' || attr.type === filterType;
    const matchesUsage = filterUsage === 'All' || attr.usage === filterUsage || attr.usage === 'BOTH';
    const isAct = attr.status ? attr.status === 'active' : attr.isActive;
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Active' && isAct) ||
      (filterStatus === 'Inactive' && !isAct);

    return matchesSearch && matchesType && matchesUsage && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans selection:bg-black selection:text-white pb-20">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-black tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-black" />
            <span>Attributes Master Management</span>
            <Badge variant="secondary" className="text-xs font-semibold bg-neutral-100 text-neutral-800 border-neutral-200">
              {attributes.length} Attributes
            </Badge>
          </h1>
          <p className="text-xs text-neutral-500 font-normal mt-1">
            Centralized single source of truth for product attributes (Color, Size, Material, Cup Type, Style, Fit) and attribute values.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSubView('all')}
            variant={subView === 'all' ? 'default' : 'outline'}
            size="sm"
            className={`text-xs font-medium ${subView === 'all' ? 'bg-black text-white hover:bg-neutral-800' : 'text-black border-neutral-200 hover:bg-neutral-50'}`}
          >
            All Attributes ({attributes.length})
          </Button>

          <Button
            onClick={handleOpenCreateView}
            variant={subView === 'create' ? 'default' : 'outline'}
            size="sm"
            className={`text-xs font-medium flex items-center gap-1.5 ${subView === 'create' ? 'bg-black text-white hover:bg-neutral-800' : 'text-black border-neutral-200 hover:bg-neutral-50'}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Attribute</span>
          </Button>
        </div>
      </div>

      {/* DELETE SAFETY WARNING MODAL */}
      {deleteWarning && (
        <Card className="p-6 bg-amber-50 border border-amber-200 rounded-xl space-y-4 font-sans animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">Cannot Permanently Delete Attribute</h3>
              <p className="text-xs text-amber-800 mt-1">
                <strong>"{deleteWarning.attrName}"</strong> is currently used by <strong>{deleteWarning.usedCount} product(s)</strong>.
                To protect historical product and order data, please <strong>Deactivate</strong> this attribute instead.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button
              size="sm"
              onClick={async () => {
                await AttributeService.updateStatus(deleteWarning.attrId, 'inactive');
                setDeleteWarning(null);
                fetchAttributes();
              }}
              className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold"
            >
              Deactivate Attribute Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteWarning(null)}
              className="text-xs border-amber-300 text-amber-900 hover:bg-amber-100 font-medium"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: ALL ATTRIBUTES LIST TABLE / CARDS */}
      {/* ========================================================================= */}
      {subView === 'all' && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS BAR */}
          <Card className="p-4 bg-white border border-neutral-200 rounded-xl space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search attribute name, slug or value..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs bg-white border-neutral-200 text-black"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-neutral-500">Usage:</span>
                <Select
                  value={filterUsage}
                  onValueChange={(val) => setFilterUsage(val)}
                  options={[
                    { value: 'All', label: 'All Usages' },
                    { value: 'PRODUCT', label: 'Product Info' },
                    { value: 'VARIANT', label: 'Variant Matrix' },
                    { value: 'BOTH', label: 'Both' }
                  ]}
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-neutral-500">Type:</span>
                <Select
                  value={filterType}
                  onValueChange={(val) => setFilterType(val)}
                  options={[
                    { value: 'All', label: 'All Control Types' },
                    { value: 'SWATCH', label: 'SWATCH (Color Swatch)' },
                    { value: 'BUTTON', label: 'BUTTON (Size Pills)' },
                    { value: 'SELECT', label: 'SELECT (Dropdown)' },
                    { value: 'RADIO', label: 'RADIO' },
                    { value: 'CHECKBOX', label: 'CHECKBOX' },
                    { value: 'TEXT', label: 'TEXT' }
                  ]}
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-neutral-500">Status:</span>
                <Select
                  value={filterStatus}
                  onValueChange={(val) => setFilterStatus(val)}
                  options={[
                    { value: 'All', label: 'All Status' },
                    { value: 'Active', label: 'Active Only' },
                    { value: 'Inactive', label: 'Inactive Only' }
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* ATTRIBUTES TABLE */}
          {filteredAttributes.length === 0 ? (
            <Card className="p-12 text-center space-y-3 bg-white border-neutral-200">
              <Sliders className="w-8 h-8 text-neutral-400 mx-auto" />
              <h4 className="text-sm font-bold text-black">No Attributes Found</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No attributes match your current search/filters. Create your first global attribute!
              </p>
              <Button onClick={handleOpenCreateView} size="sm" className="bg-black text-white text-xs font-semibold mt-2">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Attribute</span>
              </Button>
            </Card>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-4">Sort Order</th>
                      <th className="p-4">Attribute Name &amp; Slug</th>
                      <th className="p-4">Display Type</th>
                      <th className="p-4">Usage</th>
                      <th className="p-4">Defined Values</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredAttributes.map((attr) => {
                      const isAct = attr.status ? attr.status === 'active' : attr.isActive;
                      return (
                        <tr key={attr.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-neutral-600">
                            #{attr.sortOrder || 1}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-black text-xs">{attr.name}</div>
                            <div className="text-[10px] font-mono text-neutral-400">/{attr.slug}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-[10px] uppercase font-semibold bg-neutral-50 text-neutral-800 border-neutral-200">
                              {attr.type}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold ${
                                attr.usage === 'PRODUCT'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : attr.usage === 'VARIANT'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              {attr.usage === 'PRODUCT' ? 'Product Info' : attr.usage === 'VARIANT' ? 'Variant Matrix' : 'Product & Variant'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {attr.values && attr.values.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {attr.values.slice(0, 4).map((v) => (
                                  <span key={v.id} className="bg-neutral-100 px-2 py-0.5 rounded text-[10px] text-neutral-800 font-medium flex items-center gap-1">
                                    {v.colorCode && (
                                      <span className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block" style={{ backgroundColor: v.colorCode }} />
                                    )}
                                    <span>{v.label}</span>
                                  </span>
                                ))}
                                {attr.values.length > 4 && (
                                  <span className="text-[10px] text-neutral-400 font-medium">+{attr.values.length - 4} more</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-neutral-400 text-[11px] font-normal">Custom Input</span>
                            )}
                          </td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(attr)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border transition-all ${
                                isAct
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                              }`}
                            >
                              {isAct ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEditView(attr)}
                                className="h-7 w-7 text-neutral-600 hover:text-black hover:bg-neutral-100"
                                title="Edit Attribute & Values"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAttribute(attr)}
                                className="h-7 w-7 text-neutral-400 hover:text-red-600 hover:bg-red-50"
                                title="Delete Attribute"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2 & 3: ADD / EDIT ATTRIBUTE FORM */}
      {/* ========================================================================= */}
      {(subView === 'create' || subView === 'edit') && (
        <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl max-w-4xl mx-auto space-y-6 font-sans">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubView('all')}
                className="text-xs border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to List</span>
              </Button>
              <div>
                <h2 className="text-base font-bold text-black tracking-tight">
                  {subView === 'edit' ? `Edit Attribute: ${formName}` : 'Create New Global Attribute'}
                </h2>
                <p className="text-xs text-neutral-500 font-normal">
                  Configure attribute parameters, display control type, and define global option values.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveAttribute} className="space-y-6 text-xs">
            {/* STEP 1: NAME, SLUG & USAGE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Attribute Name *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Color, Size, Cup Type, Material..."
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="bg-white border-neutral-200 text-xs font-medium text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Slug (URL / Key) *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. color, size, cup-type"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="bg-white border-neutral-200 text-xs font-mono font-medium text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Usage Type *
                </label>
                <Select
                  value={formUsage}
                  onValueChange={(val) => setFormUsage(val as AttributeUsage)}
                  options={[
                    { value: 'BOTH', label: 'Both (Product Info & Variant Matrix)' },
                    { value: 'PRODUCT', label: 'Product Info Only' },
                    { value: 'VARIANT', label: 'Variant Matrix Only' }
                  ]}
                />
              </div>
            </div>

            {/* STEP 2: DISPLAY TYPE & SORT ORDER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Display Control Type *
                </label>
                <Select
                  value={formType}
                  onValueChange={(val) => setFormType(val as AttributeDisplayType)}
                  options={[
                    { value: 'SWATCH', label: 'SWATCH (Color Swatch Picker)' },
                    { value: 'BUTTON', label: 'BUTTON (Size Pills)' },
                    { value: 'SELECT', label: 'SELECT (Dropdown)' },
                    { value: 'RADIO', label: 'RADIO Buttons' },
                    { value: 'CHECKBOX', label: 'CHECKBOX Multi-Select' },
                    { value: 'TEXT', label: 'TEXT Input' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Global Sort Order *
                </label>
                <Input
                  type="number"
                  required
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  className="bg-white border-neutral-200 text-xs font-mono font-medium text-black"
                />
              </div>
            </div>

            {/* STEP 3: TOGGLES */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-black block">Show in Highlights</span>
                  <span className="text-[10px] text-neutral-500">Visible in Top Highlights</span>
                </div>
                <input
                  type="checkbox"
                  checked={formShowInHighlights}
                  onChange={(e) => setFormShowInHighlights(e.target.checked)}
                  className="w-4 h-4 rounded text-black cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-black block">Required Field</span>
                  <span className="text-[10px] text-neutral-500">Mandatory on product save</span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsRequired}
                  onChange={(e) => setFormIsRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-black cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-black block">Active Status</span>
                  <span className="text-[10px] text-neutral-500">Available for assignment</span>
                </div>
                <input
                  type="checkbox"
                  checked={formStatus === 'active'}
                  onChange={(e) => setFormStatus(e.target.checked ? 'active' : 'inactive')}
                  className="w-4 h-4 rounded text-black cursor-pointer"
                />
              </label>
            </div>

            {/* STEP 4: GLOBAL ATTRIBUTE VALUES CRUD EDITOR */}
            <div className="p-5 rounded-xl bg-neutral-50/70 border border-neutral-200 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-wider block">
                  Manage Global Attribute Values ({formValues.length} defined)
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Define global values for {formName || 'this attribute'} (e.g. Black, White, Beige, Red for Color or S, M, L, XL for Size).
                </p>
              </div>

              {/* INPUT CONTROLS */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input
                  type="text"
                  placeholder="Value Label (e.g. Black, S, Removable)"
                  value={newValLabel}
                  onChange={(e) => {
                    setNewValLabel(e.target.value);
                    if (!newValValue) setNewValValue(e.target.value);
                  }}
                  className="flex-1 bg-white border-neutral-200 text-xs font-medium text-black"
                />

                {(formType === 'SWATCH' || formType === 'COLOR') && (
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-neutral-200 shrink-0">
                    <span className="text-xs font-medium text-neutral-600">HEX:</span>
                    <input
                      type="color"
                      value={newValHex}
                      onChange={(e) => setNewValHex(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="font-mono text-xs font-bold uppercase">{newValHex}</span>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleSaveValueToForm}
                  className="bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-4 py-2 rounded-md shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingValueId ? 'Update Value' : 'Add Value'}</span>
                </Button>
              </div>

              {/* DEFINED VALUES TABLE / LIST */}
              <div className="space-y-2">
                {formValues.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic bg-white p-4 rounded-lg border border-neutral-200 text-center">
                    No values added yet. Type a value label above and click "+ Add Value".
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto bg-white p-3 rounded-lg border border-neutral-200">
                    {formValues.map((v) => (
                      <div
                        key={v.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium ${
                          v.status === 'inactive'
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through'
                            : 'bg-neutral-50 text-black border-neutral-200'
                        }`}
                      >
                        {v.colorCode && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs shrink-0"
                            style={{ backgroundColor: v.colorCode }}
                          />
                        )}
                        <span>{v.label}</span>

                        <div className="flex items-center gap-1 ml-2">
                          <button
                            type="button"
                            onClick={() => handleToggleValueStatusInForm(v.id)}
                            className="text-[10px] font-mono text-neutral-500 hover:text-black"
                            title="Toggle active/inactive status"
                          >
                            {v.status === 'active' ? '[Active]' : '[Inactive]'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditValueInForm(v)}
                            className="text-neutral-500 hover:text-black cursor-pointer"
                            title="Edit Value"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveValueFromForm(v.id)}
                            className="text-neutral-400 hover:text-red-600 cursor-pointer"
                            title="Remove Value"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubView('all')}
                className="text-xs border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-medium"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-6 py-2 rounded-md shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{subView === 'edit' ? 'Update Attribute' : 'Save Attribute'}</span>
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default AttributesPage;
