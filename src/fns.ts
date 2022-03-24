import {
  SIDEBAR_WIDTH,
  CELL_SIZE,
  UNDEAD_COUNT_LIMIT,
  MAX_YEARS,
  COLORS,
  SCENARIO_PADDING,
  TILESET_CORDS,
} from './consts';
import { getElement, getScreenSize } from './utils';
import type {
  Cell,
  Grid,
  Context,
  NeighborsByStatus,
  GridsByType,
  TileCoordinates,
} from './types';

export const generateContext = (): Context => {
  const scenario = getElement<HTMLDivElement>('scenario');
  const sidebar = getElement<HTMLDivElement>('sidebar');
  const loading = getElement<HTMLDivElement>('loading');
  const canvas = getElement<HTMLCanvasElement>('canvas');
  const tileset = getElement<HTMLImageElement>('tileset');
  const tilesetImage = new Image();
  tilesetImage.src = tileset.src;
  const screenSize = getScreenSize();
  const padding = SCENARIO_PADDING * 2;
  const scenarioWidth = screenSize.width - SIDEBAR_WIDTH;
  const scenarioHeight = screenSize.height;
  let canvasWidth = scenarioWidth - padding;
  let canvasHeight = scenarioHeight - padding;
  const rows = Math.floor(canvasHeight / CELL_SIZE);
  canvasHeight = rows * CELL_SIZE;
  const columns = Math.floor(canvasWidth / CELL_SIZE);
  canvasWidth = columns * CELL_SIZE;
  return {
    scenario: {
      element: scenario,
      width: scenarioWidth,
      height: scenarioHeight,
    },
    canvas: {
      element: canvas,
      width: canvasWidth,
      height: canvasHeight,
    },
    sidebar: {
      element: sidebar,
      width: SIDEBAR_WIDTH,
    },
    tileset: {
      element: tilesetImage,
    },
    loading: {
      element: loading,
      visible: false,
    },
    rows,
    columns,
    cellSize: CELL_SIZE,
    generation: 1,
    grid: 'main',
  };
};

export const toggleLoading = (context: Context, visible: boolean): void => {
  context.loading.visible = visible;
  context.loading.element.style.display = visible ? 'block' : 'none';
};

export const setupUI = (context: Context): void => {
  const { scenario, sidebar, canvas } = context;
  scenario.element.style.height = `${scenario.height}px`;
  sidebar.element.style.width = `${sidebar.width}px`;
  canvas.element.setAttribute('width', `${canvas.width}`);
  canvas.element.setAttribute('height', `${canvas.height}`);
  canvas.context = canvas.element.getContext('2d');
  toggleLoading(context, false);
};

const getCellModifier =
  (base: Cell) =>
  (cell: Partial<Cell> = {}): Cell => ({
    ...base,
    ...cell,
  });

export const getNextCell = (cell: Cell, { alive, undead }: NeighborsByStatus): Cell => {
  const nextCell = getCellModifier(cell);
  if (
    cell.status === 'dead' &&
    undead === 0 &&
    (alive === 3 || (alive === 2 && Math.random() < 0.4))
  ) {
    return nextCell({ status: 'alive', years: 0 });
  }

  if (cell.status === 'alive') {
    if (
      (undead && undead > alive) ||
      (undead === 1 && Math.random() < 0.5) ||
      (undead && alive && undead === alive && Math.random() < 0.1)
    ) {
      return nextCell({ status: 'undead' });
    }

    const nextYears = cell.years + 1;
    if (
      alive < 2 ||
      alive > 3 ||
      nextYears > MAX_YEARS ||
      (undead && alive && alive > undead && Math.random() < 0.3)
    ) {
      return nextCell({
        status: Math.random() < 0.05 ? 'undead' : 'dead',
      });
    }

    return nextCell({ status: 'alive', years: nextYears });
  }

  if (cell.status === 'undead') {
    if (undead && alive && undead > alive) {
      return nextCell({ status: 'undead', undeadCount: 0 });
    }

    if (
      (alive && undead && alive === undead && Math.random() < 0.9) ||
      (alive === 1 && Math.random() < 0.5) ||
      (alive && undead && alive > undead && Math.random() < 0.7)
    ) {
      return nextCell({ status: 'dead', undeadCount: 0 });
    }

    const nextCount = cell.undeadCount + 1;
    if (cell.undeadCount > UNDEAD_COUNT_LIMIT - 1) {
      return nextCell({ status: 'dead', undeadCount: 0 });
    }

    return nextCell({ undeadCount: nextCount });
  }

  return nextCell();
};

