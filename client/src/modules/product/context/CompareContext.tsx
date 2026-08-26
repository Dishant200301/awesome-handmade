import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types/product";

interface CompareContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string | number) => void;
  toggleCompare: (product: Product) => void;
  isCompared: (productId: string | number) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "aaramly_compare_v1";
const MAX_COMPARE_ITEMS = 4;

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(compareProducts));
    } catch {
      // ignore
    }
  }, [compareProducts]);

  const addToCompare = (product: Product) => {
    setCompareProducts((prev) => {
      if (prev.some((p) => String(p.id) === String(product.id))) return prev;
      if (prev.length >= MAX_COMPARE_ITEMS) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string | number) => {
    setCompareProducts((prev) => prev.filter((p) => String(p.id) !== String(productId)));
  };

  const toggleCompare = (product: Product) => {
    if (isCompared(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const isCompared = (productId: string | number) => {
    return compareProducts.some((p) => String(p.id) === String(productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isCompared,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
