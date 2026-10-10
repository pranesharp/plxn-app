import { Project } from '../types';
import { TEMPLATES } from '../data/templates';

const STORAGE_KEY = 'plxn_projects_v3';
const THEME_KEY = 'plxn_theme_mode';
const PROFILE_KEY = 'plxn_profile_v1';

export function generateUniqueId(prefix: string = 'proj'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function loadProjectsFromStorage(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const seenIds = new Set<string>();
        let hasDuplicates = false;
        const deduplicated = parsed.map((p) => {
          let id = p.id;
          if (!id || seenIds.has(id)) {
            id = generateUniqueId('proj');
            hasDuplicates = true;
          }
          seenIds.add(id);
          return { ...p, id };
        });

        if (hasDuplicates) {
          saveProjectsToStorage(deduplicated);
        }
        return deduplicated;
      }
    }
  } catch (err) {
    console.error('Failed to parse projects from storage', err);
  }

  // First-ever visit: seed with two starter templates
  const initialProjects: Project[] = [
    { ...TEMPLATES[0].createProject(), id: generateUniqueId('proj') },
    { ...TEMPLATES[1].createProject(), id: generateUniqueId('proj') },
  ];
  saveProjectsToStorage(initialProjects);
  return initialProjects;
}

export function saveProjectsToStorage(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to storage', err);
  }
}

export function exportProjectToJson(project: Project): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const cleanTitle = project.title.toLowerCase().replace(/[^a-z0-9]/gi, '_');
  downloadAnchor.setAttribute('download', `plxn_plan_${cleanTitle}_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportAllProjectsToJson(projects: Project[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `plxn_all_workspaces_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function getThemePreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // fallback
  }
  return 'light';
}

export function setThemePreference(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch {
    // fallback
  }
}

// ---- Local profile (replaces Firebase auth) ----

export interface LocalProfile {
  name: string;
  email?: string;
  createdAt: number;
}

export function loadProfile(): LocalProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as LocalProfile;
  } catch {
    // ignore
  }
  return null;
}

export function saveProfile(profile: LocalProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    // ignore
  }
}
