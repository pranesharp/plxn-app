'use client';

import React, { useState } from 'react';
import { Project } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import {
  X,
  Tag,
  FileText,
  History,
  BarChart2,
  CheckCircle2,
  Flag,
  Plus,
  Clock,
  Trash2,
} from 'lucide-react';
import { DeletePlanModal } from '@/plxn/components/Modals/DeletePlanModal';

interface SidePanelProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ project, isOpen, onClose }) => {
  const { updateProjectMeta, deleteProject } = useProjectContext();
  const [activeTab, setActiveTab] = useState<'notes' | 'tags' | 'activity' | 'stats'>('notes');
  const [newTagInput, setNewTagInput] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!isOpen) return null;

  // Stats calculations
  const totalNodes = project.nodes.length;
  const taskNodes = project.nodes.filter((n) => n.type === 'task');
  const completedTasks = taskNodes.filter((n) => n.status === 'done').length;
  const milestoneNodes = project.nodes.filter((n) => n.type === 'milestone');
  const achievedMilestones = milestoneNodes.filter(
    (m) => m.milestoneStatus === 'achieved' || (m.progress && m.progress >= 100)
  ).length;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateProjectMeta(project.id, { notes: e.target.value });
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim();
    if (!project.tags.includes(clean)) {
      updateProjectMeta(project.id, { tags: [...project.tags, clean] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateProjectMeta(project.id, {
      tags: project.tags.filter((t) => t !== tagToRemove),
    });
  };

  // Shared tab pill classes
  const tabBase =
    'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium transition-all brut-xs';
  const tabInactive =
    'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]';
  const tabActive = 'bg-[var(--lime)] text-[#1A1814]';

  // Stat card classes
  const statCard =
    'p-3 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs';

  return (
    <aside className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 bg-[#FBF8F1]/95 dark:bg-[#1F1D17]/95 backdrop-blur-md border-l-2 border-[#1A1814] dark:border-[#F2EEE2] z-40 flex flex-col select-none transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10">
        <div className="min-w-0">
          <h2 className="display text-lg font-semibold text-[#1A1814] dark:text-[#F2EEE2] truncate leading-tight">
            {project.title}
          </h2>
          <p className="text-[11px] text-[#6B6356] dark:text-[#A39B8B] truncate font-mono uppercase tracking-wider mt-0.5">
            Workspace Details &amp; Logs
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Bar — brut-xs pills */}
      <div className="flex items-center gap-1.5 p-2 border-b-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 bg-[#ECE6D6]/40 dark:bg-[#2A2720]/40">
        <button
          onClick={() => setActiveTab('notes')}
          className={`${tabBase} ${activeTab === 'notes' ? tabActive : tabInactive}`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Brief</span>
        </button>

        <button
          onClick={() => setActiveTab('tags')}
          className={`${tabBase} ${activeTab === 'tags' ? tabActive : tabInactive}`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Tags</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`${tabBase} ${activeTab === 'stats' ? tabActive : tabInactive}`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`${tabBase} ${activeTab === 'activity' ? tabActive : tabInactive}`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Log</span>
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 plxn-scroll">
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6B6356] dark:text-[#A39B8B]">
              <span className="font-medium">Project Scope &amp; Guidelines</span>
              <span className="text-[11px] font-mono uppercase tracking-wider">Autosaved</span>
            </div>
            <textarea
              value={project.notes || ''}
              onChange={handleNotesChange}
              rows={16}
              placeholder="Record overarching project brief, team constraints, meeting action items, links, or architectural invariants..."
              className="w-full text-xs text-[#1A1814] dark:text-[#F2EEE2] bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs p-3 plxn-scroll focus:outline-none focus:ring-2 focus:ring-[var(--lime)] leading-relaxed resize-none placeholder:text-[#6B6356]/60 dark:placeholder:text-[#A39B8B]/60"
            />
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="space-y-4">
            <div className="text-xs text-[#6B6356] dark:text-[#A39B8B]">
              Categorize and filter this workspace across your team.
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag();
                }}
                placeholder="New tag name..."
                className="flex-1 text-xs bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs px-2.5 py-1.5 text-[#1A1814] dark:text-[#F2EEE2] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] placeholder:text-[#6B6356]/60 dark:placeholder:text-[#A39B8B]/60"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs text-xs font-semibold active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-medium text-[#1A1814] dark:text-[#F2EEE2]">
                Active Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-[#D14530] dark:hover:text-[#E5573F] transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {project.tags.length === 0 && (
                  <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] italic">No tags assigned yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className={statCard}>
                <span className="text-[11px] text-[#6B6356] dark:text-[#A39B8B] uppercase tracking-wider font-mono">
                  Total Nodes
                </span>
                <p className="text-xl font-bold font-mono tabular-nums text-[#1A1814] dark:text-[#F2EEE2] mt-1">
                  {totalNodes}
                </p>
              </div>

              <div className={statCard}>
                <span className="text-[11px] text-[#6B6356] dark:text-[#A39B8B] uppercase tracking-wider font-mono">
                  Connections
                </span>
                <p className="text-xl font-bold font-mono tabular-nums text-[#1A1814] dark:text-[#F2EEE2] mt-1">
                  {project.connections.length}
                </p>
              </div>
            </div>

            {/* Task Breakdown */}
            <div className={`${statCard} space-y-2`}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-[#1A1814] dark:text-[#F2EEE2]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--lime)] dark:text-[var(--lime)]" />
                  <span>Task Completion</span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-[#1A1814] dark:text-[#F2EEE2]">
                  {completedTasks}/{taskNodes.length} ({taskNodes.length > 0 ? Math.round((completedTasks / taskNodes.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#1A1814]/10 dark:bg-[#F2EEE2]/10 overflow-hidden">
                <div
                  className="h-full bg-[var(--lime)] transition-all duration-300"
                  style={{
                    width: `${taskNodes.length > 0 ? (completedTasks / taskNodes.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Milestone Progress */}
            <div className={`${statCard} space-y-2`}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-[#1A1814] dark:text-[#F2EEE2]">
                  <Flag className="w-4 h-4 text-amber-500" />
                  <span>Milestones Achieved</span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-[#1A1814] dark:text-[#F2EEE2]">
                  {achievedMilestones}/{milestoneNodes.length}
                </span>
              </div>
              <div className="w-full h-2 bg-[#1A1814]/10 dark:bg-[#F2EEE2]/10 overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] transition-all duration-300"
                  style={{
                    width: `${milestoneNodes.length > 0 ? (achievedMilestones / milestoneNodes.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Node Breakdown List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-medium text-[#6B6356] dark:text-[#A39B8B] uppercase tracking-wider font-mono">
                Node Type Distribution
              </span>
              <div className="space-y-1 text-xs text-[#1A1814] dark:text-[#F2EEE2]">
                {[
                  { label: 'Note Cards', count: project.nodes.filter((n) => n.type === 'note').length },
                  { label: 'Task Cards', count: taskNodes.length },
                  { label: 'Milestones', count: milestoneNodes.length },
                  { label: 'Links & Attachments', count: project.nodes.filter((n) => n.type === 'link').length },
                  { label: 'Images', count: project.nodes.filter((n) => n.type === 'image').length },
                  { label: 'Text Boxes', count: project.nodes.filter((n) => n.type === 'text').length },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between py-1 border-b-2 border-[#1A1814]/5 dark:border-[#F2EEE2]/5"
                  >
                    <span>{row.label}</span>
                    <span className="font-mono tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            <div className="text-xs text-[#6B6356] dark:text-[#A39B8B]">
              Audit trail of canvas actions and project updates.
            </div>

            <div className="space-y-2.5">
              {(project.activity || []).map((log) => {
                const date = new Date(log.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-2.5 text-xs p-2 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1A1814] dark:text-[#F2EEE2] leading-snug">
                        {log.text}
                      </p>
                      <span className="text-[10px] text-[#6B6356] dark:text-[#A39B8B] font-mono">
                        {timeStr}
                      </span>
                    </div>
                  </div>
                );
              })}

              {(!project.activity || project.activity.length === 0) && (
                <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] italic">No activity recorded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Panel Footer: Delete Plan Action */}
      <div className="p-3 border-t-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 bg-[#ECE6D6]/40 dark:bg-[#2A2720]/40">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#D14530] dark:text-[#E5573F] hover:bg-[#D14530]/10 transition-colors border-2 border-[#D14530] dark:border-[#E5573F] brut-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete This Plan</span>
        </button>
      </div>

      <DeletePlanModal
        project={project}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteProject(project.id)}
      />
    </aside>
  );
};
