import type { TileType, TileCoordinates } from './types';

export const SIDEBAR_WIDTH: number = 400;
export const CELL_SIZE: number = 40;
export const UNDEAD_COUNT_LIMIT: number = 4;
export const MAX_YEARS: number = 90;
export const SCENARIO_PADDING: number = 40;

export const TILESET_CORDS: Record<TileType, TileCoordinates> = {
  GRASS: { x: 0, y: 0 },
  DIRT: { x: 40, y: 0 },
  TALL_GRASS: { x: 80, y: 0 },
  ZOMBIE: { x: 0, y: 40 },
  DYING_ZOMBIE: { x: 40, y: 40 },
  ALIVE: { x: 80, y: 40 },
  BABY: { x: 0, y: 80 },
  END: { x: 40, y: 80 },
};
