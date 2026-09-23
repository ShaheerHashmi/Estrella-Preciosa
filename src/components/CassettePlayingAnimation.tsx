import React from 'react';

interface CassettePlayingAnimationProps {
  className?: string;
  isPlaying?: boolean;
}

/**
 * High-fidelity animated SVG replacement for the Walkman cassette playing state.
 * Features rotating gear reels with tape spools, tape counter, indicator LEDs,
 * authentic tape ribbon tension, and metallic textures.
 */
export const CassettePlayingAnimation: React.FC<CassettePlayingAnimationProps> = ({
  className = '',
  isPlaying = true,
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 1000 640"
        className="w-full h-full object-contain rounded-xl drop-shadow-2xl overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle brushed metal chassis gradients */}
          <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#25272c" />
            <stop offset="5%" stopColor="#1e2024" />
            <stop offset="50%" stopColor="#18191d" />
            <stop offset="95%" stopColor="#141518" />
            <stop offset="100%" stopColor="#0d0e10" />
          </linearGradient>

          <linearGradient id="bevelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#454952" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#08090a" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="windowGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22252a" stopOpacity="0.92" />
            <stop offset="40%" stopColor="#121316" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#0a0b0d" stopOpacity="0.98" />
          </linearGradient>

          <linearGradient id="tapeBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2c31" />
            <stop offset="15%" stopColor="#1d1e22" />
            <stop offset="85%" stopColor="#141518" />
            <stop offset="100%" stopColor="#0c0d0f" />
          </linearGradient>

          <linearGradient id="labelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="85%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="magneticTapeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1c110a" />
            <stop offset="50%" stopColor="#3d2314" />
            <stop offset="100%" stopColor="#1c110a" />
          </linearGradient>

          <radialGradient id="spoolCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fafafa" />
            <stop offset="45%" stopColor="#e4e4e7" />
            <stop offset="70%" stopColor="#a1a1aa" />
            <stop offset="100%" stopColor="#52525b" />
          </radialGradient>

          <radialGradient id="indicatorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="40%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>

          {/* Reel Hub Teeth Filter & Shadow */}
          <filter id="hubShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.7" />
          </filter>

          {/* Keyframe animation styling for perpetual gear revolution */}
          <style>{`
            @keyframes cassetteReelSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes cassetteTapeVibrate {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-0.8px); }
            }
            @keyframes vuMeterGlow {
              0%, 100% { opacity: 0.85; }
              50% { opacity: 1; }
            }
            .animate-spin-reel {
              transform-origin: center;
              animation: cassetteReelSpin 2.2s linear infinite;
            }
            .animate-tape-vibe {
              animation: cassetteTapeVibrate 0.12s ease-in-out infinite;
            }
            .animate-vu-meter {
              animation: vuMeterGlow 1.4s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* ========================================================================= */}
        {/* 1. WALKMAN OUTER CHASSIS / FACEPLATE                                      */}
        {/* ========================================================================= */}
        <rect x="0" y="0" width="1000" height="640" rx="20" fill="url(#chassisGrad)" />
        <rect x="2" y="2" width="996" height="636" rx="19" fill="none" stroke="url(#bevelGrad)" strokeWidth="3" />

        {/* Subtle horizontal hairline brushed texture lines */}
        <path
          d="M 10 50 L 990 50 M 10 120 L 990 120 M 10 580 L 990 580"
          stroke="#3f424c"
          strokeWidth="0.8"
          strokeOpacity="0.25"
        />

        {/* Top Header / Walkman Brand Accent */}
        <text
          x="60"
          y="48"
          fill="#94a3b8"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="18"
          letterSpacing="0.28em"
        >
          SONY
        </text>

        <text
          x="160"
          y="48"
          fill="#f59e0b"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="12"
          letterSpacing="0.15em"
        >
          WALKMAN STEREO CASSETTE PLAYER
        </text>

        {/* Status Indicator LED (Glowing bright emerald when playing) */}
        <g transform="translate(890, 36)">
          <circle cx="0" cy="0" r="12" fill="url(#indicatorGlow)" className="animate-vu-meter" />
          <circle cx="0" cy="0" r="4.5" fill="#34d399" />
          <text
            x="-42"
            y="4"
            fill="#a1a1aa"
            fontFamily="system-ui, sans-serif"
            fontWeight="700"
            fontSize="10"
            letterSpacing="0.1em"
          >
            PLAY
          </text>
        </g>

        {/* ========================================================================= */}
        {/* 2. CASSETTE WELL / VIEWING DOOR WINDOW                                    */}
        {/* ========================================================================= */}
        {/* Recessed chamber frame */}
        <rect x="70" y="75" width="860" height="490" rx="16" fill="#0c0d10" stroke="#2a2d34" strokeWidth="2.5" />
        <rect x="85" y="90" width="830" height="460" rx="12" fill="url(#windowGlassGrad)" stroke="#1a1c22" strokeWidth="2" />

        {/* ========================================================================= */}
        {/* 3. CASSETTE TAPE HOUSING (C-90 VINTAGE SHELL)                             */}
        {/* ========================================================================= */}
        <g transform="translate(120, 115)">
          {/* Main Tape Body */}
          <rect x="0" y="0" width="760" height="410" rx="14" fill="url(#tapeBodyGrad)" stroke="#323640" strokeWidth="2" />

          {/* Screw fasteners in four corners & center */}
          <circle cx="20" cy="20" r="5" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          <circle cx="740" cy="20" r="5" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          <circle cx="20" cy="390" r="5" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          <circle cx="740" cy="390" r="5" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          <circle cx="380" cy="390" r="5" fill="#475569" stroke="#1e293b" strokeWidth="1" />

          {/* Tape Label Banner */}
          <path
            d="M 40 40 L 720 40 L 720 180 L 40 180 Z"
            fill="url(#labelGrad)"
            rx="6"
            stroke="#92400e"
            strokeWidth="1.5"
          />

          <text
            x="65"
            y="72"
            fill="#18181b"
            fontFamily="Georgia, serif"
            fontWeight="bold"
            fontSize="18"
            letterSpacing="0.05em"
          >
            SIDE A · ST. GILES CATHEDRAL
          </text>
          <text
            x="65"
            y="94"
            fill="#451a03"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
            fontSize="11"
            letterSpacing="0.1em"
          >
            HIGH FIDELITY · NORMAL BIAS 120µs EQ · STEREO
          </text>

          {/* Central Tape View Window Cutout */}
          <rect x="180" y="125" width="400" height="175" rx="10" fill="#090a0d" stroke="#333842" strokeWidth="2" />

          {/* Horizontal Level Gauge lines in center */}
          <line x1="340" y1="212" x2="420" y2="212" stroke="#52525b" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="365" y="196" fill="#71717a" fontSize="11" fontFamily="monospace" fontWeight="bold">
            100 50 0
          </text>

          {/* ========================================================================= */}
          {/* 4. REVOLVING SPOOLS & MAGNETIC TAPE RIBBON                                */}
          {/* ========================================================================= */}
          {/* Left Magnetic Tape Spool (Fuller pack) */}
          <circle cx="265" cy="212" r="74" fill="url(#magneticTapeGrad)" stroke="#271a10" strokeWidth="2" />

          {/* Right Magnetic Tape Spool (Receiving pack) */}
          <circle cx="495" cy="212" r="54" fill="url(#magneticTapeGrad)" stroke="#271a10" strokeWidth="2" />

          {/* Connecting taut magnetic ribbon spanning both hubs */}
          <path
            d="M 265 284 L 495 264"
            stroke="#1f140e"
            strokeWidth="14"
            strokeLinecap="round"
            className={isPlaying ? 'animate-tape-vibe' : ''}
          />
          <path
            d="M 265 140 L 495 160"
            stroke="#271a10"
            strokeWidth="12"
            strokeLinecap="round"
            className={isPlaying ? 'animate-tape-vibe' : ''}
          />

          {/* LEFT REEL HUB (Rotating Toothed Spool) */}
          <g transform="translate(265, 212)">
            <circle cx="0" cy="0" r="38" fill="url(#spoolCoreGrad)" filter="url(#hubShadow)" />
            <circle cx="0" cy="0" r="30" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="14" fill="#090a0f" />

            {/* 6 Drive Teeth (Spokes) */}
            <g className={isPlaying ? 'animate-spin-reel' : ''}>
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                  key={`left-tooth-${angle}`}
                  x="-3.5"
                  y="-26"
                  width="7"
                  height="12"
                  rx="1.5"
                  fill="#f4f4f5"
                  stroke="#3f3f46"
                  strokeWidth="0.8"
                  transform={`rotate(${angle})`}
                />
              ))}
              {/* Decorative radial groove lines */}
              {[30, 90, 150, 210, 270, 330].map((angle) => (
                <circle
                  key={`left-dot-${angle}`}
                  cx="0"
                  cy="-19"
                  r="2"
                  fill="#71717a"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>
          </g>

          {/* RIGHT REEL HUB (Rotating Toothed Spool) */}
          <g transform="translate(495, 212)">
            <circle cx="0" cy="0" r="38" fill="url(#spoolCoreGrad)" filter="url(#hubShadow)" />
            <circle cx="0" cy="0" r="30" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="14" fill="#090a0f" />

            {/* 6 Drive Teeth (Spokes) */}
            <g className={isPlaying ? 'animate-spin-reel' : ''}>
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                  key={`right-tooth-${angle}`}
                  x="-3.5"
                  y="-26"
                  width="7"
                  height="12"
                  rx="1.5"
                  fill="#f4f4f5"
                  stroke="#3f3f46"
                  strokeWidth="0.8"
                  transform={`rotate(${angle})`}
                />
              ))}
              {[30, 90, 150, 210, 270, 330].map((angle) => (
                <circle
                  key={`right-dot-${angle}`}
                  cx="0"
                  cy="-19"
                  r="2"
                  fill="#71717a"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>
          </g>

          {/* Bottom Tape Roller Guides and Head Window */}
          <path
            d="M 120 370 L 220 325 L 540 325 L 640 370 Z"
            fill="#121316"
            stroke="#272a30"
            strokeWidth="2"
          />
          {/* Pressure Pad / Magnetic Read Head */}
          <rect x="350" y="335" width="60" height="24" rx="4" fill="#71717a" stroke="#d4d4d8" strokeWidth="1.5" />
          <circle cx="210" cy="350" r="8" fill="#52525b" stroke="#71717a" strokeWidth="1" />
          <circle cx="550" cy="350" r="8" fill="#52525b" stroke="#71717a" strokeWidth="1" />
        </g>

        {/* Diagonal Gloss Glare reflection across cassette door glass */}
        <path
          d="M 100 90 L 320 90 L 160 550 L 85 550 Z"
          fill="#ffffff"
          fillOpacity="0.03"
          pointerEvents="none"
        />
        <path
          d="M 380 90 L 520 90 L 290 550 L 220 550 Z"
          fill="#ffffff"
          fillOpacity="0.02"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
};
