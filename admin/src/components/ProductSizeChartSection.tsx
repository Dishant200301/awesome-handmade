import React, { useState, useEffect } from 'react';
import { ProductAttributeAssignment, ProductSizeChartConfig, SizeChartColumn, SizeChartRow } from '../types/attribute.types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Ruler, Plus, Trash2, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface ProductSizeChartSectionProps {
  productAttributes: ProductAttributeAssignment[];
  sizeChart?: ProductSizeChartConfig;
  onChangeSizeChart: (sizeChart: ProductSizeChartConfig | undefined) => void;
}

const DEFAULT_COLUMNS: SizeChartColumn[] = [
  { id: 'col-brand-size', name: 'Brand Size', sortOrder: 1 },
  { id: 'col-in-size', name: 'IN Size', sortOrder: 2 },
  { id: 'col-bust', name: 'Bust (in)', sortOrder: 3 },
  { id: 'col-waist', name: 'Top Waist (in)', sortOrder: 4 },
  { id: 'col-shoulder', name: 'Shoulder (in)', sortOrder: 5 },
  { id: 'col-sleeve', name: 'Sleeve Length (in)', sortOrder: 6 },
  { id: 'col-hip', name: 'Hip (in)', sortOrder: 7 },
  { id: 'col-length', name: 'Top Length (in)', sortOrder: 8 }
];

const KURTA_PRESET_ROWS: SizeChartRow[] = [
  { id: 'row-xs', size: 'XS', sortOrder: 1, measurements: { 'col-brand-size': 'XS', 'col-in-size': 'XS', 'col-bust': '36', 'col-waist': '33', 'col-shoulder': '14.2', 'col-sleeve': '17', 'col-hip': '40', 'col-length': '45' } },
  { id: 'row-s', size: 'S', sortOrder: 2, measurements: { 'col-brand-size': 'S', 'col-in-size': 'S', 'col-bust': '38', 'col-waist': '35', 'col-shoulder': '14.5', 'col-sleeve': '17', 'col-hip': '42', 'col-length': '45' } },
  { id: 'row-m', size: 'M', sortOrder: 3, measurements: { 'col-brand-size': 'M', 'col-in-size': 'M', 'col-bust': '40', 'col-waist': '37', 'col-shoulder': '14.8', 'col-sleeve': '17', 'col-hip': '44', 'col-length': '45' } },
  { id: 'row-l', size: 'L', sortOrder: 4, measurements: { 'col-brand-size': 'L', 'col-in-size': 'L', 'col-bust': '42', 'col-waist': '39', 'col-shoulder': '15.2', 'col-sleeve': '17', 'col-hip': '46', 'col-length': '45' } },
  { id: 'row-xl', size: 'XL', sortOrder: 5, measurements: { 'col-brand-size': 'XL', 'col-in-size': 'XL', 'col-bust': '45', 'col-waist': '42', 'col-shoulder': '15.8', 'col-sleeve': '17', 'col-hip': '49', 'col-length': '45' } },
  { id: 'row-xxl', size: 'XXL', sortOrder: 6, measurements: { 'col-brand-size': 'XXL', 'col-in-size': 'XXL', 'col-bust': '48', 'col-waist': '45', 'col-shoulder': '16.2', 'col-sleeve': '17', 'col-hip': '52', 'col-length': '45' } },
  { id: 'row-3xl', size: '3XL', sortOrder: 7, measurements: { 'col-brand-size': '3XL', 'col-in-size': '3XL', 'col-bust': '50.5', 'col-waist': '47.5', 'col-shoulder': '16.8', 'col-sleeve': '17', 'col-hip': '54.5', 'col-length': '45' } }
];

