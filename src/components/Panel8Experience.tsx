import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  Upload,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Music,
  Film,
  Home,
  Layers,
} from 'lucide-react';
import { playMechanicalButtonClick } from '../utils/audio';
import { CassettePlayingAnimation } from './CassettePlayingAnimation';

interface Panel8ExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  landingImageSrc?: string;
  cassettePlayingSrc?: string;
  playHoverSrc?: string;
  pauseHoverSrc?: string;
  stopHoverSrc?: string;
  song1HoverSrc?: string;
  song1AudioSrc?: string;
  song2HoverSrc?: string;
  song2AudioSrc?: string;
  song3HoverSrc?: string;
  song3AudioSrc?: string;
  song4HoverSrc?: string;
  song4AudioSrc?: string;
  song5HoverSrc?: string;
  song5AudioSrc?: string;
  song6HoverSrc?: string;
  song6AudioSrc?: string;
  song7HoverSrc?: string;
  song7AudioSrc?: string;
  hoverMappingSrc?: string;
  playClickAudioSrc?: string;
  pauseClickAudioSrc?: string;
  stopClickAudioSrc?: string;
  videoSrc?: string;
  onUploadMedia?: (file: File, type: 'video' | 'landing') => void;
  onDropFiles?: (files: FileList | File[]) => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onSelectPrevious?: () => void;
  onSelectNext?: () => void;
}

const DEFAULT_COMET_COORDS = { left: 3.5, top: 9.0, width: 16.0, height: 28.5 };
const DEFAULT_RING_COORDS = { left: 82.5, top: 32.0, width: 11.2, height: 12.5 };
const DEFAULT_FORGET_COORDS = { left: 5.6, top: 44.0, width: 13.8, height: 17.0 };
const DEFAULT_CRANE_COORDS = { left: 81.5, top: 44.5, width: 15.5, height: 17.5 };
const DEFAULT_CUPCAKE_COORDS = { left: 6.8, top: 63.6, width: 13.8, height: 17.2 };
const DEFAULT_POLAROID_COORDS = { left: 78.5, top: 64.5, width: 18.0, height: 26.5 };
const DEFAULT_TRACKLIST_COORDS = { left: 28.0, top: 36.0, width: 44.0, height: 40.0 };

export const SIDE_A_TRACKLIST = [
  {
    number: '1',
    title: 'State Lines',
    performance: 'Greenpeace Antarctic performance, 2022',
    artist: 'Novo Amor',
  },
  {
    number: '2',
    title: 'Waiting Room',
    performance: 'Live on KEXP, 2018',
    artist: 'Phoebe Bridgers',
  },
  {
    number: '3',
    title: 'Oceans',
    performance: 'Vevo DSCVR, 2015',
    artist: 'Seafret',
  },
  {
    number: '4',
    title: "Where's My Love",
    performance: 'Live from Record Parlour, 2017',
    artist: 'SYML',
  },
  {
    number: '5',
    title: 'Before You Go',
    performance: 'Tiny Desk Concert at NPR, 2023',
    artist: 'Lewis Capaldi',
  },
  {
    number: '6',
    title: 'Scott Street',
    performance: 'Live on KEXP, 2018',
    artist: 'Phoebe Bridgers',
  },
  {
    number: '7',
    title: 'Bags',
    performance: 'Electric Lady Studios, 2023',
    artist: 'Clairo',
  },
];

