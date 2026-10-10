import React, { useState, useRef, useEffect } from 'react';
import { NodeItem, NodeColor, ConnectionHandle } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { COLOR_MAP } from '@/plxn/lib/nodeColors';
import {
  MoreHorizontal,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Palette,
  Layers,
  GripHorizontal,
} from 'lucide-react';

// Re-export COLOR_MAP so any existing imports of COLOR_MAP from NodeWrapper still work.
export { COLOR_MAP } from '@/plxn/lib/nodeColors';

interface NodeWrapperProps {
  node: NodeItem;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onStartDrag: (e: React.MouseEvent, node: NodeItem) => void;
  onStartConnection: (nodeId: string, handle: ConnectionHandle, e: React.MouseEvent) => void;
  onEndConnection: (nodeId: string, handle: ConnectionHandle, e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  node,
  isSelected,
  onSelect,
  onStartDrag,
  onStartConnection,
  onEndConnection,
  children,
}) => {
  const { updateNode, deleteNode, duplicateNode, bringToFront } = useProjectContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        setShowMenu(false);
        setShowColorPicker(false);
      }
    };
    if (showMenu || showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, showColorPicker]);

  const styleConfig = COLOR_MAP[node.color] || COLOR_MAP.neutral;
  const isFramelessText = node.type === 'text' && node.transparentBg !== false;

  const handlePortMouseDown = (e: React.MouseEvent, handle: ConnectionHandle) => {
    e.stopPropagation();
    onStartConnection(node.id, handle, e);
  };

  const handlePortMouseUp = (e: React.MouseEvent, handle: ConnectionHandle) => {
    e.stopPropagation();
    onEndConnection(node.id, handle, e);
  };

  return (
    <div
      id={`node-${node.id}`}
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
        width: `${node.width || 300}px`,
        zIndex: node.zIndex || 10,
      }}
      onClick={onSelect}
      className={`group absolute select-none rounded-none transition-[transform,box-shadow] duration-150 ${
        isFramelessText
          ? isSelected
            ? 'border-2 border-dashed border-[var(--lime)] bg-[var(--lime)]/5'
            : 'border-2 border-dashed border-transparent hover:border-[#1A1814]/30 dark:hover:border-[#F2EEE2]/30 bg-transparent'
          : `${styleConfig.bg} ${styleConfig.border} ${
              isSelected
                ? // .brut's unlayered box-shadow would otherwise override Tailwind's ring-2 box-shadow
                  // (cascade: .brut is unlayered, ring-2 lives in @layer utilities). Add an explicit
                  // outline as the reliable lime selection ring (uses the live accent var).
                  'brut ring-2 ring-[var(--lime)]/70 outline-[2px_solid_var(--lime)]'
                : 'brut-sm hover:translate-x-[-1px] hover:translate-y-[-1px]'
            }`
      }`}
    >
      {/* Workbench accent: gradient strip across the top edge of every non-frameless card. */}
      {!isFramelessText && (
        <div className={`h-1 w-full bg-gradient-to-r ${styleConfig.bar}`} />
      )}

      {/* Top Header / Drag Bar */}
      <div
        onMouseDown={(e) => {
          if (!node.locked && e.button === 0) {
            onStartDrag(e, node);
          }
        }}
        className={`flex items-center justify-between px-3 py-1.5 border-b-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 cursor-grab active:cursor-grabbing text-xs text-[#6B6356] dark:text-[#A39B8B] ${
          isFramelessText && !isSelected ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''
        }`}
      >
        <div className="flex items-center gap-1.5 truncate pr-2">
          <GripHorizontal className="w-3.5 h-3.5 shrink-0 opacity-50 hover:opacity-100" />
          <span className="font-medium tracking-tight truncate capitalize">
            {node.type}
          </span>
          {node.locked && (
            <Lock className="w-3 h-3 text-[#6B6356] dark:text-[#A39B8B] shrink-0 ml-1" />
          )}
        </div>

        {/* Menu & quick actions */}
        <div className="flex items-center gap-0.5 relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            title="Node options"
            className="p-1 rounded-none hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2] transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Context Dropdown with Safe Hover Bridge */}
          {showMenu && (
            <div
              className={`absolute right-0 top-7 w-44 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm rounded-none z-50 py-1 text-xs text-[#1A1814] dark:text-[#F2EEE2] before:absolute before:inset-x-0 before:-top-3 before:h-3.5 before:content-['']`}
            >
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2] transition-colors"
              >
                <Palette className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
                <span>Color Accent</span>
              </button>

              {showColorPicker && (
                <div className="px-3 py-2 grid grid-cols-4 gap-1.5 border-b-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 bg-[#ECE6D6]/50 dark:bg-[#2A2720]/50">
                  {(Object.keys(COLOR_MAP) as NodeColor[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        updateNode(node.id, { color: c }, true);
                        setShowColorPicker(false);
                      }}
                      title={COLOR_MAP[c].label}
                      className={`w-5 h-5 rounded-none border border-[#1A1814]/15 dark:border-[#F2EEE2]/15 ${COLOR_MAP[c].bg} flex items-center justify-center hover:scale-110 transition-transform ${
                        node.color === c ? 'ring-2 ring-[#1A1814] dark:ring-[#F2EEE2]' : ''
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${COLOR_MAP[c].accent}`} />
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  updateNode(node.id, { locked: !node.locked }, true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2] transition-colors"
              >
                {node.locked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
                    <span>Unlock Node</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
                    <span>Lock Position</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  duplicateNode(node.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2] transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => {
                  bringToFront(node.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
                <span>Bring to Front</span>
              </button>

              <div className="h-px bg-[#1A1814]/10 dark:bg-[#F2EEE2]/10 my-1" />

              <button
                onClick={() => {
                  deleteNode(node.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#D14530]/10 text-[#D14530] dark:text-[#E5573F] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Node Body */}
      <div className={isFramelessText ? 'p-1.5' : 'p-3.5'}>{children}</div>

      {/* Connection Anchor Ports (Top, Right, Bottom, Left) */}
      <div
        title="Connect from Top"
        onMouseDown={(e) => handlePortMouseDown(e, 'top')}
        onMouseUp={(e) => handlePortMouseUp(e, 'top')}
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-none bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] hover:bg-[var(--lime)] hover:scale-125 cursor-crosshair transition-all opacity-0 group-hover:opacity-80 hover:opacity-100 z-30"
      />
      <div
        title="Connect Output (Right)"
        onMouseDown={(e) => handlePortMouseDown(e, 'right')}
        onMouseUp={(e) => handlePortMouseUp(e, 'right')}
        className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-none bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] hover:bg-[var(--lime)] hover:scale-125 cursor-crosshair transition-all opacity-40 group-hover:opacity-100 hover:opacity-100 z-30"
      />
      <div
        title="Connect from Bottom"
        onMouseDown={(e) => handlePortMouseDown(e, 'bottom')}
        onMouseUp={(e) => handlePortMouseUp(e, 'bottom')}
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-none bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] hover:bg-[var(--lime)] hover:scale-125 cursor-crosshair transition-all opacity-0 group-hover:opacity-80 hover:opacity-100 z-30"
      />
      <div
        title="Connect Input (Left)"
        onMouseDown={(e) => handlePortMouseDown(e, 'left')}
        onMouseUp={(e) => handlePortMouseUp(e, 'left')}
        className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-none bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] hover:bg-[var(--lime)] hover:scale-125 cursor-crosshair transition-all opacity-40 group-hover:opacity-100 hover:opacity-100 z-30"
      />
    </div>
  );
};
