import { Item, PriorityQueue } from './priorityQueue.js'

const getManhattanDistance = (x1, y1, x2, y2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

/** heuristic method */
const h = (x1, y1, x2, y2) => {
  // let v = 4 * getManhattanDistance(x1, y1, x2, y2)
  // v *= (1.0 + 0.001)
  let v = getManhattanDistance(x1, y1, x2, y2)
  return v
}

/**
 * get f value of current position
 * @param {number} sx - start x
 * @param {number} sy - start y
 * @param {number} cx - current x
 * @param {number} cy - current y
 * @param {number} tx - target x
 * @param {number} ty - target y
 * @returns number
 */
const f = (sx, sy, cx, cy, tx, ty) => {
  const g = h(sx, sy, cx, cy)
  // const hValue = h(cx, cy, tx, ty)
  const hValue = 0
  const fValue = g + hValue
  return {
    g,
    h: hValue,
    f: fValue
  }
}

const _createItem = (sx, sy, cx, cy, tx, ty) => {
  const { g, h, f: fValue } = f(sx, sy, cx, cy, tx, ty)
  return new Item({ x: cx, y: cy, g, h, f: fValue, parent: null }, fValue)
}

/** direction, [y, x][], up, right, down, left */
const _dir = [[-1, 0], [0, 1], [1, 0], [0, -1]]

const _getNeighbors = (x, y, grid, close) => {
  const neighbors = _dir.map(([yOffset, xOffset]) => ({ x: x + xOffset, y: y + yOffset }))
  return neighbors.filter(({ x, y }) => {
    return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length && grid[y][x] === 0 && !close.has(`${x},${y}`)
  })
}

/** transform link list of item to array */
const _itemLinkToPath = (item) => {
  const path = []
  for (let p = item; p; p = p.parent) {
    // console.log('p', p);
    path.unshift({ x: p.value.x, y: p.value.y })
  }
  return path
}

/**
 * A star algorithm
 * @param {number} x1 - start x
 * @param {number} y1 - start y
 * @param {number} x2 - target x
 * @param {number} y2 - target y
 * @param {number[][]} grid - grid, 0: accessible, 1: not accessible
 * @returns {{x: number, y: number}[]} - path, {x, y}[]
 */
export const search = (x1, y1, x2, y2, grid, debug) => {
  const open = new PriorityQueue()
  const close = new Set()
  const start = _createItem(x1, y1, x1, y1, x2, y2)
  open.enqueue(start)
  while (!open.isEmpty()) {
    const curItem = open.dequeue()
    const { value: { x: cx, y: cy } } = curItem
    close.add(`${cx},${cy}`)
    if (cx === x2 && cy === y2) {
      if (debug) {
        return [
          _itemLinkToPath(curItem),
          open.heap.map(el => ({ x: el.value.x, y: el.value.y })),
          [...close].map(el => ({ x: el.split(',')[0], y: el.split(',')[1] })),
        ]
      }
      return _itemLinkToPath(curItem)
    }

    const neighbors = _getNeighbors(cx, cy, grid, close)
    // console.log('neighbors', cx, cy, neighbors);
    for (const { x, y } of neighbors) {
      const index = open.findIndex((item) => item.value.x === x && item.value.y === y)
      if (index === -1) {
        const newItem = _createItem(x1, y1, x, y, x2, y2)
        newItem.parent = curItem
        open.enqueue(newItem)
      } else {
        const exist = open.heap[index]
        // console.log('curItem', curItem.value, curItem.value.g, exist.value.g,);
        if (curItem.value.g + 1 < exist.value.g) {
          exist.value.g = curItem.value.g + 1
          exist.value.f = exist.value.g + exist.value.h
          exist.code = exist.value.f
          exist.value.parent = curItem
          open.moveUp(index)
        }
      }
    }
  }
  if (debug) {
    return [
      null,
      open.heap.map(el => ({ x: el.value.x, y: el.value.y })),
      [...close].map(el => ({ x: el.split(',')[0], y: el.split(',')[1] })),
    ]
  }
  return null
}
