class Sprite {
  constructor({ imageSrc, position, frames, offset, scale }) {
    this.imageSrc = imageSrc;
    this.position = position;
    this.frames = frames;
    this.img = new Image();
    this.img.src = imageSrc;
    this.currentFrame = 0;
    this.row = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
    this.scale = scale;
  }
  load() {
    velocity,
    this.img.onload = () => {
      console.log('player-sprite loaded');
    }
  }
  draw() {
      ctx.drawImage(
        this.img,
        0,
        this.currentFrame * (this.img.height / this.frames) + this.offset.y,
        this.img.width,
        this.img.height / this.frames,
        this.position.x + this.offset.x,
        this.position.y,
        this.img.width * this.scale,
        (this.img.height / this.frames) * this.scale
      );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.frames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Player extends Sprite {
  constructor({
    position,
    velocity,
    color,
    imageSrc,
    frames,
    scale,
    offset,
    sprites,
  }) {
    super({
      position,
      imageSrc,
      frames,
      scale,
      offset,
    });
    this.lastKey;
    this.jumping = false;
    this.gravity = 0.02;
    this.gravitySpeed = 0;
    this.velocity = velocity;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 20;
    this.sprites = sprites;
    this.charged = false;
    this.grounded = false;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  jump() {
    this.gravitySpeed = 0;
    this.velocity.y = -10;
    this.grounded = false;
  }

  superJump() {
    this.gravitySpeed = 0;
    this.velocity.y = -15;
    this.grounded = false;
    this.charged = false;
  }

  hitGround() {
    // let ground = canvas.height - (this.img.height / this.frames) * this.scale;
    let ground;

    let height = (this.img.height / this.frames) * this.scale;

    platforms.forEach((platform) => {
      if (
        this.position.y + height <= platform.position.y &&
        this.position.y + height + this.velocity.y >= platform.position.y &&
        this.position.x + this.img.width + 30>= platform.position.x &&
        this.position.x + this.img.width <=
          platform.position.x + tileSize * platform.tiles
      ) {
        this.velocity.y = 0;
        this.grounded = true;
        // this.jumping = false;
      } else {
        // this.grounded = false;
      }
    });

    if (this.position.y + height > canvas.width) {
      console.log("dead");
      this.dead = true;
    }
  }

  update() {
    this.draw();

    // ctx.fillStyle = "red";
    // ctx.globalalpha = 0.2;
    // ctx.fillRect(this.position.x, this.position.y, this.img.width * this.scale, this.img.height/this.frames * this.scale);

    this.animateFrames();
    this.position.x += this.velocity.x;
    if (!this.grounded) this.gravitySpeed += this.gravity;
    this.velocity.y += this.gravitySpeed;
    this.hitGround();
    this.position.y += this.velocity.y;
  }

  standStill() {
    this.velocity.x = 0;
  }

  switchSprite(sprite) {
    switch (sprite) {
      case "idle":
        if (this.img !== this.sprites.idle.image) {
          this.img = this.sprites.idle.image;
          this.frames = this.sprites.idle.frames;
          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.img !== this.sprites.run.image) {
          this.img = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.currentFrame = 0;
        }
        break;
      case "run_left":
        if (this.img !== this.sprites.run_left.image) {
          this.img = this.sprites.run_left.image;
          this.frames = this.sprites.run_left.frames;
          this.currentFrame = 0;
        }
        break;
      case "charge":
        if (this.img !== this.sprites.charge.image) {
          this.img = this.sprites.charge.image;
          this.frames = this.sprites.charge.frames;
          this.currentFrame = 0;
        }
        break;
      case "idle_charged":
        if (this.img !== this.sprites.idle_charged.image) {
          this.img = this.sprites.idle_charged.image;
          this.frames = this.sprites.idle_charged.frames;
          this.currentFrame = 0;
        }
        break;
      case "run_left_charged":
        if (this.img !== this.sprites.run_left_charged.image) {
          this.img = this.sprites.run_left_charged.image;
          this.frames = this.sprites.run_left_charged.frames;
          this.currentFrame = 0;
        }
        break;
      case "run_charged":
        if (this.img !== this.sprites.run_charged.image) {
          this.img = this.sprites.run_charged.image;
          this.frames = this.sprites.run_charged.frames;
          this.currentFrame = 0;
        }
        break;
    }
  }
}

const test = "Works";

class Enemy extends Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    frames,
    scale,
    offset,
    sprites,
    
  }) {
    super({
      position,
      imageSrc,
      frames,
      offset,
      scale
    });
    this.gravity = 0.02;
    this.gravitySpeed = 0;
    this.velocity = velocity;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 20;
    this.sprites = sprites;
    this.charged = false;
    this.grounded = false;
    this.dead = false;
  }
  
  hitGround() {
    // let ground = canvas.height - (this.img.height / this.frames) * this.scale;
    let ground;

    let height = (this.img.height / this.frames) * this.scale;

    platforms.forEach((platform) => {
      if (
        this.position.y + height <= platform.position.y &&
        this.position.y + height + this.velocity.y >= platform.position.y &&
        this.position.x + this.img.width + 30>= platform.position.x &&
        this.position.x + this.img.width <=
          platform.position.x + tileSize * platform.tiles
      ) {
        this.velocity.y = 0;
        this.grounded = true;
        // this.jumping = false;
      } else {
        // this.grounded = false;
      }
    });

    if (this.position.y + height > canvas.width) {
      console.log("dead");
      this.dead = true;
    }
  }


  update() {
    this.draw();

    // ctx.fillStyle = "red";
    // ctx.globalalpha = 0.2;
    // ctx.fillRect(this.position.x, this.position.y, this.img.width * this.scale, this.img.height/this.frames * this.scale);

    this.animateFrames();
    this.position.x += this.velocity.x;
    if (!this.grounded) this.gravitySpeed += this.gravity;
    this.velocity.y += this.gravitySpeed;
    this.hitGround();
    this.position.y += this.velocity.y;
  }

  switchSprite(sprite) {
    switch (sprite) {
      case "left":
        if (this.img !== this.sprites.left.image) {
          this.img = this.sprites.left.image;
          this.frames = this.sprites.left.frames;
          this.currentFrame = 0;
        }
        break;
    }
  }

}
