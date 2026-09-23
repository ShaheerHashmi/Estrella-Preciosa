export interface PanelRegion {
  id: number;
  name: string;
  tier: 'lower' | 'upper' | 'tracery';
  type: 'rect' | 'circle';
  // Coordinate space: 891 x 2000 (matching Mapping.png and Background.png)
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  r?: number;
  imageSrc: string;
}

// Coordinate mapping derived directly from Mapping.png (891 x 2000)
// Hover hit areas strictly match the red areas
export const PANEL_REGIONS: PanelRegion[] = [
  // --- LOWER TIER: PANELS 1 - 5 (Red Rectangles) ---
  {
    id: 1,
    name: 'Panel 1',
    tier: 'lower',
    type: 'rect',
    x: 32,
    y: 1435,
    width: 120,
    height: 535,
    imageSrc: '/1 - Hover.png',
  },
  {
    id: 2,
    name: 'Panel 2',
    tier: 'lower',
    type: 'rect',
    x: 210,
    y: 1435,
    width: 120,
    height: 535,
    imageSrc: '/2 - Hover.png',
  },
  {
    id: 3,
    name: 'Panel 3',
    tier: 'lower',
    type: 'rect',
    x: 390,
    y: 1435,
    width: 118,
    height: 535,
    imageSrc: '/3 - Hover.png',
  },
  {
    id: 4,
    name: 'Panel 4',
    tier: 'lower',
    type: 'rect',
    x: 568,
    y: 1435,
    width: 118,
    height: 535,
    imageSrc: '/4 - Hover.png',
  },
  {
    id: 5,
    name: 'Panel 5',
    tier: 'lower',
    type: 'rect',
    x: 742,
    y: 1435,
    width: 118,
    height: 535,
    imageSrc: '/5 - Hover.png',
  },

  // --- UPPER TIER: PANELS 6 - 10 (Red Rectangles) ---
  {
    id: 6,
    name: 'Panel 6',
    tier: 'upper',
    type: 'rect',
    x: 32,
    y: 780,
    width: 120,
    height: 520,
    imageSrc: '/6 - Hover.png',
  },
  {
    id: 7,
    name: 'Panel 7',
    tier: 'upper',
    type: 'rect',
    x: 210,
    y: 780,
    width: 120,
    height: 520,
    imageSrc: '/7 - Hover.png',
  },
  {
    id: 8,
    name: 'Panel 8',
    tier: 'upper',
    type: 'rect',
    x: 390,
    y: 780,
    width: 118,
    height: 520,
    imageSrc: '/8 - Hover.png',
  },
  {
    id: 9,
    name: 'Panel 9',
    tier: 'upper',
    type: 'rect',
    x: 568,
    y: 780,
    width: 118,
    height: 520,
    imageSrc: '/9 - Hover.png',
  },
  {
    id: 10,
    name: 'Panel 10',
    tier: 'upper',
    type: 'rect',
    x: 742,
    y: 780,
    width: 118,
    height: 520,
    imageSrc: '/10 - Hover.png',
  },

  // --- TRACERY TIER: ROW 1 (PANELS 11 - 14 - Red Circles) ---
  {
    id: 11,
    name: 'Panel 11',
    tier: 'tracery',
    type: 'circle',
    cx: 142,
    cy: 580,
    r: 55,
    imageSrc: '/11 - Hover.png',
  },
  {
    id: 12,
    name: 'Panel 12',
    tier: 'tracery',
    type: 'circle',
    cx: 356,
    cy: 580,
    r: 59,
    imageSrc: '/12 - Hover.png',
  },
  {
    id: 13,
    name: 'Panel 13',
    tier: 'tracery',
    type: 'circle',
    cx: 535,
    cy: 580,
    r: 59,
    imageSrc: '/13 - Hover.png',
  },
  {
    id: 14,
    name: 'Panel 14',
    tier: 'tracery',
    type: 'circle',
    cx: 750,
    cy: 580,
    r: 55,
    imageSrc: '/14 - Hover.png',
  },

  // --- TRACERY TIER: ROW 2 (PANELS 15 - 18 - Red Circles) ---
  {
    id: 15,
    name: 'Panel 15',
    tier: 'tracery',
    type: 'circle',
    cx: 200,
    cy: 426,
    r: 52,
    imageSrc: '/15 - Hover.png',
  },
  {
    id: 16,
    name: 'Panel 16',
    tier: 'tracery',
    type: 'circle',
    cx: 382,
    cy: 396,
    r: 42,
    imageSrc: '/16 - Hover.png',
  },
  {
    id: 17,
    name: 'Panel 17',
    tier: 'tracery',
    type: 'circle',
    cx: 509,
    cy: 396,
    r: 42,
    imageSrc: '/17 - Hover.png',
  },
  {
    id: 18,
    name: 'Panel 18',
    tier: 'tracery',
    type: 'circle',
    cx: 691,
    cy: 426,
    r: 52,
    imageSrc: '/18 - Hover.png',
  },

  // --- TRACERY TIER: ROW 3 (PANELS 19 - 20 - Red Circles) ---
  {
    id: 19,
    name: 'Panel 19',
    tier: 'tracery',
    type: 'circle',
    cx: 286,
    cy: 240,
    r: 45,
    imageSrc: '/19 - Hover.png',
  },
  {
    id: 20,
    name: 'Panel 20',
    tier: 'tracery',
    type: 'circle',
    cx: 605,
    cy: 240,
    r: 45,
    imageSrc: '/20 - Hover.png',
  },

  // --- TRACERY TIER: APEX (PANEL 21 - Red Circle) ---
  {
    id: 21,
    name: 'Panel 21',
    tier: 'tracery',
    type: 'circle',
    cx: 445,
    cy: 158,
    r: 52,
    imageSrc: '/21 - Hover.png',
  },
];