export const Panel8Experience: React.FC<Panel8ExperienceProps> = ({
  isOpen,
  onClose,
  landingImageSrc,
  cassettePlayingSrc,
  playHoverSrc,
  pauseHoverSrc,
  stopHoverSrc,
  song1HoverSrc,
  song1AudioSrc,
  song2HoverSrc,
  song2AudioSrc,
  song3HoverSrc,
  song3AudioSrc,
  song4HoverSrc,
  song4AudioSrc,
  song5HoverSrc,
  song5AudioSrc,
  song6HoverSrc,
  song6AudioSrc,
  song7HoverSrc,
  song7AudioSrc,
  hoverMappingSrc,
  playClickAudioSrc,
  pauseClickAudioSrc,
  stopClickAudioSrc,
  videoSrc,
  onUploadMedia,
  onDropFiles,
  hasPrevious = false,
  hasNext = false,
  onSelectPrevious,
  onSelectNext,
}) => {
  // Step: 'video' (initial) -> 'music-home' (after video completes & Next clicked)
  const [currentStep, setCurrentStep] = useState<'video' | 'music-home'>('video');
  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10); // default 10s for placeholder
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState<boolean>(false);
  const [videoLoadError, setVideoLoadError] = useState<boolean>(false);

  // Fallback to static video if videoSrc is provided or default to public path
  const effectiveVideoSrc = videoLoadError ? undefined : (videoSrc || '/Panel 8 - Intro Video.mp4');

  // Music Player Interactive Hover States
  const [hoveredZone, setHoveredZone] = useState<'play' | 'pause' | 'stop' | 'golden-comet' | 'ring' | 'forget-me-not' | 'paper-crane' | 'cupcake' | 'polaroid' | 'tracklist' | null>(null);
  const [isHoverMapVisible, setIsHoverMapVisible] = useState<boolean>(false);
  const [isWalkmanPlaying, setIsWalkmanPlaying] = useState<boolean>(false);
  // Track whether play has been pressed at least once
  const [hasPlayedOnce, setHasPlayedOnce] = useState<boolean>(false);
  // Track album progress (0 = Song 1, 1 = Song 2, 2 = Song 3, 3 = Song 4, 4 = Song 5, 5 = Song 6, 6 = Song 7 / Clairo - Bags)
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  // Track 1 (Novo Amor - State Lines / Golden Comet) completion & overlay state
  const [isSong1Completed, setIsSong1Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('panel8_song1_completed') === 'true';
    } catch {
      return false;
    }
  });
  const [showDetailsOverlay, setShowDetailsOverlay] = useState<boolean>(false);

  // Track 2 (Phoebe Bridgers - Waiting Room / Ring) completion & overlay state
  const [isSong2Completed, setIsSong2Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('panel8_song2_completed') === 'true';
    } catch {
      return false;
    }
  });
  const [showSong2Overlay, setShowSong2Overlay] = useState<boolean>(false);

  // Track 3 (Seafret - Oceans / Forget Me Not) completion & overlay state
  const [isSong3Completed, setIsSong3Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('panel8_song3_completed') === 'true';
    } catch {
      return false;
    }
  });
  const [showSong3Overlay, setShowSong3Overlay] = useState<boolean>(false);

  // Track 4 (SYML - Where's My Love / Paper Crane) completion & overlay state
  const [isSong4Completed, setIsSong4Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('panel8_song4_completed') === 'true';
    } catch {
      return false;
    }
  });
  const [showSong4Overlay, setShowSong4Overlay] = useState<boolean>(false);

  // Track 5 (Lewis Capaldi - Before You Go / Cupcake) completion & overlay state
  const [isSong5Completed, setIsSong5Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('panel8_song5_completed') === 'true';
    } catch {
      return false;
    }
  });
  const [showSong5Overlay, setShowSong5Overlay] = useState<boolean>(false);

  // Track 6 (Phoebe Bridgers - Scott Street / Polaroid) completion & overlay state
  const [isSong6Completed, setIsSong6Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('panel8_song6_completed') === 'true';
    } catch {
      return false;
    }
  });
  const [showSong6Overlay, setShowSong6Overlay] = useState<boolean>(false);

  // Track 7 (Clairo - Bags / Complete Tracklist) completion & overlay state
  const [isSong7Completed, setIsSong7Completed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('panel8_song7_completed') === 'true';
    } catch {
      return false;
    }
  });
  const [showSong7Overlay, setShowSong7Overlay] = useState<boolean>(false);

  const [songCurrentTime, setSongCurrentTime] = useState<number>(0);
  const [songDuration, setSongDuration] = useState<number>(0);

  // Fixed calibrated hitboxes for all 7 mapped hover elements (hardcoded to ensure they never change or drift)
  const cometCoords = DEFAULT_COMET_COORDS;
  const ringCoords = DEFAULT_RING_COORDS;
  const forgetCoords = DEFAULT_FORGET_COORDS;
  const craneCoords = DEFAULT_CRANE_COORDS;
  const cupcakeCoords = DEFAULT_CUPCAKE_COORDS;
  const polaroidCoords = DEFAULT_POLAROID_COORDS;
  const tracklistCoords = DEFAULT_TRACKLIST_COORDS;

  const [isSong1HoverCropped, setIsSong1HoverCropped] = useState<boolean>(false);
  const [isSong2HoverCropped, setIsSong2HoverCropped] = useState<boolean>(false);
  const [isSong3HoverCropped, setIsSong3HoverCropped] = useState<boolean>(false);
  const [isSong4HoverCropped, setIsSong4HoverCropped] = useState<boolean>(false);
  const [isSong5HoverCropped, setIsSong5HoverCropped] = useState<boolean>(false);
  const [isSong6HoverCropped, setIsSong6HoverCropped] = useState<boolean>(false);
  const [isSong7HoverCropped, setIsSong7HoverCropped] = useState<boolean>(false);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const scrubberRef = useRef<HTMLDivElement | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const wasPlayingBeforeSeekRef = useRef<boolean>(false);
  const lastSeekTimeRef = useRef<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadTargetRef = useRef<'video' | 'landing' | 'song-1' | 'song-2' | 'song-3' | 'song-4' | 'song-5' | 'song-6' | 'song-7'>('video');
  const placeholderTimerRef = useRef<number | null>(null);
  const playAudioRef = useRef<HTMLAudioElement | null>(null);
  const pauseAudioRef = useRef<HTMLAudioElement | null>(null);
  const stopAudioRef = useRef<HTMLAudioElement | null>(null);
  const songAudioRef = useRef<HTMLAudioElement | null>(null);

  // Check if uploaded "Song 1 - Golden Comet Hover" asset is cropped to the card or a full-frame 1:1 overlay
  useEffect(() => {
    if (!song1HoverSrc) return;
    const img = new Image();
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      setIsSong1HoverCropped(ar < 1.25);
    };
    img.src = song1HoverSrc;
  }, [song1HoverSrc]);

  // Check if uploaded "Song 2 - Ring Hover" asset is cropped to the ring or a full-frame 1:1 overlay
  useEffect(() => {
    if (!song2HoverSrc) return;
    const img = new Image();
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      setIsSong2HoverCropped(ar < 1.25);
    };
    img.src = song2HoverSrc;
  }, [song2HoverSrc]);

  // Check if uploaded "Song 3 - Forget Me Not Hover" asset is cropped or a full-frame 1:1 overlay
  useEffect(() => {
    if (!song3HoverSrc) return;
    const img = new Image();
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      setIsSong3HoverCropped(ar < 1.25);
    };
    img.src = song3HoverSrc;
  }, [song3HoverSrc]);

  // Check if uploaded "Song 4 - Paper Crane Hover" asset is cropped or a full-frame 1:1 overlay
  useEffect(() => {
    if (!song4HoverSrc) return;
    const img = new Image();
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      setIsSong4HoverCropped(ar < 1.25);
    };
    img.src = song4HoverSrc;
  }, [song4HoverSrc]);

  // Check if uploaded "Song 5 - Cupcake Hover" asset is cropped or a full-frame 1:1 overlay
  useEffect(() => {
    if (!song5HoverSrc) return;
    const img = new Image();
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      setIsSong5HoverCropped(ar < 1.25);
    };
    img.src = song5HoverSrc;
  }, [song5HoverSrc]);

  // Check if uploaded "Song 6 - Polaroid Hover" asset is cropped or a full-frame 1:1 overlay
  useEffect(() => {
    if (!song6HoverSrc) return;
    const img = new Image();
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      setIsSong6HoverCropped(ar < 1.25);
    };
    img.src = song6HoverSrc;
  }, [song6HoverSrc]);

  // Check if uploaded "Song 7 - Complete Tracklist Hover" asset is cropped or a full-frame 1:1 overlay
  useEffect(() => {
    if (!song7HoverSrc) return;
    const img = new Image();
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      setIsSong7HoverCropped(ar < 1.25);
    };
    img.src = song7HoverSrc;
  }, [song7HoverSrc]);

  // Keep references to latest audio sources to avoid stale closures in audio event handlers
  const latestAudioSrcsRef = useRef({
    song1: song1AudioSrc,
    song2: song2AudioSrc,
    song3: song3AudioSrc,
    song4: song4AudioSrc,
    song5: song5AudioSrc,
    song6: song6AudioSrc,
    song7: song7AudioSrc,
  });

  useEffect(() => {
    latestAudioSrcsRef.current = {
      song1: song1AudioSrc,
      song2: song2AudioSrc,
      song3: song3AudioSrc,
      song4: song4AudioSrc,
      song5: song5AudioSrc,
      song6: song6AudioSrc,
      song7: song7AudioSrc,
    };
  }, [song1AudioSrc, song2AudioSrc, song3AudioSrc, song4AudioSrc, song5AudioSrc, song6AudioSrc, song7AudioSrc]);

  const handleTrackEndedRef = useRef<(trackIdx: number) => void>(() => {});

  // Track index ref to avoid stale closures in audio event handlers
  const currentTrackIndexRef = useRef<number>(0);

  // Handle song completion and auto-advance
  const handleTrackEnded = (endedTrackIdx: number) => {
    if (endedTrackIdx === 0) {
      setIsSong1Completed(true);
      try {
        localStorage.setItem('panel8_song1_completed', 'true');
      } catch {
        // ignore
      }
      // If Song 2 is available, auto-advance tape to Track 2 (Phoebe Bridgers - Waiting Room)
      const nextSrc = latestAudioSrcsRef.current.song2 || song2AudioSrc;
      if (nextSrc) {
        playTrackAudio(1);
      } else {
        setIsWalkmanPlaying(false);
      }
    } else if (endedTrackIdx === 1) {
      setIsSong2Completed(true);
      try {
        localStorage.setItem('panel8_song2_completed', 'true');
      } catch {
        // ignore
      }
      // If Song 3 is available, auto-advance tape to Track 3 (Seafret - Oceans)
      const nextSrc = latestAudioSrcsRef.current.song3 || song3AudioSrc;
      if (nextSrc) {
        playTrackAudio(2);
      } else {
        setIsWalkmanPlaying(false);
      }
    } else if (endedTrackIdx === 2) {
      setIsSong3Completed(true);
      try {
        localStorage.setItem('panel8_song3_completed', 'true');
      } catch {
        // ignore
      }
      // If Song 4 is available, auto-advance tape to Track 4 (SYML - Where's My Love)
      const nextSrc = latestAudioSrcsRef.current.song4 || song4AudioSrc;
      if (nextSrc) {
        playTrackAudio(3);
      } else {
        setIsWalkmanPlaying(false);
      }
    } else if (endedTrackIdx === 3) {
      setIsSong4Completed(true);
      try {
        localStorage.setItem('panel8_song4_completed', 'true');
      } catch {
        // ignore
      }
      // If Song 5 is available, auto-advance tape to Track 5 (Lewis Capaldi - Before You Go)
      const nextSrc = latestAudioSrcsRef.current.song5 || song5AudioSrc;
      if (nextSrc) {
        playTrackAudio(4);
      } else {
        setIsWalkmanPlaying(false);
      }
    } else if (endedTrackIdx === 4) {
      setIsSong5Completed(true);
      try {
        localStorage.setItem('panel8_song5_completed', 'true');
      } catch {
        // ignore
      }
      // If Song 6 is available, auto-advance tape to Track 6 (Phoebe Bridgers - Scott Street)
      const nextSrc = latestAudioSrcsRef.current.song6 || song6AudioSrc;
      if (nextSrc) {
        playTrackAudio(5);
      } else {
        setIsWalkmanPlaying(false);
        setCurrentTrackIndex(4);
      }
    } else if (endedTrackIdx === 5) {
      setIsSong6Completed(true);
      try {
        localStorage.setItem('panel8_song6_completed', 'true');
      } catch {
        // ignore
      }
      // If Song 7 is available, auto-advance tape to Track 7 (Clairo - Bags - Recorded at Electric Lady Studios)
      const nextSrc = latestAudioSrcsRef.current.song7 || song7AudioSrc;
      if (nextSrc) {
        playTrackAudio(6);
      } else {
        setIsWalkmanPlaying(false);
        setCurrentTrackIndex(5);
      }
    } else if (endedTrackIdx === 6) {
      setIsSong7Completed(true);
      try {
        localStorage.setItem('panel8_song7_completed', 'true');
      } catch {
        // ignore
      }
      setIsWalkmanPlaying(false);
      setCurrentTrackIndex(6);
    }
  };

  handleTrackEndedRef.current = handleTrackEnded;

  // Play audio for a specific track index (0 = Song 1, 1 = Song 2, 2 = Song 3, 3 = Song 4, 4 = Song 5, 5 = Song 6, 6 = Song 7)
  const playTrackAudio = (trackIdx: number) => {
    currentTrackIndexRef.current = trackIdx;
    setCurrentTrackIndex(trackIdx);
    const audioSrc =
      trackIdx === 0
        ? (latestAudioSrcsRef.current.song1 || song1AudioSrc)
        : trackIdx === 1
        ? (latestAudioSrcsRef.current.song2 || song2AudioSrc)
        : trackIdx === 2
        ? (latestAudioSrcsRef.current.song3 || song3AudioSrc)
        : trackIdx === 3
        ? (latestAudioSrcsRef.current.song4 || song4AudioSrc)
        : trackIdx === 4
        ? (latestAudioSrcsRef.current.song5 || song5AudioSrc)
        : trackIdx === 5
        ? (latestAudioSrcsRef.current.song6 || song6AudioSrc)
        : (latestAudioSrcsRef.current.song7 || song7AudioSrc);

    if (!audioSrc) {
      console.warn(`Track ${trackIdx + 1} audio source not found`);
      setIsWalkmanPlaying(false);
      return;
    }
    try {
      if (!songAudioRef.current) {
        const audio = new Audio(audioSrc);
        audio.addEventListener('timeupdate', () => {
          setSongCurrentTime(audio.currentTime);
          setSongDuration(audio.duration || 0);
        });
        audio.onended = () => handleTrackEndedRef.current(trackIdx);
        songAudioRef.current = audio;
      } else {
        songAudioRef.current.pause();
        if (songAudioRef.current.src !== audioSrc) {
          songAudioRef.current.src = audioSrc;
          songAudioRef.current.load();
        }
        songAudioRef.current.onended = () => handleTrackEndedRef.current(trackIdx);
      }
      if (songAudioRef.current.currentTime > 0) {
        songAudioRef.current.currentTime = 0;
      }
      const playPromise = songAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsWalkmanPlaying(true);
            setHasPlayedOnce(true);
          })
          .catch((err) => {
            console.warn('Playback start error:', err);
            setIsWalkmanPlaying(false);
          });
      } else {
        setIsWalkmanPlaying(true);
        setHasPlayedOnce(true);
      }
    } catch (err) {
      console.warn('Playback error:', err);
      setIsWalkmanPlaying(false);
    }
  };

  // Keep songAudioRef in sync if track audio source changes when not playing
  useEffect(() => {
    if (isWalkmanPlaying) return;
    const activeSrc =
      currentTrackIndex === 0
        ? song1AudioSrc
        : currentTrackIndex === 1
        ? song2AudioSrc
        : currentTrackIndex === 2
        ? song3AudioSrc
        : currentTrackIndex === 3
        ? song4AudioSrc
        : currentTrackIndex === 4
        ? song5AudioSrc
        : currentTrackIndex === 5
        ? song6AudioSrc
        : song7AudioSrc;
    if (activeSrc && songAudioRef.current && songAudioRef.current.src !== activeSrc) {
      songAudioRef.current.src = activeSrc;
    }
  }, [song1AudioSrc, song2AudioSrc, song3AudioSrc, song4AudioSrc, song5AudioSrc, song6AudioSrc, song7AudioSrc, currentTrackIndex, isWalkmanPlaying]);

  // Pause music audio when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (songAudioRef.current) {
        songAudioRef.current.pause();
      }
    };
  }, []);

  // Button click handlers (play, pause, stop)
  const handleButtonClick = (action: 'play' | 'pause' | 'stop') => {
    if (action === 'play') {
      // When already in cassette playing state, play button cannot be pressed again
      if (isWalkmanPlaying) return;

      setIsWalkmanPlaying(true);
      setHasPlayedOnce(true);

      // Play click SFX
      if (playClickAudioSrc) {
        try {
          if (!playAudioRef.current) {
            playAudioRef.current = new Audio(playClickAudioSrc);
          } else {
            playAudioRef.current.src = playClickAudioSrc;
          }
          playAudioRef.current.currentTime = 0;
          playAudioRef.current.play().catch(() => playMechanicalButtonClick('play'));
        } catch {
          playMechanicalButtonClick('play');
        }
      } else {
        playMechanicalButtonClick('play');
      }

      // Play/Resume audio playback
      if (songAudioRef.current && songAudioRef.current.paused && songAudioRef.current.currentTime > 0) {
        setIsWalkmanPlaying(true);
        setHasPlayedOnce(true);
        songAudioRef.current.play().catch((err) => {
          console.warn('Playback resume error:', err);
          setIsWalkmanPlaying(false);
        });
      } else {
        let trackToPlay = currentTrackIndex;
        if (currentTrackIndex === 0 && isSong1Completed && !isSong2Completed && song2AudioSrc) {
          trackToPlay = 1;
        } else if (
          (currentTrackIndex === 1 || (currentTrackIndex === 0 && isSong1Completed)) &&
          isSong2Completed &&
          !isSong3Completed &&
          (latestAudioSrcsRef.current.song3 || song3AudioSrc)
        ) {
          trackToPlay = 2;
        } else if (
          (currentTrackIndex === 2 || isSong3Completed) &&
          !isSong4Completed &&
          (latestAudioSrcsRef.current.song4 || song4AudioSrc)
        ) {
          trackToPlay = 3;
        } else if (
          (currentTrackIndex === 3 || isSong4Completed) &&
          !isSong5Completed &&
          (latestAudioSrcsRef.current.song5 || song5AudioSrc)
        ) {
          trackToPlay = 4;
        } else if (
          (currentTrackIndex === 4 || isSong5Completed) &&
          !isSong6Completed &&
          (latestAudioSrcsRef.current.song6 || song6AudioSrc)
        ) {
          trackToPlay = 5;
        } else if (
          (currentTrackIndex === 5 || isSong6Completed) &&
          !isSong7Completed &&
          (latestAudioSrcsRef.current.song7 || song7AudioSrc)
        ) {
          trackToPlay = 6;
        }
        playTrackAudio(trackToPlay);
      }
    } else if (action === 'pause') {
      // Pause button can only be clicked when play state is active
      if (!isWalkmanPlaying) return;

      // Revert back to static landing image
      setIsWalkmanPlaying(false);
      setHoveredZone(null);

      // Pause audio
      if (songAudioRef.current) {
        songAudioRef.current.pause();
      }

      if (pauseClickAudioSrc) {
        try {
          if (!pauseAudioRef.current) {
            pauseAudioRef.current = new Audio(pauseClickAudioSrc);
          } else {
            pauseAudioRef.current.src = pauseClickAudioSrc;
          }
          pauseAudioRef.current.currentTime = 0;
          pauseAudioRef.current.play().catch(() => playMechanicalButtonClick('pause'));
        } catch {
          playMechanicalButtonClick('pause');
        }
      } else {
        playMechanicalButtonClick('pause');
      }
    } else if (action === 'stop') {
      // Stop button cannot be pressed until play has been pressed at least once
      if (!hasPlayedOnce) return;

      // Can be pressed in play state or after pausing:
      // Stops playback and resets track progress to start the album from the first song
      setIsWalkmanPlaying(false);
      setCurrentTrackIndex(0);
      setHoveredZone(null);
      setIsSong1Completed(false);
      setIsSong2Completed(false);
      setIsSong3Completed(false);
      setIsSong4Completed(false);
      setIsSong5Completed(false);
      setIsSong6Completed(false);
      setIsSong7Completed(false);
      setShowDetailsOverlay(false);
      setShowSong2Overlay(false);
      setShowSong3Overlay(false);
      setShowSong4Overlay(false);
      setShowSong5Overlay(false);
      setShowSong6Overlay(false);
      setShowSong7Overlay(false);
      try {
        localStorage.removeItem('panel8_song7_completed');
      } catch {
        // ignore
      }

      // Reset Audio
      if (songAudioRef.current) {
        songAudioRef.current.pause();
        songAudioRef.current.currentTime = 0;
        setSongCurrentTime(0);
      }

      const sfxSrc = stopClickAudioSrc || pauseClickAudioSrc;
      if (sfxSrc) {
        try {
          if (!stopAudioRef.current) {
            stopAudioRef.current = new Audio(sfxSrc);
          } else {
            stopAudioRef.current.src = sfxSrc;
          }
          stopAudioRef.current.currentTime = 0;
          stopAudioRef.current.play().catch(() => playMechanicalButtonClick('stop'));
        } catch {
          playMechanicalButtonClick('stop');
        }
      } else {
        playMechanicalButtonClick('stop');
      }
    }
  };

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('video');
      setIsVideoEnded(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setHoveredZone(null);
      setIsHoverMapVisible(false);
      setIsWalkmanPlaying(false);
      setHasPlayedOnce(false);
      setCurrentTrackIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut 'M' to toggle hover mapping overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'm' || e.key === 'M') && currentStep === 'music-home' && hoverMappingSrc) {
        setIsHoverMapVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, hoverMappingSrc]);

  // Handle keyboard shortcuts (Escape to close or exit zoom)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExpanded, onClose]);

  // Reset error when videoSrc changes or when modal is opened
  useEffect(() => {
    setVideoLoadError(false);
  }, [videoSrc, isOpen]);

  // Placeholder video playback simulation if no real videoSrc provided
  useEffect(() => {
    if (effectiveVideoSrc) {
      // If real video is provided, native video element handles playback
      return;
    }

    if (isPlaying) {
      const interval = 100; // 100ms ticks
      placeholderTimerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= duration) {
            setIsPlaying(false);
            setIsVideoEnded(true);
            return duration;
          }
          return next;
        });
      }, interval);
    } else {
      if (placeholderTimerRef.current) {
        clearInterval(placeholderTimerRef.current);
      }
    }

    return () => {
      if (placeholderTimerRef.current) {
        clearInterval(placeholderTimerRef.current);
      }
    };
  }, [isPlaying, duration, effectiveVideoSrc]);

  // Listen for fullscreen change events on videoContainerRef
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsVideoFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handlers for real video playback
  const handleNativeTimeUpdate = () => {
    if (videoElementRef.current && !isSeekingRef.current) {
      const v = videoElementRef.current;
      setCurrentTime(v.currentTime);
      if (v.duration && !isNaN(v.duration) && isFinite(v.duration) && v.duration > 0) {
        setDuration(v.duration);
      }
    }
  };

  const handleNativeLoadedMetadata = () => {
    if (videoElementRef.current) {
      const v = videoElementRef.current;
      if (v.duration && !isNaN(v.duration) && isFinite(v.duration) && v.duration > 0) {
        setDuration(v.duration);
      }
    }
  };

  const handleNativeVideoEnded = () => {
    setIsPlaying(false);
    setIsVideoEnded(true);
  };

  const togglePlay = () => {
    if (effectiveVideoSrc && videoElementRef.current) {
      if (isPlaying) {
        videoElementRef.current.pause();
        setIsPlaying(false);
      } else {
        videoElementRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      // Placeholder simulation
      if (currentTime >= duration) {
        setCurrentTime(0);
        setIsVideoEnded(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsVideoEnded(false);
    if (effectiveVideoSrc && videoElementRef.current) {
      videoElementRef.current.currentTime = 0;
      videoElementRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handleFastForwardComplete = () => {
    const video = videoElementRef.current;
    const finalDur = (video && video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0)
      ? video.duration
      : duration;
    setCurrentTime(finalDur);
    setIsPlaying(false);
    setIsVideoEnded(true);
    if (effectiveVideoSrc && video) {
      video.currentTime = Math.max(0, finalDur - 0.05);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    if (videoElementRef.current) {
      videoElementRef.current.volume = newVolume;
      videoElementRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      const restoredVolume = volume === 0 ? 0.8 : volume;
      setVolume(restoredVolume);
      if (videoElementRef.current) {
        videoElementRef.current.muted = false;
        videoElementRef.current.volume = restoredVolume;
      }
    } else {
      setIsMuted(true);
      if (videoElementRef.current) {
        videoElementRef.current.muted = true;
      }
    }
  };

  const seekVideo = (newTime: number, isDragging = false) => {
    const video = videoElementRef.current;
    // Determine the true total duration
    const validDur = (video && video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0)
      ? video.duration
      : (duration > 0 ? duration : 10);

    const clampedTime = Math.max(0, Math.min(newTime, validDur));

    setCurrentTime(clampedTime);

    if (effectiveVideoSrc && video) {
      // Safely throttle native video seeking to avoid decoder crashes
      // Allow max 10 updates per second (100ms) during drag
      const now = performance.now();
      if (isDragging && now - lastSeekTimeRef.current < 100) {
        return;
      }
      
      try {
        if (video.readyState >= 1) { // HAVE_METADATA or higher
          // Only seek if the time difference is noticeable (>0.05s) to prevent double-seek bugs
          if (Math.abs(video.currentTime - clampedTime) > 0.05) {
            video.currentTime = clampedTime;
            lastSeekTimeRef.current = now;
          }
        }
      } catch (err) {
        console.warn('Error setting video currentTime:', err);
      }
    }

    if (clampedTime >= validDur - 0.1 && validDur > 0) {
      setIsVideoEnded(true);
    } else {
      setIsVideoEnded(false);
    }
  };

  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        if (videoContainerRef.current.requestFullscreen) {
          await videoContainerRef.current.requestFullscreen();
        } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
          await (videoContainerRef.current as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (uploadTargetRef.current === 'song-1') {
        const renamed = new File([file], 'song-1-audio-novo-amor-state-lines.mp3', { type: file.type || 'audio/mpeg' });
        if (onDropFiles) onDropFiles([renamed]);
        if (e.target) e.target.value = '';
        return;
      } else if (uploadTargetRef.current === 'song-2') {
        const renamed = new File([file], 'song-2-audio-phoebe-bridgers-waiting-room.mp3', { type: file.type || 'audio/mpeg' });
        if (onDropFiles) onDropFiles([renamed]);
        if (e.target) e.target.value = '';
        return;
      } else if (uploadTargetRef.current === 'song-3') {
        const renamed = new File([file], 'song-3-audio-seafret-oceans.mp3', { type: file.type || 'audio/mpeg' });
        if (onDropFiles) onDropFiles([renamed]);
        if (e.target) e.target.value = '';
        return;
      } else if (uploadTargetRef.current === 'song-4') {
        const renamed = new File([file], 'song-4-audio-syml-wheres-my-love.mp3', { type: file.type || 'audio/mpeg' });
        if (onDropFiles) onDropFiles([renamed]);
        if (e.target) e.target.value = '';
        return;
      } else if (uploadTargetRef.current === 'song-5') {
        const renamed = new File([file], 'song-5-audio-lewis-capaldi-before-you-go.mp3', { type: file.type || 'audio/mpeg' });
        if (onDropFiles) onDropFiles([renamed]);
        if (e.target) e.target.value = '';
        return;
      } else if (uploadTargetRef.current === 'song-6') {
        const renamed = new File([file], 'song-6-audio-phoebe-bridgers-scott-street.mp3', { type: file.type || 'audio/mpeg' });
        if (onDropFiles) onDropFiles([renamed]);
        if (e.target) e.target.value = '';
        return;
      } else if (uploadTargetRef.current === 'song-7') {
        const renamed = new File([file], 'song-7-audio-clairo-bags.mp3', { type: file.type || 'audio/mpeg' });
        if (onDropFiles) onDropFiles([renamed]);
        if (e.target) e.target.value = '';
        return;
      }

      const lowerName = file.name.toLowerCase();
      if (
        file.type.startsWith('audio/') ||
        /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name) ||
        lowerName.includes('sound') ||
        lowerName.includes('audio') ||
        lowerName.includes('hover') ||
        lowerName.includes('play') ||
        lowerName.includes('pause') ||
        lowerName.includes('stop') ||
        lowerName.includes('mapping') ||
        file.name.endsWith('.svg') ||
        file.type === 'image/svg+xml'
      ) {
        if (onDropFiles) {
          onDropFiles([file]);
        } else if (onUploadMedia) {
          onUploadMedia(file, uploadTargetRef.current);
        }
      } else if (onUploadMedia) {
        onUploadMedia(file, uploadTargetRef.current);
      }
    }
    if (e.target) e.target.value = '';
  };

  const triggerUpload = (type: 'video' | 'landing') => {
    uploadTargetRef.current = type;
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'video' ? 'video/*' : 'image/*';
      fileInputRef.current.click();
    }
  };

  if (!isOpen) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Hidden File Input for Video or Static Landing Image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Container */}
      <div
        className={`relative w-full ${
          currentStep === 'music-home' ? 'max-w-6xl max-h-[96vh]' : 'max-w-5xl max-h-[92vh]'
        } flex flex-col bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Border */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shrink-0" />

        {/* Floating Top Header Buttons in Music Home mode for clean immersion */}
        {currentStep === 'music-home' && (
          <div className="absolute top-3.5 right-3.5 z-30 flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/70 hover:bg-black/95 text-zinc-300 hover:text-white border border-zinc-700/60 backdrop-blur-md transition-all shadow-xl flex items-center justify-center"
              title="Home"
              aria-label="Home"
            >
              <Home className="w-5 h-5 text-zinc-200" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/70 hover:bg-black/95 text-zinc-300 hover:text-white border border-zinc-700/60 backdrop-blur-md transition-all shadow-xl flex items-center justify-center"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header Bar - shown during video presentation step */}
        {currentStep === 'video' && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/90 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Panel 8</span>
              </span>

              <div>
                <h2 className="text-2xl sm:text-3xl font-handwriting text-amber-100 tracking-wider flex items-center space-x-2">
                  <span>Melodies of Memories</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Home Page Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center justify-center"
                title="Home"
                aria-label="Home"
              >
                <Home className="w-5 h-5 text-zinc-300 hover:text-white" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                title="Close (Esc)"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div
          className={`flex-1 overflow-y-auto ${
            currentStep === 'music-home' ? 'p-2 sm:p-3 bg-black' : 'p-4 sm:p-6 bg-zinc-950/70'
          } flex flex-col items-center justify-center min-h-[400px]`}
        >
          {/* ========================================================================= */}
          {/* STEP 1: VIDEO EXPERIENCE                                                  */}
          {/* ========================================================================= */}
          {currentStep === 'video' && (
            <div className="w-full max-w-4xl flex flex-col items-center">
              {/* Video Player Box */}
              <div
                ref={videoContainerRef}
                className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl flex items-center justify-center group ${
                  isVideoFullscreen ? 'border-none rounded-none w-screen h-screen' : ''
                }`}
              >
                {effectiveVideoSrc ? (
                  /* Real User Uploaded Video */
                  <video
                    ref={videoElementRef}
                    src={effectiveVideoSrc}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleNativeTimeUpdate}
                    onLoadedMetadata={handleNativeLoadedMetadata}
                    onLoadedData={handleNativeLoadedMetadata}
                    onDurationChange={handleNativeLoadedMetadata}
                    onEnded={handleNativeVideoEnded}
                    onError={(e) => {
                      console.warn('Video failed to load:', effectiveVideoSrc, e);
                      setVideoLoadError(true);
                    }}
                    onClick={togglePlay}
                    playsInline
                    preload="auto"
                  />
                ) : (
                  /* Elegant Animated Video Placeholder */
                  <div
                    className="w-full h-full relative flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-950"
                    onClick={togglePlay}
                  >
                    {/* Atmospheric stained glass luminous background glow */}
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-yellow-600/10 to-transparent" />

                    {/* St. Giles Decorative Center Icon */}
                    <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3">
                      <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {isPlaying ? (
                          <div className="flex items-center space-x-1">
                            <span className="w-1.5 h-6 bg-amber-400 rounded-full animate-pulse" />
                            <span className="w-1.5 h-10 bg-yellow-300 rounded-full animate-pulse delay-75" />
                            <span className="w-1.5 h-7 bg-amber-400 rounded-full animate-pulse delay-150" />
                          </div>
                        ) : (
                          <Play className="w-9 h-9 text-amber-400 ml-1" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="inline-block text-[11px] uppercase tracking-wider font-semibold text-amber-400/90 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          Video Placeholder
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-handwriting text-amber-100 tracking-wider">
                          Melodies of Memories
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto">
                          {isPlaying
                            ? 'Playing presentation video... (Playback in progress)'
                            : isVideoEnded
                            ? 'Playback complete. Press "Next" below to enter the music player.'
                            : 'Click Play to begin the video experience'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Big Center Play Overlay Button if paused */}
                {!isPlaying && !isVideoEnded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="absolute z-20 w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                    aria-label="Play Video"
                  >
                    <Play className="w-8 h-8 ml-1 fill-black" />
                  </button>
                )}

                {/* Player Bottom Control Bar */}
                <div
                  className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 flex flex-col space-y-2 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Progress Timeline Scrubber with Smooth Seeking & Dragging */}
                  <div
                    ref={scrubberRef}
                    className="relative w-full h-5 py-1.5 flex items-center cursor-pointer group/scrub touch-none select-none"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      isSeekingRef.current = true;

                      if (videoElementRef.current) {
                        wasPlayingBeforeSeekRef.current = !videoElementRef.current.paused;
                        if (wasPlayingBeforeSeekRef.current) {
                          videoElementRef.current.pause();
                          setIsPlaying(false);
                        }
                      } else {
                        wasPlayingBeforeSeekRef.current = isPlaying;
                        if (isPlaying) {
                          setIsPlaying(false);
                        }
                      }

                      const element = scrubberRef.current;
                      if (!element) return;

                      // Grab rect once at pointer down and keep track of pointer
                      let cachedRect = element.getBoundingClientRect();

                      try {
                        element.setPointerCapture(e.pointerId);
                      } catch {
                        // ignore pointer capture errors if unsupported
                      }

                      const updateSeek = (clientX: number, isDragging: boolean) => {
                        const rect = scrubberRef.current?.getBoundingClientRect() || cachedRect;
                        if (!rect || rect.width <= 0) return;
                        const clickX = clientX - rect.left;
                        const ratio = Math.max(0, Math.min(1, clickX / rect.width));

                        const video = videoElementRef.current;
                        const effectiveDur = (video && video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0)
                          ? video.duration
                          : (duration > 0 ? duration : 10);

                        seekVideo(ratio * effectiveDur, isDragging);
                      };

                      updateSeek(e.clientX, false);

                      const handlePointerMove = (moveEvent: PointerEvent) => {
                        updateSeek(moveEvent.clientX, true);
                      };

                      const handlePointerUp = (upEvent: PointerEvent) => {
                        updateSeek(upEvent.clientX, false);
                        setTimeout(() => {
                          isSeekingRef.current = false;
                        }, 100); // give the browser a little more time to flush timeupdate

                        if (wasPlayingBeforeSeekRef.current) {
                          if (videoElementRef.current) {
                            videoElementRef.current.play().catch(() => {});
                          }
                          setIsPlaying(true);
                        }

                        try {
                          element.releasePointerCapture(upEvent.pointerId);
                        } catch {
                          // ignore
                        }
                        window.removeEventListener('pointermove', handlePointerMove);
                        window.removeEventListener('pointerup', handlePointerUp);
                        window.removeEventListener('pointercancel', handlePointerUp);
                      };

                      window.addEventListener('pointermove', handlePointerMove);
                      window.addEventListener('pointerup', handlePointerUp);
                      window.addEventListener('pointercancel', handlePointerUp);
                    }}
                  >
                    {/* Track Background */}
                    <div className="w-full h-1.5 bg-zinc-700/80 rounded-full overflow-hidden group-hover/scrub:h-2 transition-all">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {/* Scrub Handle / Thumb indicator */}
                    <div
                      className="absolute w-3.5 h-3.5 bg-amber-300 rounded-full shadow-md -translate-x-1/2 opacity-0 group-hover/scrub:opacity-100 transition-opacity pointer-events-none"
                      style={{ left: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Playback Controls & Timestamps */}
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={togglePlay}
                        className="p-1 hover:text-amber-300 transition-colors"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={handleReplay}
                        className="p-1 hover:text-amber-300 transition-colors"
                        title="Replay from start"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* Volume Controls */}
                      <div className="flex items-center space-x-1.5 group/vol">
                        <button
                          onClick={toggleMute}
                          className="p-1 text-zinc-400 hover:text-amber-300 transition-colors"
                          title={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-16 sm:w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 focus:outline-none"
                          title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                        />
                      </div>

                      <span className="font-mono text-[11px] text-zinc-400">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Fast-forward complete trigger */}
                      {!isVideoEnded && (
                        <button
                          onClick={handleFastForwardComplete}
                          className="px-2.5 py-1 rounded bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 text-[11px] font-medium border border-zinc-700/60 transition-colors shadow-sm"
                          title="Fast Forward to the End of the Video"
                        >
                          Finish Video
                        </button>
                      )}

                      {/* Fullscreen Toggle Button */}
                      <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 transition-colors"
                        title={isVideoFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        aria-label={isVideoFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                      >
                        {isVideoFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* POST-PLAYBACK COMPLETION AREA */}
              <div className="mt-6 w-full flex flex-col items-center justify-center min-h-[64px]">
                {isVideoEnded ? (
                  /* NEXT BUTTON (Rendered once playback is complete) */
                  <div className="flex flex-col items-center space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <button
                      id="btn-panel8-next"
                      onClick={() => setCurrentStep('music-home')}
                      className="group px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-serif font-bold text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center space-x-2.5 transition-all transform hover:scale-[1.02] active:scale-95"
                    >
                      <Music className="w-4 h-4 text-zinc-950" />
                      <span>Proceed to Panel 8's Gift</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-base sm:text-lg text-amber-100/90 max-w-xl text-center leading-relaxed font-handwriting tracking-wide px-4">
                      Some of these you may have heard before, some of them may be for the first time. I hope you can imagine these being sung to you personally in a private concert :p
                    </span>
                  </div>
                ) : (
                  /* Waiting for completion notice */
                  <div className="text-xs text-zinc-500 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500/50 animate-ping" />
                    <span>Watch the video to completion to unlock the "Next" button</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: STATIC IMAGE LANDING SCREEN (HOME PAGE OF THE MUSIC PLAYER)       */}
          {/* ========================================================================= */}
          {currentStep === 'music-home' && (
            <div
              className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-300"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onDropFiles) {
                  onDropFiles(e.dataTransfer.files);
                }
              }}
            >
              {(landingImageSrc || '/music-landing.svg') ? (
                /* Interactive Landing Image Container with seamless Hover transitions and Cassette Playing State */
                <div className="relative inline-flex items-center justify-center max-h-[83vh] max-w-full select-none py-1">
                  {/* 1. Base Dimension Anchor: Static Landing Image (always maintains the exact container dimensions and aspect ratio) */}
                  <img
                    src={landingImageSrc || '/music-landing.svg'}
                    alt="Music Player Home Screen"
                    onError={(e) => {
                      if ((e.currentTarget as HTMLImageElement).src !== window.location.origin + '/music-landing.svg') {
                        (e.currentTarget as HTMLImageElement).src = '/music-landing.svg';
                      }
                    }}
                    className={`max-h-[83vh] w-auto max-w-full object-contain rounded-xl drop-shadow-2xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                      isWalkmanPlaying ? 'opacity-0' : 'opacity-100'
                    }`}
                  />

                  {/* 2. Cassette Playing Animated SVG Layer (Seamless 1:1 overlay in identical dimensions) */}
                  {isWalkmanPlaying && (
                    cassettePlayingSrc ? (
                      <img
                        src={cassettePlayingSrc}
                        alt="Cassette Playing Animation"
                        className="absolute inset-0 w-full h-full object-contain rounded-xl drop-shadow-2xl select-none pointer-events-none transition-opacity duration-150 ease-out opacity-100"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                        <CassettePlayingAnimation className="w-full h-full" isPlaying={true} />
                      </div>
                    )
                  )}

                  {/* 2. Play Hover Layer (Active only when NOT in playing state) */}
                  {!isWalkmanPlaying && playHoverSrc && (
                    <img
                      src={playHoverSrc}
                      alt="Play Hover State"
                      className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                        hoveredZone === 'play' ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}

                  {/* 3. Pause Hover Layer (Active only when in playing state on Pause button hover) */}
                  {isWalkmanPlaying && pauseHoverSrc && (
                    <img
                      src={pauseHoverSrc}
                      alt="Pause Hover State"
                      className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                        hoveredZone === 'pause' ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}

                  {/* 3.5. Stop Hover Layer (Active only when play has been pressed at least once, on Stop button hover) */}
                  {hasPlayedOnce && stopHoverSrc && (
                    <img
                      src={stopHoverSrc}
                      alt="Stop Hover State"
                      className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                        hoveredZone === 'stop' ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}

                  {/* 3.6. Golden Comet Hover Layer ("Song 1 - Golden Comet Hover")
                      Activates on Golden Comet hover when Song 1 completes or when mapping guide is aligned.
                      Directly covers the "Song 1 - Golden Comet Hover" section on the left. */}
                  {(isSong1Completed || isHoverMapVisible) && song1HoverSrc && (
                    isSong1HoverCropped ? (
                      <img
                        src={song1HoverSrc}
                        alt="Song 1 - Golden Comet Hover"
                        className={`absolute object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'golden-comet' ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          left: `${cometCoords.left}%`,
                          top: `${cometCoords.top}%`,
                          width: `${cometCoords.width}%`,
                          height: `${cometCoords.height}%`,
                        }}
                      />
                    ) : (
                      <img
                        src={song1HoverSrc}
                        alt="Song 1 - Golden Comet Hover"
                        className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'golden-comet' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )
                  )}

                  {/* 3.7. Ring Hover Layer ("Song 2 - Ring Hover")
                      Activates on Ring hover when Song 2 completes or when mapping guide is aligned.
                      Directly covers the "Song 2 - Ring Hover" section on the right. */}
                  {(isSong2Completed || isHoverMapVisible) && song2HoverSrc && (
                    isSong2HoverCropped ? (
                      <img
                        src={song2HoverSrc}
                        alt="Song 2 - Ring Hover"
                        className={`absolute object-contain rounded-full select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'ring' ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          left: `${ringCoords.left}%`,
                          top: `${ringCoords.top}%`,
                          width: `${ringCoords.width}%`,
                          height: `${ringCoords.height}%`,
                        }}
                      />
                    ) : (
                      <img
                        src={song2HoverSrc}
                        alt="Song 2 - Ring Hover"
                        className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'ring' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )
                  )}

                  {/* 3.8. Forget Me Not Hover Layer ("Song 3 - Forget Me Not Hover")
                      Activates on Forget Me Not hover when Song 3 completes or when mapping guide is aligned.
                      Directly covers the "Song 3 - Forget Me Not Hover" section. */}
                  {(isSong3Completed || isHoverMapVisible) && song3HoverSrc && (
                    isSong3HoverCropped ? (
                      <img
                        src={song3HoverSrc}
                        alt="Song 3 - Forget Me Not Hover"
                        className={`absolute object-contain rounded-full select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'forget-me-not' ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          left: `${forgetCoords.left}%`,
                          top: `${forgetCoords.top}%`,
                          width: `${forgetCoords.width}%`,
                          height: `${forgetCoords.height}%`,
                        }}
                      />
                    ) : (
                      <img
                        src={song3HoverSrc}
                        alt="Song 3 - Forget Me Not Hover"
                        className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'forget-me-not' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )
                  )}

                  {/* Gentle hover glow for Forget Me Not when unlocked and hovered if custom hover PNG is not yet loaded */}
                  {(isSong3Completed || isHoverMapVisible) && !song3HoverSrc && hoveredZone === 'forget-me-not' && (
                    <div
                      className="absolute rounded-full border-2 border-sky-400/70 bg-sky-400/20 shadow-[0_0_15px_rgba(56,189,248,0.35)] select-none pointer-events-none transition-opacity duration-150 animate-pulse"
                      style={{
                        left: `${forgetCoords.left}%`,
                        top: `${forgetCoords.top}%`,
                        width: `${forgetCoords.width}%`,
                        height: `${forgetCoords.height}%`,
                      }}
                    />
                  )}

                  {/* 3.9. Paper Crane Hover Layer ("Song 4 - Paper Crane Hover")
                      Activates on Paper Crane hover when Song 4 completes or when mapping guide is aligned.
                      Directly covers the "Song 4 - Paper Crane Hover" section. */}
                  {(isSong4Completed || isHoverMapVisible) && song4HoverSrc && (
                    isSong4HoverCropped ? (
                      <img
                        src={song4HoverSrc}
                        alt="Song 4 - Paper Crane Hover"
                        className={`absolute object-contain select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'paper-crane' ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          left: `${craneCoords.left}%`,
                          top: `${craneCoords.top}%`,
                          width: `${craneCoords.width}%`,
                          height: `${craneCoords.height}%`,
                        }}
                      />
                    ) : (
                      <img
                        src={song4HoverSrc}
                        alt="Song 4 - Paper Crane Hover"
                        className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'paper-crane' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )
                  )}

                  {/* 3.10. Cupcake Hover Layer ("Song 5 - Cupcake Hover")
                      Activates on Cupcake hover when Song 5 completes or when mapping guide is aligned.
                      Directly covers the "Song 5 - Cupcake Hover" section. */}
                  {(isSong5Completed || isHoverMapVisible) && song5HoverSrc && (
                    isSong5HoverCropped ? (
                      <img
                        src={song5HoverSrc}
                        alt="Song 5 - Cupcake Hover"
                        className={`absolute object-contain rounded-full select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'cupcake' ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          left: `${cupcakeCoords.left}%`,
                          top: `${cupcakeCoords.top}%`,
                          width: `${cupcakeCoords.width}%`,
                          height: `${cupcakeCoords.height}%`,
                        }}
                      />
                    ) : (
                      <img
                        src={song5HoverSrc}
                        alt="Song 5 - Cupcake Hover"
                        className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'cupcake' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )
                  )}

                  {/* Gentle hover glow for Cupcake when unlocked and hovered if custom hover PNG is not yet loaded */}
                  {(isSong5Completed || isHoverMapVisible) && !song5HoverSrc && hoveredZone === 'cupcake' && (
                    <div
                      className="absolute rounded-full border-2 border-pink-400/70 bg-pink-400/20 shadow-[0_0_15px_rgba(244,114,182,0.35)] select-none pointer-events-none transition-opacity duration-150 animate-pulse"
                      style={{
                        left: `${cupcakeCoords.left}%`,
                        top: `${cupcakeCoords.top}%`,
                        width: `${cupcakeCoords.width}%`,
                        height: `${cupcakeCoords.height}%`,
                      }}
                    />
                  )}

                  {/* 3f. Song 6 Polaroid Hover Layer - Active when unlocked (or in alignment mode) and hovered */}
                  {(isSong6Completed || isHoverMapVisible) && song6HoverSrc && (
                    isSong6HoverCropped ? (
                      <img
                        src={song6HoverSrc}
                        alt="Song 6 - Polaroid Hover"
                        className={`absolute object-contain rounded-lg select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'polaroid' ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          left: `${polaroidCoords.left}%`,
                          top: `${polaroidCoords.top}%`,
                          width: `${polaroidCoords.width}%`,
                          height: `${polaroidCoords.height}%`,
                        }}
                      />
                    ) : (
                      <img
                        src={song6HoverSrc}
                        alt="Song 6 - Polaroid Hover"
                        className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'polaroid' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )
                  )}

                  {/* Gentle hover glow for Polaroid when unlocked and hovered if custom hover PNG is not yet loaded */}
                  {(isSong6Completed || isHoverMapVisible) && !song6HoverSrc && hoveredZone === 'polaroid' && (
                    <div
                      className="absolute rounded-lg border-2 border-indigo-400/70 bg-indigo-400/20 shadow-[0_0_15px_rgba(129,140,248,0.35)] select-none pointer-events-none transition-opacity duration-150 animate-pulse"
                      style={{
                        left: `${polaroidCoords.left}%`,
                        top: `${polaroidCoords.top}%`,
                        width: `${polaroidCoords.width}%`,
                        height: `${polaroidCoords.height}%`,
                      }}
                    />
                  )}

                  {/* 3g. Song 7 Complete Tracklist Hover Layer - Active when unlocked (or in alignment mode) and hovered */}
                  {(isSong7Completed || isHoverMapVisible) && song7HoverSrc && (
                    isSong7HoverCropped ? (
                      <img
                        src={song7HoverSrc}
                        alt="Song 7 - Complete Tracklist Hover"
                        className={`absolute object-contain rounded-lg select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'tracklist' ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          left: `${tracklistCoords.left}%`,
                          top: `${tracklistCoords.top}%`,
                          width: `${tracklistCoords.width}%`,
                          height: `${tracklistCoords.height}%`,
                        }}
                      />
                    ) : (
                      <img
                        src={song7HoverSrc}
                        alt="Song 7 - Complete Tracklist Hover"
                        className={`absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none transition-opacity duration-150 ease-out ${
                          hoveredZone === 'tracklist' ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )
                  )}

                  {/* Gentle hover glow for Complete Tracklist when unlocked and hovered if custom hover PNG is not yet loaded */}
                  {(isSong7Completed || isHoverMapVisible) && !song7HoverSrc && hoveredZone === 'tracklist' && (
                    <div
                      className="absolute rounded-lg border-2 border-amber-400/70 bg-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.35)] select-none pointer-events-none transition-opacity duration-150 animate-pulse"
                      style={{
                        left: `${tracklistCoords.left}%`,
                        top: `${tracklistCoords.top}%`,
                        width: `${tracklistCoords.width}%`,
                        height: `${tracklistCoords.height}%`,
                      }}
                    />
                  )}

                  {/* 4. Hover Mapping Guide Layer (Toggleable to verify alignment) */}
                  {isHoverMapVisible && hoverMappingSrc && (
                    <img
                      src={hoverMappingSrc}
                      alt="Hover Mapping Guide"
                      className="absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none opacity-70 mix-blend-screen transition-opacity duration-150"
                    />
                  )}

                  {/* 5. Interactive Hitboxes Overlay */}
                  <div className="absolute inset-0 w-full h-full pointer-events-auto">
                    {/* Stop Button Hitbox - to the left of Pause (the widest button).
                        Active and clickable ONLY after play has been pressed at least once.
                        Can be pressed in play state or after pausing. */}
                    <div
                      id="walkman-stop-hitbox"
                      className={`absolute transition-colors duration-150 ${
                        hasPlayedOnce ? 'cursor-pointer' : 'cursor-not-allowed opacity-0'
                      } ${
                        isHoverMapVisible ? 'border-2 border-rose-500 bg-rose-500/20' : ''
                      }`}
                      style={{
                        left: '34.0%',
                        top: '22.8%',
                        width: '5.2%',
                        height: '7.8%',
                      }}
                      onMouseEnter={() => {
                        if (hasPlayedOnce) setHoveredZone('stop');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'stop') setHoveredZone(null);
                      }}
                      onClick={() => handleButtonClick('stop')}
                      title={
                        hasPlayedOnce
                          ? 'Stop Button (Reset album to first track)'
                          : 'Stop Button (Inactive until Play is pressed)'
                      }
                      aria-label="Stop Button"
                      aria-disabled={!hasPlayedOnce}
                    />

                    {/* Pause Button Hitbox - widest button, only clickable and active when Walkman is in playing state */}
                    <div
                      id="walkman-pause-hitbox"
                      className={`absolute transition-colors duration-150 ${
                        isWalkmanPlaying ? 'cursor-pointer' : 'cursor-not-allowed opacity-0'
                      } ${
                        isHoverMapVisible ? 'border-2 border-emerald-400 bg-emerald-400/20' : ''
                      }`}
                      style={{
                        left: '39.8%',
                        top: '22.8%',
                        width: '8.4%',
                        height: '7.8%',
                      }}
                      onMouseEnter={() => {
                        if (isWalkmanPlaying) setHoveredZone('pause');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'pause') setHoveredZone(null);
                      }}
                      onClick={() => handleButtonClick('pause')}
                      title={isWalkmanPlaying ? 'Pause Button' : 'Pause (Only active during playback)'}
                      aria-label={isWalkmanPlaying ? 'Pause Button' : 'Pause'}
                      aria-disabled={!isWalkmanPlaying}
                    />

                    {/* Play Button Hitbox - disabled when Walkman is already in cassette playing state */}
                    <div
                      id="walkman-play-hitbox"
                      className={`absolute transition-colors duration-150 ${
                        isWalkmanPlaying ? 'cursor-not-allowed opacity-0' : 'cursor-pointer'
                      } ${
                        isHoverMapVisible ? 'border-2 border-amber-400 bg-amber-400/20' : ''
                      }`}
                      style={{
                        left: '49.0%',
                        top: '23.4%',
                        width: '7.2%',
                        height: '7.4%',
                      }}
                      onMouseEnter={() => {
                        if (!isWalkmanPlaying) setHoveredZone('play');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'play') setHoveredZone(null);
                      }}
                      onClick={() => handleButtonClick('play')}
                      title={isWalkmanPlaying ? 'Playing' : 'Play Button'}
                      aria-label={isWalkmanPlaying ? 'Playing' : 'Play Button'}
                      aria-disabled={isWalkmanPlaying}
                    />

                    {/* Golden Comet Hitbox (Song 1 Interactive Object)
                        Directly covering the "Song 1 - Golden Comet Hover" card on the left.
                        Unlocks when Song 1 completes, or active during alignment mode.
                        Completely transparent so only the authentic hover image artwork renders without any artificial box highlights.
                        Clicking opens the details overlay (Novo Amor · State Lines · Greenpeace Antarctic Performance). */}
                    <div
                      id="walkman-golden-comet-hitbox"
                      className={`absolute transition-all duration-200 ${
                        isSong1Completed || isHoverMapVisible
                          ? 'cursor-pointer'
                          : 'cursor-default pointer-events-none opacity-0'
                      }`}
                      style={{
                        left: `${cometCoords.left}%`,
                        top: `${cometCoords.top}%`,
                        width: `${cometCoords.width}%`,
                        height: `${cometCoords.height}%`,
                        borderRadius: '8px',
                      }}
                      onMouseEnter={() => {
                        if (isSong1Completed || isHoverMapVisible) setHoveredZone('golden-comet');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'golden-comet') setHoveredZone(null);
                      }}
                      onClick={() => {
                        if (isSong1Completed) {
                          setShowDetailsOverlay((prev) => !prev);
                          setShowSong2Overlay(false);
                          setShowSong3Overlay(false);
                          setShowSong4Overlay(false);
                          setShowSong5Overlay(false);
                          setShowSong6Overlay(false);
                        }
                      }}
                      title={
                        isSong1Completed
                          ? 'Song 1 - Golden Comet Hover (Click to view details)'
                          : isHoverMapVisible
                          ? 'Song 1 - Golden Comet Hover (Mapping Guide Hitbox)'
                          : 'Song 1 - Golden Comet Hover (Unlocks after song completes)'
                      }
                      aria-label="Song 1 - Golden Comet Hover"
                    />

                    {/* Seamless Small Overlay Beside Golden Comet */}
                    {showDetailsOverlay && isSong1Completed && (
                      <div
                        id="golden-comet-details-overlay"
                        className={`absolute z-40 bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl rounded-xl p-4 w-72 max-w-[85vw] text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto`}
                        style={{
                          ...(cometCoords.left > 55
                            ? { right: `calc(${100 - cometCoords.left}% + 14px)` }
                            : { left: `calc(${cometCoords.left + cometCoords.width}% + 14px)` }),
                          top: `${Math.max(6, Math.min(62, cometCoords.top - 4))}%`,
                        }}
                      >
                        {/* Pointer arrowhead towards the comet */}
                        <div
                          className={`absolute top-6 w-3 h-3 bg-zinc-950 border-amber-500/50 transform rotate-45 pointer-events-none ${
                            cometCoords.left > 55
                              ? '-right-1.5 border-t border-r'
                              : '-left-1.5 border-b border-l'
                          }`}
                        />

                        {/* Close Button */}
                        <button
                          onClick={() => setShowDetailsOverlay(false)}
                          className="absolute top-3 right-3 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                          title="Close"
                          aria-label="Close details"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* The 3 Specific User Details */}
                        <div className="space-y-3 text-xs pr-6">
                          {/* 1) Artist */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              1. Artist
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Novo Amor
                            </div>
                          </div>

                          {/* 2) Song Name */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              2. Song Name
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              State Lines
                            </div>
                          </div>

                          {/* 3) Performance */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              3. Performance
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Greenpeace Antarctic Performance, 2022
                            </div>
                          </div>
                        </div>

                        {/* Mini Replay Control */}
                        <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => {
                              playTrackAudio(0);
                            }}
                            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay Song</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Ring Hitbox (Song 2 Interactive Object)
                        Directly covering the "Song 2 - Ring Hover" section on the right.
                        Unlocks when Song 2 completes, or active during alignment mode.
                        Completely transparent so only the authentic hover image artwork renders without any artificial box highlights.
                        Clicking opens the details overlay (Phoebe Bridgers · Waiting Room · Live at KEXP, 2018). */}
                    <div
                      id="walkman-ring-hitbox"
                      className={`absolute transition-all duration-200 ${
                        isSong2Completed || isHoverMapVisible
                          ? 'cursor-pointer'
                          : 'cursor-default pointer-events-none opacity-0'
                      } ${
                        isHoverMapVisible ? 'border-2 border-dashed border-amber-400/90 bg-amber-400/15' : ''
                      }`}
                      style={{
                        left: `${ringCoords.left}%`,
                        top: `${ringCoords.top}%`,
                        width: `${ringCoords.width}%`,
                        height: `${ringCoords.height}%`,
                        borderRadius: '9999px',
                      }}
                      onMouseEnter={() => {
                        if (isSong2Completed || isHoverMapVisible) setHoveredZone('ring');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'ring') setHoveredZone(null);
                      }}
                      onClick={() => {
                        if (isSong2Completed) {
                          setShowSong2Overlay((prev) => !prev);
                          setShowDetailsOverlay(false);
                          setShowSong3Overlay(false);
                          setShowSong4Overlay(false);
                          setShowSong5Overlay(false);
                          setShowSong6Overlay(false);
                        }
                      }}
                      title={
                        isSong2Completed
                          ? 'Song 2 - Ring Hover (Click to view details)'
                          : isHoverMapVisible
                          ? 'Song 2 - Ring Hover (Mapping Guide Hitbox)'
                          : 'Song 2 - Ring Hover (Unlocks after song completes)'
                      }
                      aria-label="Song 2 - Ring Hover"
                    />

                    {/* Seamless Small Overlay Beside Ring (Song 2) */}
                    {showSong2Overlay && isSong2Completed && (
                      <div
                        id="ring-details-overlay"
                        className="absolute z-40 bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl rounded-xl p-4 w-72 max-w-[85vw] text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
                        style={{
                          right: `calc(${100 - ringCoords.left}% + 14px)`,
                          top: `${Math.max(6, Math.min(62, ringCoords.top - 4))}%`,
                        }}
                      >
                        {/* Pointer arrowhead towards the ring (pointing right) */}
                        <div className="absolute top-6 -right-1.5 w-3 h-3 bg-zinc-950 border-amber-500/50 transform rotate-45 pointer-events-none border-t border-r" />

                        {/* Close Button */}
                        <button
                          onClick={() => setShowSong2Overlay(false)}
                          className="absolute top-3 right-3 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                          title="Close"
                          aria-label="Close details"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* The 3 Specific User Details */}
                        <div className="space-y-3 text-xs pr-6">
                          {/* 1) Artist */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              1. Artist
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Phoebe Bridgers
                            </div>
                          </div>

                          {/* 2) Song Name */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              2. Song Name
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Waiting Room
                            </div>
                          </div>

                          {/* 3) Performance */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              3. Performance
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Live at KEXP, 2018
                            </div>
                          </div>
                        </div>

                        {/* Mini Replay Control */}
                        <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => {
                              playTrackAudio(1);
                            }}
                            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay Song</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Forget Me Not Hitbox (Song 3 Interactive Object)
                        Directly covering the "Song 3 - Forget Me Not Hover" section of the mapping.
                        Unlocks when Song 3 completes, or active during alignment mode.
                        Completely transparent so only the authentic hover image artwork renders without any artificial box highlights.
                        Clicking opens the details overlay (Seafret · Oceans · Vevo DSCVR, 2015). */}
                    <div
                      id="walkman-forget-hitbox"
                      className={`absolute transition-all duration-200 ${
                        isSong3Completed || isHoverMapVisible
                          ? 'cursor-pointer'
                          : 'cursor-default pointer-events-none opacity-0'
                      } ${
                        isHoverMapVisible ? 'border-2 border-dashed border-sky-400/90 bg-sky-400/15' : ''
                      }`}
                      style={{
                        left: `${forgetCoords.left}%`,
                        top: `${forgetCoords.top}%`,
                        width: `${forgetCoords.width}%`,
                        height: `${forgetCoords.height}%`,
                        borderRadius: '9999px',
                      }}
                      onMouseEnter={() => {
                        if (isSong3Completed || isHoverMapVisible) setHoveredZone('forget-me-not');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'forget-me-not') setHoveredZone(null);
                      }}
                      onClick={() => {
                        if (isSong3Completed) {
                          setShowSong3Overlay((prev) => !prev);
                          setShowDetailsOverlay(false);
                          setShowSong2Overlay(false);
                          setShowSong4Overlay(false);
                          setShowSong5Overlay(false);
                          setShowSong6Overlay(false);
                        }
                      }}
                      title={
                        isSong3Completed
                          ? 'Song 3 - Forget Me Not Hover (Click to view details)'
                          : isHoverMapVisible
                          ? 'Song 3 - Forget Me Not Hover (Mapping Guide Hitbox)'
                          : 'Song 3 - Forget Me Not Hover (Unlocks after song completes)'
                      }
                      aria-label="Song 3 - Forget Me Not Hover"
                    />

                    {/* Seamless Small Overlay Beside Forget Me Not (Song 3) */}
                    {showSong3Overlay && isSong3Completed && (
                      <div
                        id="forget-details-overlay"
                        className="absolute z-40 bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl rounded-xl p-4 w-72 max-w-[85vw] text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
                        style={{
                          left: forgetCoords.left > 50 ? undefined : `calc(${forgetCoords.left + forgetCoords.width}% + 14px)`,
                          right: forgetCoords.left > 50 ? `calc(${100 - forgetCoords.left}% + 14px)` : undefined,
                          top: `${Math.max(6, Math.min(62, forgetCoords.top - 4))}%`,
                        }}
                      >
                        {/* Pointer arrowhead towards the object */}
                        <div
                          className={`absolute top-6 w-3 h-3 bg-zinc-950 border-amber-500/50 transform rotate-45 pointer-events-none ${
                            forgetCoords.left > 50 ? '-right-1.5 border-t border-r' : '-left-1.5 border-b border-l'
                          }`}
                        />

                        {/* Close Button */}
                        <button
                          onClick={() => setShowSong3Overlay(false)}
                          className="absolute top-3 right-3 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                          title="Close"
                          aria-label="Close details"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* The 3 Specific User Details */}
                        <div className="space-y-3 text-xs pr-6">
                          {/* 1) Artist */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              1. Artist
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Seafret
                            </div>
                          </div>

                          {/* 2) Song Name */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              2. Song Name
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Oceans
                            </div>
                          </div>

                          {/* 3) Performance */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              3. Performance
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Vevo DSCVR, 2015
                            </div>
                          </div>
                        </div>

                        {/* Mini Replay Control */}
                        <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => {
                              playTrackAudio(2);
                            }}
                            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay Song</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Paper Crane Hitbox (Song 4 Interactive Object)
                        Directly covering the "Song 4 - Paper Crane Hover" section of the mapping.
                        Unlocks when Song 4 completes, or active during alignment mode.
                        Completely transparent so only the authentic hover image artwork renders without any artificial box highlights.
                        Clicking opens the details overlay (SYML · Where's My Love? · Live at Record Parlour, 2017). */}
                    <div
                      id="walkman-crane-hitbox"
                      className={`absolute transition-all duration-200 ${
                        isSong4Completed || isHoverMapVisible
                          ? 'cursor-pointer'
                          : 'cursor-default pointer-events-none opacity-0'
                      } ${
                        isHoverMapVisible ? 'border-2 border-dashed border-emerald-400/90 bg-emerald-400/15' : ''
                      }`}
                      style={{
                        left: `${craneCoords.left}%`,
                        top: `${craneCoords.top}%`,
                        width: `${craneCoords.width}%`,
                        height: `${craneCoords.height}%`,
                        borderRadius: '12px',
                      }}
                      onMouseEnter={() => {
                        if (isSong4Completed || isHoverMapVisible) setHoveredZone('paper-crane');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'paper-crane') setHoveredZone(null);
                      }}
                      onClick={() => {
                        if (isSong4Completed) {
                          setShowSong4Overlay((prev) => !prev);
                          setShowDetailsOverlay(false);
                          setShowSong2Overlay(false);
                          setShowSong3Overlay(false);
                          setShowSong5Overlay(false);
                          setShowSong6Overlay(false);
                        }
                      }}
                      title={
                        isSong4Completed
                          ? "Song 4 - Paper Crane Hover (Click to view details)"
                          : isHoverMapVisible
                          ? "Song 4 - Paper Crane Hover (Mapping Guide Hitbox)"
                          : "Song 4 - Paper Crane Hover (Unlocks after song completes)"
                      }
                      aria-label="Song 4 - Paper Crane Hover"
                    />

                    {/* Seamless Small Overlay Beside Paper Crane (Song 4) */}
                    {showSong4Overlay && isSong4Completed && (
                      <div
                        id="crane-details-overlay"
                        className="absolute z-40 bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl rounded-xl p-4 w-72 max-w-[85vw] text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
                        style={{
                          left: craneCoords.left > 50 ? undefined : `calc(${craneCoords.left + craneCoords.width}% + 14px)`,
                          right: craneCoords.left > 50 ? `calc(${100 - craneCoords.left}% + 14px)` : undefined,
                          top: `${Math.max(6, Math.min(62, craneCoords.top - 4))}%`,
                        }}
                      >
                        {/* Pointer arrowhead towards the object */}
                        <div
                          className={`absolute top-6 w-3 h-3 bg-zinc-950 border-amber-500/50 transform rotate-45 pointer-events-none ${
                            craneCoords.left > 50 ? '-right-1.5 border-t border-r' : '-left-1.5 border-b border-l'
                          }`}
                        />

                        {/* Close Button */}
                        <button
                          onClick={() => setShowSong4Overlay(false)}
                          className="absolute top-3 right-3 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                          title="Close"
                          aria-label="Close details"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* The 3 Specific User Details */}
                        <div className="space-y-3 text-xs pr-6">
                          {/* 1) Artist */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              1. Artist
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              SYML
                            </div>
                          </div>

                          {/* 2) Song Name */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              2. Song Name
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Where's My Love?
                            </div>
                          </div>

                          {/* 3) Performance */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              3. Performance
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Live at Record Parlour, 2017
                            </div>
                          </div>
                        </div>

                        {/* Mini Replay Control */}
                        <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => {
                              playTrackAudio(3);
                            }}
                            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay Song</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Cupcake Hitbox (Song 5 Interactive Object)
                        Directly covering the "Song 5 - Cupcake Hover" section of the mapping.
                        Unlocks when Song 5 completes, or active during alignment mode.
                        Completely transparent so only the authentic hover image artwork renders without any artificial box highlights.
                        Clicking opens the details overlay (Lewis Capaldi · Before You Go · Tiny Desk Concert at NPR, 2023). */}
                    <div
                      id="walkman-cupcake-hitbox"
                      className={`absolute transition-all duration-200 ${
                        isSong5Completed || isHoverMapVisible
                          ? 'cursor-pointer'
                          : 'cursor-default pointer-events-none opacity-0'
                      } ${
                        isHoverMapVisible ? 'border-2 border-dashed border-pink-400/90 bg-pink-400/15' : ''
                      }`}
                      style={{
                        left: `${cupcakeCoords.left}%`,
                        top: `${cupcakeCoords.top}%`,
                        width: `${cupcakeCoords.width}%`,
                        height: `${cupcakeCoords.height}%`,
                        borderRadius: '9999px',
                      }}
                      onMouseEnter={() => {
                        if (isSong5Completed || isHoverMapVisible) setHoveredZone('cupcake');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'cupcake') setHoveredZone(null);
                      }}
                      onClick={() => {
                        if (isSong5Completed) {
                          setShowSong5Overlay((prev) => !prev);
                          setShowDetailsOverlay(false);
                          setShowSong2Overlay(false);
                          setShowSong3Overlay(false);
                          setShowSong4Overlay(false);
                          setShowSong6Overlay(false);
                        }
                      }}
                      title={
                        isSong5Completed
                          ? "Song 5 - Cupcake Hover (Click to view details)"
                          : isHoverMapVisible
                          ? "Song 5 - Cupcake Hover (Mapping Guide Hitbox)"
                          : "Song 5 - Cupcake Hover (Unlocks after song completes)"
                      }
                      aria-label="Song 5 - Cupcake Hover"
                    />

                    {/* Seamless Small Overlay Beside Cupcake (Song 5) */}
                    {showSong5Overlay && isSong5Completed && (
                      <div
                        id="cupcake-details-overlay"
                        className="absolute z-40 bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl rounded-xl p-4 w-72 max-w-[85vw] text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
                        style={{
                          left: cupcakeCoords.left > 50 ? undefined : `calc(${cupcakeCoords.left + cupcakeCoords.width}% + 14px)`,
                          right: cupcakeCoords.left > 50 ? `calc(${100 - cupcakeCoords.left}% + 14px)` : undefined,
                          top: `${Math.max(6, Math.min(62, cupcakeCoords.top - 4))}%`,
                        }}
                      >
                        {/* Pointer arrowhead towards the object */}
                        <div
                          className={`absolute top-6 w-3 h-3 bg-zinc-950 border-amber-500/50 transform rotate-45 pointer-events-none ${
                            cupcakeCoords.left > 50 ? '-right-1.5 border-t border-r' : '-left-1.5 border-b border-l'
                          }`}
                        />

                        {/* Close Button */}
                        <button
                          onClick={() => setShowSong5Overlay(false)}
                          className="absolute top-3 right-3 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                          title="Close"
                          aria-label="Close details"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* The 3 Specific User Details */}
                        <div className="space-y-3 text-xs pr-6">
                          {/* 1) Artist */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              1. Artist
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Lewis Capaldi
                            </div>
                          </div>

                          {/* 2) Song Name */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              2. Song Name
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Before You Go
                            </div>
                          </div>

                          {/* 3) Performance */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              3. Performance
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Tiny Desk Concert at NPR, 2023
                            </div>
                          </div>
                        </div>

                        {/* Mini Replay Control */}
                        <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => {
                              playTrackAudio(4);
                            }}
                            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay Song</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Polaroid Hitbox (Song 6 Interactive Object)
                        Directly covering the "Song 6 - Polaroid Hover" section of the mapping.
                        Unlocks when Song 6 completes, or active during alignment mode.
                        Completely transparent so only the authentic hover image artwork renders without any artificial box highlights.
                        Clicking opens the details overlay (Phoebe Bridgers · Scott Street · Live at KEXP, 2018). */}
                    <div
                      id="walkman-polaroid-hitbox"
                      className={`absolute transition-all duration-200 ${
                        isSong6Completed || isHoverMapVisible
                          ? 'cursor-pointer'
                          : 'cursor-default pointer-events-none opacity-0'
                      } ${
                        isHoverMapVisible ? 'border-2 border-dashed border-indigo-400/90 bg-indigo-400/15' : ''
                      }`}
                      style={{
                        left: `${polaroidCoords.left}%`,
                        top: `${polaroidCoords.top}%`,
                        width: `${polaroidCoords.width}%`,
                        height: `${polaroidCoords.height}%`,
                        borderRadius: '8px',
                      }}
                      onMouseEnter={() => {
                        if (isSong6Completed || isHoverMapVisible) setHoveredZone('polaroid');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'polaroid') setHoveredZone(null);
                      }}
                      onClick={() => {
                        if (isSong6Completed) {
                          setShowSong6Overlay((prev) => !prev);
                          setShowDetailsOverlay(false);
                          setShowSong2Overlay(false);
                          setShowSong3Overlay(false);
                          setShowSong4Overlay(false);
                          setShowSong5Overlay(false);
                        }
                      }}
                      title={
                        isSong6Completed
                          ? "Song 6 - Polaroid Hover (Click to view details)"
                          : isHoverMapVisible
                          ? "Song 6 - Polaroid Hover (Mapping Guide Hitbox)"
                          : "Song 6 - Polaroid Hover (Unlocks after song completes)"
                      }
                      aria-label="Song 6 - Polaroid Hover"
                    />

                    {/* Seamless Small Overlay Beside Polaroid (Song 6) */}
                    {showSong6Overlay && isSong6Completed && (
                      <div
                        id="polaroid-details-overlay"
                        className="absolute z-40 bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl rounded-xl p-4 w-72 max-w-[85vw] text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
                        style={{
                          left: polaroidCoords.left > 50 ? undefined : `calc(${polaroidCoords.left + polaroidCoords.width}% + 14px)`,
                          right: polaroidCoords.left > 50 ? `calc(${100 - polaroidCoords.left}% + 14px)` : undefined,
                          top: `${Math.max(6, Math.min(62, polaroidCoords.top - 4))}%`,
                        }}
                      >
                        {/* Pointer arrowhead towards the object */}
                        <div
                          className={`absolute top-6 w-3 h-3 bg-zinc-950 border-amber-500/50 transform rotate-45 pointer-events-none ${
                            polaroidCoords.left > 50 ? '-right-1.5 border-t border-r' : '-left-1.5 border-b border-l'
                          }`}
                        />

                        {/* Close Button */}
                        <button
                          onClick={() => setShowSong6Overlay(false)}
                          className="absolute top-3 right-3 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                          title="Close"
                          aria-label="Close details"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* The 3 Specific User Details */}
                        <div className="space-y-3 text-xs pr-6">
                          {/* 1) Artist */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              1. Artist
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Phoebe Bridgers
                            </div>
                          </div>

                          {/* 2) Song Name */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              2. Song Name
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Scott Street
                            </div>
                          </div>

                          {/* 3) Performance */}
                          <div>
                            <span className="block text-[10px] uppercase font-semibold tracking-wider text-amber-400/80 mb-0.5">
                              3. Performance
                            </span>
                            <div className="text-zinc-100 font-medium text-sm">
                              Live at KEXP, 2018
                            </div>
                          </div>
                        </div>

                        {/* Mini Replay Control */}
                        <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => {
                              playTrackAudio(5);
                            }}
                            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay Song</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Complete Tracklist Hitbox (Song 7 Interactive Object)
                        Directly covering the "Song 7 - Complete Tracklist Hover" section of the mapping.
                        Unlocks when Song 7 completes, or active during alignment mode.
                        Completely transparent so only the authentic hover image artwork renders without any artificial box highlights.
                        Clicking displays the "Side A Tracklist" overlay above the hitbox. */}
                    <div
                      id="walkman-tracklist-hitbox"
                      className={`absolute transition-all duration-200 ${
                        isSong7Completed || isHoverMapVisible
                          ? 'cursor-pointer'
                          : 'cursor-default pointer-events-none opacity-0'
                      } ${
                        isHoverMapVisible ? 'border-2 border-dashed border-amber-400/90 bg-amber-400/15' : ''
                      }`}
                      style={{
                        left: `${tracklistCoords.left}%`,
                        top: `${tracklistCoords.top}%`,
                        width: `${tracklistCoords.width}%`,
                        height: `${tracklistCoords.height}%`,
                        borderRadius: '12px',
                      }}
                      onMouseEnter={() => {
                        if (isSong7Completed || isHoverMapVisible) setHoveredZone('tracklist');
                      }}
                      onMouseLeave={() => {
                        if (hoveredZone === 'tracklist') setHoveredZone(null);
                      }}
                      onClick={() => {
                        if (isSong7Completed) {
                          setShowSong7Overlay((prev) => !prev);
                          setShowDetailsOverlay(false);
                          setShowSong2Overlay(false);
                          setShowSong3Overlay(false);
                          setShowSong4Overlay(false);
                          setShowSong5Overlay(false);
                          setShowSong6Overlay(false);
                        }
                      }}
                      title={
                        isSong7Completed
                          ? "Song 7 - Complete Tracklist Hover (Click to view Side A Tracklist)"
                          : isHoverMapVisible
                          ? "Song 7 - Complete Tracklist Hover (Mapping Guide Hitbox)"
                          : "Song 7 - Complete Tracklist Hover (Unlocks after song completes)"
                      }
                      aria-label="Song 7 - Complete Tracklist Hover"
                    />

                    {/* Side A Tracklist Overlay - displays above the hitbox in a compact two-column layout */}
                    {showSong7Overlay && isSong7Completed && (
                      <div
                        id="side-a-tracklist-overlay"
                        className="absolute z-40 bg-zinc-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl rounded-xl p-3 sm:p-3.5 w-[96%] sm:w-[620px] md:w-[680px] lg:w-[720px] max-w-[96vw] text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto flex flex-col"
                        style={{
                          left: '50%',
                          transform: 'translateX(-50%)',
                          ...(tracklistCoords.top >= 26
                            ? {
                                bottom: `calc(${100 - tracklistCoords.top}% + 8px)`,
                                maxHeight: `calc(${tracklistCoords.top}% - 10px)`,
                              }
                            : { top: '3%', maxHeight: '88vh' }),
                        }}
                      >
                        {/* Downward pointer arrowhead towards the cassette hitbox when positioned above */}
                        {tracklistCoords.top >= 26 && (
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-950 border-r border-b border-amber-500/50 transform rotate-45 pointer-events-none" />
                        )}

                        {/* Header with Title and Close Button */}
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-2 shrink-0">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                              <Music className="w-3 h-3" />
                            </div>
                            <h4 className="text-xs sm:text-sm font-serif font-bold text-amber-300 tracking-wide">
                              Side A Tracklist
                            </h4>
                          </div>
                          <button
                            onClick={() => setShowSong7Overlay(false)}
                            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
                            title="Close Tracklist"
                            aria-label="Close Side A Tracklist"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* List of 7 Songs arranged into 2 Columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-1 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                          {/* Column 1: Tracks 1 to 4 */}
                          <div className="space-y-1">
                            {SIDE_A_TRACKLIST.slice(0, 4).map((song, idx) => {
                              const trackIdx = idx;
                              const isCurrentPlaying = currentTrackIndex === trackIdx && isWalkmanPlaying;
                              return (
                                <div
                                  key={trackIdx}
                                  className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg text-xs transition-colors ${
                                    isCurrentPlaying
                                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                                      : 'hover:bg-zinc-900/90 border border-transparent text-zinc-300'
                                  }`}
                                >
                                  <div className="flex items-start space-x-2 min-w-0 pr-1.5">
                                    <span className="font-mono text-amber-400 font-bold shrink-0 text-xs mt-0.5">
                                      {song.number} -
                                    </span>
                                    <div className="min-w-0 leading-snug">
                                      <span className="font-medium text-zinc-100 text-xs">
                                        {song.title}
                                      </span>{' '}
                                      <span className="text-zinc-400 text-[10.5px] font-normal">
                                        ({song.performance})
                                      </span>{' '}
                                      <span className="text-zinc-400 text-xs">-</span>{' '}
                                      <span className="text-amber-300/90 font-medium text-xs">
                                        {song.artist}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => playTrackAudio(trackIdx)}
                                    className={`shrink-0 p-1.5 rounded-md transition-colors ${
                                      isCurrentPlaying
                                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                                        : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/20'
                                    }`}
                                    title={`Play ${song.title} by ${song.artist}`}
                                    aria-label={`Play Track ${song.number}`}
                                  >
                                    {isCurrentPlaying ? (
                                      <div className="flex items-end space-x-0.5 h-3 w-3 px-0.5">
                                        <span className="w-0.5 bg-zinc-950 animate-pulse h-full" />
                                        <span className="w-0.5 bg-zinc-950 animate-pulse h-2" />
                                        <span className="w-0.5 bg-zinc-950 animate-pulse h-full" />
                                      </div>
                                    ) : (
                                      <Play className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          {/* Column 2: Tracks 5 to 7 */}
                          <div className="space-y-1">
                            {SIDE_A_TRACKLIST.slice(4).map((song, idx) => {
                              const trackIdx = idx + 4;
                              const isCurrentPlaying = currentTrackIndex === trackIdx && isWalkmanPlaying;
                              return (
                                <div
                                  key={trackIdx}
                                  className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg text-xs transition-colors ${
                                    isCurrentPlaying
                                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                                      : 'hover:bg-zinc-900/90 border border-transparent text-zinc-300'
                                  }`}
                                >
                                  <div className="flex items-start space-x-2 min-w-0 pr-1.5">
                                    <span className="font-mono text-amber-400 font-bold shrink-0 text-xs mt-0.5">
                                      {song.number} -
                                    </span>
                                    <div className="min-w-0 leading-snug">
                                      <span className="font-medium text-zinc-100 text-xs">
                                        {song.title}
                                      </span>{' '}
                                      <span className="text-zinc-400 text-[10.5px] font-normal">
                                        ({song.performance})
                                      </span>{' '}
                                      <span className="text-zinc-400 text-xs">-</span>{' '}
                                      <span className="text-amber-300/90 font-medium text-xs">
                                        {song.artist}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => playTrackAudio(trackIdx)}
                                    className={`shrink-0 p-1.5 rounded-md transition-colors ${
                                      isCurrentPlaying
                                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                                        : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/20'
                                    }`}
                                    title={`Play ${song.title} by ${song.artist}`}
                                    aria-label={`Play Track ${song.number}`}
                                  >
                                    {isCurrentPlaying ? (
                                      <div className="flex items-end space-x-0.5 h-3 w-3 px-0.5">
                                        <span className="w-0.5 bg-zinc-950 animate-pulse h-full" />
                                        <span className="w-0.5 bg-zinc-950 animate-pulse h-2" />
                                        <span className="w-0.5 bg-zinc-950 animate-pulse h-full" />
                                      </div>
                                    ) : (
                                      <Play className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Replay Full Side A button */}
                        <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] shrink-0">
                          <span className="text-zinc-500 font-mono">Side A • 7 Tracks</span>
                          <button
                            onClick={() => {
                              playTrackAudio(0);
                            }}
                            className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay Side A (Track 1)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Placeholder if user hasn't uploaded the landing image yet */
                <div
                  className="w-full aspect-[16/10] max-h-[70vh] rounded-xl border-2 border-dashed border-zinc-800 hover:border-amber-500/50 bg-zinc-900/40 p-8 flex flex-col items-center justify-center text-center space-y-4 transition-colors cursor-pointer"
                  onClick={() => triggerUpload('landing')}
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Music className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-serif font-bold text-zinc-200">
                      Music Player Static Landing Image
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Click here or drag & drop your images to attach the Walkman static landing image and hovers.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerUpload('landing');
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-xs flex items-center space-x-2 transition-colors shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Landing Image</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center space-x-2">
            {hasPrevious && onSelectPrevious && (
              <button
                onClick={onSelectPrevious}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Panel 7</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {hasNext && onSelectNext && (
              <button
                onClick={onSelectNext}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
              >
                <span>Panel 9</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox for Landing Image Zoom */}
      {isExpanded && landingImageSrc && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsExpanded(false)}
        >
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/90 text-white hover:bg-zinc-700 transition-colors z-70"
            title="Close Zoom (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={landingImageSrc}
            alt="Music Player Full View"
            className="max-h-[95vh] max-w-[95vw] object-contain drop-shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
