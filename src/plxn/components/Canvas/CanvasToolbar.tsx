'use client';

import React from 'react';
import { NodeType } from '@/plxn/types';
import {
  FileText,
  CheckSquare,
  Flag,
  Link2,
  Image as ImageIcon,
  Grid,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  AlignStartHorizontal,
  Pencil,
  Type,
} from 'lucide-react';

interface CanvasToolbarProps {
  onAddNode: (type: NodeType) => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onZoomToFit: () => void;
  onTidyLayout: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isDrawMode?: boolean;
  onToggleDrawMode?: () => void;
  drawingsCount?: number;
}

// Per-node-type accent chip color (subtle, Workbench-style — not neon).
const NODE_ACCENT: Record<NodeType, string> = {
  note: '#10B981',
  task: '#38BDF8',
  milestone: '#F59E0B',
  link: '#A78BFA',
  image: '#FB7185',
  text: '#22D3EE',
};

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddNode,
  snapEnabled,
  onToggleSnap,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onZoomToFit,
  onTidyLayout,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isDrawMode = false,
  onToggleDrawMode,
  drawingsCount = 0,
}) => {
  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('text/plxn-node-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Inactive ink button (with optional swatch + label)
  const inkText = 'text-[#1A1814] dark:text-[#F2EEE2]';
  const surfaceBtn =
    `flex items-center gap-1.5 px-2.5 py-1.5 ${inkText} hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] transition-colors text-xs font-medium cursor-grab active:cursor-grabbing`;
  const iconBtn =
    `p-1.5 ${inkText} hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] transition-colors`;
  const iconBtnDisabled =
    `p-1.5 text-[#1A1814]/30 dark:text-[#F2EEE2]/30 pointer-events-none`;
  const limeActive =
    'flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs text-xs font-semibold';
  const limeIconActive =
    'p-1.5 bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs';
  const divider = 'w-px h-5 bg-[#1A1814]/10 dark:bg-[#F2EEE2]/10 mx-0.5';

  // Node button renderer: ink icon + small colored swatch chip + label
  const nodeBtn = (type: NodeType, Icon: React.ElementType, label: string, shortcut: string) => (
    <button
      draggable
      onDragStart={(e) => handleDragStart(e, type)}
      onClick={() => onAddNode(type)}
      title={`${label} Node (shortcut: ${shortcut}) — Click or Drag onto canvas`}
      className={surfaceBtn}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
      <span
        className="w-2 h-2 shrink-0 border border-[#1A1814] dark:border-[#F2EEE2]"
        style={{ backgroundColor: NODE_ACCENT[type] }}
        aria-hidden="true"
      />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="flex items-center gap-1 p-1 bg-[#FBF8F1]/95 dark:bg-[#1F1D17]/95 backdrop-blur-md border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm">
        {/* Node Creation Palette — ink icons + subtle swatch chips */}
        <div className="flex items-center gap-0.5 px-1">
          {nodeBtn('note', FileText, 'Note', 'N')}
          {nodeBtn('task', CheckSquare, 'Task', 'T')}
          {nodeBtn('milestone', Flag, 'Milestone', 'M')}
          {nodeBtn('link', Link2, 'Link', 'L')}
          {nodeBtn('image', ImageIcon, 'Image', 'I')}
          {nodeBtn('text', Type, 'Text', 'X')}
        </div>

        <div className={divider} />

        {/* Draw Mode Toggle */}
        {onToggleDrawMode && (
          <>
            <button
              onClick={onToggleDrawMode}
              title="Draw"
              className={
                isDrawMode
                  ? limeActive
                  : `flex items-center gap-1.5 px-2.5 py-1.5 ${inkText} hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] transition-colors text-xs font-semibold`
              }
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={2.25} />
              <span>Draw</span>
              {drawingsCount > 0 && (
                <span className="text-[10px] font-mono opacity-60">({drawingsCount})</span>
              )}
            </button>
            <div className={divider} />
          </>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 px-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={canUndo ? iconBtn : iconBtnDisabled}
          >
            <Undo2 className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={canRedo ? iconBtn : iconBtnDisabled}
          >
            <Redo2 className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>
        </div>

        <div className={divider} />

        {/* Canvas Tools: Snap, Tidy, Zoom */}
        <div className="flex items-center gap-0.5 px-1">
          <button
            onClick={onToggleSnap}
            title={snapEnabled ? 'Snap to grid: Enabled' : 'Snap to grid: Disabled'}
            className={snapEnabled ? limeIconActive : iconBtn}
          >
            <Grid className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>

          <button
            onClick={onTidyLayout}
            title="Tidy & Align Nodes Workflow"
            className={iconBtn}
          >
            <AlignStartHorizontal className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>

          <div className={divider} />

          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className={iconBtn}
          >
            <ZoomOut className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>

          <button
            onClick={onResetZoom}
            title="Reset Zoom (100%)"
            className="px-1.5 py-0.5 text-[11px] font-mono tabular-nums text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={onZoomIn}
            title="Zoom In"
            className={iconBtn}
          >
            <ZoomIn className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>

          <button
            onClick={onZoomToFit}
            title="Zoom to Fit All (shortcut: 0)"
            className={iconBtn}
          >
            <Maximize2 className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
};
