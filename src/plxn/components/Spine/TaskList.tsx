'use client';

import React, { useState } from 'react';
import { useTaskList, ARCHIVE_DAYS } from '../../context/TaskListContext';
import { Plus, Check, RotateCcw, Trash2, ChevronDown, Archive, ListChecks } from 'lucide-react';

export const TaskList: React.FC = () => {
  const {
    activeTasks,
    archivedTasks,
    addTask,
    toggleTask,
    restoreTask,
    deleteTask,
    clearArchive,
    now,
  } = useTaskList();
  const [text, setText] = useState('');
  const [archiveOpen, setArchiveOpen] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text);
    setText('');
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <ListChecks className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="display text-[13px] font-semibold tracking-tight">To-Do</span>
        </div>
        <span className="font-mono text-[10px] text-[#6B6356] dark:text-[#A39B8B] tabular-nums">
          {activeTasks.length} open
        </span>
      </div>

      {/* Add input */}
      <form onSubmit={handleAdd} className="flex items-stretch gap-1.5 mb-2.5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Capture a task…"
          className="flex-1 min-w-0 bg-transparent border-2 border-[#1A1814] dark:border-[#F2EEE2] px-2.5 py-1.5 text-xs placeholder:text-[#9A907F] dark:placeholder:text-[#6E6759] focus:outline-none focus:bg-[#1A1814] focus:text-[#F4F0E6] dark:focus:bg-[#F2EEE2] dark:focus:text-[#15140F] transition-colors"
        />
        <button
          type="submit"
          title="Add task"
          className="shrink-0 w-9 grid place-items-center bg-[var(--lime)] border-2 border-[#1A1814] dark:border-[#F2EEE2] text-[#1A1814] brut-xs hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </form>

      {/* Active list */}
      <div className="flex flex-col gap-1.5">
        {activeTasks.length === 0 && (
          <p className="text-[11px] italic text-[#9A907F] dark:text-[#6E6759] py-2 display">
            Nothing pending. Add one above.
          </p>
        )}
        {activeTasks.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-2 px-2 py-1.5 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs"
          >
            <button
              onClick={() => toggleTask(t.id)}
              title="Complete"
              className="shrink-0 w-4 h-4 grid place-items-center border-2 border-[#1A1814] dark:border-[#F2EEE2] hover:bg-[var(--lime)] transition-colors"
            >
              <Check className="w-2.5 h-2.5 opacity-0 hover:opacity-0 text-[#1A1814]" strokeWidth={3} />
            </button>
            <span className="flex-1 min-w-0 text-[11.5px] leading-snug break-words text-[#1A1814] dark:text-[#F2EEE2]">
              {t.text}
            </span>
            <button
              onClick={() => deleteTask(t.id)}
              title="Delete"
              className="shrink-0 p-0.5 text-[#9A907F] dark:text-[#6E6759] hover:text-[#D14530] dark:hover:text-[#E5573F] opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Archive rail */}
      {archivedTasks.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setArchiveOpen((v) => !v)}
            className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2] transition-colors pb-1"
          >
            <span className="flex items-center gap-1.5">
              <Archive className="w-3 h-3" />
              Archive · {archivedTasks.length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#9A907F] dark:text-[#6E6759]">purges in {ARCHIVE_DAYS}d</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${archiveOpen ? '' : '-rotate-90'}`} />
            </span>
          </button>

          {archiveOpen && (
            <div className="flex flex-col gap-1.5 pt-1">
              {archivedTasks.map((t) => {
                const completedAt = t.completedAt || now;
                const elapsed = now - completedAt;
                const total = ARCHIVE_DAYS * 86400000;
                const remaining = Math.max(0, total - elapsed);
                const daysLeft = Math.ceil(remaining / 86400000);
                const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
                return (
                  <div
                    key={t.id}
                    className="group relative px-2 py-1.5 bg-[#ECE6D6] dark:bg-[#2A2720] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs opacity-80"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="shrink-0 w-4 h-4 grid place-items-center bg-[var(--lime)] border-2 border-[#1A1814] dark:border-[#F2EEE2]"
                        title="Completed"
                      >
                        <Check className="w-2.5 h-2.5 text-[#1A1814] plxn-check" strokeWidth={3} />
                      </span>
                      <span className="flex-1 min-w-0 text-[11px] leading-snug break-words text-[#6B6356] dark:text-[#A39B8B] line-through">
                        {t.text}
                      </span>
                      <button
                        onClick={() => restoreTask(t.id)}
                        title="Restore"
                        className="shrink-0 p-0.5 text-[#9A907F] dark:text-[#6E6759] hover:text-[#1A1814] dark:hover:text-[#F2EEE2] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        title="Delete now"
                        className="shrink-0 p-0.5 text-[#9A907F] dark:text-[#6E6759] hover:text-[#D14530] dark:hover:text-[#E5573F] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    {/* Decay bar + countdown */}
                    <div className="flex items-center gap-1.5 mt-1.5 pl-6">
                      <div className="flex-1 h-1 bg-[#1A1814]/15 dark:bg-[#F2EEE2]/15 overflow-hidden">
                        <div
                          className="h-full bg-[#D14530] dark:bg-[#E5573F] transition-all"
                          style={{ width: `${100 - pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[9px] tabular-nums text-[#9A907F] dark:text-[#6E6759] shrink-0">
                        {daysLeft}d left
                      </span>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={clearArchive}
                className="self-end mt-1 text-[10px] font-mono uppercase tracking-wider text-[#D14530] dark:text-[#E5573F] hover:underline"
              >
                Purge all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
