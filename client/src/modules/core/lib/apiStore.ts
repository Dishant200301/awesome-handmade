import { ProductDetails, ProductColorVariation } from "@/modules/product/types/product";
import { SAMPLE_PRODUCT, CLIENT_SHOP_PRODUCTS } from "@/modules/product/data/productData";

const API_BASE_URL = "http://localhost:5000/api/v1";

// Live Product Store state listeners
type Listener = () => void;
const listeners: Set<Listener> = new Set();

const DEFAULT_CATALOG_PRODUCTS: any[] = [];

let liveProducts: any[] = [...DEFAULT_CATALOG_PRODUCTS];
let isLoaded = false;

export const subscribeToProductStore = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((fn) => fn());
};

// Fetch live products from MySQL Express backend
export const fetchLiveProducts = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (res.ok) {
      const json = await res.json();
      const list = json.data || json.items || json.products;
      if (list && Array.isArray(list) && list.length > 0) {
        liveProducts = list;
        isLoaded = true;
        notifyListeners();
        return liveProducts;
      }
    }
  } catch (e) {
    console.warn("Express MySQL backend offline; serving local dynamic state.");
  }
  return liveProducts;
};

// Add product from Admin Panel to live store & post to API
export const addLiveProduct = async (productData: any) => {
  const existingIdx = liveProducts.findIndex((p) => p.id === productData.id);
  if (existingIdx !== -1) {
    liveProducts[existingIdx] = productData;
  } else {
    liveProducts.unshift(productData);
  }
  notifyListeners();

  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      const json = await res.json();
      await fetchLiveProducts();
      return json.data;
    }
  } catch (e) {
    console.warn("Failed to POST product to API server.");
  }
};

let deletedProductIds = new Set<string>();

const syncDeletedIds = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('aaramly_deleted_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) parsed.forEach((id) => deletedProductIds.add(String(id)));
      }
    } catch (e) {}
  }
};
syncDeletedIds();

// BroadcastChannel and Storage Listener for Real-Time Sync with Admin Panel
if (typeof window !== "undefined") {
  try {
    const channel = new BroadcastChannel("aaramly_product_sync");
    channel.onmessage = (event) => {
      if (event.data) {
        if (Array.isArray(event.data.deletedIds)) {
          event.data.deletedIds.forEach((id: string) => deletedProductIds.add(String(id)));
          try {
            localStorage.setItem('aaramly_deleted_products', JSON.stringify(Array.from(deletedProductIds)));
          } catch (e) {}
        }
        if (Array.isArray(event.data.products)) {
          liveProducts = event.data.products.filter((p: any) => !deletedProductIds.has(String(p.id)));
          notifyListeners();
        } else if (event.data.product) {
          const updated = event.data.product;
          if (!deletedProductIds.has(String(updated.id))) {
            const idx = liveProducts.findIndex((p) => String(p.id) === String(updated.id));
            if (idx !== -1) {
              liveProducts[idx] = updated;
            } else {
              liveProducts.unshift(updated);
            }
          }
          notifyListeners();
        }
      }
    };
  } catch (e) {
    // BroadcastChannel fallback
  }

  window.addEventListener("storage", (e) => {
    if (e.key === "aaramly_deleted_products" && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) parsed.forEach((id) => deletedProductIds.add(String(id)));
        notifyListeners();
      } catch (err) {}
    }
    if (e.key === "aaramly_admin_sync" && e.newValue) {
      try {
        syncDeletedIds();
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed.deletedIds)) {
          parsed.deletedIds.forEach((id: string) => deletedProductIds.add(String(id)));
        }
        if (Array.isArray(parsed.products)) {
          liveProducts = parsed.products.filter((p: any) => !deletedProductIds.has(String(p.id)));
          notifyListeners();
        }
      } catch (err) {}
    }
  });

  window.addEventListener("aaramly_product_sync", () => {
    try {
      syncDeletedIds();
      const stored = localStorage.getItem("aaramly_admin_sync");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.deletedIds)) {
          parsed.deletedIds.forEach((id: string) => deletedProductIds.add(String(id)));
        }
        if (Array.isArray(parsed.products)) {
          liveProducts = parsed.products.filter((p: any) => !deletedProductIds.has(String(p.id)) && p.isPublished !== false && p.status !== 'Draft');
          notifyListeners();
        }
      }
    } catch (e) {}
  });

  // Load persisted admin sync state from localStorage on init
  try {
    const stored = localStorage.getItem("aaramly_admin_sync");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.deletedIds)) {
        parsed.deletedIds.forEach((id: string) => deletedProductIds.add(String(id)));
      }
      if (Array.isArray(parsed.products)) {
        liveProducts = parsed.products.filter((p: any) => !deletedProductIds.has(String(p.id)) && p.isPublished !== false && p.status !== 'Draft');
      }
    }
  } catch (e) {}
}

