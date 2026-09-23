/**
 * Immutable configuration for the 21 Stained Glass Window hover cutouts
 * and progressive milestone unlock states.
 * 
 * Ensures hover overlays and unlock states stay permanently fixed and identical
 * to their calibrated assets.
 */

export interface PanelHoverDefinition {
  id: number;
  name: string;
  defaultSrc: string;
  keys: string[];
}

export const HARDCODED_PANEL_HOVERS: Record<number, PanelHoverDefinition> = {
  1: {
    id: 1,
    name: 'Panel 1',
    defaultSrc: '/1 - Hover.png',
    keys: ['hover_1', 'hover-1', 'hover 1', 'hover1', '1_hover', '1-hover', '1 - hover', '1 - hover.png', '1-hover.png', '1_hover.png', 'panel-1-hover', 'panel_1_hover', '1'],
  },
  2: {
    id: 2,
    name: 'Panel 2',
    defaultSrc: '/2 - Hover.png',
    keys: ['hover_2', 'hover-2', 'hover 2', 'hover2', '2_hover', '2-hover', '2 - hover', '2 - hover.png', '2-hover.png', '2_hover.png', 'panel-2-hover', 'panel_2_hover', '2'],
  },
  3: {
    id: 3,
    name: 'Panel 3',
    defaultSrc: '/3 - Hover.png',
    keys: ['hover_3', 'hover-3', 'hover 3', 'hover3', '3_hover', '3-hover', '3 - hover', '3 - hover.png', '3-hover.png', '3_hover.png', 'panel-3-hover', 'panel_3_hover', '3'],
  },
  4: {
    id: 4,
    name: 'Panel 4',
    defaultSrc: '/4 - Hover.png',
    keys: ['hover_4', 'hover-4', 'hover 4', 'hover4', '4_hover', '4-hover', '4 - hover', '4 - hover.png', '4-hover.png', '4_hover.png', 'panel-4-hover', 'panel_4_hover', '4'],
  },
  5: {
    id: 5,
    name: 'Panel 5',
    defaultSrc: '/5 - Hover.png',
    keys: ['hover_5', 'hover-5', 'hover 5', 'hover5', '5_hover', '5-hover', '5 - hover', '5 - hover.png', '5-hover.png', '5_hover.png', 'panel-5-hover', 'panel_5_hover', '5'],
  },
  6: {
    id: 6,
    name: 'Panel 6',
    defaultSrc: '/6 - Hover.png',
    keys: ['hover_6', 'hover-6', 'hover 6', 'hover6', '6_hover', '6-hover', '6 - hover', '6 - hover.png', '6-hover.png', '6_hover.png', 'panel-6-hover', 'panel_6_hover', '6'],
  },
  7: {
    id: 7,
    name: 'Panel 7',
    defaultSrc: '/7 - Hover.png',
    keys: ['hover_7', 'hover-7', 'hover 7', 'hover7', '7_hover', '7-hover', '7 - hover', '7 - hover.png', '7-hover.png', '7_hover.png', 'panel-7-hover', 'panel_7_hover', '7'],
  },
  8: {
    id: 8,
    name: 'Panel 8',
    defaultSrc: '/8 - Hover.png',
    // Strictly isolate Panel 8 window hover cutout from the music landing screen
    keys: ['hover_8', 'hover-8', 'hover 8', 'hover8', '8_hover', '8-hover', '8 - hover', '8 - hover.png', '8-hover.png', '8_hover.png', 'panel-8-hover', 'panel_8_hover'],
  },
  9: {
    id: 9,
    name: 'Panel 9',
    defaultSrc: '/9 - Hover.png',
    keys: ['hover_9', 'hover-9', 'hover 9', 'hover9', '9_hover', '9-hover', '9 - hover', '9 - hover.png', '9-hover.png', '9_hover.png', 'panel-9-hover', 'panel_9_hover', '9'],
  },
  10: {
    id: 10,
    name: 'Panel 10',
    defaultSrc: '/10 - Hover.png',
    keys: ['hover_10', 'hover-10', 'hover 10', 'hover10', '10_hover', '10-hover', '10 - hover', '10 - hover.png', '10-hover.png', '10_hover.png', 'panel-10-hover', 'panel_10_hover', '10'],
  },
  11: {
    id: 11,
    name: 'Panel 11',
    defaultSrc: '/11 - Hover.png',
    keys: ['hover_11', 'hover-11', 'hover 11', 'hover11', '11_hover', '11-hover', '11 - hover', '11 - hover.png', '11-hover.png', '11_hover.png', 'panel-11-hover', 'panel_11_hover', '11'],
  },
  12: {
    id: 12,
    name: 'Panel 12',
    defaultSrc: '/12 - Hover.png',
    keys: ['hover_12', 'hover-12', 'hover 12', 'hover12', '12_hover', '12-hover', '12 - hover', '12 - hover.png', '12-hover.png', '12_hover.png', 'panel-12-hover', 'panel_12_hover', '12'],
  },
  13: {
    id: 13,
    name: 'Panel 13',
    defaultSrc: '/13 - Hover.png',
    keys: ['hover_13', 'hover-13', 'hover 13', 'hover13', '13_hover', '13-hover', '13 - hover', '13 - hover.png', '13-hover.png', '13_hover.png', 'panel-13-hover', 'panel_13_hover', '13'],
  },
  14: {
    id: 14,
    name: 'Panel 14',
    defaultSrc: '/14 - Hover.png',
    keys: ['hover_14', 'hover-14', 'hover 14', 'hover14', '14_hover', '14-hover', '14 - hover', '14 - hover.png', '14-hover.png', '14_hover.png', 'panel-14-hover', 'panel_14_hover', '14'],
  },
  15: {
    id: 15,
    name: 'Panel 15',
    defaultSrc: '/15 - Hover.png',
    keys: ['hover_15', 'hover-15', 'hover 15', 'hover15', '15_hover', '15-hover', '15 - hover', '15 - hover.png', '15-hover.png', '15_hover.png', 'panel-15-hover', 'panel_15_hover', '15'],
  },
  16: {
    id: 16,
    name: 'Panel 16',
    defaultSrc: '/16 - Hover.png',
    keys: ['hover_16', 'hover-16', 'hover 16', 'hover16', '16_hover', '16-hover', '16 - hover', '16 - hover.png', '16-hover.png', '16_hover.png', 'panel-16-hover', 'panel_16_hover', '16'],
  },
  17: {
    id: 17,
    name: 'Panel 17',
    defaultSrc: '/17 - Hover.png',
    keys: ['hover_17', 'hover-17', 'hover 17', 'hover17', '17_hover', '17-hover', '17 - hover', '17 - hover.png', '17-hover.png', '17_hover.png', 'panel-17-hover', 'panel_17_hover', '17'],
  },
  18: {
    id: 18,
    name: 'Panel 18',
    defaultSrc: '/18 - Hover.png',
    keys: ['hover_18', 'hover-18', 'hover 18', 'hover18', '18_hover', '18-hover', '18 - hover', '18 - hover.png', '18-hover.png', '18_hover.png', 'panel-18-hover', 'panel_18_hover', '18'],
  },
  19: {
    id: 19,
    name: 'Panel 19',
    defaultSrc: '/19 - Hover.png',
    keys: ['hover_19', 'hover-19', 'hover 19', 'hover19', '19_hover', '19-hover', '19 - hover', '19 - hover.png', '19-hover.png', '19_hover.png', 'panel-19-hover', 'panel_19_hover', '19'],
  },
  20: {
    id: 20,
    name: 'Panel 20',
    defaultSrc: '/20 - Hover.png',
    keys: ['hover_20', 'hover-20', 'hover 20', 'hover20', '20_hover', '20-hover', '20 - hover', '20 - hover.png', '20-hover.png', '20_hover.png', 'panel-20-hover', 'panel_20_hover', '20'],
  },
  21: {
    id: 21,
    name: 'Panel 21',
    defaultSrc: '/21 - Hover.png',
    keys: ['hover_21', 'hover-21', 'hover 21', 'hover21', '21_hover', '21-hover', '21 - hover', '21 - hover.png', '21-hover.png', '21_hover.png', 'panel-21-hover', 'panel_21_hover', '21'],
  },
};

