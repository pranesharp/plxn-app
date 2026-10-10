'use client';

import React, { useRef, useState } from 'react';
import { NodeItem, CanvasViewport } from '@/plxn/types';
import { getCanvasBounds } from '@/plxn/utils/canvasMath';
import { COLOR_MAP } from '@/plxn/lib/nodeColors';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface MinimapProps {
  nodes: NodeItem[];
  viewport: CanvasViewport;
  containerWidth: number;
  containerHeight: number;
  onNavigate: (x: number, y: number) => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  nodes,
  viewport,
  containerWidth,
  containerHeight,
  onNavigate,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Map geometry
  const MAP_WIDTH = 180;
  const MAP_HEIGHT = 120;

  const bounds = getCanvasBounds(nodes, 200);
  const scaleX = MAP_WIDTH / bounds.width;
  const scaleY = MAP_HEIGHT / bounds.height;
  const mapScale = Math.min(scaleX, scaleY, 0.15);

  const offsetX = (MAP_WIDTH - bounds.width * mapScale) / 2;
  const offsetY = (MAP_HEIGHT - bounds.height * mapScale) / 2;

  // Viewport rect calculation in canvas coordinates
  const viewCanvasX = -viewport.x / viewport.zoom;
  const viewCanvasY = -viewport.y / viewport.zoom;
  const viewCanvasW = containerWidth / viewport.zoom;
  const viewCanvasH = containerHeight / viewport.zoom;

  // Map rect in minimap pixel coordinates
  const vpMapX = (viewCanvasX - bounds.minX) * mapScale + offsetX;
  const vpMapY = (viewCanvasY - bounds.minY) * mapScale + offsetY;
  const vpMapW = viewCanvasW * mapScale;
  const vpMapH = viewCanvasH * mapScale;

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - offsetX;
    const clickY = e.clientY - rect.top - offsetY;

    const targetCanvasX = bounds.minX + clickX / mapScale;
    const targetCanvasY = bounds.minY + clickY / mapScale;

    // Center camera at target
    const newViewportX = containerWidth / 2 - targetCanvasX * viewport.zoom;
    const newViewportY = containerHeight / 2 - targetCanvasY * viewport.zoom;
    onNavigate(newViewportX, newViewportY);
  };

  return (
    <div className="absolute bottom-4 right-4 z-30 select-none">
      <div className="bg-[#FBF8F1]/95 dark:bg-[#1F1D17]/95 border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm overflow-hidden transition-all">
        {/* Header bar */}
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 text-[11px] text-[#6B6356] dark:text-[#A39B8B] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <span>Navigator</span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2] transition-colors"
          >
            {collapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Minimap Body */}
        {!collapsed && (
          <div
            ref={mapRef}
            onClick={handleMinimapClick}
            style={{ width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px` }}
            className="relative bg-[#ECE6D6]/80 dark:bg-[#0E0D0A]/80 cursor-crosshair overflow-hidden canvas-grid-dots"
          >
            {/* Render Node Dots/Boxes */}
            {nodes.map((node) => {
              const nx = (node.x - bounds.minX) * mapScale + offsetX;
              const ny = (node.y - bounds.minY) * mapScale + offsetY;
              const nw = Math.max((node.width || 280) * mapScale, 4);
              const nh = Math.max((node.height || 140) * mapScale, 4);
              const colorConfig = COLOR_MAP[node.color] || COLOR_MAP.neutral;

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${nx}px`,
                    top: `${ny}px`,
                    width: `${nw}px`,
                    height: `${nh}px`,
                  }}
                  className={`absolute rounded-[1px] ${colorConfig.accent} opacity-70`}
                />
              );
            })}

            {/* Viewport Box */}
            <div
              style={{
                left: `${Math.max(0, vpMapX)}px`,
                top: `${Math.max(0, vpMapY)}px`,
                width: `${Math.max(8, vpMapW)}px`,
                height: `${Math.max(8, vpMapH)}px`,
              }}
              className="absolute border-2 border-[#1A1814] dark:border-[#F2EEE2] bg-[var(--lime)]/20 pointer-events-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
