export type AttributeDisplayType = 
  | 'SWATCH' 
  | 'BUTTON' 
  | 'SELECT' 
  | 'RADIO' 
  | 'CHECKBOX'
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'COLOR';

export type AttributeUsage = 'PRODUCT' | 'VARIANT' | 'BOTH';

export interface AttributeValue {
  id: string;
  attributeId?: string;
  label: string;
  value: string;
  colorCode?: string;
  status: 'active' | 'inactive';
  sortOrder: number;
}

export interface AttributeMaster {
  id: string;
  name: string;
  slug: string;
  type: AttributeDisplayType;
  usage: AttributeUsage;
  showInHighlights: boolean;
  isRequired: boolean;
  sortOrder: number;
  status: 'active' | 'inactive';
  isActive: boolean; // Alias for status === 'active'
  values: AttributeValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductAttributeAssignment {
  id?: string;
  productId?: string;
  attributeId: string;
  attributeName: string;
  attributeSlug: string;
  type: AttributeDisplayType;
  sortOrder: number;
  useForVariants: boolean;
  selectedValues: string[];
  customValues?: string[];
  showInHighlights?: boolean;
}

export interface ColorMediaConfig {
  colorValueId: string;
  colorName: string;
  colorCode?: string;
  mainImage: string;
  gallery: string[];
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  parentProductId?: string;
  colorName?: string;
  colorHex?: string;
  sizeName?: string;
  price: number;
  originalPrice?: number;
  comparePrice?: number;
  costPrice?: number;
  discountPercentage?: number;
  stock: number;
  weight?: number;
  image?: string;
  thumbnail?: string;
  status?: 'Active' | 'Inactive' | 'Out of Stock';
  attributeValues: Record<string, string>;
  imageOverride?: {
    mainImage: string;
    gallery: string[];
  };
}
