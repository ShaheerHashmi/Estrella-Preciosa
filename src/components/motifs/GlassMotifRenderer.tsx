import React from 'react';
import { PanelMotif } from '../../types';

interface GlassMotifRendererProps {
  motif: PanelMotif;
  cx: number;
  cy: number;
  size: number; // approximate bounding diameter
  isUnlocked: boolean;
  isHovered: boolean;
}

export const GlassMotifRenderer: React.FC<GlassMotifRendererProps> = ({
  motif,
  cx,
  cy,
  size,
  isUnlocked,
  isHovered,
}) => {
  const r = size * 0.45;
  const leadColor = '#09090b';

  // Palette: Grisaille (silver-stained frosted pewter & charcoal) vs. Radiant Stained Glass Jewel Tones
  const colDom = isUnlocked ? motif.dominantColor : '#27272a';
  const colSec = isUnlocked ? motif.secondaryColor : '#3f3f46';
  const colAcc = isUnlocked ? motif.accentColor : '#71717a';
  const colGold = isUnlocked ? '#fbbf24' : '#52525b';
  const colWhite = isUnlocked ? '#ffffff' : '#a1a1aa';

  // Render specific stained glass emblem artwork
  const renderArtwork = () => {
    switch (motif.symbol) {
      case 'sunburst': {
        // Sol Invictus - Radiant Sun with Leaded Flares
        return (
          <g>
            {/* Center Core Glass Disc */}
            <circle cx={cx} cy={cy} r={r * 0.42} fill={colSec} stroke={leadColor} strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r={r * 0.24} fill={colAcc} stroke={leadColor} strokeWidth="2" />
            <circle cx={cx} cy={cy} r={r * 0.08} fill={colWhite} />
            {/* Radiating 12 Glass Ray Shards */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30) * (Math.PI / 180);
              const aLeft = ((i * 30) - 10) * (Math.PI / 180);
              const aRight = ((i * 30) + 10) * (Math.PI / 180);
              const tipR = i % 2 === 0 ? r * 0.95 : r * 0.72;
              const tipX = cx + tipR * Math.cos(a);
              const tipY = cy + tipR * Math.sin(a);
              const b1X = cx + (r * 0.42) * Math.cos(aLeft);
              const b1Y = cy + (r * 0.42) * Math.sin(aLeft);
              const b2X = cx + (r * 0.42) * Math.cos(aRight);
              const b2Y = cy + (r * 0.42) * Math.sin(aRight);
              return (
                <polygon
                  key={i}
                  points={`${b1X},${b1Y} ${tipX},${tipY} ${b2X},${b2Y}`}
                  fill={i % 2 === 0 ? colDom : colGold}
                  stroke={leadColor}
                  strokeWidth="2.2"
                />
              );
            })}
          </g>
        );
      }

      case 'doves': {
        // Twin Doves of Concord with Leaded Wings & Olive Branch
        return (
          <g>
            {/* Left Dove */}
            <path
              d={`M ${cx - r * 0.1},${cy - r * 0.15} Q ${cx - r * 0.5},${cy - r * 0.6} ${cx - r * 0.75},${cy - r * 0.2} Q ${cx - r * 0.45},${cy + r * 0.1} ${cx - r * 0.15},${cy + r * 0.25} L ${cx - r * 0.65},${cy + r * 0.55} L ${cx - r * 0.3},${cy + r * 0.35} Z`}
              fill={colWhite}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Right Dove */}
            <path
              d={`M ${cx + r * 0.1},${cy - r * 0.15} Q ${cx + r * 0.5},${cy - r * 0.6} ${cx + r * 0.75},${cy - r * 0.2} Q ${cx + r * 0.45},${cy + r * 0.1} ${cx + r * 0.15},${cy + r * 0.25} L ${cx + r * 0.65},${cy + r * 0.55} L ${cx + r * 0.3},${cy + r * 0.35} Z`}
              fill={colAcc}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Central Olive Sprig */}
            <path
              d={`M ${cx},${cy - r * 0.35} Q ${cx + r * 0.1},${cy - r * 0.1} ${cx},${cy + r * 0.15}`}
              fill="none"
              stroke={colGold}
              strokeWidth="2.5"
            />
            <ellipse cx={cx - r * 0.08} cy={cy - r * 0.25} rx={r * 0.08} ry={r * 0.04} fill={colDom} stroke={leadColor} strokeWidth="1.5" />
            <ellipse cx={cx + r * 0.08} cy={cy - r * 0.15} rx={r * 0.08} ry={r * 0.04} fill={colDom} stroke={leadColor} strokeWidth="1.5" />
          </g>
        );
      }

      case 'triskelion': {
        // Celtic Foliate Triskelion - 3 Spiraling Leaded Shards
        return (
          <g>
            {[0, 120, 240].map((deg, i) => {
              const a = (deg * Math.PI) / 180;
              const cos = Math.cos(a);
              const sin = Math.sin(a);
              return (
                <g key={i} transform={`translate(${cx}, ${cy}) rotate(${deg})`}>
                  <path
                    d={`M 0,0 C ${r * 0.3},-${r * 0.4} ${r * 0.7},-${r * 0.3} ${r * 0.6},${r * 0.1} C ${r * 0.5},${r * 0.4} ${r * 0.1},${r * 0.3} 0,0 Z`}
                    fill={i === 0 ? colDom : i === 1 ? colSec : colAcc}
                    stroke={leadColor}
                    strokeWidth="2.5"
                  />
                  <circle cx={r * 0.45} cy={-r * 0.1} r={r * 0.12} fill={colGold} stroke={leadColor} strokeWidth="2" />
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r={r * 0.16} fill={colWhite} stroke={leadColor} strokeWidth="2.5" />
          </g>
        );
      }

      case 'compass': {
        // Cardinal 8-Point Compass Star
        return (
          <g>
            {/* Background Disc */}
            <circle cx={cx} cy={cy} r={r * 0.85} fill="none" stroke={leadColor} strokeWidth="2" strokeDasharray="3 3" />
            {/* Cardinal Large Points */}
            {[0, 90, 180, 270].map((deg, i) => (
              <g key={`card-${i}`} transform={`translate(${cx}, ${cy}) rotate(${deg})`}>
                <polygon points={`0,-${r * 0.88} -${r * 0.2},0 0,0`} fill={colDom} stroke={leadColor} strokeWidth="2.2" />
                <polygon points={`0,-${r * 0.88} ${r * 0.2},0 0,0`} fill={colAcc} stroke={leadColor} strokeWidth="2.2" />
              </g>
            ))}
            {/* Intercardinal Smaller Points */}
            {[45, 135, 225, 315].map((deg, i) => (
              <g key={`inter-${i}`} transform={`translate(${cx}, ${cy}) rotate(${deg})`}>
                <polygon points={`0,-${r * 0.58} -${r * 0.14},0 0,0`} fill={colSec} stroke={leadColor} strokeWidth="2" />
                <polygon points={`0,-${r * 0.58} ${r * 0.14},0 0,0`} fill={colGold} stroke={leadColor} strokeWidth="2" />
              </g>
            ))}
            <circle cx={cx} cy={cy} r={r * 0.18} fill={colWhite} stroke={leadColor} strokeWidth="2.5" />
          </g>
        );
      }

      case 'rose': {
        // Gothic Briar Rose - 5 Petals with Leaded Veins
        return (
          <g>
            {/* 5 Outer Green Sepals */}
            {Array.from({ length: 5 }).map((_, i) => {
              const deg = i * 72 + 36;
              return (
                <g key={`sep-${i}`} transform={`translate(${cx}, ${cy}) rotate(${deg})`}>
                  <polygon points={`0,-${r * 0.85} -${r * 0.15},-${r * 0.35} ${r * 0.15},-${r * 0.35}`} fill="#15803d" stroke={leadColor} strokeWidth="2" />
                </g>
              );
            })}
            {/* 5 Crimson Rose Petals */}
            {Array.from({ length: 5 }).map((_, i) => {
              const deg = i * 72;
              return (
                <g key={`pet-${i}`} transform={`translate(${cx}, ${cy}) rotate(${deg})`}>
                  <path
                    d={`M 0,0 C -${r * 0.4},-${r * 0.45} -${r * 0.35},-${r * 0.75} 0,-${r * 0.75} C ${r * 0.35},-${r * 0.75} ${r * 0.4},-${r * 0.45} 0,0 Z`}
                    fill={i % 2 === 0 ? colDom : colSec}
                    stroke={leadColor}
                    strokeWidth="2.5"
                  />
                </g>
              );
            })}
            {/* Golden Rose Heart */}
            <circle cx={cx} cy={cy} r={r * 0.26} fill={colGold} stroke={leadColor} strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r={r * 0.12} fill={colWhite} />
          </g>
        );
      }

      case 'lantern': {
        // Alchemical Leaded Lantern with Flame Shard
        return (
          <g>
            {/* Hanging Ring & Dome */}
            <circle cx={cx} cy={cy - r * 0.7} r={r * 0.12} fill="none" stroke={leadColor} strokeWidth="2.5" />
            <path
              d={`M ${cx - r * 0.45},${cy - r * 0.4} Q ${cx},${cy - r * 0.65} ${cx + r * 0.45},${cy - r * 0.4} L ${cx + r * 0.35},${cy - r * 0.3} L ${cx - r * 0.35},${cy - r * 0.3} Z`}
              fill={colSec}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Lantern Glass Body Panes */}
            <polygon points={`${cx - r * 0.4},${cy - r * 0.3} ${cx - r * 0.15},${cy - r * 0.3} ${cx - r * 0.1},${cy + r * 0.4} ${cx - r * 0.3},${cy + r * 0.4}`} fill={colDom} stroke={leadColor} strokeWidth="2.2" />
            <polygon points={`${cx - r * 0.15},${cy - r * 0.3} ${cx + r * 0.15},${cy - r * 0.3} ${cx + r * 0.1},${cy + r * 0.4} ${cx - r * 0.1},${cy + r * 0.4}`} fill={colAcc} stroke={leadColor} strokeWidth="2.2" />
            <polygon points={`${cx + r * 0.15},${cy - r * 0.3} ${cx + r * 0.4},${cy - r * 0.3} ${cx + r * 0.3},${cy + r * 0.4} ${cx + r * 0.1},${cy + r * 0.4}`} fill={colDom} stroke={leadColor} strokeWidth="2.2" />
            {/* Golden Flame Shard Inside */}
            <path
              d={`M ${cx},${cy + r * 0.25} Q ${cx - r * 0.18},${cy} ${cx},${cy - r * 0.18} Q ${cx + r * 0.18},${cy} ${cx},${cy + r * 0.25} Z`}
              fill={colGold}
              stroke={leadColor}
              strokeWidth="2"
            />
            <circle cx={cx} cy={cy + r * 0.05} r={r * 0.07} fill={colWhite} />
            {/* Base Pedestal */}
            <polygon points={`${cx - r * 0.35},${cy + r * 0.4} ${cx + r * 0.35},${cy + r * 0.4} ${cx + r * 0.25},${cy + r * 0.55} ${cx - r * 0.25},${cy + r * 0.55}`} fill={colSec} stroke={leadColor} strokeWidth="2.5" />
          </g>
        );
      }

      case 'pleiades': {
        // Pleiades 7-Star Constellation across Midnight Blue Glass
        const starPositions = [
          { dx: 0, dy: -r * 0.3, size: 0.24 },
          { dx: -r * 0.45, dy: -r * 0.15, size: 0.18 },
          { dx: r * 0.4, dy: -r * 0.2, size: 0.18 },
          { dx: -r * 0.25, dy: r * 0.25, size: 0.22 },
          { dx: r * 0.25, dy: r * 0.2, size: 0.2 },
          { dx: r * 0.5, dy: r * 0.4, size: 0.16 },
          { dx: -r * 0.5, dy: r * 0.45, size: 0.15 },
        ];
        return (
          <g>
            {/* Constellation Connection Lead Lines */}
            <polyline
              points={`${cx - r * 0.45},${cy - r * 0.15} ${cx},${cy - r * 0.3} ${cx + r * 0.4},${cy - r * 0.2} ${cx + r * 0.25},${cy + r * 0.2} ${cx - r * 0.25},${cy + r * 0.25}`}
              fill="none"
              stroke={colAcc}
              strokeWidth="1.8"
              strokeDasharray="4 2"
            />
            {/* 7 Faceted Diamond Stars */}
            {starPositions.map((s, idx) => (
              <g key={idx} transform={`translate(${cx + s.dx}, ${cy + s.dy})`}>
                <polygon
                  points={`0,-${r * s.size} ${r * s.size * 0.35},0 0,${r * s.size} -${r * s.size * 0.35},0`}
                  fill={colWhite}
                  stroke={leadColor}
                  strokeWidth="2"
                />
                <polygon
                  points={`-${r * s.size},0 0,${r * s.size * 0.35} ${r * s.size},0 0,-${r * s.size * 0.35}`}
                  fill={colGold}
                  stroke={leadColor}
                  strokeWidth="1.8"
                />
              </g>
            ))}
          </g>
        );
      }

      case 'knot': {
        // Endless Celtic Infinity Knot
        return (
          <g>
            <path
              d={`M ${cx},${cy} C ${cx - r * 0.5},${cy - r * 0.6} ${cx - r * 0.9},${cy} ${cx - r * 0.5},${cy + r * 0.5} C ${cx},${cy + r * 0.8} ${cx},${cy} ${cx + r * 0.5},${cy - r * 0.5} C ${cx + r * 0.9},${cy} ${cx + r * 0.5},${cy + r * 0.6} Z`}
              fill="none"
              stroke={colDom}
              strokeWidth={r * 0.28}
              strokeLinejoin="round"
            />
            <path
              d={`M ${cx},${cy} C ${cx - r * 0.5},${cy - r * 0.6} ${cx - r * 0.9},${cy} ${cx - r * 0.5},${cy + r * 0.5} C ${cx},${cy + r * 0.8} ${cx},${cy} ${cx + r * 0.5},${cy - r * 0.5} C ${cx + r * 0.9},${cy} ${cx + r * 0.5},${cy + r * 0.6} Z`}
              fill="none"
              stroke={colAcc}
              strokeWidth={r * 0.12}
              strokeLinejoin="round"
            />
            <circle cx={cx - r * 0.42} cy={cy} r={r * 0.14} fill={colGold} stroke={leadColor} strokeWidth="2" />
            <circle cx={cx + r * 0.42} cy={cy} r={r * 0.14} fill={colGold} stroke={leadColor} strokeWidth="2" />
          </g>
        );
      }

      case 'nautilus': {
        // Golden Ratio Nautilus Spiral
        return (
          <g>
            <path
              d={`M ${cx - r * 0.6},${cy + r * 0.4} A ${r * 0.8} ${r * 0.8} 0 0 1 ${cx + r * 0.7},${cy - r * 0.2} A ${r * 0.6} ${r * 0.6} 0 0 1 ${cx - r * 0.3},${cy - r * 0.5} A ${r * 0.4} ${r * 0.4} 0 0 1 ${cx + r * 0.3},${cy + r * 0.1} A ${r * 0.25} ${r * 0.25} 0 0 1 ${cx},${cy - r * 0.1} Z`}
              fill={colDom}
              stroke={leadColor}
              strokeWidth="2.8"
            />
            {/* Chamber Partitions */}
            {[0.2, 0.4, 0.6, 0.8].map((t, idx) => (
              <line
                key={idx}
                x1={cx}
                y1={cy}
                x2={cx + r * Math.cos(idx * 1.2) * (0.3 + idx * 0.15)}
                y2={cy + r * Math.sin(idx * 1.2) * (0.3 + idx * 0.15)}
                stroke={leadColor}
                strokeWidth="2.2"
              />
            ))}
            <circle cx={cx} cy={cy - r * 0.08} r={r * 0.12} fill={colGold} stroke={leadColor} strokeWidth="2" />
          </g>
        );
      }

      case 'wheel': {
        // 12-Spoke Wheel of Fortune
        return (
          <g>
            <circle cx={cx} cy={cy} r={r * 0.82} fill={colDom} stroke={leadColor} strokeWidth="3" />
            <circle cx={cx} cy={cy} r={r * 0.64} fill={colSec} stroke={leadColor} strokeWidth="2.5" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * 45) * (Math.PI / 180);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={cx + r * 0.82 * Math.cos(a)}
                  y2={cy + r * 0.82 * Math.sin(a)}
                  stroke={leadColor}
                  strokeWidth="2.5"
                />
              );
            })}
            <circle cx={cx} cy={cy} r={r * 0.24} fill={colGold} stroke={leadColor} strokeWidth="3" />
            <circle cx={cx} cy={cy} r={r * 0.1} fill={colWhite} />
          </g>
        );
      }

      case 'pillars': {
        // Twin Fluted Pillars & Arch of Triumph
        return (
          <g>
            {/* Overhead Arch */}
            <path
              d={`M ${cx - r * 0.65},${cy - r * 0.3} A ${r * 0.65} ${r * 0.65} 0 0 1 ${cx + r * 0.65},${cy - r * 0.3} L ${cx + r * 0.45},${cy - r * 0.3} A ${r * 0.45} ${r * 0.45} 0 0 0 ${cx - r * 0.45},${cy - r * 0.3} Z`}
              fill={colGold}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Keystone */}
            <polygon points={`${cx - r * 0.15},${cy - r * 0.85} ${cx + r * 0.15},${cy - r * 0.85} ${cx + r * 0.1},${cy - r * 0.65} ${cx - r * 0.1},${cy - r * 0.65}`} fill={colAcc} stroke={leadColor} strokeWidth="2" />
            {/* Left Pillar */}
            <rect x={cx - r * 0.62} y={cy - r * 0.3} width={r * 0.22} height={r * 0.9} fill={colDom} stroke={leadColor} strokeWidth="2.5" />
            <line x1={cx - r * 0.51} y1={cy - r * 0.3} x2={cx - r * 0.51} y2={cy + r * 0.6} stroke={leadColor} strokeWidth="1.5" />
            {/* Right Pillar */}
            <rect x={cx + r * 0.4} y={cy - r * 0.3} width={r * 0.22} height={r * 0.9} fill={colDom} stroke={leadColor} strokeWidth="2.5" />
            <line x1={cx + r * 0.51} y1={cy - r * 0.3} x2={cx + r * 0.51} y2={cy + r * 0.6} stroke={leadColor} strokeWidth="1.5" />
            {/* Base */}
            <rect x={cx - r * 0.75} y={cy + r * 0.6} width={r * 1.5} height={r * 0.18} fill={colSec} stroke={leadColor} strokeWidth="2.5" />
          </g>
        );
      }

      case 'astrolabe': {
        // Celestial Astrolabe Rings & Cross-Hairs
        return (
          <g>
            <circle cx={cx} cy={cy} r={r * 0.82} fill="none" stroke={colGold} strokeWidth="3.5" />
            <circle cx={cx} cy={cy} r={r * 0.62} fill="none" stroke={colSec} strokeWidth="2.5" />
            <ellipse cx={cx} cy={cy} rx={r * 0.62} ry={r * 0.32} fill="none" stroke={colAcc} strokeWidth="2.2" transform={`rotate(30 ${cx} ${cy})`} />
            <line x1={cx - r * 0.82} y1={cy} x2={cx + r * 0.82} y2={cy} stroke={leadColor} strokeWidth="2.5" />
            <line x1={cx} y1={cy - r * 0.82} x2={cx} y2={cy + r * 0.82} stroke={leadColor} strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r={r * 0.16} fill={colWhite} stroke={leadColor} strokeWidth="2.5" />
          </g>
        );
      }

      case 'phoenix': {
        // Soaring Phoenix with Leaded Wing Shards
        return (
          <g>
            {/* Body */}
            <ellipse cx={cx} cy={cy + r * 0.15} rx={r * 0.14} ry={r * 0.35} fill={colDom} stroke={leadColor} strokeWidth="2.5" />
            {/* Head & Crest */}
            <circle cx={cx} cy={cy - r * 0.35} r={r * 0.12} fill={colGold} stroke={leadColor} strokeWidth="2" />
            <polygon points={`${cx},${cy - r * 0.45} ${cx - r * 0.12},${cy - r * 0.7} ${cx + r * 0.12},${cy - r * 0.7}`} fill={colAcc} stroke={leadColor} strokeWidth="2" />
            {/* Left Wings */}
            <path
              d={`M ${cx - r * 0.1},${cy} Q ${cx - r * 0.7},${cy - r * 0.6} ${cx - r * 0.85},${cy - r * 0.3} Q ${cx - r * 0.5},${cy + r * 0.1} ${cx - r * 0.1},${cy + r * 0.3} Z`}
              fill={colSec}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Right Wings */}
            <path
              d={`M ${cx + r * 0.1},${cy} Q ${cx + r * 0.7},${cy - r * 0.6} ${cx + r * 0.85},${cy - r * 0.3} Q ${cx + r * 0.5},${cy + r * 0.1} ${cx + r * 0.1},${cy + r * 0.3} Z`}
              fill={colSec}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Tail Flame Shards */}
            <polygon points={`${cx},${cy + r * 0.45} ${cx - r * 0.25},${cy + r * 0.8} ${cx},${cy + r * 0.65} ${cx + r * 0.25},${cy + r * 0.8}`} fill={colGold} stroke={leadColor} strokeWidth="2.2" />
          </g>
        );
      }

      case 'tree': {
        // Tree of Life Canopy & Roots
        return (
          <g>
            {/* Trunk */}
            <path
              d={`M ${cx - r * 0.15},${cy + r * 0.6} Q ${cx - r * 0.08},${cy} ${cx - r * 0.25},${cy - r * 0.15} L ${cx + r * 0.25},${cy - r * 0.15} Q ${cx + r * 0.08},${cy} ${cx + r * 0.15},${cy + r * 0.6} Z`}
              fill={colSec}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Foliage Clusters */}
            <circle cx={cx} cy={cy - r * 0.45} r={r * 0.35} fill={colDom} stroke={leadColor} strokeWidth="2.5" />
            <circle cx={cx - r * 0.4} cy={cy - r * 0.2} r={r * 0.28} fill={colAcc} stroke={leadColor} strokeWidth="2.2" />
            <circle cx={cx + r * 0.4} cy={cy - r * 0.2} r={r * 0.28} fill={colAcc} stroke={leadColor} strokeWidth="2.2" />
            {/* Golden Fruit Nodes */}
            <circle cx={cx - r * 0.2} cy={cy - r * 0.4} r={r * 0.08} fill={colGold} stroke={leadColor} strokeWidth="1.5" />
            <circle cx={cx + r * 0.2} cy={cy - r * 0.4} r={r * 0.08} fill={colGold} stroke={leadColor} strokeWidth="1.5" />
            <circle cx={cx} cy={cy - r * 0.2} r={r * 0.08} fill={colGold} stroke={leadColor} strokeWidth="1.5" />
          </g>
        );
      }

      case 'mountain': {
        // Alchemical Crystal Mountain Peak
        return (
          <g>
            {/* Sky backdrop */}
            <polygon points={`${cx},${cy - r * 0.85} ${cx + r * 0.8},${cy + r * 0.7} ${cx - r * 0.8},${cy + r * 0.7}`} fill={colSec} stroke={leadColor} strokeWidth="2.8" />
            {/* Left lit facet */}
            <polygon points={`${cx},${cy - r * 0.85} ${cx - r * 0.8},${cy + r * 0.7} ${cx - r * 0.1},${cy + r * 0.7}`} fill={colDom} stroke={leadColor} strokeWidth="2.2" />
            {/* Right shadow facet */}
            <polygon points={`${cx},${cy - r * 0.85} ${cx + r * 0.8},${cy + r * 0.7} ${cx - r * 0.1},${cy + r * 0.7}`} fill={colAcc} stroke={leadColor} strokeWidth="2.2" />
            {/* Snow cap */}
            <polygon points={`${cx},${cy - r * 0.85} ${cx + r * 0.3},${cy - r * 0.25} ${cx},${cy - r * 0.15} ${cx - r * 0.3},${cy - r * 0.25}`} fill={colWhite} stroke={leadColor} strokeWidth="2" />
          </g>
        );
      }

      case 'caravel': {
        // Gilded Caravel Sailing upon Leaded Waves
        return (
          <g>
            {/* Ocean Waves */}
            <path
              d={`M ${cx - r * 0.85},${cy + r * 0.4} Q ${cx - r * 0.4},${cy + r * 0.25} ${cx},${cy + r * 0.4} Q ${cx + r * 0.4},${cy + r * 0.55} ${cx + r * 0.85},${cy + r * 0.4} L ${cx + r * 0.85},${cy + r * 0.75} L ${cx - r * 0.85},${cy + r * 0.75} Z`}
              fill={colDom}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Ship Hull */}
            <path
              d={`M ${cx - r * 0.55},${cy + r * 0.2} L ${cx + r * 0.55},${cy + r * 0.1} Q ${cx + r * 0.4},${cy + r * 0.45} ${cx},${cy + r * 0.45} Q ${cx - r * 0.4},${cy + r * 0.45} ${cx - r * 0.55},${cy + r * 0.2} Z`}
              fill={colSec}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Main Mast & Billowing White Sail */}
            <line x1={cx} y1={cy - r * 0.75} x2={cx} y2={cy + r * 0.2} stroke={leadColor} strokeWidth="2.5" />
            <path
              d={`M ${cx},${cy - r * 0.7} Q ${cx + r * 0.4},${cy - r * 0.35} ${cx},${cy} L ${cx},${cy - r * 0.7} Z`}
              fill={colWhite}
              stroke={leadColor}
              strokeWidth="2.2"
            />
            {/* Fore Sail */}
            <path
              d={`M ${cx - r * 0.05},${cy - r * 0.55} Q ${cx - r * 0.35},${cy - r * 0.25} ${cx - r * 0.05},${cy + r * 0.05} Z`}
              fill={colAcc}
              stroke={leadColor}
              strokeWidth="2"
            />
          </g>
        );
      }

      case 'lyre': {
        // Orphean Stained Glass Lyre
        return (
          <g>
            {/* Lyre Horns */}
            <path
              d={`M ${cx - r * 0.5},${cy - r * 0.65} C ${cx - r * 0.65},${cy + r * 0.1} ${cx - r * 0.3},${cy + r * 0.6} ${cx},${cy + r * 0.65} C ${cx + r * 0.3},${cy + r * 0.6} ${cx + r * 0.65},${cy + r * 0.1} ${cx + r * 0.5},${cy - r * 0.65}`}
              fill="none"
              stroke={colDom}
              strokeWidth={r * 0.18}
              strokeLinecap="round"
            />
            {/* Crossbar */}
            <rect x={cx - r * 0.55} y={cy - r * 0.55} width={r * 1.1} height={r * 0.12} fill={colGold} stroke={leadColor} strokeWidth="2" />
            {/* 4 Silver Strings */}
            {[-0.2, -0.07, 0.07, 0.2].map((offset, i) => (
              <line
                key={i}
                x1={cx + r * offset}
                y1={cy - r * 0.48}
                x2={cx + r * offset * 0.6}
                y2={cy + r * 0.52}
                stroke={colWhite}
                strokeWidth="1.8"
              />
            ))}
          </g>
        );
      }

      case 'pegasus': {
        // Pegasus in Leaping Flight
        return (
          <g>
            {/* Body */}
            <ellipse cx={cx - r * 0.1} cy={cy + r * 0.1} rx={r * 0.35} ry={r * 0.18} fill={colDom} stroke={leadColor} strokeWidth="2.5" transform={`rotate(-25 ${cx - r * 0.1} ${cy + r * 0.1})`} />
            {/* Wing Feather Shards */}
            <path
              d={`M ${cx - r * 0.15},${cy} Q ${cx - r * 0.3},${cy - r * 0.8} ${cx + r * 0.45},${cy - r * 0.65} Q ${cx + r * 0.2},${cy - r * 0.2} ${cx},${cy + r * 0.05} Z`}
              fill={colWhite}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            <path
              d={`M ${cx - r * 0.05},${cy - r * 0.1} Q ${cx},${cy - r * 0.65} ${cx + r * 0.6},${cy - r * 0.45} Q ${cx + r * 0.3},${cy - r * 0.1} ${cx + r * 0.1},${cy + r * 0.08} Z`}
              fill={colAcc}
              stroke={leadColor}
              strokeWidth="2.2"
            />
            {/* Head & Mane */}
            <circle cx={cx + r * 0.35} cy={cy - r * 0.1} r={r * 0.14} fill={colSec} stroke={leadColor} strokeWidth="2" />
          </g>
        );
      }

      case 'moon_star': {
        // Crescent Moon & 8-Point Morning Star
        return (
          <g>
            {/* Crescent Moon */}
            <path
              d={`M ${cx},${cy - r * 0.8} A ${r * 0.8} ${r * 0.8} 0 0 0 ${cx},${cy + r * 0.8} A ${r * 0.62} ${r * 0.62} 0 0 1 ${cx},${cy - r * 0.8} Z`}
              fill={colDom}
              stroke={leadColor}
              strokeWidth="2.8"
            />
            {/* Faceted Star */}
            <g transform={`translate(${cx + r * 0.25}, ${cy})`}>
              <polygon points={`0,-${r * 0.4} ${r * 0.1},0 0,${r * 0.4} -${r * 0.1},0`} fill={colGold} stroke={leadColor} strokeWidth="2" />
              <polygon points={`-${r * 0.4},0 0,${r * 0.1} ${r * 0.4},0 0,-${r * 0.1}`} fill={colGold} stroke={leadColor} strokeWidth="2" />
              <circle cx={0} cy={0} r={r * 0.08} fill={colWhite} />
            </g>
          </g>
        );
      }

      case 'chalice': {
        // Golden Chalice & Grape Cluster
        return (
          <g>
            {/* Chalice Cup */}
            <path
              d={`M ${cx - r * 0.45},${cy - r * 0.55} L ${cx + r * 0.45},${cy - r * 0.55} Q ${cx + r * 0.45},${cy + r * 0.05} ${cx},${cy + r * 0.15} Q ${cx - r * 0.45},${cy + r * 0.05} ${cx - r * 0.45},${cy - r * 0.55} Z`}
              fill={colGold}
              stroke={leadColor}
              strokeWidth="2.8"
            />
            {/* Ruby Wine Top */}
            <ellipse cx={cx} cy={cy - r * 0.55} rx={r * 0.45} ry={r * 0.12} fill={isUnlocked ? '#b91c1c' : '#3f3f46'} stroke={leadColor} strokeWidth="2" />
            {/* Stem & Base */}
            <rect x={cx - r * 0.08} y={cy + r * 0.15} width={r * 0.16} height={r * 0.35} fill={colDom} stroke={leadColor} strokeWidth="2.2" />
            <polygon points={`${cx - r * 0.4},${cy + r * 0.65} ${cx + r * 0.4},${cy + r * 0.65} ${cx},${cy + r * 0.45}`} fill={colGold} stroke={leadColor} strokeWidth="2.5" />
          </g>
        );
      }

      case 'crown': {
        // MASTER 21ST MILESTONE: Imperial Sovereign Crown of 21 Jewels
        return (
          <g>
            {/* Imperial Headband Base */}
            <path
              d={`M ${cx - r * 0.78},${cy + r * 0.35} Q ${cx},${cy + r * 0.48} ${cx + r * 0.78},${cy + r * 0.35} L ${cx + r * 0.72},${cy + r * 0.58} Q ${cx},${cy + r * 0.7} ${cx - r * 0.72},${cy + r * 0.58} Z`}
              fill={colGold}
              stroke={leadColor}
              strokeWidth="3.2"
            />
            {/* Velvet Cap Shards Behind */}
            <path
              d={`M ${cx - r * 0.75},${cy + r * 0.35} Q ${cx - r * 0.65},${cy - r * 0.35} ${cx},${cy - r * 0.38} Q ${cx + r * 0.65},${cy - r * 0.35} ${cx + r * 0.75},${cy + r * 0.35} Z`}
              fill={isUnlocked ? '#831843' : '#27272a'}
              stroke={leadColor}
              strokeWidth="2.5"
            />
            {/* Central Grand Fleur-de-lis Pinnacle */}
            <polygon
              points={`${cx},${cy - r * 0.85} ${cx + r * 0.22},${cy - r * 0.2} ${cx},${cy + r * 0.35} ${cx - r * 0.22},${cy - r * 0.2}`}
              fill={colGold}
              stroke={leadColor}
              strokeWidth="3"
            />
            {/* Left Pinnacle */}
            <polygon
              points={`${cx - r * 0.58},${cy - r * 0.65} ${cx - r * 0.32},${cy - r * 0.05} ${cx - r * 0.65},${cy + r * 0.35}`}
              fill={colGold}
              stroke={leadColor}
              strokeWidth="2.8"
            />
            {/* Right Pinnacle */}
            <polygon
              points={`${cx + r * 0.58},${cy - r * 0.65} ${cx + r * 0.32},${cy - r * 0.05} ${cx + r * 0.65},${cy + r * 0.35}`}
              fill={colGold}
              stroke={leadColor}
              strokeWidth="2.8"
            />
            {/* Cross on Center Tip */}
            <polygon points={`${cx},${cy - r * 0.98} ${cx + r * 0.08},${cy - r * 0.9} ${cx},${cy - r * 0.82} ${cx - r * 0.08},${cy - r * 0.9}`} fill={colWhite} stroke={leadColor} strokeWidth="1.8" />
            {/* 7 Inset Faceted Jewels along the Band */}
            {[-0.55, -0.37, -0.18, 0, 0.18, 0.37, 0.55].map((offset, i) => (
              <circle
                key={i}
                cx={cx + r * offset}
                cy={cy + r * 0.46 + Math.abs(offset) * r * 0.05}
                r={r * 0.075}
                fill={i % 2 === 0 ? (isUnlocked ? '#ef4444' : '#d4d4d8') : (isUnlocked ? '#38bdf8' : '#e4e4e7')}
                stroke={leadColor}
                strokeWidth="1.8"
              />
            ))}
            {/* Central Master Diamond */}
            <polygon
              points={`${cx},${cy - r * 0.05} ${cx + r * 0.14},${cy + r * 0.12} ${cx},${cy + r * 0.28} ${cx - r * 0.14},${cy + r * 0.12}`}
              fill={colWhite}
              stroke={leadColor}
              strokeWidth="2.2"
            />
          </g>
        );
      }

      default:
        return null;
    }
  };

  return (
    <g className="transition-all duration-500">
      {/* 1. Underlying Glass Shard Mosaic */}
      {renderArtwork()}

      {/* 2. Authentic Grisaille Fine Etched Filigree Veins (historical silver-stain enamel effect) */}
      {!isUnlocked && (
        <circle
          cx={cx}
          cy={cy}
          r={r * 0.9}
          fill="none"
          stroke="#52525b"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          opacity={0.6}
        />
      )}

      {/* 3. Subtle Roman Numeral Inset Badge in Medieval Vitreous Script */}
      <g opacity={isHovered ? 1 : 0.85} className="pointer-events-none transition-opacity duration-300">
        <rect
          x={cx - (motif.id === 21 ? 26 : 18)}
          y={cy + r * 0.72}
          width={motif.id === 21 ? 52 : 36}
          height={18}
          rx="9"
          fill="#09090b"
          stroke={isUnlocked ? motif.accentColor : '#52525b'}
          strokeWidth="1.5"
        />
        <text
          x={cx}
          y={cy + r * 0.72 + 12}
          textAnchor="middle"
          fontSize="10"
          fontFamily="'Cinzel', 'Georgia', serif"
          fontWeight="bold"
          fill={isUnlocked ? '#ffffff' : '#a1a1aa'}
          letterSpacing="0.08em"
        >
          {motif.romanNumeral}
        </text>
      </g>
    </g>
  );
};
