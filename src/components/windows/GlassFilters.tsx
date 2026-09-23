import React from 'react';

export const GlassFilters: React.FC = () => {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Cathedral Glass Texture (subtle artisanal bubble & grain bump) */}
        <filter id="glass-texture" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.05" numOctaves="3" result="noise" />
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0    0    0    0.25 0"
            in="noise"
            result="coloredNoise"
          />
          <feComposite operator="in" in2="SourceGraphic" result="textured" />
          <feBlend mode="overlay" in="SourceGraphic" in2="textured" />
        </filter>

        {/* Heavy Lead Caming 3D Relief (dark metallic raised solder lines) */}
        <filter id="lead-caming" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.95" />
        </filter>

        {/* Radiant Glass Glow for Unlocked / Hover Panels */}
        <filter id="radiant-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="0.8" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Milestone 21 Grand Crown Glow */}
        <filter id="crown-aurora" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="bigBlur" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0.9
                    0 0.8 0 0 0.7
                    0 0 0.2 0 0.2
                    0 0 0 1 0"
            in="bigBlur"
            result="goldenGlow"
          />
          <feMerge>
            <feMergeNode in="goldenGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Linear gradients for glass depth reflections */}
        <linearGradient id="glass-specular" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>

        <linearGradient id="monochrome-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4f4f5" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#52525b" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
};
