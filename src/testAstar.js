import { MainLoop } from './mainLoop.js'
import { Renderer } from './renderer.js'

import { Food, TYPE as FOODTYPE } from './food.js'

import { getRandomInt, LP2RP } from './utils.js'
import { search } from './aStar.js'
import { search as dijstraSearch } from './dijstra'

const COL_NUM = 30
const ROW_NUM = 20
const PIXEL_SIZE = 4

const canvas = document.querySelector('#main-canvas')
const toolBar = document.querySelector('#tool-bar')
const btnRestart = document.querySelector('#btn-restart')
const btnClear = document.querySelector('#btn-clear')
const btnAStar = document.querySelector('#btn-astar')
const btnDijstra = document.querySelector('#btn-dijstra')

canvas.width = PIXEL_SIZE * 8 * (COL_NUM + 2)
canvas.height = PIXEL_SIZE * 8 * (ROW_NUM + 2)

toolBar.style.width = canvas.width + 'px'

const mainLoop = new MainLoop()
const renderer = new Renderer(canvas)

const generateObstacles = (num) => {
  const arr = []
  const set = new Set();
  for (let i = 0; i < num; ++i) {
    let x, y;
    do {
      x = getRandomInt(0, COL_NUM) + 1
      y = getRandomInt(0, ROW_NUM) + 1
    } while (set.has(`${x},${y}`))
    set.add(`${x},${y}`)
    arr.push({ x, y })
  }
  return arr;
}

const OBSTACLE_NUM = Math.floor(COL_NUM * ROW_NUM / 4)
const obstacles = generateObstacles(OBSTACLE_NUM)

const generateEndXY = () => {
  const exist = new Set(obstacles.map(el => `${el.x},${el.y}`))
  let x, y
  do {
    x = getRandomInt(0, COL_NUM) + 1
    y = getRandomInt(0, ROW_NUM) + 1
  } while (exist.has(`${x},${y}`))

  return { x, y }
}

const end = { ...generateEndXY() }

const generateStartXY = () => {
  const exist = new Set([...obstacles, end].map(el => `${el.x},${el.y}`))
  let x, y
  do {
    x = getRandomInt(0, COL_NUM) + 1
    y = getRandomInt(0, ROW_NUM) + 1
  } while (exist.has(`${x},${y}`))

  return { x, y }
}

const start = { ...generateStartXY() }

// console.log(start, end);

const path = []

const touched = []

const searchPath = (fn) => {
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
  grid[start.y][start.x] = 0
  grid[end.y][end.x] = 0
  obstacles.forEach(el => grid[el.y][el.x] = 1)
  // console.log(grid);

  const [resultPath, open, close] = fn?.(start.x, start.y, end.x, end.y, grid, true) || [];
  if (resultPath) {
    path.length = 0
    path.push(...(resultPath.slice(1, resultPath.length - 1).map(el => ({ x: el.x, y: el.y }))))
  } else {
    alert('can not find path!')
  }

  // console.log(resultPath, path, open, close);
  console.log('path len: ', resultPath.length);

  touched.length = 0
  if (open) {
    touched.push(...(open.map(el => ({x: el.x, y: el.y}))))
  }
  if (close) {
    touched.push(...(close.map(el => ({x: el.x, y: el.y}))))
  }
}

const clearPath = () => {
  path.length = 0
  touched.length = 0
}

const drawCell = (renderer, x, y, color) => {
  const { x: rx, y: ry } = LP2RP(x, y, PIXEL_SIZE)
  renderer.drawRect(rx, ry, PIXEL_SIZE * 8, PIXEL_SIZE * 8, color)
}

const drawMap = () => {
  const color = '#000000aa'
  for (let r = 0; r < ROW_NUM + 2; ++r) {
    drawCell(renderer, 0, r, color)
    drawCell(renderer, COL_NUM + 1, r, color)
  }
  for (let c = 1; c <= COL_NUM; ++c) {
    drawCell(renderer, c, 0, color)
    drawCell(renderer, c, ROW_NUM + 1, color)
  }
}

const drawObstacles = () => {
  for (const { x, y } of obstacles) {
    drawCell(renderer, x, y, '#000000aa')
  }
}

const draw = () => {
  renderer.clear('DarkSeaGreen')
  drawMap();
  touched.forEach(node => drawCell(renderer, node.x, node.y, '#ffff0066'))
  path.forEach(node => drawCell(renderer, node.x, node.y, '#0000ff'))
  drawCell(renderer, end.x, end.y, '#00ff00')
  drawCell(renderer, start.x, start.y, '#ff0000')
  drawObstacles()
}

const restart = () => {
  obstacles.length = 0
  obstacles.push(...generateObstacles(OBSTACLE_NUM))
  path.length = 0
  touched.length = 0
  const { x: endX, y: endY } = generateEndXY()
  end.x = endX
  end.y = endY
  const { x: startX, y: startY } = generateStartXY()
  start.x = startX
  start.y = startY

  console.log(start, end);
}

btnRestart.addEventListener('click', () => {
  restart()
  btnRestart.blur()
})

btnClear.addEventListener('click', () => {
  clearPath()
  btnAStar.blur()
})

btnAStar.addEventListener('click', () => {
  searchPath(search)
  btnAStar.blur()
})

btnDijstra.addEventListener('click', () => {
  searchPath(dijstraSearch)
  btnAStar.blur()
})

const testAstar = () => {
  mainLoop.setOnLoop((elapsed) => {
    draw()
  })
  mainLoop.start()
};

testAstar();
