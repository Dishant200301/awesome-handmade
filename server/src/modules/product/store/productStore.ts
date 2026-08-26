export interface ProductColorItem {
  id: string;
  colorName: string;
  colorHex: string;
  displayImage: string;
  mainImage: string;
  galleryImages: string[];
  sizes: string[];
}

export interface ProductVariantItem {
  id: string;
  colorName: string;
  colorHex?: string;
  size?: string;
  sizeName?: string;
  price: number;
  originalPrice: number;
  costPrice?: number;
  discountPercentage?: number;
  sku: string;
  barcode?: string;
  stock: number;
  thumbnail?: string;
  status?: 'Active' | 'Inactive' | 'Out of Stock';
  images?: { id: string; url: string; alt?: string }[];
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  brand: string;
  category: string;
  slug: string;
  price: number;
  originalPrice: number;
  costPrice?: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  stock: number;
  defaultSku: string;
  barcode?: string;
  image: string;
  hoverImage?: string;
  images: string[];
  colors?: ProductColorItem[];
  variations: ProductVariantItem[];
  availableSizes: string[];
  descriptionCards: any[];
  idealForPills: string[];
  washingInstructions: any[];
  manufacturingInfo: any;
  productAttributes?: any[];
  isFeatured?: boolean;
  isPublished?: boolean;
  status?: 'Published' | 'Draft' | 'Hidden' | 'Out of Stock';
}

