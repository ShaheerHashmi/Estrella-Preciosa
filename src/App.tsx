import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Upload, CheckCircle2 } from 'lucide-react';
import { PANEL_REGIONS } from './data/panelRegions';
import { GIFTS_DATA } from './data/giftsData';
import { GiftModal } from './components/GiftModal';
import { Panel8Experience } from './components/Panel8Experience';
import { getAllImagesFromDB, saveImageToDB } from './utils/imageStore';
import { getStainedGlassHoverImage, getUnlockStateBaseImage } from './data/panelHoverConfig';

const STORAGE_KEY = 'st_giles_opened_panels';

export default function App() {
  const [zoom, setZoom] = useState<number>(1);
  const [hoveredPanelId, setHoveredPanelId] = useState<number | null>(null);
  const [selectedPanelId, setSelectedPanelId] = useState<number | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [openedPanels, setOpenedPanels] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  // Auto-heal any misclassified audio keys in stored database entries
  const healMusicAudioKeys = (stored: Record<string, string>) => {
    const isImage = (k: string) => {
      const lk = k.toLowerCase();
      return (
        lk.endsWith('.png') ||
        lk.endsWith('.jpg') ||
        lk.endsWith('.jpeg') ||
        lk.endsWith('.svg') ||
        lk.endsWith('.webp') ||
        lk.includes('hover') ||
        lk.includes('mapping')
      );
    };

    // Find State Lines / Novo Amor audio in stored keys
    let stateLinesUrl: string | undefined;
    for (const [k, url] of Object.entries(stored)) {
      const lk = k.toLowerCase();
      if (isImage(lk)) continue;
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('greenpeace') ||
        (lk.includes('antarct') && !lk.includes('seafret') && !lk.includes('phoebe'))
      ) {
        stateLinesUrl = url;
        break;
      }
    }

    // Find Oceans / Seafret / Song 3 audio in stored keys
    let oceansUrl: string | undefined;
    for (const [k, url] of Object.entries(stored)) {
      const lk = k.toLowerCase();
      if (isImage(lk)) continue;
      if (lk.includes('novo') || lk.includes('state line') || lk.includes('phoebe') || lk.includes('waiting')) continue;
      if (
        lk.includes('seafret') ||
        lk.includes('ocean') ||
        lk.includes('dscvr') ||
        lk.includes('vevo') ||
        (lk.includes('forget') && (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.includes('audio'))) ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('3') || lk.includes('three')))
      ) {
        oceansUrl = url;
        break;
      }
    }

    // If State Lines audio exists, ensure Song 1 keys point to it
    if (stateLinesUrl) {
      stored['song-1'] = stateLinesUrl;
      stored['song-1-audio'] = stateLinesUrl;
      stored['song 1'] = stateLinesUrl;
      stored['state lines'] = stateLinesUrl;
    }

    // If Song 3 was mistakenly given State Lines (the bug reported by the user), fix it!
    if (stateLinesUrl && stored['song-3'] === stateLinesUrl) {
      if (oceansUrl) {
        stored['song-3'] = oceansUrl;
        stored['song-3-audio'] = oceansUrl;
        stored['song 3'] = oceansUrl;
        stored['oceans'] = oceansUrl;
      } else {
        delete stored['song-3'];
        delete stored['song-3-audio'];
        delete stored['song 3'];
        delete stored['song3'];
      }
    } else if (oceansUrl && (!stored['song-3'] || isImage(stored['song-3']))) {
      stored['song-3'] = oceansUrl;
      stored['song-3-audio'] = oceansUrl;
      stored['song 3'] = oceansUrl;
    }

    // Find Where's My Love / SYML / Song 4 audio in stored keys
    let symlUrl: string | undefined;
    for (const [k, url] of Object.entries(stored)) {
      const lk = k.toLowerCase();
      if (isImage(lk)) continue;
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('phoebe') ||
        lk.includes('waiting') ||
        lk.includes('seafret') ||
        lk.includes('ocean')
      ) {
        continue;
      }
      if (
        lk.includes('syml') ||
        lk.includes('where\'s my love') ||
        lk.includes('wheres my love') ||
        lk.includes('record parlour') ||
        (lk.includes('crane') && (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.includes('audio'))) ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('4') || lk.includes('four')))
      ) {
        symlUrl = url;
        break;
      }
    }

    if (symlUrl && (!stored['song-4'] || isImage(stored['song-4']))) {
      stored['song-4'] = symlUrl;
      stored['song-4-audio'] = symlUrl;
      stored['song 4'] = symlUrl;
    }

    // Find Before You Go / Lewis Capaldi / Song 5 audio in stored keys
    let capaldiUrl: string | undefined;
    for (const [k, url] of Object.entries(stored)) {
      const lk = k.toLowerCase();
      if (isImage(lk)) continue;
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('phoebe') ||
        lk.includes('waiting') ||
        lk.includes('seafret') ||
        lk.includes('ocean') ||
        lk.includes('syml') ||
        lk.includes('where\'s my love') ||
        lk.includes('wheres my love')
      ) {
        continue;
      }
      if (
        lk.includes('lewis') ||
        lk.includes('capaldi') ||
        lk.includes('before you go') ||
        lk.includes('tiny desk') ||
        lk.includes('npr') ||
        (lk.includes('cupcake') && (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.includes('audio'))) ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('5') || lk.includes('five')))
      ) {
        capaldiUrl = url;
        break;
      }
    }

    if (capaldiUrl && (!stored['song-5'] || isImage(stored['song-5']))) {
      stored['song-5'] = capaldiUrl;
      stored['song-5-audio'] = capaldiUrl;
      stored['song 5'] = capaldiUrl;
    }

    // Find Scott Street / Phoebe Bridgers / Song 6 audio in stored keys
    let scottStreetUrl: string | undefined;
    for (const [k, url] of Object.entries(stored)) {
      const lk = k.toLowerCase();
      if (isImage(lk)) continue;
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('waiting') || // Waiting Room is Song 2
        lk.includes('seafret') ||
        lk.includes('ocean') ||
        lk.includes('syml') ||
        lk.includes('where\'s my love') ||
        lk.includes('wheres my love') ||
        lk.includes('lewis') ||
        lk.includes('capaldi') ||
        lk.includes('before you go')
      ) {
        continue;
      }
      if (
        lk.includes('scott street') ||
        lk.includes('scott') ||
        (lk.includes('phoebe') && lk.includes('kexp') && !lk.includes('waiting')) ||
        (lk.includes('polaroid') && (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.includes('audio'))) ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('6') || lk.includes('six')))
      ) {
        scottStreetUrl = url;
        break;
      }
    }

    if (scottStreetUrl && (!stored['song-6'] || isImage(stored['song-6']))) {
      stored['song-6'] = scottStreetUrl;
      stored['song-6-audio'] = scottStreetUrl;
      stored['song 6'] = scottStreetUrl;
      stored['scott street'] = scottStreetUrl;
    }

    // Remove any image blobs mistakenly mapped to audio keys
    for (const key of ['song-1', 'song-2', 'song-3', 'song-4', 'song-5', 'song-6']) {
      const val = stored[key];
      if (val && isImage(val)) {
        delete stored[key];
      }
    }
  };

  // Helper to persist a file or blob directly to server public/ directory
  const persistFileDirectlyToServer = (file: File | Blob, suggestedName: string, additionalNames?: string[]) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (!base64) return;
        const namesToSave = [suggestedName, ...(additionalNames || [])];
        const uniqueNames = Array.from(new Set(namesToSave));
        for (const name of uniqueNames) {
          fetch('/api/persist-asset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: name, base64 }),
          })
            .then((r) => r.json())
            .then((d) => console.log(`[persistFileDirectlyToServer] Saved ${name}:`, d))
            .catch((err) => console.warn(`[persistFileDirectlyToServer] Failed to save ${name}:`, err));
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.warn('[persistFileDirectlyToServer] Error:', e);
    }
  };

  // Background persistence of stored browser blobs to server public/ folder so they are permanent on disk
  const syncStoredImagesToServer = async (stored: Record<string, string>) => {
    return;
    try {
      const entries = Object.entries(stored);
      if (entries.length === 0) return;
      console.log(`[syncStoredImagesToServer] Evaluating ${entries.length} stored entries for server persistence...`);

      const sentFiles = new Set<string>();

      for (const [key, url] of entries) {
        if (!url || !url.startsWith('blob:')) continue;

        const filenames: string[] = [];
        const lk = key.toLowerCase().trim();

        // 1. Direct filenames with extension
        if (/\.(png|jpe?g|webp|svg|mp3|wav|mp4)$/i.test(key)) {
          filenames.push(key);
        }

        // 2. Hover cutouts
        if (
          lk.includes('hover') &&
          !lk.includes('song') &&
          !lk.includes('play') &&
          !lk.includes('pause') &&
          !lk.includes('stop') &&
          !lk.includes('mapping')
        ) {
          const match = lk.match(/(\d+)/);
          if (match) {
            filenames.push(`${match[1]} - Hover.png`);
          }
        }

        // 3. Progress images
        if (lk.startsWith('progress_') || lk.startsWith('progress-') || lk.includes('progress')) {
          const match = lk.match(/(\d+)/);
          if (match) {
            filenames.push(`progress_${match[1]}.png`);
          }
        }

        // 4. Background
        if (lk === 'background' || lk === 'monochrome') {
          filenames.push('Background.png');
        }

        // 5. Video
        if (lk.includes('video') && lk.includes('8')) {
          filenames.push('Panel 8 - Intro Video.mp4');
        }

        // 6. Music Landing & Cassette
        if (
          lk === 'music-landing' ||
          lk === 'panel-8-landing' ||
          lk === 'gift-8-landing' ||
          lk === 'music-home' ||
          (lk.includes('music') && lk.includes('landing'))
        ) {
          filenames.push('music-landing.svg', 'music-landing.png');
        }
        if (lk.includes('cassette') && (lk.includes('playing') || lk.includes('play') || lk.includes('animat'))) {
          filenames.push('cassette-playing.svg', 'cassette-playing.png');
        }

        // 7. Music Controls & Hovers
        if (lk.includes('play') && lk.includes('hover')) {
          filenames.push('play-hover.png');
        }
        if (lk.includes('pause') && lk.includes('hover')) {
          filenames.push('pause-hover.png');
        }
        if (lk.includes('stop') && lk.includes('hover')) {
          filenames.push('stop-hover.png');
        }
        if (lk.includes('mapping') || (lk.includes('hover') && lk.includes('map'))) {
          filenames.push('hover-mapping.png');
        }

        // 8. Song Hovers (Songs 1 to 7)
        if ((lk.includes('song') && (lk.includes('1') || lk.includes('one'))) || lk.includes('comet')) {
          if (lk.includes('hover') || !lk.includes('audio')) {
            filenames.push('song-1-hover.png');
          }
        }
        if ((lk.includes('song') && (lk.includes('2') || lk.includes('two'))) || lk.includes('ring')) {
          if (lk.includes('hover') || !lk.includes('audio')) {
            filenames.push('song-2-hover.png');
          }
        }
        if ((lk.includes('song') && (lk.includes('3') || lk.includes('three'))) || lk.includes('forget')) {
          if (lk.includes('hover') || !lk.includes('audio')) {
            filenames.push('song-3-hover.png');
          }
        }
        if ((lk.includes('song') && (lk.includes('4') || lk.includes('four'))) || lk.includes('crane')) {
          if (lk.includes('hover') || !lk.includes('audio')) {
            filenames.push('song-4-hover.png');
          }
        }
        if ((lk.includes('song') && (lk.includes('5') || lk.includes('five'))) || lk.includes('cupcake')) {
          if (lk.includes('hover') || !lk.includes('audio')) {
            filenames.push('song-5-hover.png');
          }
        }
        if ((lk.includes('song') && (lk.includes('6') || lk.includes('six'))) || lk.includes('polaroid')) {
          if (lk.includes('hover') || !lk.includes('audio')) {
            filenames.push('song-6-hover.png');
          }
        }
        if ((lk.includes('song') && (lk.includes('7') || lk.includes('seven'))) || lk.includes('tracklist')) {
          if (lk.includes('hover') || !lk.includes('audio')) {
            filenames.push('song-7-hover.png');
          }
        }

        // 9. Song Audio files
        if (
          (lk.includes('song') && (lk.includes('1') || lk.includes('one')) && lk.includes('audio')) ||
          lk.includes('state line') ||
          lk.includes('novo')
        ) {
          filenames.push('song-1.mp3');
        }
        if (
          (lk.includes('song') && (lk.includes('2') || lk.includes('two')) && lk.includes('audio')) ||
          lk.includes('waiting room')
        ) {
          filenames.push('song-2.mp3');
        }
        if (
          (lk.includes('song') && (lk.includes('3') || lk.includes('three')) && lk.includes('audio')) ||
          lk.includes('oceans') ||
          lk.includes('seafret')
        ) {
          filenames.push('song-3.mp3');
        }
        if (
          (lk.includes('song') && (lk.includes('4') || lk.includes('four')) && lk.includes('audio')) ||
          lk.includes("where's my love") ||
          lk.includes('syml')
        ) {
          filenames.push('song-4.mp3');
        }
        if (
          (lk.includes('song') && (lk.includes('5') || lk.includes('five')) && lk.includes('audio')) ||
          lk.includes('before you go') ||
          lk.includes('capaldi')
        ) {
          filenames.push('song-5.mp3');
        }
        if (
          (lk.includes('song') && (lk.includes('6') || lk.includes('six')) && lk.includes('audio')) ||
          lk.includes('scott street')
        ) {
          filenames.push('song-6.mp3');
        }
        if (
          (lk.includes('song') && (lk.includes('7') || lk.includes('seven')) && lk.includes('audio')) ||
          lk.includes('bags') ||
          lk.includes('clairo')
        ) {
          filenames.push('song-7.mp3');
        }

        // 10. Gift Items
        // Panel 5 dual items: 5-1 and 5-2
        if (
          lk.includes('5') &&
          (lk.includes('-1') || lk.includes('_1') || lk.includes('.1') || lk.includes(' 1') || /5[\s_\-\.]1/.test(lk))
        ) {
          filenames.push('gift-5-1.png');
        } else if (
          lk.includes('5') &&
          (lk.includes('-2') || lk.includes('_2') || lk.includes('.2') || lk.includes(' 2') || /5[\s_\-\.]2/.test(lk))
        ) {
          filenames.push('gift-5-2.png');
        }
        // Panel 11 dual items: 11 (or 11-1 / 11-2)
        else if (
          lk.includes('11') &&
          (lk.includes('-1') || lk.includes('_1') || lk.includes('.1') || lk.includes(' 1') || /11[\s_\-\.]1/.test(lk))
        ) {
          filenames.push('gift-11-1.png');
        } else if (lk.includes('11') && (lk.includes('gift') || lk === '11')) {
          filenames.push('gift-11.png');
        }
        // Generic gifts 1 to 21
        else if (lk.startsWith('gift') || lk.includes('gift') || /^\d+$/.test(lk)) {
          const match = lk.match(/(\d+)/);
          if (match) {
            const pId = match[1];
            filenames.push(`gift-${pId}.png`);
          }
        }

        // Process each deduced filename
        for (const fname of filenames) {
          if (sentFiles.has(fname)) continue;
          sentFiles.add(fname);

          try {
            const resp = await fetch(url);
            const blob = await resp.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              if (base64) {
                fetch('/api/persist-asset', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ filename: fname, base64 }),
                })
                  .then((r) => r.json())
                  .then((d) => console.log(`[syncStoredImagesToServer] Persisted ${fname}:`, d))
                  .catch((err) => console.warn(`[syncStoredImagesToServer] Failed to persist ${fname}:`, err));
              }
            };
            reader.readAsDataURL(blob);
          } catch (e) {
            console.warn(`[syncStoredImagesToServer] Error reading blob for ${fname}:`, e);
          }
        }
      }
    } catch (e) {
      console.error('[syncStoredImagesToServer] Global error:', e);
    }
  };

  // Load all embedded window images from persistence
  useEffect(() => {
    getAllImagesFromDB().then((stored) => {
      if (stored && Object.keys(stored).length > 0) {
        healMusicAudioKeys(stored);
        setImages(stored);
      }
    });
  }, []);

  // Save opened panels progress
  const saveOpenedPanels = (panels: number[]) => {
    setOpenedPanels(panels);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(panels));
    } catch (e) {
      console.error('Failed to save opened panels', e);
    }
  };

  const nextUnlockableId = openedPanels.length + 1;

  // Handle panel click with strict sequential order enforcement
  const handlePanelClick = (panelId: number) => {
    if (openedPanels.includes(panelId)) {
      // Already unlocked panel: open gift modal to view story/origin
      setSelectedPanelId(panelId);
    } else if (panelId === nextUnlockableId) {
      // Exactly the next sequential panel: unlock it and open modal!
      const updated = [...openedPanels, panelId];
      saveOpenedPanels(updated);
      setSelectedPanelId(panelId);
    } else {
      // Not in the right numerical order: do nothing per requirement
    }
  };

  const handleResetProgress = () => {
    saveOpenedPanels([]);
    setHoveredPanelId(null);
    setSelectedPanelId(null);
    try {
      localStorage.removeItem('panel8_song1_completed');
      localStorage.removeItem('panel8_song2_completed');
      localStorage.removeItem('panel8_song3_completed');
      localStorage.removeItem('panel8_song4_completed');
      localStorage.removeItem('panel8_song5_completed');
      localStorage.removeItem('panel8_song6_completed');
    } catch {
      // ignore
    }
  };

  // Helper to extract matching gift images for a specific panel
  // STRICT REQUIREMENT: Only Panel 5 (items 5-1 & 5-2) and Panel 11 (gift-11 & gift-11-1) have dual images; all others have exactly 1.
  const getGiftImagesForPanel = (
    panelId: number,
    imgMap: Record<string, string>,
    gift?: typeof selectedGift
  ): string[] => {
    const pStr = panelId.toString();

    // ==========================================
    // 1. PANEL 5 (Must include 5-1 and 5-2)
    // ==========================================
    if (panelId === 5) {
      let item1Url: string | undefined;
      let item2Url: string | undefined;
      const allP5Urls: string[] = [];

      Object.entries(imgMap).forEach(([rawKey, url]) => {
        const key = rawKey.toLowerCase().trim();
        if (key.includes('progress') || key.includes('hover') || key === 'background') return;

        // Check if key is related to panel 5
        if (!key.includes('5')) return;

        if (!allP5Urls.includes(url)) {
          allP5Urls.push(url);
        }

        // Check if key is for item 1 (5-1, 5_1, 5.1, gift-5-1, gift_5_1, etc.)
        if (
          key === 'gift-5-1' ||
          key === 'gift_5_1' ||
          key === '5-1' ||
          key === '5_1' ||
          key.includes('5-1') ||
          key.includes('5_1') ||
          key.includes('5.1') ||
          key.includes('5 1') ||
          /5[\s_\-\.]1/i.test(key)
        ) {
          item1Url = url;
          return;
        }

        // Check if key is for item 2 (5-2, 5_2, 5.2, gift-5-2, gift_5_2, etc.)
        if (
          key === 'gift-5-2' ||
          key === 'gift_5_2' ||
          key === '5-2' ||
          key === '5_2' ||
          key.includes('5-2') ||
          key.includes('5_2') ||
          key.includes('5.2') ||
          key.includes('5 2') ||
          /5[\s_\-\.]2/i.test(key)
        ) {
          item2Url = url;
          return;
        }
      });

      // If both item1 and item2 found with distinct URLs, return both
      if (item1Url && item2Url && item1Url !== item2Url) {
        return [item1Url, item2Url];
      }

      // If we have at least 2 distinct panel 5 images in map, return both
      if (allP5Urls.length >= 2) {
        if (item1Url) {
          const second = allP5Urls.find((u) => u !== item1Url);
          if (second) return [item1Url, second];
        }
        return [allP5Urls[0], allP5Urls[1]];
      }

      if (item1Url && item2Url) return [item1Url, item2Url];
      if (item1Url) return [item1Url, '/gift-5-2.png'];
      if (item2Url) return ['/gift-5-1.png', item2Url];
      if (allP5Urls.length > 0) return [allP5Urls[0], '/gift-5-2.png'];

      return ['/gift-5-1.png', '/gift-5-2.png'];
    }

    // ==========================================
    // 2. PANEL 11 (Must include gift-11 and gift-11-1)
    // ==========================================
    if (panelId === 11) {
      let item1Url: string | undefined; // Base gift (gift-11)
      let item2Url: string | undefined; // Sub-item (gift-11-1)
      const allP11Urls: string[] = [];

      Object.entries(imgMap).forEach(([rawKey, url]) => {
        const key = rawKey.toLowerCase().trim();
        if (key.includes('progress') || key.includes('hover') || key === 'background') return;

        if (!key.includes('11')) return;

        if (!allP11Urls.includes(url)) {
          allP11Urls.push(url);
        }

        // Check for sub-item: gift-11-1, 11-1, gift_11_1, gift-11-2, etc.
        if (
          key === 'gift-11-1' ||
          key === 'gift_11_1' ||
          key === '11-1' ||
          key === '11_1' ||
          key.includes('11-1') ||
          key.includes('11_1') ||
          key.includes('11.1') ||
          key.includes('11 1') ||
          key.includes('11-2') ||
          key.includes('11_2') ||
          /11[\s_\-\.]\d+/i.test(key)
        ) {
          item2Url = url;
          return;
        }

        // Base gift: gift-11, gift_11, gift 11, gift11, 11
        if (
          key === 'gift-11' ||
          key === 'gift_11' ||
          key === 'gift 11' ||
          key === 'gift11' ||
          key === '11' ||
          /^gift[\s_\-]?11(?:\.\w+)?$/i.test(key)
        ) {
          item1Url = url;
          return;
        }
      });

      // If both item1 and item2 found with distinct URLs, return both
      if (item1Url && item2Url && item1Url !== item2Url) {
        return [item1Url, item2Url];
      }

      // If we have at least 2 distinct URLs stored for panel 11, return both
      if (allP11Urls.length >= 2) {
        if (item1Url) {
          const second = allP11Urls.find((u) => u !== item1Url);
          if (second) return [item1Url, second];
        }
        return [allP11Urls[0], allP11Urls[1]];
      }

      if (item1Url) return [item1Url, '/gift-11-1.png'];
      if (item2Url) return ['/gift-11.png', item2Url];
      if (allP11Urls.length === 1) return [allP11Urls[0], '/gift-11-1.png'];

      return ['/gift-11.png', '/gift-11-1.png'];
    }

    // ==========================================
    // 3. ALL OTHER PANELS: Strictly ONE (1) Gift Image
    // ==========================================
    for (const prefix of [`gift-${pStr}`, `gift_${pStr}`, `gift ${pStr}`, `gift${pStr}`, pStr]) {
      if (imgMap[prefix]) return [imgMap[prefix]];
    }

    for (const [rawKey, url] of Object.entries(imgMap)) {
      const key = rawKey.toLowerCase().trim();
      if (key.includes('progress') || key.includes('hover') || key === 'background') continue;
      if (new RegExp(`^gift[\\s_\\-]?${pStr}(?:\\.\\w+)?$`, 'i').test(key)) {
        return [url];
      }
    }

    // Fallback if defined in static data
    if (gift?.imageSrc) {
      return [gift.imageSrc];
    }

    // Final reliable fallback to static asset in public/
    return [`/gift-${pStr}.png`];
  };

  // Helper to retrieve Panel 8 static landing image
  const getPanel8LandingImage = (imgMap: Record<string, string>): string | undefined => {
    // 1. Direct explicit landing keys
    const directKeys = [
      'music-landing',
      'panel-8-landing',
      'gift-8-landing',
      'music-home',
      'gift-8',
      'gift_8',
      'gift 8',
      'gift8',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }

    // 2. Any key containing music, landing, player, static, or walkman
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.includes('progress') || lk.includes('hover') || lk === 'background' || lk === '8') continue;
      if (
        lk.includes('music') ||
        lk.includes('landing') ||
        lk.includes('player') ||
        lk.includes('static') ||
        lk.includes('walkman') ||
        lk.includes('cassette') ||
        lk.includes('home')
      ) {
        return url;
      }
    }

    // 3. Any key matching 'gift-8'
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.includes('progress') || lk.includes('hover') || lk === 'background' || lk === '8') continue;
      if (lk.includes('gift-8') || lk.includes('gift_8')) {
        return url;
      }
    }

    return '/music-landing.svg';
  };

  // Helper to retrieve the stained glass cutout overlay image for a panel
  const getPanelHoverImage = (panelId: number, imgMap: Record<string, string>): string | undefined => {
    return getStainedGlassHoverImage(panelId, imgMap);
  };

  // Helper to retrieve Panel 8 video source
  const getPanel8Video = (imgMap: Record<string, string>): string | undefined => {
    const videoKeys = ['video-8', 'panel-8-video', 'gift-8-video', 'video_8', 'video8', 'panel 8 - intro video', 'panel 8 - intro video.mov', 'panel 8 - intro video.mp4', 'panel 8'];
    for (const key of videoKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.includes('video') && (lk.includes('8') || lk.includes('panel') || lk.includes('intro'))) {
        return url;
      }
    }
    // Hardcoded static references in public/
    return '/Panel 8 - Intro Video.mp4';
  };

  // Helper to retrieve Play Hover image for Panel 8 Music Player
  const getMusicPlayHoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'play-hover',
      'play_hover',
      'play hover',
      'hover-play',
      'hover_play',
      'hover play',
      'play',
      'play.png',
      'play-hover.png',
      'play_hover.png',
      'play hover.png',
      'music-play-hover',
      'panel-8-play-hover',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.includes('play') && (lk.includes('hover') || lk.includes('btn') || lk.includes('button'))) {
        return url;
      }
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.includes('player') || lk.includes('display') || lk.includes('playlist')) continue;
      if (lk.startsWith('play') || lk.endsWith('play') || lk.includes('play_') || lk.includes('play-')) {
        return url;
      }
    }
    return '/play-hover.png';
  };

  // Helper to retrieve Pause Hover image for Panel 8 Music Player
  const getMusicPauseHoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'pause-hover',
      'pause_hover',
      'pause hover',
      'hover-pause',
      'hover_pause',
      'hover pause',
      'pause',
      'pause.png',
      'pause-hover.png',
      'pause_hover.png',
      'pause hover.png',
      'music-pause-hover',
      'panel-8-pause-hover',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.includes('pause')) {
        return url;
      }
    }
    return '/pause-hover.png';
  };

  // Helper to retrieve Stop Hover image for Panel 8 Music Player
  const getMusicStopHoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'stop-hover',
      'stop_hover',
      'stop hover',
      'stophover',
      'stop-state-hover',
      'hover-stop',
      'hover_stop',
      'hover stop',
      'hoverstop',
      'stop',
      'stop.png',
      'stop-hover.png',
      'stop_hover.png',
      'stop hover.png',
      'music-stop-hover',
      'panel-8-stop-hover',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.includes('stop')) {
        return url;
      }
    }
    return '/stop-hover.png';
  };

  // Helper to retrieve Golden Comet (Song 1) Hover image for Panel 8
  const getSong1HoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song 1 - golden comet hover',
      'song 1 - golden comet hover.png',
      'song 1 - golden comet hover.svg',
      'song-1-golden-comet-hover',
      'song 1 golden comet hover',
      'song 1 - golden comet',
      'song 1 golden comet',
      'golden-comet-hover',
      'golden_comet_hover',
      'golden comet hover',
      'golden-comet',
      'golden_comet',
      'golden comet',
      'comet-hover',
      'comet_hover',
      'comet hover',
      'comet',
      'song-1-hover',
      'song_1_hover',
      'song 1 hover',
      'song1-hover',
      'song1_hover',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.ogg') || lk.endsWith('.m4a')) continue;
      if (
        lk.includes('comet') ||
        (lk.includes('song') && lk.includes('1') && lk.includes('hover')) ||
        (lk.includes('golden') && lk.includes('hover')) ||
        lk.includes('golden comet')
      ) {
        return url;
      }
    }
    return '/song-1-hover.png';
  };

  // Helper to retrieve Ring (Song 2) Hover image for Panel 8
  const getSong2HoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song 2 - ring hover',
      'song 2 - ring hover.png',
      'song 2 - ring hover.svg',
      'song-2-ring-hover',
      'song 2 ring hover',
      'song 2 - ring',
      'song 2 ring',
      'ring-hover',
      'ring_hover',
      'ring hover',
      'ring',
      'ring.png',
      'ring.svg',
      'song-2-hover',
      'song_2_hover',
      'song 2 hover',
      'song2-hover',
      'song2_hover',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.ogg') || lk.endsWith('.m4a') || lk.endsWith('.flac') || lk.endsWith('.aac')) continue;
      if (
        lk.includes('ring') ||
        (lk.includes('song') && (lk.includes('2') || lk.includes('two')) && lk.includes('hover')) ||
        (lk.includes('track') && (lk.includes('2') || lk.includes('two')) && lk.includes('hover'))
      ) {
        return url;
      }
    }
    return '/song-2-hover.png';
  };

  // Helper to retrieve Forget Me Not (Song 3) Hover image for Panel 8
  const getSong3HoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song 3 - forget me not hover',
      'song 3 - forget me not hover.png',
      'song 3 - forget me not hover.svg',
      'song 3 - forget me not',
      'song 3 - forget-me-not',
      'song-3-forget-me-not-hover',
      'song 3 forget me not hover',
      'forget me not hover',
      'forget me not hover.png',
      'forget me not hover.svg',
      'forget-me-not-hover',
      'forget_me_not_hover',
      'forget me not',
      'forget-me-not',
      'forget_me_not',
      'forgetmenot',
      'forget',
      'song-3-hover',
      'song_3_hover',
      'song 3 hover',
      'song3-hover',
      'song3_hover',
      'oceans-hover',
      'oceans hover',
      'seafret-hover',
      'seafret hover',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.ogg') || lk.endsWith('.m4a') || lk.endsWith('.flac') || lk.endsWith('.aac')) continue;
      if (
        lk.includes('forget') ||
        (lk.includes('song') && (lk.includes('3') || lk.includes('three')) && lk.includes('hover')) ||
        (lk.includes('track') && (lk.includes('3') || lk.includes('three')) && lk.includes('hover')) ||
        (lk.includes('ocean') && lk.includes('hover')) ||
        (lk.includes('seafret') && lk.includes('hover'))
      ) {
        return url;
      }
    }
    return '/song-3-hover.png';
  };

  // Helper to retrieve Paper Crane (Song 4) Hover image for Panel 8
  const getSong4HoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song 4 - paper crane hover',
      'song 4 - paper crane hover.png',
      'song 4 - paper crane hover.svg',
      'song 4 - paper crane',
      'song 4 - paper-crane',
      'song-4-paper-crane-hover',
      'song 4 paper crane hover',
      'paper crane hover',
      'paper crane hover.png',
      'paper crane hover.svg',
      'paper-crane-hover',
      'paper_crane_hover',
      'paper crane',
      'paper-crane',
      'paper_crane',
      'crane hover',
      'crane hover.png',
      'crane hover.svg',
      'crane-hover',
      'crane_hover',
      'crane',
      'crane.png',
      'crane.svg',
      'syml hover',
      'syml-hover',
      'syml',
      'where\'s my love hover',
      'where\'s my love',
      'wheres my love hover',
      'wheres my love',
      'song-4-hover',
      'song_4_hover',
      'song 4 hover',
      'song4-hover',
      'song4_hover',
      'song-4',
      'song 4',
      'song4',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.ogg') || lk.endsWith('.m4a') || lk.endsWith('.flac') || lk.endsWith('.aac')) continue;
      if (
        lk.includes('crane') ||
        lk.includes('syml') ||
        lk.includes('where\'s my love') ||
        lk.includes('wheres my love') ||
        (lk.includes('song') && (lk.includes('4') || lk.includes('four')) && lk.includes('hover')) ||
        (lk.includes('track') && (lk.includes('4') || lk.includes('four')) && lk.includes('hover'))
      ) {
        return url;
      }
    }
    return '/song-4-hover.png';
  };

  // Helper to retrieve Cupcake (Song 5) Hover image for Panel 8
  const getSong5HoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song 5 - cupcake hover',
      'song 5 - cupcake hover.png',
      'song 5 - cupcake hover.svg',
      'song 5 - cupcake',
      'song 5 cupcake hover',
      'song-5-cupcake-hover',
      'cupcake hover',
      'cupcake hover.png',
      'cupcake hover.svg',
      'cupcake-hover',
      'cupcake_hover',
      'cupcake',
      'cupcake.png',
      'cupcake.svg',
      'lewis capaldi hover',
      'lewis-capaldi-hover',
      'before you go hover',
      'before you go',
      'song-5-hover',
      'song_5_hover',
      'song 5 hover',
      'song5-hover',
      'song5_hover',
      'song-5',
      'song 5',
      'song5',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.ogg') || lk.endsWith('.m4a') || lk.endsWith('.flac') || lk.endsWith('.aac')) continue;
      if (
        lk.includes('cupcake') ||
        lk.includes('before you go') ||
        (lk.includes('song') && (lk.includes('5') || lk.includes('five')) && lk.includes('hover')) ||
        (lk.includes('track') && (lk.includes('5') || lk.includes('five')) && lk.includes('hover'))
      ) {
        return url;
      }
    }
    return '/song-5-hover.png';
  };

  // Helper to retrieve Polaroid (Song 6) Hover image for Panel 8
  const getSong6HoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song 6 - polaroid hover',
      'song 6 - polaroid hover.png',
      'song 6 - polaroid hover.svg',
      'song 6 - polaroid',
      'song 6 polaroid hover',
      'song-6-polaroid-hover',
      'polaroid hover',
      'polaroid hover.png',
      'polaroid hover.svg',
      'polaroid-hover',
      'polaroid_hover',
      'polaroid',
      'polaroid.png',
      'polaroid.svg',
      'phoebe bridgers scott street hover',
      'scott street hover',
      'scott street',
      'scott-street',
      'song-6-hover',
      'song_6_hover',
      'song 6 hover',
      'song6-hover',
      'song6_hover',
      'song-6',
      'song 6',
      'song6',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.ogg') || lk.endsWith('.m4a') || lk.endsWith('.flac') || lk.endsWith('.aac')) continue;
      if (
        lk.includes('polaroid') ||
        lk.includes('scott street') ||
        (lk.includes('song') && (lk.includes('6') || lk.includes('six')) && lk.includes('hover')) ||
        (lk.includes('track') && (lk.includes('6') || lk.includes('six')) && lk.includes('hover'))
      ) {
        return url;
      }
    }
    return '/song-6-hover.png';
  };

  // Helper to retrieve Complete Tracklist (Song 7) Hover image for Panel 8
  const getSong7HoverImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song 7 - complete tracklist hover',
      'song 7 - complete tracklist hover.png',
      'song 7 - complete tracklist hover.svg',
      'song 7 - complete tracklist',
      'song 7 complete tracklist hover',
      'song-7-complete-tracklist-hover',
      'complete tracklist hover',
      'complete tracklist hover.png',
      'complete tracklist hover.svg',
      'complete-tracklist-hover',
      'complete_tracklist_hover',
      'complete tracklist',
      'complete-tracklist',
      'tracklist hover',
      'tracklist hover.png',
      'tracklist hover.svg',
      'tracklist-hover',
      'tracklist_hover',
      'tracklist',
      'tracklist.png',
      'tracklist.svg',
      'clairo hover',
      'clairo bags hover',
      'bags hover',
      'song-7-hover',
      'song_7_hover',
      'song 7 hover',
      'song7-hover',
      'song7_hover',
      'song-7',
      'song 7',
      'song7',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.ogg') || lk.endsWith('.m4a') || lk.endsWith('.flac') || lk.endsWith('.aac')) continue;
      if (
        lk.includes('tracklist') ||
        (lk.includes('song') && (lk.includes('7') || lk.includes('seven')) && lk.includes('hover')) ||
        (lk.includes('track') && (lk.includes('7') || lk.includes('seven')) && lk.includes('hover')) ||
        (lk.includes('clairo') && lk.includes('hover')) ||
        (lk.includes('bags') && lk.includes('hover'))
      ) {
        return url;
      }
    }
    return '/song-7-hover.png';
  };

  // Helper to retrieve user-uploaded Cassette Playing Animated SVG/Image if present
  const getMusicCassettePlayingSvg = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'play state - animated svg',
      'play state - animated',
      'play-state-animated-svg',
      'play_state_animated_svg',
      'play-state',
      'play_state',
      'play state',
      'animated svg',
      'animated-svg',
      'animated_svg',
      'cassette-playing',
      'cassette_playing',
      'cassette playing',
      'cassette-play',
      'cassette_play',
      'cassette play',
      'playing-cassette',
      'playing_cassette',
      'playing cassette',
      'cassette-animation',
      'cassette_animation',
      'cassette animation',
      'cassette-playing.svg',
      'cassette_playing.svg',
      'cassette playing.svg',
      'cassette.svg',
      'playing.svg',
      'walkman-playing',
      'walkman_playing',
      'walkman playing',
      'music-playing',
      'music_playing',
      'music playing',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (
        lk.includes('play state') ||
        (lk.includes('state') && lk.includes('anim')) ||
        ((lk.includes('cassette') || lk.includes('walkman') || lk.includes('tape')) &&
          (lk.includes('play') || lk.includes('anim') || lk.endsWith('.svg')))
      ) {
        return url;
      }
    }
    return '/play state - animated svg.svg';
  };

  // Helper to retrieve Play Button Click Sound Effect
  const getPlayClickAudio = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'play button sound',
      'play_button_sound',
      'play-button-sound',
      'play button sound.mp3',
      'play button sound.wav',
      'play button sound.ogg',
      'play button sound.m4a',
      'play-click',
      'play_click',
      'play click',
      'play-sfx',
      'play_sfx',
      'play sfx',
      'play-sound',
      'play_sound',
      'play sound',
      'click-play',
      'click_play',
      'play.mp3',
      'play.wav',
      'play.ogg',
      'play-click.mp3',
      'play_click.mp3',
      'play-click.wav',
      'play_click.wav',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (
        lk.includes('play') &&
        (lk.includes('sound') || lk.includes('click') || lk.includes('sfx') || lk.includes('audio') || lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.m4a') || lk.endsWith('.ogg'))
      ) {
        return url;
      }
    }
    return '/start button sound.mp3';
  };

  // Helper to retrieve Pause Button Click Sound Effect
  const getPauseClickAudio = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'pause button sound',
      'pause_button_sound',
      'pause-button-sound',
      'pause button sound.mp3',
      'pause button sound.wav',
      'pause button sound.ogg',
      'pause button sound.m4a',
      'pause-click',
      'pause_click',
      'pause click',
      'pause-sfx',
      'pause_sfx',
      'pause sfx',
      'pause-sound',
      'pause_sound',
      'pause sound',
      'click-pause',
      'click_pause',
      'pause.mp3',
      'pause.wav',
      'pause.ogg',
      'pause-click.mp3',
      'pause_click.mp3',
      'pause-click.wav',
      'pause_click.wav',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (
        lk.includes('pause') &&
        (lk.includes('sound') || lk.includes('click') || lk.includes('sfx') || lk.includes('audio') || lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.m4a') || lk.endsWith('.ogg'))
      ) {
        return url;
      }
    }
    return '/pause button sound.mp3';
  };

  // Helper to check if a key or filename is an image rather than an audio file
  const isLikelyImageKey = (key: string): boolean => {
    const lk = key.toLowerCase();
    return (
      lk.endsWith('.png') ||
      lk.endsWith('.jpg') ||
      lk.endsWith('.jpeg') ||
      lk.endsWith('.svg') ||
      lk.endsWith('.webp') ||
      lk.endsWith('.gif') ||
      lk.includes('hover') ||
      lk.includes('mapping') ||
      lk.includes('landing') ||
      lk.includes('button') ||
      lk.includes('btn') ||
      lk.includes('tier') ||
      lk.includes('progress')
    );
  };

  // Helper to retrieve Song 1 (Novo Amor - State Lines) audio file
  const getSong1Audio = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song-1-audio',
      'song_1_audio',
      'song 1 audio',
      'song-1-audio-novo-amor-state-lines.mp3',
      'song-1-audio-novomor.mp3',
      'state lines.mp3',
      'state lines',
      'novo amor.mp3',
      'novo amor',
      'novo amor - state lines.mp3',
      'novo amor - state lines',
      'greenpeace antarctic performance',
      'greenpeace',
      'antarctic',
      'song 1.mp3',
      'song-1.mp3',
      'song_1.mp3',
      'song1.mp3',
      'song-1',
      'song_1',
      'song 1',
      'song1',
      'track-1',
      'track_1',
      'track 1',
      'track1',
    ];
    for (const key of directKeys) {
      const url = imgMap[key];
      if (url && !isLikelyImageKey(key)) return url;
    }
    // Search entries for explicit Novo Amor / State Lines / Antarctic / Greenpeace
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('greenpeace') ||
        (lk.includes('antarct') && !lk.includes('seafret') && !lk.includes('phoebe')) ||
        (lk.includes('golden') && lk.includes('comet') && (lk.endsWith('.mp3') || lk.includes('audio')))
      ) {
        return url;
      }
    }
    // Search entries for song 1 or track 1
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      if (
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('1') || lk.includes('one'))) &&
        !lk.includes('2') && !lk.includes('3')
      ) {
        return url;
      }
    }
    // Fallback search: any audio file uploaded that is not a button click/sfx and not song 2/3
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      const isSfx = lk.includes('click') || lk.includes('sfx') || lk.includes('sound') || lk.includes('button');
      const isSong2 = lk.includes('phoebe') || lk.includes('waiting') || lk.includes('kexp') || (lk.includes('song') && lk.includes('2')) || (lk.includes('track') && lk.includes('2'));
      const isSong3 = lk.includes('seafret') || ((lk.includes('ocean') || lk.includes('dscvr')) && !lk.includes('novo') && !lk.includes('state line')) || (lk.includes('song') && lk.includes('3')) || (lk.includes('track') && lk.includes('3'));
      const isAudio = lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.endsWith('.ogg') || lk.endsWith('.m4a') || lk.endsWith('.flac') || lk.endsWith('.aac');
      if (isAudio && !isSfx && !isSong2 && !isSong3) {
        return url;
      }
    }
    return '/song-1.mp3';
  };

  // Helper to retrieve Song 2 (Phoebe Bridgers - Waiting Room) audio file
  const getSong2Audio = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'song-2-audio',
      'song_2_audio',
      'song 2 audio',
      'song-2-audio-phoebe-bridgers-waiting-room.mp3',
      'song-2-audio-phoebe.mp3',
      'waiting room.mp3',
      'waiting room',
      'waiting_room',
      'waiting-room',
      'phoebe bridgers.mp3',
      'phoebe bridgers',
      'phoebe',
      'kexp',
      'song 2.mp3',
      'song-2.mp3',
      'song_2.mp3',
      'song2.mp3',
      'song-2',
      'song_2',
      'song 2',
      'song2',
      'track-2',
      'track_2',
      'track 2',
      'track2',
    ];
    for (const key of directKeys) {
      const url = imgMap[key];
      if (url && !isLikelyImageKey(key)) return url;
    }
    // Search entries for song 2 or phoebe bridgers / waiting room / kexp
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      if (
        (lk.includes('song') && (lk.includes('2') || lk.includes('two'))) ||
        (lk.includes('track') && (lk.includes('2') || lk.includes('two'))) ||
        lk.includes('waiting') ||
        (lk.includes('phoebe') && !lk.includes('scott')) ||
        (lk.includes('kexp') && !lk.includes('scott') && !lk.includes('6'))
      ) {
        // Ensure it's not a hover image or song 3 or song 6
        if (!lk.includes('seafret') && !lk.includes('ocean') && !lk.includes('scott') && !lk.includes('polaroid') && !lk.includes('6')) {
          return url;
        }
      }
    }
    return '/song-2.mp3';
  };

  // Helper to retrieve Song 3 (Seafret - Oceans / Forget Me Not) audio file
  const getSong3Audio = (
    imgMap: Record<string, string>,
    song1AudioUrl?: string,
    song2AudioUrl?: string
  ): string | undefined => {
    const directKeys = [
      'song-3-audio',
      'song_3_audio',
      'song 3 audio',
      'song-3-audio-seafret-oceans.mp3',
      'song-3-audio-seafret.mp3',
      'song-3-audio-oceans.mp3',
      'song-3-audio-forget-me-not.mp3',
      'oceans.mp3',
      'oceans',
      'seafret.mp3',
      'seafret',
      'seafret - oceans.mp3',
      'seafret - oceans',
      'vevo dscvr',
      'vevo',
      'dscvr',
      'forget me not.mp3',
      'forget-me-not.mp3',
      'forget me not',
      'forget-me-not',
      'song 3.mp3',
      'song-3.mp3',
      'song_3.mp3',
      'song3.mp3',
      'track 3.mp3',
      'track-3.mp3',
      'track_3.mp3',
      'track3.mp3',
      'song-3',
      'song_3',
      'song 3',
      'song3',
      'track-3',
      'track_3',
      'track 3',
      'track3',
    ];
    for (const key of directKeys) {
      const url = imgMap[key];
      // CRITICAL: NEVER return the URL if it matches Song 1 or Song 2 audio!
      if (
        url &&
        (!song1AudioUrl || url !== song1AudioUrl) &&
        (!song2AudioUrl || url !== song2AudioUrl) &&
        !isLikelyImageKey(key)
      ) {
        return url;
      }
    }
    // Search entries for song 3 or seafret / oceans / vevo / dscvr
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      // Skip anything belonging to Song 1 (Novo Amor / State Lines) or Song 2 (Phoebe)
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('greenpeace') ||
        lk.includes('phoebe') ||
        lk.includes('waiting') ||
        lk.includes('kexp')
      ) {
        continue;
      }
      if (song1AudioUrl && url === song1AudioUrl) continue;
      if (song2AudioUrl && url === song2AudioUrl) continue;
      if (
        lk.includes('seafret') ||
        lk.includes('ocean') ||
        lk.includes('vevo') ||
        lk.includes('dscvr') ||
        (lk.includes('forget') && (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.includes('audio'))) ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('3') || lk.includes('three')))
      ) {
        return url;
      }
    }
    return '/song-3.mp3';
  };

  // Helper to retrieve Song 4 (SYML - Where's My Love / Paper Crane) audio file
  const getSong4Audio = (
    imgMap: Record<string, string>,
    song1AudioUrl?: string,
    song2AudioUrl?: string,
    song3AudioUrl?: string
  ): string | undefined => {
    const directKeys = [
      'song-4-audio',
      'song_4_audio',
      'song 4 audio',
      'song-4-audio-syml-wheres-my-love.mp3',
      'song-4-audio-syml.mp3',
      'song-4-audio-wheres-my-love.mp3',
      'song-4-audio-paper-crane.mp3',
      'syml - where\'s my love.mp3',
      'syml - where\'s my love',
      'syml - wheres my love.mp3',
      'syml - wheres my love',
      'where\'s my love.mp3',
      'where\'s my love',
      'wheres my love.mp3',
      'wheres my love',
      'syml.mp3',
      'syml',
      'live from record parlour',
      'live at record parlour',
      'record parlour',
      'paper crane.mp3',
      'paper-crane.mp3',
      'paper crane',
      'paper-crane',
      'song 4.mp3',
      'song-4.mp3',
      'song_4.mp3',
      'song4.mp3',
      'track 4.mp3',
      'track-4.mp3',
      'track_4.mp3',
      'track4.mp3',
      'song-4',
      'song_4',
      'song 4',
      'song4',
      'track-4',
      'track_4',
      'track 4',
      'track4',
    ];
    for (const key of directKeys) {
      const url = imgMap[key];
      // CRITICAL: NEVER return the URL if it matches Song 1, Song 2, or Song 3 audio!
      if (
        url &&
        (!song1AudioUrl || url !== song1AudioUrl) &&
        (!song2AudioUrl || url !== song2AudioUrl) &&
        (!song3AudioUrl || url !== song3AudioUrl) &&
        !isLikelyImageKey(key)
      ) {
        return url;
      }
    }
    // Search entries for song 4 or syml / where's my love / record parlour / crane
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      // Skip anything belonging to Song 1, Song 2, or Song 3
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('greenpeace') ||
        lk.includes('phoebe') ||
        lk.includes('waiting') ||
        lk.includes('kexp') ||
        lk.includes('seafret') ||
        lk.includes('ocean')
      ) {
        continue;
      }
      if (song1AudioUrl && url === song1AudioUrl) continue;
      if (song2AudioUrl && url === song2AudioUrl) continue;
      if (song3AudioUrl && url === song3AudioUrl) continue;
      if (
        lk.includes('syml') ||
        lk.includes('where\'s my love') ||
        lk.includes('wheres my love') ||
        lk.includes('record parlour') ||
        (lk.includes('crane') && (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.includes('audio'))) ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('4') || lk.includes('four')))
      ) {
        return url;
      }
    }
    return '/song-4.mp3';
  };

  // Helper to retrieve user-uploaded Song 5 Audio (Lewis Capaldi - Before You Go / Tiny Desk)
  const getSong5Audio = (
    imgMap: Record<string, string>,
    song1AudioUrl?: string,
    song2AudioUrl?: string,
    song3AudioUrl?: string,
    song4AudioUrl?: string
  ): string | undefined => {
    const directKeys = [
      'song-5-audio-lewis-capaldi-before-you-go.mp3',
      'song-5-audio-lewis-capaldi.mp3',
      'song 5 - lewis capaldi - before you go - tiny desk concert.mp3',
      'song 5 - lewis capaldi - before you go.mp3',
      'lewis capaldi - before you go - tiny desk concert.mp3',
      'lewis capaldi - before you go.mp3',
      'lewis capaldi - before you go',
      'before you go.mp3',
      'before you go',
      'lewis capaldi.mp3',
      'lewis capaldi',
      'tiny desk concert.mp3',
      'tiny desk concert',
      'tiny desk.mp3',
      'tiny desk',
      'npr.mp3',
      'npr',
      'cupcake.mp3',
      'cupcake audio',
      'cupcake',
      'song-5-audio',
      'song_5_audio',
      'song 5 audio',
      'song 5.mp3',
      'song-5.mp3',
      'song_5.mp3',
      'song5.mp3',
      'track 5.mp3',
      'track-5.mp3',
      'track_5.mp3',
      'track5.mp3',
      'song-5',
      'song_5',
      'song 5',
      'song5',
      'track-5',
      'track_5',
      'track 5',
      'track5',
    ];
    for (const key of directKeys) {
      const url = imgMap[key];
      if (
        url &&
        (!song1AudioUrl || url !== song1AudioUrl) &&
        (!song2AudioUrl || url !== song2AudioUrl) &&
        (!song3AudioUrl || url !== song3AudioUrl) &&
        (!song4AudioUrl || url !== song4AudioUrl) &&
        !isLikelyImageKey(key)
      ) {
        return url;
      }
    }
    // Search entries for song 5 or lewis capaldi / before you go / tiny desk / cupcake
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      // Skip anything belonging to Song 1, Song 2, Song 3, or Song 4
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('greenpeace') ||
        lk.includes('phoebe') ||
        lk.includes('waiting') ||
        lk.includes('kexp') ||
        lk.includes('seafret') ||
        lk.includes('ocean') ||
        lk.includes('syml') ||
        lk.includes('where\'s my love') ||
        lk.includes('wheres my love')
      ) {
        continue;
      }
      if (song1AudioUrl && url === song1AudioUrl) continue;
      if (song2AudioUrl && url === song2AudioUrl) continue;
      if (song3AudioUrl && url === song3AudioUrl) continue;
      if (song4AudioUrl && url === song4AudioUrl) continue;
      if (
        lk.includes('lewis') ||
        lk.includes('capaldi') ||
        lk.includes('before you go') ||
        lk.includes('tiny desk') ||
        lk.includes('npr') ||
        (lk.includes('cupcake') && (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.includes('audio'))) ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('5') || lk.includes('five')))
      ) {
        return url;
      }
    }
    return '/song-5.mp3';
  };

  // Helper to retrieve user-uploaded Song 6 Audio (Phoebe Bridgers - Scott Street (Live on KEXP))
  const getSong6Audio = (
    imgMap: Record<string, string>,
    song1AudioUrl?: string,
    song2AudioUrl?: string,
    song3AudioUrl?: string,
    song4AudioUrl?: string,
    song5AudioUrl?: string
  ): string | undefined => {
    const directKeys = [
      'song 6 - phoebe bridgers - scott street (live on kexp)',
      'song 6 - phoebe bridgers - scott street (live on kexp).mp3',
      'song-6-audio-phoebe-bridgers-scott-street.mp3',
      'song-6-audio-phoebe-bridgers.mp3',
      'song-6-audio-scott-street.mp3',
      'song 6 - phoebe bridgers - scott street.mp3',
      'song 6 - phoebe bridgers - scott street',
      'phoebe bridgers - scott street (live on kexp).mp3',
      'phoebe bridgers - scott street (live on kexp)',
      'phoebe bridgers - scott street.mp3',
      'phoebe bridgers - scott street',
      'scott street.mp3',
      'scott street',
      'scott-street.mp3',
      'scott-street',
      'polaroid.mp3',
      'polaroid audio',
      'polaroid',
      'song-6-audio',
      'song_6_audio',
      'song 6 audio',
      'song 6.mp3',
      'song-6.mp3',
      'song_6.mp3',
      'song6.mp3',
      'track 6.mp3',
      'track-6.mp3',
      'track_6.mp3',
      'track6.mp3',
      'song-6',
      'song_6',
      'song 6',
      'song6',
      'track-6',
      'track_6',
      'track 6',
      'track6',
    ];
    for (const key of directKeys) {
      const url = imgMap[key];
      if (
        url &&
        (!song1AudioUrl || url !== song1AudioUrl) &&
        (!song2AudioUrl || url !== song2AudioUrl) &&
        (!song3AudioUrl || url !== song3AudioUrl) &&
        (!song4AudioUrl || url !== song4AudioUrl) &&
        (!song5AudioUrl || url !== song5AudioUrl) &&
        !isLikelyImageKey(key)
      ) {
        return url;
      }
    }
    // Search entries for song 6 or scott street / polaroid
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      // Skip anything belonging to Song 1, Song 2, Song 3, Song 4, or Song 5
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('greenpeace') ||
        lk.includes('waiting') || // Waiting Room is Song 2
        lk.includes('seafret') ||
        lk.includes('ocean') ||
        lk.includes('syml') ||
        lk.includes('where\'s my love') ||
        lk.includes('wheres my love') ||
        lk.includes('lewis') ||
        lk.includes('capaldi') ||
        lk.includes('before you go') ||
        lk.includes('tiny desk')
      ) {
        continue;
      }
      if (song1AudioUrl && url === song1AudioUrl) continue;
      if (song2AudioUrl && url === song2AudioUrl) continue;
      if (song3AudioUrl && url === song3AudioUrl) continue;
      if (song4AudioUrl && url === song4AudioUrl) continue;
      if (song5AudioUrl && url === song5AudioUrl) continue;
      if (
        lk.includes('scott street') ||
        lk.includes('scott') ||
        (lk.includes('phoebe') && lk.includes('kexp') && !lk.includes('waiting')) ||
        (lk.includes('polaroid') && (lk.endsWith('.mp3') || lk.endsWith('.wav') || lk.includes('audio'))) ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('6') || lk.includes('six')))
      ) {
        return url;
      }
    }
    return '/song-6.mp3';
  };

  // Helper to retrieve user-uploaded Song 7 Audio (Clairo - Bags - Recorded at Electric Lady Studios)
  const getSong7Audio = (
    imgMap: Record<string, string>,
    song1AudioUrl?: string,
    song2AudioUrl?: string,
    song3AudioUrl?: string,
    song4AudioUrl?: string,
    song5AudioUrl?: string,
    song6AudioUrl?: string
  ): string | undefined => {
    const directKeys = [
      'song 7 - clairo - bags - recorded at electric lady studios',
      'song 7 - clairo - bags - recorded at electric lady studios.mp3',
      'song 7 - clairo - bags.mp3',
      'song 7 - clairo - bags',
      'song-7-audio-clairo-bags.mp3',
      'song-7-audio-clairo.mp3',
      'song-7-audio-bags.mp3',
      'clairo - bags - recorded at electric lady studios.mp3',
      'clairo - bags - recorded at electric lady studios',
      'clairo - bags - electric lady studios.mp3',
      'clairo - bags - electric lady studios',
      'clairo - bags.mp3',
      'clairo - bags',
      'clairo.mp3',
      'clairo',
      'bags.mp3',
      'bags',
      'electric lady studios.mp3',
      'electric lady studios',
      'song-7-audio',
      'song_7_audio',
      'song 7 audio',
      'song 7.mp3',
      'song-7.mp3',
      'song_7.mp3',
      'song7.mp3',
      'track 7.mp3',
      'track-7.mp3',
      'track_7.mp3',
      'track7.mp3',
      'song-7',
      'song_7',
      'song 7',
      'song7',
      'track-7',
      'track_7',
      'track 7',
      'track7',
    ];
    for (const key of directKeys) {
      const url = imgMap[key];
      if (
        url &&
        (!song1AudioUrl || url !== song1AudioUrl) &&
        (!song2AudioUrl || url !== song2AudioUrl) &&
        (!song3AudioUrl || url !== song3AudioUrl) &&
        (!song4AudioUrl || url !== song4AudioUrl) &&
        (!song5AudioUrl || url !== song5AudioUrl) &&
        (!song6AudioUrl || url !== song6AudioUrl) &&
        !isLikelyImageKey(key)
      ) {
        return url;
      }
    }
    // Search entries for song 7 or clairo / bags / electric lady
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (isLikelyImageKey(lk)) continue;
      // Skip anything belonging to Song 1 through Song 6
      if (
        lk.includes('novo') ||
        lk.includes('state line') ||
        lk.includes('greenpeace') ||
        lk.includes('waiting') ||
        lk.includes('seafret') ||
        lk.includes('ocean') ||
        lk.includes('syml') ||
        lk.includes('where\'s my love') ||
        lk.includes('wheres my love') ||
        lk.includes('lewis') ||
        lk.includes('capaldi') ||
        lk.includes('before you go') ||
        lk.includes('tiny desk') ||
        lk.includes('scott street') ||
        lk.includes('polaroid')
      ) {
        continue;
      }
      if (song1AudioUrl && url === song1AudioUrl) continue;
      if (song2AudioUrl && url === song2AudioUrl) continue;
      if (song3AudioUrl && url === song3AudioUrl) continue;
      if (song4AudioUrl && url === song4AudioUrl) continue;
      if (song5AudioUrl && url === song5AudioUrl) continue;
      if (song6AudioUrl && url === song6AudioUrl) continue;
      if (
        lk.includes('clairo') ||
        lk.includes('bags') ||
        lk.includes('electric lady') ||
        ((lk.includes('song') || lk.includes('track')) && (lk.includes('7') || lk.includes('seven')))
      ) {
        return url;
      }
    }
    return '/song-7.mp3';
  };

  // Helper to retrieve Hover Mapping image for Panel 8 Music Player
  const getMusicHoverMappingImage = (imgMap: Record<string, string>): string | undefined => {
    const directKeys = [
      'hover-mapping',
      'hover_mapping',
      'hover mapping',
      'mapping',
      'hover-map',
      'hover_map',
      'hover map',
      'map',
      'hover-mapping.png',
      'hover_mapping.png',
      'hover mapping.png',
      'mapping.png',
      'music-mapping',
    ];
    for (const key of directKeys) {
      if (imgMap[key]) return imgMap[key];
    }
    for (const [k, url] of Object.entries(imgMap)) {
      const lk = k.toLowerCase();
      if (lk.includes('mapping') || (lk.includes('hover') && lk.includes('map'))) {
        return url;
      }
    }
    return '/hover-mapping.png';
  };

  // Dedicated media uploader for Panel 8
  const handlePanel8UploadMedia = async (file: File, type: 'video' | 'landing') => {
    const url = URL.createObjectURL(file);
    const newImages = { ...images };
    if (type === 'video') {
      const keys = ['video-8', 'panel-8-video', 'gift-8-video', 'video_8'];
      for (const k of keys) {
        newImages[k] = url;
        await saveImageToDB(k, file);
      }
      persistFileDirectlyToServer(file, 'Panel 8 - Intro Video.mp4', ['video-8.mp4', 'panel-8-video.mp4']);
      setStatusMessage('Video asset updated for Panel 8');
    } else {
      const keys = ['music-landing', 'panel-8-landing', 'gift-8', 'gift_8', 'music-home'];
      for (const k of keys) {
        newImages[k] = url;
        await saveImageToDB(k, file);
      }
      persistFileDirectlyToServer(file, 'music-landing.svg', ['music-landing.png', 'gift-8.png']);
      setStatusMessage('Music player landing image updated for Panel 8');
    }
    setImages(newImages);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Process uploaded or dropped image files
  const handleFiles = async (fileList: FileList | File[]) => {
    const newImages: Record<string, string> = { ...images };
    let loadedCount = 0;

    for (const file of Array.from(fileList)) {
      const name = file.name.toLowerCase().trim();
      const keysToSave: string[] = [];

      // Check if file is a video
      if (
        file.type.startsWith('video/') ||
        /\.(mp4|webm|mov|m4v|ogg)$/i.test(name) ||
        name.includes('video')
      ) {
        keysToSave.push('video-8', 'panel-8-video', 'gift-8-video', 'video_8');
      } else if (
        file.type.startsWith('audio/') ||
        /\.(mp3|wav|ogg|m4a|aac|flac|weba)$/i.test(name) ||
        name.includes('sound') ||
        name.includes('audio') ||
        name.includes('sfx')
      ) {
        // Explicit Audio file classification
        if (
          name.includes('novo') ||
          name.includes('state line') ||
          name.includes('greenpeace') ||
          (name.includes('antarct') && !name.includes('seafret') && !name.includes('phoebe')) ||
          (name.includes('golden') && name.includes('comet') && (name.endsWith('.mp3') || name.includes('audio'))) ||
          (name.includes('song') && (name.includes('1') || name.includes('one'))) ||
          (name.includes('track') && (name.includes('1') || name.includes('one')))
        ) {
          keysToSave.push(
            'song-1',
            'song_1',
            'song 1',
            'song1',
            'track-1',
            'track_1',
            'track 1',
            'track1',
            'song-1-audio',
            'song_1_audio',
            'song 1 audio',
            'song-1-audio-novo-amor-state-lines.mp3',
            'song-1-audio-novomor.mp3',
            'state lines',
            'state lines.mp3',
            'novo amor',
            'novo amor.mp3',
            'novo amor - state lines.mp3',
            'novo amor - state lines',
            'greenpeace antarctic performance',
            'greenpeace',
            'antarctic'
          );
        } else if (
          name.includes('scott street') ||
          name.includes('scott') ||
          (name.includes('phoebe') && (name.includes('6') || name.includes('six') || name.includes('scott') || name.includes('polaroid'))) ||
          (name.includes('polaroid') && (name.endsWith('.mp3') || name.endsWith('.wav') || name.includes('audio') || name.includes('sfx'))) ||
          (name.includes('song') && (name.includes('6') || name.includes('six'))) ||
          (name.includes('track') && (name.includes('6') || name.includes('six')))
        ) {
          keysToSave.push(
            'song-6',
            'song_6',
            'song 6',
            'song6',
            'track-6',
            'track_6',
            'track 6',
            'track6',
            'song-6-audio',
            'song_6_audio',
            'song 6 audio',
            'song-6-audio-phoebe-bridgers-scott-street.mp3',
            'song-6-audio-phoebe-bridgers.mp3',
            'song-6-audio-scott-street.mp3',
            'song 6 - phoebe bridgers - scott street (live on kexp)',
            'song 6 - phoebe bridgers - scott street (live on kexp).mp3',
            'song 6 - phoebe bridgers - scott street.mp3',
            'song 6 - phoebe bridgers - scott street',
            'phoebe bridgers - scott street (live on kexp)',
            'phoebe bridgers - scott street (live on kexp).mp3',
            'phoebe bridgers - scott street.mp3',
            'phoebe bridgers - scott street',
            'scott street',
            'scott street.mp3',
            'scott-street',
            'scott-street.mp3',
            'polaroid audio',
            'polaroid.mp3'
          );
        } else if (
          (name.includes('phoebe') ||
            name.includes('waiting') ||
            name.includes('kexp') ||
            (name.includes('song') && (name.includes('2') || name.includes('two'))) ||
            (name.includes('track') && (name.includes('2') || name.includes('two')))) &&
          !name.includes('scott') &&
          !name.includes('6')
        ) {
          keysToSave.push(
            'song-2',
            'song_2',
            'song 2',
            'song2',
            'track-2',
            'track_2',
            'track 2',
            'track2',
            'song-2-audio',
            'song_2_audio',
            'song 2 audio',
            'song-2-audio-phoebe-bridgers-waiting-room.mp3',
            'song-2-audio-phoebe.mp3',
            'waiting room',
            'waiting room.mp3',
            'phoebe bridgers',
            'phoebe bridgers.mp3',
            'kexp'
          );
        } else if (
          name.includes('seafret') ||
          name.includes('ocean') ||
          name.includes('vevo') ||
          name.includes('dscvr') ||
          (name.includes('forget') && (name.endsWith('.mp3') || name.endsWith('.wav') || name.includes('audio'))) ||
          (name.includes('song') && (name.includes('3') || name.includes('three'))) ||
          (name.includes('track') && (name.includes('3') || name.includes('three')))
        ) {
          keysToSave.push(
            'song-3',
            'song_3',
            'song 3',
            'song3',
            'track-3',
            'track_3',
            'track 3',
            'track3',
            'song-3-audio',
            'song_3_audio',
            'song 3 audio',
            'song-3-audio-seafret-oceans.mp3',
            'song-3-audio-seafret.mp3',
            'oceans',
            'oceans.mp3',
            'seafret',
            'seafret.mp3',
            'seafret - oceans.mp3',
            'seafret - oceans',
            'vevo dscvr',
            'vevo'
          );
        } else if (
          name.includes('syml') ||
          name.includes('where\'s my love') ||
          name.includes('wheres my love') ||
          name.includes('record parlour') ||
          (name.includes('crane') && (name.endsWith('.mp3') || name.endsWith('.wav') || name.includes('audio'))) ||
          (name.includes('song') && (name.includes('4') || name.includes('four'))) ||
          (name.includes('track') && (name.includes('4') || name.includes('four')))
        ) {
          keysToSave.push(
            'song-4',
            'song_4',
            'song 4',
            'song4',
            'track-4',
            'track_4',
            'track 4',
            'track4',
            'song-4-audio',
            'song_4_audio',
            'song 4 audio',
            'song-4-audio-syml-wheres-my-love.mp3',
            'song-4-audio-syml.mp3',
            'syml - where\'s my love.mp3',
            'syml - where\'s my love',
            'syml - wheres my love.mp3',
            'syml - wheres my love',
            'where\'s my love',
            'where\'s my love.mp3',
            'wheres my love',
            'wheres my love.mp3',
            'syml',
            'syml.mp3',
            'live from record parlour',
            'record parlour'
          );
        } else if (
          name.includes('lewis') ||
          name.includes('capaldi') ||
          name.includes('before you go') ||
          name.includes('tiny desk') ||
          name.includes('npr') ||
          (name.includes('cupcake') && (name.endsWith('.mp3') || name.endsWith('.wav') || name.includes('audio'))) ||
          (name.includes('song') && (name.includes('5') || name.includes('five'))) ||
          (name.includes('track') && (name.includes('5') || name.includes('five')))
        ) {
          keysToSave.push(
            'song-5',
            'song_5',
            'song 5',
            'song5',
            'track-5',
            'track_5',
            'track 5',
            'track5',
            'song-5-audio',
            'song_5_audio',
            'song 5 audio',
            'song-5-audio-lewis-capaldi-before-you-go.mp3',
            'song-5-audio-lewis-capaldi.mp3',
            'lewis capaldi - before you go - tiny desk concert.mp3',
            'lewis capaldi - before you go.mp3',
            'lewis capaldi - before you go',
            'before you go',
            'before you go.mp3',
            'lewis capaldi',
            'lewis capaldi.mp3',
            'tiny desk concert',
            'tiny desk',
            'npr'
          );
        } else if (
          name.includes('clairo') ||
          name.includes('bags') ||
          name.includes('electric lady') ||
          (name.includes('tracklist') && (name.endsWith('.mp3') || name.endsWith('.wav') || name.includes('audio') || name.includes('sfx'))) ||
          (name.includes('song') && (name.includes('7') || name.includes('seven'))) ||
          (name.includes('track') && (name.includes('7') || name.includes('seven')))
        ) {
          keysToSave.push(
            'song-7',
            'song_7',
            'song 7',
            'song7',
            'track-7',
            'track_7',
            'track 7',
            'track7',
            'song-7-audio',
            'song_7_audio',
            'song 7 audio',
            'song-7-audio-clairo-bags.mp3',
            'song 7 - clairo - bags - recorded at electric lady studios',
            'song 7 - clairo - bags - recorded at electric lady studios.mp3',
            'clairo - bags - recorded at electric lady studios.mp3',
            'clairo - bags - recorded at electric lady studios',
            'clairo - bags - electric lady studios.mp3',
            'clairo - bags.mp3',
            'clairo - bags',
            'clairo.mp3',
            'clairo',
            'bags.mp3',
            'bags',
            'electric lady studios.mp3',
            'electric lady studios'
          );
        } else if (name.includes('song') || name.includes('track')) {
          const match = name.match(/(\d+)/);
          const sId = match ? match[1] : '1';
          keysToSave.push(
            `song-${sId}`,
            `song_${sId}`,
            `song ${sId}`,
            `song${sId}`,
            `track-${sId}`,
            `track_${sId}`,
            `track ${sId}`,
            `track${sId}`
          );
        } else if (name.includes('play') || name.includes('start')) {
          keysToSave.push(
            'play-click',
            'play_click',
            'play click',
            'play button sound',
            'play_button_sound',
            'play-button-sound',
            'play-sfx',
            'play_sfx',
            'play sfx',
            'play-sound',
            'play_sound',
            'play sound',
            'click-play',
            'click_play'
          );
        } else if (name.includes('pause') || name.includes('stop')) {
          keysToSave.push(
            'pause-click',
            'pause_click',
            'pause click',
            'pause button sound',
            'pause_button_sound',
            'pause-button-sound',
            'pause-sfx',
            'pause_sfx',
            'pause sfx',
            'pause-sound',
            'pause_sound',
            'pause sound',
            'click-pause',
            'click_pause'
          );
        } else {
          // Default unrecognized audio track to song-1 if not a button sound
          keysToSave.push('song-1', 'song 1', 'track-1');
        }
      } else if (name.includes('background') || name.includes('bg') || name.includes('monochrome')) {
        keysToSave.push('background');
      } else if (name.includes('progress') || name.includes('tier') || name.includes('state') || name.includes('step')) {
        const match = name.match(/(\d+)/);
        if (match) keysToSave.push(`progress_${match[1]}`);
      } else if (
        name.includes('play state') ||
        (name.includes('play') && (name.includes('animated') || name.includes('state'))) ||
        ((name.endsWith('.svg') || file.type === 'image/svg+xml') &&
          (name.includes('cassette') || name.includes('play') || name.includes('anim') || name.includes('walkman') || name.includes('tape') || name.includes('music')))
      ) {
        // High-priority SVG animated cassette playing file
        keysToSave.push(
          'play state - animated svg',
          'play state - animated',
          'play-state-animated-svg',
          'play_state_animated_svg',
          'play-state',
          'play_state',
          'play state',
          'animated svg',
          'cassette-playing',
          'cassette_playing',
          'cassette playing',
          'cassette-play',
          'cassette_play',
          'cassette play',
          'playing-cassette',
          'playing_cassette',
          'playing cassette',
          'cassette-animation',
          'cassette_animation',
          'cassette animation',
          'walkman-playing',
          'walkman_playing',
          'walkman playing',
          'music-playing',
          'music_playing',
          'music playing'
        );
      } else if (name.includes('mapping') || (name.includes('hover') && name.includes('map'))) {
        keysToSave.push(
          'hover-mapping',
          'hover_mapping',
          'hover mapping',
          'mapping',
          'hover-map',
          'hover_map',
          'hover map',
          'music-mapping'
        );
      } else if (
        name.includes('play') &&
        (name.includes('hover') || name.includes('btn') || name.includes('button') || name === 'play.png' || name === 'play' || name.startsWith('play'))
      ) {
        keysToSave.push(
          'play-hover',
          'play_hover',
          'play hover',
          'playhover',
          'play-state-hover',
          'hover-play',
          'hover_play',
          'hover play',
          'hoverplay',
          'play',
          'play.png',
          'music-play-hover',
          'panel-8-play-hover'
        );
      } else if (
        name.includes('pause') &&
        (name.includes('hover') || name.includes('btn') || name.includes('button') || name === 'pause.png' || name === 'pause' || name.startsWith('pause'))
      ) {
        keysToSave.push(
          'pause-hover',
          'pause_hover',
          'pause hover',
          'pausehover',
          'pause-state-hover',
          'hover-pause',
          'hover_pause',
          'hover pause',
          'hoverpause',
          'pause',
          'pause.png',
          'music-pause-hover',
          'panel-8-pause-hover'
        );
      } else if (
        name.includes('stop') &&
        (name.includes('hover') || name.includes('btn') || name.includes('button') || name === 'stop.png' || name === 'stop' || name.startsWith('stop'))
      ) {
        keysToSave.push(
          'stop-hover',
          'stop_hover',
          'stop hover',
          'stophover',
          'stop-state-hover',
          'hover-stop',
          'hover_stop',
          'hover stop',
          'hoverstop',
          'stop',
          'stop.png',
          'music-stop-hover',
          'panel-8-stop-hover'
        );
      } else if (
        name.includes('comet') ||
        (name.includes('golden') && name.includes('comet')) ||
        (name.includes('song') && name.includes('1') && name.includes('hover')) ||
        name.includes('golden comet')
      ) {
        keysToSave.push(
          'song 1 - golden comet hover',
          'song 1 - golden comet hover.png',
          'song-1-golden-comet-hover',
          'song 1 golden comet hover',
          'song 1 - golden comet',
          'song 1 golden comet',
          'golden-comet-hover',
          'golden_comet_hover',
          'golden comet hover',
          'golden-comet',
          'golden_comet',
          'golden comet',
          'comet-hover',
          'comet_hover',
          'comet hover',
          'comet',
          'song-1-hover',
          'song_1_hover',
          'song 1 hover',
          'song1-hover'
        );
      } else if (
        name.includes('forget') ||
        (name.includes('song') && (name.includes('3') || name.includes('three')) && name.includes('hover')) ||
        (name.includes('ocean') && name.includes('hover')) ||
        (name.includes('seafret') && name.includes('hover'))
      ) {
        keysToSave.push(
          'song 3 - forget me not hover',
          'song 3 - forget me not hover.png',
          'song 3 - forget me not hover.svg',
          'song-3-forget-me-not-hover',
          'song 3 forget me not hover',
          'song 3 - forget me not',
          'song 3 - forget-me-not',
          'song 3 forget me not',
          'forget me not hover',
          'forget me not hover.png',
          'forget me not hover.svg',
          'forget-me-not-hover',
          'forget_me_not_hover',
          'forget me not',
          'forget-me-not',
          'forget_me_not',
          'forgetmenot',
          'forget',
          'song-3-hover',
          'song_3_hover',
          'song 3 hover',
          'song3-hover',
          'song3_hover'
        );
      } else if (
        name.includes('ring') ||
        (name.includes('song') && (name.includes('2') || name.includes('two')) && name.includes('hover'))
      ) {
        keysToSave.push(
          'song 2 - ring hover',
          'song 2 - ring hover.png',
          'song 2 - ring hover.svg',
          'song-2-ring-hover',
          'song 2 ring hover',
          'song 2 - ring',
          'song 2 ring',
          'ring-hover',
          'ring_hover',
          'ring hover',
          'ring',
          'ring.png',
          'ring.svg',
          'song-2-hover',
          'song_2_hover',
          'song 2 hover',
          'song2-hover'
        );
      } else if (
        name.includes('crane') ||
        name.includes('paper crane') ||
        (name.includes('song') && (name.includes('4') || name.includes('four')) && name.includes('hover'))
      ) {
        keysToSave.push(
          'song 4 - paper crane hover',
          'song 4 - paper crane hover.png',
          'song 4 - paper crane hover.svg',
          'song 4 - paper crane',
          'song 4 - paper-crane',
          'song-4-paper-crane-hover',
          'song 4 paper crane hover',
          'paper crane hover',
          'paper crane hover.png',
          'paper crane hover.svg',
          'paper-crane-hover',
          'paper_crane_hover',
          'paper crane',
          'paper-crane',
          'paper_crane',
          'crane hover',
          'crane hover.png',
          'crane hover.svg',
          'crane-hover',
          'crane_hover',
          'crane',
          'crane.png',
          'crane.svg',
          'song-4-hover',
          'song_4_hover',
          'song 4 hover',
          'song4-hover',
          'song4_hover'
        );
      } else if (
        name.includes('cupcake') ||
        (name.includes('song') && (name.includes('5') || name.includes('five')) && name.includes('hover'))
      ) {
        keysToSave.push(
          'song 5 - cupcake hover',
          'song 5 - cupcake hover.png',
          'song 5 - cupcake hover.svg',
          'song 5 - cupcake',
          'song 5 cupcake hover',
          'song-5-cupcake-hover',
          'cupcake hover',
          'cupcake hover.png',
          'cupcake hover.svg',
          'cupcake-hover',
          'cupcake_hover',
          'cupcake',
          'cupcake.png',
          'cupcake.svg',
          'song-5-hover',
          'song_5_hover',
          'song 5 hover',
          'song5-hover',
          'song5_hover'
        );
      } else if (
        name.includes('polaroid') ||
        (name.includes('song') && (name.includes('6') || name.includes('six')) && name.includes('hover')) ||
        (name.includes('scott') && name.includes('hover'))
      ) {
        keysToSave.push(
          'song 6 - polaroid hover',
          'song 6 - polaroid hover.png',
          'song 6 - polaroid hover.svg',
          'song 6 - polaroid',
          'song 6 polaroid hover',
          'song-6-polaroid-hover',
          'polaroid hover',
          'polaroid hover.png',
          'polaroid hover.svg',
          'polaroid-hover',
          'polaroid_hover',
          'polaroid',
          'polaroid.png',
          'polaroid.svg',
          'phoebe bridgers scott street hover',
          'scott street hover',
          'song-6-hover',
          'song_6_hover',
          'song 6 hover',
          'song6-hover',
          'song6_hover'
        );
      } else if (
        name.includes('tracklist') ||
        (name.includes('song') && (name.includes('7') || name.includes('seven')) && name.includes('hover')) ||
        (name.includes('clairo') && name.includes('hover')) ||
        (name.includes('bags') && name.includes('hover'))
      ) {
        keysToSave.push(
          'song 7 - complete tracklist hover',
          'song 7 - complete tracklist hover.png',
          'song 7 - complete tracklist hover.svg',
          'song 7 - complete tracklist',
          'song 7 complete tracklist hover',
          'song-7-complete-tracklist-hover',
          'complete tracklist hover',
          'complete tracklist hover.png',
          'complete tracklist hover.svg',
          'complete-tracklist-hover',
          'complete_tracklist_hover',
          'complete tracklist',
          'complete-tracklist',
          'tracklist hover',
          'tracklist hover.png',
          'tracklist hover.svg',
          'tracklist-hover',
          'tracklist_hover',
          'tracklist',
          'tracklist.png',
          'tracklist.svg',
          'song-7-hover',
          'song_7_hover',
          'song 7 hover',
          'song7-hover',
          'song7_hover'
        );
      } else if (name.includes('song') && name.includes('hover')) {
        const match = name.match(/(\d+)/);
        if (match) {
          const sId = match[1];
          keysToSave.push(
            `song-${sId}-hover`,
            `song_${sId}_hover`,
            `song ${sId} hover`,
            `song${sId}-hover`,
            `song${sId}_hover`
          );
        }
      } else if (name.includes('hover')) {
        // Stained glass cutout overlay
        const match = name.match(/(\d+)/);
        if (match) {
          const pId = match[1];
          keysToSave.push(
            pId,
            `hover_${pId}`,
            `hover-${pId}`,
            `hover ${pId}`,
            `hover${pId}`,
            `${pId}_hover`,
            `${pId}-hover`,
            `${pId} - hover`,
            `panel-${pId}-hover`,
            `panel_${pId}_hover`
          );
        }
      } else if (
        (name.includes('cassette') || name.includes('walkman') || name.includes('tape') || name.includes('player')) &&
        (name.includes('play') || name.includes('anim') || name.endsWith('.svg'))
      ) {
        keysToSave.push(
          'cassette-playing',
          'cassette_playing',
          'cassette playing',
          'cassette-play',
          'cassette_play',
          'cassette play',
          'playing-cassette',
          'playing_cassette',
          'playing cassette',
          'cassette-animation',
          'cassette_animation',
          'cassette animation',
          'walkman-playing',
          'walkman_playing',
          'walkman playing',
          'music-playing',
          'music_playing',
          'music playing'
        );
      } else if (
        name.includes('music') ||
        name.includes('landing') ||
        name.includes('player') ||
        name.includes('song') ||
        name.includes('static') ||
        name.includes('walkman') ||
        name.includes('cassette') ||
        name.includes('home')
      ) {
        // Music player landing image - intentionally do NOT save as '8' so hover cutout isn't clobbered
        keysToSave.push('music-landing', 'panel-8-landing', 'gift-8', 'gift_8', 'music-home');
      } else {
        // Check for sub-item gift format: e.g. "gift-5-1", "gift-5-2", "5-1", "5-2", "gift-11-1", "11-1"
        const multiMatch = name.match(/^(?:gift[\s_\-]?|panel[\s_\-]?)?(\d+)[\s_\-\.](\d+)/i);
        if (multiMatch) {
          const pId = multiMatch[1];
          const subIdx = multiMatch[2];
          keysToSave.push(
            `gift-${pId}-${subIdx}`,
            `gift_${pId}_${subIdx}`,
            `gift ${pId}-${subIdx}`,
            `gift ${pId} ${subIdx}`,
            `${pId}-${subIdx}`,
            `${pId}_${subIdx}`,
            `${pId}.${subIdx}`
          );
        } else if (name.includes('gift') || name.includes('present') || name.includes('item')) {
          const match = name.match(/(\d+)/);
          if (match) {
            keysToSave.push(`gift-${match[1]}`, `gift_${match[1]}`, `gift ${match[1]}`, `gift${match[1]}`);
          }
        } else {
          // Standard numbered image: store as gift image and panel hover
          const match = name.match(/(\d+)/);
          if (match) {
            keysToSave.push(`gift-${match[1]}`, `gift_${match[1]}`, `gift ${match[1]}`, match[1]);
          }
        }
      }

      // Always save exact filename and extensionless name
      keysToSave.push(name, name.replace(/\.[^/.]+$/, ''));

      if (keysToSave.length > 0) {
        const url = URL.createObjectURL(file);
        for (const k of keysToSave) {
          newImages[k] = url;
          await saveImageToDB(k, file);
        }
        // Direct persistence to server public folder
        const additionalFileNames = keysToSave.map((k) => (k.includes('.') ? k : `${k}.png`));
        persistFileDirectlyToServer(file, name, additionalFileNames);
        loadedCount++;
      }
    }

    if (loadedCount > 0) {
      setImages(newImages);
      setStatusMessage(`Successfully loaded ${loadedCount} asset${loadedCount > 1 ? 's' : ''}`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Direct single panel item replacement handler (e.g. Panel 5 Item 2)
  const handleSavePanelItemImage = async (panelId: number, itemIndex: number, file: File) => {
    const keysToSave = [
      `gift-${panelId}-${itemIndex}`,
      `gift_${panelId}_${itemIndex}`,
      `gift ${panelId}-${itemIndex}`,
      `gift ${panelId} ${itemIndex}`,
      `${panelId}-${itemIndex}`,
      `${panelId}_${itemIndex}`,
      `${panelId}.${itemIndex}`,
    ];

    if (itemIndex === 1 && panelId !== 5) {
      keysToSave.push(`gift-${panelId}`, `gift_${panelId}`, `gift ${panelId}`, `${panelId}`);
    }

    const objectUrl = URL.createObjectURL(file);
    const updated = { ...images };
    for (const key of keysToSave) {
      await saveImageToDB(key, file);
      updated[key] = objectUrl;
    }

    persistFileDirectlyToServer(
      file,
      `gift-${panelId}-${itemIndex}.png`,
      keysToSave.map((k) => (k.includes('.') ? k : `${k}.png`))
    );

    setImages(updated);
    setStatusMessage(`Successfully updated Panel ${panelId} Item ${itemIndex} image`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const activePanel = PANEL_REGIONS.find((p) => p.id === hoveredPanelId);
  const selectedPanel = selectedPanelId ? PANEL_REGIONS.find((p) => p.id === selectedPanelId) : null;
  const selectedGift = selectedPanelId ? GIFTS_DATA[selectedPanelId] : null;

  // Hardcoded unlock progress states determination
  const currentProgressCount = openedPanels.length;
  const { bgSource, activeMilestone } = getUnlockStateBaseImage(currentProgressCount, images);

  return (
    <div
      className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-between select-none relative"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Hidden file selector input for manual selection */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
      />

      {/* Top Header Bar */}
      <header className="w-full z-20 border-b border-zinc-900 bg-black/90 backdrop-blur-md px-4 py-2.5 sm:px-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-serif font-bold text-zinc-100 tracking-wide">
              Estrella Preciosa's 21st
            </h1>
            <span className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{openedPanels.length} / 21 Unlocked</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            {activePanel ? (
              <span>
                <strong className="text-zinc-200">{activePanel.name}</strong>
                {openedPanels.includes(activePanel.id) ? (
                  <span className="text-emerald-400 ml-1.5 font-medium">· Unlocked (Click to view gift)</span>
                ) : activePanel.id === nextUnlockableId ? (
                  <span className="text-amber-400 ml-1.5 font-medium">· Next to open (Click to unlock)</span>
                ) : (
                  <span className="text-zinc-500 ml-1.5 font-medium">· Locked (Open in order)</span>
                )}
              </span>
            ) : (
              'Hover over any stained glass panel to illuminate · Click sequentially to open'
            )}
          </p>
        </div>

        {/* Action & Zoom Controls */}
        <div className="flex items-center space-x-2">
          {openedPanels.length > 0 && (
            <button
              id="btn-reset-progress"
              onClick={handleResetProgress}
              className="text-xs bg-zinc-900 hover:bg-red-950/60 border border-zinc-800 hover:border-red-800/60 text-zinc-400 hover:text-red-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
              title="Reset all progress back to Day 1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-300" />
              <span>Reset to Day 1</span>
            </button>
          )}

          {/* View Zoom Controls */}
          <div className="flex items-center space-x-1 bg-zinc-900/80 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.75}
              className="p-1.5 hover:bg-zinc-800 rounded text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-zinc-400 px-1 min-w-[2.8rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              className="p-1.5 hover:bg-zinc-800 rounded text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-zinc-800 rounded text-zinc-300 transition-colors ml-1 border-l border-zinc-800"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {statusMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-zinc-950 font-medium text-xs px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 animate-fade-in border border-amber-300">
          <CheckCircle2 className="w-4 h-4 text-zinc-950" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Interactive Stage */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
        <div
          className="relative max-h-[88vh] flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <div className="relative inline-block overflow-hidden rounded shadow-2xl border border-zinc-900 bg-zinc-950">
            {/* Base Monochrome Window Image */}
            <div
              className="relative aspect-[891/2000] max-h-[86vh] w-auto h-auto flex items-center justify-center bg-zinc-950"
              onMouseLeave={() => setHoveredPanelId(null)}
            >
              <img
                src={bgSource}
                alt="St. Giles Cathedral Window Monochrome Background"
                className="max-h-[86vh] w-auto h-auto object-contain block select-none"
                draggable={false}
              />

              {/* Full-bleed Colored Stained Glass Panel Layers */}
              {PANEL_REGIONS.map((panel) => {
                const imageSrc = getPanelHoverImage(panel.id, images);
                const isOpened = openedPanels.includes(panel.id);
                const isAlreadyInBase = panel.id <= activeMilestone;
                const isHovered = hoveredPanelId === panel.id;
                const isVisible = isHovered || (isOpened && !isAlreadyInBase);

                if (!imageSrc) {
                  // If the cutout image hasn't been uploaded yet, show an elegant golden stained glass glow on hover
                  if (isHovered && panel.type === 'rect' && panel.x !== undefined && panel.y !== undefined) {
                    return (
                      <div
                        key={`panel-glow-${panel.id}`}
                        className="absolute pointer-events-none transition-opacity duration-200 border-2 border-amber-400/80 bg-amber-400/25 rounded shadow-[0_0_24px_rgba(251,191,36,0.6)] backdrop-brightness-125"
                        style={{
                          left: `${(panel.x / 891) * 100}%`,
                          top: `${(panel.y / 2000) * 100}%`,
                          width: `${(panel.width! / 891) * 100}%`,
                          height: `${(panel.height! / 2000) * 100}%`,
                        }}
                      />
                    );
                  }
                  if (isHovered && panel.type === 'circle' && panel.cx !== undefined && panel.cy !== undefined) {
                    return (
                      <div
                        key={`panel-glow-${panel.id}`}
                        className="absolute pointer-events-none transition-opacity duration-200 border-2 border-amber-400/80 bg-amber-400/25 rounded-full shadow-[0_0_24px_rgba(251,191,36,0.6)] backdrop-brightness-125"
                        style={{
                          left: `${((panel.cx - panel.r!) / 891) * 100}%`,
                          top: `${((panel.cy - panel.r!) / 2000) * 100}%`,
                          width: `${((panel.r! * 2) / 891) * 100}%`,
                          height: `${((panel.r! * 2) / 2000) * 100}%`,
                        }}
                      />
                    );
                  }
                  return null;
                }

                return (
                  <img
                    key={`panel-layer-${panel.id}`}
                    src={imageSrc}
                    alt={panel.name}
                    onError={(e) => {
                      // Prevent broken image icon on screen if an asset fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-200 ease-in-out ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    draggable={false}
                  />
                );
              })}

              {/* Invisible SVG Hit Areas strictly bounding the 21 mapping areas */}
              <svg
                viewBox="0 0 891 2000"
                className="absolute inset-0 w-full h-full pointer-events-auto"
                onMouseLeave={() => setHoveredPanelId(null)}
              >
                {PANEL_REGIONS.map((panel) => {
                  const isOpened = openedPanels.includes(panel.id);
                  const isNext = panel.id === nextUnlockableId;
                  const isClickable = isOpened || isNext;

                  if (panel.type === 'rect') {
                    return (
                      <rect
                        key={`hit-${panel.id}`}
                        x={panel.x}
                        y={panel.y}
                        width={panel.width}
                        height={panel.height}
                        fill="transparent"
                        className={isClickable ? 'cursor-pointer' : 'cursor-default'}
                        onMouseEnter={() => setHoveredPanelId(panel.id)}
                        onMouseLeave={() => setHoveredPanelId(null)}
                        onClick={() => handlePanelClick(panel.id)}
                      >
                        <title>{`Panel ${panel.id}`}</title>
                      </rect>
                    );
                  }

                  if (panel.type === 'circle') {
                    return (
                      <circle
                        key={`hit-${panel.id}`}
                        cx={panel.cx}
                        cy={panel.cy}
                        r={panel.r}
                        fill="transparent"
                        className={isClickable ? 'cursor-pointer' : 'cursor-default'}
                        onMouseEnter={() => setHoveredPanelId(panel.id)}
                        onMouseLeave={() => setHoveredPanelId(null)}
                        onClick={() => handlePanelClick(panel.id)}
                      >
                        <title>{`Panel ${panel.id}`}</title>
                      </circle>
                    );
                  }

                  return null;
                })}
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Panel 8 Unique Experience: Video Presentation -> Next -> Music Player Landing */}
      {selectedPanel && selectedPanel.id === 8 && (
        <Panel8Experience
          isOpen={true}
          onClose={() => setSelectedPanelId(null)}
          landingImageSrc={getPanel8LandingImage(images)}
          cassettePlayingSrc={getMusicCassettePlayingSvg(images)}
          playHoverSrc={getMusicPlayHoverImage(images)}
          pauseHoverSrc={getMusicPauseHoverImage(images)}
          stopHoverSrc={getMusicStopHoverImage(images)}
          song1HoverSrc={getSong1HoverImage(images)}
          song1AudioSrc={getSong1Audio(images)}
          song2HoverSrc={getSong2HoverImage(images)}
          song2AudioSrc={getSong2Audio(images)}
          song3HoverSrc={getSong3HoverImage(images)}
          song3AudioSrc={getSong3Audio(images, getSong1Audio(images), getSong2Audio(images))}
          song4HoverSrc={getSong4HoverImage(images)}
          song4AudioSrc={getSong4Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images))}
          song5HoverSrc={getSong5HoverImage(images)}
          song5AudioSrc={getSong5Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images), getSong4Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images)))}
          song6HoverSrc={getSong6HoverImage(images)}
          song6AudioSrc={getSong6Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images), getSong4Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images)), getSong5Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images), getSong4Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images))))}
          song7HoverSrc={getSong7HoverImage(images)}
          song7AudioSrc={getSong7Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images), getSong4Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images)), getSong5Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images), getSong4Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images))), getSong6Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images), getSong4Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images)), getSong5Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images), getSong4Audio(images, getSong1Audio(images), getSong2Audio(images), getSong3Audio(images)))))}
          hoverMappingSrc={getMusicHoverMappingImage(images)}
          playClickAudioSrc={getPlayClickAudio(images)}
          pauseClickAudioSrc={getPauseClickAudio(images)}
          videoSrc={getPanel8Video(images)}
          onUploadMedia={handlePanel8UploadMedia}
          onDropFiles={handleFiles}
          hasPrevious={openedPanels.includes(7)}
          hasNext={openedPanels.includes(9)}
          onSelectPrevious={() => {
            if (openedPanels.includes(7)) {
              setSelectedPanelId(7);
            }
          }}
          onSelectNext={() => {
            if (openedPanels.includes(9)) {
              setSelectedPanelId(9);
            }
          }}
        />
      )}

      {/* Gift Detail Modal Window for all other panels */}
      {selectedPanel && selectedGift && selectedPanel.id !== 8 && (
        <GiftModal
          panel={selectedPanel}
          gift={selectedGift}
          panelImageSrc={getStainedGlassHoverImage(selectedPanel.id, images) || selectedPanel.imageSrc}
          giftImages={getGiftImagesForPanel(selectedPanel.id, images, selectedGift)}
          isOpen={true}
          onClose={() => setSelectedPanelId(null)}
          hasPrevious={openedPanels.includes(selectedPanel.id - 1)}
          hasNext={openedPanels.includes(selectedPanel.id + 1)}
          onSelectPrevious={() => {
            if (openedPanels.includes(selectedPanel.id - 1)) {
              setSelectedPanelId(selectedPanel.id - 1);
            }
          }}
          onSelectNext={() => {
            if (openedPanels.includes(selectedPanel.id + 1)) {
              setSelectedPanelId(selectedPanel.id + 1);
            }
          }}
        />
      )}
    </div>
  );
}

