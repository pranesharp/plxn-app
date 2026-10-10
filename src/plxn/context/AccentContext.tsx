'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'plxn_accent_v1';

export type AccentMode = 'static' | 'rgb';

export interface AccentPreset {
  id: string;
  name: string;
  color: string; // hex
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'lime', name: 'Lime', color: '#C6F135' },
  { id: 'coral', name: 'Coral', color: '#FF6B5B' },
  { id: 'sky', name: 'Sky', color: '#38BDF8' },
  { id: 'violet', name: 'Violet', color: '#A78BFA' },
  { id: 'amber', name: 'Amber', color: '#F59E0B' },
  { id: 'emerald', name: 'Emerald', color: '#10B981' },
  { id: 'rose', name: 'Rose', color: '#FB7185' },
  { id: 'cyan', name: 'Cyan', color: '#22D3EE' },
];

interface AccentContextType {
  mode: AccentMode;
  color: string; // current resolved accent color (hex). In RGB mode this updates ~10/s.
  presetId: string | null; // which preset is selected (null if custom/rgb)
  speed: number; // 1..10, used in RGB mode
  setStatic: (presetId: string) => void;
  setRgb: () => void;
  setSpeed: (n: number) => void;
}

const AccentContext = createContext<AccentContextType | undefined>(undefined);

interface Stored {
  mode: AccentMode;
  presetId: string | null;
  speed: number;
}

function loadStored(): Stored {
  if (typeof window === 'undefined') return { mode: 'static', presetId: 'lime', speed: 4 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Stored;
      if (p && (p.mode === 'static' || p.mode === 'rgb')) return p;
    }
  } catch {
    // ignore
  }
  return { mode: 'static', presetId: 'lime', speed: 4 };
}

function saveStored(s: Stored) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

/** Convert HSL to hex. */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Apply a hex accent color to the CSS variables on :root. */
function applyAccent(hex: string) {
  const root = document.documentElement;
  root.style.setProperty('--lime', hex);
  root.style.setProperty('--primary', hex);
  root.style.setProperty('--ring', hex);
  root.style.setProperty('--sidebar-primary', hex);
  root.style.setProperty('--sidebar-ring', hex);
  root.style.setProperty('--chart-1', hex);
  // The accent's readable foreground stays ink (accents are kept bright enough).
  // sidebar-primary-foreground + primary-foreground = ink in light, paper in dark.
  // Those are already set in globals.css; keep them.
}

export const AccentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stored, setStored] = useState<Stored>(() => loadStored());
  const [color, setColor] = useState<string>(() => {
    const p = ACCENT_PRESETS.find((x) => x.id === (loadStored().presetId || 'lime'));
    return p ? p.color : '#C6F135';
  });
  const hueRef = useRef<number>(0);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist
  useEffect(() => {
    saveStored(stored);
  }, [stored]);

  // (Re)start/stop the RGB cycle
  useEffect(() => {
    if (rafRef.current) {
      clearInterval(rafRef.current);
      rafRef.current = null;
    }
    if (stored.mode !== 'rgb') {
      // static: apply the preset color once
      const p = ACCENT_PRESETS.find((x) => x.id === (stored.presetId || 'lime'));
      const hex = p ? p.color : '#C6F135';
      applyAccent(hex);
      setColor(hex);
      return;
    }
    // rgb mode: cycle hue. speed 1..10 → step per 60ms. slow=0.4deg/tick, fast=4deg/tick.
    const step = 0.4 + (stored.speed / 10) * 3.6;
    hueRef.current = hueRef.current || 0;
    rafRef.current = setInterval(() => {
      hueRef.current = (hueRef.current + step) % 360;
      const hex = hslToHex(hueRef.current, 78, 62);
      applyAccent(hex);
      setColor(hex);
    }, 60);
    return () => {
      if (rafRef.current) clearInterval(rafRef.current);
    };
  }, [stored.mode, stored.presetId, stored.speed]);

  // Apply on mount (in case effect hasn't run yet for SSR)
  useEffect(() => {
    if (stored.mode === 'static') {
      const p = ACCENT_PRESETS.find((x) => x.id === (stored.presetId || 'lime'));
      applyAccent(p ? p.color : '#C6F135');
    }
    // rgb handled by the interval effect
  }, []);

  const setStatic = useCallback((presetId: string) => {
    setStored({ mode: 'static', presetId, speed: stored.speed });
  }, [stored.speed]);

  const setRgb = useCallback(() => {
    setStored({ mode: 'rgb', presetId: stored.presetId, speed: stored.speed });
  }, [stored.presetId, stored.speed]);

  const setSpeed = useCallback((n: number) => {
    setStored((prev) => ({ ...prev, speed: Math.max(1, Math.min(10, n)) }));
  }, []);

  return (
    <AccentContext.Provider
      value={{
        mode: stored.mode,
        color,
        presetId: stored.mode === 'static' ? stored.presetId : null,
        speed: stored.speed,
        setStatic,
        setRgb,
        setSpeed,
      }}
    >
      {children}
    </AccentContext.Provider>
  );
};

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error('useAccent must be used within an AccentProvider');
  return ctx;
}
