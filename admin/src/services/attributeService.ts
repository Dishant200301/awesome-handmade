import { AttributeMaster, AttributeValue } from '../types/attribute.types';

const API_BASE_URL = 'http://localhost:5000/api/v1/attributes';
const LOCAL_STORAGE_KEY = 'aaramly_admin_attribute_master_v3';

export const INITIAL_DEFAULT_ATTRIBUTES: AttributeMaster[] = [
  {
    id: "attr-color",
    name: "Color",
    slug: "color",
    type: "SWATCH",
    usage: "BOTH",
    showInHighlights: true,
    isRequired: true,
    sortOrder: 1,
    status: "active",
    isActive: true,
    values: [
      { id: "val-c1", attributeId: "attr-color", label: "Black", value: "Black", colorCode: "#000000", status: "active", sortOrder: 1 },
      { id: "val-c2", attributeId: "attr-color", label: "White", value: "White", colorCode: "#FFFFFF", status: "active", sortOrder: 2 },
      { id: "val-c3", attributeId: "attr-color", label: "Beige", value: "Beige", colorCode: "#E8D3C3", status: "active", sortOrder: 3 },
      { id: "val-c4", attributeId: "attr-color", label: "Blush Pink", value: "Blush Pink", colorCode: "#FFB6C1", status: "active", sortOrder: 4 },
      { id: "val-c5", attributeId: "attr-color", label: "Denim Blue", value: "Denim Blue", colorCode: "#3B5998", status: "active", sortOrder: 5 },
      { id: "val-c6", attributeId: "attr-color", label: "Red", value: "Red", colorCode: "#FF0000", status: "active", sortOrder: 6 }
    ]
  },
  {
    id: "attr-size",
    name: "Size",
    slug: "size",
    type: "BUTTON",
    usage: "BOTH",
    showInHighlights: true,
    isRequired: true,
    sortOrder: 2,
    status: "active",
    isActive: true,
    values: [
      { id: "val-s1", attributeId: "attr-size", label: "S", value: "S", status: "active", sortOrder: 1 },
      { id: "val-s2", attributeId: "attr-size", label: "M", value: "M", status: "active", sortOrder: 2 },
      { id: "val-s3", attributeId: "attr-size", label: "L", value: "L", status: "active", sortOrder: 3 },
      { id: "val-s4", attributeId: "attr-size", label: "XL", value: "XL", status: "active", sortOrder: 4 },
      { id: "val-s5", attributeId: "attr-size", label: "XXL", value: "XXL", status: "active", sortOrder: 5 }
    ]
  },
  {
    id: "attr-material",
    name: "Material Composition",
    slug: "material-composition",
    type: "TEXT",
    usage: "PRODUCT",
    showInHighlights: true,
    isRequired: false,
    sortOrder: 3,
    status: "active",
    isActive: true,
    values: [
      { id: "val-m1", attributeId: "attr-material", label: "64% Nylon + 36% Spandex", value: "64% Nylon + 36% Spandex", status: "active", sortOrder: 1 },
      { id: "val-m2", attributeId: "attr-material", label: "100% Micro-Polyamide", value: "100% Micro-Polyamide", status: "active", sortOrder: 2 }
    ]
  },
  {
    id: "attr-fabric",
    name: "Fabric",
    slug: "fabric",
    type: "SELECT",
    usage: "PRODUCT",
    showInHighlights: true,
    isRequired: false,
    sortOrder: 4,
    status: "active",
    isActive: true,
    values: [
      { id: "val-f1", attributeId: "attr-fabric", label: "Microfiber Nylon Knit", value: "Microfiber Nylon Knit", status: "active", sortOrder: 1 },
      { id: "val-f2", attributeId: "attr-fabric", label: "4-Way Stretch Cotton", value: "4-Way Stretch Cotton", status: "active", sortOrder: 2 }
    ]
  },
  {
    id: "attr-style",
    name: "Style",
    slug: "style",
    type: "SELECT",
    usage: "PRODUCT",
    showInHighlights: true,
    isRequired: false,
    sortOrder: 5,
    status: "active",
    isActive: true,
    values: [
      { id: "val-st1", attributeId: "attr-style", label: "Contemporary Seamless", value: "Contemporary Seamless", status: "active", sortOrder: 1 },
      { id: "val-st2", attributeId: "attr-style", label: "Wirefree Contour", value: "Wirefree Contour", status: "active", sortOrder: 2 }
    ]
  },
  {
    id: "attr-cup-type",
    name: "Cup Type",
    slug: "cup-type",
    type: "BUTTON",
    usage: "BOTH",
    showInHighlights: true,
    isRequired: false,
    sortOrder: 6,
    status: "active",
    isActive: true,
    values: [
      { id: "val-ct1", attributeId: "attr-cup-type", label: "Padded", value: "Padded", status: "active", sortOrder: 1 },
      { id: "val-ct2", attributeId: "attr-cup-type", label: "Non-Padded", value: "Non-Padded", status: "active", sortOrder: 2 },
      { id: "val-ct3", attributeId: "attr-cup-type", label: "Removable Cups", value: "Removable Cups", status: "active", sortOrder: 3 }
    ]
  }
];

