import { Product, Order, Category, Subcategory, Attribute, Customer, ContactMessage, Brand, Variant } from '../types/admin';

export const MOCK_BRANDS: Brand[] = [
  { id: 'b-1', name: 'AARAMLY', slug: 'aaramly', logo: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=100' },
  { id: 'b-2', name: 'AARAMLY Care', slug: 'aaramly-care', logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=100' },
  { id: 'b-3', name: 'AARAMLY Luxe', slug: 'aaramly-luxe', logo: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=100' }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Bralettes', slug: 'bralettes', productCount: 12, isActive: true },
  { id: 'cat-2', name: 'Everyday Bras', slug: 'everyday-bras', productCount: 24, isActive: true },
  { id: 'cat-3', name: 'Seamless Panties', slug: 'panties', productCount: 18, isActive: true },
  { id: 'cat-4', name: 'Shapewear', slug: 'shapewear', productCount: 8, isActive: true },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories', productCount: 15, isActive: true }
];

export const MOCK_SUBCATEGORIES: Subcategory[] = [
  { id: 'sub-1', categoryId: 'cat-1', categoryName: 'Bralettes', name: 'Seamless Padded Bralettes', slug: 'seamless-padded-bralettes' },
  { id: 'sub-2', categoryId: 'cat-1', categoryName: 'Bralettes', name: 'Lace Triangle Bralettes', slug: 'lace-triangle-bralettes' },
  { id: 'sub-3', categoryId: 'cat-2', categoryName: 'Everyday Bras', name: 'Contour Wire-Free Bras', slug: 'contour-wirefree-bras' },
  { id: 'sub-4', categoryId: 'cat-2', categoryName: 'Everyday Bras', name: 'T-Shirt Plunge Bras', slug: 't-shirt-plunge-bras' },
  { id: 'sub-5', categoryId: 'cat-5', categoryName: 'Accessories', name: 'Silicone Nipple Covers', slug: 'silicone-nipple-covers' },
  { id: 'sub-6', categoryId: 'cat-5', categoryName: 'Accessories', name: 'Bra Extenders & Straps', slug: 'bra-extenders-straps' }
];

export const MOCK_COLLECTIONS = [
  'Summer Essentials 2026',
  'Bridal Silk & Lace',
  'Everyday Comfort Wire-Free',
  'Seamless Nude Essentials'
];

export const MOCK_TAGS = [
  'Seamless',
  'Wire-free',
  'Padded',
  'Cotton',
  'Silicone',
  'Breathable',
  'Hypoallergenic',
  'Invisible'
];

export const MOCK_PRODUCTS: Product[] = [];

// Load products from localStorage if present
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('aaramly_admin_sync');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.products) && parsed.products.length > 0) {
        MOCK_PRODUCTS.push(...parsed.products);
      }
    }
  } catch (e) {}
}

export const getAdminProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('aaramly_admin_sync');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.products)) {
          MOCK_PRODUCTS.length = 0;
          MOCK_PRODUCTS.push(...parsed.products);
        }
      }
    } catch (e) {}
  }
  return MOCK_PRODUCTS;
};

export const getGlobalVariantsList = (): Variant[] => {
  const globalList: Variant[] = [];
  getAdminProducts().forEach((prod) => {
    if (prod.variants && prod.variants.length > 0) {
      prod.variants.forEach((v) => {
        globalList.push({
          ...v,
          parentProductId: prod.id,
          parentProductName: prod.name
        });
      });
    }
  });
  return globalList;
};

const BACKEND_API_URL = 'http://localhost:5000/api/v1/products';

export const fetchProductsFromBackend = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${BACKEND_API_URL}?admin=true`);
    if (res.ok) {
      const json = await res.json();
      const list = json.data || json.items || json.products;
      if (json.success && Array.isArray(list) && list.length > 0) {
        const existingIds = new Set(list.map((p: any) => p.id));
        const localOnly = MOCK_PRODUCTS.filter((p) => !existingIds.has(p.id));
        MOCK_PRODUCTS.length = 0;
        MOCK_PRODUCTS.push(...list, ...localOnly);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('aaramly_admin_sync', JSON.stringify({ timestamp: Date.now(), products: MOCK_PRODUCTS }));
            window.dispatchEvent(new Event('aaramly_product_sync'));
          } catch (e) {}
        }
        return MOCK_PRODUCTS;
      }
    }
  } catch (e) {
    console.warn('[Backend Network API] Unable to fetch live backend products on load:', e);
  }
  return getAdminProducts();
};

export const syncProductToBackend = async (product: Product, isEdit: boolean = false) => {
  try {
    const url = isEdit ? `${BACKEND_API_URL}/${product.id}` : BACKEND_API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`[Backend Network API] Product sync successful (${method}):`, data);
    }
  } catch (err) {
    console.warn('[Backend Network API] Express server offline or unreachable:', err);
  }
};

const deletedProductIds = new Set<string>();

if (typeof window !== 'undefined') {
  try {
    const savedDeleted = localStorage.getItem('aaramly_deleted_products');
    if (savedDeleted) {
      const parsed = JSON.parse(savedDeleted);
      if (Array.isArray(parsed)) parsed.forEach((id) => deletedProductIds.add(String(id)));
    }
  } catch (e) {}
}

export const getDeletedProductIds = (): Set<string> => deletedProductIds;

export const deleteAdminProduct = async (productId: string) => {
  const strId = String(productId);
  deletedProductIds.add(strId);

  const idx = MOCK_PRODUCTS.findIndex((p) => String(p.id) === strId);
  if (idx !== -1) {
    MOCK_PRODUCTS.splice(idx, 1);
  }

  try {
    localStorage.setItem('aaramly_deleted_products', JSON.stringify(Array.from(deletedProductIds)));
  } catch (e) {}

  try {
    await fetch(`${BACKEND_API_URL}/${productId}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('[Backend Network API] Delete failed on Express backend:', e);
  }

  broadcastAdminProductChange();
};

