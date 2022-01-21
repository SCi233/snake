export class GameObject {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.visible = true;
  }

  update () {}

  draw (renderer) {}
}
