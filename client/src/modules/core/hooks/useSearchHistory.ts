import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "aaramly_search_history_v1";
const MAX_SEARCH_HISTORY = 8;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return ["thermal label", "packing tape", "bubble roll"];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(searchHistory));
    } catch {
      // ignore
    }
  }, [searchHistory]);

  const addSearchQuery = (query: string) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed);
      return [trimmed, ...filtered].slice(0, MAX_SEARCH_HISTORY);
    });
  };

  const removeSearchQuery = (query: string) => {
    setSearchHistory((prev) => prev.filter((q) => q !== query));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  return {
    searchHistory,
    addSearchQuery,
    removeSearchQuery,
    clearSearchHistory,
  };
}
