'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'X', desc: 'Create new freeform Text Box / Annotation' },
    { key: 'N', desc: 'Create new Note card at center of canvas' },
    { key: 'T', desc: 'Create Task card (or Text Tool in Draw mode)' },
    { key: 'M', desc: 'Create new Milestone / Phase card' },
    { key: 'L', desc: 'Create new Link / Resource card' },
    { key: 'P', desc: 'Toggle Whiteboard / Stylus Drawing mode' },
    { key: 'E', desc: 'Switch to Drawing Eraser tool' },
    { key: 'Space + Drag', desc: 'Pan infinite canvas smoothly' },
    { key: 'Ctrl + Wheel', desc: 'Zoom in / out centered on cursor' },
    { key: '0', desc: 'Zoom to fit all nodes on screen' },
    { key: 'Ctrl + D', desc: 'Duplicate selected node' },
    { key: 'Del / Backspace', desc: 'Delete selected node or connection' },
    { key: 'Ctrl + Z', desc: 'Undo canvas move or edit' },
    { key: 'Ctrl + Y / ⇧⌘Z', desc: 'Redo previously undone action' },
    { key: 'Double Click Canvas', desc: 'Quick-create a Note card at cursor' },
    { key: 'Drag from side dot', desc: 'Draw a bezier connection line to another node' },
    { key: 'Esc', desc: 'Deselect all cards and dismiss popups' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] rounded-none brut flex flex-col plxn-pop"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#1A1814] dark:border-[#F2EEE2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] flex items-center justify-center">
              <Keyboard className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <h2 className="display text-base font-semibold tracking-tight text-[#1A1814] dark:text-[#F2EEE2]">
                Keyboard Shortcuts
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B] mt-1">
                17 commands
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="w-7 h-7 brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* List */}
        <div className="p-5 plxn-scroll max-h-[72vh] overflow-y-auto">
          <ul className="space-y-0">
            {SHORTCUTS.map((s, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 py-2 border-b border-[#1A1814]/10 dark:border-[#F2EEE2]/10 last:border-0"
              >
                <span className="text-xs text-[#3D372C] dark:text-[#D6CFBF]">
                  {s.desc}
                </span>
                <kbd className="shrink-0 bg-[#1A1814] text-[#F4F0E6] dark:bg-[#F2EEE2] dark:text-[#15140F] border-2 border-[#1A1814] dark:border-[#F2EEE2] px-2 py-1 font-mono text-[11px] font-medium">
                  {s.key}
                </kbd>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
