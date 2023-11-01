import { MainLoop } from './mainLoop.js'
import { Renderer } from './renderer.js'

import { GameMap } from './gameMap.js'
import { Food, TYPE as FOODTYPE } from './food.js'

import { getRandomInt } from './utils.js'
import { search } from './aStar.js'

const COL_NUM = 30
const ROW_NUM = 20
const PIXEL_SIZE = 4

const canvas = document.querySelector('#main-canvas')
const toolBar = document.querySelector('#tool-bar')
const btnRestart = document.querySelector('#btn-restart')
const btnAStar = document.querySelector('#btn-astar')

canvas.width = PIXEL_SIZE * 8 * (COL_NUM + 2)
canvas.height = PIXEL_SIZE * 8 * (ROW_NUM + 2)

toolBar.style.width = canvas.width + 'px'

const mainLoop = new MainLoop()
const renderer = new Renderer(canvas)

const gameMap = new GameMap({
  x: 0,
  y: 0,
  rowNums: ROW_NUM,
  colNums: COL_NUM,
  pixelSize: PIXEL_SIZE
})

const generateBananas = (num) => {
  const arr = []
  const set = new Set();
  for (let i = 0; i < num; ++i) {
    let x, y;
    do {
      x = getRandomInt(0, COL_NUM) + 1
      y = getRandomInt(0, ROW_NUM) + 1
    } while (set.has(`${x},${y}`))
    set.add(`${x},${y}`)
    arr.push(new Food(x, y, PIXEL_SIZE, FOODTYPE.BANANA))
  }
  return arr;
}

const BANANA_NUM = Math.floor(COL_NUM * ROW_NUM / 4)
const bananas = generateBananas(BANANA_NUM)

const generateFoodXY = () => {
  const exist = new Set(bananas.map(el => `${el.x},${el.y}`))
  let x, y
  do {
    x = getRandomInt(0, gameMap.colNums) + 1
    y = getRandomInt(0, gameMap.rowNums) + 1
  } while (exist.has(`${x},${y}`))

  return [x, y]
}

const food = new Food(...generateFoodXY(), PIXEL_SIZE, FOODTYPE.CHERRY)

const generateAppleXY = () => {
  const exist = new Set([...bananas, food].map(el => `${el.x},${el.y}`))
  let x, y
  do {
    x = getRandomInt(0, gameMap.colNums) + 1
    y = getRandomInt(0, gameMap.rowNums) + 1
  } while (exist.has(`${x},${y}`))

  return [x, y]
}

const apple = new Food(...generateAppleXY(), PIXEL_SIZE, FOODTYPE.APPLE)

const path = []

const searchByAstar = () => {
  const grid = Array(ROW_NUM + 2)
  for (let i = 0; i < ROW_NUM + 2; i++) {
    grid[i] = Array(COL_NUM + 2)
    if (i === 0 || i === ROW_NUM + 1) {
      grid[i].fill(1)
    } else {
      grid[i].fill(0)
      grid[i][0] = grid[i][COL_NUM + 1] = 1
    }
  }
  grid[apple.y][apple.x] = 0
  grid[food.y][food.x] = 0
  bananas.forEach(el => grid[el.y][el.x] = 1)
  console.log(grid);

  const [resultPath, open, close] = search(apple.x, apple.y, food.x, food.y, grid, true);
  if (resultPath) {
    path.length = 0
    path.push(...(resultPath.map(el => new Food(el.x, el.y, PIXEL_SIZE, FOODTYPE.APPLE))))
  } else {
    alert('can not find path!')
  }

  // console.log(resultPath, open, close);

  // if (open) {
  //   path.length = 0
  //   path.push(...(open.map(el => new Food(el.x, el.y, PIXEL_SIZE, FOODTYPE.WATERMELON))))
  // }

  // if (close) {
  //   path.length = 0
  //   path.push(...(close.map(el => new Food(el.x, el.y, PIXEL_SIZE, FOODTYPE.WATERMELON))))
  // }
};

const update = (elapsed) => {
  gameMap.update()
  food.update()
  apple.update()
  bananas.forEach(banana => banana.update())
  path.forEach(node => node.update())
}

const draw = () => {
  renderer.clear('DarkSeaGreen')
  gameMap.visible && gameMap.draw(renderer)
  food.visible && food.draw(renderer)
  apple.visible && apple.draw(renderer)
  bananas.forEach(banana => banana.visible && banana.draw(renderer))
  path.forEach(node => node.visible && node.draw(renderer))
}

const restart = () => {
  bananas.length = 0
  bananas.push(...generateBananas(BANANA_NUM))
  path.length = 0
  ;[food.x, food.y] = generateFoodXY()
  ;[apple.x, apple.y] = generateAppleXY()
}

btnRestart.addEventListener('click', () => {
  restart()
  btnRestart.blur()
})

btnAStar.addEventListener('click', () => {
  searchByAstar()
  btnAStar.blur()
})

const testAstar = () => {
  mainLoop.setOnLoop((elapsed) => {
    update(elapsed)
    draw()
  })
  mainLoop.start()
};

testAstar();