export const updateLiveStoreDirectly = (productsList: any[]) => {
  liveProducts = productsList;
  notifyListeners();
};

// Helper function to format variants to Client ProductColorVariation format
const formatVariantImages = (v: any, index: number, parentProduct: any): any => {
  const colorName = v.colorName || v.color || `Color ${index + 1}`;

  // Find matching color object from parentProduct.colors (from Admin Product Editor)
  const colorObj = (parentProduct?.colors || []).find(
    (c: any) => (c.colorName || c.name || "").toLowerCase() === colorName.toLowerCase()
  );

  // Gather parent product image URLs
  const parentImages: string[] = Array.isArray(parentProduct?.images) && parentProduct.images.length > 0
    ? parentProduct.images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
    : (typeof parentProduct?.image === "string" && parentProduct.image.trim().length > 0 ? [parentProduct.image] : []);

  const fallbackMainImg = parentImages[0] || "";
  const mainImg = colorObj?.mainImage || colorObj?.displayImage || v.thumbnail || v.image || fallbackMainImg;

  let galleryList: any[] = [];
  if (Array.isArray(v.images) && v.images.length > 0) {
    galleryList = v.images.map((img: any, i: number) =>
      typeof img === "string"
        ? { id: `img-${v.id || index}-${i}`, url: img, alt: `${colorName} ${i + 1}` }
        : { id: img.id || `img-${v.id || index}-${i}`, url: img.url || mainImg, alt: img.alt || `${colorName} ${i + 1}` }
    );
  } else if (colorObj && Array.isArray(colorObj.galleryImages) && colorObj.galleryImages.length > 0) {
    const allUrls = Array.from(new Set([mainImg, ...colorObj.galleryImages].filter(Boolean)));
    galleryList = allUrls.map((url, i) => ({
      id: `img-${v.id || index}-${i}`,
      url,
      alt: `${colorName} View ${i + 1}`,
    }));
  } else if (Array.isArray(v.galleryImages) && v.galleryImages.length > 0) {
    const allUrls = Array.from(new Set([mainImg, ...v.galleryImages].filter(Boolean)));
    galleryList = allUrls.map((url, i) => ({
      id: `img-${v.id || index}-${i}`,
      url,
      alt: `${colorName} View ${i + 1}`,
    }));
  } else {
    // Check if another variant with the same color uploaded gallery images or a distinct main image
    const rawVars = parentProduct?.variations || parentProduct?.variants || [];
    const colorSibling = rawVars.find(
      (sib: any) =>
        (sib.colorName || sib.color)?.toLowerCase() === colorName.toLowerCase() &&
        ((Array.isArray(sib.galleryImages) && sib.galleryImages.length > 0) ||
         (Array.isArray(sib.images) && sib.images.length > 0) ||
         (sib.image && sib.image !== parentProduct?.image))
    );

    if (colorSibling) {
      const sibGallery = colorSibling.galleryImages || colorSibling.images || [];
      const sibMain = colorSibling.thumbnail || colorSibling.image || mainImg;
      const sibUrls = Array.from(new Set([sibMain, ...sibGallery.map((x: any) => (typeof x === "string" ? x : x.url))]));
      galleryList = sibUrls.map((url, i) => ({
        id: `img-${v.id || index}-${i}`,
        url,
        alt: `${colorName} View ${i + 1}`,
      }));
    } else if (parentImages.length > 0) {
      galleryList = parentImages.map((url, i) => ({
        id: `img-${v.id || index}-${i}`,
        url,
        alt: `${colorName} View ${i + 1}`,
      }));
    } else {
      galleryList = [
        { id: `img-${v.id || index}-0`, url: mainImg, alt: `${colorName} Front View` }
      ];
    }
  }

  // Derive hex code for common color names if missing
  let colorHex = colorObj?.colorHex || v.colorHex || "#000000";
  if (!colorHex || colorHex === "#000000") {
    const lower = colorName.toLowerCase();
    if (lower.includes("black")) colorHex = "#000000";
    else if (lower.includes("white")) colorHex = "#FFFFFF";
    else if (lower.includes("pink")) colorHex = "#FFB6C1";
    else if (lower.includes("beige") || lower.includes("nude")) colorHex = "#F5F5DC";
    else if (lower.includes("red")) colorHex = "#DC2626";
    else if (lower.includes("blue")) colorHex = "#2563EB";
    else if (lower.includes("green")) colorHex = "#16A34A";
    else if (lower.includes("yellow")) colorHex = "#EAB308";
    else if (lower.includes("purple")) colorHex = "#9333EA";
  }

  const varPrice = Number(v.price) || Number(parentProduct?.price) || 799;
  const varOrigPrice = Number(v.originalPrice) || Number(parentProduct?.originalPrice) || Math.round(varPrice * 1.6);
  const discountPct = Math.max(0, Math.round(((varOrigPrice - varPrice) / varOrigPrice) * 100));
  const defaultSize = (colorObj?.sizes && colorObj.sizes[0]) || (parentProduct?.availableSizes && parentProduct.availableSizes[0]) || "S";

  return {
    id: v.id || `var-${index}`,
    colorName,
    colorHex,
    size: v.size || v.sizeName || defaultSize,
    sizeName: v.sizeName || v.size || defaultSize,
    thumbnail: mainImg,
    price: varPrice,
    originalPrice: varOrigPrice,
    discountPercentage: discountPct,
    sku: v.sku || parentProduct?.defaultSku || parentProduct?.sku || `SKU-${index}`,
    stock: Number(v.stock) !== undefined ? Number(v.stock) : (Number(parentProduct?.stock) || 50),
    images: galleryList,
  };
};

