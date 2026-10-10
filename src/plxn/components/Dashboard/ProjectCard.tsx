'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Project } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import {
  Pin,
  MoreHorizontal,
  Copy,
  Trash2,
  Download,
  Edit3,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { exportProjectToJson } from '@/plxn/utils/storage';
import { DeletePlanModal } from '@/plxn/components/Modals/DeletePlanModal';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const { togglePinProject, duplicateProject, deleteProject, updateProjectMeta } = useProjectContext();
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim()) {
      updateProjectMeta(project.id, { title: titleInput.trim() });
      setIsRenaming(false);
    }
  };

  // Stats calculation
  const totalNodes = project.nodes.length;
  const taskNodes = project.nodes.filter((n) => n.type === 'task');
  const completedTasks = taskNodes.filter((n) => n.status === 'done').length;
  const taskProgress = taskNodes.length > 0 ? Math.round((completedTasks / taskNodes.length) * 100) : 0;

  // Date format
  const updatedDate = new Date(project.updatedAt);
  const dateStr = updatedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onOpen}
      className="group relative bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut brut-hover p-5 cursor-pointer flex flex-col justify-between rounded-none"
    >
      {/* Washi tape — lime by default, red if pinned */}
      <span
        className={project.pinned ? 'washi-tape washi-tape--red' : 'washi-tape'}
        style={{ top: -8, left: 24 }}
        aria-hidden="true"
      />

      <div>
        {/* Top Header: Color dot + meta + actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-3 h-3 rounded-full shrink-0 border border-[#1A1814] dark:border-[#F2EEE2]"
              style={{ backgroundColor: project.color || '#10B981' }}
            />
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B6356] dark:text-[#A39B8B] font-mono uppercase tracking-wide">
              <span className="truncate max-w-[8rem]">{project.tags?.[0] || 'Workspace'}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{dateStr}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {project.pinned && (
              <span className="rubber-stamp rubber-stamp--lime hidden sm:inline-flex">
                Pinned
              </span>
            )}

            <button
              onClick={() => togglePinProject(project.id)}
              title={project.pinned ? 'Unpin' : 'Pin to top'}
              className={`p-1 border-[1.5px] border-[#1A1814] dark:border-[#F2EEE2] brut-xs text-[#1A1814] dark:text-[#F2EEE2] bg-[#FBF8F1] dark:bg-[#1F1D17] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform ${
                project.pinned ? '!bg-[var(--lime)]/40 dark:!bg-[var(--lime)]/30' : ''
              }`}
            >
              <Pin
                className={`w-3 h-3 ${project.pinned ? 'fill-current' : ''}`}
                strokeWidth={2.5}
              />
            </button>

            {/* Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                title="More actions"
                className="p-1 border-[1.5px] border-[#1A1814] dark:border-[#F2EEE2] brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
              >
                <MoreHorizontal className="w-3 h-3" strokeWidth={2.5} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-7 w-44 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm py-1 text-xs z-50 rounded-none">
                  <button
                    onClick={() => {
                      setIsRenaming(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]"
                  >
                    <Edit3 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Rename Plan</span>
                  </button>

                  <button
                    onClick={() => {
                      duplicateProject(project.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]"
                  >
                    <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={() => {
                      exportProjectToJson(project);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Export as JSON</span>
                  </button>

                  <div className="h-px bg-[#1A1814]/10 dark:bg-[#F2EEE2]/10 my-1" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteModalOpen(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-[#D14530] dark:text-[#E5573F] hover:bg-[#D14530]/10 dark:hover:bg-[#E5573F]/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title or Inline Rename */}
        {isRenaming ? (
          <form
            onSubmit={handleSaveRename}
            onClick={(e) => e.stopPropagation()}
            className="mb-2"
          >
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleSaveRename}
              className="w-full display text-lg font-semibold text-[#1A1814] dark:text-[#F2EEE2] bg-[#ECE6D6] dark:bg-[#2A2720] border-2 border-[#1A1814] dark:border-[#F2EEE2] px-2 py-1 focus:outline-none focus:bg-[var(--lime)]/20 rounded-none"
            />
          </form>
        ) : (
          <h3 className="display text-lg font-semibold text-[#1A1814] dark:text-[#F2EEE2] group-hover:text-[#D14530] dark:group-hover:text-[#E5573F] transition-colors line-clamp-1 mb-1.5">
            {project.title}
          </h3>
        )}

        {/* Description */}
        <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] line-clamp-2 leading-relaxed mb-4">
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Card Footer: Progress & Metrics */}
      <div className="pt-3 border-t-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10">
        <div className="flex items-center justify-between text-[11px] text-[#6B6356] dark:text-[#A39B8B] mb-1.5 font-mono uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1814] dark:text-[#F2EEE2]" strokeWidth={2.5} />
            <span className="tabular-nums">
              {completedTasks}/{taskNodes.length} tasks
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="tabular-nums">
              {totalNodes} nodes
            </span>
          </div>
        </div>

        {/* Progress bar — lime fill on ink/15 track */}
        <div className="w-full h-1.5 bg-[#1A1814]/15 dark:bg-[#F2EEE2]/15 overflow-hidden rounded-none">
          <div
            className="h-full bg-[var(--lime)] transition-all duration-300"
            style={{ width: `${taskNodes.length > 0 ? taskProgress : Math.min(totalNodes * 15, 100)}%` }}
          />
        </div>
      </div>

      {/* In-App Delete Confirmation Modal */}
      <DeletePlanModal
        project={project}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteProject(project.id)}
      />
    </div>
  );
};
