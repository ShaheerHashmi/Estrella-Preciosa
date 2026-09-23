import React from 'react';
import { MOTIFS_DATA } from '../../data/motifs';
import { GlassMotifRenderer } from '../motifs/GlassMotifRenderer';

interface GrandRoseOptionProps {
  unlockedPanels: Set<number>;
  onSelectPanel: (panelId: number) => void;
  hoveredPanelId: number | null;
  setHoveredPanelId: (id: number | null) => void;
}

export const GrandRoseOption: React.FC<GrandRoseOptionProps> = ({
  unlockedPanels,
  onSelectPanel,
  hoveredPanelId,
  setHoveredPanelId,
}) => {
  const cx = 500;
  const cy = 500;
  const leadColor = '#09090b';

  // 4-Lobed Gothic Quatrefoil path helper
  const getQuatrefoilPath = (x: number, y: number, r: number): string => {
    const lobeR = r * 0.58;
    const offset = r * 0.44;
    return `
      M ${x},${y - offset - lobeR}
      A ${lobeR} ${lobeR} 0 0 1 ${x + offset},${y - lobeR * 0.4}
      A ${lobeR} ${lobeR} 0 0 1 ${x + offset + lobeR},${y}
      A ${lobeR} ${lobeR} 0 0 1 ${x + offset},${y + lobeR * 0.4}
      A ${lobeR} ${lobeR} 0 0 1 ${x},${y + offset + lobeR}
      A ${lobeR} ${lobeR} 0 0 1 ${x - offset},${y + lobeR * 0.4}
      A ${lobeR} ${lobeR} 0 0 1 ${x - offset - lobeR},${y}
      A ${lobeR} ${lobeR} 0 0 1 ${x - offset},${y - lobeR * 0.4}
      Z
    `.replace(/\s+/g, ' ').trim();
  };

  // 12-Lobed Gothic Rosette path helper (Milestone 21)
  const getCentralRosettePath = (x: number, y: number, r: number): string => {
    const lobes = 12;
    const lobeRadius = r * 0.26;
    const ringRadius = r * 0.76;
    let path = '';
    for (let i = 0; i < lobes; i++) {
      const a1 = (i * (360 / lobes)) * (Math.PI / 180);
      const a2 = ((i + 1) * (360 / lobes)) * (Math.PI / 180);
      const lx = x + ringRadius * Math.cos(a1);
      const ly = y + ringRadius * Math.sin(a1);
      const nx = x + ringRadius * Math.cos(a2);
      const ny = y + ringRadius * Math.sin(a2);
      if (i === 0) path += `M ${lx},${ly} `;
      path += `A ${lobeRadius} ${lobeRadius} 0 0 1 ${nx},${ny} `;
    }
    path += 'Z';
    return path.trim();
  };

  // Outer 12 Cusped Roundels
  const getCuspedRoundelPath = (x: number, y: number, r: number): string => {
    const cusps = 8;
    const cuspR = r * 0.38;
    const ringR = r * 0.65;
    let path = '';
    for (let i = 0; i < cusps; i++) {
      const a1 = (i * (360 / cusps)) * (Math.PI / 180);
      const a2 = ((i + 1) * (360 / cusps)) * (Math.PI / 180);
      const lx = x + ringR * Math.cos(a1);
      const ly = y + ringR * Math.sin(a1);
      const nx = x + ringR * Math.cos(a2);
      const ny = y + ringR * Math.sin(a2);
      if (i === 0) path += `M ${lx},${ly} `;
      path += `A ${cuspR} ${cuspR} 0 0 1 ${nx},${ny} `;
    }
    path += 'Z';
    return path.trim();
  };

  // Inner Ring: 8 Quatrefoils (1 to 8)
  const innerPanels = [1, 2, 3, 4, 5, 6, 7, 8].map((id, index) => {
    const angleDeg = index * 45 - 90;
    const angleRad = angleDeg * (Math.PI / 180);
    const r = 265;
    return {
      id,
      cx: cx + r * Math.cos(angleRad),
      cy: cy + r * Math.sin(angleRad),
      radius: 65,
      shape: 'quatrefoil' as const,
    };
  });

  // Outer Ring: 12 Cusped Roundels (9 to 20)
  const outerPanels = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((id, index) => {
    const angleDeg = index * 30 - 75;
    const angleRad = angleDeg * (Math.PI / 180);
    const r = 405;
    return {
      id,
      cx: cx + r * Math.cos(angleRad),
      cy: cy + r * Math.sin(angleRad),
      radius: 58,
      shape: 'roundel' as const,
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center p-2 sm:p-4">
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-auto drop-shadow-2xl select-none"
        style={{
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95))',
        }}
      >
        {/* ========================================================================= */}
        {/* 1. ARCHITECTURAL GOTHIC STONE FOUNDATION RIM                              */}
        {/* ========================================================================= */}
        <circle cx={cx} cy={cy} r="495" fill="#09090b" stroke="#000000" strokeWidth="12" />
        <circle cx={cx} cy={cy} r="482" fill="#18181b" stroke="#27272a" strokeWidth="4" />
        <circle cx={cx} cy={cy} r="472" fill="#0c0a09" stroke="#000000" strokeWidth="6" />

        {/* ========================================================================= */}
        {/* 2. CONTINUOUS EDGE-TO-EDGE GOTHIC FILLER TRACERY (Zero floating gaps)    */}
        {/* ========================================================================= */}
        <g className="pointer-events-none">
          {/* Outer Perimeter 24 Gothic Pointed Lancet Cusps */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a1 = (i * 15) * (Math.PI / 180);
            const a2 = ((i + 1) * 15) * (Math.PI / 180);
            const midA = ((i + 0.5) * 15) * (Math.PI / 180);
            const x1 = cx + 468 * Math.cos(a1);
            const y1 = cy + 468 * Math.sin(a1);
            const x2 = cx + 468 * Math.cos(a2);
            const y2 = cy + 468 * Math.sin(a2);
            const tipX = cx + 448 * Math.cos(midA);
            const tipY = cy + 448 * Math.sin(midA);
            const isRuby = i % 2 === 0;

            return (
              <polygon
                key={`outer-cusp-${i}`}
                points={`${x1},${y1} ${tipX},${tipY} ${x2},${y2}`}
                fill={isRuby ? '#7f1d1d' : '#1e3a8a'}
                fillOpacity={0.65}
                stroke={leadColor}
                strokeWidth="2.5"
              />
            );
          })}

          {/* Intermediate Diamond Quarries (Between Inner & Outer Rings) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5) * (Math.PI / 180);
            const rMid = 338;
            const px = cx + rMid * Math.cos(angle);
            const py = cy + rMid * Math.sin(angle);
            const isRuby = i % 2 === 0;

            return (
              <circle
                key={`inter-quarry-${i}`}
                cx={px}
                cy={py}
                r="20"
                fill={isRuby ? '#991b1b' : '#1d4ed8'}
                fillOpacity={0.55}
                stroke={leadColor}
                strokeWidth="3"
              />
            );
          })}

          {/* 12 Little Radial Trefoils Surrounding Center Medallion (Notre-Dame style) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 + 15) * (Math.PI / 180);
            const rTrefoil = 168;
            const px = cx + rTrefoil * Math.cos(angle);
            const py = cy + rTrefoil * Math.sin(angle);
            return (
              <g key={`center-trefoil-${i}`}>
                <circle
                  cx={px}
                  cy={py}
                  r="15"
                  fill="#1e40af"
                  fillOpacity={0.65}
                  stroke={leadColor}
                  strokeWidth="2.5"
                />
                <circle
                  cx={px}
                  cy={py}
                  r="7"
                  fill="#fbbf24"
                  fillOpacity={0.75}
                  stroke={leadColor}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Concentric Lead Came Rings */}
          <circle cx={cx} cy={cy} r="468" fill="none" stroke={leadColor} strokeWidth="10" />
          <circle cx={cx} cy={cy} r="348" fill="none" stroke={leadColor} strokeWidth="8" />
          <circle cx={cx} cy={cy} r="195" fill="none" stroke={leadColor} strokeWidth="8" />

          {/* 12 Primary Radiating Stone Mullions */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x1 = cx + 120 * Math.cos(angle);
            const y1 = cy + 120 * Math.sin(angle);
            const x2 = cx + 468 * Math.cos(angle);
            const y2 = cy + 468 * Math.sin(angle);
            return (
              <line
                key={`spoke-main-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={leadColor}
                strokeWidth="7"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* ========================================================================= */}
        {/* 3. THE 21 INTERLOCKING GOTHIC ROSE MEDALLIONS                             */}
        {/* ========================================================================= */}

        {/* --- Outer Ring: 12 Panels (9 to 20) --- */}
        {outerPanels.map((p) => {
          const motif = MOTIFS_DATA.find((m) => m.id === p.id)!;
          const isUnlocked = unlockedPanels.has(p.id);
          const isHovered = hoveredPanelId === p.id;
          const panelPath = getCuspedRoundelPath(p.cx, p.cy, p.radius);
          const clipId = `rose-clip-${p.id}`;

          return (
            <g
              key={p.id}
              id={`rose-panel-${p.id}`}
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
                fill={isUnlocked ? motif.dominantColor : '#27272a'}
                className="transition-colors duration-700"
              />

              <g clipPath={`url(#${clipId})`}>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.radius * 0.88}
                  fill="none"
                  stroke={isUnlocked ? motif.secondaryColor : '#3f3f46'}
                  strokeWidth="16"
                  opacity={0.65}
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
                  strokeDasharray="8 5"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* --- Inner Ring: 8 Panels (1 to 8) --- */}
        {innerPanels.map((p) => {
          const motif = MOTIFS_DATA.find((m) => m.id === p.id)!;
          const isUnlocked = unlockedPanels.has(p.id);
          const isHovered = hoveredPanelId === p.id;
          const panelPath = getQuatrefoilPath(p.cx, p.cy, p.radius);
          const clipId = `rose-clip-${p.id}`;

          return (
            <g
              key={p.id}
              id={`rose-panel-${p.id}`}
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
                fill={isUnlocked ? motif.dominantColor : '#27272a'}
                className="transition-colors duration-700"
              />

              <g clipPath={`url(#${clipId})`}>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.radius * 0.88}
                  fill="none"
                  stroke={isUnlocked ? motif.secondaryColor : '#3f3f46'}
                  strokeWidth="16"
                  opacity={0.65}
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
                  strokeDasharray="8 5"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* --- Milestone 21: Grand Center Rosette --- */}
        {(() => {
          const motif = MOTIFS_DATA.find((m) => m.id === 21)!;
          const isUnlocked = unlockedPanels.has(21);
          const isHovered = hoveredPanelId === 21;
          const panelPath = getCentralRosettePath(cx, cy, 108);
          const clipId = 'rose-clip-21';

          return (
            <g
              id="rose-panel-21"
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
                  r="98"
                  fill="none"
                  stroke={isUnlocked ? '#d97706' : '#3f3f46'}
                  strokeWidth="20"
                  opacity={0.7}
                />
                <GlassMotifRenderer
                  motif={motif}
                  cx={cx}
                  cy={cy}
                  size={195}
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
                strokeWidth="2"
                strokeOpacity={isUnlocked ? 0.9 : 0.4}
                className="pointer-events-none transition-colors duration-500"
              />

              {isHovered && (
                <path
                  d={panelPath}
                  fill="none"
                  stroke={isUnlocked ? '#fef08a' : '#ffffff'}
                  strokeWidth="4.5"
                  strokeDasharray="8 5"
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
