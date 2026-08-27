import { Category, Subcategory, Brand, Attribute } from "../../../types/admin.js";

// Initial Taxonomy Seed Data
let categories: Category[] = [
  { id: 'cat-1', name: 'Gift Hamper', slug: 'gift-hamper', productCount: 15, isActive: true },
  { id: 'cat-2', name: 'Choli', slug: 'choli', productCount: 28, isActive: true },
  { id: 'cat-3', name: 'Krishna Outfit', slug: 'krishna-outfit', productCount: 10, isActive: true },
  { id: 'cat-4', name: 'Necklace', slug: 'necklace', productCount: 22, isActive: true },
  { id: 'cat-5', name: 'Latkan', slug: 'latkan', productCount: 35, isActive: true },
  { id: 'cat-6', name: 'Tassel', slug: 'tassel', productCount: 14, isActive: true },
  { id: 'cat-7', name: 'Hair Accessories', slug: 'hair-accessories', productCount: 18, isActive: true },
  { id: 'cat-8', name: 'Watch', slug: 'watch', productCount: 12, isActive: true },
  { id: 'cat-9', name: 'Bracelet', slug: 'bracelet', productCount: 16, isActive: true },
  { id: 'cat-10', name: 'Waist Belt', slug: 'waist-belt', productCount: 9, isActive: true },
  { id: 'cat-11', name: 'Earrings', slug: 'earrings', productCount: 30, isActive: true },
  { id: 'cat-12', name: 'Anklet', slug: 'anklet', productCount: 8, isActive: true },
  { id: 'cat-13', name: 'Plastic Ring', slug: 'plastic-ring', productCount: 6, isActive: true },
  { id: 'cat-14', name: 'Finger Ring', slug: 'finger-ring', productCount: 14, isActive: true },
  { id: 'cat-15', name: 'Jewellery Set', slug: 'jewellery-set', productCount: 19, isActive: true },
  { id: 'cat-16', name: 'Dispatch', slug: 'dispatch', productCount: 5, isActive: true },
  { id: 'cat-17', name: 'Macrame Hanging', slug: 'macrame-hanging', productCount: 11, isActive: true },
  { id: 'cat-18', name: 'Pom-Pom Wristband', slug: 'pom-pom-wristband', productCount: 8, isActive: true }
];

let subcategories: Subcategory[] = [
  { id: 'sub-1', categoryId: 'cat-1', categoryName: 'Gift Hamper', name: 'Keychain', slug: 'keychain' },
  { id: 'sub-2', categoryId: 'cat-2', categoryName: 'Choli', name: 'Kids Choli', slug: 'kids-choli' },
  { id: 'sub-3', categoryId: 'cat-2', categoryName: 'Choli', name: 'Adult Choli', slug: 'adult-choli' },
  { id: 'sub-4', categoryId: 'cat-4', categoryName: 'Necklace', name: 'Mirror Necklace', slug: 'mirror-necklace' },
  { id: 'sub-5', categoryId: 'cat-5', categoryName: 'Latkan', name: 'Mirror Latkan', slug: 'mirror-latkan' },
  { id: 'sub-6', categoryId: 'cat-5', categoryName: 'Latkan', name: 'Blouse Latkan', slug: 'blouse-latkan' },
  { id: 'sub-7', categoryId: 'cat-5', categoryName: 'Latkan', name: 'Mirror Wall Decor', slug: 'mirror-wall-decor' },
  { id: 'sub-8', categoryId: 'cat-5', categoryName: 'Latkan', name: 'Fabric Latkan', slug: 'fabric-latkan' },
  { id: 'sub-9', categoryId: 'cat-5', categoryName: 'Latkan', name: 'Golden Latkan', slug: 'golden-latkan' },
  { id: 'sub-10', categoryId: 'cat-5', categoryName: 'Latkan', name: 'Crochet Latkan', slug: 'crochet-latkan' },
  { id: 'sub-11', categoryId: 'cat-6', categoryName: 'Tassel', name: 'Long Tassels', slug: 'long-tassels' },
  { id: 'sub-12', categoryId: 'cat-7', categoryName: 'Hair Accessories', name: 'Hair Bow', slug: 'hair-bow' },
  { id: 'sub-13', categoryId: 'cat-7', categoryName: 'Hair Accessories', name: 'Hair Clip', slug: 'hair-clip' },
  { id: 'sub-14', categoryId: 'cat-7', categoryName: 'Hair Accessories', name: 'Hair Band', slug: 'hair-band' },
  { id: 'sub-15', categoryId: 'cat-8', categoryName: 'Watch', name: 'Kids Watch', slug: 'kids-watch' },
  { id: 'sub-16', categoryId: 'cat-8', categoryName: 'Watch', name: 'Traditional Watch', slug: 'traditional-watch' },
  { id: 'sub-17', categoryId: 'cat-10', categoryName: 'Waist Belt', name: 'Mirror Waist Belt', slug: 'mirror-waist-belt' },
  { id: 'sub-18', categoryId: 'cat-11', categoryName: 'Earrings', name: 'Mirror Earrings', slug: 'mirror-earrings' },
  { id: 'sub-19', categoryId: 'cat-11', categoryName: 'Earrings', name: 'Hoop Earrings', slug: 'hoop-earrings' }
];

