import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_SUBCATEGORIES,
  MOCK_BRANDS,
  MOCK_ATTRIBUTES,
  MOCK_CONTACT_MESSAGES,
  getGlobalVariantsList
} from "../data/mockAdminData";
import { Product, Category, Subcategory, Brand, Attribute, ContactMessage, SizeGuide } from "../types/admin";

const API_BASE = "http://localhost:5000/api/v1";

export class AdminApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.data !== undefined ? data.data : data;
    } catch {
      return null;
    }
  }

  // Dashboard Stats
  public static async getDashboardStats() {
    const remote = await this.request<any>("/analytics/dashboard");
    if (remote) return remote;

    // Fallback sync with local state
    const products = MOCK_PRODUCTS;
    const published = products.filter((p) => p.isPublished || p.status === 'Published').length;
    const draft = products.length - published;
    const variants = getGlobalVariantsList();
    const lowStock = products.filter((p) => p.stock <= 20);

    return {
      totalProducts: products.length,
      publishedProducts: published,
      draftProducts: draft,
      totalVariants: variants.length,
      totalCategories: MOCK_CATEGORIES.length,
      totalAttributes: MOCK_ATTRIBUTES.length,
      lowStockCount: lowStock.length,
      totalMessages: MOCK_CONTACT_MESSAGES.length,
      unreadMessagesCount: MOCK_CONTACT_MESSAGES.filter((m) => m.status === 'New').length,
      recentProducts: products.slice(0, 5),
      recentMessages: MOCK_CONTACT_MESSAGES.slice(0, 5),
      lowStockProducts: lowStock
    };
  }

  // Product CRUD
  public static async getProducts(params?: { page?: number; limit?: number; search?: string; category?: string; status?: string; sort?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.category) query.append("category", params.category);
    if (params?.status) query.append("status", params.status);
    if (params?.sort) query.append("sort", params.sort);

    const remote = await this.request<any>(`/products?${query.toString()}`);
    if (remote && remote.items) return remote;

    // Fallback in-memory querying
    let list = [...MOCK_PRODUCTS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)));
    }
    if (params?.category && params.category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.status && params.status !== 'All') {
      if (params.status === 'Published') list = list.filter((p) => p.isPublished || p.status === 'Published');
      else if (params.status === 'Draft') list = list.filter((p) => !p.isPublished && p.status !== 'Published');
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = list.length;
    const totalPages = Math.ceil(total / limit);
    const items = list.slice((page - 1) * limit, page * limit);

    return { items, total, page, limit, totalPages };
  }

  public static async getProductById(id: string): Promise<Product | null> {
    const remote = await this.request<Product>(`/products/${id}`);
    if (remote) return remote;
    return MOCK_PRODUCTS.find((p) => p.id === id) || null;
  }

  public static async createProduct(productData: Partial<Product>): Promise<Product> {
    const remote = await this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(productData)
    });
    if (remote) return remote;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || "New Product",
      slug: productData.slug || (productData.name ? productData.name.toLowerCase().replace(/\s+/g, '-') : 'new-product'),
      sku: productData.sku || `AAR-${Date.now()}`,
      category: productData.category || "Bralettes",
      subcategory: productData.subcategory || "Seamless Padded Bralettes",
      categories: productData.categories || [productData.category || "Bralettes"],
      brand: productData.brand || "AARAMLY",
      collections: productData.collections || [],
      tags: productData.tags || [],
      price: productData.price || 799,
      originalPrice: productData.originalPrice || 1299,
      costPrice: productData.costPrice || 350,
      stock: productData.stock || 100,
      rating: 5.0,
      salesCount: 0,
      status: productData.isPublished || productData.status === 'Published' ? 'Published' : 'Draft',
      isPublished: productData.isPublished !== undefined ? productData.isPublished : true,
      type: (productData.variations && productData.variations.length > 0) ? 'Variable' : 'Simple',
      shortDescription: productData.shortDescription || "",
      fullDescription: productData.fullDescription || "",
      images: productData.images || ['https://images.unsplash.com/photo-1596484552834-6a58f850e0a1'],
      labels: { featured: true, bestSeller: false, newArrival: true, sale: false },
      inventory: { sku: productData.sku || `AAR-${Date.now()}`, barcode: '890123456789', stock: productData.stock || 100, lowStockAlert: 20, allowBackorders: false, trackInventory: true },
      shipping: productData.shipping || { weight: 0.15, length: 20, width: 15, height: 4 },
      seo: productData.seo || { metaTitle: productData.name || '', metaDescription: '', keywords: '', canonicalUrl: '' },
      attributes: productData.attributes || [],
      variants: productData.variants || productData.variations || [],
      variations: productData.variations || [],
      descriptionCards: productData.descriptionCards || [],
      highlights: productData.highlights || [],
      washingInstructions: productData.washingInstructions || [],
      manufacturingInfo: productData.manufacturingInfo || undefined,
      idealForPills: productData.idealForPills || []
    };

    MOCK_PRODUCTS.unshift(newProd);
    return newProd;
  }

  public static async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    const remote = await this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData)
    });
    if (remote) return remote;

    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...productData };
    return MOCK_PRODUCTS[idx];
  }

  public static async deleteProduct(id: string): Promise<boolean> {
    const remote = await this.request<any>(`/products/${id}`, { method: "DELETE" });
    if (remote !== null) return true;

    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS.splice(idx, 1);
      return true;
    }
    return false;
  }

  public static async bulkDeleteProducts(ids: string[]): Promise<boolean> {
    await this.request<any>("/products/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids })
    });
    ids.forEach((id) => this.deleteProduct(id));
    return true;
  }

  public static async bulkUpdateStatus(ids: string[], isPublished: boolean): Promise<boolean> {
    await this.request<any>("/products/bulk-status", {
      method: "POST",
      body: JSON.stringify({ ids, isPublished })
    });
    ids.forEach((id) => {
      const p = MOCK_PRODUCTS.find((prod) => prod.id === id);
      if (p) {
        p.isPublished = isPublished;
        p.status = isPublished ? 'Published' : 'Draft';
      }
    });
    return true;
  }

  // Taxonomies CRUD
  public static async getCategories(): Promise<{ categories: Category[]; subcategories: Subcategory[] }> {
    const remote = await this.request<any>("/taxonomies/categories");
    if (remote) return remote;
    return { categories: MOCK_CATEGORIES, subcategories: MOCK_SUBCATEGORIES };
  }

  public static async createCategory(data: Partial<Category>): Promise<Category> {
    const remote = await this.request<Category>("/taxonomies/categories", {
      method: "POST",
      body: JSON.stringify(data)
    });
    if (remote) return remote;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: data.name || "New Category",
      slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : 'new-category'),
      productCount: 0,
      isActive: true
    };
    MOCK_CATEGORIES.push(newCat);
    return newCat;
  }

  public static async getBrands(): Promise<Brand[]> {
    const remote = await this.request<Brand[]>("/taxonomies/brands");
    if (remote) return remote;
    return MOCK_BRANDS;
  }

  public static async getAttributes(): Promise<Attribute[]> {
    const remote = await this.request<Attribute[]>("/taxonomies/attributes");
    if (remote) return remote;
    return MOCK_ATTRIBUTES;
  }

  // Contact Messages CRUD
  public static async getContactMessages(params?: { status?: string; search?: string }): Promise<ContactMessage[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status.toUpperCase() !== 'ALL') query.append("status", params.status);
    if (params?.search) query.append("search", params.search);

    const remote = await this.request<ContactMessage[]>(`/contacts?${query.toString()}`);
    let list: ContactMessage[] = Array.isArray(remote) ? remote : [...MOCK_CONTACT_MESSAGES];

    if (params?.status && params.status.toUpperCase() !== 'ALL') {
      list = list.filter((m) => m.status.toLowerCase() === params.status!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q));
    }
    return list;
  }

  public static async updateContactMessageStatus(id: string, status: "New" | "Read" | "Replied" | "Archived", replyText?: string): Promise<ContactMessage | null> {
    const remote = await this.request<ContactMessage>(`/contacts/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, replyText })
    });
    if (remote) return remote;

    const msg = MOCK_CONTACT_MESSAGES.find((m) => m.id === id);
    if (msg) {
      msg.status = status;
      if (replyText) msg.replyText = replyText;
    }
    return msg || null;
  }

  public static async deleteContactMessage(id: string): Promise<boolean> {
    await this.request<any>(`/contacts/${id}`, { method: "DELETE" });
    const idx = MOCK_CONTACT_MESSAGES.findIndex((m) => m.id === id);
    if (idx !== -1) {
      MOCK_CONTACT_MESSAGES.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Size Guides CRUD
  public static async getSizeGuides(): Promise<SizeGuide[]> {
    const remote = await this.request<SizeGuide[]>("/size-guides");
    if (remote) return remote;
    return [];
  }

  public static async createSizeGuide(guide: SizeGuide): Promise<SizeGuide | null> {
    const remote = await this.request<SizeGuide>("/size-guides", {
      method: "POST",
      body: JSON.stringify(guide)
    });
    if (remote) return remote;
    return guide;
  }
}