export const generateGrids = (context: Context): [Grid, Grid] => {
  const { rows, columns } = context;
  const grid = new Array(rows).fill('').map(() =>
    new Array(columns).fill('').map(
      (): Cell => ({
        undeadCount: 0,
        status: Math.random() < 0.2 ? 'alive' : 'dead',
        years: 0,
      }),
    ),
  );
  const clone = grid.map((row) => row.map((cell) => ({ ...cell })));

  return [grid, clone];
};

const getNeighbors = (grid: Grid, row: number, column: number): Cell[] => {
  let result: Cell[] = [];
  for (let r = -1; r < 2; r++) {
    for (let c = -1; c < 2; c++) {
      if (r === 0 && c === 0) {
        continue;
      }

      const rowIndex = row + r;
      if (!grid[rowIndex]) {
        continue;
      }

      const columnIndex = column + c;
      if (!grid[rowIndex][columnIndex]) {
        continue;
      }

      result.push(grid[rowIndex][columnIndex]);
    }
  }

  return result;
};

const getNeighborsByStatus = (
  grid: Grid,
  row: number,
  column: number,
): NeighborsByStatus =>
  getNeighbors(grid, row, column).reduce(
    (acc, cell) => ({
      ...acc,
      [cell.status]: acc[cell.status] + 1 || 1,
    }),
    {
      alive: 0,
      undead: 0,
      dead: 0,
    } as NeighborsByStatus,
  );

export const getCellColor = (cell: Cell): string => {
  const { status, years, undeadCount } = cell;
  if (status === 'dead') {
    return COLORS.DEAD;
  }

  if (status === 'undead') {
    if (undeadCount === 0) {
      return COLORS.NEW_ZOMBIE;
    }
    if (undeadCount > UNDEAD_COUNT_LIMIT / 2) {
      return COLORS.DYING_ZOMBIE;
    }

    return COLORS.ZOMBIE;
  }

  if (years === 0) {
    return COLORS.BABY;
  }

  return COLORS.ALIVE;
};

export const getTileCoordinatesForCell = (
  context: Context,
  cell: Cell,
): TileCoordinates => {
  if (cell.status === 'dead') {
    return TILESET_CORDS.GRASS;
  }

  if (cell.status === 'undead') {
    if (cell.undeadCount > UNDEAD_COUNT_LIMIT / 2) {
      return TILESET_CORDS.DYING_ZOMBIE;
    }

    return TILESET_CORDS.ZOMBIE;
  }

  if (cell.years === 0) {
    return TILESET_CORDS.BABY;
  }

  return TILESET_CORDS.ALIVE;
};

export const draw = (context: Context, grid: Grid): void => {
  const { canvas, tileset, cellSize } = context;
  const { width, height } = canvas;
  const { rows, columns } = context;
  const ctx = canvas.context;
  if (!ctx) {
    throw Error('No canvas context');
  }
  ctx.clearRect(0, 0, width, height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = grid[r][c];
      const x = c * cellSize;
      const y = r * cellSize;
      const coords = getTileCoordinatesForCell(context, cell);
      ctx.drawImage(
        tileset.element,
        coords.x,
        coords.y,
        cellSize,
        cellSize,
        x,
        y,
        cellSize,
        cellSize,
      );
    }
  }
};

export const magic = (context: Context, grids: GridsByType): Grid => {
  const prevGrid = grids[context.grid];
  const nextGrid = grids[context.grid === 'main' ? 'clone' : 'main'];
  prevGrid.forEach((row, rowIndex) =>
    row.forEach((cell, cellIndex) => {
      const neighborsByStatus = getNeighborsByStatus(prevGrid, rowIndex, cellIndex);
      const nextCell = getNextCell(cell, neighborsByStatus);
      nextGrid[rowIndex][cellIndex] = nextCell;
    }),
  );

  context.generation++;
  context.grid = context.grid === 'main' ? 'clone' : 'main';
  return nextGrid;
};
