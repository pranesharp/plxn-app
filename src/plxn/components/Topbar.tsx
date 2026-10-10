'use client';

import React, { useState, useEffect } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { useProfile } from '../context/ProfileContext';
import {
  Menu,
  ChevronLeft,
  Check,
  PanelRight,
} from 'lucide-react';
import { ShortcutsModal } from './Modals/ShortcutsModal';
import { ExportImportModal } from './Modals/ExportImportModal';
import { AuthModal } from './Modals/AuthModal';

interface TopbarProps {
  onOpenSpine: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSpine }) => {
  const {
    viewMode,
    activeProject,
    closeProject,
    theme,
    setTheme,
    updateProjectMeta,
    isSaving,
    cloudSyncStatus,
    searchQuery,
    setSearchQuery,
  } = useProjectContext();
  const { profile } = useProfile();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  // Listen for global events dispatched by the Spine (mobile) and elsewhere
  useEffect(() => {
    const openShortcuts = () => setIsShortcutsOpen(true);
    const openExport = () => setIsExportOpen(true);
    const openAuth = () => setIsAuthOpen(true);
    window.addEventListener('plxn:open-shortcuts', openShortcuts);
    window.addEventListener('plxn:open-export', openExport);
    window.addEventListener('plxn:open-auth', openAuth);
    return () => {
      window.removeEventListener('plxn:open-shortcuts', openShortcuts);
      window.removeEventListener('plxn:open-export', openExport);
      window.removeEventListener('plxn:open-auth', openAuth);
    };
  }, []);

  const handleStartEdit = () => {
    if (activeProject) {
      setTitleInput(activeProject.title);
      setIsEditingTitle(true);
    }
  };
  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeProject && titleInput.trim()) {
      updateProjectMeta(activeProject.id, { title: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  const inCanvas = viewMode === 'canvas' && activeProject;

  return (
    <>
      <header className="h-12 shrink-0 border-b-2 border-[#1A1814] dark:border-[#F2EEE2] bg-[#FBF8F1] dark:bg-[#1F1D17] flex items-center gap-2 px-3 md:px-5 select-none">
        {/* Mobile menu (spine drawer) */}
        <button
          onClick={onOpenSpine}
          title="Menu"
          className="md:hidden p-1.5 border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs text-[#1A1814] dark:text-[#F2EEE2] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
        >
          <Menu className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {inCanvas ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={closeProject}
              title="Back to plans"
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Plans</span>
            </button>

            {/* Editable plan title */}
            {isEditingTitle ? (
              <form onSubmit={handleSaveTitle} className="flex items-center gap-1">
                <input
                  type="text"
                  autoFocus
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleSaveTitle}
                  className="text-xs font-semibold bg-[#ECE6D6] dark:bg-[#2A2720] border-2 border-[#1A1814] dark:border-[#F2EEE2] px-1.5 py-0.5 focus:outline-none min-w-0 w-32 sm:w-64"
                />
                <button type="submit" className="text-[#1A1814] dark:text-[#F2EEE2]">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </form>
            ) : (
              <button
                onClick={handleStartEdit}
                title="Click to rename"
                className="display text-sm font-semibold truncate max-w-[40vw] sm:max-w-md text-left hover:underline decoration-[#D14530] dark:decoration-[#E5573F] underline-offset-4"
              >
                {activeProject.title}
              </button>
            )}

            {/* Save status */}
            <span
              className="hidden lg:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B]"
              title={profile ? 'Local profile active' : 'Saved locally in your browser'}
            >
              <span
                className={`w-1.5 h-1.5 ${
                  isSaving
                    ? 'bg-[#F59E0B]'
                    : cloudSyncStatus === 'synced'
                    ? 'bg-[var(--lime)]'
                    : 'bg-[#10B981]'
                } border border-[#1A1814] dark:border-[#F2EEE2]`}
              />
              {isSaving ? 'Saving…' : profile ? 'Saved · local' : 'Saved locally'}
            </span>

            <div className="ml-auto" />
            {/* Side panel toggle */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('plxn:toggle-sidepanel'))}
              title="Toggle inspector"
              className="p-1.5 border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
            >
              <PanelRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h1 className="display text-base sm:text-lg font-semibold tracking-tight truncate">
              Workspace Plans
            </h1>
            <div className="hidden md:flex flex-1 justify-end max-w-xs ml-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search plans, tasks, notes…"
                  className="w-full pl-2.5 pr-2 py-1.5 text-xs bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] focus:outline-none focus:bg-[var(--lime)]/20 placeholder:text-[#9A907F] dark:placeholder:text-[#6E6759]"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global modals (mount once) */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <ExportImportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </>
  );
};
