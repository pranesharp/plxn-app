'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Project,
  NodeItem,
  Connection,
  CanvasViewport,
  ViewMode,
  ActivityLog,
  DrawingElement,
  DrawingTool,
} from '../types';
import {
  loadProjectsFromStorage,
  saveProjectsToStorage,
  getThemePreference,
  setThemePreference,
  generateUniqueId,
} from '../utils/storage';
import { TEMPLATES } from '../data/templates';
import { useProfile } from './ProfileContext';

interface HistorySnapshot {
  nodes: NodeItem[];
  connections: Connection[];
  drawings: DrawingElement[];
}

export type CloudSyncStatus = 'synced' | 'syncing' | 'local' | 'error';

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string | null;
  activeProject: Project | null;
  viewMode: ViewMode;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterMode: 'all' | 'pinned' | 'recent';
  setFilterMode: (m: 'all' | 'pinned' | 'recent') => void;
  selectedTag: string | null;
  setSelectedTag: (t: string | null) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  selectedConnectionId: string | null;
  setSelectedConnectionId: (id: string | null) => void;
  isSaving: boolean;
  cloudSyncStatus: CloudSyncStatus;
  canUndo: boolean;
  canRedo: boolean;

  createProject: (templateId?: string) => Project;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  updateProjectMeta: (id: string, updates: Partial<Project>) => void;
  togglePinProject: (id: string) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  importProject: (data: Project) => void;

  addNode: (node: Omit<NodeItem, 'id'>) => string;
  updateNode: (nodeId: string, updates: Partial<NodeItem>, recordHistory?: boolean) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  bringToFront: (nodeId: string) => void;

  addConnection: (conn: Omit<Connection, 'id'>) => void;
  updateConnection: (connId: string, updates: Partial<Connection>) => void;
  deleteConnection: (connId: string) => void;

  addDrawingElement: (element: DrawingElement) => void;
  deleteDrawingElement: (elementId: string) => void;
  deleteDrawingElements: (elementIds: string[]) => void;
  clearDrawings: () => void;
  isDrawMode: boolean;
  setIsDrawMode: (active: boolean) => void;
  drawingTool: DrawingTool;
  setDrawingTool: (tool: DrawingTool) => void;
  drawingColor: string;
  setDrawingColor: (color: string) => void;
  drawingStrokeWidth: number;
  setDrawingStrokeWidth: (width: number) => void;
  drawingFill: string;
  setDrawingFill: (fill: string) => void;

  updateViewport: (viewport: CanvasViewport) => void;
  addActivityLog: (text: string, type?: ActivityLog['type']) => void;

  undo: () => void;
  redo: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useProfile();
  const [projects, setProjects] = useState<Project[]>(() => loadProjectsFromStorage());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => getThemePreference());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'pinned' | 'recent'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('local');

  const [isDrawMode, setIsDrawMode] = useState<boolean>(false);
  const [drawingTool, setDrawingTool] = useState<DrawingTool>('pen');
  const [drawingColor, setDrawingColor] = useState<string>('#0C0E14');
  const [drawingStrokeWidth, setDrawingStrokeWidth] = useState<number>(4);
  const [drawingFill, setDrawingFill] = useState<string>('none');

  const undoStackRef = useRef<HistorySnapshot[]>([]);
  const redoStackRef = useRef<HistorySnapshot[]>([]);
  const [, setHistoryTick] = useState(0);

  // Sync theme to DOM
  useEffect(() => {
    setThemePreference(theme);
  }, [theme]);

  const setTheme = (t: 'light' | 'dark') => setThemeState(t);

  // When a local profile signs in, just flip status to "synced" (local sync active)
  useEffect(() => {
    if (profile) setCloudSyncStatus('synced');
    else setCloudSyncStatus('local');
  }, [profile]);

  // Persist projects to localStorage (debounced)
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      saveProjectsToStorage(projects);
      setIsSaving(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [projects]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  const pushHistorySnapshot = useCallback(() => {
    if (!activeProject) return;
    undoStackRef.current.push({
      nodes: JSON.parse(JSON.stringify(activeProject.nodes || [])),
      connections: JSON.parse(JSON.stringify(activeProject.connections || [])),
      drawings: JSON.parse(JSON.stringify(activeProject.drawings || [])),
    });
    if (undoStackRef.current.length > 30) undoStackRef.current.shift();
    redoStackRef.current = [];
    setHistoryTick((t) => t + 1);
  }, [activeProject]);

  const undo = useCallback(() => {
    if (!activeProject || undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current.pop();
    if (!previous) return;
    redoStackRef.current.push({
      nodes: JSON.parse(JSON.stringify(activeProject.nodes || [])),
      connections: JSON.parse(JSON.stringify(activeProject.connections || [])),
      drawings: JSON.parse(JSON.stringify(activeProject.drawings || [])),
    });
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, nodes: previous.nodes, connections: previous.connections, drawings: previous.drawings || [], updatedAt: Date.now() }
          : p
      )
    );
    setHistoryTick((t) => t + 1);
  }, [activeProject]);

  const redo = useCallback(() => {
    if (!activeProject || redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop();
    if (!next) return;
    undoStackRef.current.push({
      nodes: JSON.parse(JSON.stringify(activeProject.nodes || [])),
      connections: JSON.parse(JSON.stringify(activeProject.connections || [])),
      drawings: JSON.parse(JSON.stringify(activeProject.drawings || [])),
    });
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? { ...p, nodes: next.nodes, connections: next.connections, drawings: next.drawings || [], updatedAt: Date.now() }
          : p
      )
    );
    setHistoryTick((t) => t + 1);
  }, [activeProject]);

  const createProject = useCallback((templateId?: string): Project => {
    let newProj: Project;
    if (templateId) {
      const tmpl = TEMPLATES.find((t) => t.id === templateId);
      newProj = tmpl ? tmpl.createProject() : createBlankProject();
    } else {
      newProj = createBlankProject();
    }
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setViewMode('canvas');
    undoStackRef.current = [];
    redoStackRef.current = [];
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    return newProj;
  }, []);

  const duplicateProject = useCallback((id: string) => {
    setProjects((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      const clone: Project = {
        ...JSON.parse(JSON.stringify(target)),
        id: generateUniqueId('proj'),
        title: `${target.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pinned: false,
      };
      return [clone, ...prev];
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      saveProjectsToStorage(remaining);
      return remaining;
    });
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setViewMode('dashboard');
    }
  }, [activeProjectId]);

  const updateProjectMeta = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p))
    );
  }, []);

  const togglePinProject = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned, updatedAt: Date.now() } : p))
    );
  }, []);

  const openProject = useCallback((id: string) => {
    setActiveProjectId(id);
    setViewMode('canvas');
    undoStackRef.current = [];
    redoStackRef.current = [];
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProjectId(null);
    setViewMode('dashboard');
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
  }, []);

  const importProject = useCallback((data: Project) => {
    const sanitized: Project = {
      ...data,
      id: generateUniqueId('proj'),
      title: data.title || 'Imported Plan',
      updatedAt: Date.now(),
      createdAt: data.createdAt || Date.now(),
      nodes: Array.isArray(data.nodes) ? data.nodes : [],
      connections: Array.isArray(data.connections) ? data.connections : [],
      activity: Array.isArray(data.activity) ? data.activity : [],
      viewport: data.viewport || { x: 100, y: 100, zoom: 1 },
    };
    setProjects((prev) => [sanitized, ...prev]);
    setActiveProjectId(sanitized.id);
    setViewMode('canvas');
  }, []);

  const addNode = useCallback(
    (nodeData: Omit<NodeItem, 'id'>): string => {
      if (!activeProjectId) return '';
      pushHistorySnapshot();
      const id = 'node-' + Math.random().toString(36).substring(2, 9);
      const newNode: NodeItem = { ...nodeData, id, zIndex: 10 };
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          const newActivity: ActivityLog = {
            id: 'act-' + Date.now(),
            timestamp: Date.now(),
            text: `Added ${nodeData.type} node "${nodeData.title || 'Untitled'}"`,
            type: 'create',
          };
          return { ...p, nodes: [...p.nodes, newNode], activity: [newActivity, ...(p.activity || [])], updatedAt: Date.now() };
        })
      );
      setSelectedNodeId(id);
      return id;
    },
    [activeProjectId, pushHistorySnapshot]
  );

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<NodeItem>, recordHistory: boolean = false) => {
      if (!activeProjectId) return;
      if (recordHistory) pushHistorySnapshot();
      setProjects((prev) =>
        prev.map((p) =>
          p.id !== activeProjectId
            ? p
            : { ...p, nodes: p.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)), updatedAt: Date.now() }
        )
      );
    },
    [activeProjectId, pushHistorySnapshot]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      if (!activeProjectId) return;
      pushHistorySnapshot();
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          const target = p.nodes.find((n) => n.id === nodeId);
          const newActivity: ActivityLog = {
            id: 'act-' + Date.now(),
            timestamp: Date.now(),
            text: `Deleted node "${target?.title || 'Untitled'}"`,
            type: 'delete',
          };
          return {
            ...p,
            nodes: p.nodes.filter((n) => n.id !== nodeId),
            connections: p.connections.filter((c) => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId),
            activity: [newActivity, ...(p.activity || [])],
            updatedAt: Date.now(),
          };
        })
      );
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    },
    [activeProjectId, selectedNodeId, pushHistorySnapshot]
  );

  const duplicateNode = useCallback(
    (nodeId: string) => {
      if (!activeProjectId) return;
      pushHistorySnapshot();
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          const source = p.nodes.find((n) => n.id === nodeId);
          if (!source) return p;
          const cloneId = 'node-' + Math.random().toString(36).substring(2, 9);
          const clone: NodeItem = {
            ...JSON.parse(JSON.stringify(source)),
            id: cloneId,
            title: `${source.title} (Copy)`,
            x: source.x + 40,
            y: source.y + 40,
            zIndex: (source.zIndex || 10) + 1,
          };
          return { ...p, nodes: [...p.nodes, clone], updatedAt: Date.now() };
        })
      );
    },
    [activeProjectId, pushHistorySnapshot]
  );

  const bringToFront = useCallback(
    (nodeId: string) => {
      if (!activeProjectId) return;
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          const maxZ = Math.max(...p.nodes.map((n) => n.zIndex || 10), 10);
          return { ...p, nodes: p.nodes.map((n) => (n.id === nodeId ? { ...n, zIndex: maxZ + 1 } : n)) };
        })
      );
    },
    [activeProjectId]
  );

  const addConnection = useCallback(
    (connData: Omit<Connection, 'id'>) => {
      if (!activeProjectId) return;
      const id = 'conn-' + Math.random().toString(36).substring(2, 9);
      pushHistorySnapshot();
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          const exists = p.connections.some(
            (c) => c.sourceNodeId === connData.sourceNodeId && c.targetNodeId === connData.targetNodeId
          );
          if (exists) return p;
          const newConn: Connection = { ...connData, id };
          return { ...p, connections: [...p.connections, newConn], updatedAt: Date.now() };
        })
      );
    },
    [activeProjectId, pushHistorySnapshot]
  );

  const updateConnection = useCallback(
    (connId: string, updates: Partial<Connection>) => {
      if (!activeProjectId) return;
      setProjects((prev) =>
        prev.map((p) =>
          p.id !== activeProjectId
            ? p
            : { ...p, connections: p.connections.map((c) => (c.id === connId ? { ...c, ...updates } : c)), updatedAt: Date.now() }
        )
      );
    },
    [activeProjectId]
  );

  const deleteConnection = useCallback(
    (connId: string) => {
      if (!activeProjectId) return;
      pushHistorySnapshot();
      setProjects((prev) =>
        prev.map((p) =>
          p.id !== activeProjectId ? p : { ...p, connections: p.connections.filter((c) => c.id !== connId), updatedAt: Date.now() }
        )
      );
      if (selectedConnectionId === connId) setSelectedConnectionId(null);
    },
    [activeProjectId, selectedConnectionId, pushHistorySnapshot]
  );

  const updateViewport = useCallback(
    (viewport: CanvasViewport) => {
      if (!activeProjectId) return;
      setProjects((prev) => prev.map((p) => (p.id === activeProjectId ? { ...p, viewport } : p)));
    },
    [activeProjectId]
  );

  const addDrawingElement = useCallback(
    (element: DrawingElement) => {
      if (!activeProjectId) return;
      pushHistorySnapshot();
      setProjects((prev) =>
        prev.map((p) =>
          p.id !== activeProjectId
            ? p
            : { ...p, drawings: [...(p.drawings || []), element], updatedAt: Date.now() }
        )
      );
    },
    [activeProjectId, pushHistorySnapshot]
  );

  const deleteDrawingElement = useCallback(
    (elementId: string) => {
      if (!activeProjectId) return;
      pushHistorySnapshot();
      setProjects((prev) =>
        prev.map((p) =>
          p.id !== activeProjectId ? p : { ...p, drawings: (p.drawings || []).filter((d) => d.id !== elementId), updatedAt: Date.now() }
        )
      );
    },
    [activeProjectId, pushHistorySnapshot]
  );

  const deleteDrawingElements = useCallback(
    (elementIds: string[]) => {
      if (!activeProjectId || elementIds.length === 0) return;
      pushHistorySnapshot();
      const idSet = new Set(elementIds);
      setProjects((prev) =>
        prev.map((p) =>
          p.id !== activeProjectId ? p : { ...p, drawings: (p.drawings || []).filter((d) => !idSet.has(d.id)), updatedAt: Date.now() }
        )
      );
    },
    [activeProjectId, pushHistorySnapshot]
  );

  const addActivityLog = useCallback(
    (text: string, type: ActivityLog['type'] = 'update') => {
      if (!activeProjectId) return;
      const logItem: ActivityLog = { id: 'act-' + Date.now(), timestamp: Date.now(), text, type };
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjectId ? { ...p, activity: [logItem, ...(p.activity || [])] } : p))
      );
    },
    [activeProjectId]
  );

  const clearDrawings = useCallback(() => {
    if (!activeProjectId) return;
    pushHistorySnapshot();
    setProjects((prev) =>
      prev.map((p) => (p.id !== activeProjectId ? p : { ...p, drawings: [], updatedAt: Date.now() }))
    );
    addActivityLog('Cleared drawings from canvas', 'update');
  }, [activeProjectId, pushHistorySnapshot, addActivityLog]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        activeProject,
        viewMode,
        theme,
        setTheme,
        searchQuery,
        setSearchQuery,
        filterMode,
        setFilterMode,
        selectedTag,
        setSelectedTag,
        selectedNodeId,
        setSelectedNodeId,
        selectedConnectionId,
        setSelectedConnectionId,
        isSaving,
        cloudSyncStatus,
        canUndo: undoStackRef.current.length > 0,
        canRedo: redoStackRef.current.length > 0,
        createProject,
        duplicateProject,
        deleteProject,
        updateProjectMeta,
        togglePinProject,
        openProject,
        closeProject,
        importProject,
        addNode,
        updateNode,
        deleteNode,
        duplicateNode,
        bringToFront,
        addConnection,
        updateConnection,
        deleteConnection,
        addDrawingElement,
        deleteDrawingElement,
        deleteDrawingElements,
        clearDrawings,
        isDrawMode,
        setIsDrawMode,
        drawingTool,
        setDrawingTool,
        drawingColor,
        setDrawingColor,
        drawingStrokeWidth,
        setDrawingStrokeWidth,
        drawingFill,
        setDrawingFill,
        updateViewport,
        addActivityLog,
        undo,
        redo,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjectContext must be used within a ProjectProvider');
  return context;
}

function createBlankProject(): Project {
  return {
    id: generateUniqueId('proj'),
    title: 'Untitled Plan',
    description: 'A visual canvas for mapping out tasks, workflows, and ideas.',
    icon: 'Sparkles',
    color: '#10B981',
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: ['General'],
    notes: 'Write overarching goals, key links, or meeting notes here.',
    viewport: { x: 150, y: 150, zoom: 1 },
    activity: [{ id: 'act-init', timestamp: Date.now(), text: 'Created workspace', type: 'create' }],
    drawings: [],
    nodes: [
      {
        id: 'node-welcome',
        type: 'note',
        title: 'Welcome to PLXN',
        x: 180,
        y: 180,
        width: 320,
        color: 'sage',
        content: 'Press "N" for notes, "T" for tasks, "M" for milestones. Drag nodes by their header, or drag from side dots to connect nodes.',
        checklist: [
          { id: 'w1', text: 'Drag this note around', done: true },
          { id: 'w2', text: 'Create a new task node with "T"', done: false },
          { id: 'w3', text: 'Connect two nodes with a bezier line', done: false },
        ],
      },
    ],
    connections: [],
  };
}
