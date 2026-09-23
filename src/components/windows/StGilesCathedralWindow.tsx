import React from 'react';
import { MOTIFS_DATA } from '../../data/motifs';
import { StGilesArtworkRenderer } from './StGilesArtworkRenderer';

interface StGilesCathedralWindowProps {
  unlockedPanels: Set<number>;
  onSelectPanel: (panelId: number) => void;
  hoveredPanelId: number | null;
  setHoveredPanelId: (id: number | null) => void;
}

export const StGilesCathedralWindow: React.FC<StGilesCathedralWindowProps> = ({
  unlockedPanels,
  onSelectPanel,
  hoveredPanelId,
  setHoveredPanelId,
}) => {
  // Helper to generate pointed Gothic arch path for lower and upper lancets
  const getLancetPath = (
    x: number,
    y: number,
    width: number,
    height: number,
    archHeight: number = 75
  ): string => {
    const r = x + width;
    const b = y + height;
    const archTopY = y;
    const archSpringY = y + archHeight;
    const cx = x + width / 2;

    return `
      M ${x},${b}
      L ${x},${archSpringY}
      Q ${x + width * 0.12},${archTopY + archHeight * 0.22} ${cx},${archTopY}
      Q ${r - width * 0.12},${archTopY + archHeight * 0.22} ${r},${archSpringY}
      L ${r},${b}
      Z
    `.replace(/\s+/g, ' ').trim();
  };

  // =========================================================================
  // ARCHITECTURAL COORDINATES (Total Window ViewBox: 0 0 1000 2150)
  // =========================================================================
  
  // 5 Lancet X-coordinates (Total span from x=60 to x=940)
  const lancetWidth = 162;
  const lancetSpacing = 15;
  const startX = 60;
  const lancetXs = [
    startX,
    startX + (lancetWidth + lancetSpacing),
    startX + 2 * (lancetWidth + lancetSpacing),
    startX + 3 * (lancetWidth + lancetSpacing),
    startX + 4 * (lancetWidth + lancetSpacing),
  ];

  // Lower Tier: Panels 1 to 5
  const lowerY = 1435;
  const lowerHeight = 650;
  const lowerPanels = [1, 2, 3, 4, 5].map((id, index) => ({
    id,
    x: lancetXs[index],
    y: lowerY,
    width: lancetWidth,
    height: lowerHeight,
    borderStroke: '#f59e0b',
    path: getLancetPath(lancetXs[index], lowerY, lancetWidth, lowerHeight, 60),
  }));

  // Upper Tier: Panels 6 to 10
  const upperY = 745;
  const upperHeight = 645;
  const upperPanels = [6, 7, 8, 9, 10].map((id, index) => ({
    id,
    x: lancetXs[index],
    y: upperY,
    width: lancetWidth,
    height: upperHeight,
    borderStroke: '#38bdf8',
    path: getLancetPath(lancetXs[index], upperY, lancetWidth, upperHeight, 75),
  }));

  // =========================================================================
  // TYMPANUM TRACERY: PANELS 11 TO 21
  // Faithful authentic geometric silhouettes from St. Giles Gothic Tracery:
  // - Panels 11 & 14: Arched cusps with smooth parabolic curvature matching outer arch
  // - Panels 12 & 13: Stilted pointed trefoil/segmental domes
  // - Panels 15 & 18: Gothic dagger / mouchette spandrels matching the outer arch curvature
  // - Panels 16 & 17: Pointed lancet tracery blades curving up to asymmetric lancet tips
  // - Panels 19 & 20: Upper gothic mouchettes / vesica spandrels flanking the apex
  // - Panel 21: Summit Gothic Pointed Arch / Vesica Shield (Keystone)
  // =========================================================================
  const traceryPanels = [
    // --- ROW 1 (Base of Tracery: Panels 11, 12, 13, 14) ---
    // Panel 11: Far-Left Teal Medallion Arch (Clipped smoothly along cathedral outer arch)
    {
      id: 11,
      x: 95,
      y: 505,
      width: 162,
      height: 210,
      borderStroke: '#5eead4',
      path: `
        M 95,715
        L 95,620
        C 95,545 155,505 240,505
        L 257,505
        L 257,715
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // Panel 12: Center-Left Cyan Arched Wave Dome
    {
      id: 12,
      x: 275,
      y: 505,
      width: 208,
      height: 210,
      borderStroke: '#7dd3fc',
      path: `
        M 275,715
        L 275,600
        C 275,505 483,505 483,600
        L 483,715
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // Panel 13: Center-Right Deep Royal Blue Arched Wave Dome
    {
      id: 13,
      x: 517,
      y: 505,
      width: 208,
      height: 210,
      borderStroke: '#93c5fd',
      path: `
        M 517,715
        L 517,600
        C 517,505 725,505 725,600
        L 725,715
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // Panel 14: Far-Right Emerald Medallion Arch (Mirror of 11)
    {
      id: 14,
      x: 743,
      y: 505,
      width: 162,
      height: 210,
      borderStroke: '#6ee7b7',
      path: `
        M 743,715
        L 743,505
        L 760,505
        C 845,505 905,545 905,620
        L 905,715
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // --- ROW 2 (Mid Tracery: Panels 15, 16, 17, 18) ---
    // Panel 15: Mid-Left Blue Angel Gothic Mouchette / Spandrel
    {
      id: 15,
      x: 135,
      y: 280,
      width: 152,
      height: 200,
      borderStroke: '#fde047',
      path: `
        M 135,480
        L 287,480
        L 287,280
        L 255,280
        C 185,300 135,370 135,480
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // Panel 16: Mid Center-Left Cobalt Gothic Lancet Blade (Pointed Arch Cusp)
    {
      id: 16,
      x: 305,
      y: 280,
      width: 178,
      height: 200,
      borderStroke: '#93c5fd',
      path: `
        M 305,480
        L 305,370
        C 315,300 375,280 405,280
        C 455,280 483,320 483,370
        L 483,480
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // Panel 17: Mid Center-Right Indigo Gothic Lancet Blade (Pointed Arch Cusp, Mirror of 16)
    {
      id: 17,
      x: 517,
      y: 280,
      width: 178,
      height: 200,
      borderStroke: '#c7d2fe',
      path: `
        M 517,480
        L 517,370
        C 517,320 545,280 595,280
        C 625,280 685,300 695,370
        L 695,480
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // Panel 18: Mid-Right Blue Angel Gothic Mouchette / Spandrel (Mirror of 15)
    {
      id: 18,
      x: 713,
      y: 280,
      width: 152,
      height: 200,
      borderStroke: '#fde047',
      path: `
        M 865,480
        L 713,480
        L 713,280
        L 745,280
        C 815,300 865,370 865,480
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // --- ROW 3 (Upper Tracery: Panels 19, 20) ---
    // Panel 19: Upper-Left Golden Seraph Gothic Cusp / Spandrel
    {
      id: 19,
      x: 232,
      y: 105,
      width: 154,
      height: 152,
      borderStroke: '#fcd34d',
      path: `
        M 232,257
        L 386,257
        L 386,105
        L 350,105
        C 285,120 240,175 232,257
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // Panel 20: Upper-Right Golden Seraph Gothic Cusp / Spandrel (Mirror of 19)
    {
      id: 20,
      x: 614,
      y: 105,
      width: 154,
      height: 152,
      borderStroke: '#fcd34d',
      path: `
        M 768,257
        L 614,257
        L 614,105
        L 650,105
        C 715,120 760,175 768,257
        Z
      `.replace(/\s+/g, ' ').trim(),
    },

    // --- ROW 4 (Apex Peak: Panel 21) ---
    // Panel 21: Summit Gothic Pointed Arch / Shield of Light (Milestone 21 Pinnacle)
    {
      id: 21,
      x: 408,
      y: 15,
      width: 184,
      height: 220,
      borderStroke: '#fef08a',
      path: `
        M 500,15
        C 555,60 592,130 592,185
        C 592,215 555,235 500,235
        C 445,235 408,215 408,185
        C 408,130 445,60 500,15
        Z
      `.replace(/\s+/g, ' ').trim(),
    },
  ];

  const allPanels = [...lowerPanels, ...upperPanels, ...traceryPanels];

  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-center p-0 bg-black">
      <svg
        viewBox="0 0 1000 2150"
        className="w-full h-auto select-none bg-black"
        style={{
          backgroundColor: '#000000',
        }}
      >
        <defs>
          {/* Clip Paths for every architectural panel */}
          {allPanels.map((p) => (
            <clipPath key={`clip-${p.id}`} id={`stgiles-clip-${p.id}`}>
              <path d={p.path} />
            </clipPath>
          ))}
        </defs>

        {/* ========================================================================= */}
        {/* 1. SOLID PURE BLACK GOTHIC BACKGROUND                                     */}
        {/* ========================================================================= */}
        <rect x="0" y="0" width="1000" height="2150" fill="#000000" />

        {/* ========================================================================= */}
        {/* 2. THE 21 STAINED GLASS COMPARTMENTS                                      */}
        {/* ========================================================================= */}
        {allPanels.map((p) => {
          const motif = MOTIFS_DATA.find((m) => m.id === p.id)!;
          const isUnlocked = unlockedPanels.has(p.id);
          const isHovered = hoveredPanelId === p.id;

          return (
            <g
              key={p.id}
              id={`stgiles-panel-${p.id}`}
              onClick={() => onSelectPanel(p.id)}
              onMouseEnter={() => setHoveredPanelId(p.id)}
              onMouseLeave={() => setHoveredPanelId(null)}
              className="cursor-pointer transition-all duration-300"
            >
              {/* Background Glass Fill */}
              <path
                d={p.path}
                fill={isUnlocked ? motif.dominantColor : '#121212'}
                className="transition-colors duration-500"
              />

              {/* Handcrafted Stained Glass Artwork Mosaic (Clipped to Panel Bounds) */}
              <g clipPath={`url(#stgiles-clip-${p.id})`}>
                <StGilesArtworkRenderer
                  motif={motif}
                  x={p.x}
                  y={p.y}
                  width={p.width}
                  height={p.height}
                  isUnlocked={isUnlocked}
                  isHovered={isHovered}
                />
              </g>

              {/* Outer Deep Black Lead Border Outline */}
              <path
                d={p.path}
                fill="none"
                stroke="#000000"
                strokeWidth="7"
                strokeLinejoin="round"
                className="pointer-events-none"
              />

              {/* Precise Color-Accented Fine Glazing Border Outline */}
              <path
                d={p.path}
                fill="none"
                stroke={isUnlocked ? (p as any).borderStroke || motif.accentColor : '#27272a'}
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="pointer-events-none transition-colors duration-500"
              />

              {/* Interactive Hover Glow Perimeter */}
              {isHovered && (
                <path
                  d={p.path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeDasharray="8 4"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
