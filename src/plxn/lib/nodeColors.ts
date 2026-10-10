import type { NodeColor } from '../types';

/**
 * Workbench node color system.
 *  - tint:  subtle card surface tint (per color)
 *  - border: unified ink border (brut). Same for all colors.
 *  - accent: solid dot color (minimap, picker)
 *  - bar:    gradient classes for the node's top accent strip
 *  - label:  human label
 */
export const COLOR_MAP: Record<
  NodeColor,
  { bg: string; border: string; accent: string; bar: string; label: string }
> = {
  neutral: {
    bg: 'bg-[#FBF8F1] dark:bg-[#1F1D17]',
    border: 'border-[#1A1814] dark:border-[#F2EEE2]',
    accent: 'bg-stone-500',
    bar: 'from-stone-400 to-stone-500',
    label: 'Neutral',
  },
  sage: {
    bg: 'bg-[#EEF6E8] dark:bg-[#18221A]',
    border: 'border-[#1A1814] dark:border-[#F2EEE2]',
    accent: 'bg-emerald-500',
    bar: 'from-emerald-400 to-teal-500',
    label: 'Sage',
  },
  sky: {
    bg: 'bg-[#E8F1F8] dark:bg-[#16212C]',
    border: 'border-[#1A1814] dark:border-[#F2EEE2]',
    accent: 'bg-sky-500',
    bar: 'from-sky-400 to-cyan-500',
    label: 'Sky',
  },
  amber: {
    bg: 'bg-[#FAF1DD] dark:bg-[#241E13]',
    border: 'border-[#1A1814] dark:border-[#F2EEE2]',
    accent: 'bg-amber-500',
    bar: 'from-amber-400 to-orange-500',
    label: 'Amber',
  },
  lavender: {
    bg: 'bg-[#F1ECF8] dark:bg-[#1E1A2B]',
    border: 'border-[#1A1814] dark:border-[#F2EEE2]',
    accent: 'bg-violet-500',
    bar: 'from-violet-400 to-fuchsia-500',
    label: 'Lavender',
  },
  rose: {
    bg: 'bg-[#FAEAEC] dark:bg-[#26161A]',
    border: 'border-[#1A1814] dark:border-[#F2EEE2]',
    accent: 'bg-rose-500',
    bar: 'from-rose-400 to-pink-500',
    label: 'Rose',
  },
  slate: {
    bg: 'bg-[#EEF1F4] dark:bg-[#181C24]',
    border: 'border-[#1A1814] dark:border-[#F2EEE2]',
    accent: 'bg-slate-500',
    bar: 'from-slate-400 to-slate-500',
    label: 'Slate',
  },
};

export function nodeAccentBar(color: NodeColor): string {
  return COLOR_MAP[color]?.bar ?? COLOR_MAP.neutral.bar;
}

export const DEFAULT_CONNECTION_COLOR = '#1A1814';
