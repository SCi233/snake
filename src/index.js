import { MainLoop } from './mainLoop.js';
import { Renderer } from './renderer.js';
import { Keyboard } from './keyboard.js';

import { GameMap } from './gameMap.js';
import { Snake } from './snake/snake.js';
import { Food } from './food.js';

import { getRandomInt } from './utils.js';
import { DIRECTION } from './snake/constants.js';

const mainLoop = new MainLoop();

const canvas = document.querySelector('#main-canvas');
canvas.width = 24 * 12;
canvas.height = 24 * 12;

const renderer = new Renderer(canvas);

const gameMap = new GameMap({
  x: 0,
  y: 0,
  cellWidth: 24,
  cellHeight: 24,
  cellColor: 'white',
  wallColor: 'gray',
  rowNums: 10,
  colNums: 10,
});

const snake = new Snake({
  length: 3,
  cellWidth: 24,
  cellHeight: 24,
  rowNums: 10,
  colNums: 10,
});

const generateFoodXY = () => {
  let x, y;
  do {
    x = (getRandomInt(0, gameMap.colNums) + 1) * gameMap.cellWidth;
    y = (getRandomInt(0, gameMap.rowNums) + 1) * gameMap.cellHeight;
  } while (snake.includes(x, y));

  return [x, y];
}

let food = new Food(...generateFoodXY(), 3, Food.TYPES.CHERRY);

const update = (elapsed) => {
  gameMap.update();
  food.update();
  if (!snake.isDead()) {
    snake.update(elapsed);
    if (snake.isEat(food)) {
      snake.grow();
      snake.speedUp();
      [food.x, food.y] = generateFoodXY();
      food.type = [Food.TYPES.APPLE, Food.TYPES.CHERRY, Food.TYPES.BANANA, Food.TYPES.WATERMELON][getRandomInt(0, 4)];
    }
  }
}

const draw = () => {
  renderer.clear();
  gameMap.draw(renderer);
  food.draw(renderer);
  snake.draw(renderer);
}

const keyW = new Keyboard('KeyW');
const keyD = new Keyboard('KeyD');
const keyS = new Keyboard('KeyS');
const keyA = new Keyboard('KeyA');

const checkInput = () => {
  if (keyW.isPressed()) {
    snake.changeDirection(DIRECTION.UP);
  } else if (keyD.isPressed()) {
    snake.changeDirection(DIRECTION.RIGHT);
  } else if (keyS.isPressed()) {
    snake.changeDirection(DIRECTION.DOWN);
  } else if (keyA.isPressed()) {
    snake.changeDirection(DIRECTION.LEFT);
  }
}

const main = () => {
  console.log('hello world');
  mainLoop.setOpLoop((elapsed) => {
    checkInput();
    update (elapsed);
    draw();
  });
  mainLoop.start();
};

main();
