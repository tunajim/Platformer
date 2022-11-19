class Background {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.img = image;
  }
  drawSprite() {
    ctx.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      1024,
      576
    );
  }
  drawBox() {
    // this.ctx.fillStyle = "red";
    // this.ctx.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.tileSize * this.tiles,
    //   tileSize
    // );
  }
}