// Get single product details dynamically
export const getLiveProductById = (idOrSlug?: string): ProductDetails => {
  if (!idOrSlug) {
    const first = liveProducts[0];
    if (first) return getLiveProductById(first.id);
    return SAMPLE_PRODUCT;
  }

  const query = String(idOrSlug).trim().toLowerCase();

  let found = liveProducts.find(
    (p) => String(p.id).toLowerCase() === query || String(p.slug || "").toLowerCase() === query
  );

  if (!found && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("aaramly_admin_sync");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.products) && parsed.products.length > 0) {
          liveProducts = parsed.products;
          found = liveProducts.find(
            (p) => String(p.id).toLowerCase() === query || String(p.slug || "").toLowerCase() === query
          );
        }
      }
    } catch (e) {}
  }

  if (!found) {
    if (liveProducts.length > 0) {
      found = liveProducts[0];
    } else {
      return SAMPLE_PRODUCT;
    }
  }

  const parentImages: string[] = Array.isArray(found.images) && found.images.length > 0
    ? found.images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
    : (typeof found.image === "string" && found.image.trim().length > 0 ? [found.image] : []);

  const rawVariants = found.variations || found.variants || [];
  let mappedVariations: ProductColorVariation[] = [];

  if (Array.isArray(rawVariants) && rawVariants.length > 0) {
    mappedVariations = rawVariants.map((v: any, i: number) => formatVariantImages(v, i, found));
  }

  // Synthesize missing color variations from found.colors if present
  if (Array.isArray(found.colors) && found.colors.length > 0) {
    found.colors.forEach((col: any) => {
      const exists = mappedVariations.some(
        (v) => (v.colorName || "").toLowerCase() === (col.colorName || "").toLowerCase()
      );
      if (!exists) {
        const colSizes = (col.sizes && col.sizes.length > 0) ? col.sizes : (found.availableSizes || ["S", "M", "L"]);
        colSizes.forEach((sz: string, sIdx: number) => {
          const mainImg = col.mainImage || col.displayImage || (parentImages[0]) || "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=800";
          const gallery = col.mainImage
            ? [
                { id: "img-main", url: col.mainImage, alt: `${found.name} - ${col.colorName}` },
                ...(col.galleryImages || []).map((gUrl: string, idx: number) => ({ id: `img-gal-${idx}`, url: gUrl, alt: `${found.name} - ${col.colorName} ${idx + 1}` }))
              ]
            : [];
          mappedVariations.push({
            id: `v-synth-${col.colorName}-${sz}-${sIdx}`,
            colorName: col.colorName,
            colorHex: col.colorHex || "#000000",
            size: sz,
            sizeName: sz,
            thumbnail: col.displayImage || mainImg,
            price: Number(found.price) || 799,
            originalPrice: Number(found.originalPrice) || 1299,
            discountPercentage: 38,
            sku: found.defaultSku || found.sku || `AAR-${col.colorName}-${sz}`,
            stock: Number(found.stock) !== undefined ? Number(found.stock) : 50,
            images: gallery
          });
        });
      }
    });
  }

  if (mappedVariations.length === 0) {
    const mainImg = parentImages[0] || "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=800";
    const gallery = parentImages.length > 0
      ? parentImages.map((url, i) => ({ id: `img-def-${i}`, url, alt: `${found.name} View ${i + 1}` }))
      : [{ id: "img-def-0", url: mainImg, alt: found.name }];

    const priceNum = Number(found.price) || 799;
    const origPriceNum = Number(found.originalPrice) || Math.round(priceNum * 1.6);
    const discPct = Math.max(0, Math.round(((origPriceNum - priceNum) / origPriceNum) * 100));

    mappedVariations = [{
      id: "v-default",
      colorName: "Black",
      colorHex: "#000000",
      size: (found.availableSizes && found.availableSizes[0]) || "S",
      sizeName: (found.availableSizes && found.availableSizes[0]) || "S",
      thumbnail: mainImg,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercentage: discPct,
      sku: found.defaultSku || found.sku || "AAR-SKU-100",
      stock: Number(found.stock) !== undefined ? Number(found.stock) : 50,
      images: gallery,
    }];
  }

  // Build descriptionCards if admin provided images or custom cards
  let descCards = found.descriptionCards;
  if (!descCards || descCards.length === 0) {
    if (parentImages.length > 0) {
      descCards = [
        {
          id: "card-1",
          title: found.name || "Premium Fit & Comfort",
          subtitle: found.shortDescription || found.subtitle || "Engineered for soft 4-way contour stretch",
          image: parentImages[0]
        },
        {
          id: "card-2",
          title: "Wirefree Contour",
          subtitle: "Zero dig-in side wings and breathable lining",
          image: parentImages[1] || parentImages[0]
        },
        {
          id: "card-3",
          title: "All-Day Breathable",
          subtitle: "Ultra lightweight fabric composition",
          image: parentImages[2] || parentImages[0]
        },
        {
          id: "card-4",
          title: "Seamless Support",
          subtitle: "Smooth finish under any outfit",
          image: parentImages[3] || parentImages[0]
        }
      ];
    } else {
      descCards = SAMPLE_PRODUCT.descriptionCards;
    }
  }

  return {
    ...SAMPLE_PRODUCT,
    id: found.id,
    type: (found.type as any) || (mappedVariations.length > 1 && mappedVariations[0]?.colorName !== 'Standard' ? 'Variable' : 'Simple'),
    brand: found.brand || "AARAMLY",
    name: found.name || SAMPLE_PRODUCT.name,
    subtitle: found.subtitle || found.shortDescription || SAMPLE_PRODUCT.subtitle,
    shortDescription: found.shortDescription || found.subtitle || "",
    fullDescription: found.fullDescription || found.description || "",
    price: Number(found.price) || SAMPLE_PRODUCT.price,
    originalPrice: Number(found.originalPrice) || SAMPLE_PRODUCT.originalPrice,
    rating: Number(found.rating) || 4.8,
    reviewCount: Number(found.reviewCount || found.salesCount) || 120,
    defaultSku: found.defaultSku || found.sku || "AAR-SKU-100",
    colors: found.colors || [],
    variations: mappedVariations,
    availableSizes: found.availableSizes || (found.sizes ? found.sizes : ["S", "M", "L", "XL"]),
    descriptionCards: descCards,
    idealForPills: found.idealForPills || (found.category ? [found.category, "Daily Wear", "Under T-Shirts"] : SAMPLE_PRODUCT.idealForPills),
    washingInstructions: found.washingInstructions && found.washingInstructions.length > 0 ? found.washingInstructions : SAMPLE_PRODUCT.washingInstructions,
    manufacturingInfo: {
      ...SAMPLE_PRODUCT.manufacturingInfo,
      ...(found.manufacturingInfo || {}),
      ...(found.brand ? { manufacturer: `${found.brand} Intimates` } : {})
    },
  };
};

