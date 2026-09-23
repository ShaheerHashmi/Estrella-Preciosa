export type WindowStyle = 'st_giles' | 'gothic_rose' | 'cathedral_lancet' | 'tiffany_mosaic';

export interface PanelGift {
  panelId: number;
  title: string;
  origin: string;
  story: string;
  imageSrc?: string;
  images?: string[];
  dateOrDay?: string;
  category?: string;
}

export interface PanelMotif {
  id: number;
  romanNumeral: string;
  name: string;
  symbol: string;
  dominantColor: string;
  secondaryColor: string;
  accentColor: string;
  gemstone: string;
  giftTitle: string;
  giftSubtitle: string;
  giftStory: string;
  giftClue: string;
  milestoneNote?: string;
}

export interface WindowOptionMeta {
  id: WindowStyle;
  title: string;
  subtitle: string;
  description: string;
  era: string;
}

export interface AlbumSong {
  id: number;
  songName: string;
  artist: string;
  performance: string;
  objectName: string;
  audioSrc?: string;
  hoverSrc?: string;
}

