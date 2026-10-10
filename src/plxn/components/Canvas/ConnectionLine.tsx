'use client';

import React, { useState } from 'react';
import { Connection, NodeItem } from '@/plxn/types';
import { calculateBezierCurve, getNodeHandlePosition } from '@/plxn/utils/canvasMath';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { DEFAULT_CONNECTION_COLOR } from '@/plxn/lib/nodeColors';
import { X, Edit2, Check } from 'lucide-react';

interface ConnectionLineProps {
  connection: Connection;
  sourceNode: NodeItem;
  targetNode: NodeItem;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  sourceNode,
  targetNode,
  isSelected,
  onSelect,
}) => {
  const { updateConnection, deleteConnection } = useProjectContext();
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelText, setLabelText] = useState(connection.label || '');

  // Calculate coordinates for connection handles
  const sourcePos = getNodeHandlePosition(sourceNode, connection.sourceHandle || 'right');
  const targetPos = getNodeHandlePosition(targetNode, connection.targetHandle || 'left');

  const pathData = calculateBezierCurve(
    sourcePos.x,
    sourcePos.y,
    targetPos.x,
    targetPos.y,
    connection.sourceHandle || 'right',
    connection.targetHandle || 'left'
  );

  // Midpoint for connection label badge
  const midX = (sourcePos.x + targetPos.x) / 2;
  const midY = (sourcePos.y + targetPos.y) / 2;

  const handleSaveLabel = () => {
    updateConnection(connection.id, { label: labelText.trim() });
    setIsEditingLabel(false);
  };

  // Ink color is the default; individual connections may override.
  const color = connection.color || DEFAULT_CONNECTION_COLOR;

  return (
    <g className="group cursor-pointer" onClick={onSelect}>
      {/* Invisible wider stroke for easy click interaction */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth="24"
        className="pointer-events-auto"
      />

      {/* Selected glow — ink */}
      {isSelected && (
        <path
          d={pathData}
          fill="none"
          stroke="#1A1814"
          strokeWidth="6"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />
      )}

      {/* Visible Bezier Curve */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={isSelected ? '2.5' : '1.8'}
        strokeDasharray={connection.animated ? '6 4' : undefined}
        markerEnd={`url(#arrow-${connection.id})`}
        className="transition-all duration-150 group-hover:stroke-[#1A1814] dark:group-hover:stroke-[#F2EEE2]"
      />

      {/* Arrow Marker */}
      <defs>
        <marker
          id={`arrow-${connection.id}`}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
        </marker>
      </defs>

      {/* Connection Label / Actions Badge at midpoint */}
      <foreignObject
        x={midX - 70}
        y={midY - 14}
        width="140"
        height="32"
        className="overflow-visible pointer-events-auto"
      >
        <div className="flex items-center justify-center">
          {isEditingLabel ? (
            <div
              className="flex items-center gap-1 bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs px-1.5 py-0.5 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                autoFocus
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveLabel();
                  if (e.key === 'Escape') setIsEditingLabel(false);
                }}
                placeholder="Label..."
                className="w-16 bg-transparent text-[11px] text-[#1A1814] dark:text-[#F2EEE2] focus:outline-none"
              />
              <button
                onClick={handleSaveLabel}
                className="p-0.5 hover:text-[#6B8F16] dark:hover:text-[var(--lime)]"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : connection.label || isSelected ? (
            <div
              className={
                isSelected
                  ? 'flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs transition-all'
                  : 'flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-xs transition-all'
              }
            >
              <span className="truncate max-w-[80px]">
                {connection.label || 'Connected'}
              </span>

              {isSelected && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingLabel(true);
                    }}
                    title="Edit label"
                    className="p-0.5 opacity-70 hover:opacity-100"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConnection(connection.id);
                    }}
                    title="Delete connection"
                    className="p-0.5 opacity-70 hover:opacity-100 hover:text-[#D14530] dark:hover:text-[#E5573F]"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
};