export interface UnlockProgressDefinition {
  milestone: number;
  defaultSrc: string;
  keys: string[];
}

export const HARDCODED_UNLOCK_PROGRESS_STATES: Record<number, UnlockProgressDefinition> = {
  0: {
    milestone: 0,
    defaultSrc: '/Background.png',
    keys: ['background', 'Background.png', 'background.png', 'bg', 'monochrome', 'progress_0', 'progress0', 'progress-0'],
  },
  1: {
    milestone: 1,
    defaultSrc: '/progress_1.png',
    keys: ['progress_1', 'progress-1', 'progress 1', 'progress1', 'tier_1', 'step_1'],
  },
  2: {
    milestone: 2,
    defaultSrc: '/progress_2.png',
    keys: ['progress_2', 'progress-2', 'progress 2', 'progress2', 'tier_2', 'step_2'],
  },
  3: {
    milestone: 3,
    defaultSrc: '/progress_3.png',
    keys: ['progress_3', 'progress-3', 'progress 3', 'progress3', 'tier_3', 'step_3'],
  },
  4: {
    milestone: 4,
    defaultSrc: '/progress_4.png',
    keys: ['progress_4', 'progress-4', 'progress 4', 'progress4', 'tier_4', 'step_4'],
  },
  5: {
    milestone: 5,
    defaultSrc: '/progress_5.png',
    keys: ['progress_5', 'progress-5', 'progress 5', 'progress5', 'tier_5', 'step_5'],
  },
  6: {
    milestone: 6,
    defaultSrc: '/progress_6.png',
    keys: ['progress_6', 'progress-6', 'progress 6', 'progress6', 'tier_6', 'step_6'],
  },
  7: {
    milestone: 7,
    defaultSrc: '/progress_7.png',
    keys: ['progress_7', 'progress-7', 'progress 7', 'progress7', 'tier_7', 'step_7'],
  },
  8: {
    milestone: 8,
    defaultSrc: '/progress_8.png',
    keys: ['progress_8', 'progress-8', 'progress 8', 'progress8', 'tier_8', 'step_8'],
  },
  9: {
    milestone: 9,
    defaultSrc: '/progress_9.png',
    keys: ['progress_9', 'progress-9', 'progress 9', 'progress9', 'tier_9', 'step_9'],
  },
  10: {
    milestone: 10,
    defaultSrc: '/progress_10.png',
    keys: ['progress_10', 'progress-10', 'progress 10', 'progress10', 'tier_10', 'step_10'],
  },
  11: {
    milestone: 11,
    defaultSrc: '/progress_11.png',
    keys: ['progress_11', 'progress-11', 'progress 11', 'progress11', 'tier_11', 'step_11'],
  },
  12: {
    milestone: 12,
    defaultSrc: '/progress_12.png',
    keys: ['progress_12', 'progress-12', 'progress 12', 'progress12', 'tier_12', 'step_12'],
  },
  13: {
    milestone: 13,
    defaultSrc: '/progress_13.png',
    keys: ['progress_13', 'progress-13', 'progress 13', 'progress13', 'tier_13', 'step_13'],
  },
  14: {
    milestone: 14,
    defaultSrc: '/progress_14.png',
    keys: ['progress_14', 'progress-14', 'progress 14', 'progress14', 'tier_14', 'step_14'],
  },
  15: {
    milestone: 15,
    defaultSrc: '/progress_15.png',
    keys: ['progress_15', 'progress-15', 'progress 15', 'progress15', 'tier_15', 'step_15'],
  },
  16: {
    milestone: 16,
    defaultSrc: '/progress_16.png',
    keys: ['progress_16', 'progress-16', 'progress 16', 'progress16', 'tier_16', 'step_16'],
  },
  17: {
    milestone: 17,
    defaultSrc: '/progress_17.png',
    keys: ['progress_17', 'progress-17', 'progress 17', 'progress17', 'tier_17', 'step_17'],
  },
  18: {
    milestone: 18,
    defaultSrc: '/progress_18.png',
    keys: ['progress_18', 'progress-18', 'progress 18', 'progress18', 'tier_18', 'step_18'],
  },
  19: {
    milestone: 19,
    defaultSrc: '/progress_19.png',
    keys: ['progress_19', 'progress-19', 'progress 19', 'progress19', 'tier_19', 'step_19'],
  },
  20: {
    milestone: 20,
    defaultSrc: '/progress_20.png',
    keys: ['progress_20', 'progress-20', 'progress 20', 'progress20', 'tier_20', 'step_20'],
  },
  21: {
    milestone: 21,
    defaultSrc: '/progress_21.png',
    keys: ['progress_21', 'progress-21', 'progress 21', 'progress21', 'tier_21', 'step_21'],
  },
};

