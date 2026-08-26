import fs from "fs";
import path from "path";
import { AttributeMaster, AttributeValue } from "../../../types/attribute.types.js";

export const INITIAL_ATTRIBUTES: AttributeMaster[] = [
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
      { id: "val-m2", attributeId: "attr-material", label: "100% Micro-Polyamide", value: "100% Micro-Polyamide", status: "active", sortOrder: 2 },
      { id: "val-m3", attributeId: "attr-material", label: "Medical-Grade Silicone", value: "Medical-Grade Silicone", status: "active", sortOrder: 3 }
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
      { id: "val-f2", attributeId: "attr-fabric", label: "4-Way Stretch Cotton", value: "4-Way Stretch Cotton", status: "active", sortOrder: 2 },
      { id: "val-f3", attributeId: "attr-fabric", label: "Modal Silk Blend", value: "Modal Silk Blend", status: "active", sortOrder: 3 }
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
      { id: "val-st2", attributeId: "attr-style", label: "Wirefree Contour", value: "Wirefree Contour", status: "active", sortOrder: 2 },
      { id: "val-st3", attributeId: "attr-style", label: "Invisible Coverage", value: "Invisible Coverage", status: "active", sortOrder: 3 }
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
  },
  {
    id: "attr-underwire",
    name: "Underwire Type",
    slug: "underwire-type",
    type: "SELECT",
    usage: "PRODUCT",
    showInHighlights: true,
    isRequired: false,
    sortOrder: 7,
    status: "active",
    isActive: true,
    values: [
      { id: "val-uw1", attributeId: "attr-underwire", label: "Wire Free", value: "Wire Free", status: "active", sortOrder: 1 },
      { id: "val-uw2", attributeId: "attr-underwire", label: "Underwire", value: "Underwire", status: "active", sortOrder: 2 }
    ]
  },
  {
    id: "attr-padding",
    name: "Padding",
    slug: "padding",
    type: "SELECT",
    usage: "PRODUCT",
    showInHighlights: true,
    isRequired: false,
    sortOrder: 8,
    status: "active",
    isActive: true,
    values: [
      { id: "val-pd1", attributeId: "attr-padding", label: "CloudSoft Removable Pads", value: "CloudSoft Removable Pads", status: "active", sortOrder: 1 },
      { id: "val-pd2", attributeId: "attr-padding", label: "Fixed Moulded Contour Pads", value: "Fixed Moulded Contour Pads", status: "active", sortOrder: 2 }
    ]
  },
  {
    id: "attr-support",
    name: "Support",
    slug: "support",
    type: "SELECT",
    usage: "PRODUCT",
    showInHighlights: true,
    isRequired: false,
    sortOrder: 9,
    status: "active",
    isActive: true,
    values: [
      { id: "val-sp1", attributeId: "attr-support", label: "High Support Contour Shaper", value: "High Support Contour Shaper", status: "active", sortOrder: 1 },
      { id: "val-sp2", attributeId: "attr-support", label: "Medium Everyday Support", value: "Medium Everyday Support", status: "active", sortOrder: 2 }
    ]
  }
];

const DB_FILE_PATH = path.join(process.cwd(), "attributes_db.json");