let brands: Brand[] = [
  { id: 'b-1', name: 'AOCIND', slug: 'aocind', logo: '/images/common/logo.png' },
  { id: 'b-2', name: 'Awesome Handmade', slug: 'awesome-handmade', logo: '/images/common/logo.png' }
];

let collections: string[] = [
  'Navratri Choli Collection',
  'Mirror Latkan Studio',
  'Bridal & Festive Edit',
  'Artisan Gifts & Hampers',
  'Traditional Earrings',
  'Macrame & Wall Hangings'
];

let attributes: Attribute[] = [
  { id: 'attr-1', name: 'Color', type: 'Color', values: ['Maroon', 'Gold', 'Royal Blue', 'Emerald Green', 'Pink', 'Yellow', 'White', 'Black'], isVariant: true },
  { id: 'attr-2', name: 'Size', type: 'Select', values: ['Free Size', 'Kids (2-4 Yrs)', 'Kids (5-8 Yrs)', 'Adult S', 'Adult M', 'Adult L', 'Adult XL'], isVariant: true },
  { id: 'attr-3', name: 'Craft / Material', type: 'Select', values: ['Mirror Work', 'Silk & Zari', 'Pure Cotton', 'Macrame Knotting', 'Kundan & Beads', 'Brass & Metal'], isVariant: false }
];

export const getCategoriesStore = (): Category[] => categories;
export const getSubcategoriesStore = (): Subcategory[] => subcategories;
export const getBrandsStore = (): Brand[] => brands;
export const getCollectionsStore = (): string[] => collections;
export const getAttributesStore = (): Attribute[] => attributes;

export const createCategoryStore = (data: Partial<Category>): Category => {
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: data.name || 'New Category',
    slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : 'new-category'),
    productCount: 0,
    isActive: data.isActive !== undefined ? data.isActive : true
  };
  categories.push(newCat);
  return newCat;
};

export const updateCategoryStore = (id: string, data: Partial<Category>): Category | null => {
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  categories[idx] = { ...categories[idx], ...data };
  return categories[idx];
};

export const deleteCategoryStore = (id: string): boolean => {
  const initialLen = categories.length;
  categories = categories.filter((c) => c.id !== id);
  subcategories = subcategories.filter((s) => s.categoryId !== id);
  return categories.length < initialLen;
};

export const createSubcategoryStore = (data: Partial<Subcategory>): Subcategory => {
  const parentCat = categories.find((c) => c.id === data.categoryId) || categories[0];
  const newSub: Subcategory = {
    id: `sub-${Date.now()}`,
    categoryId: parentCat.id,
    categoryName: parentCat.name,
    name: data.name || 'New Subcategory',
    slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : 'new-subcategory')
  };
  subcategories.push(newSub);
  return newSub;
};

export const createBrandStore = (data: Partial<Brand>): Brand => {
  const newBrand: Brand = {
    id: `b-${Date.now()}`,
    name: data.name || 'New Brand',
    slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : 'new-brand'),
    logo: data.logo || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=100'
  };
  brands.push(newBrand);
  return newBrand;
};

export const createAttributeStore = (data: Partial<Attribute>): Attribute => {
  const newAttr: Attribute = {
    id: `attr-${Date.now()}`,
    name: data.name || 'New Attribute',
    type: data.type || 'Select',
    values: data.values || [],
    isVariant: data.isVariant !== undefined ? data.isVariant : true
  };
  attributes.push(newAttr);
  return newAttr;
};

export const addAttributeValueStore = (attrId: string, val: any): Attribute | null => {
  const attr = attributes.find((a) => a.id === attrId);
  if (!attr) return null;
  attr.values.push(val);
  return attr;
};