import fs from "fs";
import path from "path";

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    name: "Women's Seamless Padded Bralette",
    subtitle: "Ultra-soft 4-way stretch wire-free contour bra",
    brand: "AARAMLY",
    category: "Bralettes",
    slug: "womens-seamless-padded-bralette",
    price: 799,
    originalPrice: 1299,
    discountPercentage: 38,
    rating: 4.8,
    reviewCount: 1240,
    stock: 145,
    defaultSku: "AAR-BR-BLK-S",
    image: "https://m.media-amazon.com/images/I/71LtEuQjqXL._SL1500_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71LtEuQjqXL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71hu9PaEBcL._SL1500_.jpg"
    ],
    variations: [
      { id: "v1", sku: "AAR-BR-BLK-S", colorName: "Black", size: "S", price: 799, originalPrice: 1299, stock: 45 },
      { id: "v2", sku: "AAR-BR-BLK-M", colorName: "Black", size: "M", price: 799, originalPrice: 1299, stock: 50 }
    ],
    availableSizes: ["S", "M", "L", "XL"],
    descriptionCards: [],
    idealForPills: ["Everyday Wear", "Lounging"],
    washingInstructions: [],
    manufacturingInfo: { manufacturer: "AARAMLY Intimates", countryOfOrigin: "India" },
    productAttributes: [
      { attributeId: "attr-material", attributeName: "Material Composition", attributeSlug: "material-composition", type: "text", value: "64% Nylon + 36% Spandex", showInHighlights: true, displayOrder: 1 },
      { attributeId: "attr-style", attributeName: "Style", attributeSlug: "style", type: "select", value: "Contemporary Seamless", showInHighlights: true, displayOrder: 2 },
      { attributeId: "attr-underwire", attributeName: "Underwire Type", attributeSlug: "underwire-type", type: "select", value: "Wire Free", showInHighlights: true, displayOrder: 3 },
      { attributeId: "attr-padding", attributeName: "Padding", attributeSlug: "padding", type: "select", value: "CloudSoft Removable Pads", showInHighlights: true, displayOrder: 4 },
      { attributeId: "attr-support", attributeName: "Support", attributeSlug: "support", type: "select", value: "High Support Contour Shaper", showInHighlights: true, displayOrder: 5 }
    ],
    isFeatured: true,
    isPublished: true,
    status: "Published"
  },
  {
    id: "prod-2",
    name: "Women's Contour Seamless Bra",
    subtitle: "Zero-wire contour support with breathable side wings",
    brand: "AARAMLY",
    category: "Everyday Bras",
    slug: "womens-contour-seamless-bra",
    price: 899,
    originalPrice: 1499,
    discountPercentage: 40,
    rating: 4.7,
    reviewCount: 890,
    stock: 98,
    defaultSku: "AAR-BRA-DNM-M",
    image: "https://m.media-amazon.com/images/I/71hu9PaEBcL._SL1500_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71hu9PaEBcL._SL1500_.jpg"
    ],
    variations: [
      { id: "v5", sku: "AAR-BRA-DNM-34B", colorName: "Denim Blue", size: "34B", price: 899, originalPrice: 1499, stock: 40 }
    ],
    availableSizes: ["34B", "36B", "36C", "38D"],
    descriptionCards: [],
    idealForPills: ["Daily Comfort", "Office Wear"],
    washingInstructions: [],
    manufacturingInfo: { manufacturer: "AARAMLY Intimates", countryOfOrigin: "India" },
    productAttributes: [
      { attributeId: "attr-material", attributeName: "Material Composition", attributeSlug: "material-composition", type: "text", value: "72% Nylon + 28% Elastane", showInHighlights: true, displayOrder: 1 },
      { attributeId: "attr-style", attributeName: "Style", attributeSlug: "style", type: "select", value: "Wirefree Contour", showInHighlights: true, displayOrder: 2 },
      { attributeId: "attr-underwire", attributeName: "Underwire Type", attributeSlug: "underwire-type", type: "select", value: "Wire Free", showInHighlights: true, displayOrder: 3 },
      { attributeId: "attr-padding", attributeName: "Padding", attributeSlug: "padding", type: "select", value: "Fixed Moulded Contour Pads", showInHighlights: true, displayOrder: 4 },
      { attributeId: "attr-support", attributeName: "Support", attributeSlug: "support", type: "select", value: "Medium Everyday Support", showInHighlights: true, displayOrder: 5 }
    ],
    isFeatured: true,
    isPublished: true,
    status: "Published"
  },
  {
    id: "prod-3",
    name: "Silicone Nipple Covers (Reusable)",
    subtitle: "Hypoallergenic reusable medical-grade silicone covers",
    brand: "AARAMLY Care",
    category: "Accessories",
    slug: "silicone-nipple-covers",
    price: 299,
    originalPrice: 499,
    discountPercentage: 40,
    rating: 4.9,
    reviewCount: 3100,
    stock: 350,
    defaultSku: "AAR-NC-SIL-FREE",
    image: "https://m.media-amazon.com/images/I/51yter5yXjL._SL1500_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51yter5yXjL._SL1500_.jpg"
    ],
    variations: [],
    availableSizes: ["Free Size"],
    descriptionCards: [],
    idealForPills: ["Backless Tops", "Dresses"],
    washingInstructions: [],
    manufacturingInfo: { manufacturer: "AARAMLY Care", countryOfOrigin: "India" },
    productAttributes: [
      { attributeId: "attr-material", attributeName: "Material Composition", attributeSlug: "material-composition", type: "text", value: "100% Medical-Grade Silicone", showInHighlights: true, displayOrder: 1 },
      { attributeId: "attr-style", attributeName: "Style", attributeSlug: "style", type: "select", value: "Invisible Coverage", showInHighlights: true, displayOrder: 2 }
    ],
    isFeatured: true,
    isPublished: true,
    status: "Published"
  }
];

const DB_FILE_PATH = path.join(process.cwd(), "products_db.json");

