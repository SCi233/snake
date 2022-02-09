import { GameObject } from "./gameObject.js";

export class Food extends GameObject {
  static TYPES = {
    APPLE: 0,
    CHERRY: 1,
    BANANA: 2,
    WATERMELON: 3,
  }

  static COLORS = [
    '#ffffff00',
    '#59b574', '#4e1413', '#832525', '#bc3532', '#e23f40', '#e78385',
    '#fceaaa', '#f3de70', '#cf641e', '#f37a2a', '#8e4413',
  ];

  static PIXEL_DATAS = {
    [Food.TYPES.APPLE]: [
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 3, 3, 2, 3, 0, 0],
      [0, 3, 6, 6, 2, 4, 3, 0],
      [0, 3, 5, 5, 5, 4, 3, 0],
      [0, 3, 4, 4, 4, 4, 3, 0],
      [0, 0, 3, 3, 3, 3, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [Food.TYPES.CHERRY]: [
      [0, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 2, 1, 0, 1],
      [0, 0, 0, 2, 0, 2, 0, 0],
      [0, 0, 0, 2, 0, 4, 4, 0],
      [0, 0, 3, 4, 3, 5, 6, 4],
      [0, 3, 5, 6, 3, 5, 5, 4],
      [0, 3, 5, 5, 3, 3, 3, 0],
      [0, 0, 3, 3, 0, 0, 0, 0],
    ],
    [Food.TYPES.BANANA]: [
      [0, 0, 0, 11, 11, 11, 11, 11],
      [0, 0, 0, 11, 7, 8, 8, 11],
      [0, 0, 0, 0, 9, 8, 11, 0],
      [0, 0, 0, 9, 8, 8, 10, 0],
      [0, 0, 9, 8, 8, 8, 10, 0],
      [9, 9, 8, 8, 7, 10, 0, 0],
      [9, 8, 8, 7, 10, 0, 0, 0],
      [0, 9, 9, 9, 0, 0, 0, 0],
    ],
    [Food.TYPES.WATERMELON]: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 6, 4, 4, 2, 4, 4, 1],
      [1, 2, 4, 4, 4, 4, 4, 1],
      [1, 4, 4, 2, 4, 4, 2, 1],
      [0, 1, 4, 4, 4, 4, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  }

  constructor (x, y, pixelSize, type) {
    super(x, y);
    this.pixelSize = pixelSize;
    this.type = type;
  }

  update () {}

  draw (renderer) {
    const {x, y, pixelSize, type} = this;
    const pixelData = this._getPixelData(type);
    for (let r = 0; r < pixelData.length; r++) {
      for (let c = 0; c < pixelData[r].length; c++) {
        renderer.drawRect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize, this._getColor(pixelData[r][c]));
      }
    }
  }

  _getPixelData (type) {
    return Food.PIXEL_DATAS[type];
  }

  _getColor (colorType) {
    return Food.COLORS[colorType];
  }
}
