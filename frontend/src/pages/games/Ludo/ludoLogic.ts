export const LUDO_PATH = [
  // 0-12 (Red to Green)
  {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6},
  {x: 6, y: 5}, {x: 6, y: 4}, {x: 6, y: 3}, {x: 6, y: 2}, {x: 6, y: 1}, {x: 6, y: 0},
  {x: 7, y: 0}, {x: 8, y: 0},
  // 13-25 (Green to Yellow)
  {x: 8, y: 1}, {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}, {x: 8, y: 5},
  {x: 9, y: 6}, {x: 10, y: 6}, {x: 11, y: 6}, {x: 12, y: 6}, {x: 13, y: 6}, {x: 14, y: 6},
  {x: 14, y: 7}, {x: 14, y: 8},
  // 26-38 (Yellow to Blue)
  {x: 13, y: 8}, {x: 12, y: 8}, {x: 11, y: 8}, {x: 10, y: 8}, {x: 9, y: 8},
  {x: 8, y: 9}, {x: 8, y: 10}, {x: 8, y: 11}, {x: 8, y: 12}, {x: 8, y: 13}, {x: 8, y: 14},
  {x: 7, y: 14}, {x: 6, y: 14},
  // 39-51 (Blue to Red)
  {x: 6, y: 13}, {x: 6, y: 12}, {x: 6, y: 11}, {x: 6, y: 10}, {x: 6, y: 9},
  {x: 5, y: 8}, {x: 4, y: 8}, {x: 3, y: 8}, {x: 2, y: 8}, {x: 1, y: 8}, {x: 0, y: 8},
  {x: 0, y: 7}
];

export const RED_HOME_PATH = [
  {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 7, y: 7} // index 5 is the center finish
];

export const BLUE_HOME_PATH = [ // We use Yellow's side for Blue in our 2-player game
  {x: 13, y: 7}, {x: 12, y: 7}, {x: 11, y: 7}, {x: 10, y: 7}, {x: 9, y: 7}, {x: 7, y: 7}
];

// Base positions (when progress = 0)
export const RED_BASE = [
  {x: 2, y: 2}, {x: 3, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}
];

export const BLUE_BASE = [ // Using Yellow's base area
  {x: 11, y: 11}, {x: 12, y: 11}, {x: 11, y: 12}, {x: 12, y: 12}
];

export const SAFE_ZONES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// Helper to convert progress to visual coordinates
export function getTokenCoordinates(player: 'red' | 'blue', progress: number, tokenId: number) {
  if (progress === 0) {
    return player === 'red' ? RED_BASE[tokenId % 4] : BLUE_BASE[tokenId % 4];
  }
  
  if (progress >= 57) {
    // Finished (hide or stack in center)
    return { x: 7, y: 7 };
  }

  if (progress >= 52) {
    // Home stretch (52-56 maps to index 0-4 of home path)
    const homeIndex = progress - 52;
    return player === 'red' ? RED_HOME_PATH[homeIndex] : BLUE_HOME_PATH[homeIndex];
  }

  // Outer path
  const startOffset = player === 'red' ? 0 : 26;
  const globalIdx = (progress - 1 + startOffset) % 52;
  return LUDO_PATH[globalIdx];
}
