export type Status = 'alive' | 'dead' | 'undead';
export type NeighborsByStatus = Record<Status, number>;

export type Cell = {
  undeadCount: number;
  status: Status;
  years: number;
};

export type Grid = Cell[][];
export type GridType = 'main' | 'clone';
export type GridsByType = Record<GridType, Grid>;

export type Context = {
  scenario: {
    element: HTMLDivElement;
    width: number;
    height: number;
  };
  canvas: {
    element: HTMLCanvasElement;
    width: number;
    height: number;
    context?: CanvasRenderingContext2D | null;
  };
  sidebar: {
    element: HTMLDivElement;
    width: number;
  };
  tileset: {
    element: HTMLImageElement;
  };
  loading: {
    element: HTMLDivElement;
    visible: boolean;
  };
  controls: {
    playPause: HTMLButtonElement;
    reset: HTMLButtonElement;
    addRandom: HTMLButtonElement;
    speed: HTMLInputElement;
  };
  rows: number;
  columns: number;
  cellSize: number;
  generation: number;
  grid: GridType;
  interval?: NodeJS.Timer;
};

export type TileType =
  | 'GRASS'
  | 'DIRT'
  | 'TALL_GRASS'
  | 'ZOMBIE'
  | 'DYING_ZOMBIE'
  | 'ALIVE'
  | 'BABY';
export type TileCoordinates = { x: number; y: number };
