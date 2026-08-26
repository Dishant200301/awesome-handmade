import React, { useState } from 'react';
import { ProductAttributeAssignment, ColorMediaConfig } from '../types/attribute.types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Palette, Plus, Trash2, Image as ImageIcon, Upload, UploadCloud } from 'lucide-react';

interface ColorGallerySectionProps {
  productAttributes: ProductAttributeAssignment[];
  colorMediaConfigs: ColorMediaConfig[];
  onChangeColorMediaConfigs: (configs: ColorMediaConfig[]) => void;
}

export const ColorGallerySection: React.FC<ColorGallerySectionProps> = ({
  productAttributes = [],
  colorMediaConfigs = [],
  onChangeColorMediaConfigs
}) => {
  // Find attribute representing Color
  const colorAttr = productAttributes.find(
    (pa) =>
      pa.attributeName.toLowerCase() === 'color' ||
      pa.attributeSlug.toLowerCase() === 'color' ||
      pa.type === 'SWATCH'
  );

  if (!colorAttr || !colorAttr.selectedValues || colorAttr.selectedValues.length === 0) {
    return null; // Don't show unless Color is assigned with selected values
  }

  const selectedColors = colorAttr.selectedValues;

  // Sync / Ensure each selected color has a ColorMediaConfig object
  const activeMediaConfigs = selectedColors.map((colorName) => {
    const existing = colorMediaConfigs.find(
      (c) => c.colorName.toLowerCase() === colorName.toLowerCase()
    );
    if (existing) return existing;
    return {
      colorValueId: `col-${colorName.toLowerCase()}`,
      colorName,
      mainImage: '',
      gallery: []
    };
  });

  const handleUpdateField = (colorName: string, field: keyof ColorMediaConfig, value: any) => {
    const updated = activeMediaConfigs.map((c) =>
      c.colorName.toLowerCase() === colorName.toLowerCase() ? { ...c, [field]: value } : c
    );
    onChangeColorMediaConfigs(updated);
  };

  const handleUpdateMainImage = (colorName: string, mainImage: string) => {
    handleUpdateField(colorName, 'mainImage', mainImage);
  };

  const handleAddGalleryImage = (colorName: string, imageUrl: string) => {
    if (!imageUrl.trim()) return;
    const updated = activeMediaConfigs.map((c) => {
      if (c.colorName.toLowerCase() === colorName.toLowerCase()) {
        const nextGallery = [...(c.gallery || []), imageUrl.trim()];
        return { ...c, gallery: nextGallery };
      }
      return c;
    });
    onChangeColorMediaConfigs(updated);
  };

  const handleAddMultipleGalleryImages = (colorName: string, imageUrls: string[]) => {
    if (!imageUrls || imageUrls.length === 0) return;
    const updated = activeMediaConfigs.map((c) => {
      if (c.colorName.toLowerCase() === colorName.toLowerCase()) {
        const nextGallery = [...(c.gallery || []), ...imageUrls];
        return { ...c, gallery: nextGallery };
      }
      return c;
    });
    onChangeColorMediaConfigs(updated);
  };

  const handleRemoveGalleryImage = (colorName: string, index: number) => {
    const updated = activeMediaConfigs.map((c) => {
      if (c.colorName.toLowerCase() === colorName.toLowerCase()) {
        const nextGallery = (c.gallery || []).filter((_, i) => i !== index);
        return { ...c, gallery: nextGallery };
      }
      return c;
    });
    onChangeColorMediaConfigs(updated);
  };

  return (
    <Card className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-2xs rounded-xl space-y-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Palette className="w-4 h-4 text-black shrink-0" />
            <h2 className="text-sm font-bold text-black tracking-tight uppercase">Color Specific Customization (Title, Media &amp; Description)</h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal mt-0.5">
            Configure color-specific Title, Main Image, Gallery Images, and Description Info for each color.
          </p>
        </div>
      </div>

      {/* COLOR MEDIA CARDS LIST */}
      <div className="space-y-6">
        {activeMediaConfigs.map((config) => (
          <ColorMediaCard
            key={config.colorName}
            config={config}
            onUpdateTitle={(title) => handleUpdateField(config.colorName, 'title', title)}
            onUpdateProductInfo={(info) => handleUpdateField(config.colorName, 'productInfo', info)}
            onUpdateMainImage={(img) => handleUpdateMainImage(config.colorName, img)}
            onAddGalleryImage={(img) => handleAddGalleryImage(config.colorName, img)}
            onAddMultipleGalleryImages={(imgs) => handleAddMultipleGalleryImages(config.colorName, imgs)}
            onRemoveGalleryImage={(idx) => handleRemoveGalleryImage(config.colorName, idx)}
          />
        ))}
      </div>
    </Card>
  );
};

interface ColorMediaCardProps {
  config: ColorMediaConfig;
  onUpdateTitle: (title: string) => void;
  onUpdateProductInfo: (productInfo: string) => void;
  onUpdateMainImage: (mainImage: string) => void;
  onAddGalleryImage: (imageUrl: string) => void;
  onAddMultipleGalleryImages: (imageUrls: string[]) => void;
  onRemoveGalleryImage: (index: number) => void;
}

