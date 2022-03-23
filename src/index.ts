import { draw, generateContext, generateGrids, setupUI, magic } from './fns';
import { GridsByType } from './types';

const run = () => {
  let context = generateContext();
  setupUI(context);
  const [gridOne, gridTwo] = generateGrids(context);
  const grids: GridsByType = {
    main: gridOne,
    clone: gridTwo,
  };

  draw(context, grids[context.grid]);
  setInterval(() => {
    const grid = magic(context, grids);
    draw(context, grid);
    console.log('GENERATION', context.generation);
  }, 500);
};

document.addEventListener('DOMContentLoaded', run);
