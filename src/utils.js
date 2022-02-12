export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const isTouchable = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};

/** logic position to real position */
export const LP2RP = (x, y, pixelSize) => {
  return {
    x: x * pixelSize * 8,
    y: y * pixelSize * 8,
  }
};
