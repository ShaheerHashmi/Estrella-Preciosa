import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Gem, Clock, Gift, BookOpen, CheckCircle2, ChevronRight, ChevronLeft, Volume2, Crown } from 'lucide-react';
import { PanelMotif } from '../types';
import { GlassMotifRenderer } from './motifs/GlassMotifRenderer';
import { playGlassChime } from '../utils/audio';

interface GiftDetailModalProps {
  panel: PanelMotif | null;
  isOpen: boolean;
  isUnlocked: boolean;
  onClose: () => void;
  onUnlock: (id: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const GiftDetailModal: React.FC<GiftDetailModalProps> = ({
  panel,
  isOpen,
  isUnlocked,
  onClose,
  onUnlock,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!panel) return null;

  const handleRevealClick = () => {
    playGlassChime(panel.id);
    onUnlock(panel.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 z-10 my-auto"
            style={{
              boxShadow: isUnlocked
                ? `0 0 60px -10px ${panel.dominantColor}77, 0 25px 50px -12px rgba(0, 0, 0, 0.95)`
                : '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
            }}
          >
            {/* Top Atmospheric Stained Glass Artwork Header */}
            <div
              className="relative h-48 sm:h-56 w-full flex items-center justify-center overflow-hidden border-b border-zinc-800"
              style={{
                background: isUnlocked
                  ? `radial-gradient(circle at center, ${panel.dominantColor}cc 0%, #09090b 85%)`
                  : 'radial-gradient(circle at center, #27272a 0%, #09090b 85%)',
              }}
            >
              {/* Close Button */}
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors z-20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Audio Chime Replay Button */}
              <button
                id="modal-chime-btn"
                onClick={() => playGlassChime(panel.id)}
                title="Play crystal chime"
                className="absolute top-4 left-4 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-700/50 transition-colors z-20 flex items-center gap-1.5 text-xs font-medium px-3"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Chime</span>
              </button>

              {/* Stained Glass Artisan Motif Visual (Authentic Artwork Shards) */}
              <div className="relative flex flex-col items-center justify-center text-center px-4">
                <svg
                  viewBox="0 0 200 200"
                  className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-2xl transition-all duration-700"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    fill={isUnlocked ? panel.dominantColor : '#27272a'}
                    stroke="#09090b"
                    strokeWidth="6"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    fill="none"
                    stroke={isUnlocked ? panel.accentColor : '#52525b'}
                    strokeWidth="1.8"
                  />
                  <GlassMotifRenderer
                    motif={panel}
                    cx={100}
                    cy={100}
                    size={160}
                    isUnlocked={isUnlocked}
                    isHovered={false}
                  />
                </svg>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                      isUnlocked
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-amber-400" />
                        Illuminated in Color
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Unopened (Grisaille)
                      </>
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-900/80 text-zinc-300 border border-zinc-700/60">
                    <Gem className="w-3 h-3 text-cyan-400" />
                    {panel.gemstone}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 sm:p-7 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Title & Roman Numeral */}
              <div>
                <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-widest text-amber-400/90 mb-1">
                  <span>Day {panel.id} of 21</span>
                  <span>•</span>
                  <span>Roman Chapter {panel.romanNumeral}</span>
                  {panel.id === 21 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                      <Crown className="w-3 h-3" />
                      Grand Milestone
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-handwriting text-zinc-50 tracking-wider">
                  {panel.name}
                </h3>
                <p className="text-sm text-zinc-400 italic mt-0.5">{panel.giftSubtitle}</p>
              </div>

              {/* Story / Context Section */}
              <div className="bg-zinc-900/80 rounded-2xl p-4 sm:p-5 border border-zinc-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Stained Glass Motif & Symbolism</span>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                  {panel.giftStory}
                </p>
              </div>

              {/* Gift Clue / Description */}
              <div className="bg-amber-950/20 rounded-2xl p-4 sm:p-5 border border-amber-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <Gift className="w-4 h-4" />
                  <span>Gift Artifact Insight</span>
                </div>
                <p className="text-sm text-amber-100/90 leading-relaxed font-sans font-medium">
                  {panel.giftClue}
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-6 bg-zinc-900/90 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              {/* Prev / Next Panel Navigation */}
              <div className="flex items-center gap-1 text-xs">
                {onPrev && (
                  <button
                    id="modal-prev-btn"
                    onClick={onPrev}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                )}
                {onNext && (
                  <button
                    id="modal-next-btn"
                    onClick={onNext}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  id="modal-return-btn"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Return to Window
                </button>

                {!isUnlocked ? (
                  <button
                    id="modal-unlock-btn"
                    onClick={handleRevealClick}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    Illuminate Stained Glass
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-2 bg-emerald-950/40 rounded-xl border border-emerald-800/50">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Illuminated in Color</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
