export class Renderer {
  constructor (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  clear () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRect (x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  drawCircle (x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  drawText (x, y, text, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }
}