class ProductStore {
  private products: ProductItem[] = [];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.products = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn("[ProductStore] Could not read products_db.json, using defaults.");
    }
    this.products = [...INITIAL_PRODUCTS];
    this.saveToDisk();
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.products, null, 2), "utf-8");
    } catch (e) {
      console.error("[ProductStore] Failed to write products_db.json:", e);
    }
  }

  public getAll(onlyPublished = false): ProductItem[] {
    if (onlyPublished) {
      return this.products.filter(p => p.isPublished !== false && p.status !== 'Draft');
    }
    return this.products;
  }

  public getByIdOrSlug(query: string): ProductItem | undefined {
    return this.products.find(
      (p) => p.id === query || p.slug === query
    );
  }

  public add(productData: Partial<ProductItem>): ProductItem {
    const slug = (productData.name || "new-product")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const isPublished = productData.isPublished !== undefined 
      ? productData.isPublished 
      : (productData.status === 'Draft' ? false : true);

    const newProd: ProductItem = {
      id: productData.id || `prod-${Date.now()}`,
      name: productData.name || "New Product",
      subtitle: productData.subtitle || "Premium comfort wear",
      brand: productData.brand || "AARAMLY",
      category: productData.category || "Bralettes",
      slug: productData.slug || slug,
      price: productData.price || 999,
      originalPrice: productData.originalPrice || 1499,
      costPrice: productData.costPrice,
      discountPercentage: Math.round(
        (((productData.originalPrice || 1499) - (productData.price || 999)) /
          (productData.originalPrice || 1499)) *
          100
      ),
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 1,
      stock: productData.stock || 50,
      defaultSku: productData.defaultSku || (productData as any).sku || `AAR-${Date.now()}`,
      barcode: productData.barcode,
      image:
        productData.image ||
        productData.images?.[0] ||
        "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=600",
      images: productData.images || [
        "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=600"
      ],
      colors: productData.colors || [],
      variations: (productData.variations && productData.variations.length > 0)
        ? productData.variations
        : ((productData as any).variants || []),
      availableSizes: productData.availableSizes || ["S", "M", "L", "XL"],
      descriptionCards: productData.descriptionCards || [],
      idealForPills: productData.idealForPills || ["Daily Comfort"],
      washingInstructions: productData.washingInstructions || [],
      manufacturingInfo: productData.manufacturingInfo || {
        manufacturer: "AARAMLY Intimates",
        address: "Ahmedabad, Gujarat",
        countryOfOrigin: "India",
        material: "Microfiber Nylon Blend"
      },
      productAttributes: productData.productAttributes || [],
      isFeatured: productData.isFeatured !== undefined ? productData.isFeatured : true,
      isPublished: isPublished,
      status: isPublished ? 'Published' : 'Draft'
    };

    const existingIdx = this.products.findIndex((p) => p.id === newProd.id);
    if (existingIdx !== -1) {
      this.products[existingIdx] = { ...this.products[existingIdx], ...newProd };
    } else {
      this.products.unshift(newProd);
    }
    this.saveToDisk();
    return newProd;
  }

  public update(id: string, updateData: Partial<ProductItem> | any): ProductItem | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = this.products[index];
    const isPublished = updateData.isPublished !== undefined 
      ? updateData.isPublished 
      : (updateData.status ? updateData.status === 'Published' : existing.isPublished);

    const updatedProduct: ProductItem = {
      ...existing,
      ...updateData,
      colors: updateData.colors || existing.colors,
      variations: (updateData.variations && updateData.variations.length > 0)
        ? updateData.variations
        : (updateData.variants && updateData.variants.length > 0)
        ? updateData.variants
        : existing.variations,
      isPublished: isPublished,
      status: isPublished ? 'Published' : 'Draft'
    };

    this.products[index] = updatedProduct;
    this.saveToDisk();
    return updatedProduct;
  }

  public delete(id: string): boolean {
    const len = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    const deleted = this.products.length < len;
    if (deleted) this.saveToDisk();
    return deleted;
  }

  public bulkDelete(ids: string[]): number {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => !ids.includes(p.id));
    const count = initialLen - this.products.length;
    if (count > 0) this.saveToDisk();
    return count;
  }

  public bulkStatus(ids: string[], isPublished: boolean): number {
    let count = 0;
    this.products = this.products.map((p) => {
      if (ids.includes(p.id)) {
        count++;
        return {
          ...p,
          isPublished,
          status: isPublished ? "Published" : "Draft"
        };
      }
      return p;
    });
    if (count > 0) this.saveToDisk();
    return count;
  }

  public queryProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sort?: string;
  }) {
    let list = [...this.products];
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = params.search ? params.search.toLowerCase() : "";

    if (search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.brand.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          (p.defaultSku && p.defaultSku.toLowerCase().includes(search))
      );
    }

    if (params.category && params.category !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params.status && params.status !== "All") {
      if (params.status === "Published") {
        list = list.filter((p) => p.isPublished || p.status === "Published");
      } else if (params.status === "Draft") {
        list = list.filter((p) => !p.isPublished && p.status !== "Published");
      }
    }

    if (params.sort) {
      if (params.sort === "price_asc") list.sort((a, b) => a.price - b.price);
      else if (params.sort === "price_desc") list.sort((a, b) => b.price - a.price);
      else if (params.sort === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));
      else if (params.sort === "name_desc") list.sort((a, b) => b.name.localeCompare(a.name));
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit);

    return {
      items,
      data: items,
      products: items,
      total,
      page,
      limit,
      totalPages
    };
  }
}

export const productStore = new ProductStore();
