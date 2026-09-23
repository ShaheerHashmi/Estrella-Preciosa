import React from 'react';
import { MOTIFS_DATA } from '../../data/motifs';
import { GlassMotifRenderer } from '../motifs/GlassMotifRenderer';

interface CathedralArchOptionProps {
  unlockedPanels: Set<number>;
  onSelectPanel: (panelId: number) => void;
  hoveredPanelId: number | null;
  setHoveredPanelId: (id: number | null) => void;
}

export const CathedralArchOption: React.FC<CathedralArchOptionProps> = ({
  unlockedPanels,
  onSelectPanel,
  hoveredPanelId,
  setHoveredPanelId,
}) => {
  // Coordinate grid: 900 wide x 1150 high Gothic Pointed Lancet Arch
  // Tier 4 (Apex): Panel 21 (Grand Pointed Keystone Medallion)
  // Tier 3 (Upper Arch): Panels 16, 17, 18, 19, 20 (5 Gothic Lancets)
  // Tier 2 (Mid Nave): Panels 11, 12, 13, 14, 15 (5 Gothic Lancets)
  // Tier 1 (Lower Nave): Panels 6, 7, 8, 9, 10 (5 Gothic Lancets)
  // Tier 0 (Basement Arcade): Panels 1, 2, 3, 4, 5 (5 Gothic Lancets)

  const leadColor = '#09090b';

  // Helper to generate pointed gothic arch path for a panel
  const getLancetPath = (x: number, y: number, w: number, h: number): string => {
    const archH = w * 0.75;
    const r = w * 0.9;
    return `
      M ${x},${y + h}
      L ${x},${y + archH}
      A ${r} ${r} 0 0 1 ${x + w / 2},${y}
      A ${r} ${r} 0 0 1 ${x + w},${y + archH}
      L ${x + w},${y + h}
      Z
    `.replace(/\s+/g, ' ').trim();
  };

  // Helper to generate pointed apex keystone path
  const getApexKeystonePath = (cx: number, cy: number, w: number, h: number): string => {
    return `
      M ${cx - w / 2},${cy + h / 2}
      L ${cx - w / 2},${cy}
      Q ${cx - w / 4},${cy - h / 2} ${cx},${cy - h / 1.8}
      Q ${cx + w / 4},${cy - h / 2} ${cx + w / 2},${cy}
      L ${cx + w / 2},${cy + h / 2}
      Z
    `.replace(/\s+/g, ' ').trim();
  };

  // Layout calculations for 5 columns
  const colWidth = 148;
  const colGap = 16;
  const startX = 64;
  const rowHeight = 175;
  const startY = 320;

  // Generate panel definitions
  const panels = [
    // Tier 0 (Lower arcade): 1 to 5
    ...[1, 2, 3, 4, 5].map((id, i) => ({
      id,
      x: startX + i * (colWidth + colGap),
      y: startY + 3 * (rowHeight + 14),
      w: colWidth,
      h: rowHeight,
      cx: startX + i * (colWidth + colGap) + colWidth / 2,
      cy: startY + 3 * (rowHeight + 14) + rowHeight / 2,
      shape: 'lancet' as const,
    })),
    // Tier 1 (Mid nave lower): 6 to 10
    ...[6, 7, 8, 9, 10].map((id, i) => ({
      id,
      x: startX + i * (colWidth + colGap),
      y: startY + 2 * (rowHeight + 14),
      w: colWidth,
      h: rowHeight,
      cx: startX + i * (colWidth + colGap) + colWidth / 2,
      cy: startY + 2 * (rowHeight + 14) + rowHeight / 2,
      shape: 'lancet' as const,
    })),
    // Tier 2 (Mid nave upper): 11 to 15
    ...[11, 12, 13, 14, 15].map((id, i) => ({
      id,
      x: startX + i * (colWidth + colGap),
      y: startY + 1 * (rowHeight + 14),
      w: colWidth,
      h: rowHeight,
      cx: startX + i * (colWidth + colGap) + colWidth / 2,
      cy: startY + 1 * (rowHeight + 14) + rowHeight / 2,
      shape: 'lancet' as const,
    })),
    // Tier 3 (Upper clerestory): 16 to 20
    ...[16, 17, 18, 19, 20].map((id, i) => ({
      id,
      x: startX + i * (colWidth + colGap),
      y: startY,
      w: colWidth,
      h: rowHeight,
      cx: startX + i * (colWidth + colGap) + colWidth / 2,
      cy: startY + rowHeight / 2,
      shape: 'lancet' as const,
    })),
    // Tier 4 (Apex Keystone Milestone 21)
    {
      id: 21,
      x: 450 - 140,
      y: 75,
      w: 280,
      h: 210,
      cx: 450,
      cy: 185,
      shape: 'apex' as const,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center p-2 sm:p-4">
      <svg
        viewBox="0 0 900 1150"
        className="w-full h-auto drop-shadow-2xl select-none"
        style={{
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95))',
        }}
      >
        {/* ========================================================================= */}
        {/* 1. OUTER HEAVY GOTHIC STONE WALL CASING & ARCH MULLIONS                   */}
        {/* ========================================================================= */}
        {/* Master Pointed Arch Outer Casing */}
        <path
          d="M 25,1130 L 25,480 A 425 425 0 0 1 450,20 A 425 425 0 0 1 875,480 L 875,1130 Z"
          fill="#09090b"
          stroke="#000000"
          strokeWidth="16"
        />
        <path
          d="M 45,1120 L 45,490 A 405 405 0 0 1 450,45 A 405 405 0 0 1 855,490 L 855,1120 Z"
          fill="#18181b"
          stroke="#27272a"
          strokeWidth="6"
        />

        {/* ========================================================================= */}
        {/* 2. CONTINUOUS EDGE-TO-EDGE SPANDREL & TRIFORIUM FILLER GLASS (Zero gaps) */}
        {/* ========================================================================= */}
        <g className="pointer-events-none">
          {/* Upper Tympanum Leaded Rose Windows in the Arch Spandrel */}
          {/* Left Upper Rose */}
          <circle cx="210" cy="180" r="75" fill="#1e3a8a" fillOpacity={0.6} stroke={leadColor} strokeWidth="5" />
          <circle cx="210" cy="180" r="45" fill="#7f1d1d" fillOpacity={0.7} stroke={leadColor} strokeWidth="3" />
          {/* Right Upper Rose */}
          <circle cx="690" cy="180" r="75" fill="#1e3a8a" fillOpacity={0.6} stroke={leadColor} strokeWidth="5" />
          <circle cx="690" cy="180" r="45" fill="#7f1d1d" fillOpacity={0.7} stroke={leadColor} strokeWidth="3" />

          {/* Interlocking Diamond Quarry Mosaic Tiles between all mullions */}
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={`spandrel-${i}`}>
              <polygon
                points={`55,${340 + i * 55} 70,${355 + i * 55} 55,${370 + i * 55} 40,${355 + i * 55}`}
                fill={i % 2 === 0 ? '#1e3a8a' : '#7f1d1d'}
                fillOpacity={0.5}
                stroke={leadColor}
                strokeWidth="2"
              />
              <polygon
                points={`845,${340 + i * 55} 860,${355 + i * 55} 845,${370 + i * 55} 830,${355 + i * 55}`}
                fill={i % 2 === 0 ? '#7f1d1d' : '#1e3a8a'}
                fillOpacity={0.5}
                stroke={leadColor}
                strokeWidth="2"
              />
            </g>
          ))}
        </g>

        {/* ========================================================================= */}
        {/* 3. THE 21 INTERLOCKING GOTHIC LANCET PANELS                               */}
        {/* ========================================================================= */}
        {panels.map((p) => {
          const motif = MOTIFS_DATA.find((m) => m.id === p.id)!;
          const isUnlocked = unlockedPanels.has(p.id);
          const isHovered = hoveredPanelId === p.id;
          const panelPath =
            p.shape === 'apex'
              ? getApexKeystonePath(p.cx, p.cy, p.w, p.h)
              : getLancetPath(p.x, p.y, p.w, p.h);

          const clipId = `cathedral-clip-${p.id}`;

          return (
            <g
              key={p.id}
              id={`lancet-panel-${p.id}`}
              onClick={() => onSelectPanel(p.id)}
              onMouseEnter={() => setHoveredPanelId(p.id)}
              onMouseLeave={() => setHoveredPanelId(null)}
              className="cursor-pointer transition-transform duration-200"
            >
              <defs>
                <clipPath id={clipId}>
                  <path d={panelPath} />
                </clipPath>
              </defs>

              {/* Base Stained Glass Field */}
              <path
                d={panelPath}
                fill={isUnlocked ? (p.id === 21 ? '#f59e0b' : motif.dominantColor) : '#1f1f23'}
                className="transition-colors duration-700"
              />

              {/* Clipped Mosaic Shards & Iconography */}
              <g clipPath={`url(#${clipId})`}>
                {/* Outer Glass Shard Border in panel */}
                <path
                  d={panelPath}
                  fill="none"
                  stroke={isUnlocked ? motif.secondaryColor : '#3f3f46'}
                  strokeWidth="22"
                  opacity={0.7}
                />
                <path
                  d={panelPath}
                  fill="none"
                  stroke={leadColor}
                  strokeWidth="2"
                  strokeDasharray="14 10"
                />

                {/* Stained Glass Artisan Motif Iconography */}
                <GlassMotifRenderer
                  motif={motif}
                  cx={p.cx}
                  cy={p.cy}
                  size={p.id === 21 ? 160 : 120}
                  isUnlocked={isUnlocked}
                  isHovered={isHovered}
                />
              </g>

              {/* Heavy Gothic Lead Came Framing */}
              <path
                d={panelPath}
                fill="none"
                stroke={leadColor}
                strokeWidth="7"
                strokeLinejoin="round"
                className="pointer-events-none"
              />
              <path
                d={panelPath}
                fill="none"
                stroke={isUnlocked ? motif.accentColor : '#52525b'}
                strokeWidth="2"
                strokeOpacity={isUnlocked ? 0.9 : 0.4}
                className="pointer-events-none transition-colors duration-500"
              />

              {/* Exact Geometric Hover Highlight Ring */}
              {isHovered && (
                <path
                  d={panelPath}
                  fill="none"
                  stroke={isUnlocked ? '#fef08a' : '#ffffff'}
                  strokeWidth="4.5"
                  strokeDasharray="12 6"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Outer Stone Sill Baseline */}
        <rect x="25" y="1110" width="850" height="28" fill="#18181b" stroke="#000000" strokeWidth="4" />
      </svg>
    </div>
  );
};
