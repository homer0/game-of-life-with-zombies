type ScreenSize = {
  width: number;
  height: number;
};

export const getScreenSize = (): ScreenSize => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const getElement = <T extends HTMLElement>(id: string): T => {
  const element = document.querySelector<T>(`#${id}`);
  if (!element) {
    throw new Error(`Element with ID '${id}' not found`);
  }

  return element;
};

export const tossCoin = (): boolean => Math.random() < 0.5;
