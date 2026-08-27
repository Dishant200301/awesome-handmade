import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheckCircle, FiInfo } from "react-icons/fi";
import { SizeChartEntry, SizeGuide, ProductSizeChartConfig } from "../types/product";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../core/components/ui/table";
import { Button } from "../../core/components/ui/button";

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeChart: SizeChartEntry[];
  sizeChartConfig?: ProductSizeChartConfig;
  sizeGuide?: SizeGuide;
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

type Unit = "cm" | "in";

const DEFAULT_SIZE_CHART: SizeChartEntry[] = [
  { brandSize: "2-3 Y", inSize: "Kids 2-3 Y", usSize: "2T", euSize: "92-98", ukSize: "2-3 Y", cnSize: "100", bustCm: "52-54", underbustCm: "48-50" },
  { brandSize: "4-5 Y", inSize: "Kids 4-5 Y", usSize: "4T", euSize: "104-110", ukSize: "4-5 Y", cnSize: "110", bustCm: "56-58", underbustCm: "52-54" },
  { brandSize: "6-7 Y", inSize: "Kids 6-7 Y", usSize: "6", euSize: "116-122", ukSize: "6-7 Y", cnSize: "120", bustCm: "60-62", underbustCm: "56-58" },
  { brandSize: "8-9 Y", inSize: "Kids 8-9 Y", usSize: "8", euSize: "128-134", ukSize: "8-9 Y", cnSize: "130", bustCm: "64-66", underbustCm: "60-62" },
  { brandSize: "10-12 Y", inSize: "Kids 10-12 Y", usSize: "10", euSize: "140-152", ukSize: "10-12 Y", cnSize: "140", bustCm: "68-72", underbustCm: "64-66" },
  { brandSize: "XS", inSize: "XS (34)", usSize: "XS", euSize: "34", ukSize: "6", cnSize: "155/80A", bustCm: "78-82", underbustCm: "68-72" },
  { brandSize: "S", inSize: "S (36)", usSize: "S", euSize: "36", ukSize: "8", cnSize: "160/84A", bustCm: "83-87", underbustCm: "73-77" },
  { brandSize: "M", inSize: "M (38)", usSize: "M", euSize: "38", ukSize: "10", cnSize: "165/88A", bustCm: "88-92", underbustCm: "78-82" },
  { brandSize: "L", inSize: "L (40)", usSize: "L", euSize: "40", ukSize: "12", cnSize: "170/92A", bustCm: "93-97", underbustCm: "83-87" },
  { brandSize: "XL", inSize: "XL (42)", usSize: "XL", euSize: "42", ukSize: "14", cnSize: "175/96A", bustCm: "98-102", underbustCm: "88-92" },
  { brandSize: "Free Size", inSize: "Adjustable", usSize: "Free", euSize: "Free", ukSize: "Free", cnSize: "Free", bustCm: "75-105", underbustCm: "65-95" },
];

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  sizeChart = DEFAULT_SIZE_CHART,
  sizeChartConfig,
  sizeGuide,
  selectedSize,
  onSelectSize,
}) => {
  const [activeTab, setActiveTab] = useState<string>("India");
  const [unit, setUnit] = useState<Unit>("cm");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const chartData = (sizeChart && sizeChart.length > 0) ? sizeChart : DEFAULT_SIZE_CHART;

  const countriesList = sizeGuide && sizeGuide.countries && sizeGuide.countries.length > 0
    ? sizeGuide.countries
    : [
        { id: "c-1", name: "India", code: "IN", displayOrder: 1 },
        { id: "c-2", name: "USA", code: "US", displayOrder: 2 },
        { id: "c-3", name: "EU", code: "EU", displayOrder: 3 },
        { id: "c-4", name: "UK", code: "UK", displayOrder: 4 },
        { id: "c-5", name: "China", code: "CN", displayOrder: 5 }
      ];

  const activeCountry = countriesList.find((c) => c.name === activeTab || c.code === activeTab) || countriesList[0];

  const getCountrySizeKey = (tabName: string): keyof SizeChartEntry => {
    switch (tabName) {
      case "India":
        return "inSize";
      case "USA":
        return "usSize";
      case "EU":
        return "euSize";
      case "UK":
        return "ukSize";
      case "China":
        return "cnSize";
      default:
        return "inSize";
    }
  };

  const formatValue = (cmStr: string) => {
    if (!cmStr) return "-";
    if (unit === "cm") return `${cmStr} cm`;
    const parts = cmStr.split("-").map((s) => parseFloat(s.trim()));
    if (parts.some((n) => isNaN(n))) return cmStr;
    if (parts.length === 2) {
      const minIn = (parts[0] / 2.54).toFixed(1);
      const maxIn = (parts[1] / 2.54).toFixed(1);
      return `${minIn}" - ${maxIn}"`;
    }
    return `${(parts[0] / 2.54).toFixed(1)}"`;
  };

  const handleSelectRow = (size: string) => {
    onSelectSize(size);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  // Check if product has active product-specific sizeChartConfig
  const hasProductSpecificConfig = sizeChartConfig && sizeChartConfig.enabled && sizeChartConfig.rows && sizeChartConfig.rows.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-zinc-200 my-auto flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar matching Screenshot */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
              {hasProductSpecificConfig ? (sizeChartConfig?.title || "Size Chart") : (sizeGuide ? sizeGuide.title : "Size Guide & Conversion")}
            </h3>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/80 cursor-pointer"
            >
              <FiX size={20} />
            </Button>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin space-y-4">
            {/* If product has product-specific size chart config */}
            {hasProductSpecificConfig ? (
              <div className="space-y-4">
                {/* SUBTITLE BANNER matching Screenshot */}
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-zinc-900 uppercase tracking-wide">
                    {sizeChartConfig.title || "IN KURTAS & KURTIS"}
                  </span>
                  {sizeChartConfig.unit && (
                    <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
                      Unit: {sizeChartConfig.unit}
                    </span>
                  )}
                </div>

                <div className="rounded-xl border border-zinc-200 overflow-hidden shadow-2xs bg-white">
                  <Table className="w-full text-left">
                    <TableHeader className="bg-zinc-50 border-b border-zinc-200">
                      <TableRow className="hover:bg-zinc-50">
                        {sizeChartConfig.columns.map((col, cIdx) => (
                          <TableHead
                            key={col.id}
                            className={`font-bold text-zinc-900 text-xs sm:text-sm p-3.5 whitespace-nowrap ${
                              cIdx === 0 ? "font-extrabold text-black" : ""
                            }`}
                          >
                            {col.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-zinc-200 text-xs sm:text-sm font-medium">
                      {sizeChartConfig.rows.map((row) => {
                        const isSelected = selectedSize.toLowerCase() === row.size.toLowerCase();
                        return (
                          <TableRow
                            key={row.id}
                            onClick={() => handleSelectRow(row.size)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-zinc-900 text-white font-bold hover:bg-zinc-800"
                                : "hover:bg-zinc-50/80 text-zinc-800"
                            }`}
                          >
                            {sizeChartConfig.columns.map((col, cIdx) => {
                              const val = row.measurements[col.id] || (cIdx === 0 ? row.size : "-");
                              return (
                                <TableCell
                                  key={col.id}
                                  className={`p-3.5 whitespace-nowrap ${
                                    cIdx === 0 ? "font-extrabold text-sm sm:text-base text-zinc-950" : ""
                                  } ${isSelected ? "text-white" : "text-zinc-800"}`}
                                >
                                  {val}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              /* Fallback Admin Global Size Guide Table */
              <div className="space-y-4">
                {/* Controls Bar: Country Tabs & Unit Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex flex-wrap gap-1.5 bg-zinc-100 p-1 rounded-xl">
                    {countriesList.map((country) => {
                      const isActive = activeTab === country.name || activeTab === country.code;
                      return (
                        <button
                          key={country.id || country.code}
                          type="button"
                          onClick={() => setActiveTab(country.name)}
                          className={`text-xs px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                            isActive
                              ? "bg-white text-zinc-900 shadow-xs border border-zinc-200"
                              : "text-zinc-600 hover:text-zinc-900"
                          }`}
                        >
                          {country.name}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setUnit("cm")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        unit === "cm" ? "bg-white text-zinc-900 shadow-2xs font-bold" : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit("in")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        unit === "in" ? "bg-white text-zinc-900 shadow-2xs font-bold" : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      in
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 overflow-hidden shadow-2xs bg-white">
                  <Table>
                    <TableHeader className="bg-zinc-50 border-b border-zinc-200">
                      <TableRow className="hover:bg-zinc-50">
                        <TableHead className="font-extrabold text-zinc-900 text-xs uppercase tracking-wider">BRAND SIZE</TableHead>
                        <TableHead className="font-extrabold text-zinc-900 text-xs uppercase tracking-wider">
                          {activeCountry.code === "CN" ? "CN STANDARD" : `${activeCountry.name.toUpperCase()} STANDARD`}
                        </TableHead>
                        <TableHead className="font-extrabold text-zinc-900 text-xs uppercase tracking-wider">BUST</TableHead>
                        <TableHead className="font-extrabold text-zinc-900 text-xs uppercase tracking-wider">UNDERBUST</TableHead>
                        <TableHead className="font-extrabold text-zinc-900 text-xs uppercase tracking-wider text-right">ACTION</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-zinc-100 text-xs font-medium">
                      {chartData.map((row, idx) => {
                        const isSelected = selectedSize === row.brandSize;
                        const countryVal = row[getCountrySizeKey(activeTab)] || row.inSize;

                        return (
                          <TableRow
                            key={idx}
                            onClick={() => handleSelectRow(row.brandSize)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-zinc-900 text-white hover:bg-zinc-800 font-bold"
                                : "hover:bg-zinc-50 text-zinc-800"
                            }`}
                          >
                            <TableCell className="font-extrabold text-sm text-zinc-900">
                              {row.brandSize}
                            </TableCell>
                            <TableCell className="font-bold text-zinc-700">{countryVal}</TableCell>
                            <TableCell className={isSelected ? "text-zinc-200 font-bold" : "text-zinc-700 font-medium"}>
                              {formatValue(row.bustCm)}
                            </TableCell>
                            <TableCell className={isSelected ? "text-zinc-200 font-bold" : "text-zinc-700 font-medium"}>
                              {formatValue(row.underbustCm)}
                            </TableCell>
                            <TableCell className="text-right">
                              {isSelected ? (
                                <span className="text-xs font-extrabold text-emerald-400 flex items-center justify-end gap-1">
                                  <FiCheckCircle size={13} /> Selected
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectRow(row.brandSize);
                                  }}
                                  className="text-xs font-bold text-zinc-500 hover:text-zinc-900 underline underline-offset-2 cursor-pointer"
                                >
                                  Select
                                </button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <span className="text-xs text-zinc-600">
              Selected Size: <strong className="text-zinc-900 uppercase font-extrabold">{selectedSize || "S"}</strong>
            </span>
            <Button
              onClick={onClose}
              className="bg-zinc-900 hover:bg-black text-white font-extrabold text-xs px-6 py-2 rounded-xl shadow-xs cursor-pointer"
            >
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