export const ProductSizeChartSection: React.FC<ProductSizeChartSectionProps> = ({
  productAttributes = [],
  sizeChart,
  onChangeSizeChart
}) => {
  const [newColumnName, setNewColumnName] = useState('');
  const [newRowSize, setNewRowSize] = useState('');

  // Find Size attribute assignment if available
  const sizeAttr = productAttributes.find(
    (pa) =>
      pa.attributeName.toLowerCase() === 'size' ||
      pa.attributeSlug.toLowerCase() === 'size'
  );

  const selectedSizeValues = sizeAttr?.selectedValues || [];

  // Default state when enabling
  const isEnabled = sizeChart?.enabled ?? false;

  const currentChart: ProductSizeChartConfig = sizeChart || {
    enabled: false,
    title: 'Size Guide',
    unit: 'Inches',
    columns: [
      { id: 'col-size', name: 'Size', sortOrder: 1 },
      { id: 'col-bust', name: 'Bust (in)', sortOrder: 2 },
      { id: 'col-underbust', name: 'Under Bust (in)', sortOrder: 3 }
    ],
    rows: []
  };

  // Sync rows automatically when selectedSizeValues change
  useEffect(() => {
    if (!isEnabled || selectedSizeValues.length === 0) return;

    const existingRows = currentChart.rows || [];
    let updatedRows = [...existingRows];
    let hasChanged = false;

    // Check for new sizes selected in attributes that aren't in chart rows yet
    selectedSizeValues.forEach((szVal, idx) => {
      const exists = updatedRows.some(
        (r) => r.size.toLowerCase() === szVal.toLowerCase()
      );
      if (!exists) {
        hasChanged = true;
        const newRowId = `row-${Date.now()}-${idx}`;
        const firstColId = currentChart.columns?.[0]?.id || 'col-size';
        updatedRows.push({
          id: newRowId,
          size: szVal,
          sortOrder: updatedRows.length + 1,
          measurements: {
            [firstColId]: szVal
          }
        });
      }
    });

    if (hasChanged) {
      onChangeSizeChart({
        ...currentChart,
        rows: updatedRows
      });
    }
  }, [selectedSizeValues, isEnabled]);

  const handleToggleEnable = (enabled: boolean) => {
    if (enabled) {
      // If enabling and rows are empty, populate rows from selected size attribute values if present
      let initialRows = currentChart.rows || [];
      if (initialRows.length === 0 && selectedSizeValues.length > 0) {
        const firstColId = currentChart.columns?.[0]?.id || 'col-size';
        initialRows = selectedSizeValues.map((sz, idx) => ({
          id: `row-${Date.now()}-${idx}`,
          size: sz,
          sortOrder: idx + 1,
          measurements: { [firstColId]: sz }
        }));
      }

      onChangeSizeChart({
        ...currentChart,
        enabled: true,
        rows: initialRows
      });
    } else {
      // Preserve existing data but set enabled to false
      onChangeSizeChart({
        ...currentChart,
        enabled: false
      });
    }
  };

  const handleUpdateChartField = (field: keyof ProductSizeChartConfig, value: any) => {
    onChangeSizeChart({
      ...currentChart,
      [field]: value
    });
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const colName = newColumnName.trim();
    const colId = `col-${Date.now()}`;
    const newCol: SizeChartColumn = {
      id: colId,
      name: colName,
      sortOrder: (currentChart.columns || []).length + 1
    };

    onChangeSizeChart({
      ...currentChart,
      columns: [...(currentChart.columns || []), newCol]
    });
    setNewColumnName('');
  };

  const handleRemoveColumn = (columnId: string) => {
    if (currentChart.columns.length <= 1) {
      alert('Size Chart must have at least one column.');
      return;
    }
    const updatedCols = currentChart.columns.filter((c) => c.id !== columnId);
    // Remove measurement values for this column from rows
    const updatedRows = (currentChart.rows || []).map((row) => {
      const nextMeas = { ...row.measurements };
      delete nextMeas[columnId];
      return { ...row, measurements: nextMeas };
    });

    onChangeSizeChart({
      ...currentChart,
      columns: updatedCols,
      rows: updatedRows
    });
  };

  const handleAddRow = (overrideSize?: string) => {
    const sizeVal = overrideSize || newRowSize.trim() || 'Custom Size';
    const firstColId = currentChart.columns?.[0]?.id || 'col-size';
    const newRow: SizeChartRow = {
      id: `row-${Date.now()}`,
      size: sizeVal,
      sortOrder: (currentChart.rows || []).length + 1,
      measurements: {
        [firstColId]: sizeVal
      }
    };

    onChangeSizeChart({
      ...currentChart,
      rows: [...(currentChart.rows || []), newRow]
    });
    setNewRowSize('');
  };

  const handleRemoveRow = (rowId: string) => {
    const updatedRows = (currentChart.rows || []).filter((r) => r.id !== rowId);
    onChangeSizeChart({
      ...currentChart,
      rows: updatedRows
    });
  };

  const handleUpdateMeasurement = (rowId: string, columnId: string, value: string) => {
    const updatedRows = (currentChart.rows || []).map((row) => {
      if (row.id === rowId) {
        const nextMeas = { ...row.measurements, [columnId]: value };
        // If updating the first column, sync size name
        const firstColId = currentChart.columns?.[0]?.id;
        const sizeName = columnId === firstColId ? value : row.size;
        return {
          ...row,
          size: sizeName,
          measurements: nextMeas
        };
      }
      return row;
    });

    onChangeSizeChart({
      ...currentChart,
      rows: updatedRows
    });
  };

  const handleLoadKurtaPreset = () => {
    onChangeSizeChart({
      enabled: true,
      title: 'IN KURTAS & KURTIS',
      unit: 'Inches',
      columns: DEFAULT_COLUMNS,
      rows: KURTA_PRESET_ROWS
    });
  };

  return (
    <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl space-y-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Ruler className="w-4 h-4 text-black shrink-0" />
            <h2 className="text-sm font-bold text-black tracking-tight uppercase">Product-Specific Size Chart Builder</h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal mt-0.5">
            Configure product-specific size measurements (e.g. Bust, Waist, Shoulder, Length). Size rows automatically sync with assigned Size attributes.
          </p>
        </div>

        {/* ENABLE / DISABLE TOGGLE */}
        <label className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-100 border border-neutral-200 cursor-pointer select-none shrink-0 transition-colors hover:bg-neutral-150">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => handleToggleEnable(e.target.checked)}
            className="w-4 h-4 rounded text-black border-neutral-300 focus:ring-black cursor-pointer"
          />
          <span className="text-xs font-bold text-black uppercase tracking-wider">
            {isEnabled ? 'Size Chart Enabled' : 'Enable Size Chart'}
          </span>
        </label>
      </div>

      {/* WHEN DISABLED */}
      {!isEnabled && (
        <div className="p-5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 flex flex-col items-center justify-center text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-neutral-400" />
          <p className="text-xs font-bold text-neutral-700">Size Chart is currently disabled for this product.</p>
          <p className="text-[11px] text-neutral-500 max-w-md">
            Check <strong className="text-black">"Enable Size Chart"</strong> above to build a dynamic measurement guide for your customers.
          </p>
          {currentChart.rows && currentChart.rows.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-semibold mt-1">
              Note: Saved chart data ({currentChart.rows.length} rows) is preserved and will restore when re-enabled.
            </span>
          )}
        </div>
      )}

      {/* WHEN ENABLED */}
      {isEnabled && (
        <div className="space-y-6">
          {/* TITLE, UNIT & SAMPLE PRESETS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50/70 p-4 rounded-xl border border-neutral-200 items-end">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-black uppercase tracking-wider">
                Chart Title *
              </label>
              <Input
                type="text"
                placeholder="e.g. IN KURTAS & KURTIS or Size Guide"
                value={currentChart.title}
                onChange={(e) => handleUpdateChartField('title', e.target.value)}
                className="bg-white border-neutral-200 text-xs font-bold text-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-black uppercase tracking-wider">
                Measurement Unit
              </label>
              <Select
                value={currentChart.unit || 'Inches'}
                onValueChange={(val) => handleUpdateChartField('unit', val)}
                options={[
                  { value: 'Inches', label: 'Inches (in)' },
                  { value: 'CM', label: 'Centimeters (cm)' },
                  { value: 'MM', label: 'Millimeters (mm)' },
                  { value: 'EU', label: 'EU Standard' },
                  { value: 'US', label: 'US Standard' },
                  { value: 'UK', label: 'UK Standard' },
                  { value: 'Custom', label: 'Custom Unit' }
                ]}
                className="bg-white border-neutral-200 text-xs font-semibold text-black"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleLoadKurtaPreset}
                className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-3 h-9 rounded-lg flex items-center gap-1.5 shadow-2xs w-full justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Load Kurti Sample Preset</span>
              </Button>
            </div>
          </div>

          {/* DYNAMIC MEASUREMENT COLUMNS MANAGER */}
          <div className="space-y-3 p-4 bg-neutral-50/40 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-black uppercase tracking-wider">
                Measurement Columns ({currentChart.columns.length})
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentChart.columns.map((col) => (
                <div
                  key={col.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-800 shadow-2xs group"
                >
                  <span>{col.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColumn(col.id)}
                    className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                    title={`Delete column ${col.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* ADD COLUMN INPUT */}
            <div className="flex items-center gap-2 pt-1 max-w-md">
              <Input
                type="text"
                placeholder="Enter new measurement column (e.g. Waist, Hip)..."
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColumn();
                  }
                }}
                className="bg-white border-neutral-200 text-xs font-medium text-black flex-1 h-8"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddColumn}
                className="bg-neutral-800 hover:bg-black text-white text-xs font-bold px-3 h-8 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Column</span>
              </Button>
            </div>
          </div>

          {/* DYNAMIC MATRIX TABLE GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black uppercase tracking-wider">
                Size Measurements Table ({currentChart.rows.length} Size Rows)
              </span>

              {selectedSizeValues.length > 0 && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Auto-synced with Size Attributes ({selectedSizeValues.join(', ')})
                </span>
              )}
            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-[11px] font-extrabold uppercase tracking-wider text-black">
                    {currentChart.columns.map((col) => (
                      <th key={col.id} className="p-3 border-r border-neutral-200/60 last:border-r-0 whitespace-nowrap">
                        {col.name}
                      </th>
                    ))}
                    <th className="p-3 text-center w-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-sans">
                  {currentChart.rows.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50/80 transition-colors">
                      {currentChart.columns.map((col, cIdx) => {
                        const val = row.measurements[col.id] || (cIdx === 0 ? row.size : '');
                        return (
                          <td key={col.id} className="p-2 border-r border-neutral-200/50 last:border-r-0 align-middle">
                            <Input
                              type="text"
                              value={val}
                              placeholder={cIdx === 0 ? row.size : '-'}
                              onChange={(e) => handleUpdateMeasurement(row.id, col.id, e.target.value)}
                              className={`h-8 text-xs bg-white border-neutral-200 ${
                                cIdx === 0 ? 'font-black text-black bg-neutral-50' : 'font-medium text-neutral-900'
                              }`}
                            />
                          </td>
                        );
                      })}
                      <td className="p-2 align-middle text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD ROW CONTROLS */}
            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <Input
                type="text"
                placeholder="Add extra size row (e.g. 4XL)..."
                value={newRowSize}
                onChange={(e) => setNewRowSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRow();
                  }
                }}
                className="bg-white border-neutral-200 text-xs font-medium text-black flex-1 h-8"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddRow()}
                className="bg-neutral-800 hover:bg-black text-white text-xs font-bold px-3 h-8 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
