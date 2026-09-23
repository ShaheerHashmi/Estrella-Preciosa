import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react';
import { PanelGift } from '../types';
import { PanelRegion } from '../data/panelRegions';

interface GiftModalProps {
  panel: PanelRegion;
  gift: PanelGift;
  panelImageSrc?: string;
  giftImages?: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPrevious?: () => void;
  onSelectNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const GiftModal: React.FC<GiftModalProps> = ({
  panel,
  gift,
  panelImageSrc,
  giftImages = [],
  isOpen,
  onClose,
  onSelectPrevious,
  onSelectNext,
  hasPrevious = false,
  hasNext = false,
}) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Reset expanded image when panel changes
  useEffect(() => {
    setExpandedImage(null);
  }, [panel.id]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (expandedImage) {
          setExpandedImage(null);
        } else {
          onClose();
        }
      } else if (!expandedImage) {
        if (e.key === 'ArrowLeft' && hasPrevious && onSelectPrevious) {
          onSelectPrevious();
        } else if (e.key === 'ArrowRight' && hasNext && onSelectNext) {
          onSelectNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectPrevious, onSelectNext, hasPrevious, hasNext, expandedImage]);

  if (!isOpen) return null;

  // Determine active images to display
  const imagesToDisplay =
    giftImages.length > 0
      ? giftImages
      : gift.imageSrc
      ? [gift.imageSrc]
      : [];

