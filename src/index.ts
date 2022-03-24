import {
  draw,
  generateContext,
  generateGrids,
  setupUI,
  createIntervalAndControls,
} from './fns';

const run = () => {
  let context = generateContext();
  setupUI(context);
  let grids = generateGrids(context);
  createIntervalAndControls(context, grids);
};

document.addEventListener('DOMContentLoaded', run);
