class Sprite {
  constructor({
    imageSrc,
    position,
    frames,
    offset,
    scale,
    hitbox,
    hitFrame,
    attackHitBox,
  }) {
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
    this.hitFrame = hitFrame;
    this.attackHitBox = attackHitBox;
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

  renderAttackHitBox(state) {
    if (state === "inactive") {
      ctx.clearRect();
    } else if (state === "active") {
      ctx.fillRect(
        this.position.x + 50 * this.attackHitBox.dir,
        this.position.y,
        this.attackHitBox.width,
        this.attackHitBox.height
      );
    }
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.row < this.frames.y - 1) {
        if (this.column < this.frames.x - 1) {
          this.column++;
        }
        this.row++;
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
      }
    }

    if (
      (this.hitFrame !== 99 && this.column >= this.hitFrame - 1) ||
      this.row >= this.hitFrame - 1
    ) {
      console.log("hit");
      // this.renderAttackHitBox("active");
      if (
        (this.position.y <= player.position.y &&
          this.position.y + this.hitbox.height >= player.position.y) ||
        (this.position.y >= player.position.y &&
          this.position.y + this.hitbox.height <=
            player.position.y + player.hitbox.height) ||
        (this.position.y + this.hitbox.height >= player.position.y &&
          this.position.y + this.hitbox.height <=
            player.position.y + player.hitbox.height)
      ) {
        if (
          (this.position.x - 50 <= player.position.x + player.hitbox.width &&
            this.position.x - 50 + this.hitbox.width >=
              player.position.x + player.hitbox.width) ||
          (this.position.x + this.attackHitBox.width + 50 >=
            player.position.x &&
            this.position.x + this.attackHitBox.width + 50 <=
              player.position.x + player.hitbox.width)
        ) {
          console.log("attacked");
          enemies.forEach((enemy) => {
            if (!enemy.dead) player.die();
          });
        }
      }
      enemies.forEach((enemy) => {
        if (
          (this.position.y + this.attackHitBox.height <=
            enemy.position.y + enemy.hitbox.height &&
            this.position.y + this.attackHitBox.height >= enemy.position.y) ||
          (this.position.y >= enemy.position.y &&
            this.position.y <= enemy.position.y + enemy.hitbox.height)
        ) {
          if (
            this.position.x + this.attackHitBox.width >= enemy.position.x &&
            this.position.x <= enemy.position.x
          ) {
            if (player.attacking) {
              console.log("enemy dead");
              enemy.dead = true;
            }
          }
        }
      });
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
    hitFrame,
    attackHitBox,
    sprites,
  }) {
    super({
      position,
      imageSrc,
      frames,
      scale,
      hitbox,
      offset,
      hitFrame,
      attackHitBox,
    });
    this.lastKey;
    this.jumping = false;
    this.gravity = 0.02;
    this.gravitySpeed = 0;
    this.velocity = velocity;
    // this.row = 0;
    // this.column = 0;
    this.framesElapsed = 0;
    this.framesHold = 20;
    this.sprites = sprites;
    this.charged = false;
    this.grounded = false;
    this.dead = false;
    this.attacking = false;

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
    if (!this.dead) this.hitGround();
    this.getHit();
    if (this.attacking) this.switchSprite("attack_right");
    this.position.y += this.velocity.y;
  }

  getHit() {
    enemies.forEach((enemy) => {
      if (
        this.position.y >= enemy.position.y &&
        this.position.y + this.hitbox.height <=
          enemy.position.y + enemy.hitbox.height + 100
      ) {
        if (
          (this.position.x + this.hitbox.width > enemy.position.x &&
            this.position.x <= enemy.position.x) ||
          (this.position.x >= enemy.position.x &&
            this.position.x + this.hitbox.width <=
              enemy.position.x + enemy.hitbox.width)
        ) {
          console.log("get hit");
          if (!enemy.dead) {
            this.die();
            this.dead = true;
          }
        }
      }
    });
  }

  die() {
    console.log("youve been killed");
    this.dead = true;
  }

  attack() {
    // console.log(this.column);
    // this.switchSprite("attack_right");
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
          this.hitFrame = 99;
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
          this.hitFrame = 99;
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
          this.hitFrame = 99;
          this.row = 0;
          this.column = 0;
        }
        break;
      case "attack_right":
        if (this.img !== this.sprites.attack_right.image) {
          this.img = this.sprites.attack_right.image;
          this.frames = {
            x: this.sprites.attack_right.frames.x,
            y: this.sprites.attack_right.frames.y,
          };
          this.hitFrame = this.sprites.attack_right.hitFrame;
          this.attackHitBox = this.sprites.attack_right.attackHitBox;
          this.row = 0;
          this.column = 0;
        }
        break;
      case "attack_left":
        if (this.img !== this.sprites.attack_left.image) {
          this.img = this.sprites.attack_left.image;
          this.frames = {
            x: this.sprites.attack_left.frames.x,
            y: this.sprites.attack_left.frames.y,
          };
          this.hitFrame = this.sprites.attack_left.hitFrame;
          this.attackHitBox = this.sprites.attack_left.attackHitBox;
          this.row = 0;
          this.column = 0;
        }
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
    hitFrame,
    attackHitBox,
    sprites,
  }) {
    super({
      position,
      imageSrc,
      frames,
      offset,
      scale,
      hitbox,
      hitFrame,
      attackHitBox,
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
    this.checkDistance();
    if (this.dead) {
      this.velocity.x = 0;
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 1000);
    }
    // this.attack();
  }

  die() {
    this.dead = true;
  }

  attack(dis) {
    console.log(dis);
    platforms.forEach((platform) => {
      if (
        this.position.x > platform.position.x &&
        this.position.x + this.hitbox.width <
          platform.position.x + tileSize * platform.tiles
      ) {
        if (dis < 0) {
          this.switchEnemySprite("attack_left");
          this.velocity.x = -1;
          this.attacking = true;
        } else if (dis > 0) {
          this.switchEnemySprite("attack_right");
          this.velocity.x = 1;
          this.attacking = true;
        }
      }
    });
  }

  enemyMovement() {
    platforms.forEach((platform) => {
      if (
        this.position.x > platform.position.x &&
        this.position.x + this.width <
          platform.position.x + tileSize * platform.tiles
      ) {
        if (!this.attacking) {
          this.direction === "right"
            ? (this.velocity.x = 1)
            : (this.velocity.x = -1);
        }
      } else if (
        this.position.x >= platform.position.x &&
        this.position.x + this.width ==
          platform.position.x + tileSize * platform.tiles
      ) {
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
          (this.frames = {
            x: this.sprites.left.frames.x,
            y: this.sprites.left.frames.y,
          }),
            (this.hitFrame = 99);
          this.row = 0;
          this.column = 0;
        }
        break;
      case "right":
        if (this.img !== this.sprites.right.image) {
          this.img = this.sprites.right.image;
          (this.frames = {
            x: this.sprites.right.frames.x,
            y: this.sprites.right.frames.y,
          }),
            (this.hitFrame = 99);
          this.row = 0;
          this.column = 0;
        }
        break;
      case "attack_left":
        if (this.img !== this.sprites.attack_left.image) {
          this.img = this.sprites.attack_left.image;
          this.frames = {
            x: this.sprites.attack_left.frames.x,
            y: this.sprites.attack_left.frames.y,
          };
          this.hitFrame = this.sprites.attack_left.hitFrame;
          this.attackHitBox = this.sprites.attack_left.attackHitBox;
          this.row = 0;
          this.column = 0;
          this.attacking = true;
        }
        break;
      case "attack_right":
        if (this.img !== this.sprites.attack_right.image) {
          this.img = this.sprites.attack_right.image;
          this.frames = {
            x: this.sprites.attack_right.frames.x,
            y: this.sprites.attack_right.frames.y,
          };
          this.hitFrame = this.sprites.attack_right.hitFrame;
          this.attackHitBox = this.sprites.attack_right.attackHitBox;
          this.row = 0;
          this.column = 0;
          this.attacking = true;
        }
        break;
    }
  }

  checkDistance() {
    let distance;
    if (player.position.x + player.hitbox.width < this.position.x) {
      distance = player.position.x + player.hitbox.width - this.position.x;
    } else if (player.position.x > this.position.x + this.hitbox.width) {
      distance = player.position.x - (this.position.x + this.hitbox.width);
    }
    if (
      Math.abs(distance) <= 200 &&
      player.position.y + player.hitbox.height >= this.position.y &&
      player.position.y + player.hitbox.height <=
        this.position.y + this.hitbox.height + 10
    ) {
      this.attack(distance);
    } else {
      this.attacking = false;
    }
  }
}
