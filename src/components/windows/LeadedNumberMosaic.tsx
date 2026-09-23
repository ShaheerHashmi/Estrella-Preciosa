import React from 'react';

interface LeadedNumberMosaicProps {
  id: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
  isUnlocked: boolean;
  dominantColor: string;
  accentColor: string;
  isHovered?: boolean;
}

export const LeadedNumberMosaic: React.FC<LeadedNumberMosaicProps> = ({
  id,
  cx,
  cy,
  width,
  height,
  isUnlocked,
  dominantColor,
  accentColor,
  isHovered,
}) => {
  const halfW = width / 2;
  const halfH = height / 2;
  const left = cx - halfW;
  const top = cy - halfH;
  const right = cx + halfW;
  const bottom = cy + halfH;

  // Background tessellated glass facets surrounding the number
  const monoQuarries = [
    '#3f3f46', '#52525b', '#27272a', '#71717a', '#a1a1aa', '#18181b', '#334155'
  ];
  
  // Vibrant gemstone facets
  const vibrantQuarries = [
    dominantColor,
    accentColor,
    adjustHue(dominantColor, 25),
    adjustHue(dominantColor, -25),
    adjustHue(accentColor, 15),
  ];

  const getColor = (index: number, isNumberPart: boolean = false) => {
    if (!isUnlocked) {
      return isNumberPart ? '#e4e4e7' : monoQuarries[index % monoQuarries.length];
    }
    return isNumberPart ? '#ffffff' : vibrantQuarries[index % vibrantQuarries.length];
  };

  // Subtle glass sheen opacity
  const glassOpacity = isUnlocked ? 0.94 : 0.78;

  // Geometric tessellation shards inside each panel (stained glass quarries)
  return (
    <g className="transition-all duration-500">
      {/* Tessellated background shards inside this panel */}
      {/* Shard 1: Top-Left Corner Facet */}
      <polygon
        points={`${left},${top} ${cx},${top} ${cx - halfW * 0.3},${cy - halfH * 0.3} ${left},${cy}`}
        fill={getColor(0)}
        fillOpacity={glassOpacity}
        stroke="#18181b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Shard 2: Top-Right Corner Facet */}
      <polygon
        points={`${cx},${top} ${right},${top} ${right},${cy} ${cx + halfW * 0.3},${cy - halfH * 0.3}`}
        fill={getColor(1)}
        fillOpacity={glassOpacity}
        stroke="#18181b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Shard 3: Bottom-Left Corner Facet */}
      <polygon
        points={`${left},${cy} ${cx - halfW * 0.3},${cy + halfH * 0.3} ${cx},${bottom} ${left},${bottom}`}
        fill={getColor(2)}
        fillOpacity={glassOpacity}
        stroke="#18181b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Shard 4: Bottom-Right Corner Facet */}
      <polygon
        points={`${right},${cy} ${right},${bottom} ${cx},${bottom} ${cx + halfW * 0.3},${cy + halfH * 0.3}`}
        fill={getColor(3)}
        fillOpacity={glassOpacity}
        stroke="#18181b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      
      {/* Center Medallion Shard (Houses the Number) */}
      <polygon
        points={`${cx},${cy - halfH * 0.65} ${cx + halfW * 0.65},${cy} ${cx},${cy + halfH * 0.65} ${cx - halfW * 0.65},${cy}`}
        fill={isUnlocked ? (id === 21 ? '#fbbf24' : dominantColor) : '#27272a'}
        fillOpacity={isUnlocked ? 0.98 : 0.85}
        stroke="#09090b"
        strokeWidth="3.2"
        strokeLinejoin="round"
        filter={isUnlocked ? 'url(#radiant-glow)' : undefined}
      />

      {/* Internal Number Tessellation with Leaded Solder Frame */}
      {/* Outer lead ring around number */}
      <circle
        cx={cx}
        cy={cy}
        r={Math.min(halfW, halfH) * 0.52}
        fill="none"
        stroke="#09090b"
        strokeWidth="3"
      />

      {/* Stylized Leaded Stained Glass Numeral */}
      <text
        x={cx}
        y={cy + (id > 9 ? 6 : 7)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Cinzel', 'Georgia', serif"
        fontSize={id === 21 ? Math.min(width, height) * 0.36 : Math.min(width, height) * (id > 9 ? 0.32 : 0.36)}
        fontWeight="800"
        fill={isUnlocked ? (id === 21 ? '#451a03' : '#ffffff') : '#d4d4d8'}
        stroke="#09090b"
        strokeWidth={isUnlocked ? "1.5" : "1.2"}
        paintOrder="stroke fill"
        letterSpacing="0.05em"
        className="select-none pointer-events-none drop-shadow-md"
      >
        {id}
      </text>

      {/* Diagonal specular glass reflection slash */}
      <line
        x1={left + 4}
        y1={top + 4}
        x2={right - 4}
        y2={bottom - 4}
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeOpacity={isHovered ? 0.6 : (isUnlocked ? 0.4 : 0.2)}
        strokeDasharray="12 18"
        className="pointer-events-none"
      />
    </g>
  );
};

function adjustHue(hex: string, degree: number): string {
  // Simple fallback color variation
  if (!hex.startsWith('#')) return hex;
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const newR = Math.min(255, Math.max(0, r + degree));
  const newG = Math.min(255, Math.max(0, g + Math.round(degree * 0.7)));
  const newB = Math.min(255, Math.max(0, b - Math.round(degree * 0.5)));
  return `rgb(${newR}, ${newG}, ${newB})`;
}
