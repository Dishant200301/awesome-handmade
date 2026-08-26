import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface QuickViewContextType {
  isOpen: boolean;
  activeProductId: string | number | null;
  openQuickView: (productId: string | number) => void;
  closeQuickView: () => void;
  isMobileOrTablet: boolean;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export const QuickViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | number | null>(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileOrTablet(isMobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openQuickView = useCallback((productId: string | number) => {
    setActiveProductId(productId);
    setIsOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Listen to URL search param `quickview` for deep linking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const qv = urlParams.get("quickview");
    if (qv) {
      setActiveProductId(qv);
      setIsOpen(true);
    }
  }, []);

  return (
    <QuickViewContext.Provider
      value={{
        isOpen,
        activeProductId,
        openQuickView,
        closeQuickView,
        isMobileOrTablet,
      }}
    >
      {children}
    </QuickViewContext.Provider>
  );
};

export const useQuickView = () => {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error("useQuickView must be used within a QuickViewProvider");
  }
  return context;
};