export const getLiveProductsList = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('aaramly_deleted_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) parsed.forEach((id) => deletedProductIds.add(String(id)));
      }
    } catch (e) {}
  }

  const map = new Map<string, any>();
  if (Array.isArray(liveProducts)) {
    liveProducts.forEach((p) => {
      if (p && p.id !== undefined && p.id !== null) {
        if (!deletedProductIds.has(String(p.id))) {
          map.set(String(p.id), p);
        }
      }
    });
  }
  return Array.from(map.values()).filter((p) => !deletedProductIds.has(String(p.id)));
};

// DYNAMIC FILTER STORE
const DEFAULT_FILTER_CONFIG = {
  categories: [
    { name: 'BRALETTES', key: 'Bralettes', count: 10 },
    { name: 'EVERYDAY BRAS', key: 'Everyday Bras', count: 8 },
    { name: 'SEAMLESS PANTIES', key: 'Seamless Panties', count: 8 },
    { name: 'SILICONE COVERS', key: 'Accessories', count: 7 },
    { name: 'CONTOUR SHAPEWEAR', key: 'Shapewear', count: 7 },
  ],
  colors: [
    { name: 'Black', hex: '#000000' },
    { name: 'Nude Beige', hex: '#F5F5DC' },
    { name: 'Classic White', hex: '#FFFFFF' },
    { name: 'Blush Pink', hex: '#FFB6C1' },
    { name: 'Dusty Rose', hex: '#D8A7B1' },
  ],
  sizes: ['S', 'M', 'L', 'XL', '32B', '34B', '36B', '36C'],
  maxPrice: 3000,
};