class AttributeStore {
  private attributes: AttributeMaster[] = [];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.attributes = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn("[AttributeStore] Could not read attributes_db.json, using defaults.");
    }
    this.attributes = [...INITIAL_ATTRIBUTES];
    this.saveToDisk();
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.attributes, null, 2), "utf-8");
    } catch (e) {
      console.error("[AttributeStore] Failed to write attributes_db.json:", e);
    }
  }

  public getAll(params?: { usage?: string; status?: string; search?: string }): AttributeMaster[] {
    let list = [...this.attributes];
    if (params?.usage && params.usage !== "All") {
      list = list.filter((a) => a.usage === params.usage || a.usage === "BOTH");
    }
    if (params?.status && params.status !== "All") {
      const activeBool = params.status === "Active" || params.status === "active";
      list = list.filter((a) => (a.status ? a.status === "active" : a.isActive) === activeBool);
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
    list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return list;
  }

  public getById(id: string): AttributeMaster | undefined {
    return this.attributes.find((a) => a.id === id || a.slug === id);
  }

  public create(data: Partial<AttributeMaster>): AttributeMaster {
    const slug = data.slug || (data.name || "new-attribute")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newAttr: AttributeMaster = {
      id: data.id || `attr-${Date.now()}`,
      name: data.name || "New Attribute",
      slug,
      type: data.type || "SELECT",
      usage: data.usage || "PRODUCT",
      showInHighlights: data.showInHighlights !== undefined ? data.showInHighlights : true,
      isRequired: data.isRequired !== undefined ? data.isRequired : false,
      sortOrder: data.sortOrder || this.attributes.length + 1,
      status: data.status || "active",
      isActive: data.status ? data.status === "active" : true,
      values: data.values || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.attributes.push(newAttr);
    this.saveToDisk();
    return newAttr;
  }

  public update(id: string, data: Partial<AttributeMaster>): AttributeMaster | null {
    const idx = this.attributes.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const existing = this.attributes[idx];
    const updatedStatus = data.status || (data.isActive !== undefined ? (data.isActive ? "active" : "inactive") : existing.status);

    const updated: AttributeMaster = {
      ...existing,
      ...data,
      status: updatedStatus,
      isActive: updatedStatus === "active",
      values: data.values ? data.values : existing.values,
      updatedAt: new Date().toISOString()
    };

    this.attributes[idx] = updated;
    this.saveToDisk();
    return updated;
  }

  public updateStatus(id: string, status: 'active' | 'inactive'): AttributeMaster | null {
    return this.update(id, { status, isActive: status === 'active' });
  }

  public delete(id: string): boolean {
    const len = this.attributes.length;
    this.attributes = this.attributes.filter((a) => a.id !== id);
    const deleted = this.attributes.length < len;
    if (deleted) this.saveToDisk();
    return deleted;
  }

  // Value CRUD
  public getValues(attributeId: string): AttributeValue[] {
    const attr = this.getById(attributeId);
    return attr ? attr.values.sort((a, b) => a.sortOrder - b.sortOrder) : [];
  }

  public addValue(attributeId: string, valueData: Partial<AttributeValue>): AttributeValue | null {
    const attr = this.getById(attributeId);
    if (!attr) return null;

    const newVal: AttributeValue = {
      id: valueData.id || `val-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      attributeId: attr.id,
      label: valueData.label || valueData.value || "New Value",
      value: valueData.value || valueData.label || "New Value",
      colorCode: valueData.colorCode,
      status: valueData.status || "active",
      sortOrder: valueData.sortOrder || attr.values.length + 1
    };

    attr.values.push(newVal);
    this.update(attr.id, { values: attr.values });
    return newVal;
  }

  public updateValue(attributeId: string, valueId: string, valueData: Partial<AttributeValue>): AttributeValue | null {
    const attr = this.getById(attributeId);
    if (!attr) return null;

    const valIdx = attr.values.findIndex((v) => v.id === valueId);
    if (valIdx === -1) return null;

    const updatedVal = {
      ...attr.values[valIdx],
      ...valueData
    };
    attr.values[valIdx] = updatedVal;
    this.update(attr.id, { values: attr.values });
    return updatedVal;
  }

  public deleteValue(attributeId: string, valueId: string): boolean {
    const attr = this.getById(attributeId);
    if (!attr) return false;

    const initialLen = attr.values.length;
    attr.values = attr.values.filter((v) => v.id !== valueId);
    if (attr.values.length < initialLen) {
      this.update(attr.id, { values: attr.values });
      return true;
    }
    return false;
  }
}

export const attributeStore = new AttributeStore();
