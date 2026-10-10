'use client';

import React, { useState, useMemo } from 'react';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { ProjectCard } from '@/plxn/components/Dashboard/ProjectCard';
import { NewProjectModal } from '@/plxn/components/Dashboard/NewProjectModal';
import {
  Plus,
  Search,
  ArrowUpDown,
  FolderKanban,
  X,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    projects,
    openProject,
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    selectedTag,
    setSelectedTag,
  } = useProjectContext();
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'progress'>('recent');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Filter and sort projects.
  // filterMode + selectedTag come from context (the Spine owns their UI).
  // searchQuery is also shared with the Topbar via context.
  // sortBy stays local — it is dashboard-specific.
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    // Filter by mode
    if (filterMode === 'pinned') {
      list = list.filter((p) => p.pinned);
    } else if (filterMode === 'recent') {
      const oneWeekAgo = Date.now() - 7 * 86400000;
      list = list.filter((p) => p.updatedAt >= oneWeekAgo);
    }

    // Filter by tag (set from the Spine)
    if (selectedTag) {
      list = list.filter((p) => (p.tags || []).includes(selectedTag));
    }

    // Search query: searches title, description, tags, AND node contents
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        const matchesNodes = p.nodes.some(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            (n.content && n.content.toLowerCase().includes(q))
        );
        return matchesTitle || matchesDesc || matchesTags || matchesNodes;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'progress') {
        const getPct = (p: typeof a) => {
          const t = p.nodes.filter((n) => n.type === 'task');
          return t.length > 0 ? t.filter((n) => n.status === 'done').length / t.length : 0;
        };
        return getPct(b) - getPct(a);
      }
      // default: recent
      return b.updatedAt - a.updatedAt;
    });

    return list;
  }, [projects, filterMode, selectedTag, searchQuery, sortBy]);

  const filterTabs: Array<{ mode: 'all' | 'pinned' | 'recent'; label: string }> = [
    { mode: 'all', label: 'All' },
    { mode: 'pinned', label: 'Pinned' },
    { mode: 'recent', label: 'Recent' },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-transparent overflow-hidden relative">
      {/* Faded giant background wordmark behind everything */}
      <span
        className="bg-wordmark absolute bottom-2 right-4 text-[8rem] sm:text-[12rem] pointer-events-none select-none"
        aria-hidden="true"
      >
        PLXN
      </span>

      <div className="plxn-scroll flex-1 overflow-y-auto relative z-10">
        <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 py-6 sm:py-8 space-y-6">
          {/* Editorial Heading Row */}
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 plxn-rise">
            <div className="relative">
              {/* Faded big section numeral behind heading */}
              <span
                className="section-num text-[5.5rem] sm:text-[7rem] absolute -top-10 sm:-top-14 -left-1 sm:-left-3 pointer-events-none select-none leading-none"
                aria-hidden="true"
              >
                01
              </span>
              <div className="relative flex items-center gap-3 flex-wrap">
                <h1 className="display text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1814] dark:text-[#F2EEE2]">
                  Workspace Plans
                </h1>
                <span className="rubber-stamp">Workspace</span>
              </div>
              <p className="relative mt-1.5 text-xs text-[#6B6356] dark:text-[#A39B8B] max-w-xl">
                Visual pipeline canvases, execution workflows, and spatial plans.
              </p>
              <div className="relative mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A907F] dark:text-[#6E6759]">
                <span>
                  Filed {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
                </span>
                <span>·</span>
                <span>Sheet 01 of 04</span>
              </div>
            </div>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#1A1814] dark:text-[#15140F] bg-[var(--lime)] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm brut-hover rounded-none whitespace-nowrap"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>New Plan</span>
            </button>
          </div>

          {/* Toolbar Row: Search + Filter Tabs + Sort Selector */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 plxn-rise" style={{ animationDelay: '40ms' }}>
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B6356] dark:text-[#A39B8B]"
                strokeWidth={2.5}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plans, tasks, notes…"
                className="w-full pl-8 pr-7 py-2 text-xs bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] rounded-none focus:outline-none focus:bg-[var(--lime)]/20 text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#9A907F] dark:placeholder:text-[#6E6759]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2]"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Tabs — brut-xs buttons, active = lime */}
              <div className="flex items-center gap-1.5">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.mode}
                    onClick={() => setFilterMode(tab.mode)}
                    className={`px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide border-[1.5px] border-[#1A1814] dark:border-[#F2EEE2] brut-xs rounded-none ${
                      filterMode === tab.mode
                        ? 'bg-[var(--lime)] text-[#1A1814]'
                        : 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort Selector — brut-xs wrapper */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide border-[1.5px] border-[#1A1814] dark:border-[#F2EEE2] brut-xs rounded-none bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2]">
                <ArrowUpDown className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent focus:outline-none cursor-pointer pr-1 text-[11px] font-semibold uppercase tracking-wide appearance-none"
                >
                  <option value="recent">Recent</option>
                  <option value="alphabetical">A–Z</option>
                  <option value="progress">Progress</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Tag Filter Indicator (tag set from Spine) */}
          {selectedTag && (
            <div className="flex items-center gap-2.5 text-xs text-[#6B6356] dark:text-[#A39B8B] plxn-rise">
              <span>Filtering by tag</span>
              <span className="rubber-stamp rubber-stamp--lime">#{selectedTag}</span>
              <button
                onClick={() => setSelectedTag(null)}
                className="underline underline-offset-2 hover:text-[#1A1814] dark:hover:text-[#F2EEE2]"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Project Grid OR Empty State */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
              {filteredProjects.map((project, i) => (
                <div
                  key={project.id}
                  className="plxn-rise"
                  style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}
                >
                  <ProjectCard
                    project={project}
                    onOpen={() => openProject(project.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State — dashed brut-style card with lime CTA */
            <div className="border-2 border-dashed border-[#1A1814] dark:border-[#3A372F] p-10 sm:p-14 flex flex-col items-center justify-center text-center shadow-[4px_4px_0_0_var(--shadow)] rounded-none plxn-rise">
              <div className="w-12 h-12 mb-4 bg-[#1A1814] dark:bg-[#F2EEE2] flex items-center justify-center text-[var(--lime)] dark:text-[#15140F] border-[1.5px] border-[#1A1814] dark:border-[#F2EEE2] brut-xs">
                <FolderKanban className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="display text-2xl font-semibold mb-1.5 text-[#1A1814] dark:text-[#F2EEE2]">
                {searchQuery || selectedTag ? 'No matching plans found' : 'No plans yet'}
              </h3>
              <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] max-w-sm mb-5 leading-relaxed">
                {searchQuery || selectedTag
                  ? 'Try adjusting your search terms or clearing active filters to find what you need.'
                  : 'Get started by creating your first infinite canvas plan or choose from prebuilt workflow templates.'}
              </p>
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1A1814] dark:text-[#15140F] bg-[var(--lime)] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm brut-hover rounded-none"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Create First Plan</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />
    </div>
  );
};