let liveFilterData = { ...DEFAULT_FILTER_CONFIG };

export const fetchLiveFilters = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/filters`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        liveFilterData = json.data;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('aaramly_dynamic_filters', JSON.stringify(json.data));
        }
        filterListeners.forEach((fn) => fn());
        return liveFilterData;
      }
    }
  } catch (e) {
    console.warn("Express server filter API offline, serving local dynamic filters.");
  }
  return getLiveFilters();
};

export const getLiveFilters = () => {
  try {
    const saved = localStorage.getItem('aaramly_dynamic_filters');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : DEFAULT_FILTER_CONFIG.categories,
        colors: Array.isArray(parsed.colors) && parsed.colors.length > 0 ? parsed.colors : DEFAULT_FILTER_CONFIG.colors,
        sizes: Array.isArray(parsed.sizes) && parsed.sizes.length > 0 ? parsed.sizes : DEFAULT_FILTER_CONFIG.sizes,
        maxPrice: Number(parsed.maxPrice) || 3000,
      };
    }
  } catch (e) {}
  return DEFAULT_FILTER_CONFIG;
};

const filterListeners = new Set<() => void>();

export const subscribeToFilterStore = (listener: () => void) => {
  filterListeners.add(listener);

  let broadcastChannel: BroadcastChannel | null = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('aaramly_filter_sync');
    broadcastChannel.onmessage = () => {
      filterListeners.forEach((fn) => fn());
    };
  }

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'aaramly_dynamic_filters') {
      filterListeners.forEach((fn) => fn());
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
  }

  return () => {
    filterListeners.delete(listener);
    if (broadcastChannel) broadcastChannel.close();
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange);
    }
  };
};

// Trigger initial fetch
fetchLiveProducts();
fetchLiveFilters();
