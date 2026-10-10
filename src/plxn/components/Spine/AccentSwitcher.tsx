'use client';

import React, { useState } from 'react';
import { useAccent, ACCENT_PRESETS } from '../../context/AccentContext';
import { Palette, Gauge, Check } from 'lucide-react';

export const AccentSwitcher: React.FC = () => {
  const { mode, color, presetId, speed, setStatic, setRgb, setSpeed } = useAccent();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Accent color"
        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs text-[#1A1814] dark:text-[#F2EEE2] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
      >
        <Palette className="w-3.5 h-3.5" strokeWidth={2.25} />
        <span
          className="w-3.5 h-3.5 border border-[#1A1814] dark:border-[#F2EEE2]"
          style={{ backgroundColor: color }}
        />
      </button>

      {open && (
        <>
          {/* click-away */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute bottom-full mb-2 left-0 w-64 p-3 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm z-50 plxn-pop"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B]">
                Accent
              </span>
              <span
                className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border"
                style={{ borderColor: color, color }}
              >
                {mode === 'rgb' ? 'RGB' : 'static'}
              </span>
            </div>

            {/* Preset swatches */}
            <div className="grid grid-cols-8 gap-1.5 mb-3">
              {ACCENT_PRESETS.map((p) => {
                const active = mode === 'static' && presetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setStatic(p.id)}
                    title={p.name}
                    className="relative aspect-square border-2 border-[#1A1814] dark:border-[#F2EEE2] hover:scale-110 transition-transform"
                    style={{ backgroundColor: p.color }}
                  >
                    {active && (
                      <Check
                        className="w-2.5 h-2.5 absolute inset-0 m-auto text-[#1A1814]"
                        strokeWidth={3.5}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* RGB toggle */}
            <button
              onClick={() => (mode === 'rgb' ? setStatic(presetId || 'lime') : setRgb())}
              className={`w-full flex items-center justify-center gap-2 py-2 mb-2.5 border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                mode === 'rgb'
                  ? 'text-[#1A1814] dark:text-[#15140F]'
                  : 'bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]'
              }`}
              style={mode === 'rgb' ? { backgroundColor: color } : undefined}
            >
              <span
                className="w-2.5 h-2.5 border border-[#1A1814] dark:border-[#F2EEE2]"
                style={{ backgroundColor: color }}
              />
              RGB Cycle {mode === 'rgb' ? 'On' : 'Off'}
            </button>

            {/* Speed slider (only in RGB mode) */}
            <div
              className={`transition-opacity ${
                mode === 'rgb' ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#6B6356] dark:text-[#A39B8B]">
                  <Gauge className="w-3 h-3" strokeWidth={2.25} />
                  Speed
                </span>
                <span className="font-mono text-[10px] tabular-nums text-[#1A1814] dark:text-[#F2EEE2]">
                  {speed}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="plxn-range w-full"
                disabled={mode !== 'rgb'}
              />
              <div className="flex justify-between mt-1 font-mono text-[9px] uppercase tracking-wider text-[#9A907F] dark:text-[#6E6759]">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
