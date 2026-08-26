import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Package, 
  Search, 
  Trash2, 
  Edit2, 
  Eye, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  Tag, 
  Layers, 
  Upload, 
  UploadCloud,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  MOCK_PRODUCTS, 
  MOCK_CATEGORIES, 
  MOCK_SUBCATEGORIES, 
  MOCK_BRANDS, 
  MOCK_ATTRIBUTES, 
  getGlobalVariantsList,
  broadcastAdminProductChange,
  deleteAdminProduct,
  getAdminProducts,
  fetchProductsFromBackend,
  getAdminCategoriesAndSubcategories
} from '../data/mockAdminData';
import { Product, Variant, Attribute } from '../types/admin';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';

interface ProductsPageProps {
  onNavigate?: (tab: string, productId?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  // Product List State
  const [products, setProducts] = useState<Product[]>(() => getAdminProducts());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [masterVariants] = useState<Variant[]>(getGlobalVariantsList);

  // Live Categories Data with Real-Time Event Sync
  const [categoriesData, setCategoriesData] = useState(() => getAdminCategoriesAndSubcategories());

  useEffect(() => {
    const handleCategorySync = () => {
      setCategoriesData(getAdminCategoriesAndSubcategories());
    };
    window.addEventListener('aaramly_category_sync', handleCategorySync);
    return () => window.removeEventListener('aaramly_category_sync', handleCategorySync);
  }, []);

  // Sync products in real-time from Express MySQL backend, localStorage & BroadcastChannel
  useEffect(() => {
    const reload = async (showSkeleton = false) => {
      if (showSkeleton) setIsLoading(true);
      const live = await fetchProductsFromBackend();
      setProducts([...live]);
      if (showSkeleton) setIsLoading(false);
    };
    reload(true);

    const handleCustomEvent = () => reload(false);
    window.addEventListener('aaramly_product_sync', handleCustomEvent);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('aaramly_product_sync');
      channel.onmessage = () => reload(false);
    } catch (e) {}

    return () => {
      window.removeEventListener('aaramly_product_sync', handleCustomEvent);
      if (channel) channel.close();
    };
  }, []);

  // Form State for Add Product (Top Section)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=600');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState('');

  const [productType, setProductType] = useState<'Simple' | 'Variable'>('Simple');
  const [category, setCategory] = useState('Bralettes');
  const [subcategory, setSubcategory] = useState('Seamless Padded Bralettes');
  const [brand, setBrand] = useState('AARAMLY');

  const [regularPrice, setRegularPrice] = useState<number>(1299);
  const [salePrice, setSalePrice] = useState<number>(799);
  const [sku, setSku] = useState('AAR-SKU-' + Math.floor(1000 + Math.random() * 9000));
  const [barcode, setBarcode] = useState('890123' + Math.floor(100000 + Math.random() * 900000));
  const [stockQuantity, setStockQuantity] = useState<number>(100);

  // DYNAMIC DROPDOWNS FROM PRODUCT MANAGEMENT
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>(MOCK_ATTRIBUTES[0]?.id || '');
  const [selectedVariantId, setSelectedVariantId] = useState<string>(masterVariants?.[0]?.id || '');

