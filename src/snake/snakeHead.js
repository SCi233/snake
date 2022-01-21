import { GameObject } from "../gameObject.js";

export class SnakeHead extends GameObject {
  constructor (x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  update () {}

  draw (renderer) {
    renderer.drawRect(this.x, this.y, this.width, this.height, 'green');
  }
}
