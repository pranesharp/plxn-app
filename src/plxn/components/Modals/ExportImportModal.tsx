'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { exportProjectToJson, exportAllProjectsToJson } from '@/plxn/utils/storage';
import { X, Download, Upload, FileCheck, AlertCircle } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const { projects, activeProject, importProject } = useProjectContext();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportStatus('Reading file…');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (parsed && typeof parsed === 'object') {
          // Check if single project or array
          if (Array.isArray(parsed)) {
            parsed.forEach((p) => importProject(p));
            setImportStatus(`Successfully imported ${parsed.length} workspaces!`);
          } else if (parsed.nodes && parsed.title) {
            importProject(parsed);
            setImportStatus(`Successfully imported "${parsed.title}"!`);
          } else {
            throw new Error('Unrecognized PLXN project schema.');
          }

          setTimeout(() => {
            onClose();
          }, 1200);
        }
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse JSON file.');
        setImportStatus(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] rounded-none brut flex flex-col plxn-pop"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b-2 border-[#1A1814] dark:border-[#F2EEE2]">
          <div className="flex flex-col leading-tight">
            <h2 className="display text-base font-semibold tracking-tight text-[#1A1814] dark:text-[#F2EEE2]">
              Data &amp; Backup
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B] mt-1">
              offline-first · local JSON
            </span>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="w-7 h-7 brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs plxn-scroll max-h-[72vh] overflow-y-auto">
          {/* Export Current Plan */}
          {activeProject && (
            <div className="bg-[#FBF8F1] dark:bg-[#1F1D17] brut-sm p-3.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="display block text-[13px] font-semibold tracking-tight text-[#1A1814] dark:text-[#F2EEE2]">
                  Export Current Plan
                </span>
                <p className="text-[11px] mt-1 text-[#6B6356] dark:text-[#A39B8B] leading-snug">
                  Save &ldquo;{activeProject.title}&rdquo; as a single JSON file.
                </p>
              </div>
              <button
                onClick={() => exportProjectToJson(activeProject)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm font-semibold tracking-tight hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Export</span>
              </button>
            </div>
          )}

          {/* Backup All Plans */}
          <div className="bg-[#FBF8F1] dark:bg-[#1F1D17] brut-sm p-3.5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="display block text-[13px] font-semibold tracking-tight text-[#1A1814] dark:text-[#F2EEE2]">
                Backup All Plans ({projects.length})
              </span>
              <p className="text-[11px] mt-1 text-[#6B6356] dark:text-[#A39B8B] leading-snug">
                Download every workspace into one JSON backup.
              </p>
            </div>
            <button
              onClick={() => exportAllProjectsToJson(projects)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm font-semibold tracking-tight hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Backup</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-dashed border-[#1A1814] dark:border-[#F2EEE2] brut-sm p-3.5 space-y-2.5">
            <div>
              <span className="display block text-[13px] font-semibold tracking-tight text-[#1A1814] dark:text-[#F2EEE2]">
                Import Workspace (.json)
              </span>
              <p className="text-[11px] mt-1 text-[#6B6356] dark:text-[#A39B8B] leading-snug">
                Restore an exported PLXN file into your browser&apos;s local database.
              </p>
            </div>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm font-semibold tracking-tight cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform">
              <Upload className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Select JSON File</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {importStatus && (
              <div className="flex items-center gap-1.5 text-[#4A6A0E] dark:text-[var(--lime)] font-medium mt-1 p-2 bg-[var(--lime)]/15 border-2 border-[var(--lime)]/40 text-[11px]">
                <FileCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                <span>{importStatus}</span>
              </div>
            )}

            {importError && (
              <div className="flex items-center gap-1.5 text-[#D14530] dark:text-[#E5573F] font-medium mt-1 p-2 bg-[#D14530]/10 border-2 border-[#D14530]/40 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                <span>{importError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
