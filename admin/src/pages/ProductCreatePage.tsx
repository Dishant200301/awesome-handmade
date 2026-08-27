import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  Plus, 
  Trash2, 
  Layers, 
  Check, 
  Tag, 
  DollarSign, 
  Package, 
  Globe, 
  RefreshCw,
  X,
  Image as ImageIcon,
  UploadCloud,
  ChevronUp,
  ChevronDown,
  Palette,
  Ruler,
  FolderTree,
  Wand2,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  MOCK_CATEGORIES, 
  MOCK_SUBCATEGORIES, 
  MOCK_BRANDS, 
  MOCK_COLLECTIONS, 
  MOCK_PRODUCTS, 
  broadcastAdminProductChange, 
  getAdminProducts, 
  fetchProductsFromBackend, 
  getAdminCategoriesAndSubcategories 
} from '../data/mockAdminData';
import { Product, Variant, ProductColor, ProductDescriptionCard, ProductHighlight, ProductWashingInstruction, ProductManufacturingInfo, SizeGuide } from '../types/admin';
import { ProductAttributeAssignment, ProductVariantConfig, ColorMediaConfig, ProductSizeChartConfig } from '../types/attribute.types';
import { ProductAttributeSection } from '../components/ProductAttributeSection';
import { ColorGallerySection } from '../components/ColorGallerySection';
import { VariantGeneratorSection } from '../components/VariantGeneratorSection';
import { ProductSizeChartSection } from '../components/ProductSizeChartSection';
import { AdminApiService } from '../services/adminApi';
import { idbGet } from '../data/idbStorage';
import LucideIconPicker from '../components/LucideIconPicker';
import { Select } from '../components/ui/select';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

interface ProductCreatePageProps {
  onNavigate: (tab: string) => void;
  editingProductId?: string;
}