  return (
    <div
      id="gift-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-md animate-fade-in select-text"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="gift-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-modal-title"
        className="relative w-full max-w-5xl bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300 transform scale-100"
      >
        {/* Subtle decorative gold glow border accent at top */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shrink-0" />

        {/* Modal Main Content (Split 2-column on md+) */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* ================= LEFT HALF: PORTRAIT IMAGE(S) ================= */}
          <div
            id="gift-image-section"
            className="md:col-span-6 lg:col-span-7 bg-zinc-900/60 border-b md:border-b-0 md:border-r border-zinc-800/80 p-4 sm:p-6 flex flex-col justify-center items-center relative md:overflow-y-auto"
          >
            {imagesToDisplay.length > 0 ? (
              imagesToDisplay.length === 2 ? (
                /* Dual Portrait Images (e.g. 5-1 and 5-2, 11-1 and 11-2) */
                <div className="w-full h-full flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-3 w-full max-h-[60vh] md:max-h-[68vh] min-h-[280px]">
                    {imagesToDisplay.map((src, idx) => (
                      <div
                        key={`dual-img-${idx}`}
                        className="relative group rounded-xl overflow-hidden bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/60 transition-all duration-200 shadow-lg flex flex-col h-full cursor-pointer"
                        onClick={() => setExpandedImage(src)}
                      >
                        <div className="w-full h-full flex items-center justify-center p-2 relative">
                          <img
                            src={src}
                            alt={`${gift.title || panel.name} - Item ${idx + 1}`}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                          {/* Item Badge */}
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/85 text-amber-300 border border-amber-500/30 backdrop-blur-sm pointer-events-none shadow">
                            Item {idx + 1}
                          </div>

                          {/* Action Button: Enlarge */}
                          <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="p-1.5 rounded-lg bg-black/85 text-zinc-300 group-hover:text-white border border-zinc-700/80 shadow-md">
                              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : imagesToDisplay.length > 2 ? (
                /* 3+ Images Grid */
                <div className="w-full h-full flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-2.5 w-full max-h-[60vh] md:max-h-[68vh] overflow-y-auto p-1">
                    {imagesToDisplay.map((src, idx) => (
                      <div
                        key={`multi-img-${idx}`}
                        className="relative group rounded-xl overflow-hidden bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/60 transition-all duration-200 shadow-md h-48 sm:h-56 cursor-pointer"
                        onClick={() => setExpandedImage(src)}
                      >
                        <div className="w-full h-full flex items-center justify-center p-2 relative">
                          <img
                            src={src}
                            alt={`${gift.title || panel.name} - Item ${idx + 1}`}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-black/85 text-amber-300 border border-amber-500/30 backdrop-blur-sm pointer-events-none">
                            Item {idx + 1}
                          </div>
                          <div className="absolute bottom-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="p-1.5 rounded-lg bg-black/80 text-zinc-300 border border-zinc-700 shadow">
                              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Single Portrait Image: Large Hero Rendition */
                <div
                  className="w-full h-full min-h-[340px] max-h-[55vh] md:max-h-[72vh] rounded-xl overflow-hidden bg-zinc-950/80 border border-zinc-800/90 hover:border-amber-500/40 transition-colors flex items-center justify-center relative shadow-2xl group p-3 sm:p-4 cursor-pointer"
                  onClick={() => setExpandedImage(imagesToDisplay[0])}
                >
                  <img
                    src={imagesToDisplay[0]}
                    alt={gift.title || panel.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-lg"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="p-2 rounded-lg bg-black/85 text-zinc-200 border border-zinc-700/80 shadow-lg flex items-center space-x-1.5 text-xs px-3 py-1.5 backdrop-blur-sm">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Expand</span>
                    </div>
                  </div>
                </div>
              )
            ) : panelImageSrc ? (
              /* Stained Glass Panel Artwork fallback if no gift image */
              <div className="w-full h-full min-h-[340px] max-h-[55vh] md:max-h-[72vh] rounded-xl overflow-hidden bg-zinc-950/80 border border-zinc-800 flex items-center justify-center relative shadow-inner group p-4">
                <img
                  src={panelImageSrc}
                  alt={panel.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-md"
                />
              </div>
            ) : (
              /* Fallback */
              <div className="w-full h-64 md:h-full min-h-[280px] rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col items-center justify-center text-zinc-500 space-y-2.5 p-6 text-center group relative">
                <ImageIcon className="w-12 h-12 stroke-[1.5] text-zinc-600" />
                <p className="text-sm text-zinc-400 font-medium">Portrait Image View</p>
              </div>
            )}
          </div>

          {/* ================= RIGHT HALF: TITLE, ORIGIN, & STORY ================= */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between p-5 sm:p-7 md:overflow-y-auto space-y-6">
            
            {/* Top Bar Navigation & Panel Indicator */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div className="flex items-center space-x-2.5">
                  <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Panel {panel.id} of 21</span>
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {/* Quick Prev / Next across unlocked days */}
                  {hasPrevious && onSelectPrevious && (
                    <button
                      id="btn-prev-gift"
                      onClick={onSelectPrevious}
                      className="p-1.5 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-lg transition-colors"
                      title="Previous Unlocked Gift (Left Arrow)"
                      aria-label="Previous Gift"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  {hasNext && onSelectNext && (
                    <button
                      id="btn-next-gift"
                      onClick={onSelectNext}
                      className="p-1.5 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-lg transition-colors"
                      title="Next Unlocked Gift (Right Arrow)"
                      aria-label="Next Gift"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Close Button */}
                  <button
                    id="btn-close-gift-modal"
                    onClick={onClose}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors ml-1"
                    title="Close (Esc)"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 1. Gift Title */}
              <div>
                <h2
                  id="gift-modal-title"
                  className="text-3xl sm:text-4xl lg:text-4xl font-handwriting text-amber-100 tracking-wider leading-snug"
                >
                  {gift.title}
                </h2>
              </div>
            </div>

            {/* Middle Section: Origin & Story Behind It */}
            <div className="space-y-4 my-auto">
              {/* 2. Origin */}
              {gift.origin && (
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/90 flex items-start space-x-3.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                      Origin
                    </h3>
                    <p className="text-zinc-200 text-sm font-medium mt-0.5">
                      {gift.origin}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. The Story Behind It */}
              <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/70 border border-zinc-800/90 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    The Story Behind It
                  </h3>
                </div>
                <div className="max-h-[36vh] overflow-y-auto pr-1">
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                    {gift.story}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FULL-SCREEN EXPANDED PHOTO LIGHTBOX ================= */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-10 animate-fade-in"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-900/90 text-zinc-200 hover:text-white border border-zinc-700 shadow-xl hover:bg-zinc-800 transition-all z-10"
            title="Close Full View"
            aria-label="Close enlarged view"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
            <img
              src={expandedImage}
              alt={gift.title || panel.name}
              className="max-w-[94vw] max-h-[92vh] object-contain rounded-lg shadow-2xl border border-zinc-800 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
