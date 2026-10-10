import React, { useState, useRef, useEffect } from 'react';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { DrawingTool } from '@/plxn/types';
import {
  MousePointer,
  Pencil,
  Eraser,
  Minus,
  MoveUpRight,
  Square,
  Circle,
  Trash2,
  X,
  Palette,
  Check,
  AlertCircle,
  Type
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Charcoal', value: '#18181B' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Graphite', value: '#64748B' },
  { name: 'Crimson', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Highlighter', value: '#EAB308' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Purple', value: '#8B5CF6' },
];

const STROKE_WIDTHS = [
  { label: 'Fine', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Bold', value: 8 },
  { label: 'Marker', value: 14 },
];

// Shared class fragments (Workbench / Atelier Brut)
const DIVIDER_SECTION = 'border-r-2 border-[#1A1814]/15 dark:border-[#F2EEE2]/15';
const INACTIVE_TOOL =
  'border-2 border-transparent text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]';
const ACTIVE_TOOL =
  'bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs rounded-none';

export const DrawingToolbar: React.FC = () => {
  const {
    isDrawMode,
    setIsDrawMode,
    drawingTool,
    setDrawingTool,
    drawingColor,
    setDrawingColor,
    drawingStrokeWidth,
    setDrawingStrokeWidth,
    drawingFill,
    setDrawingFill,
    clearDrawings,
    activeProject,
  } = useProjectContext();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const drawingsCount = activeProject?.drawings?.length || 0;

  // Close confirmation on click outside
  useEffect(() => {
    if (!showClearConfirm) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#clear-drawings-popover')) {
        setShowClearConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showClearConfirm]);

  if (!isDrawMode) return null;

  const handleToolSelect = (tool: DrawingTool) => {
    setDrawingTool(tool);
    setShowClearConfirm(false);
  };

  const handleConfirmClear = () => {
    clearDrawings();
    setShowClearConfirm(false);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex flex-col items-center gap-1.5">
        {/* Main Floating Tool Container — Workbench brut panel, sharp corners */}
        <div className="flex items-center gap-1 p-1.5 bg-[#FBF8F1]/95 dark:bg-[#1F1D17]/95 backdrop-blur-md border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm rounded-none">
          {/* Tool Modes */}
          <div className={`flex items-center gap-0.5 pr-1.5 ${DIVIDER_SECTION}`}>
            <button
              onClick={() => handleToolSelect('select')}
              title="Select (V)"
              className={`p-2 text-xs font-medium transition-colors rounded-none ${
                drawingTool === 'select' ? ACTIVE_TOOL : INACTIVE_TOOL
              }`}
            >
              <MousePointer className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('pen')}
              title="Pen (P)"
              className={`p-2 text-xs font-medium transition-colors rounded-none ${
                drawingTool === 'pen' ? ACTIVE_TOOL : INACTIVE_TOOL
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('eraser')}
              title="Eraser (E)"
              className={`p-2 text-xs font-medium transition-colors rounded-none ${
                drawingTool === 'eraser' ? ACTIVE_TOOL : INACTIVE_TOOL
              }`}
            >
              <Eraser className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-[#1A1814]/15 dark:bg-[#F2EEE2]/15 mx-0.5" />

            {/* Basic Shapes */}
            <button
              onClick={() => handleToolSelect('line')}
              title="Line (L)"
              className={`p-2 text-xs font-medium transition-colors rounded-none ${
                drawingTool === 'line' ? ACTIVE_TOOL : INACTIVE_TOOL
              }`}
            >
              <Minus className="w-4 h-4 transform -rotate-45" />
            </button>

            <button
              onClick={() => handleToolSelect('arrow')}
              title="Arrow (A)"
              className={`p-2 text-xs font-medium transition-colors rounded-none ${
                drawingTool === 'arrow' ? ACTIVE_TOOL : INACTIVE_TOOL
              }`}
            >
              <MoveUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('rect')}
              title="Rectangle (R)"
              className={`p-2 text-xs font-medium transition-colors rounded-none ${
                drawingTool === 'rect' ? ACTIVE_TOOL : INACTIVE_TOOL
              }`}
            >
              <Square className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('circle')}
              title="Circle (C)"
              className={`p-2 text-xs font-medium transition-colors rounded-none ${
                drawingTool === 'circle' ? ACTIVE_TOOL : INACTIVE_TOOL
              }`}
            >
              <Circle className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('text')}
              title="Text Box (T) - Click anywhere on canvas to place text"
              className={`p-2 text-xs font-medium transition-colors rounded-none ${
                drawingTool === 'text' ? ACTIVE_TOOL : INACTIVE_TOOL
              }`}
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          {/* Stroke Width Selector */}
          <div className={`flex items-center gap-1 px-1.5 ${DIVIDER_SECTION}`}>
            {STROKE_WIDTHS.map((sw) => (
              <button
                key={sw.value}
                onClick={() => setDrawingStrokeWidth(sw.value)}
                title={`${sw.label} stroke (${sw.value}px)`}
                className={`w-7 h-7 flex items-center justify-center transition-colors rounded-none ${
                  drawingStrokeWidth === sw.value
                    ? 'bg-[#ECE6D6] dark:bg-[#2A2720] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs'
                    : 'border-2 border-transparent hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]'
                }`}
              >
                <div
                  className="rounded-full bg-[#1A1814] dark:bg-[#F2EEE2]"
                  style={{
                    width: `${Math.min(sw.value, 10)}px`,
                    height: `${Math.min(sw.value, 10)}px`,
                  }}
                />
              </button>
            ))}
          </div>

          {/* Color Swatches */}
          <div className={`flex items-center gap-1 px-1.5 ${DIVIDER_SECTION}`}>
            {PRESET_COLORS.map((col) => (
              <button
                key={col.value}
                onClick={() => setDrawingColor(col.value)}
                title={col.name}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                  drawingColor === col.value
                    ? 'scale-125 ring-2 ring-[#1A1814] dark:ring-[#F2EEE2] ring-offset-1 ring-offset-[#FBF8F1] dark:ring-offset-[#1F1D17]'
                    : 'hover:scale-110'
                } ${col.value === '#FFFFFF' ? 'border border-[#1A1814]/30 dark:border-[#F2EEE2]/30' : ''}`}
                style={{ backgroundColor: col.value }}
              >
                {drawingColor === col.value && (
                  <Check
                    className={`w-2.5 h-2.5 ${
                      col.value === '#FFFFFF' || col.value === '#EAB308'
                        ? 'text-[#1A1814]'
                        : 'text-[#FBF8F1]'
                    }`}
                  />
                )}
              </button>
            ))}

            {/* Custom Color Native Picker */}
            <div className="relative">
              <button
                onClick={() => colorInputRef.current?.click()}
                title="Custom Color"
                className="w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-500 via-sky-500 to-amber-500 hover:scale-110 transition-transform"
              >
                <Palette className="w-2.5 h-2.5 text-white" />
              </button>
              <input
                ref={colorInputRef}
                type="color"
                value={drawingColor}
                onChange={(e) => setDrawingColor(e.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {/* Shape Fill Mode */}
          {['rect', 'circle'].includes(drawingTool) && (
            <div className={`flex items-center gap-1 px-1.5 ${DIVIDER_SECTION}`}>
              <button
                onClick={() => setDrawingFill('none')}
                className={`px-2 py-1 text-[11px] font-medium transition-colors rounded-none ${
                  drawingFill === 'none'
                    ? 'bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs'
                    : 'border-2 border-transparent text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]'
                }`}
              >
                Outline
              </button>
              <button
                onClick={() => setDrawingFill(`${drawingColor}26`)} // 15% opacity hex
                className={`px-2 py-1 text-[11px] font-medium transition-colors rounded-none ${
                  drawingFill !== 'none'
                    ? 'bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs'
                    : 'border-2 border-transparent text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]'
                }`}
              >
                Tint Fill
              </button>
            </div>
          )}

          {/* Clear Drawings Button with Confirmation */}
          <div className="relative pl-1">
            <button
              onClick={() => setShowClearConfirm(!showClearConfirm)}
              disabled={drawingsCount === 0}
              title="Clear all drawn strokes and shapes (keeps nodes and cards)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#D14530] dark:text-[#E5573F] hover:bg-[#D14530]/10 disabled:opacity-30 disabled:pointer-events-none transition-colors rounded-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Drawings</span>
            </button>

            {/* Confirmation Popover — brut panel, sharp corners */}
            {showClearConfirm && (
              <div
                id="clear-drawings-popover"
                className="absolute bottom-full mb-2 right-0 w-64 p-3 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm rounded-none z-50 text-left before:absolute before:inset-x-0 before:-bottom-3 before:h-3.5 before:content-['']"
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1814] dark:text-[#F2EEE2]">
                      Clear Drawings Only?
                    </h4>
                    <p className="text-[11px] text-[#6B6356] dark:text-[#A39B8B] mt-0.5 leading-snug">
                      This deletes all {drawingsCount} hand-drawn lines & shapes. Your cards, tasks,
                      and notes stay 100% intact.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2.5 py-1 text-xs font-medium bg-[#E8E2D2] dark:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs rounded-none transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmClear}
                    className="px-3 py-1 text-xs font-semibold bg-[#D14530] text-[#FBF8F1] dark:bg-[#E5573F] dark:text-[#15140F] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs rounded-none transition-colors"
                  >
                    Clear Drawings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close / Exit Draw Mode */}
          <button
            onClick={() => setIsDrawMode(false)}
            title="Exit Draw Mode (Esc)"
            className="p-1.5 ml-1 bg-[#ECE6D6] dark:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs brut-hover rounded-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quiet Tablet Stylus / Keyboard Helper Banner — sharp corners, warm muted text */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-[#6B6356] dark:text-[#A39B8B] px-3 py-1 bg-[#FBF8F1]/80 dark:bg-[#1F1D17]/80 border-2 border-[#1A1814]/15 dark:border-[#F2EEE2]/15 rounded-none backdrop-blur-xs">
          <span>Stylus Tablet Ready</span>
          <span aria-hidden="true">·</span>
          <span>Hold Space to pan canvas</span>
          <span aria-hidden="true">·</span>
          <span>Ctrl+Z to undo strokes</span>
        </div>
      </div>
    </div>
  );
};
