export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const isTouchable = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};