export class AttributeService {
  private static getLocalAttributes(): AttributeMaster[] {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_ATTRIBUTES));
    return [...INITIAL_DEFAULT_ATTRIBUTES];
  }

  private static saveLocalAttributes(attributes: AttributeMaster[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(attributes));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('aaramly_attribute_sync'));
      }
    } catch (e) {}
  }

  public static async getAttributes(params?: { usage?: string; status?: string; search?: string }): Promise<AttributeMaster[]> {
    try {
      const query = new URLSearchParams();
      if (params?.usage) query.append('usage', params.usage);
      if (params?.status) query.append('status', params.status);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE_URL}?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          this.saveLocalAttributes(json.data);
          return json.data;
        }
      }
    } catch (error) {
      console.warn('[AttributeService] Backend API not reachable, loading from LocalStorage.');
    }

    let list = this.getLocalAttributes();
    if (params?.usage && params.usage !== 'All') {
      list = list.filter((a) => a.usage === params.usage || a.usage === 'BOTH');
    }
    if (params?.status && params.status !== 'All') {
      const isAct = params.status === 'Active' || params.status === 'active';
      list = list.filter((a) => (a.status ? a.status === 'active' : a.isActive) === isAct);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          (a.values && a.values.some((v) => v.label.toLowerCase().includes(q) || v.value.toLowerCase().includes(q)))
      );
    }
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  public static async saveAttribute(attributeData: Partial<AttributeMaster>): Promise<AttributeMaster> {
    try {
      const isEdit = !!attributeData.id && !attributeData.id.startsWith('temp-');
      const url = isEdit ? `${API_BASE_URL}/${attributeData.id}` : API_BASE_URL;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attributeData)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const local = this.getLocalAttributes();
          const idx = local.findIndex((a) => a.id === json.data.id);
          if (idx !== -1) local[idx] = json.data;
          else local.push(json.data);
          this.saveLocalAttributes(local);
          return json.data;
        }
      }
    } catch (e) {}

    const local = this.getLocalAttributes();
    const slug = attributeData.slug || (attributeData.name || 'new-attr')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const savedAttr: AttributeMaster = {
      id: attributeData.id || `attr-${Date.now()}`,
      name: attributeData.name || 'New Attribute',
      slug,
      type: attributeData.type || 'SELECT',
      usage: attributeData.usage || 'PRODUCT',
      showInHighlights: attributeData.showInHighlights !== undefined ? attributeData.showInHighlights : true,
      isRequired: attributeData.isRequired !== undefined ? attributeData.isRequired : false,
      sortOrder: attributeData.sortOrder || local.length + 1,
      status: attributeData.status || 'active',
      isActive: attributeData.status ? attributeData.status === 'active' : true,
      values: attributeData.values || []
    };

    const idx = local.findIndex((a) => a.id === savedAttr.id);
    if (idx !== -1) {
      local[idx] = savedAttr;
    } else {
      local.unshift(savedAttr);
    }
    this.saveLocalAttributes(local);
    return savedAttr;
  }

  public static async updateStatus(id: string, status: 'active' | 'inactive'): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, isActive: status === 'active' })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const local = this.getLocalAttributes();
          const attr = local.find((a) => a.id === id);
          if (attr) {
            attr.status = status;
            attr.isActive = status === 'active';
            this.saveLocalAttributes(local);
          }
          return true;
        }
      }
    } catch (e) {}

    const local = this.getLocalAttributes();
    const attr = local.find((a) => a.id === id);
    if (attr) {
      attr.status = status;
      attr.isActive = status === 'active';
      this.saveLocalAttributes(local);
      return true;
    }
    return false;
  }

  public static async deleteAttribute(id: string): Promise<{ success: boolean; isUsed?: boolean; usedCount?: number; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        const local = this.getLocalAttributes().filter((a) => a.id !== id);
        this.saveLocalAttributes(local);
        return { success: true };
      } else {
        return { success: false, isUsed: json.isUsed, usedCount: json.usedCount, message: json.message };
      }
    } catch (e) {}

    const local = this.getLocalAttributes().filter((a) => a.id !== id);
    this.saveLocalAttributes(local);
    return { success: true };
  }

  // Value CRUD Methods
  public static async addValue(attributeId: string, valueData: Partial<AttributeValue>): Promise<AttributeValue | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/${attributeId}/values`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valueData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {}

    const local = this.getLocalAttributes();
    const attr = local.find((a) => a.id === attributeId);
    if (!attr) return null;

    const newVal: AttributeValue = {
      id: valueData.id || `val-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      attributeId: attr.id,
      label: valueData.label || valueData.value || 'New Value',
      value: valueData.value || valueData.label || 'New Value',
      colorCode: valueData.colorCode,
      status: valueData.status || 'active',
      sortOrder: valueData.sortOrder || attr.values.length + 1
    };

    attr.values.push(newVal);
    this.saveLocalAttributes(local);
    return newVal;
  }
}
