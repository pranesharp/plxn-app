import React, { useRef, useEffect, useState } from 'react';
import { NodeItem } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { useSafeHover } from '@/plxn/hooks/useSafeHover';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface TextNodeProps {
  node: NodeItem;
}

const FONT_SIZES: Record<NonNullable<NodeItem['fontSize']>, { label: string; class: string; lh: string }> = {
  sm: { label: 'S', class: 'text-sm', lh: 'leading-snug' },
  base: { label: 'M', class: 'text-base', lh: 'leading-relaxed' },
  lg: { label: 'L', class: 'text-xl font-medium', lh: 'leading-snug' },
  xl: { label: 'XL', class: 'text-2xl font-semibold', lh: 'leading-tight' },
  '2xl': { label: '2XL', class: 'text-3xl font-bold', lh: 'leading-tight' },
};

const FONT_FAMILIES: Record<NonNullable<NodeItem['fontFamily']>, { label: string; class: string; styleName: string }> = {
  sans: { label: 'Sans', class: 'font-sans', styleName: 'Clean Sans' },
  serif: { label: 'Serif', class: 'font-serif', styleName: 'Editorial Serif' },
  mono: { label: 'Mono', class: 'font-mono', styleName: 'Code Monospace' },
  handwriting: { label: 'Hand', class: 'italic tracking-wide font-serif', styleName: 'Marker / Hand' },
};

