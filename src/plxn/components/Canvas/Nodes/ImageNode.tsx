import React, { useState } from 'react';
import { NodeItem } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { Image as ImageIcon, Upload, Link2 } from 'lucide-react';

interface ImageNodeProps {
  node: NodeItem;
}

const PRESET_IMAGES = [
  { label: 'Minimal Architecture', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Modern Workspace', url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80' },
  { label: 'Abstract Geometry', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { label: 'Studio Travertine', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80' },
];

export const ImageNode: React.FC<ImageNodeProps> = ({ node }) => {
  const { updateNode } = useProjectContext();
  const [imgError, setImgError] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { caption: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgError(false);
    updateNode(node.id, { imageUrl: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImgError(false);
          updateNode(node.id, { imageUrl: result }, true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Title */}
      <input
        type="text"
        value={node.title}
        onChange={handleTitleChange}
        placeholder="Image caption / title..."
        className="w-full bg-transparent font-medium text-sm text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none focus:bg-[var(--lime)]/15 rounded-sm px-1 -mx-1 transition-colors"
      />

      {/* Image Preview Container */}
      <div className="relative aspect-video w-full rounded-none overflow-hidden bg-[#ECE6D6] dark:bg-[#2A2720] border-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 flex items-center justify-center">
        {node.imageUrl && !imgError ? (
          <img
            src={node.imageUrl}
            alt={node.caption || node.title || 'Canvas attachment'}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-[#6B6356] dark:text-[#A39B8B] p-4 text-center">
            <ImageIcon className="w-8 h-8 opacity-60" />
            <span className="text-xs font-medium">
              {imgError ? 'Image failed to load' : 'No image attached'}
            </span>
            <span className="text-[10px] text-[#6B6356] dark:text-[#A39B8B] font-mono tracking-tight uppercase">Paste URL or upload below</span>
          </div>
        )}
      </div>

      {/* Controls: URL Input & File Upload */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="flex-1 flex items-center gap-1 px-2 py-1 bg-[#1A1814]/[0.03] dark:bg-[#F2EEE2]/[0.04] rounded-none border-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10">
            <Link2 className="w-3 h-3 text-[#6B6356] dark:text-[#A39B8B] shrink-0" />
            <input
              type="text"
              value={node.imageUrl || ''}
              onChange={handleUrlChange}
              placeholder="Paste image URL..."
              className="w-full bg-transparent text-[11px] text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none font-mono truncate"
            />
          </div>

          <label
            className="brut-xs rounded-none cursor-pointer p-1.5 bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[var(--lime)] hover:text-[#1A1814] dark:hover:text-[#1A1814] shrink-0 transition-colors"
            title="Upload local image"
          >
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Quick Presets Toggle */}
        <div className="pt-0.5">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-[10px] font-mono tracking-tight uppercase text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2] underline underline-offset-2 transition-colors"
          >
            {showPresets ? 'Hide presets' : 'Select sample photo preset'}
          </button>

          {showPresets && (
            <div className="grid grid-cols-2 gap-1 pt-1.5">
              {PRESET_IMAGES.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setImgError(false);
                    updateNode(node.id, { imageUrl: p.url }, true);
                    setShowPresets(false);
                  }}
                  className="brut-xs rounded-none text-left text-[10px] px-1.5 py-1 bg-[#FBF8F1] dark:bg-[#1F1D17] hover:bg-[var(--lime)]/20 text-[#1A1814] dark:text-[#F2EEE2] truncate transition-colors font-mono tracking-tight"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Caption */}
        <input
          type="text"
          value={node.caption || ''}
          onChange={handleCaptionChange}
          placeholder="Optional caption..."
          className="w-full bg-transparent text-[11px] text-[#6B6356] dark:text-[#A39B8B] italic placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none focus:bg-[var(--lime)]/10 rounded-sm px-1 transition-colors"
        />
      </div>
    </div>
  );
};
