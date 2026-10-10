import React from 'react';
import { NodeItem, TaskStatus, Priority } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { Check, Clock, Circle, Calendar, User, AlertCircle } from 'lucide-react';

interface TaskNodeProps {
  node: NodeItem;
}

export const TaskNode: React.FC<TaskNodeProps> = ({ node }) => {
  const { updateNode, addActivityLog } = useProjectContext();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const setStatus = (status: TaskStatus) => {
    updateNode(node.id, { status }, true);
    addActivityLog(`Marked task "${node.title}" as ${status}`, 'update');
  };

  const toggleComplete = () => {
    const nextStatus = node.status === 'done' ? 'todo' : 'done';
    setStatus(nextStatus);
  };

  const setPriority = (priority: Priority) => {
    updateNode(node.id, { priority }, true);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { dueDate: e.target.value });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { assignee: e.target.value });
  };

  const isDone = node.status === 'done';

  return (
    <div className="space-y-3">
      {/* Task Header with Quick Checkbox */}
      <div className="flex items-start gap-2">
        <button
          onClick={toggleComplete}
          className="mt-0.5 shrink-0 transition-colors"
          title={isDone ? 'Mark as incomplete' : 'Mark as done'}
        >
          {isDone ? (
            <div className="brut-xs rounded-none w-4 h-4 bg-[var(--lime)] text-[#1A1814] flex items-center justify-center plxn-check">
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
          ) : node.status === 'in-progress' ? (
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          ) : (
            <Circle className="w-4 h-4 text-[#6B6356] dark:text-[#A39B8B]" />
          )}
        </button>

        <input
          type="text"
          value={node.title}
          onChange={handleTitleChange}
          placeholder="Task title..."
          className={`w-full bg-transparent font-medium text-sm focus:outline-none focus:bg-[var(--lime)]/15 rounded-sm px-1 -mx-1 transition-colors ${
            isDone
              ? 'line-through text-[#6B6356] dark:text-[#A39B8B]'
              : 'text-[#1A1814] dark:text-[#F2EEE2]'
          } placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B]`}
        />
      </div>

      {/* Status Segmented Control */}
      <div className="flex items-center gap-1 p-0.5 bg-[#1A1814]/[0.04] dark:bg-[#F2EEE2]/[0.05] rounded-sm text-xs">
        <button
          onClick={() => setStatus('todo')}
          className={`flex-1 py-1 px-2 text-center rounded-sm font-medium transition-colors ${
            node.status === 'todo' || !node.status
              ? 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] shadow-sm'
              : 'text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2]'
          }`}
        >
          To Do
        </button>
        <button
          onClick={() => setStatus('in-progress')}
          className={`flex-1 py-1 px-2 text-center rounded-sm font-medium transition-colors ${
            node.status === 'in-progress'
              ? 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-sky-700 dark:text-sky-300 shadow-sm'
              : 'text-[#6B6356] dark:text-[#A39B8B] hover:text-sky-700 dark:hover:text-sky-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatus('done')}
          className={`flex-1 py-1 px-2 text-center rounded-sm font-medium transition-colors ${
            node.status === 'done'
              ? 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#4A6A0E] dark:text-[#A3D424] shadow-sm'
              : 'text-[#6B6356] dark:text-[#A39B8B] hover:text-[#4A6A0E] dark:hover:text-[#A3D424]'
          }`}
        >
          Done
        </button>
      </div>

      {/* Metadata Fields: Due Date, Owner, Priority */}
      <div className="pt-1 border-t-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2 text-[#1A1814] dark:text-[#F2EEE2]">
          <div className="flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
            <span className="text-[10px] font-mono tracking-tight uppercase text-[#6B6356] dark:text-[#A39B8B]">Due</span>
          </div>
          <input
            type="text"
            value={node.dueDate || ''}
            onChange={handleDueDateChange}
            placeholder="e.g. Oct 24"
            className="w-28 text-right bg-transparent border-0 focus:outline-none focus:bg-[var(--lime)]/15 rounded-sm px-1 text-xs text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B]"
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-[#1A1814] dark:text-[#F2EEE2]">
          <div className="flex items-center gap-1.5 shrink-0">
            <User className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
            <span className="text-[10px] font-mono tracking-tight uppercase text-[#6B6356] dark:text-[#A39B8B]">Owner</span>
          </div>
          <input
            type="text"
            value={node.assignee || ''}
            onChange={handleAssigneeChange}
            placeholder="Assign name..."
            className="w-32 text-right bg-transparent border-0 focus:outline-none focus:bg-[var(--lime)]/15 rounded-sm px-1 text-xs text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B]"
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-[#1A1814] dark:text-[#F2EEE2]">
          <div className="flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B]" />
            <span className="text-[10px] font-mono tracking-tight uppercase text-[#6B6356] dark:text-[#A39B8B]">Priority</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`capitalize px-1.5 py-0.5 rounded-none transition-colors font-mono tracking-tight ${
                  node.priority === p
                    ? p === 'high'
                      ? 'bg-[#D14530]/15 text-[#D14530] dark:text-[#E5573F] font-semibold border-2 border-[#D14530]/40 dark:border-[#E5573F]/40'
                      : p === 'medium'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold border-2 border-amber-500/40'
                      : 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] font-semibold border-2 border-[#1A1814]/15 dark:border-[#F2EEE2]/15'
                    : 'text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
