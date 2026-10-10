'use client';

import React from 'react';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { TEMPLATES } from '@/plxn/data/templates';
import { X, Sparkles, ArrowRight, Layout, Rocket, Kanban, Feather, Calendar } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  Kanban,
  Feather,
  Calendar,
};

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProjectContext();

  if (!isOpen) return null;

  const handleCreate = (templateId?: string) => {
    createProject(templateId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-2xl bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut rounded-none flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b-2 border-[#1A1814] dark:border-[#F2EEE2]">
          <div>
            <h2 className="display text-xl font-semibold text-[#1A1814] dark:text-[#F2EEE2]">
              Create a New Plan
            </h2>
            <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] mt-0.5">
              Choose a starter framework or open a blank workflow canvas.
            </p>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="shrink-0 p-1 border-[1.5px] border-[#1A1814] dark:border-[#F2EEE2] brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="plxn-scroll p-6 overflow-y-auto space-y-5">
          {/* Blank Canvas Option — dashed brut-sm-style card (uses Tailwind shadow because .brut-sm would override border-style to solid) */}
          <div
            onClick={() => handleCreate()}
            className="group flex items-center justify-between gap-3 p-4 border-2 border-dashed border-[#1A1814] dark:border-[#F59E0B] shadow-[2px_2px_0_0_var(--shadow)] brut-hover cursor-pointer hover:bg-[var(--lime)]/15 transition-colors rounded-none"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 shrink-0 bg-[#1A1814] dark:bg-[#F2EEE2] text-[var(--lime)] dark:text-[#15140F] flex items-center justify-center border-[1.5px] border-[#1A1814] dark:border-[#F2EEE2] brut-xs">
                <Layout className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="display text-base font-semibold text-[#1A1814] dark:text-[#F2EEE2] group-hover:text-[#D14530] dark:group-hover:text-[#E5573F] transition-colors">
                  Blank Workflow Canvas
                </h3>
                <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] line-clamp-1">
                  Clean 2D infinite workspace for custom diagrams, mind maps, and pipelines.
                </p>
              </div>
            </div>
            <ArrowRight
              className="w-4 h-4 text-[#6B6356] dark:text-[#A39B8B] group-hover:text-[#1A1814] dark:group-hover:text-[var(--lime)] group-hover:translate-x-1 transition-all shrink-0"
              strokeWidth={2.5}
            />
          </div>

          {/* Section Divider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B] font-mono whitespace-nowrap">
              Or start with a prebuilt framework
            </span>
            <div className="flex-1 h-[2px] bg-[#1A1814]/10 dark:bg-[#F2EEE2]/10" />
          </div>

          {/* Prebuilt Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((tmpl) => {
              const IconComp = ICON_MAP[tmpl.icon] || Sparkles;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleCreate(tmpl.id)}
                  className="group bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm brut-hover p-4 cursor-pointer flex flex-col justify-between rounded-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className="w-8 h-8 flex items-center justify-center text-white border-[1.5px] border-[#1A1814] dark:border-[#F2EEE2] brut-xs rounded-none"
                        style={{ backgroundColor: tmpl.color }}
                      >
                        <IconComp className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] text-[#6B6356] dark:text-[#A39B8B] font-mono uppercase tracking-wide">
                        {tmpl.category}
                      </span>
                    </div>

                    <h4 className="display text-sm font-semibold text-[#1A1814] dark:text-[#F2EEE2] group-hover:text-[#D14530] dark:group-hover:text-[#E5573F] transition-colors mb-1">
                      {tmpl.name}
                    </h4>

                    <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 text-[11px] font-mono uppercase tracking-wide text-[#6B6356] dark:text-[#A39B8B] group-hover:text-[#1A1814] dark:group-hover:text-[var(--lime)] transition-colors">
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