export const ProductCreatePage: React.FC<ProductCreatePageProps> = ({ onNavigate, editingProductId }) => {
  // Live Categories & Subcategories State
  const [categoriesData, setCategoriesData] = useState(() => getAdminCategoriesAndSubcategories());

  useEffect(() => {
    const handleCategorySync = () => {
      setCategoriesData(getAdminCategoriesAndSubcategories());
    };
    window.addEventListener('awesome_category_sync', handleCategorySync);
    window.addEventListener('aaramly_category_sync', handleCategorySync);
    return () => {
      window.removeEventListener('awesome_category_sync', handleCategorySync);
      window.removeEventListener('aaramly_category_sync', handleCategorySync);
    };
  }, []);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Product Type & Categories
  const [productType, setProductType] = useState<'Simple' | 'Variable'>('Simple');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Latkan']);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Mirror Latkan');
  const [brand, setBrand] = useState('Awesome Handmade');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Pricing & Default Inventory
  const [salePrice, setSalePrice] = useState<number>(799);
  const [regularPrice, setRegularPrice] = useState<number>(1299);
  const [costPrice, setCostPrice] = useState<number>(350);
  const [sku, setSku] = useState<string>('AWH-PRD-001');
  const [barcode, setBarcode] = useState<string>('890123000001');
  const [stockQuantity, setStockQuantity] = useState<number>(150);
  const [lowStockAlert, setLowStockAlert] = useState<number>(10);
  const [allowBackorders, setAllowBackorders] = useState<boolean>(false);
  const [trackInventory, setTrackInventory] = useState<boolean>(true);
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Hidden'>('Published');
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Colors & Variants State
  const [colors, setColors] = useState<ProductColor[]>([
    {
      id: 'col-1',
      colorName: 'Red',
      colorHex: '#800000',
      displayImage: '',
      mainImage: '',
      galleryImages: [],
      sizes: ['Standard']
    },
    {
      id: 'col-2',
      colorName: 'Gold',
      colorHex: '#D4AF37',
      displayImage: '',
      mainImage: '',
      galleryImages: [],
      sizes: ['Standard']
    }
  ]);

  const [activeColorEditId, setActiveColorEditId] = useState<string | null>('col-1');
  const [customSizeAdd, setCustomSizeAdd] = useState('');
  const [generatedVariants, setGeneratedVariants] = useState<Variant[]>([]);
  const [bulkPriceInput, setBulkPriceInput] = useState<number | ''>('');
  const [bulkMrpInput, setBulkMrpInput] = useState<number | ''>('');
  const [bulkStockInput, setBulkStockInput] = useState<number | ''>('');

  // Size Guides & Custom Data
  const [selectedSizeGuideId, setSelectedSizeGuideId] = useState<string>('');
  const [sizeGuidesList, setSizeGuidesList] = useState<SizeGuide[]>([]);
  const [showCreateSizeGuideModal, setShowCreateSizeGuideModal] = useState(false);
  const [newGuideTitle, setNewGuideTitle] = useState('');
  const [newGuideDesc, setNewGuideDesc] = useState('');
  const [newGuideCategories, setNewGuideCategories] = useState<string[]>(['Choli']);

  // Dynamic Content Cards
  const [descriptionCards, setDescriptionCards] = useState<ProductDescriptionCard[]>([
    {
      id: 'card-1',
      title: 'Authentic Traditional Craftsmanship',
      description: 'Handcrafted with intricate mirror work and artisanal needlework by master craftswomen in Surat, Gujarat.',
      image: '',
      sortOrder: 1
    }
  ]);
  const [highlights, setHighlights] = useState<ProductHighlight[]>([]);
  const [washingInstructions, setWashingInstructions] = useState<ProductWashingInstruction[]>([]);
  const [manufacturingInfo, setManufacturingInfo] = useState<ProductManufacturingInfo>({
    countryOfOrigin: 'India',
    manufacturer: 'Awesome Handmade Studio',
    address: 'Surat, Gujarat, India',
    packedBy: 'Awesome Handmade Studio',
    importedBy: '',
    material: 'Mirror & Cotton Silk',
    careEmail: 'support@awesomehandmade.com',
    carePhone: '+91 98765 43210'
  });
  const [idealForPills, setIdealForPills] = useState<string[]>(['Festive', 'Navratri', 'Bridal & Gifting']);
  const [productAttributes, setProductAttributes] = useState<ProductAttributeAssignment[]>([]);
  const [colorMediaConfigs, setColorMediaConfigs] = useState<ColorMediaConfig[]>([]);
  const [sizeChart, setSizeChart] = useState<ProductSizeChartConfig | undefined>(undefined);

  // Shipping & SEO
  const [weight, setWeight] = useState(0.2);
  const [length, setLength] = useState(25);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(3);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Form submission status
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // AI Auto-Fill State
  const [aiImagePreview, setAiImagePreview] = useState<string>('');
  const [aiHint, setAiHint] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string>('');
  const [aiErrorMessage, setAiErrorMessage] = useState<string>('');
  const [isTargetLoading, setIsTargetLoading] = useState<boolean>(!!editingProductId);

  const handleAiAutoFill = async (imageInput?: string) => {
    const targetImage = imageInput || aiImagePreview || mainImage;
    if (!targetImage) {
      setAiErrorMessage('Please select or upload a product photo first.');
      return;
    }

    setIsGeneratingAi(true);
    setAiErrorMessage('');
    setAiSuccessMessage('');

    try {
      const genData = await AdminApiService.generateProductDetailsFromImage(targetImage, aiHint);
      if (genData) {
        // 1. Basic info
        if (genData.name) setName(genData.name);
        if (genData.slug) setSlug(genData.slug);
        if (genData.shortDescription) setShortDescription(genData.shortDescription);
        if (genData.fullDescription) setFullDescription(genData.fullDescription);
        
        // 2. Images
        setMainImage(targetImage);
        
        // 3. Category & Taxonomy
        if (genData.category) setSelectedCategories([genData.category]);
        if (genData.subcategory) setSelectedSubcategory(genData.subcategory);
        if (genData.brand) setBrand(genData.brand);
        if (genData.collections && genData.collections.length > 0) setSelectedCollections(genData.collections);
        if (genData.tags && genData.tags.length > 0) setSelectedTags(genData.tags);

        // 4. Pricing & Inventory
        if (genData.price) setSalePrice(genData.price);
        if (genData.originalPrice) setRegularPrice(genData.originalPrice);
        if (genData.costPrice) setCostPrice(genData.costPrice);
        if (genData.sku) setSku(genData.sku);
        if (genData.barcode) setBarcode(genData.barcode);
        if (genData.stock) setStockQuantity(genData.stock);

        // 5. Colors & Swatches
        if (genData.colors && genData.colors.length > 0) {
          const updatedColors: ProductColor[] = genData.colors.map((c: any, idx: number) => ({
            id: c.id || `col-${idx + 1}`,
            colorName: c.colorName || 'Royal Blue',
            colorHex: c.colorHex || '#1A3B8B',
            displayImage: targetImage,
            mainImage: targetImage,
            galleryImages: [],
            sizes: c.sizes || ['Free Size']
          }));
          setColors(updatedColors);
          setColorMediaConfigs(
            updatedColors.map((c) => ({
              colorValueId: c.id,
              colorName: c.colorName,
              colorCode: c.colorHex,
              mainImage: targetImage,
              gallery: []
            }))
          );
        }

        // 6. Content & Highlights
        if (genData.descriptionCards && genData.descriptionCards.length > 0) {
          setDescriptionCards(genData.descriptionCards);
        }
        if (genData.highlights && genData.highlights.length > 0) {
          setHighlights(genData.highlights);
        }
        if (genData.washingInstructions && genData.washingInstructions.length > 0) {
          setWashingInstructions(genData.washingInstructions);
        }
        if (genData.manufacturingInfo) {
          setManufacturingInfo(genData.manufacturingInfo);
        }
        if (genData.idealForPills && genData.idealForPills.length > 0) {
          setIdealForPills(genData.idealForPills);
        }

        // 7. SEO
        if (genData.metaTitle) setMetaTitle(genData.metaTitle);
        if (genData.metaDescription) setMetaDescription(genData.metaDescription);
        if (genData.keywords) setKeywords(genData.keywords);

        setAiSuccessMessage(`✨ Generated details for "${genData.name}"! All form fields have been auto-populated.`);
      }
    } catch (err: any) {
      console.error(err);
      setAiErrorMessage(err.message || 'Failed to auto-generate details from image.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setAiImagePreview(base64);
      handleAiAutoFill(base64);
    };
    reader.readAsDataURL(file);
  };

  // Load existing product when editing
  useEffect(() => {
    const loadTarget = async () => {
      if (editingProductId) {
        setIsTargetLoading(true);
        try {
          let target: Product | null | undefined = await AdminApiService.getProductById(editingProductId);
          if (!target) {
            let allProds = getAdminProducts();
            target = allProds.find((p) => p.id === editingProductId);
          }
          if (!target) {
            const stored = await idbGet<any>('awesome_admin_sync');
            if (stored && Array.isArray(stored.products)) {
              target = stored.products.find((p: any) => p.id === editingProductId);
            }
          }
          if (!target) {
            const live = await fetchProductsFromBackend();
            target = live.find((p) => p.id === editingProductId);
          }

          if (target) {
            setName(target.name || '');
            setSlug(target.slug || '');
            setShortDescription(target.shortDescription || (target as any).subtitle || '');
            setFullDescription(target.fullDescription || (target as any).description || '');
            
            const primaryImg = target.image || (target as any).mainImage || (target.images && target.images[0]) || '';
            setMainImage(primaryImg);
            setAiImagePreview(primaryImg);

            // Collect all gallery images without dropping any
            const galList: string[] = [];
            if (Array.isArray((target as any).galleryImages)) {
              (target as any).galleryImages.forEach((img: any) => {
                const u = typeof img === 'string' ? img : img?.url;
                if (u && typeof u === 'string' && u.trim() && !galList.includes(u.trim())) galList.push(u.trim());
              });
            }
            if (Array.isArray(target.images)) {
              target.images.forEach((img: any) => {
                const u = typeof img === 'string' ? img : img?.url;
                if (u && typeof u === 'string' && u.trim() && !galList.includes(u.trim())) galList.push(u.trim());
              });
            }
            setGalleryImages(galList);
            
            const isSimple = target.productType === 'simple' || target.type === 'Simple';
            setProductType(isSimple ? 'Simple' : 'Variable');

            const targetCategories = Array.isArray(target.categories) && target.categories.length > 0
              ? target.categories
              : (target.category ? [target.category] : ['Latkan']);
            setSelectedCategories(targetCategories);
            if (target.subcategory) {
              setSelectedSubcategory(target.subcategory);
            }
            setBrand(target.brand || 'Awesome Handmade');
            if (target.collections) setSelectedCollections(target.collections);
            if (target.tags) setSelectedTags(target.tags);

            setSalePrice(target.price ?? 799);
            setRegularPrice(target.originalPrice ?? 1299);
            setCostPrice(target.costPrice ?? 350);
            setSku(target.sku || (target as any).defaultSku || '');
            if (target.inventory?.barcode || target.barcode) setBarcode(target.inventory?.barcode || target.barcode || '');
            setStockQuantity(target.stock ?? 100);
            if (target.inventory?.lowStockAlert !== undefined) setLowStockAlert(target.inventory.lowStockAlert);
            if (target.inventory?.allowBackorders !== undefined) setAllowBackorders(target.inventory.allowBackorders);
            if (target.inventory?.trackInventory !== undefined) setTrackInventory(target.inventory.trackInventory);

            setStatus(target.status === 'Published' || target.isPublished ? 'Published' : 'Draft');
            setIsPublished(target.isPublished ?? true);

            if (target.colors && target.colors.length > 0) {
              const loadedColors = target.colors.map((c: any, idx: number) => ({
                id: c.id || c.colorValueId || `col-${idx + 1}`,
                colorName: c.colorName || (c as any).name || (c as any).color || 'Standard',
                colorHex: c.colorHex || c.colorCode || '#000000',
                displayImage: c.displayImage || c.mainImage || (c.galleryImages && c.galleryImages[0]) || primaryImg,
                mainImage: c.mainImage || c.displayImage || (c.galleryImages && c.galleryImages[0]) || primaryImg,
                galleryImages: Array.isArray(c.galleryImages) ? c.galleryImages.map((g: any) => typeof g === 'string' ? g : g.url).filter(Boolean) : (Array.isArray(c.gallery) ? c.gallery : []),
                sizes: Array.isArray(c.sizes) && c.sizes.length > 0 ? c.sizes : ['Standard Pair']
              }));
              setColors(loadedColors);
              setActiveColorEditId(loadedColors[0].id);
            }

            if (target.colorMediaConfigs && target.colorMediaConfigs.length > 0) {
              setColorMediaConfigs(target.colorMediaConfigs);
            } else if (target.colors && target.colors.length > 0) {
              setColorMediaConfigs(
                target.colors.map((c: any) => ({
                  colorValueId: c.id || `cm-${c.colorName}`,
                  colorName: c.colorName || (c as any).name || 'Standard',
                  colorCode: c.colorHex || c.colorCode || '#000000',
                  title: c.title || '',
                  productInfo: c.productInfo || '',
                  mainImage: c.mainImage || c.displayImage || primaryImg,
                  gallery: c.galleryImages || c.gallery || []
                }))
              );
            }

            if (target.variants && target.variants.length > 0) {
              setGeneratedVariants(target.variants);
            }

            if (target.sizeGuideId) {
              setSelectedSizeGuideId(target.sizeGuideId);
            }

            if (target.sizeChart) {
              setSizeChart(target.sizeChart);
            }

            if (target.descriptionCards && target.descriptionCards.length > 0) {
              setDescriptionCards(target.descriptionCards);
            }

            if (target.highlights && target.highlights.length > 0) {
              setHighlights(target.highlights);
            } else if ((target as any).keyFeatures && (target as any).keyFeatures.length > 0) {
              setHighlights((target as any).keyFeatures);
            }

            if (target.washingInstructions && target.washingInstructions.length > 0) {
              setWashingInstructions(target.washingInstructions);
            }

            if (target.manufacturingInfo) {
              setManufacturingInfo(target.manufacturingInfo);
            }

            if (target.idealForPills && target.idealForPills.length > 0) {
              setIdealForPills(target.idealForPills);
            }

            if (target.shipping) {
              if (target.shipping.weight !== undefined) setWeight(target.shipping.weight);
              if (target.shipping.length !== undefined) setLength(target.shipping.length);
              if (target.shipping.width !== undefined) setWidth(target.shipping.width);
              if (target.shipping.height !== undefined) setHeight(target.shipping.height);
            }

            if (target.seo) {
              if (target.seo.metaTitle) setMetaTitle(target.seo.metaTitle);
              if (target.seo.metaDescription) setMetaDescription(target.seo.metaDescription);
              if (target.seo.keywords) setKeywords(target.seo.keywords);
              if (target.seo.canonicalUrl) setCanonicalUrl(target.seo.canonicalUrl);
            } else {
              if ((target as any).metaTitle) setMetaTitle((target as any).metaTitle);
              if ((target as any).metaDescription) setMetaDescription((target as any).metaDescription);
              if ((target as any).keywords) setKeywords((target as any).keywords);
            }

            if (target.productAttributes && Array.isArray(target.productAttributes) && target.productAttributes.length > 0) {
              setProductAttributes(target.productAttributes);
            } else if (target.colors && target.colors.length > 0) {
              const colorAttr: ProductAttributeAssignment = {
                attributeId: 'attr-color',
                attributeName: 'Color',
                attributeSlug: 'color',
                type: 'SWATCH',
                sortOrder: 1,
                useForVariants: true,
                selectedValues: target.colors.map((c) => c.colorName)
              };

              const allSizes = Array.from(new Set(target.colors.flatMap((c) => c.sizes || [])));
              const sizeAttr: ProductAttributeAssignment = {
                attributeId: 'attr-size',
                attributeName: 'Size',
                attributeSlug: 'size',
                type: 'BUTTON',
                sortOrder: 2,
                useForVariants: true,
                selectedValues: allSizes
              };

              setProductAttributes([colorAttr, sizeAttr]);
            }
          }
        } finally {
          setIsTargetLoading(false);
        }
      }
    };
    loadTarget();
  }, [editingProductId]);

  // Load Size Guides from API
  useEffect(() => {
    const fetchGuides = async () => {
      const guides = await AdminApiService.getSizeGuides();
      if (guides && guides.length > 0) {
        setSizeGuidesList(guides);
        if (!selectedSizeGuideId) {
          setSelectedSizeGuideId(guides[0].id);
        }
      }
    };
    fetchGuides();
  }, []);

  // Auto-generate Variant Matrix when Colors & Sizes change
  useEffect(() => {
    if (isTargetLoading) return;
    if (editingProductId && generatedVariants.length > 0) {
      return; // Preserve pre-loaded custom target variants when editing!
    }
    if (colors.length === 0) {
      setGeneratedVariants([]);
      return;
    }

    const newVariants: Variant[] = [];
    colors.forEach((col) => {
      const colSizes = col.sizes && col.sizes.length > 0 ? col.sizes : ['S', 'M', 'L', 'XL'];
      colSizes.forEach((sz) => {
        const existing = generatedVariants.find(
          (v) => (v.color?.toLowerCase() === col.colorName.toLowerCase() || v.colorName?.toLowerCase() === col.colorName.toLowerCase()) &&
                 (v.size?.toLowerCase() === sz.toLowerCase() || v.sizeName?.toLowerCase() === sz.toLowerCase())
        );

        if (existing) {
          newVariants.push({
            ...existing,
            color: col.colorName,
            colorName: col.colorName,
            colorHex: col.colorHex || '#000000',
            size: sz,
            sizeName: sz,
            image: col.mainImage || col.displayImage || col.galleryImages?.[0] || existing.image || '',
            thumbnail: col.displayImage || col.mainImage || col.galleryImages?.[0] || existing.thumbnail || '',
            galleryImages: col.galleryImages || existing.galleryImages || []
          });
        } else {
          newVariants.push({
            id: `var-${col.colorName}-${sz}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            sku: `${sku || 'AAR'}-${col.colorName.substring(0, 3).toUpperCase()}-${sz}`,
            color: col.colorName,
            colorName: col.colorName,
            colorHex: col.colorHex || '#000000',
            size: sz,
            sizeName: sz,
            price: salePrice || 799,
            originalPrice: regularPrice || 1299,
            costPrice: costPrice || 350,
            discountPercentage: regularPrice > 0 ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0,
            stock: stockQuantity || 100,
            image: col.mainImage || col.displayImage || col.galleryImages?.[0] || '',
            thumbnail: col.displayImage || col.mainImage || col.galleryImages?.[0] || '',
            galleryImages: col.galleryImages || [],
            barcode: barcode || '890123000000',
            status: 'Active'
          });
        }
      });
    });

    setGeneratedVariants(newVariants);
  }, [colors, salePrice, regularPrice, costPrice, stockQuantity, sku, barcode, editingProductId]);

  // Name change handler auto-slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingProductId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  // Helper read image data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Color Handlers
  const handleAddColor = () => {
    const newColor: ProductColor = {
      id: `col-${Date.now()}`,
      colorName: `New Color ${colors.length + 1}`,
      colorHex: '#000000',
      displayImage: '',
      mainImage: '',
      galleryImages: [],
      sizes: ['S', 'M', 'L', 'XL']
    };
    setColors([...colors, newColor]);
    setActiveColorEditId(newColor.id);
  };

  const handleRemoveColor = (id: string) => {
    if (colors.length <= 1) {
      alert('Product must have at least 1 color.');
      return;
    }
    setColors(colors.filter((c) => c.id !== id));
    if (activeColorEditId === id) {
      setActiveColorEditId(colors.find((c) => c.id !== id)?.id || null);
    }
  };

  const handleUpdateColorField = (id: string, field: keyof ProductColor, value: any) => {
    setColors(colors.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleToggleColorSize = (colorId: string, sizeName: string) => {
    setColors(
      colors.map((c) => {
        if (c.id === colorId) {
          const currentSizes = c.sizes || [];
          const exists = currentSizes.includes(sizeName);
          const updated = exists ? currentSizes.filter((s) => s !== sizeName) : [...currentSizes, sizeName];
          return { ...c, sizes: updated };
        }
        return c;
      })
    );
  };

  // Upload Handlers
  const handleUploadColorMainImage = async (colorId: string, file: File) => {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    handleUpdateColorField(colorId, 'mainImage', dataUrl);
    handleUpdateColorField(colorId, 'displayImage', dataUrl);
  };

  const handleUploadColorGalleryImages = async (colorId: string, files: FileList) => {
    if (!files || files.length === 0) return;
    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const dataUrl = await readFileAsDataURL(files[i]);
      newPhotos.push(dataUrl);
    }
    const color = colors.find((c) => c.id === colorId);
    if (color) {
      const combined = [...(color.galleryImages || []), ...newPhotos];
      const mainImg = combined[0] || '';
      const updatedColors = colors.map((c) =>
        c.id === colorId
          ? { ...c, galleryImages: combined, mainImage: mainImg, displayImage: mainImg }
          : c
      );
      setColors(updatedColors);

      const firstColorFirstImg = updatedColors[0]?.galleryImages?.[0] || updatedColors[0]?.mainImage || '';
      if (firstColorFirstImg) {
        setMainImage(firstColorFirstImg);
      }
    }
  };

  const handleRemoveGalleryImageFromColor = (colorId: string, imgIdx: number) => {
    const color = colors.find((c) => c.id === colorId);
    if (color && color.galleryImages) {
      const updatedGallery = color.galleryImages.filter((_, idx) => idx !== imgIdx);
      const newMain = updatedGallery[0] || '';

      const updatedColors = colors.map((c) => {
        if (c.id === colorId) {
          return {
            ...c,
            galleryImages: updatedGallery,
            mainImage: newMain,
            displayImage: newMain
          };
        }
        return c;
      });

      setColors(updatedColors);

      const firstColorFirstImg = updatedColors[0]?.galleryImages?.[0] || updatedColors[0]?.mainImage || '';
      setMainImage(firstColorFirstImg);
    }
  };

  const handleUploadDescriptionCardImage = async (cardId: string, file: File) => {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setDescriptionCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, image: dataUrl } : c))
    );
  };

  // Variant Field update
  const handleUpdateVariantField = (id: string, field: keyof Variant, value: any) => {
    setGeneratedVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleApplyBulkVariantValues = () => {
    setGeneratedVariants((prev) =>
      prev.map((v) => ({
        ...v,
        price: typeof bulkPriceInput === 'number' && bulkPriceInput > 0 ? bulkPriceInput : v.price,
        originalPrice: typeof bulkMrpInput === 'number' && bulkMrpInput > 0 ? bulkMrpInput : v.originalPrice,
        stock: typeof bulkStockInput === 'number' && bulkStockInput >= 0 ? bulkStockInput : v.stock
      }))
    );
    setBulkPriceInput('');
    setBulkMrpInput('');
    setBulkStockInput('');
  };

  // Inline Size Guide Save
  const handleSaveInlineSizeGuide = async () => {
    if (!newGuideTitle.trim()) {
      alert('Please enter Size Guide title.');
      return;
    }

    const createdGuide: SizeGuide = {
      id: `sg-${Date.now()}`,
      title: newGuideTitle.trim(),
      description: newGuideDesc.trim() || 'Custom Size Guide',
      categoryIds: newGuideCategories,
      subcategoryIds: [],
      countries: [
        { id: 'c1', name: 'India', code: 'IN', displayOrder: 1 },
        { id: 'c2', name: 'United States', code: 'US', displayOrder: 2 }
      ],
      columns: [
        { id: 'col1', key: 'brandSize', name: 'Brand Size', displayOrder: 1 },
        { id: 'col2', key: 'bust', name: 'Bust / Chest', displayOrder: 2 },
        { id: 'col3', key: 'waist', name: 'Waist', displayOrder: 3 }
      ],
      rows: [
        {
          id: 'r1',
          brandSize: 'S',
          displayOrder: 1,
          values: { bust: { cm: '81-86', inch: '32-34' }, waist: { cm: '66-71', inch: '26-28' } }
        },
        {
          id: 'r2',
          brandSize: 'M',
          displayOrder: 2,
          values: { bust: { cm: '86-91', inch: '34-36' }, waist: { cm: '71-76', inch: '28-30' } }
        }
      ]
    };

    const saved = await AdminApiService.createSizeGuide(createdGuide);
    if (saved) {
      setSizeGuidesList([...sizeGuidesList, saved]);
      setSelectedSizeGuideId(saved.id);
    } else {
      setSizeGuidesList([...sizeGuidesList, createdGuide]);
      setSelectedSizeGuideId(createdGuide.id);
    }

    setShowCreateSizeGuideModal(false);
    setNewGuideTitle('');
    setNewGuideDesc('');
  };

  // Save Product Handler
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter product name.');
      return;
    }

    // Merge colors with colorMediaConfigs so images uploaded in ColorGallerySection are 100% saved into colors and variants
    const mergedColors: ProductColor[] = (colors.length > 0 ? colors : colorMediaConfigs.map((cm, idx) => ({
      id: cm.colorValueId || `col-${idx + 1}`,
      colorName: cm.colorName,
      colorHex: cm.colorCode || '#000000',
      displayImage: cm.mainImage || '',
      mainImage: cm.mainImage || '',
      galleryImages: cm.gallery || [],
      sizes: ['Standard']
    }))).map((col) => {
      const matchMedia = colorMediaConfigs.find((cm) => (cm.colorName || '').toLowerCase() === (col.colorName || '').toLowerCase());
      if (matchMedia) {
        const cMain = matchMedia.mainImage || col.mainImage || col.displayImage || '';
        const cGal = (matchMedia.gallery && matchMedia.gallery.length > 0) ? matchMedia.gallery : (col.galleryImages || []);
        return {
          ...col,
          mainImage: cMain,
          displayImage: cMain,
          galleryImages: cGal
        };
      }
      return col;
    });

    // Also add any color present in colorMediaConfigs that wasn't in colors
    colorMediaConfigs.forEach((cm) => {
      const exists = mergedColors.some((c) => (c.colorName || '').toLowerCase() === (cm.colorName || '').toLowerCase());
      if (!exists && cm.colorName) {
        mergedColors.push({
          id: cm.colorValueId || `col-${cm.colorName.toLowerCase().replace(/\s+/g, '-')}`,
          colorName: cm.colorName,
          colorHex: cm.colorCode || '#000000',
          displayImage: cm.mainImage || '',
          mainImage: cm.mainImage || '',
          galleryImages: cm.gallery || [],
          sizes: ['Standard']
        });
      }
    });

    let finalVariants = (generatedVariants.length > 0 ? generatedVariants : []).map((v) => {
      const matchingMedia = colorMediaConfigs.find((cm) => (cm.colorName || '').toLowerCase() === (v.color || v.colorName || '').toLowerCase());
      const matchingCol = mergedColors.find((c) => (c.colorName || '').toLowerCase() === (v.color || v.colorName || '').toLowerCase());
      const vImg = matchingMedia?.mainImage || matchingCol?.mainImage || matchingCol?.displayImage || v.image || '';
      const vGal = (matchingMedia?.gallery && matchingMedia.gallery.length > 0) ? matchingMedia.gallery : (matchingCol?.galleryImages || v.galleryImages || []);
      return {
        ...v,
        image: vImg,
        thumbnail: vImg,
        galleryImages: vGal
      };
    });

    if (finalVariants.length === 0 && mergedColors.length > 0) {
      finalVariants = [];
      mergedColors.forEach((col) => {
        const colSizes = col.sizes && col.sizes.length > 0 ? col.sizes : ['Standard'];
        colSizes.forEach((sz) => {
          finalVariants.push({
            id: `v-${col.colorName}-${sz}-${Date.now()}`,
            sku: `${sku || 'AWH'}-${col.colorName.substring(0, 3).toUpperCase()}-${sz}-${Math.floor(100 + Math.random() * 900)}`,
            color: col.colorName,
            colorName: col.colorName,
            colorHex: col.colorHex || '#000000',
            size: sz,
            sizeName: sz,
            price: salePrice || 799,
            originalPrice: regularPrice || 1299,
            costPrice: costPrice || 350,
            discountPercentage: regularPrice > 0 ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0,
            stock: stockQuantity || 100,
            image: col.mainImage || col.displayImage || col.galleryImages?.[0] || '',
            thumbnail: col.displayImage || col.mainImage || col.galleryImages?.[0] || '',
            galleryImages: col.galleryImages || [],
            barcode: barcode || '890123000000',
            status: 'Active'
          });
        });
      });
    }

    const firstColorMain = colorMediaConfigs[0]?.mainImage || mergedColors[0]?.mainImage || mergedColors[0]?.displayImage || mergedColors[0]?.galleryImages?.[0];
    const primaryImage = mainImage || firstColorMain || galleryImages[0] || '/images/category/Latkan.webp';
    const allColorGalleryImages = [
      ...mergedColors.flatMap((c) => c.galleryImages || []),
      ...colorMediaConfigs.flatMap((c) => c.gallery || [])
    ];
    const combinedGallery = Array.from(new Set([primaryImage, ...galleryImages, ...allColorGalleryImages])).filter(Boolean);

    const newProductObj: Product = {
      id: editingProductId || `prod-${Date.now()}`,
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      sku: sku || 'AWH-SKU-NEW',
      category: selectedCategories[0] || 'Latkan',
      categories: selectedCategories,
      subcategory: selectedSubcategory,
      brand: brand || 'Awesome Handmade',
      collections: selectedCollections,
      tags: selectedTags,
      price: salePrice,
      originalPrice: regularPrice,
      costPrice: costPrice,
      stock: stockQuantity,
      rating: 4.8,
      salesCount: 0,
      status: isPublished ? 'Published' : 'Draft',
      isPublished: isPublished,
      type: productType,
      shortDescription: shortDescription,
      fullDescription: fullDescription,
      image: primaryImage,
      mainImage: primaryImage,
      galleryImages: combinedGallery,
      images: combinedGallery,
      colors: mergedColors,
      colorMediaConfigs: colorMediaConfigs,
      productType: productType === 'Simple' ? 'simple' : 'variant',
      sizeGuideId: selectedSizeGuideId,
      inventory: {
        sku: sku,
        barcode: barcode,
        stock: stockQuantity,
        lowStockAlert: lowStockAlert,
        allowBackorders: allowBackorders,
        trackInventory: trackInventory
      },
      attributes: [
        { name: 'Color', values: mergedColors.map((c) => c.colorName) },
        { name: 'Size', values: Array.from(new Set(mergedColors.flatMap((c) => c.sizes || []))) }
      ],
      productAttributes: productAttributes,
      variants: finalVariants,
      descriptionCards: descriptionCards,
      highlights: highlights,
      washingInstructions: washingInstructions,
      manufacturingInfo: manufacturingInfo,
      idealForPills: idealForPills,
      shipping: { weight, length, width, height },
      seo: { metaTitle, metaDescription, keywords, canonicalUrl },
      sizeChart: sizeChart,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (editingProductId) {
      await AdminApiService.updateProduct(editingProductId, newProductObj);
    } else {
      await AdminApiService.createProduct(newProductObj);
    }

    broadcastAdminProductChange(newProductObj);
    setSubmitSuccess(true);

    setTimeout(() => {
      onNavigate('all-products');
    }, 1200);
  };

  const currentMainCategory = selectedCategories[0] || categoriesData.mainCategories[0]?.name || 'Latkan';

  return (
    <form onSubmit={handleSubmitProduct} className="max-w-full mx-auto space-y-6 pb-24 font-sans selection:bg-black selection:text-white">
      {/* SUCCESS BANNER */}
      {submitSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Product saved successfully! Redirecting to products list...</span>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigate('products')}
            className="text-xs text-black border-neutral-200 hover:bg-neutral-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-lg font-bold text-black tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-black" />
              <span>{editingProductId ? `Edit Product: ${name}` : 'Create New Product'}</span>
            </h1>
            <p className="text-xs text-neutral-500 font-normal mt-0.5">
              Configure product details, color swatches, size options, and size guide.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-6 py-2 rounded-md shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{editingProductId ? 'Update Product' : 'Save Product'}</span>
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT ARCHITECTURE SELECTOR */}
      {/* ========================================================================= */}
      <Card className="p-5 bg-white border border-neutral-200 shadow-2xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-black uppercase tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-black" />
            <span>Product Architecture Type</span>
          </h3>
          <p className="text-xs text-neutral-500 font-normal mt-0.5">
            Choose whether this is a simple single-option product or has dynamic attributes &amp; variants.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-neutral-100 rounded-xl">
          <button
            type="button"
            onClick={() => setProductType('Simple')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              productType === 'Simple'
                ? 'bg-black text-white shadow-2xs'
                : 'text-neutral-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Simple Product
          </button>
          <button
            type="button"
            onClick={() => setProductType('Variable')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              productType === 'Variable'
                ? 'bg-black text-white shadow-2xs'
                : 'text-neutral-600 hover:text-black hover:bg-white/60'
            }`}
          >
            Product with Variants
          </button>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 🌟 1-CLICK AI PRODUCT AUTO-FILL WIDGET                                    */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-7 bg-gradient-to-br from-[#FFFDF9] via-white to-[#FAF6EE] border-2 border-amber-300/80 shadow-md rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-200/60 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-amber-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
                  1-Click AI Auto-Fill from Product Image
                </h2>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-semibold text-[10px] uppercase px-2 py-0.5">
                  AI Powered
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                Simply upload a photo. The AI recognizes your product, crafts the title, generates rich descriptions, categories, pricing, tags, story cards &amp; SEO in 1 click!
              </p>
            </div>
          </div>
        </div>

        {/* AI SUCCESS NOTIFICATION */}
        {aiSuccessMessage && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{aiSuccessMessage}</span>
          </div>
        )}

        {/* AI ERROR NOTIFICATION */}
        {aiErrorMessage && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{aiErrorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* IMAGE DROPZONE / PICKER */}
          <div className="md:col-span-4">
            <label className="relative flex flex-col items-center justify-center w-full aspect-[4/3] rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 transition-all cursor-pointer overflow-hidden group">
              {aiImagePreview || mainImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={aiImagePreview || mainImage}
                    alt="AI Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium gap-1">
                    <UploadCloud className="w-5 h-5" />
                    <span>Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-neutral-800">Upload Product Image</span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">PNG, JPG, WEBP</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAiImageUpload}
                disabled={isGeneratingAi}
                className="hidden"
              />
            </label>
          </div>

          {/* AI CONTROLS & HINT INPUT */}
          <div className="md:col-span-8 flex flex-col gap-3 justify-center">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Optional Artisan Hint / Specific Note:
              </label>
              <Input
                type="text"
                value={aiHint}
                onChange={(e) => setAiHint(e.target.value)}
                placeholder="e.g. Royal Blue Saree Tassel with mirrors, or Kids festive choli for Navratri..."
                disabled={isGeneratingAi}
                className="text-xs bg-white border-neutral-300 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                type="button"
                onClick={() => handleAiAutoFill()}
                disabled={isGeneratingAi || (!aiImagePreview && !mainImage)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Image &amp; Writing Details...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-200" />
                    <span>✨ Auto-Fill All Product Details with AI</span>
                  </>
                )}
              </Button>

              {(aiImagePreview || mainImage) && (
                <button
                  type="button"
                  onClick={() => {
                    setAiImagePreview('');
                    setAiSuccessMessage('');
                    setAiErrorMessage('');
                  }}
                  disabled={isGeneratingAi}
                  className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
                >
                  Clear image
                </button>
              )}
            </div>

            <p className="text-[11px] text-neutral-500 italic">
              💡 Tip: Click the button above to auto-fill the entire product form instantly. You can review and tweak any field before saving!
            </p>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* CARD 1: BASIC INFORMATION */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl space-y-6">
        <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
          <FolderTree className="w-4 h-4 text-black shrink-0" />
          <h2 className="text-sm font-bold text-black tracking-tight uppercase">Basic Product Information</h2>
        </div>

        <div className="space-y-4 text-xs">
          {/* PRODUCT NAME */}
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              Product Title *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Ultra-Soft Wireless Padded Contour Bralette"
              value={name}
              onChange={handleNameChange}
              className="bg-white border-neutral-200 text-xs font-medium text-black"
            />
          </div>

          {/* URL SLUG */}
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              URL Slug (Auto-generated)
            </label>
            <div className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-xs font-mono">
              <span className="text-neutral-400 text-[11px]">/product/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-transparent text-black font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* CATEGORIES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Main Category *
              </label>
              <Select
                value={currentMainCategory}
                onValueChange={(val) => {
                  setSelectedCategories([val]);
                  const matchingSub = categoriesData.subcategories.find(
                    (s: any) => s.parentName?.toLowerCase() === val.toLowerCase() ||
                                s.parentId === categoriesData.mainCategories.find((c: any) => c.name.toLowerCase() === val.toLowerCase())?.id
                  );
                  setSelectedSubcategory(matchingSub ? matchingSub.name : 'General');
                }}
                options={categoriesData.mainCategories.map((cat: any) => ({ value: cat.name, label: cat.name }))}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Subcategory *
              </label>
              <Select
                value={selectedSubcategory || 'General'}
                onValueChange={(val) => setSelectedSubcategory(val)}
                options={(() => {
                  const filtered = categoriesData.subcategories.filter(
                    (s: any) => s.parentName?.toLowerCase() === currentMainCategory.toLowerCase() ||
                                s.parentId === categoriesData.mainCategories.find((c: any) => c.name.toLowerCase() === currentMainCategory.toLowerCase())?.id
                  );
                  if (filtered.length > 0) {
                    return filtered.map((sub: any) => ({ value: sub.name, label: sub.name }));
                  }
                  return [{ value: 'General', label: 'General' }, ...categoriesData.subcategories.map((sub: any) => ({ value: sub.name, label: sub.name }))];
                })()}
              />
            </div>
          </div>

          {/* SKU & PRODUCT TYPE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Base SKU *
              </label>
              <Input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="bg-white border-neutral-200 text-xs font-mono font-semibold text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Product Type *
              </label>
              <Select
                value={productType}
                onValueChange={(val) => setProductType(val as any)}
                options={[
                  { value: 'Variable', label: 'Variable (Multiple Colors & Sizes)' },
                  { value: 'Simple', label: 'Simple (Single Option Product)' }
                ]}
              />
            </div>
          </div>

          {/* SHORT & FULL DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              Short Summary Description
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief 1-2 sentence description shown in quick view..."
              className="w-full bg-white text-xs font-normal text-black p-3 rounded-lg border border-neutral-200 focus:outline-none focus:border-black transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              Detailed Product Description
            </label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed description, fabric blend composition, care details..."
              className="w-full bg-white text-xs font-normal text-black p-3 rounded-lg border border-neutral-200 focus:outline-none focus:border-black transition-all"
            />
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* SIMPLE PRODUCT PRICING & STOCK (Only when productType === 'Simple') */}
      {/* ========================================================================= */}
      {productType === 'Simple' && (
        <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <DollarSign className="w-4 h-4 text-black shrink-0" />
            <h2 className="text-sm font-bold text-black tracking-tight uppercase">
              2. Simple Product Pricing &amp; Stock Setup
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Sale Price (₹) *
              </label>
              <Input
                type="number"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="bg-white border-neutral-200 text-xs font-bold text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Regular MRP (₹)
              </label>
              <Input
                type="number"
                value={regularPrice}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="bg-white border-neutral-200 text-xs font-bold text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Cost Price (₹)
              </label>
              <Input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="bg-white border-neutral-200 text-xs font-bold text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                Stock Quantity *
              </label>
              <Input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="bg-white border-neutral-200 text-xs font-bold text-black"
              />
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT ATTRIBUTES & VARIANT DYNAMIC CONFIGURATION (Simple & Variable) */}
      {/* ========================================================================= */}
      <ProductAttributeSection
        value={productAttributes}
        onChange={setProductAttributes}
      />

      <ColorGallerySection
        productAttributes={productAttributes}
        colorMediaConfigs={colorMediaConfigs}
        onChangeColorMediaConfigs={setColorMediaConfigs}
        colors={colors}
        onSyncRootMedia={(main, gal) => {
          if (main) {
            setMainImage(main);
            setAiImagePreview(main);
          }
          if (gal && gal.length > 0) {
            setGalleryImages(gal);
          }
        }}
      />

      <VariantGeneratorSection
        productAttributes={productAttributes}
        variants={generatedVariants as any[]}
        onChangeVariants={(vars) => setGeneratedVariants(vars as any[])}
        baseSku={sku}
        defaultPrice={salePrice}
        defaultMrp={regularPrice}
        defaultStock={stockQuantity}
      />

      <ProductSizeChartSection
        productAttributes={productAttributes}
        sizeChart={sizeChart}
        onChangeSizeChart={setSizeChart}
      />

      {/* ========================================================================= */}
      {/* CARD 3: CATEGORY SIZE GUIDE */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-4 h-4 text-black shrink-0" />
            <h2 className="text-sm font-bold text-black tracking-tight uppercase">Size Guide Assignment</h2>
          </div>

          <Button
            type="button"
            onClick={() => setShowCreateSizeGuideModal(true)}
            variant="outline"
            size="sm"
            className="text-xs text-black border-neutral-200 hover:bg-neutral-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Size Guide</span>
          </Button>
        </div>

        <div>
          <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
            Assigned Category Size Guide
          </label>
          <Select
            value={selectedSizeGuideId || ''}
            onValueChange={setSelectedSizeGuideId}
            options={[
              { value: '', label: '-- No Size Guide Assigned --' },
              ...sizeGuidesList.map((g) => ({
                value: g.id,
                label: `${g.title} (${(g.categoryIds || []).join(', ')})`
              }))
            ]}
          />
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* CARD 5: DYNAMIC DESCRIPTION CARDS */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-black shrink-0" />
            <h2 className="text-sm font-bold text-black tracking-tight uppercase">Product Description Feature Cards</h2>
          </div>

          <Button
            type="button"
            onClick={() => {
              const newCard: ProductDescriptionCard = {
                id: `card-${Date.now()}`,
                title: 'New Feature Card',
                description: 'Card details...',
                image: '',
                sortOrder: descriptionCards.length + 1
              };
              setDescriptionCards([...descriptionCards, newCard]);
            }}
            variant="outline"
            size="sm"
            className="text-xs text-black border-neutral-200 hover:bg-neutral-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </Button>
        </div>

        <div className="space-y-4">
          {descriptionCards.map((card, idx) => (
            <div key={card.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">Feature Card #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => setDescriptionCards(descriptionCards.filter((c) => c.id !== card.id))}
                  className="text-xs text-neutral-400 hover:text-red-600 font-medium cursor-pointer"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Title</label>
                  <Input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDescriptionCards(descriptionCards.map((c) => (c.id === card.id ? { ...c, title: val } : c)));
                    }}
                    className="bg-white border-neutral-200 text-xs font-semibold text-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Assign Color</label>
                  <Select
                    value={card.colorName || 'All'}
                    onValueChange={(val) => {
                      setDescriptionCards(descriptionCards.map((c) => (c.id === card.id ? { ...c, colorName: val } : c)));
                    }}
                    options={[
                      { value: 'All', label: '✨ All Colors (General)' },
                      ...colors.map((c) => ({ value: c.colorName, label: `🎨 ${c.colorName}` })),
                      ...colorMediaConfigs.map((c) => ({ value: c.colorName, label: `🎨 ${c.colorName}` }))
                    ].filter((opt, idx, self) => self.findIndex((o) => o.value === opt.value) === idx)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Feature Image</label>
                  <div className="flex items-center gap-2.5">
                    {card.image ? (
                      <div className="relative group shrink-0">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-12 h-14 object-cover rounded-lg border border-neutral-200 bg-white shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setDescriptionCards((prev) =>
                              prev.map((c) => (c.id === card.id ? { ...c, image: '' } : c))
                            );
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-xs transition-all cursor-pointer z-10"
                          title="Remove image"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : null}

                    <label className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-md shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 h-9">
                      <Upload className="w-3.5 h-3.5 text-white" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleUploadDescriptionCardImage(card.id, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={card.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDescriptionCards(descriptionCards.map((c) => (c.id === card.id ? { ...c, description: val } : c)));
                  }}
                  className="w-full bg-white text-xs font-normal text-black p-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* INLINE CREATE SIZE GUIDE MODAL */}
      {/* ========================================================================= */}
      {showCreateSizeGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-neutral-200 p-6 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-black text-sm flex items-center gap-2">
                <Ruler className="w-4 h-4 text-black" />
                <span>Create Category Size Guide</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateSizeGuideModal(false)}
                className="text-neutral-400 hover:text-black font-bold text-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-black mb-1">Title *</label>
                <Input
                  type="text"
                  placeholder="e.g. Women's Bra & Bralette Size Guide"
                  value={newGuideTitle}
                  onChange={(e) => setNewGuideTitle(e.target.value)}
                  className="bg-white border-neutral-200 text-xs font-semibold text-black"
                />
              </div>

              <div>
                <label className="block font-bold text-black mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Measurement guidance details..."
                  value={newGuideDesc}
                  onChange={(e) => setNewGuideDesc(e.target.value)}
                  className="w-full bg-white text-xs font-normal text-black p-2.5 rounded-lg border border-neutral-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateSizeGuideModal(false)}
                className="text-xs border-neutral-200 text-neutral-700"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSaveInlineSizeGuide}
                className="bg-black text-white hover:bg-neutral-800 text-xs font-semibold"
              >
                Save Size Guide
              </Button>
            </div>
          </Card>
        </div>
      )}
    </form>
  );
};

export default ProductCreatePage;
