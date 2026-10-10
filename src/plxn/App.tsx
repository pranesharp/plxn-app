'use client';

import React, { useState, useEffect } from 'react';
import { ProfileProvider } from './context/ProfileContext';
import { ProjectProvider, useProjectContext } from './context/ProjectContext';
import { TaskListProvider } from './context/TaskListContext';
import { AccentProvider } from './context/AccentContext';
import { Spine } from './components/Spine/Spine';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Canvas } from './components/Canvas/Canvas';

const Shell: React.FC = () => {
  const { viewMode, activeProject, theme } = useProjectContext();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [spineOpen, setSpineOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Side-panel toggle dispatched by the Topbar
  useEffect(() => {
    const onToggle = () => setIsSidePanelOpen((v) => !v);
    window.addEventListener('plxn:toggle-sidepanel', onToggle);
    return () => window.removeEventListener('plxn:toggle-sidepanel', onToggle);
  }, []);

  return (
    <div className="relative flex w-screen h-screen overflow-hidden bg-[#F4F0E6] dark:bg-[#15140F] text-[#1A1814] dark:text-[#F2EEE2] font-sans selection:bg-[var(--lime)] selection:text-[#1A1814]">
      {/* Paper grain overlay */}
      <div className="paper-noise" aria-hidden="true" />

      {/* Left Spine — static on desktop, slide-over drawer on mobile */}
      <Spine open={spineOpen} onClose={() => setSpineOpen(false)} />

      {/* Main area: topbar + content */}
      <div className="relative z-10 flex flex-1 flex-col w-full h-full min-w-0">
        <Topbar onOpenSpine={() => setSpineOpen(true)} />

        <div className="flex-1 w-full overflow-hidden relative">
          {viewMode === 'dashboard' || !activeProject ? (
            <Dashboard />
          ) : (
            <Canvas
              project={activeProject}
              isSidePanelOpen={isSidePanelOpen}
              onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function PlxnApp() {
  return (
    <ProfileProvider>
      <ProjectProvider>
        <TaskListProvider>
          <AccentProvider>
            <Shell />
          </AccentProvider>
        </TaskListProvider>
      </ProjectProvider>
    </ProfileProvider>
  );
}
