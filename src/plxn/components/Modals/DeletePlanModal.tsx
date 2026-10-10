'use client';

import React from 'react';
import { Project } from '@/plxn/types';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeletePlanModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  project,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] rounded-none brut p-5 space-y-4 animate-in zoom-in-95 duration-150 plxn-pop"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 brut-xs bg-[#D14530]/10 text-[#D14530] dark:text-[#E5573F] flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" strokeWidth={2.5} />
          </div>

          <button
            onClick={onClose}
            title="Close"
            className="w-7 h-7 brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        <div>
          <h3 className="display text-base font-semibold tracking-tight text-[#1A1814] dark:text-[#F2EEE2]">
            Delete Plan?
          </h3>
          <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] mt-1.5 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-[#1A1814] dark:text-[#F2EEE2]">
              &ldquo;{project.title}&rdquo;
            </span>
            ? This will remove all associated cards, tasks, notes, connections, and whiteboard drawings.
          </p>
        </div>

        <div className="p-3 bg-[#F59E0B]/10 border-2 border-[#F59E0B]/40 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#B07208] dark:text-[#F59E0B] shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-[11px] text-[#7A4F08] dark:text-[#FBBF24] leading-snug">
            This action cannot be undone. All data for this plan will be removed from your workspace.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold tracking-tight bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-tight bg-[#D14530] text-[#FBF8F1] dark:bg-[#E5573F] dark:text-[#15140F] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Delete Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
