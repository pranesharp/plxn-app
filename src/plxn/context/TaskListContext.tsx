'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export const ARCHIVE_DAYS = 7;
const STORAGE_KEY = 'plxn_tasks_v1';

export interface TaskItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
  completedAt?: number;
}

interface TaskListContextType {
  tasks: TaskItem[];
  now: number;
  activeTasks: TaskItem[];
  archivedTasks: TaskItem[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  restoreTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearArchive: () => void;
  purgeExpired: () => number;
}

const TaskListContext = createContext<TaskListContextType | undefined>(undefined);

function loadTasks(): TaskItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as TaskItem[];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveTasks(tasks: TaskItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

export const TaskListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasks());
  const [now, setNow] = useState<number>(() => Date.now());
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  // Purge tasks archived more than ARCHIVE_DAYS ago
  const purgeExpired = useCallback((): number => {
    const cutoff = Date.now() - ARCHIVE_DAYS * 86400000;
    let removed = 0;
    setTasks((prev) => {
      const remaining = prev.filter((t) => {
        const expired = t.done && t.completedAt !== undefined && t.completedAt < cutoff;
        if (expired) removed += 1;
        return !expired;
      });
      if (removed > 0) saveTasks(remaining);
      return remaining;
    });
    return removed;
  }, []);

  // Sweep on mount + whenever the tab regains focus
  useEffect(() => {
    purgeExpired();
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        setNow(Date.now());
        purgeExpired();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [purgeExpired]);

  // Tick "now" every 30s so decay chips stay accurate + run purge
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      purgeExpired();
    }, 30000);
    return () => clearInterval(id);
  }, [purgeExpired]);

  // Persist on change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item: TaskItem = {
      id: 'task-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [item, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? t.done
            ? { ...t, done: false, completedAt: undefined }
            : { ...t, done: true, completedAt: Date.now() }
          : t
      )
    );
  }, []);

  const restoreTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: false, completedAt: undefined } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearArchive = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, []);

  const activeTasks = tasks.filter((t) => !t.done);
  const archivedTasks = tasks
    .filter((t) => t.done)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  return (
    <TaskListContext.Provider
      value={{
        tasks,
        now,
        activeTasks,
        archivedTasks,
        addTask,
        toggleTask,
        restoreTask,
        deleteTask,
        clearArchive,
        purgeExpired,
      }}
    >
      {children}
    </TaskListContext.Provider>
  );
};

export function useTaskList() {
  const ctx = useContext(TaskListContext);
  if (!ctx) throw new Error('useTaskList must be used within a TaskListProvider');
  return ctx;
}
