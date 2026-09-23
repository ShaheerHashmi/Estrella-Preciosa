import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { playFullCelebrationChime } from '../utils/audio';

interface CelebrationBannerProps {
  isVisible: boolean;
  onReset: () => void;
}

export const CelebrationBanner: React.FC<CelebrationBannerProps> = ({ isVisible, onReset }) => {
  useEffect(() => {
    if (isVisible) {
      playFullCelebrationChime();
      // Launch colorful confetti burst
      const end = Date.now() + 3000;
      const colors = ['#fbbf24', '#f43f5e', '#3b82f6', '#10b981', '#a855f7', '#f97316'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="w-full max-w-4xl mx-auto mb-6 p-6 rounded-2xl bg-gradient-to-r from-amber-950/80 via-zinc-900/90 to-amber-950/80 border-2 border-amber-400/60 shadow-2xl text-center backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle glowing halo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
              <Trophy className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-300 tracking-tight">
                The Masterwork is Complete!
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto font-sans">
                All 21 stained glass panels have been unveiled. Every memory, milestone, and gift now radiates with full jewel-toned color. Happy 21st Birthday!
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="celebration-relaunch-btn"
                onClick={() => playFullCelebrationChime()}
                className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Resound Chimes
              </button>

              <button
                id="celebration-reset-btn"
                onClick={onReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center gap-1.5 border border-zinc-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Experience
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