/**
 * Resolves the stained glass cutout overlay image for a panel.
 * Guaranteed to prioritize any currently loaded/saved image from the session
 * before falling back to the hardcoded default path.
 */
export function getStainedGlassHoverImage(panelId: number, imgMap: Record<string, string>): string | undefined {
  const def = HARDCODED_PANEL_HOVERS[panelId];
  if (!def) return undefined;

  // 1. Direct match on configured primary and alias keys
  for (const key of def.keys) {
    if (imgMap[key]) {
      // For Panel 8, double check it's not the music landing image
      if (panelId === 8) {
        const isLanding =
          imgMap[key] === imgMap['music-landing'] ||
          imgMap[key] === imgMap['panel-8-landing'] ||
          imgMap[key] === imgMap['music-home'];
        if (isLanding) continue;
      }
      return imgMap[key];
    }
  }

  // 2. Search any key in imgMap containing 'hover' and this panel number
  const pStr = panelId.toString();
  for (const [k, url] of Object.entries(imgMap)) {
    const lk = k.toLowerCase();
    if (lk.includes('hover')) {
      const match = lk.match(/(\d+)/);
      if (match && match[1] === pStr) {
        return url;
      }
    }
  }

  // 3. Fallback to default hardcoded asset path (e.g. /1 - Hover.png)
  return def.defaultSrc;
}

