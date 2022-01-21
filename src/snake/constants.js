export const DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

export const INVALID_DIRECTION = {
  [DIRECTION.UP]: DIRECTION.DOWN,
  [DIRECTION.RIGHT]: DIRECTION.LEFT,
  [DIRECTION.DOWN]: DIRECTION.UP,
  [DIRECTION.LEFT]: DIRECTION.RIGHT,
}

export const directionValues = [[-1, 0], [0, 1], [1, 0], [0, -1]];