const ColorMediaCard: React.FC<ColorMediaCardProps> = ({
  config,
  onUpdateTitle,
  onUpdateProductInfo,
  onUpdateMainImage,
  onAddGalleryImage,
  onAddMultipleGalleryImages,
  onRemoveGalleryImage
}) => {
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const handleAddUrlImage = () => {
    if (!newGalleryUrl.trim()) return;
    onAddGalleryImage(newGalleryUrl);
    setNewGalleryUrl('');
  };

  const handleUploadMainFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateMainImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleUploadGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readPromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    const dataUrls = await Promise.all(readPromises);
    if (dataUrls.length > 0) {
      onAddMultipleGalleryImages(dataUrls);
    }
    e.target.value = '';
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-6 font-sans">
      {/* COLOR HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-5 h-5 rounded-full border border-neutral-300 shadow-2xs shrink-0"
            style={{
              backgroundColor:
                config.colorName.toLowerCase() === 'white'
                  ? '#FFFFFF'
                  : config.colorName.toLowerCase() === 'black'
                  ? '#000000'
                  : config.colorName.toLowerCase() === 'beige'
                  ? '#E8D3C3'
                  : config.colorName.toLowerCase() === 'red'
                  ? '#FF0000'
                  : config.colorName.toLowerCase() === 'blue' || config.colorName.toLowerCase() === 'denim blue'
                  ? '#3B5998'
                  : '#888888'
            }}
          />
          <h3 className="font-extrabold text-black text-sm uppercase tracking-wide">
            Color: <span className="text-black font-black">{config.colorName}</span>
          </h3>
        </div>
      </div>

      {/* COLOR SPECIFIC TITLE & DESCRIPTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-black uppercase tracking-wider">
            Color Specific Title ({config.colorName})
          </label>
          <Input
            type="text"
            placeholder={`e.g. Aaramly Seamless Bralette - ${config.colorName} Edition`}
            value={config.title || ''}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="bg-white border-neutral-200 text-xs font-semibold text-black"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-black uppercase tracking-wider">
            Color Specific Product Info / Description
          </label>
          <Input
            type="text"
            placeholder={`Custom description details for ${config.colorName}...`}
            value={config.productInfo || ''}
            onChange={(e) => onUpdateProductInfo(e.target.value)}
            className="bg-white border-neutral-200 text-xs font-medium text-black"
          />
        </div>
      </div>

      {/* SECTION 1: MAIN COVER IMAGE & LIVE PREVIEW */}
      <div className="space-y-2 pt-2 border-t border-neutral-200/70">
        <label className="block text-xs font-bold text-black uppercase tracking-wider">
          1. Main Cover Image for {config.colorName} *
        </label>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-white p-4 rounded-xl border border-neutral-200">
          {/* UPLOAD & URL CONTROLS */}
          <div className="md:col-span-3 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0 active:scale-95">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Upload Main Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadMainFile}
                />
              </label>

              <span className="text-xs font-bold text-neutral-400">OR</span>

              <Input
                type="text"
                placeholder="Paste image URL link here..."
                value={config.mainImage}
                onChange={(e) => onUpdateMainImage(e.target.value)}
                className="bg-neutral-50 border-neutral-200 text-xs font-medium text-black flex-1 min-w-[220px]"
              />
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">
              This image will serve as the primary cover photo for the <span className="font-bold text-black">{config.colorName}</span> swatch.
            </p>
          </div>

          {/* PROMINENT MAIN IMAGE PREVIEW BOX */}
          <div className="flex flex-col items-center justify-center space-y-1.5 border-l border-neutral-100 pl-0 md:pl-4">
            <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">Main Image Preview</span>
            {config.mainImage ? (
              <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm group">
                <img src={config.mainImage} alt={config.colorName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onUpdateMainImage('')}
                    className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-xs"
                    title="Remove Main Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-24 h-32 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
                <ImageIcon className="w-7 h-7 mb-1 stroke-1" />
                <span className="text-[10px] font-semibold">No Image</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: MULTIPLE COLOR GALLERY IMAGES */}
      <div className="space-y-3 pt-3 border-t border-neutral-200/70">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-black uppercase tracking-wider">
            2. {config.colorName} Color Gallery ({config.gallery ? config.gallery.length : 0} Images Selected)
          </label>
        </div>

        {/* MULTIPLE IMAGE UPLOAD DROPZONE / CONTROL BAR */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* MULTIPLE FILE UPLOAD BUTTON */}
            <label className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0 active:scale-95">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Select Multiple Image Files</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUploadGalleryFiles}
              />
            </label>

            <span className="text-xs font-bold text-neutral-400">OR</span>

            {/* URL INPUT */}
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Input
                type="text"
                placeholder={`Enter gallery image URL for ${config.colorName}...`}
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrlImage();
                  }
                }}
                className="bg-neutral-50 border-neutral-200 text-xs font-medium text-black flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddUrlImage}
                className="bg-neutral-800 hover:bg-black text-white text-xs font-bold px-3.5 h-9 shrink-0 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add URL</span>
              </Button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 font-medium">
            💡 Select multiple images at once (Hold Ctrl or Shift) to populate gallery for <span className="font-bold text-black">{config.colorName}</span>.
          </p>
        </div>

        {/* MULTIPLE GALLERY IMAGES GRID PREVIEW */}
        {config.gallery && config.gallery.length > 0 ? (
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Gallery Thumbnails:</span>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {config.gallery.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-neutral-200 bg-white group shadow-2xs">
                  <img src={imgUrl} alt={`${config.colorName} gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onRemoveGalleryImage(idx)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer shadow-xs"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-2xs">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-neutral-300 bg-white text-center text-neutral-400 text-xs font-medium">
            No gallery images selected for {config.colorName} yet. Click "Select Multiple Image Files" above to add images.
          </div>
        )}
      </div>
    </div>
  );
};
