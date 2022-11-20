class Sprite {
  constructor({ imageSrc, position, frames, offset, scale, hitbox }) {
    this.imageSrc = imageSrc;
    this.position = position;
    this.frames = frames;
    this.img = new Image();
    this.img.src = imageSrc;
    this.currentFrame = {
      x: 0,
      y: 0,
    };
    this.row = 0;
    this.column = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
    this.scale = scale;
    this.hitbox = hitbox;
  }
  load() {
    this.img.onload = () => {
      console.log("player-sprite loaded");
    };
  }
  draw() {
    // ctx.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );

    ctx.drawImage(
      this.img,
      this.column * (this.img.width / this.frames.x),
      this.row * (this.img.height / this.frames.y),
      this.img.width / this.frames.x,
      this.img.height / this.frames.y,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      (this.img.width / this.frames.x) * this.scale,
      (this.img.height / this.frames.y) * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.row < this.frames.y - 1) {
        if (this.column < this.frames.x - 1) {
          this.column++;
        } else if (this.column == this.frames.x - 1) {
          this.row++;
        }
      } else if (
        this.row == this.frames.y - 1 &&
        this.column < this.frames.x - 1
      ) {
        this.column++;
      } else if (
        this.row === this.frames.y - 1 &&
        this.column === this.frames.x - 1
      ) {
        this.row = 0;
        this.column = 0;
        console.log("go");
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
    hitbox,
    sprites,
  }) {
    super({
      position,
      imageSrc,
      frames,
      scale,
      hitbox,
      offset,
    });
    this.lastKey;
    this.jumping = false;
    this.gravity = 0.02;
    this.gravitySpeed = 0;
    this.velocity = velocity;
    this.row = 0;
    this.column = 0;
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

    let height = this.hitbox.height;
    let width = this.hitbox.width;

    platforms.forEach((platform) => {
      if (
        this.position.y + height <= platform.position.y &&
        this.position.y + height + this.velocity.y >= platform.position.y &&
        this.position.x + width >= platform.position.x &&
        this.position.x <= platform.position.x + tileSize * platform.tiles
      ) {
        this.velocity.y = 0;
        this.grounded = true;
        // this.jumping = false;
      } else {
        // this.grounded = false;
      }
    });

    if (this.position.y + height > canvas.width) {
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
          this.frames = {
            x: this.sprites.idle.frames.x,
            y: this.sprites.idle.frames.y,
          };
          this.row = 0;
          this.column = 0;
        }
        break;
      case "run":
        if (this.img !== this.sprites.run.image) {
          this.img = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.frames = {
            x: this.sprites.run.frames.x,
            y: this.sprites.run.frames.y,
          };
          this.row = 0;
          this.column = 0;
        }
        break;
      case "run_left":
        if (this.img !== this.sprites.run_left.image) {
          this.img = this.sprites.run_left.image;
          this.frames = {
            x: this.sprites.run_left.frames.x,
            y: this.sprites.run_left.frames.y,
          };
          this.row = 0;
          this.column = 0;
        }
        break;
      case "charge":
        if (this.img !== this.sprites.charge.image) {
          this.img = this.sprites.charge.image;
          this.frames = {
            x: this.sprites.charge.frames.x,
            y: this.sprites.charge.frames.y,
          };
          this.row = 0;
          this.column = 0;
        }
        break;
      case "idle_charged":
        if (this.img !== this.sprites.idle_charged.image) {
          this.img = this.sprites.idle_charged.image;
          this.frames = {
            x: this.sprites.idle_charged.frames.x,
            y: this.sprites.idle_charged.frames.y,
          };
          this.row = 0;
          this.column = 0;
        }
        break;
      case "run_left_charged":
        if (this.img !== this.sprites.run_left_charged.image) {
          this.img = this.sprites.run_left_charged.image;
          this.frames = {
            x: this.sprites.run_left_charged.frames.x,
            y: this.sprites.run_left_charged.frames.y,
          };
          this.row = 0;
          this.column = 0;
        }
        break;
      case "run_charged":
        if (this.img !== this.sprites.run_charged.image) {
          this.img = this.sprites.run_charged.image;
          this.frames = {
            x: this.sprites.idle.frames.x,
            y: this.sprites.idle.frames.y,
          };
          this.row = 0;
          this.column = 0;
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
    hitbox,
    sprites,
  }) {
    super({
      position,
      imageSrc,
      frames,
      offset,
      scale,
      hitbox,
    });
    this.gravity = 0.02;
    this.gravitySpeed = 0;
    this.velocity = velocity;
    this.currentFrame = 0;
    this.row = 0;
    this.column = 0;
    this.framesElapsed = 0;
    this.framesHold = 20;
    this.sprites = sprites;
    this.charged = false;
    this.grounded = false;
    this.dead = false;
    this.frames = frames;
    this.height = this.hitbox.height;
    this.width = this.hitbox.width;
    this.direction = "right";
    this.attacking = false;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  hitGround() {
    // let ground = canvas.height - (this.img.height / this.frames) * this.scale;
    let ground;

    platforms.forEach((platform) => {
      if (
        this.position.y + this.height <= platform.position.y &&
        this.position.y + this.height + this.velocity.y >=
          platform.position.y &&
        this.position.x + this.width >= platform.position.x &&
        this.position.x + this.width <=
          platform.position.x + tileSize * platform.tiles
      ) {
        this.velocity.y = 0;
        this.grounded = true;
        // this.jumping = false;
      } else {
        // this.grounded = false;
      }
    });

    if (this.position.y + this.height > canvas.width) {
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
    this.enemyMovement();
    this.attack();
  }

  attack(){
    let distance = Math.abs();
    if(){

    }
  }



  enemyMovement() {
    platforms.forEach((platform) => {
      if (
        this.position.x > platform.position.x &&
        this.position.x + this.width <
          platform.position.x + tileSize * platform.tiles
      ) {
        this.direction === "right"
          ? (this.velocity.x = 1)
          : (this.velocity.x = -1);
        console.log("gooo");
      } else if (
        this.position.x >= platform.position.x &&
        this.position.x + this.width ==
          platform.position.x + tileSize * platform.tiles
      ) {
        console.log("going");
        this.velocity.x = 0;
        setTimeout(() => {
          this.direction = "left";
          this.velocity.x = -1;
          this.switchEnemySprite("left");
        }, 1000);
      } else if (this.position.x == platform.position.x) {
        this.velocity.x = 0;
        setTimeout(() => {
          this.direction = "right";
          this.velocity.x = 1;
          this.switchEnemySprite("right");
        }, 1000);
      }
    });
  }

  switchEnemySprite(sprite) {
    switch (sprite) {
      case "left":
        if (this.img !== this.sprites.left.image) {
          this.img = this.sprites.left.image;
          this.frames = {
            x: this.sprites.left.frames.x,
            y: this.sprites.left.frames.y,
          };
          this.row = 0;
          this.column = 0;
        }
        break;
      case "right":
        if (this.img !== this.sprites.right.image) {
          this.img = this.sprites.right.image;
          this.frames = {
            x: this.sprites.right.frames.x,
            y: this.sprites.right.frames.y,
          };
          this.row = 0;
          this.column = 0;
        }
    }
  }
}
