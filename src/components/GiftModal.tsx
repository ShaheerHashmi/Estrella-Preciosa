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
      } else if (e.key === 'ArrowLeft' && hasPrevious && onSelectPrevious) {
        onSelectPrevious();
      } else if (e.key === 'ArrowRight' && hasNext && onSelectNext) {
        onSelectNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, expandedImage, hasPrevious, hasNext, onClose, onSelectPrevious, onSelectNext]);

  if (!isOpen) return null;

  // Filter valid image candidates
  const validGiftImages = giftImages.filter(Boolean);
  const imagesToDisplay =
    validGiftImages.length > 0
      ? validGiftImages
      : gift.imageSrc
      ? [gift.imageSrc]
      : panelImageSrc
      ? [panelImageSrc]
      : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-zinc-950/95 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:max-h-[92vh] max-h-[95vh]"
        style={{
          boxShadow: '0 0 50px -10px rgba(245, 158, 11, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* Top Decorative Gold Glass Edge */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 sm:px-7 sm:py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40 shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-xs">
              {panel.id}
            </span>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Panel {panel.id} of 21</span>
              </span>
              <h2 className="text-sm sm:text-base font-serif font-bold text-zinc-100">
                {gift.title || panel.name}
              </h2>
            </div>
          </div>

          {/* Close Window Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Left (Image) and Right (Story) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-zinc-800/80 min-h-0">
          {/* ================= LEFT HALF: GIFT PHOTO / ARTWORK ================= */}
          <div
            className="md:col-span-6 lg:col-span-7 p-4 sm:p-6 flex flex-col items-center justify-center bg-black/50 relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
            }}
          >
            {imagesToDisplay.length > 0 ? (
              imagesToDisplay.length === 2 ? (
                /* Dual Portrait Images (e.g. 5-1 and 5-2) */
                <div className="w-full h-full flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-3 w-full max-h-[60vh] md:max-h-[68vh] min-h-[280px]">
                    {imagesToDisplay.map((src, idx) => (
                      <div
                        key={`dual-img-${idx}`}
                        className="relative group rounded-xl overflow-hidden bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/60 transition-all duration-200 shadow-lg flex flex-col h-full"
                      >
                        <div className="w-full h-full flex items-center justify-center p-2 relative">
                          <img
                            src={src}
                            alt={`${gift.title || panel.name} - Item ${idx + 1}`}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03] cursor-pointer"
                            onClick={() => setExpandedImage(src)}
                            onError={(e) => {
                              if (panelImageSrc && (e.currentTarget as HTMLImageElement).src !== panelImageSrc) {
                                (e.currentTarget as HTMLImageElement).src = panelImageSrc;
                              }
                            }}
                          />
                          {/* Item Badge */}
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/85 text-amber-300 border border-amber-500/30 backdrop-blur-sm pointer-events-none shadow">
                            Item {idx + 1}
                          </div>

                          {/* Enlarge Button */}
                          <button
                            onClick={() => setExpandedImage(src)}
                            className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/80 text-zinc-300 hover:text-white border border-zinc-700/80 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            title="Enlarge Image"
                            aria-label={`Enlarge Item ${idx + 1}`}
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Single Portrait Image: Large Hero Rendition */
                <div className="w-full h-full min-h-[340px] max-h-[55vh] md:max-h-[72vh] rounded-xl overflow-hidden bg-zinc-950/80 border border-zinc-800/90 hover:border-amber-500/40 transition-colors flex items-center justify-center relative shadow-2xl group p-3 sm:p-4">
                  <img
                    src={imagesToDisplay[0]}
                    alt={gift.title || panel.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer drop-shadow-lg"
                    onClick={() => setExpandedImage(imagesToDisplay[0])}
                    onError={(e) => {
                      if (panelImageSrc && (e.currentTarget as HTMLImageElement).src !== panelImageSrc) {
                        (e.currentTarget as HTMLImageElement).src = panelImageSrc;
                      }
                    }}
                  />
                  <button
                    onClick={() => setExpandedImage(imagesToDisplay[0])}
                    className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/80 text-zinc-200 hover:text-white border border-zinc-700/80 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center space-x-1.5 text-xs px-3 py-1.5 backdrop-blur-sm"
                    title="Enlarge Full View"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expand</span>
                  </button>
                </div>
              )
            ) : panelImageSrc ? (
              /* Stained Glass Panel Artwork */
              <div className="w-full h-full min-h-[340px] max-h-[55vh] md:max-h-[72vh] rounded-xl overflow-hidden bg-zinc-950/80 border border-zinc-800 flex items-center justify-center relative shadow-inner group p-4">
                <img
                  src={panelImageSrc}
                  alt={panel.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-md"
                />
              </div>
            ) : (
              /* Placeholder */
              <div className="w-full h-64 md:h-full min-h-[280px] rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col items-center justify-center text-zinc-500 space-y-2.5 p-6 text-center group relative">
                <ImageIcon className="w-12 h-12 stroke-[1.5] text-zinc-600" />
                <p className="text-sm text-zinc-400 font-medium">Portrait Image View</p>
                <span className="text-xs text-zinc-600 max-w-xs">
                  Gift image assets for Panel {panel.id} will render here in full portrait orientation
                </span>
              </div>
            )}
          </div>

          {/* ================= RIGHT HALF: TITLE, ORIGIN, & STORY ================= */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between p-5 sm:p-7 md:overflow-y-auto space-y-6">
            <div className="space-y-5">
              {/* Header Title & Category */}
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {gift.category || 'Special Keepsake'}
                  </span>
                  {gift.dateOrDay && <span className="text-zinc-400">· {gift.dateOrDay}</span>}
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 leading-tight">
                  {gift.title}
                </h3>
              </div>

              {/* Origin Tag */}
              {gift.origin && (
                <div className="flex items-center space-x-2 text-xs text-zinc-300 bg-zinc-900/90 border border-zinc-800 px-3 py-2 rounded-xl">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-zinc-400 font-medium">Origin:</span>
                  <span className="font-semibold text-zinc-200">{gift.origin}</span>
                </div>
              )}

              {/* Story Description */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Story</span>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/60 max-h-[36vh] md:max-h-[44vh] overflow-y-auto">
                  {gift.story}
                </div>
              </div>
            </div>

            {/* Modal Bottom: Navigation controls (Previous / Next) */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs shrink-0">
              <button
                onClick={onSelectPrevious}
                disabled={!hasPrevious}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent transition-colors font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Gift</span>
              </button>

              <button
                onClick={onSelectNext}
                disabled={!hasNext}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-transparent transition-colors font-medium"
              >
                <span>Next Gift</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Overlay on Click */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage}
            alt="Expanded view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 border border-zinc-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
