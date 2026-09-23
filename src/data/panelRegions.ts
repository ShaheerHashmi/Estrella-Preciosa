export interface PanelRegion {
  id: number;
  name: string;
  tier: 'lower' | 'upper' | 'tracery';
  type: 'rect' | 'circle';
  // Coordinate space: 891 x 2000 (matching 891x2000 stained glass window assets)
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  r?: number;
  imageSrc: string;
}

// Coordinate mapping calibrated precisely to 891 x 2000 stained glass window
export const PANEL_REGIONS: PanelRegion[] = [
  // --- LOWER TIER: PANELS 1 - 5 (Vertical Lancets) ---
  {
    id: 1,
    name: 'Panel 1',
    tier: 'lower',
    type: 'rect',
    x: 8,
    y: 1329,
    width: 165,
    height: 643,
    imageSrc: '/1 - Hover.png',
  },
  {
    id: 2,
    name: 'Panel 2',
    tier: 'lower',
    type: 'rect',
    x: 184,
    y: 1329,
    width: 179,
    height: 642,
    imageSrc: '/2 - Hover.png',
  },
  {
    id: 3,
    name: 'Panel 3',
    tier: 'lower',
    type: 'rect',
    x: 363,
    y: 1330,
    width: 177,
    height: 642,
    imageSrc: '/3 - Hover.png',
  },
  {
    id: 4,
    name: 'Panel 4',
    tier: 'lower',
    type: 'rect',
    x: 540,
    y: 1331,
    width: 171,
    height: 641,
    imageSrc: '/4 - Hover.png',
  },
  {
    id: 5,
    name: 'Panel 5',
    tier: 'lower',
    type: 'rect',
    x: 720,
    y: 1334,
    width: 168,
    height: 638,
    imageSrc: '/5 - Hover.png',
  },

  // --- UPPER TIER: PANELS 6 - 10 (Vertical Lancets) ---
  {
    id: 6,
    name: 'Panel 6',
    tier: 'upper',
    type: 'rect',
    x: 16,
    y: 647,
    width: 155,
    height: 675,
    imageSrc: '/6 - Hover.png',
  },
  {
    id: 7,
    name: 'Panel 7',
    tier: 'upper',
    type: 'rect',
    x: 194,
    y: 647,
    width: 154,
    height: 678,
    imageSrc: '/7 - Hover.png',
  },
  {
    id: 8,
    name: 'Panel 8',
    tier: 'upper',
    type: 'rect',
    x: 365,
    y: 647,
    width: 165,
    height: 678,
    imageSrc: '/8 - Hover.png',
  },
  {
    id: 9,
    name: 'Panel 9',
    tier: 'upper',
    type: 'rect',
    x: 547,
    y: 649,
    width: 154,
    height: 675,
    imageSrc: '/9 - Hover.png',
  },
  {
    id: 10,
    name: 'Panel 10',
    tier: 'upper',
    type: 'rect',
    x: 726,
    y: 654,
    width: 151,
    height: 671,
    imageSrc: '/10 - Hover.png',
  },

  // --- TRACERY TIER: ROW 1 (PANELS 11 - 14) ---
  {
    id: 11,
    name: 'Panel 11',
    tier: 'tracery',
    type: 'circle',
    cx: 141,
    cy: 579,
    r: 80,
    imageSrc: '/11 - Hover.png',
  },
  {
    id: 12,
    name: 'Panel 12',
    tier: 'tracery',
    type: 'circle',
    cx: 360,
    cy: 577,
    r: 75,
    imageSrc: '/12 - Hover.png',
  },
  {
    id: 13,
    name: 'Panel 13',
    tier: 'tracery',
    type: 'circle',
    cx: 536,
    cy: 587,
    r: 75,
    imageSrc: '/13 - Hover.png',
  },
  {
    id: 14,
    name: 'Panel 14',
    tier: 'tracery',
    type: 'circle',
    cx: 755,
    cy: 582,
    r: 80,
    imageSrc: '/14 - Hover.png',
  },

  // --- TRACERY TIER: ROW 2 (PANELS 15 - 18) ---
  {
    id: 15,
    name: 'Panel 15',
    tier: 'tracery',
    type: 'circle',
    cx: 184,
    cy: 408,
    r: 72,
    imageSrc: '/15 - Hover.png',
  },
  {
    id: 16,
    name: 'Panel 16',
    tier: 'tracery',
    type: 'circle',
    cx: 348,
    cy: 355,
    r: 60,
    imageSrc: '/16 - Hover.png',
  },
  {
    id: 17,
    name: 'Panel 17',
    tier: 'tracery',
    type: 'circle',
    cx: 496,
    cy: 356,
    r: 60,
    imageSrc: '/17 - Hover.png',
  },
  {
    id: 18,
    name: 'Panel 18',
    tier: 'tracery',
    type: 'circle',
    cx: 709,
    cy: 408,
    r: 72,
    imageSrc: '/18 - Hover.png',
  },

  // --- TRACERY TIER: ROW 3 (PANELS 19 - 20) ---
  {
    id: 19,
    name: 'Panel 19',
    tier: 'tracery',
    type: 'circle',
    cx: 284,
    cy: 228,
    r: 72,
    imageSrc: '/19 - Hover.png',
  },
  {
    id: 20,
    name: 'Panel 20',
    tier: 'tracery',
    type: 'circle',
    cx: 613,
    cy: 231,
    r: 72,
    imageSrc: '/20 - Hover.png',
  },

  // --- TRACERY TIER: APEX (PANEL 21) ---
  {
    id: 21,
    name: 'Panel 21',
    tier: 'tracery',
    type: 'circle',
    cx: 447,
    cy: 157,
    r: 85,
    imageSrc: '/21 - Hover.png',
  },
];