// Real-Time Cross-Tab / API Sync Trigger for Client Website
export const broadcastAdminProductChange = (updatedProduct?: Product) => {
  if (updatedProduct) {
    const existingIdx = MOCK_PRODUCTS.findIndex((p) => p.id === updatedProduct.id);
    if (existingIdx !== -1) {
      MOCK_PRODUCTS[existingIdx] = updatedProduct;
      syncProductToBackend(updatedProduct, true);
    } else {
      MOCK_PRODUCTS.unshift(updatedProduct);
      syncProductToBackend(updatedProduct, false);
    }
  }

  try {
    const channel = new BroadcastChannel('aaramly_product_sync');
    channel.postMessage({
      type: 'PRODUCT_UPDATED',
      timestamp: Date.now(),
      product: updatedProduct,
      products: MOCK_PRODUCTS,
      deletedIds: Array.from(deletedProductIds)
    });
    channel.close();
  } catch (e) {
    console.warn('BroadcastChannel not supported in this environment.');
  }

  try {
    localStorage.setItem('aaramly_admin_sync', JSON.stringify({
      timestamp: Date.now(),
      products: MOCK_PRODUCTS,
      deletedIds: Array.from(deletedProductIds)
    }));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('aaramly_product_sync'));
    }
  } catch (e) {
    console.warn('LocalStorage write failed.');
  }
};

export const MOCK_CONTACT_MESSAGES: ContactMessage[] = [];

if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('aaramly_contact_sync');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        const existingIds = new Set(MOCK_CONTACT_MESSAGES.map((m) => m.id));
        parsed.messages.forEach((msg: ContactMessage) => {
          if (!existingIds.has(msg.id)) {
            MOCK_CONTACT_MESSAGES.unshift(msg);
          }
        });
      }
    }
  } catch (e) {}
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#AAR-98214',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    date: '2026-07-30 14:20',
    totalAmount: 1897,
    status: 'PAID',
    paymentGateway: 'Razorpay',
    itemsCount: 2,
    items: [
      { id: 'item-1', productName: "Women's Seamless Padded Bralette", variantSku: 'AAR-BR-BLK-S', price: 799, quantity: 2, image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=200' },
      { id: 'item-2', productName: 'Silicone Nipple Covers', variantSku: 'AAR-NC-SIL-FREE', price: 299, quantity: 1, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=200' }
    ]
  }
];

export const MOCK_ATTRIBUTES: Attribute[] = [
  {
    id: 'attr-1',
    name: 'Color',
    displayType: 'swatch',
    values: [
      { id: 'val-1', value: 'Black', hexCode: '#000000' },
      { id: 'val-2', value: 'White', hexCode: '#FFFFFF' },
      { id: 'val-3', value: 'Beige', hexCode: '#E8D3C3' },
      { id: 'val-4', value: 'Blush Pink', hexCode: '#F4C2C2' },
      { id: 'val-5', value: 'Denim Blue', hexCode: '#3B5998' }
    ]
  },
  {
    id: 'attr-2',
    name: 'Size',
    displayType: 'button',
    values: [
      { id: 'val-6', value: 'S' },
      { id: 'val-7', value: 'M' },
      { id: 'val-8', value: 'L' },
      { id: 'val-9', value: 'XL' },
      { id: 'val-10', value: '34B' },
      { id: 'val-11', value: '36B' },
      { id: 'val-12', value: '36C' }
    ]
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43210', ordersCount: 4, totalSpent: 4890, status: 'Active', joinedDate: '2026-01-15' }
];

export const getAdminCategoriesAndSubcategories = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('aaramly_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mainCats = parsed.filter((c: any) => c.type !== 'sub' && (c.isActive ?? true));
          const subCats = parsed.filter((c: any) => c.type === 'sub' && (c.isActive ?? true));
          return { mainCategories: mainCats, subcategories: subCats };
        }
      }
    } catch (e) {}
  }
  const mainCats = MOCK_CATEGORIES.map((c) => ({ ...c, type: 'parent' }));
  const subCats = MOCK_SUBCATEGORIES.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    type: 'sub',
    parentId: s.categoryId,
    parentName: s.categoryName
  }));
  return { mainCategories: mainCats, subcategories: subCats };
};
