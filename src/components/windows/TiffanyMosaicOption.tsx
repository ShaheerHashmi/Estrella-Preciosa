import React from 'react';
import { MOTIFS_DATA } from '../../data/motifs';
import { GlassMotifRenderer } from '../motifs/GlassMotifRenderer';

interface TiffanyMosaicOptionProps {
  unlockedPanels: Set<number>;
  onSelectPanel: (panelId: number) => void;
  hoveredPanelId: number | null;
  setHoveredPanelId: (id: number | null) => void;
}

export const TiffanyMosaicOption: React.FC<TiffanyMosaicOptionProps> = ({
  unlockedPanels,
  onSelectPanel,
  hoveredPanelId,
  setHoveredPanelId,
}) => {
  // 1000 x 850 Art Nouveau / Tiffany Leaded Window
  // 21 flowing panels:
  // Center Heart: Panel 21 (Grand Iridescent Lotus Roundel)
  // Inner Botanical Ring: Panels 1 to 8 (8 Petal Tesserae)
  // Outer Whiplash Ring: Panels 9 to 20 (12 Scalloped Jewel Facets)
  // The rest of the entire canvas is filled with interlocking Tiffany wisteria & emerald foliage leaded glass!

  const cx = 500;
  const cy = 425;
  const leadColor = '#09090b';

  // Inner ring: 8 flowing organic petals
  const innerPanels = [1, 2, 3, 4, 5, 6, 7, 8].map((id, index) => {
    const angleDeg = index * 45 - 90;
    const angleRad = angleDeg * (Math.PI / 180);
    const r = 210;
    return {
      id,
      cx: cx + r * Math.cos(angleRad),
      cy: cy + r * Math.sin(angleRad),
      radius: 68,
      angleDeg,
    };
  });

  // Outer ring: 12 flowing botanical facets
  const outerPanels = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((id, index) => {
    const angleDeg = index * 30 - 75;
    const angleRad = angleDeg * (Math.PI / 180);
    const r = 350;
    return {
      id,
      cx: cx + r * Math.cos(angleRad),
      cy: cy + r * Math.sin(angleRad),
      radius: 60,
      angleDeg,
    };
  });

  // Helper for organic whiplash curved medallion
  const getOrganicPetalPath = (px: number, py: number, r: number, angleDeg: number): string => {
    // Elegant squircle with soft organic curves
    const w = r * 1.85;
    const h = r * 1.85;
    const rx = r * 0.45;
    return `
      M ${px - w / 2 + rx},${py - h / 2}
      L ${px + w / 2 - rx},${py - h / 2}
      Q ${px + w / 2},${py - h / 2} ${px + w / 2},${py - h / 2 + rx}
      L ${px + w / 2},${py + h / 2 - rx}
      Q ${px + w / 2},${py + h / 2} ${px + w / 2 - rx},${py + h / 2}
      L ${px - w / 2 + rx},${py + h / 2}
      Q ${px - w / 2},${py + h / 2} ${px - w / 2},${py + h / 2 - rx}
      L ${px - w / 2},${py - h / 2 + rx}
      Q ${px - w / 2},${py - h / 2} ${px - w / 2 + rx},${py - h / 2}
      Z
    `.replace(/\s+/g, ' ').trim();
  };

  // Center lotus roundel path
  const getCenterLotusPath = (cx: number, cy: number, r: number): string => {
    const lobes = 16;
    const lobeR = r * 0.22;
    const ringR = r * 0.78;
    let path = '';
    for (let i = 0; i < lobes; i++) {
      const a1 = (i * (360 / lobes)) * (Math.PI / 180);
      const a2 = ((i + 1) * (360 / lobes)) * (Math.PI / 180);
      const lx = cx + ringR * Math.cos(a1);
      const ly = cy + ringR * Math.sin(a1);
      const nx = cx + ringR * Math.cos(a2);
      const ny = cy + ringR * Math.sin(a2);
      if (i === 0) path += `M ${lx},${ly} `;
      path += `A ${lobeR} ${lobeR} 0 0 1 ${nx},${ny} `;
    }
    path += 'Z';
    return path.trim();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center p-2 sm:p-4">
      <svg
        viewBox="0 0 1000 850"
        className="w-full h-auto drop-shadow-2xl select-none"
        style={{
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95))',
        }}
      >
        {/* ========================================================================= */}
        {/* 1. SOLID TIFFANY SOLID WALNUT WOOD & HEAVY LEAD PERIMETER FRAME           */}
        {/* ========================================================================= */}
        <rect x="15" y="15" width="970" height="820" rx="36" fill="#18181b" stroke="#000000" strokeWidth="16" />
        <rect x="35" y="35" width="930" height="780" rx="24" fill="#09090b" stroke="#27272a" strokeWidth="6" />

        {/* ========================================================================= */}
        {/* 2. CONTINUOUS TIFFANY WISTERIA & IRIDESCENT OPALESCENT FILLER GLASS (No gaps) */}
        {/* ========================================================================= */}
        <g className="pointer-events-none">
          {/* Cascading Leaded Wisteria Clusters in Corners */}
          {[
            { x: 120, y: 120 },
            { x: 880, y: 120 },
            { x: 120, y: 730 },
            { x: 880, y: 730 },
          ].map((c, idx) => (
            <g key={`wisteria-${idx}`}>
              <circle cx={c.x} cy={c.y} r="85" fill="#4338ca" fillOpacity={0.65} stroke={leadColor} strokeWidth="4" />
              <circle cx={c.x} cy={c.y} r="55" fill="#7c3aed" fillOpacity={0.7} stroke={leadColor} strokeWidth="3" />
              <circle cx={c.x} cy={c.y} r="25" fill="#059669" fillOpacity={0.75} stroke={leadColor} strokeWidth="2.5" />
            </g>
          ))}

          {/* Interlocking Leaded Whiplash Vine Ribbons (Connecting all panels continuously) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5) * (Math.PI / 180);
            const x1 = cx + 110 * Math.cos(angle);
            const y1 = cy + 110 * Math.sin(angle);
            const x2 = cx + 430 * Math.cos(angle);
            const y2 = cy + 430 * Math.sin(angle);
            return (
              <path
                key={`vine-${i}`}
                d={`M ${x1},${y1} Q ${cx + 280 * Math.cos(angle + 0.2)},${cy + 280 * Math.sin(angle + 0.2)} ${x2},${y2}`}
                fill="none"
                stroke={leadColor}
                strokeWidth="5"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* ========================================================================= */}
        {/* 3. THE 21 INTERLOCKING TIFFANY ART NOUVEAU PANELS                         */}
        {/* ========================================================================= */}

        {/* Outer Ring: 12 Panels (9 to 20) */}
        {outerPanels.map((p) => {
          const motif = MOTIFS_DATA.find((m) => m.id === p.id)!;
          const isUnlocked = unlockedPanels.has(p.id);
          const isHovered = hoveredPanelId === p.id;
          const panelPath = getOrganicPetalPath(p.cx, p.cy, p.radius, p.angleDeg);
          const clipId = `tiffany-clip-${p.id}`;

          return (
            <g
              key={p.id}
              id={`tiffany-panel-${p.id}`}
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

              {/* Base Favrile / Opalescent Glass Fill */}
              <path
                d={panelPath}
                fill={isUnlocked ? motif.dominantColor : '#222226'}
                className="transition-colors duration-700"
              />

              {/* Clipped Artwork & Shards */}
              <g clipPath={`url(#${clipId})`}>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.radius * 0.9}
                  fill="none"
                  stroke={isUnlocked ? motif.secondaryColor : '#3f3f46'}
                  strokeWidth="16"
                  opacity={0.6}
                />
                <GlassMotifRenderer
                  motif={motif}
                  cx={p.cx}
                  cy={p.cy}
                  size={p.radius * 1.8}
                  isUnlocked={isUnlocked}
                  isHovered={isHovered}
                />
              </g>

              {/* Heavy Copper Foil / Leaded Edge */}
              <path
                d={panelPath}
                fill="none"
                stroke={leadColor}
                strokeWidth="6"
                strokeLinejoin="round"
                className="pointer-events-none"
              />
              <path
                d={panelPath}
                fill="none"
                stroke={isUnlocked ? motif.accentColor : '#52525b'}
                strokeWidth="1.8"
                strokeOpacity={isUnlocked ? 0.9 : 0.4}
                className="pointer-events-none transition-colors duration-500"
              />

              {/* Exact Geometric Hover Highlight */}
              {isHovered && (
                <path
                  d={panelPath}
                  fill="none"
                  stroke={isUnlocked ? '#fef08a' : '#ffffff'}
                  strokeWidth="4"
                  strokeDasharray="10 5"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Inner Ring: 8 Panels (1 to 8) */}
        {innerPanels.map((p) => {
          const motif = MOTIFS_DATA.find((m) => m.id === p.id)!;
          const isUnlocked = unlockedPanels.has(p.id);
          const isHovered = hoveredPanelId === p.id;
          const panelPath = getOrganicPetalPath(p.cx, p.cy, p.radius, p.angleDeg);
          const clipId = `tiffany-clip-${p.id}`;

          return (
            <g
              key={p.id}
              id={`tiffany-panel-${p.id}`}
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

              <path
                d={panelPath}
                fill={isUnlocked ? motif.dominantColor : '#222226'}
                className="transition-colors duration-700"
              />

              <g clipPath={`url(#${clipId})`}>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.radius * 0.9}
                  fill="none"
                  stroke={isUnlocked ? motif.secondaryColor : '#3f3f46'}
                  strokeWidth="16"
                  opacity={0.6}
                />
                <GlassMotifRenderer
                  motif={motif}
                  cx={p.cx}
                  cy={p.cy}
                  size={p.radius * 1.8}
                  isUnlocked={isUnlocked}
                  isHovered={isHovered}
                />
              </g>

              <path
                d={panelPath}
                fill="none"
                stroke={leadColor}
                strokeWidth="6"
                strokeLinejoin="round"
                className="pointer-events-none"
              />
              <path
                d={panelPath}
                fill="none"
                stroke={isUnlocked ? motif.accentColor : '#52525b'}
                strokeWidth="1.8"
                strokeOpacity={isUnlocked ? 0.9 : 0.4}
                className="pointer-events-none transition-colors duration-500"
              />

              {isHovered && (
                <path
                  d={panelPath}
                  fill="none"
                  stroke={isUnlocked ? '#fef08a' : '#ffffff'}
                  strokeWidth="4"
                  strokeDasharray="10 5"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Milestone 21: Grand Center Lotus Jewel */}
        {(() => {
          const motif = MOTIFS_DATA.find((m) => m.id === 21)!;
          const isUnlocked = unlockedPanels.has(21);
          const isHovered = hoveredPanelId === 21;
          const panelPath = getCenterLotusPath(cx, cy, 105);
          const clipId = 'tiffany-clip-21';

          return (
            <g
              id="tiffany-panel-21"
              onClick={() => onSelectPanel(21)}
              onMouseEnter={() => setHoveredPanelId(21)}
              onMouseLeave={() => setHoveredPanelId(null)}
              className="cursor-pointer transition-transform duration-200"
            >
              <defs>
                <clipPath id={clipId}>
                  <path d={panelPath} />
                </clipPath>
              </defs>

              <path
                d={panelPath}
                fill={isUnlocked ? '#f59e0b' : '#27272a'}
                className="transition-colors duration-700"
              />

              <g clipPath={`url(#${clipId})`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="95"
                  fill="none"
                  stroke={isUnlocked ? '#d97706' : '#3f3f46'}
                  strokeWidth="20"
                  opacity={0.7}
                />
                <GlassMotifRenderer
                  motif={motif}
                  cx={cx}
                  cy={cy}
                  size={190}
                  isUnlocked={isUnlocked}
                  isHovered={isHovered}
                />
              </g>

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
                stroke={isUnlocked ? '#fef08a' : '#52525b'}
                strokeWidth="2.2"
                strokeOpacity={isUnlocked ? 1 : 0.5}
                className="pointer-events-none transition-colors duration-500"
              />

              {isHovered && (
                <path
                  d={panelPath}
                  fill="none"
                  stroke={isUnlocked ? '#fef08a' : '#ffffff'}
                  strokeWidth="5"
                  strokeDasharray="10 5"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
