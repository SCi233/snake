import { GameObject } from "../gameObject.js";
import { SnakeHead } from "./snakeHead.js";
import { SnakeBody } from "./snakeBody.js";
import { SnakeTail } from "./snakeTail.js";
import {
  DIRECTION,
  INVALID_DIRECTION,
  directionValues,
} from './constants.js';

class ListNode {
  constructor (value, prev, next) {
    this.value = value;
    this.next = next || null;
    this.prev = prev || null;
  }
}

export class Snake extends GameObject {
  constructor (config) {
    const { length, cellWidth, cellHeight, rowNums, colNums, } = config;

    super(0, 0);

    this.length = length;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.rowNums = rowNums;
    this.colNums = colNums;

    this.direction = DIRECTION.RIGHT;
    this.speed = 1;

    this.head = new ListNode(new SnakeHead(length * cellWidth, cellHeight, cellWidth, cellHeight));
    let tail = this.head;
    for (let i = 1; i < length - 1; i++) {
      tail.next = new ListNode(new SnakeBody((length - i) * cellWidth, cellHeight, cellWidth, cellHeight), tail);
      tail = tail.next;
    }
    tail.next = new ListNode(new SnakeTail(cellWidth, cellHeight, cellWidth, cellHeight), tail);
    tail = tail.next;
    this.tail = tail;

    this._elapsed = 0;
    this._canGrow = false;
    this._directionQueue = [];
  }

  update (elapsed) {
    this._elapsed += elapsed;
    if (this._elapsed >= 1000 / this.speed) {
      this._elapsed = 0;
      if (this._directionQueue.length > 0) {
        this.direction = this._directionQueue.shift();
      }
      if (this._canGrow) {
        this._doGrow();
        this._canGrow = false;
      } else {
        this.move();
      }
    }
  }

  draw (renderer) {
    for (let node = this.head; node; node = node.next) {
      node.value.draw(renderer);
    }
  }

  move () {
    for (let p = this.tail; p.prev; p = p.prev) {
      p.value.x = p.prev.value.x;
      p.value.y = p.prev.value.y;
    }
    const head = this.head;
    const direction = directionValues[this.direction];
    head.value.x += direction[1] * this.cellWidth;
    head.value.y += direction[0] * this.cellHeight;
  }

  grow () {
    this._canGrow = true;
  }

  _doGrow () {
    const head = this.head;
    const node = new ListNode(new SnakeBody(head.value.x, head.value.y, this.cellWidth, this.cellHeight), head, head.next);
    head.next.prev = node;
    head.next = node;
    this.length++;
    const direction = directionValues[this.direction];
    head.value.x += direction[1] * this.cellWidth;
    head.value.y += direction[0] * this.cellHeight;
  }

  changeDirection (direction) {
    if (direction !== this.direction && INVALID_DIRECTION[this.direction] !== direction) {
      if (this._directionQueue.length === 0) {
        if (INVALID_DIRECTION[this.direction] !== direction) {
          this._directionQueue.push(direction);
          console.log(this._directionQueue);
        }
      } else {
        const lastDirection = this._directionQueue[this._directionQueue.length - 1];
        if (INVALID_DIRECTION[lastDirection] !== direction && lastDirection !== direction) {
          this._directionQueue.push(direction);
          console.log(this._directionQueue);
        }
      }
    }
  }

  speedUp () {
    this.speed = Math.min(this.speed + 1, 3);
  }

  speedDown () {
    this.speed = Math.max(this.speed - 1, 1);
  }

  isEat (food) {
    const head = this.head;
    return head.value.x === food.x && head.value.y === food.y;
  }

  isDead () {
    const head = this.head;
    const { x: headX, y: headY, } = head.value;
    if (headX < this.cellWidth || headX > this.cellWidth * this.colNums ||
      headY < this.cellHeight || headY > this.cellHeight * this.rowNums) {
      return true;
    }
    for (let node = head.next; node; node = node.next) {
      if (node.value.x === headX && node.value.y === headY) {
        return true;
      }
    }
  }

  forEach (cb) {
    for (let node = this.head; node; node = node.next) {
      cb(node.value);
    }
  }

  includes (x, y) {
    for (let node = this.head; node; node = node.next) {
      if (node.value.x === x && node.value.y === y) {
        return true;
      }
    }
    return false;
  }
}
