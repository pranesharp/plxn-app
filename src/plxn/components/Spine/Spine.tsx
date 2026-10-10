'use client';

import React from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { useProfile } from '../../context/ProfileContext';
import { TaskList } from './TaskList';
import { AccentSwitcher } from './AccentSwitcher';
import {
  Sun,
  Moon,
  HelpCircle,
  Download,
  X,
  FolderKanban,
  Pin,
  Clock,
  Tag as TagIcon,
  LogIn,
} from 'lucide-react';

interface SpineProps {
  open: boolean;
  onClose: () => void;
}

export const Spine: React.FC<SpineProps> = ({ open, onClose }) => {
  const {
    projects,
    theme,
    setTheme,
    filterMode,
    setFilterMode,
    selectedTag,
    setSelectedTag,
    closeProject,
  } = useProjectContext();
  const { profile } = useProfile();

  const allTags = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [projects]);

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const openAuthModal = () => {
    // Dispatch a custom event the AuthModal listens for
    window.dispatchEvent(new CustomEvent('plxn:open-auth'));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      <aside
        className={`relative fixed md:static z-50 md:z-auto top-0 left-0 h-full w-[300px] shrink-0 flex flex-col bg-[#ECE6D6] dark:bg-[#1A1812] border-r-2 border-[#1A1814] dark:border-[#F2EEE2] transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Vertical edge label running down the right border */}
        <span
          className="edge-label hidden md:block absolute top-1/2 -translate-y-1/2 -right-3.5 z-10"
          aria-hidden="true"
        >
          Workbench · Atelier
        </span>

        {/* Brand + date */}
        <div className="px-4 pt-4 pb-3 border-b-2 border-[#1A1814] dark:border-[#F2EEE2]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                closeProject();
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 grid place-items-center bg-[#1A1814] dark:bg-[#F2EEE2] text-[#F4F0E6] dark:text-[#15140F] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs">
                <span className="display font-black text-lg leading-none rotate-[-6deg]">Px</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="display text-2xl font-semibold tracking-tight">PLXN</span>
                {/* hand-drawn underline */}
                <svg width="62" height="8" viewBox="0 0 62 8" className="mt-0.5 text-[#D14530] dark:text-[#E5573F]">
                  <path d="M2 5 C 14 2, 26 6, 38 3 S 58 5, 60 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </button>
            <button
              onClick={onClose}
              className="md:hidden p-1 -mr-1 text-[#1A1814] dark:text-[#F2EEE2]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B]">
            <span className="w-1.5 h-1.5 bg-[var(--lime)] border border-[#1A1814] dark:border-[#F2EEE2]" />
            <span>{dateStr}</span>
            <span className="text-[#9A907F] dark:text-[#6E6759]">·</span>
            <span>workbench</span>
          </div>
        </div>

        {/* Scrollable middle: Tasks + nav + tags */}
        <div className="flex-1 overflow-y-auto plxn-scroll px-4 py-4 space-y-6">
          {/* TASKS — the new feature */}
          <TaskList />

          {/* Divider with washi-tape */}
          <div className="relative h-px bg-[#1A1814]/20 dark:bg-[#F2EEE2]/20">
            <span className="washi-tape" style={{ top: -8, left: 20 }} />
          </div>

          {/* Workspace nav */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B] mb-2 px-1">
              Workspace
            </span>
            <div className="flex flex-col gap-1.5">
              <NavBtn
                active={filterMode === 'all' && !selectedTag}
                onClick={() => {
                  setFilterMode('all');
                  setSelectedTag(null);
                }}
                icon={<FolderKanban className="w-3.5 h-3.5" strokeWidth={2} />}
                label="All Plans"
                count={projects.length}
              />
              <NavBtn
                active={filterMode === 'pinned' && !selectedTag}
                onClick={() => {
                  setFilterMode('pinned');
                  setSelectedTag(null);
                }}
                icon={<Pin className="w-3.5 h-3.5" strokeWidth={2} />}
                label="Pinned"
                count={projects.filter((p) => p.pinned).length}
              />
              <NavBtn
                active={filterMode === 'recent' && !selectedTag}
                onClick={() => {
                  setFilterMode('recent');
                  setSelectedTag(null);
                }}
                icon={<Clock className="w-3.5 h-3.5" strokeWidth={2} />}
                label="Recent"
              />
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B] mb-2 px-1">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => {
                  const active = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(active ? null : tag)}
                      className={`px-2 py-0.5 text-[11px] border-2 border-[#1A1814] dark:border-[#F2EEE2] transition-colors ${
                        active
                          ? 'bg-[var(--lime)] text-[#1A1814]'
                          : 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[var(--lime)]/40'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer: profile + global actions */}
        <div className="border-t-2 border-[#1A1814] dark:border-[#F2EEE2] px-4 py-3 space-y-2.5">
          {profile ? (
            <button
              onClick={openAuthModal}
              className="w-full flex items-center gap-2.5 p-1.5 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
            >
              <div className="w-8 h-8 grid place-items-center bg-[var(--lime)] border-2 border-[#1A1814] dark:border-[#F2EEE2] display font-bold text-sm shrink-0">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[11px] font-semibold truncate leading-tight">{profile.name}</p>
                <p className="font-mono text-[9px] text-[#6B6356] dark:text-[#A39B8B] truncate">
                  {profile.email || 'local profile'}
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1A1814] dark:bg-[#F2EEE2] text-[#F4F0E6] dark:text-[#15140F] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs text-[11px] font-semibold hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
            >
              <LogIn className="w-3.5 h-3.5" strokeWidth={2.5} />
              Sign In
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <AccentSwitcher />
            <ActionBtn
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </ActionBtn>
            <ActionBtn
              onClick={() => window.dispatchEvent(new CustomEvent('plxn:open-shortcuts'))}
              title="Keyboard shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </ActionBtn>
            <ActionBtn
              onClick={() => window.dispatchEvent(new CustomEvent('plxn:open-export'))}
              title="Export & Import"
            >
              <Download className="w-4 h-4" />
            </ActionBtn>
          </div>

          {/* Editorial footer stamp */}
          <div className="flex items-center justify-between pt-1 px-0.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9A907F] dark:text-[#6E6759]">
              Est. 2026 · v1
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9A907F] dark:text-[#6E6759]">
              p. 01
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}> = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-[11.5px] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs transition-all hover:translate-x-[1px] hover:translate-y-[1px] ${
      active
        ? 'bg-[var(--lime)] text-[#1A1814] font-semibold'
        : 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2]'
    }`}
  >
    <span className="flex items-center gap-2">
      {icon}
      {label}
    </span>
    {count !== undefined && (
      <span className="font-mono text-[10px] tabular-nums opacity-70">{count}</span>
    )}
  </button>
);

const ActionBtn: React.FC<{
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className="flex-1 grid place-items-center p-2 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs text-[#1A1814] dark:text-[#F2EEE2] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
  >
    {children}
  </button>
);
