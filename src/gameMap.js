import { GameObject } from "./gameObject.js";

export class GameMap extends GameObject {
  constructor (config) {
    const {
      x,
      y,
      cellWidth,
      cellHeight,
      cellColor,
      wallColor,
      rowNums,
      colNums,
    } = config;
    super(x, y);
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.cellColor = cellColor;
    this.wallColor = wallColor;
    this.rowNums = rowNums;
    this.colNums = colNums;
  }

  update () {}

  draw (renderer) {
    this.drawWall(renderer);
    this.drawCells(renderer);
  }

  drawWall (renderer) {
    renderer.drawRect(0, 0, this.cellWidth * (this.colNums + 2), this.cellHeight, this.wallColor);
    renderer.drawRect(this.cellWidth * (this.colNums + 1), this.cellHeight, this.cellWidth, this.cellHeight * (this.rowNums + 1), this.wallColor);
    renderer.drawRect(0, this.cellHeight * (this.rowNums + 1), this.cellWidth * (this.colNums + 1), this.cellHeight, this.wallColor);
    renderer.drawRect(0, this.cellHeight, this.cellWidth, this.cellHeight * this.rowNums, this.wallColor);
  }

  drawCells (renderer) {
    renderer.drawRect(this.cellWidth, this.cellHeight, this.cellWidth * this.colNums, this.cellHeight * this.rowNums, this.cellColor);
  }
}