/**
 * Resolves the base background image and active milestone level for the current progress.
 * Checks from the current progress count down to 1 for the nearest milestone image.
 */
export function getUnlockStateBaseImage(
  currentProgressCount: number,
  imgMap: Record<string, string>
): { bgSource: string; activeMilestone: number } {
  // Check from currentProgressCount down to 1 for nearest available milestone image
  for (let count = currentProgressCount; count >= 1; count--) {
    const stateDef = HARDCODED_UNLOCK_PROGRESS_STATES[count];
    if (stateDef) {
      for (const k of stateDef.keys) {
        if (imgMap[k]) {
          return { bgSource: imgMap[k], activeMilestone: count };
        }
      }
      // Also check fuzzy progress keys
      for (const [k, url] of Object.entries(imgMap)) {
        if (k.toLowerCase().includes('progress')) {
          const match = k.match(/(\d+)/);
          if (match && parseInt(match[1], 10) === count) {
            return { bgSource: url, activeMilestone: count };
          }
        }
      }
      // Fallback to default hardcoded asset path (e.g. /progress_1.png in public/)
      if (stateDef.defaultSrc) {
        return { bgSource: stateDef.defaultSrc, activeMilestone: count };
      }
    }
  }

  // If at 0 or no progressive milestone found, use State 0 (monochrome base background)
  const state0 = HARDCODED_UNLOCK_PROGRESS_STATES[0];
  for (const k of state0.keys) {
    if (imgMap[k]) {
      return { bgSource: imgMap[k], activeMilestone: 0 };
    }
  }

  return { bgSource: state0.defaultSrc, activeMilestone: 0 };
}
