import { MainLoop } from './mainLoop.js';
import { Renderer } from './renderer.js';
import { Keyboard } from './keyboard.js';

import { GameMap } from './gameMap.js';
import { Snake } from './snake/snake.js';
import { Food } from './food.js';

import { getRandomInt } from './utils.js';
import { DIRECTION } from './snake/constants.js';

const ROW_NUM = 10;
const COL_NUM = 10;
const PIXEL_SIZE = 4;

const mainLoop = new MainLoop();

const canvas = document.querySelector('#main-canvas');
const statusBar = document.querySelector('#status-bar');
const toolBar = document.querySelector('#tool-bar');
const ctrlBar = document.querySelector('#ctrl-bar');
const btnPause = document.querySelector('#btn-pause');
const btnRestart = document.querySelector('#btn-restart');
const btnJoystickUp = document.querySelector('#btn-joystick-up');
const btnJoystickLeft = document.querySelector('#btn-joystick-left');
const btnJoystickRight = document.querySelector('#btn-joystick-right');
const btnJoystickDown = document.querySelector('#btn-joystick-down');
const btnDash = document.querySelector('#btn-dash');

canvas.width = PIXEL_SIZE * 8 * (COL_NUM + 2);
statusBar.style.width = canvas.width + 'px';
ctrlBar.style.width = canvas.width + 'px';
toolBar.style.width = canvas.width + 'px';

canvas.height = PIXEL_SIZE * 8 * (ROW_NUM + 2);

const setStatusText = (snakeLength, snakeSpeed) => {
  statusBar.innerHTML = `Length: ${snakeLength}, Speed: ${snakeSpeed}`;
};

const renderer = new Renderer(canvas);

const gameMap = new GameMap({
  x: 0,
  y: 0,
  rowNums: ROW_NUM,
  colNums: COL_NUM,
  pixelSize: PIXEL_SIZE,
});

let snake = new Snake({
  length: 3,
  rowNums: ROW_NUM,
  colNums: COL_NUM,
  pixelSize: PIXEL_SIZE,
});
snake.onStatusChanged(setStatusText);
setStatusText(snake.length, snake.speed);

const generateFoodXY = () => {
  let x, y;
  do {
    x = (getRandomInt(0, gameMap.colNums) + 1) * gameMap.pixelSize * 8;
    y = (getRandomInt(0, gameMap.rowNums) + 1) * gameMap.pixelSize * 8;
  } while (snake.includes(x, y));

  return [x, y];
}

let food = new Food(...generateFoodXY(), PIXEL_SIZE, Food.TYPES.CHERRY);

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
  } else {
    btnRestart.classList.remove('hidden');
    btnPause.setAttribute('disabled', 'disabled');
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
const keyArrowUp = new Keyboard('ArrowUp');
const keyArrowRight = new Keyboard('ArrowRight');
const keyArrowLeft = new Keyboard('ArrowLeft');
const keyArrowDown = new Keyboard('ArrowDown');
const keySpace = new Keyboard('Space');

const checkInput = () => {
  if (keyW.isPressed() || keyArrowUp.isPressed()) {
    snake.changeDirection(DIRECTION.UP);
  } else if (keyD.isPressed() || keyArrowRight.isPressed()) {
    snake.changeDirection(DIRECTION.RIGHT);
  } else if (keyS.isPressed() || keyArrowDown.isPressed()) {
    snake.changeDirection(DIRECTION.DOWN);
  } else if (keyA.isPressed() || keyArrowLeft.isPressed()) {
    snake.changeDirection(DIRECTION.LEFT);
  } else if (keySpace.isPressed()) {
    snake.dash();
  }
}

btnJoystickUp.addEventListener('mousedown', () => { snake.changeDirection(DIRECTION.UP); });
btnJoystickUp.addEventListener('touchstart', () => { snake.changeDirection(DIRECTION.UP); });
btnJoystickRight.addEventListener('mousedown', () => { snake.changeDirection(DIRECTION.RIGHT); });
btnJoystickRight.addEventListener('touchstart', () => { snake.changeDirection(DIRECTION.RIGHT); });
btnJoystickDown.addEventListener('mousedown', () => { snake.changeDirection(DIRECTION.DOWN); });
btnJoystickDown.addEventListener('touchstart', () => { snake.changeDirection(DIRECTION.DOWN); });
btnJoystickLeft.addEventListener('mousedown', () => { snake.changeDirection(DIRECTION.LEFT); });
btnJoystickLeft.addEventListener('touchstart', () => { snake.changeDirection(DIRECTION.LEFT); });
btnDash.addEventListener('mousedown', () => { snake.dash(); });
btnDash.addEventListener('touchstart', () => { snake.dash(); });

const restart = () => {
  snake = new Snake({
    length: 3,
    rowNums: ROW_NUM,
    colNums: COL_NUM,
    pixelSize: PIXEL_SIZE,
  });
  snake.onStatusChanged(setStatusText);
  setStatusText(snake.length, snake.speed);
  [food.x, food.y] = generateFoodXY();
  food.type = [Food.TYPES.APPLE, Food.TYPES.CHERRY, Food.TYPES.BANANA, Food.TYPES.WATERMELON][getRandomInt(0, 4)];
}

btnRestart.addEventListener('click', () => {
  restart();
  btnRestart.classList.add('hidden');
  btnPause.removeAttribute('disabled');
});

let isPaused = false;

btnPause.addEventListener('click', () => {
  isPaused = !isPaused;
  btnPause.innerHTML = isPaused ? 'Resume' : 'Pause';
});

const main = () => {
  mainLoop.setOpLoop((elapsed) => {
    if (!isPaused) {
      checkInput();
      update (elapsed);
    }
    draw();
  });
  mainLoop.start();
};

main();