const TEXT_COLORS = [
  { label: 'Default', value: '' },
  { label: 'Ink', value: '#1A1814' },
  { label: 'Red Ink', value: '#D14530' },
  { label: 'Sky', value: '#0284C7' },
  { label: 'Sage', value: '#4A6A0E' },
  { label: 'Amber', value: '#D97706' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Pink', value: '#DB2777' },
];

export const TextNode: React.FC<TextNodeProps> = ({ node }) => {
  const { updateNode, selectedNodeId } = useProjectContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const fontSize = node.fontSize || 'base';
  const fontFamily = node.fontFamily || 'sans';
  const textAlign = node.textAlign || 'left';
  const isBold = !!node.isBold;
  const isItalic = !!node.isItalic;
  const isUnderline = !!node.isUnderline;
  const transparentBg = node.transparentBg !== false;
  const textColor = node.textColor || '';

  const isSelected = selectedNodeId === node.id;

  // Submenu: Color Picker Safe Hover
  const {
    isOpen: isColorPickerOpen,
    open: openColorPicker,
    setIsOpen: setColorPickerOpen,
    triggerProps: colorTriggerProps,
    popupProps: colorPopupProps,
  } = useSafeHover<HTMLButtonElement, HTMLDivElement>({
    delayMs: 350,
  });

  // Main Toolbar Safe Hover (Prediction Cone + Grace Period + Keep Open on Focus/Select)
  const keepToolbarOpen = isFocused || isSelected || isColorPickerOpen;

  const {
    isOpen: isFormatBarOpen,
    open: openFormatBar,
    scheduleClose: scheduleCloseFormatBar,
    triggerProps: formatTriggerProps,
    popupProps: formatPopupProps,
  } = useSafeHover<HTMLDivElement, HTMLDivElement>({
    delayMs: 350,
    keepOpenWhen: keepToolbarOpen,
  });

  // Auto-resize textarea to fit text content smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 40)}px`;
    }
  }, [node.content, fontSize, fontFamily]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, {
      content: e.target.value,
      title: e.target.value.slice(0, 30) || 'Text Box',
    });
  };

  const handleToggleBold = () => {
    updateNode(node.id, { isBold: !isBold }, true);
  };

  const handleToggleItalic = () => {
    updateNode(node.id, { isItalic: !isItalic }, true);
  };

  const handleToggleUnderline = () => {
    updateNode(node.id, { isUnderline: !isUnderline }, true);
  };

  const handleSetFontSize = (size: NonNullable<NodeItem['fontSize']>) => {
    updateNode(node.id, { fontSize: size }, true);
  };

  const handleSetFontFamily = (family: NonNullable<NodeItem['fontFamily']>) => {
    updateNode(node.id, { fontFamily: family }, true);
  };

  const handleSetTextAlign = (align: 'left' | 'center' | 'right') => {
    updateNode(node.id, { textAlign: align }, true);
  };

  const handleToggleFrame = () => {
    updateNode(node.id, { transparentBg: !transparentBg }, true);
  };

  const handleSetTextColor = (color: string) => {
    updateNode(node.id, { textColor: color }, true);
    setColorPickerOpen(false);
  };

  const handleAdjustWidth = (delta: number) => {
    const currentW = node.width || 280;
    const newW = Math.min(Math.max(currentW + delta, 160), 800);
    updateNode(node.id, { width: newW }, true);
  };

  const sizeConfig = FONT_SIZES[fontSize] || FONT_SIZES.base;
  const familyConfig = FONT_FAMILIES[fontFamily] || FONT_FAMILIES.sans;

  const showToolbar = isFormatBarOpen || keepToolbarOpen;

  // Workbench active style: lime tile + ink text on top of .brut-xs (1.5px ink border + hard shadow)
  const activeBtn = 'brut-xs rounded-none bg-[var(--lime)] text-[#1A1814]';
  const idleBtn =
    'rounded-none text-[#6B6356] dark:text-[#A39B8B] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] hover:text-[#1A1814] dark:hover:text-[#F2EEE2]';

  return (
    <div
      ref={formatTriggerProps.ref}
      onMouseEnter={formatTriggerProps.onMouseEnter}
      onMouseLeave={formatTriggerProps.onMouseLeave}
      className="relative group/textnode w-full"
    >
      {/* Floating Micro-Format Toolbar with Amazon Safe Triangle Bridge */}
      <div
        ref={formatPopupProps.ref}
        onMouseEnter={formatPopupProps.onMouseEnter}
        onMouseLeave={formatPopupProps.onMouseLeave}
        onClick={(e) => e.stopPropagation()}
        className={`absolute -top-12 left-0 z-40 flex items-center justify-between gap-1 p-1 bg-[#FBF8F1]/95 dark:bg-[#1F1D17]/95 border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm rounded-none text-xs transition-all duration-150 select-none whitespace-nowrap ${
          /* Safe Triangle Hover Bridge: invisible hit-testing plane spanning the gap between popup and card */
          "before:absolute before:inset-x-0 before:-bottom-3.5 before:h-4 before:content-['']"
        } ${
          showToolbar
            ? 'opacity-100 pointer-events-auto translate-y-0 scale-100'
            : 'opacity-0 pointer-events-none translate-y-1 scale-95'
        }`}
      >
        {/* Font Family Cycle */}
        <div className="flex items-center gap-0.5 border-r-2 border-[#1A1814]/15 dark:border-[#F2EEE2]/15 pr-1">
          {(Object.keys(FONT_FAMILIES) as Array<keyof typeof FONT_FAMILIES>).map((fam) => (
            <button
              key={fam}
              onClick={() => handleSetFontFamily(fam)}
              title={`Font: ${FONT_FAMILIES[fam].styleName}`}
              className={`px-1.5 py-0.5 rounded-none text-[11px] font-medium transition-colors ${
                fontFamily === fam ? activeBtn : idleBtn
              }`}
            >
              {FONT_FAMILIES[fam].label}
            </button>
          ))}
        </div>

        {/* Font Size Buttons */}
        <div className="flex items-center gap-0.5 border-r-2 border-[#1A1814]/15 dark:border-[#F2EEE2]/15 pr-1">
          {(Object.keys(FONT_SIZES) as Array<keyof typeof FONT_SIZES>).map((sz) => (
            <button
              key={sz}
              onClick={() => handleSetFontSize(sz)}
              title={`Size: ${sz}`}
              className={`w-5 h-5 flex items-center justify-center rounded-none text-[10px] font-bold transition-colors ${
                fontSize === sz ? activeBtn : idleBtn
              }`}
            >
              {FONT_SIZES[sz].label}
            </button>
          ))}
        </div>

        {/* Bold / Italic / Underline */}
        <div className="flex items-center gap-0.5 border-r-2 border-[#1A1814]/15 dark:border-[#F2EEE2]/15 pr-1">
          <button
            onClick={handleToggleBold}
            title="Bold"
            className={`p-1 rounded-none transition-colors ${isBold ? activeBtn : idleBtn}`}
          >
            <Bold className="w-3 h-3" />
          </button>
          <button
            onClick={handleToggleItalic}
            title="Italic"
            className={`p-1 rounded-none transition-colors ${isItalic ? activeBtn : idleBtn}`}
          >
            <Italic className="w-3 h-3" />
          </button>
          <button
            onClick={handleToggleUnderline}
            title="Underline"
            className={`p-1 rounded-none transition-colors ${isUnderline ? activeBtn : idleBtn}`}
          >
            <Underline className="w-3 h-3" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 border-r-2 border-[#1A1814]/15 dark:border-[#F2EEE2]/15 pr-1">
          <button
            onClick={() => handleSetTextAlign('left')}
            title="Align Left"
            className={`p-1 rounded-none transition-colors ${textAlign === 'left' ? activeBtn : idleBtn}`}
          >
            <AlignLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSetTextAlign('center')}
            title="Align Center"
            className={`p-1 rounded-none transition-colors ${textAlign === 'center' ? activeBtn : idleBtn}`}
          >
            <AlignCenter className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSetTextAlign('right')}
            title="Align Right"
            className={`p-1 rounded-none transition-colors ${textAlign === 'right' ? activeBtn : idleBtn}`}
          >
            <AlignRight className="w-3 h-3" />
          </button>
        </div>

        {/* Text Color Popover with Safe Triangle Bridge */}
        <div className="relative">
          <button
            ref={colorTriggerProps.ref}
            onMouseEnter={colorTriggerProps.onMouseEnter}
            onMouseLeave={colorTriggerProps.onMouseLeave}
            onClick={() => setColorPickerOpen(!isColorPickerOpen)}
            title="Text Color"
            className="p-1 rounded-none hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2] flex items-center gap-1 transition-colors"
          >
            <Palette className="w-3 h-3" />
            <span
              className="w-2.5 h-2.5 rounded-none border border-[#1A1814]/30 dark:border-[#F2EEE2]/30 shrink-0"
              style={{ backgroundColor: textColor || 'currentColor' }}
            />
          </button>

          {isColorPickerOpen && (
            <div
              ref={colorPopupProps.ref}
              onMouseEnter={colorPopupProps.onMouseEnter}
              onMouseLeave={colorPopupProps.onMouseLeave}
              className={`absolute right-0 top-7 p-1.5 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm rounded-none z-50 flex items-center gap-1.5 ${
                /* Bridge from button down to popup */
                "before:absolute before:inset-x-0 before:-top-2.5 before:h-3 before:content-['']"
              }`}
            >
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => handleSetTextColor(c.value)}
                  title={c.label}
                  className="w-4 h-4 rounded-none border border-[#1A1814]/15 dark:border-[#F2EEE2]/15 hover:scale-125 transition-transform"
                  style={{ backgroundColor: c.value || '#6B6356' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Frame Toggle (Transparent vs Card Box) */}
        <button
          onClick={handleToggleFrame}
          title={transparentBg ? 'Switch to Card Box Frame' : 'Switch to Transparent Floating Text'}
          className={`px-1.5 py-0.5 rounded-none text-[10px] font-bold tracking-tight uppercase transition-colors ${
            !transparentBg
              ? 'bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2]'
              : 'text-[#6B6356] dark:text-[#A39B8B] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] hover:text-[#1A1814] dark:hover:text-[#F2EEE2] border-2 border-transparent'
          }`}
        >
          {transparentBg ? 'Frameless' : 'Framed'}
        </button>

        {/* Width adjustment buttons */}
        <div className="flex items-center gap-0.5 pl-0.5 border-l-2 border-[#1A1814]/15 dark:border-[#F2EEE2]/15">
          <button
            onClick={() => handleAdjustWidth(-40)}
            title="Narrower box"
            className="p-1 rounded-none text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] hover:bg-[var(--lime)]/20 dark:hover:text-[#1A1814] transition-colors"
          >
            <Minimize2 className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => handleAdjustWidth(40)}
            title="Wider box"
            className="p-1 rounded-none text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] hover:bg-[var(--lime)]/20 dark:hover:text-[#1A1814] transition-colors"
          >
            <Maximize2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Main Multi-Line Text Editing Area */}
      <div className="w-full p-1">
        <textarea
          ref={textareaRef}
          value={node.content ?? ''}
          onChange={handleTextChange}
          onFocus={() => {
            setIsFocused(true);
            openFormatBar();
          }}
          onBlur={() => {
            setIsFocused(false);
            scheduleCloseFormatBar();
          }}
          placeholder="Click to type text..."
          style={{
            color: textColor || undefined,
            textAlign,
          }}
          className={`w-full bg-transparent resize-none overflow-hidden focus:outline-none transition-all placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] ${
            sizeConfig.class
          } ${sizeConfig.lh} ${familyConfig.class} ${
            isBold ? 'font-bold' : ''
          } ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''} ${
            !textColor ? 'text-[#1A1814] dark:text-[#F2EEE2]' : ''
          }`}
          rows={1}
        />
      </div>
    </div>
  );
};
