import React from 'react';
import { NodeItem } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { Flag, Calendar, Sparkles } from 'lucide-react';

interface MilestoneNodeProps {
  node: NodeItem;
}

export const MilestoneNode: React.FC<MilestoneNodeProps> = ({ node }) => {
  const { updateNode, addActivityLog } = useProjectContext();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const handleTargetDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { targetDate: e.target.value });
  };

  const setMilestoneStatus = (status: 'planned' | 'in-progress' | 'achieved') => {
    const progress = status === 'achieved' ? 100 : status === 'in-progress' ? Math.max(node.progress || 50, 25) : 0;
    updateNode(node.id, { milestoneStatus: status, progress }, true);
    addActivityLog(`Milestone "${node.title}" updated to ${status}`, 'milestone');
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const status = val === 100 ? 'achieved' : val > 0 ? 'in-progress' : 'planned';
    updateNode(node.id, { progress: val, milestoneStatus: status });
  };

  const progress = node.progress ?? 0;
  const isAchieved = node.milestoneStatus === 'achieved' || progress === 100;

  return (
    <div className="space-y-3">
      {/* Milestone Header */}
      <div className="flex items-start gap-2">
        <div
          className={`p-1.5 rounded-none shrink-0 border-2 border-[#1A1814] dark:border-[#F2EEE2] ${
            isAchieved
              ? 'bg-[var(--lime)] text-[#1A1814]'
              : 'bg-[#ECE6D6] dark:bg-[#2A2720] text-[#1A1814] dark:text-[#F2EEE2]'
          }`}
        >
          {isAchieved ? <Sparkles className="w-4 h-4" /> : <Flag className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={node.title}
            onChange={handleTitleChange}
            placeholder="Milestone / Phase title..."
            className="w-full bg-transparent font-semibold text-sm text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none focus:bg-[var(--lime)]/15 rounded-sm px-1 -mx-1 truncate transition-colors"
          />
        </div>
      </div>

      {/* Target Date */}
      <div className="flex items-center justify-between text-xs text-[#1A1814] dark:text-[#F2EEE2] px-0.5">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
          <span className="text-[10px] font-mono tracking-tight uppercase text-[#6B6356] dark:text-[#A39B8B]">Target Window</span>
        </div>
        <input
          type="text"
          value={node.targetDate || ''}
          onChange={handleTargetDateChange}
          placeholder="e.g. Q4 2026 / Oct 30"
          className="w-32 text-right bg-transparent border-0 focus:outline-none focus:bg-[var(--lime)]/15 rounded-sm px-1 text-xs text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B]"
        />
      </div>

      {/* Progress Bar & Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-tight uppercase text-[#6B6356] dark:text-[#A39B8B]">
          <span>Stage Progress</span>
          <span className="font-mono tabular-nums font-semibold text-[#1A1814] dark:text-[#F2EEE2]">{progress}%</span>
        </div>

        <div className="relative w-full h-2 bg-[#1A1814]/10 dark:bg-[#F2EEE2]/10 rounded-none overflow-hidden border border-[#1A1814]/10 dark:border-[#F2EEE2]/10">
          <div
            className={`h-full transition-all duration-300 bg-gradient-to-r ${
              isAchieved
                ? 'from-[var(--lime)] to-[#A3D424]'
                : progress > 50
                ? 'from-sky-500 to-cyan-500'
                : 'from-amber-500 to-orange-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1 bg-transparent cursor-pointer plxn-range"
        />
      </div>

      {/* Status Segmented Buttons */}
      <div className="flex items-center gap-1 p-0.5 bg-[#1A1814]/[0.04] dark:bg-[#F2EEE2]/[0.05] rounded-sm text-xs">
        <button
          onClick={() => setMilestoneStatus('planned')}
          className={`flex-1 py-1 px-1.5 text-center rounded-sm font-medium text-[11px] transition-colors ${
            node.milestoneStatus === 'planned' || (!node.milestoneStatus && progress === 0)
              ? 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] shadow-sm'
              : 'text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2]'
          }`}
        >
          Planned
        </button>
        <button
          onClick={() => setMilestoneStatus('in-progress')}
          className={`flex-1 py-1 px-1.5 text-center rounded-sm font-medium text-[11px] transition-colors ${
            node.milestoneStatus === 'in-progress' || (progress > 0 && progress < 100)
              ? 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-sky-700 dark:text-sky-300 shadow-sm'
              : 'text-[#6B6356] dark:text-[#A39B8B] hover:text-sky-700 dark:hover:text-sky-300'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setMilestoneStatus('achieved')}
          className={`flex-1 py-1 px-1.5 text-center rounded-sm font-medium text-[11px] transition-colors ${
            isAchieved
              ? 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#4A6A0E] dark:text-[#A3D424] shadow-sm'
              : 'text-[#6B6356] dark:text-[#A39B8B] hover:text-[#4A6A0E] dark:hover:text-[#A3D424]'
          }`}
        >
          Achieved
        </button>
      </div>
    </div>
  );
};