  const [assignedColor, setAssignedColor] = useState('Black');
  const [assignedSize, setAssignedSize] = useState('M');
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Search & Filter State for All Products Table (Bottom Section)
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [publishedFilter, setPublishedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // DYNAMIC CATEGORIES AND SUBCATEGORIES STATE
  const [categoriesList, setCategoriesList] = useState(MOCK_CATEGORIES);
  const [subcategoriesList, setSubcategoriesList] = useState(MOCK_SUBCATEGORIES);

  const [showQuickCatModal, setShowQuickCatModal] = useState(false);
  const [newCatNameInput, setNewCatNameInput] = useState('');

  const [showQuickSubcatModal, setShowQuickSubcatModal] = useState(false);
  const [newSubcatNameInput, setNewSubcatNameInput] = useState('');

  // Dynamic colors and sizes from MOCK_ATTRIBUTES
  const colorAttr = MOCK_ATTRIBUTES.find((a) => a.name.toLowerCase() === 'color');
  const sizeAttr = MOCK_ATTRIBUTES.find((a) => a.name.toLowerCase() === 'size');

  const dynamicColors = colorAttr ? colorAttr.values.map((v) => v.value) : ['Black', 'White', 'Beige', 'Pink', 'Denim Blue'];
  const dynamicSizes = sizeAttr ? sizeAttr.values.map((v) => v.value) : ['XS', 'S', 'M', 'L', 'XL', '34B', '36B'];

  const handleToggleProductStatus = (product: Product) => {
    const isCurrentlyPublished = product.isPublished !== false && product.status !== 'Draft';
    const updated: Product = {
      ...product,
      isPublished: !isCurrentlyPublished,
      status: !isCurrentlyPublished ? 'Published' : 'Draft'
    };
    broadcastAdminProductChange(updated);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
  };

  // Quick Add Category
  const handleQuickAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameInput.trim()) return;
    const catName = newCatNameInput.trim();
    const newCatObj = {
      id: `cat-${Date.now()}`,
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      productCount: 0,
      isActive: true
    };
    MOCK_CATEGORIES.push(newCatObj);
    setCategoriesList([...MOCK_CATEGORIES]);
    setCategory(catName);
    setNewCatNameInput('');
    setShowQuickCatModal(false);
  };

  // Quick Add Subcategory
  const handleQuickAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcatNameInput.trim()) return;
    const subcatName = newSubcatNameInput.trim();
    const parentCat = categoriesList.find((c) => c.name === category) || categoriesList[0];
    const newSubcatObj = {
      id: `sub-${Date.now()}`,
      categoryId: parentCat?.id || 'cat-1',
      categoryName: parentCat?.name || category,
      name: subcatName,
      slug: subcatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    MOCK_SUBCATEGORIES.push(newSubcatObj);
    setSubcategoriesList([...MOCK_SUBCATEGORIES]);
    setSubcategory(subcatName);
    setNewSubcatNameInput('');
    setShowQuickSubcatModal(false);
  };

  // Filtered subcategories
  const availableSubcategories = subcategoriesList.filter((s) => s.categoryName === category);

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [name]);

  // Handle Form Submit (Add or Edit Product)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chosenAttr = MOCK_ATTRIBUTES.find((a) => a.id === selectedAttributeId);
    const chosenVar = masterVariants.find((v) => v.id === selectedVariantId);

    const assignedVariants =
      productType === 'Variable'
        ? (chosenVar ? [chosenVar] : [])
        : [{
            id: `v-simple-${Date.now()}`,
            sku: sku.trim(),
            color: assignedColor,
            size: assignedSize,
            price: salePrice,
            originalPrice: regularPrice,
            stock: stockQuantity,
            status: 'Active' as const
          }];

    const existingProduct = editingId ? products.find((p) => p.id === editingId) : null;

    const defaultColors = [
      {
        id: `col-${Date.now()}-blk`,
        colorName: assignedColor || 'Black',
        colorHex: '#000000',
        displayImage: mainImage || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=200',
        mainImage: mainImage || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=800',
        galleryImages: galleryImages || [],
        sizes: [assignedSize || 'S', 'M', 'L']
      }
    ];

    const productPayload: Product = {
      ...existingProduct,
      id: editingId || `prod-${Date.now()}`,
      name: name.trim(),
      slug: slug || `prod-${Date.now()}`,
      sku: sku.trim() || `AAR-${Date.now()}`,
      category: category,
      subcategory: subcategory,
      categories: [category],
      brand: brand,
      price: salePrice,
      originalPrice: regularPrice,
      stock: stockQuantity,
      rating: existingProduct?.rating || 4.8,
      salesCount: existingProduct?.salesCount || 120,
      status: isPublished ? 'Published' : 'Draft',
      isPublished: isPublished,
      type: productType,
      shortDescription: shortDescription,
      fullDescription: fullDescription,
      images: [mainImage, ...galleryImages].filter(Boolean),
      colors: (existingProduct?.colors && existingProduct.colors.length > 0) ? existingProduct.colors : defaultColors,
      attributes: chosenAttr ? [{ name: chosenAttr.name, values: chosenAttr.values.map(v => v.value) }] : [{ name: 'Color & Size', values: [assignedColor, assignedSize] }],
      variants: (existingProduct?.variants && existingProduct.variants.length > 0)
        ? existingProduct.variants.map((v) => ({ ...v, price: salePrice, originalPrice: regularPrice, stock: stockQuantity }))
        : assignedVariants,
      createdAt: existingProduct?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? productPayload : p)));
    } else {
      setProducts((prev) => [productPayload, ...prev]);
    }

    broadcastAdminProductChange(productPayload);
    resetForm();
    alert(editingId ? 'Product updated successfully!' : 'New product created!');
  };

  const handleUploadGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Promise.all(
        Array.from(files).map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      ).then((dataUrls) => {
        setGalleryImages((prev) => [...prev, ...dataUrls]);
      });
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setShortDescription('');
    setFullDescription('');
    setMainImage('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=600');
    setGalleryImages([]);
    setRegularPrice(1299);
    setSalePrice(799);
    setStockQuantity(100);
    setSku('AAR-SKU-' + Math.floor(1000 + Math.random() * 9000));
    setBarcode('890123' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleEditProduct = (p: Product) => {
    if (onNavigate) {
      onNavigate('edit-product', p.id);
      return;
    }
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setShortDescription(p.shortDescription || '');
    setFullDescription(p.fullDescription || '');
    setMainImage(p.images[0] || '');
    setGalleryImages(p.images.slice(1));
    setProductType(p.type);
    setCategory(p.category);
    setSubcategory(p.subcategory || 'General');
    setBrand(p.brand);
    setRegularPrice(p.originalPrice || p.price);
    setSalePrice(p.price);
    setSku(p.sku);
    setStockQuantity(p.stock);
    setIsPublished(p.isPublished);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      deleteAdminProduct(id);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesPublished =
      publishedFilter === 'ALL'
        ? true
        : publishedFilter === 'PUBLISHED'
        ? p.isPublished
        : !p.isPublished;

    return matchesSearch && matchesCategory && matchesPublished;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 font-sans selection:bg-black selection:text-white">
      {/* CATALOG HEADER BAR WITH ADD NEW PRODUCT BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-black tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-black" />
            <span>All Products Catalog</span>
            <Badge variant="secondary" className="text-xs font-semibold bg-neutral-100 text-neutral-800 border-neutral-200">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </Badge>
          </h1>
          <p className="text-xs text-neutral-500 font-normal mt-1">
            Manage inventory items, product variations, live store status, and pricing.
          </p>
        </div>

        <Button
          onClick={() => (onNavigate ? onNavigate('add-product', undefined) : null)}
          className="bg-black hover:bg-neutral-800 text-white font-medium text-xs px-4 py-2 rounded-md transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* CATALOG DATA TABLE & FILTERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-black tracking-tight flex items-center gap-2">
              <span>Catalog Inventory Items</span>
            </h2>
            <p className="text-xs text-neutral-500 font-normal">Search and filter active store inventory.</p>
          </div>

          {/* Table Filters with shadcn Select */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs bg-white border-neutral-200"
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
                options={[
                  { value: 'ALL', label: 'All Categories' },
                  ...categoriesData.mainCategories.map((c: any) => ({ value: c.name, label: c.name }))
                ]}
              />
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <Card className="overflow-hidden border-neutral-200">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Details</TableHead>
                <TableHead>Category / Subcategory</TableHead>
                <TableHead>Variant &amp; Attribute</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-neutral-200 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3 bg-neutral-200 rounded w-36" />
                          <div className="h-2.5 bg-neutral-200 rounded w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><div className="h-3 bg-neutral-200 rounded w-24" /></TableCell>
                    <TableCell><div className="h-3 bg-neutral-200 rounded w-20" /></TableCell>
                    <TableCell><div className="h-3 bg-neutral-200 rounded w-14" /></TableCell>
                    <TableCell><div className="h-3 bg-neutral-200 rounded w-10" /></TableCell>
                    <TableCell><div className="h-3 bg-neutral-200 rounded w-16" /></TableCell>
                    <TableCell><div className="h-3 bg-neutral-200 rounded w-16" /></TableCell>
                    <TableCell><div className="h-3 bg-neutral-200 rounded w-16 float-right" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=100'}
                        alt={p.name}
                        className="w-9 h-9 rounded-md object-cover border border-neutral-200 bg-neutral-100 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-medium text-black text-xs line-clamp-1">{p.name}</h4>
                        <span className="font-mono text-[10px] text-neutral-400">{p.sku}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <p className="font-medium text-black">{p.category}</p>
                    <p className="text-[10px] text-neutral-400">{p.subcategory || 'General'}</p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <p className="font-medium text-black">
                      {p.variants && p.variants.length > 0 ? `${p.variants[0].color} / ${p.variants[0].size}` : 'Standard Variant'}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {p.attributes && p.attributes.length > 0 ? p.attributes[0].name : 'Color & Size'}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <span className="font-semibold text-black">₹{p.price}</span>
                    {p.originalPrice > p.price && (
                      <span className="text-[10px] text-neutral-400 line-through ml-1">₹{p.originalPrice}</span>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <span className={`font-medium ${p.stock > 10 ? 'text-neutral-800' : 'text-amber-700'}`}>
                      {p.stock} units
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={p.isPublished !== false && p.status !== 'Draft'}
                          onChange={() => handleToggleProductStatus(p)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                      </label>
                      <Badge
                        className={
                          p.isPublished !== false && p.status !== 'Draft'
                            ? 'bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5'
                        }
                      >
                        {p.isPublished !== false && p.status !== 'Draft' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap font-mono text-neutral-400 text-[11px]">
                    {p.createdAt || '2026-07-31'}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditProduct(p)}
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteProduct(p.id)}
                      title="Delete Product"
                      className="hover:bg-rose-50 text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </Card>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* QUICK ADD CATEGORY MODAL */}
      {showQuickCatModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-semibold text-black text-sm">Create New Category</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowQuickCatModal(false)}>
                &times;
              </Button>
            </div>

            <form onSubmit={handleQuickAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-black block mb-1">
                  Category Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Nightwear, Activewear..."
                  value={newCatNameInput}
                  onChange={(e) => setNewCatNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowQuickCatModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                >
                  Save Category
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* QUICK ADD SUBCATEGORY MODAL */}
      {showQuickSubcatModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="font-semibold text-black text-sm">Create New Subcategory</h3>
                <p className="text-[11px] text-neutral-400">Parent Category: <strong className="text-black">{category}</strong></p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowQuickSubcatModal(false)}>
                &times;
              </Button>
            </div>

            <form onSubmit={handleQuickAddSubcategory} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-black block mb-1">
                  Subcategory Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Wireless Plunge..."
                  value={newSubcatNameInput}
                  onChange={(e) => setNewSubcatNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowQuickSubcatModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                >
                  Save Subcategory
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
