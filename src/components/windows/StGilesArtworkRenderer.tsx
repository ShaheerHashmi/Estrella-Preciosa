import React from 'react';
import { PanelMotif } from '../../types';

interface StGilesArtworkRendererProps {
  motif: PanelMotif;
  x: number;
  y: number;
  width: number;
  height: number;
  isUnlocked: boolean;
  isHovered: boolean;
}

export const StGilesArtworkRenderer: React.FC<StGilesArtworkRendererProps> = ({
  motif,
  x,
  y,
  width,
  height,
  isUnlocked,
  isHovered,
}) => {
  const leadLine = '#000000';
  const cx = x + width / 2;
  const cy = y + height / 2;

  // Render authentic stained glass figures and scenes based on panel ID
  const renderPanelArtwork = () => {
    switch (motif.id) {
      // -----------------------------------------------------------------------
      // LOWER TIER (Panels 1 to 5)
      // -----------------------------------------------------------------------
      case 1: // Lower Left: Golden Archangel & Deep Leviathan
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#0f172a' : '#141416'} />
            
            {/* Deep Blue Leviathan / Sea Dragon at Base */}
            <path
              d={`M ${x},${y + height * 0.65} Q ${cx},${y + height * 0.55} ${x + width},${y + height * 0.7} L ${x + width},${y + height} L ${x},${y + height} Z`}
              fill={isUnlocked ? '#1e3a8a' : '#1e1e24'}
            />
            <path
              d={`M ${cx - 40},${y + height * 0.72} Q ${cx + 10},${y + height * 0.8} ${cx - 20},${y + height * 0.92} Q ${cx + 50},${y + height * 0.88} ${x + width - 10},${y + height * 0.82}`}
              fill="none"
              stroke={isUnlocked ? '#0284c7' : '#2d2d34'}
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx={cx - 30} cy={y + height * 0.75} r="6" fill={isUnlocked ? '#ef4444' : '#3f3f46'} />

            {/* Golden Archangel Michael Figure */}
            <path
              d={`M ${cx},${y + height * 0.25} C ${x - 20},${y + height * 0.1} ${x - 10},${y + height * 0.5} ${cx - 10},${y + height * 0.6} Z`}
              fill={isUnlocked ? '#d97706' : '#2d2d34'}
              stroke={leadLine}
              strokeWidth="2"
            />
            <path
              d={`M ${cx},${y + height * 0.25} C ${x + width + 20},${y + height * 0.1} ${x + width + 10},${y + height * 0.5} ${cx + 10},${y + height * 0.6} Z`}
              fill={isUnlocked ? '#d97706' : '#2d2d34'}
              stroke={leadLine}
              strokeWidth="2"
            />
            <path
              d={`M ${cx - 25},${y + height * 0.28} L ${cx + 25},${y + height * 0.28} L ${cx + 18},${y + height * 0.65} L ${cx - 18},${y + height * 0.65} Z`}
              fill={isUnlocked ? '#f59e0b' : '#3a3a42'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <circle cx={cx} cy={y + height * 0.18} r="24" fill={isUnlocked ? '#fef08a' : '#4a4a54'} stroke={leadLine} strokeWidth="2" />
            <circle cx={cx} cy={y + height * 0.18} r="14" fill={isUnlocked ? '#fed7aa' : '#6b6b76'} />
            <line
              x1={cx + 12}
              y1={y + height * 0.1}
              x2={cx - 20}
              y2={y + height * 0.85}
              stroke={isUnlocked ? '#fef08a' : '#a1a1aa'}
              strokeWidth="5"
            />
          </g>
        );

      case 2: // Lower Mid-Left: Figure in White Robe Walking upon Water
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#0c4a6e' : '#141416'} />
            <ellipse cx={cx} cy={cy} rx={width * 0.45} ry={height * 0.45} fill={isUnlocked ? '#0284c7' : '#1a1a20'} opacity="0.6" />
            {Array.from({ length: 6 }).map((_, i) => (
              <path
                key={`w2-${i}`}
                d={`M ${x},${y + height * 0.65 + i * 22} Q ${cx - 20 + i * 8},${y + height * 0.62 + i * 22} ${cx + 30},${y + height * 0.68 + i * 22} T ${x + width},${y + height * 0.65 + i * 22}`}
                fill="none"
                stroke={isUnlocked ? (i % 2 === 0 ? '#38bdf8' : '#e0f2fe') : '#2a2a32'}
                strokeWidth="4"
              />
            ))}
            <path
              d={`M ${cx - 15},${y + height * 0.22} Q ${cx - 28},${y + height * 0.5} ${cx - 22},${y + height * 0.72} L ${cx + 22},${y + height * 0.72} Q ${cx + 28},${y + height * 0.5} ${cx + 15},${y + height * 0.22} Z`}
              fill={isUnlocked ? '#f8fafc' : '#4a4a54'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <circle cx={cx} cy={y + height * 0.16} r="20" fill={isUnlocked ? '#e0f2fe' : '#3a3a42'} stroke={leadLine} strokeWidth="1.5" />
            <circle cx={cx} cy={y + height * 0.16} r="12" fill={isUnlocked ? '#ffffff' : '#6b6b76'} />
          </g>
        );

      case 3: // Lower Center: The Ship of Faith, Green Sails & Golden Lantern
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#0369a1' : '#141416'} />
            <line x1={cx} y1={y + height * 0.08} x2={cx} y2={y + height * 0.8} stroke={leadLine} strokeWidth="8" />
            <line x1={cx - width * 0.38} y1={y + height * 0.25} x2={cx + width * 0.38} y2={y + height * 0.25} stroke={leadLine} strokeWidth="5" />
            
            <path
              d={`M ${cx - width * 0.35},${y + height * 0.25} Q ${cx},${y + height * 0.35} ${cx + width * 0.35},${y + height * 0.25} Q ${cx + width * 0.2},${y + height * 0.55} ${cx},${y + height * 0.58} Q ${cx - width * 0.2},${y + height * 0.55} ${cx - width * 0.35},${y + height * 0.25} Z`}
              fill={isUnlocked ? '#15803d' : '#2d2d34'}
              stroke={leadLine}
              strokeWidth="3"
            />
            <path
              d={`M ${cx - 20},${y + height * 0.28} Q ${cx - 10},${y + height * 0.45} ${cx - 25},${y + height * 0.54}`}
              fill="none"
              stroke={isUnlocked ? '#22c55e' : '#3a3a42'}
              strokeWidth="3"
            />

            <path
              d={`M ${x + 10},${y + height * 0.62} Q ${cx},${y + height * 0.85} ${x + width - 10},${y + height * 0.62} L ${x + width - 25},${y + height * 0.78} Q ${cx},${y + height * 0.9} ${x + 25},${y + height * 0.78} Z`}
              fill={isUnlocked ? '#ca8a04' : '#3a3a42'}
              stroke={leadLine}
              strokeWidth="3"
            />

            <circle cx={cx - 20} cy={y + height * 0.6} r="16" fill={isUnlocked ? '#fef08a' : '#4a4a54'} stroke={leadLine} strokeWidth="2" />
            <circle cx={cx - 20} cy={y + height * 0.6} r="8" fill={isUnlocked ? '#f59e0b' : '#2a2a32'} />

            <path
              d={`M ${x},${y + height * 0.75} Q ${cx},${y + height * 0.7} ${x + width},${y + height * 0.8} L ${x + width},${y + height} L ${x},${y + height} Z`}
              fill={isUnlocked ? '#0284c7' : '#1e1e24'}
            />
          </g>
        );

      case 4: // Lower Mid-Right: Steadfast Mariners at the Oars
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#0284c7' : '#141416'} />
            <line x1={cx + 25} y1={y + height * 0.05} x2={cx + 25} y2={y + height * 0.7} stroke={leadLine} strokeWidth="6" />
            <polygon
              points={`${cx + 25},${y + height * 0.08} ${x + width - 10},${y + height * 0.12} ${cx + 25},${y + height * 0.45}`}
              fill={isUnlocked ? '#65a30d' : '#2d2d34'}
              stroke={leadLine}
              strokeWidth="2"
            />
            <path
              d={`M ${cx - 35},${y + height * 0.45} Q ${cx - 10},${y + height * 0.38} ${cx + 10},${y + height * 0.48} L ${cx},${y + height * 0.68} L ${cx - 30},${y + height * 0.65} Z`}
              fill={isUnlocked ? '#854d0e' : '#3a3a42'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <line
              x1={cx - 15}
              y1={y + height * 0.5}
              x2={x + width - 5}
              y2={y + height * 0.88}
              stroke={isUnlocked ? '#fef08a' : '#888892'}
              strokeWidth="6"
            />
            <path
              d={`M ${x},${y + height * 0.72} Q ${cx},${y + height * 0.82} ${x + width},${y + height * 0.76} L ${x + width},${y + height} L ${x},${y + height} Z`}
              fill={isUnlocked ? '#0369a1' : '#1e1e24'}
            />
          </g>
        );

      case 5: // Lower Right: Seraph of the Eastern Tide & Emerald Serpent
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#0f172a' : '#141416'} />
            <path
              d={`M ${x},${y + height * 0.7} Q ${cx},${y + height * 0.6} ${x + width},${y + height * 0.75} L ${x + width},${y + height} L ${x},${y + height} Z`}
              fill={isUnlocked ? '#047857' : '#1e1e24'}
            />
            <path
              d={`M ${cx - 30},${y + height * 0.75} Q ${cx + 20},${y + height * 0.85} ${cx - 10},${y + height * 0.95} Q ${cx + 40},${y + height * 0.85} ${x + width - 15},${y + height * 0.78}`}
              fill="none"
              stroke={isUnlocked ? '#10b981' : '#2d2d34'}
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx={cx} cy={y + height * 0.16} r="22" fill={isUnlocked ? '#fef08a' : '#4a4a54'} stroke={leadLine} strokeWidth="2" />
            <circle cx={cx} cy={y + height * 0.16} r="13" fill={isUnlocked ? '#fed7aa' : '#6b6b76'} />
          </g>
        );

      // -----------------------------------------------------------------------
      // UPPER TIER (Panels 6 to 10)
      // -----------------------------------------------------------------------
      case 6: // Upper Left: Seraph of Fiery Dawn
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#7c2d12' : '#141416'} />
            <path
              d={`M ${cx},${y + height * 0.2} C ${x - 25},${y + height * 0.05} ${x - 10},${y + height * 0.5} ${cx - 12},${y + height * 0.6} Z`}
              fill={isUnlocked ? '#ea580c' : '#2d2d34'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <path
              d={`M ${cx},${y + height * 0.2} C ${x + width + 25},${y + height * 0.05} ${x + width + 10},${y + height * 0.5} ${cx + 12},${y + height * 0.6} Z`}
              fill={isUnlocked ? '#ea580c' : '#2d2d34'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <circle cx={cx} cy={y + height * 0.14} r="20" fill={isUnlocked ? '#fef08a' : '#4a4a54'} stroke={leadLine} strokeWidth="2" />
          </g>
        );

      case 7: // Upper Mid-Left: Valiant Rowers in Crimson
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#1e3a8a' : '#141416'} />
            <path
              d={`M ${cx - 25},${y + height * 0.48} Q ${cx},${y + height * 0.4} ${cx + 20},${y + height * 0.52} L ${cx + 12},${y + height * 0.72} L ${cx - 18},${y + height * 0.7} Z`}
              fill={isUnlocked ? '#b91c1c' : '#3a3a42'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <circle cx={cx - 12} cy={y + height * 0.44} r="12" fill={isUnlocked ? '#991b1b' : '#2a2a32'} stroke={leadLine} strokeWidth="1.5" />
            <line
              x1={cx - 20}
              y1={y + height * 0.52}
              x2={x + width - 10}
              y2={y + height * 0.85}
              stroke={isUnlocked ? '#fef08a' : '#a1a1aa'}
              strokeWidth="6"
            />
          </g>
        );

      case 8: // Upper Center: The Lookout of the Violet Sky
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#4c1d95' : '#141416'} />
            <line x1={cx} y1={y} x2={cx} y2={y + height * 0.8} stroke={leadLine} strokeWidth="8" />
            <path
              d={`M ${cx - 18},${y + height * 0.45} L ${cx + 18},${y + height * 0.45} L ${cx + 12},${y + height * 0.72} L ${cx - 12},${y + height * 0.72} Z`}
              fill={isUnlocked ? '#d97706' : '#3a3a42'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <circle cx={cx} cy={y + height * 0.4} r="14" fill={isUnlocked ? '#fed7aa' : '#6b6b76'} stroke={leadLine} strokeWidth="2" />
          </g>
        );

      case 9: // Upper Mid-Right: The Spirit of Peace
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#1e3a8a' : '#141416'} />
            <ellipse cx={cx} cy={cy} rx={width * 0.45} ry={height * 0.45} fill={isUnlocked ? '#38bdf8' : '#1a1a20'} opacity="0.4" />
            <path
              d={`M ${cx - 18},${y + height * 0.24} Q ${cx - 30},${y + height * 0.55} ${cx - 24},${y + height * 0.75} L ${cx + 24},${y + height * 0.75} Q ${cx + 30},${y + height * 0.55} ${cx + 18},${y + height * 0.24} Z`}
              fill={isUnlocked ? '#ffffff' : '#4a4a54'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <circle cx={cx} cy={y + height * 0.16} r="22" fill={isUnlocked ? '#e0f2fe' : '#3a3a42'} stroke={leadLine} strokeWidth="2" />
            <circle cx={cx} cy={y + height * 0.16} r="14" fill={isUnlocked ? '#f8fafc' : '#6b6b76'} />
          </g>
        );

      case 10: // Upper Right: Sword of Golden Dawn
        return (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={isUnlocked ? '#065f46' : '#141416'} />
            <line
              x1={cx - 15}
              y1={y + height * 0.12}
              x2={cx - 15}
              y2={y + height * 0.7}
              stroke={isUnlocked ? '#fef08a' : '#a1a1aa'}
              strokeWidth="4.5"
            />
            <circle cx={cx} cy={y + height * 0.14} r="20" fill={isUnlocked ? '#fef08a' : '#4a4a54'} stroke={leadLine} strokeWidth="2" />
          </g>
        );

      // -----------------------------------------------------------------------
      // TYMPANUM TRACERY (Panels 11 to 21 - EXACT MATCH TO REFERENCE IMAGE)
      // -----------------------------------------------------------------------
      case 11: // Panel 11: Teal Base, Top Gold Fan, Dark Medallion with White Boat & Flag
        return (
          <g>
            {/* Background Teal Fill */}
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#008080' : '#151d20'} />
            
            {/* Top Golden Olive Arch Fan */}
            <path
              d={`M ${x},${y + 90} Q ${x + 20},${y + 10} ${x + width - 40},${y} L ${x + width},${y} L ${x + width},${y + 40} Q ${x + 80},${y + 50} ${x + 15},${y + 110} Z`}
              fill={isUnlocked ? '#b58838' : '#2b2a26'}
            />

            {/* Circular Dark Teal Medallion */}
            <circle
              cx={x + width * 0.55}
              cy={y + height * 0.58}
              r={width * 0.38}
              fill={isUnlocked ? '#114a55' : '#1a2226'}
              stroke={leadLine}
              strokeWidth="4"
            />

            {/* White Boat with Flag */}
            <path
              d={`M ${x + width * 0.38},${y + height * 0.65} Q ${x + width * 0.55},${y + height * 0.72} ${x + width * 0.72},${y + height * 0.65} Z`}
              fill={isUnlocked ? '#ffffff' : '#6b7280'}
              stroke={leadLine}
              strokeWidth="1.5"
            />
            <line
              x1={x + width * 0.55}
              y1={y + height * 0.52}
              x2={x + width * 0.55}
              y2={y + height * 0.65}
              stroke={isUnlocked ? '#ffffff' : '#6b7280'}
              strokeWidth="2.5"
            />
            <polygon
              points={`${x + width * 0.55},${y + height * 0.52} ${x + width * 0.65},${y + height * 0.56} ${x + width * 0.55},${y + height * 0.6}`}
              fill={isUnlocked ? '#ffffff' : '#6b7280'}
            />

            {/* Horizontal Black Lead Lines */}
            <line x1={x} y1={y + height * 0.38} x2={x + width} y2={y + height * 0.38} stroke={leadLine} strokeWidth="3" />
            <line x1={x} y1={y + height * 0.78} x2={x + width} y2={y + height * 0.78} stroke={leadLine} strokeWidth="3" />
          </g>
        );

      case 12: // Panel 12: Cyan/Cerulean Blue Arched Dome with 4 Wavy Stripes
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#0284c7' : '#141c24'} />
            
            {/* 4 Wavy Stripes (2 White, 2 Sky Blue) */}
            <path
              d={`M ${x},${y + height * 0.3} Q ${cx},${y + height * 0.22} ${x + width},${y + height * 0.3}`}
              fill="none"
              stroke={isUnlocked ? '#ffffff' : '#3f4854'}
              strokeWidth="5"
            />
            <path
              d={`M ${x},${y + height * 0.48} Q ${cx},${y + height * 0.4} ${x + width},${y + height * 0.48}`}
              fill="none"
              stroke={isUnlocked ? '#38bdf8' : '#2b3440'}
              strokeWidth="5"
            />
            <path
              d={`M ${x},${y + height * 0.66} Q ${cx},${y + height * 0.58} ${x + width},${y + height * 0.66}`}
              fill="none"
              stroke={isUnlocked ? '#ffffff' : '#3f4854'}
              strokeWidth="5"
            />
            <path
              d={`M ${x},${y + height * 0.84} Q ${cx},${y + height * 0.76} ${x + width},${y + height * 0.84}`}
              fill="none"
              stroke={isUnlocked ? '#38bdf8' : '#2b3440'}
              strokeWidth="5"
            />

            {/* Horizontal Black Lead Lines */}
            <line x1={x} y1={y + height * 0.38} x2={x + width} y2={y + height * 0.38} stroke={leadLine} strokeWidth="3" />
            <line x1={x} y1={y + height * 0.72} x2={x + width} y2={y + height * 0.72} stroke={leadLine} strokeWidth="3" />
          </g>
        );

      case 13: // Panel 13: Deep Royal Blue Arched Dome with 4 Wavy Stripes
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#1d4ed8' : '#141828'} />
            
            {/* 4 Wavy Stripes (2 Light Blue/White, 2 Lavender/Periwinkle) */}
            <path
              d={`M ${x},${y + height * 0.3} Q ${cx},${y + height * 0.22} ${x + width},${y + height * 0.3}`}
              fill="none"
              stroke={isUnlocked ? '#bfdbfe' : '#2a324b'}
              strokeWidth="5"
            />
            <path
              d={`M ${x},${y + height * 0.48} Q ${cx},${y + height * 0.4} ${x + width},${y + height * 0.48}`}
              fill="none"
              stroke={isUnlocked ? '#93c5fd' : '#22283e'}
              strokeWidth="5"
            />
            <path
              d={`M ${x},${y + height * 0.66} Q ${cx},${y + height * 0.58} ${x + width},${y + height * 0.66}`}
              fill="none"
              stroke={isUnlocked ? '#e0e7ff' : '#2a324b'}
              strokeWidth="5"
            />
            <path
              d={`M ${x},${y + height * 0.84} Q ${cx},${y + height * 0.76} ${x + width},${y + height * 0.84}`}
              fill="none"
              stroke={isUnlocked ? '#93c5fd' : '#22283e'}
              strokeWidth="5"
            />

            {/* Horizontal Black Lead Lines */}
            <line x1={x} y1={y + height * 0.38} x2={x + width} y2={y + height * 0.38} stroke={leadLine} strokeWidth="3" />
            <line x1={x} y1={y + height * 0.72} x2={x + width} y2={y + height * 0.72} stroke={leadLine} strokeWidth="3" />
          </g>
        );

      case 14: // Panel 14: Emerald Green Base, Top Gold Fan, Dark Medallion with Golden Citadel
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#007a5e' : '#141d1a'} />
            
            {/* Top Golden Olive Arch Fan */}
            <path
              d={`M ${x},${y} L ${x + 40},${y} Q ${x + width - 20},${y + 10} ${x + width},${y + 90} L ${x + width - 15},${y + 110} Q ${x + width - 80},${y + 50} ${x},${y + 40} Z`}
              fill={isUnlocked ? '#b58838' : '#2b2a26'}
            />

            {/* Circular Dark Green Medallion */}
            <circle
              cx={x + width * 0.45}
              cy={y + height * 0.58}
              r={width * 0.38}
              fill={isUnlocked ? '#064e3b' : '#162420'}
              stroke={leadLine}
              strokeWidth="4"
            />

            {/* Golden House / Citadel Icon */}
            <polygon
              points={`${x + width * 0.45},${y + height * 0.48} ${x + width * 0.36},${y + height * 0.56} ${x + width * 0.54},${y + height * 0.56}`}
              fill={isUnlocked ? '#fbbf24' : '#52525b'}
              stroke={leadLine}
              strokeWidth="1.5"
            />
            <rect
              x={x + width * 0.37}
              y={y + height * 0.56}
              width={width * 0.16}
              height={height * 0.16}
              fill={isUnlocked ? '#fbbf24' : '#52525b'}
              stroke={leadLine}
              strokeWidth="1.5"
            />

            {/* Horizontal Black Lead Lines */}
            <line x1={x} y1={y + height * 0.38} x2={x + width} y2={y + height * 0.38} stroke={leadLine} strokeWidth="3" />
            <line x1={x} y1={y + height * 0.78} x2={x + width} y2={y + height * 0.78} stroke={leadLine} strokeWidth="3" />
          </g>
        );

      case 15: // Panel 15: Deep Blue Background with Golden Angel Figure at Lower Left
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#1e3a8a' : '#141824'} />
            
            {/* Golden Angel Head & Body */}
            <circle
              cx={x + width * 0.5}
              cy={y + height * 0.4}
              r={width * 0.16}
              fill={isUnlocked ? '#f59e0b' : '#4a4030'}
              stroke={leadLine}
              strokeWidth="2"
            />
            <path
              d={`M ${x + width * 0.25},${y + height * 0.9} Q ${x + width * 0.15},${y + height * 0.55} ${x + width * 0.5},${y + height * 0.48} Q ${x + width * 0.65},${y + height * 0.65} ${x + width * 0.52},${y + height * 0.9} Z`}
              fill={isUnlocked ? '#f59e0b' : '#4a4030'}
              stroke={leadLine}
              strokeWidth="2"
            />

            {/* Horizontal Black Lead Line */}
            <line x1={x} y1={y + height * 0.55} x2={x + width} y2={y + height * 0.55} stroke={leadLine} strokeWidth="3" />
          </g>
        );

      case 16: // Panel 16: Cobalt Blue with Asymmetric Peak & Vertical White/Sky Stripes on Right
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#1d4ed8' : '#141828'} />
            
            {/* Vertical White & Sky Blue Stripes */}
            <line
              x1={x + width * 0.64}
              y1={y}
              x2={x + width * 0.64}
              y2={y + height}
              stroke={isUnlocked ? '#ffffff' : '#404c60'}
              strokeWidth="5"
            />
            <line
              x1={x + width * 0.73}
              y1={y}
              x2={x + width * 0.73}
              y2={y + height}
              stroke={isUnlocked ? '#93c5fd' : '#2b3445'}
              strokeWidth="5"
            />

            {/* Horizontal Black Lead Lines */}
            <line x1={x} y1={y + height * 0.4} x2={x + width} y2={y + height * 0.4} stroke={leadLine} strokeWidth="3" />
            <line x1={x} y1={y + height * 0.75} x2={x + width} y2={y + height * 0.75} stroke={leadLine} strokeWidth="3" />
          </g>
        );

      case 17: // Panel 17: Deep Indigo with Asymmetric Peak & Vertical White/Sky Stripes on Left
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#312e81' : '#181628'} />
            
            {/* Vertical Sky Blue & White Stripes */}
            <line
              x1={x + width * 0.27}
              y1={y}
              x2={x + width * 0.27}
              y2={y + height}
              stroke={isUnlocked ? '#c7d2fe' : '#2f2c45'}
              strokeWidth="5"
            />
            <line
              x1={x + width * 0.36}
              y1={y}
              x2={x + width * 0.36}
              y2={y + height}
              stroke={isUnlocked ? '#ffffff' : '#403c60'}
              strokeWidth="5"
            />

            {/* Horizontal Black Lead Lines */}
            <line x1={x} y1={y + height * 0.4} x2={x + width} y2={y + height * 0.4} stroke={leadLine} strokeWidth="3" />
            <line x1={x} y1={y + height * 0.75} x2={x + width} y2={y + height * 0.75} stroke={leadLine} strokeWidth="3" />
          </g>
        );

      case 18: // Panel 18: Deep Blue Background with Golden Angel Figure at Lower Right
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#1e3a8a' : '#141824'} />
            
            {/* Golden Angel Head & Body (Mirror of 15) */}
            <circle
              cx={x + width * 0.5}
              cy={y + height * 0.4}
              r={width * 0.16}
              fill={isUnlocked ? '#f59e0b' : '#4a4030'}
              stroke={leadLine}
              strokeWidth="2"
            />
            <path
              d={`M ${x + width * 0.75},${y + height * 0.9} Q ${x + width * 0.85},${y + height * 0.55} ${x + width * 0.5},${y + height * 0.48} Q ${x + width * 0.35},${y + height * 0.65} ${x + width * 0.48},${y + height * 0.9} Z`}
              fill={isUnlocked ? '#f59e0b' : '#4a4030'}
              stroke={leadLine}
              strokeWidth="2"
            />

            {/* Horizontal Black Lead Line */}
            <line x1={x} y1={y + height * 0.55} x2={x + width} y2={y + height * 0.55} stroke={leadLine} strokeWidth="3" />
          </g>
        );

      case 19: // Panel 19: Brown / Sienna Base with Golden Cherub Profile & Vertical Notch
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#78350f' : '#22150e'} />
            
            {/* Golden Cherub / Angel Profile */}
            <circle
              cx={x + width * 0.52}
              cy={y + height * 0.42}
              r={width * 0.15}
              fill={isUnlocked ? '#f59e0b' : '#483520'}
              stroke={leadLine}
              strokeWidth="2"
            />
            <path
              d={`M ${x + width * 0.28},${y + height * 0.55} Q ${x + width * 0.2},${y + height * 0.32} ${x + width * 0.5},${y + height * 0.38} Q ${x + width * 0.65},${y + height * 0.5} ${x + width * 0.42},${y + height * 0.65} Z`}
              fill={isUnlocked ? '#f59e0b' : '#483520'}
              stroke={leadLine}
              strokeWidth="2"
            />

            {/* Horizontal Black Lead Line */}
            <line x1={x} y1={y + height * 0.45} x2={x + width} y2={y + height * 0.45} stroke={leadLine} strokeWidth="3" />

            {/* Authentic Vertical Black Mullion Notch */}
            <rect
              x={x + width * 0.45}
              y={y + height * 0.55}
              width={width * 0.1}
              height={height * 0.48}
              fill="#000000"
            />
          </g>
        );

      case 20: // Panel 20: Brown / Sienna Base with Golden Cherub Profile (Mirror of 19)
        return (
          <g>
            <rect x={x - 10} y={y - 10} width={width + 20} height={height + 20} fill={isUnlocked ? '#78350f' : '#22150e'} />
            
            {/* Golden Cherub / Angel Profile */}
            <circle
              cx={x + width * 0.48}
              cy={y + height * 0.42}
              r={width * 0.15}
              fill={isUnlocked ? '#f59e0b' : '#483520'}
              stroke={leadLine}
              strokeWidth="2"
            />
            <path
              d={`M ${x + width * 0.72},${y + height * 0.55} Q ${x + width * 0.8},${y + height * 0.32} ${x + width * 0.5},${y + height * 0.38} Q ${x + width * 0.35},${y + height * 0.5} ${x + width * 0.58},${y + height * 0.65} Z`}
              fill={isUnlocked ? '#f59e0b' : '#483520'}
              stroke={leadLine}
              strokeWidth="2"
            />

            {/* Horizontal Black Lead Line */}
            <line x1={x} y1={y + height * 0.45} x2={x + width} y2={y + height * 0.45} stroke={leadLine} strokeWidth="3" />

            {/* Authentic Vertical Black Mullion Notch */}
            <rect
              x={x + width * 0.45}
              y={y + height * 0.55}
              width={width * 0.1}
              height={height * 0.48}
              fill="#000000"
            />
          </g>
        );

      case 21: // Panel 21: Pointed Teardrop Shield with Latin Cross & Ruby Ring (Summit Milestone)
        return (
          <g>
            {/* Golden Amber Background */}
            <rect x={x - 20} y={y - 20} width={width + 40} height={height + 40} fill={isUnlocked ? '#f59e0b' : '#261c0e'} />
            
            {/* Horizontal Black Lead Lines across Shield */}
            <line x1={x} y1={y + height * 0.32} x2={x + width} y2={y + height * 0.32} stroke={leadLine} strokeWidth="3" />
            <line x1={x} y1={y + height * 0.65} x2={x + width} y2={y + height * 0.65} stroke={leadLine} strokeWidth="3" />

            {/* Latin Cross (Yellow with Black Outline) */}
            {/* Vertical Bar */}
            <rect
              x={cx - width * 0.06}
              y={y + height * 0.2}
              width={width * 0.12}
              height={height * 0.6}
              fill={isUnlocked ? '#fef08a' : '#52525b'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            {/* Horizontal Crossbar */}
            <rect
              x={cx - width * 0.22}
              y={y + height * 0.38}
              width={width * 0.44}
              height={height * 0.16}
              fill={isUnlocked ? '#fef08a' : '#52525b'}
              stroke={leadLine}
              strokeWidth="2.5"
            />

            {/* Center Rosette Ring */}
            <circle
              cx={cx}
              cy={y + height * 0.46}
              r={width * 0.14}
              fill={isUnlocked ? '#dc2626' : '#3a2020'}
              stroke={leadLine}
              strokeWidth="2.5"
            />
            <circle
              cx={cx}
              cy={y + height * 0.46}
              r={width * 0.07}
              fill={isUnlocked ? '#ffffff' : '#6b7280'}
              stroke={leadLine}
              strokeWidth="2"
            />
          </g>
        );

      default:
        return (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={isUnlocked ? motif.dominantColor : '#141416'}
          />
        );
    }
  };

  return (
    <g className="transition-all duration-500">
      {renderPanelArtwork()}

      {/* Silver Stain Grisaille Shading Overlay (when not unlocked) */}
      {!isUnlocked && (
        <rect
          x={x - 10}
          y={y - 10}
          width={width + 20}
          height={height + 20}
          fill="#000000"
          opacity="0.65"
          className="pointer-events-none mix-blend-multiply"
        />
      )}
    </g>
  );
};
