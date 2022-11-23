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
    /* uncomment to draw hitboxes

    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.hitbox.width,
      this.hitbox.height
    );

    */

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
        (this.position.x + 50) * this.attackHitBox.dir,
        this.position.y,
        this.attackHitBox.width,
        this.attackHitBox.height
      );
    }
  }

  deathAnimation() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
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
        if (!this.dead) {
          this.row = 0;
          this.column = 0;
        }
      }
    }

    if (
      (this.hitFrame !== 99 && this.column >= this.hitFrame - 1) ||
      this.row >= this.hitFrame - 1
    ) {
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
          (player.position.y + this.attackHitBox.height <=
            enemy.position.y + enemy.hitbox.height &&
            player.position.y + this.attackHitBox.height >= enemy.position.y) ||
          (player.position.y >= enemy.position.y &&
            player.position.y <= enemy.position.y + enemy.hitbox.height)
        ) {
          if (
            player.position.x + this.attackHitBox.width >= enemy.position.x &&
            player.position.x <= enemy.position.x &&
            this.attackHitBox.dir > 0
            // player.dir > 0
            // (this.position.x >= enemy.position.x &&
            // this.position.x - this.attackHitBox.width <=
            // enemy.position.x + enemy.hitbox.width)
          ) {
            if (keys.space.pressed) {
              console.log("enemy dead");
              enemy.die();
            }
          } else if (
            player.position.x - this.attackHitBox.width <= enemy.position.x &&
            player.position.x >= enemy.position.x &&
            this.attackHitBox.dir < 0
          ) {
            if (keys.space.pressed) {
              console.log("enemy dead");
              enemy.die();
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
    this.framesHold = 15;
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

    playerPlatforms.forEach((platform) => {
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

    this.attack();
    // ctx.fillStyle = "red";
    // ctx.globalalpha = 0.2;
    // ctx.fillRect(this.position.x, this.position.y, this.img.width * this.scale, this.img.height/this.frames * this.scale);

    this.animateFrames();
    this.position.x += this.velocity.x;
    if (!this.grounded) this.gravitySpeed += this.gravity;
    this.velocity.y += this.gravitySpeed;
    if (!this.dead) this.hitGround();
    this.getHit();
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
          if (!enemy.dead) {
            console.log("get hit");
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
    if (this.attacking) {
      if (this.lastKey == "a") {
        this.switchSprite("attack_left");
      } else if (this.lastKey == "d" || this.lastKey == null) {
        this.switchSprite("attack_right");
      }
    }
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
          this.offset = this.sprites.idle.offset;
          this.framesHold = 15;
        }
        break;
      case "idle_left":
        if (this.img !== this.sprites.idle_left.image) {
          this.img = this.sprites.idle_left.image;
          this.frames = {
            x: this.sprites.idle_left.frames.x,
            y: this.sprites.idle_left.frames.y,
          };
          this.hitFrame = 99;
          this.row = 0;
          this.column = 0;
          this.offset = this.sprites.idle_left.offset;
          this.framesHold = 15;
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
          this.offset = this.sprites.run.offset;
          this.framesHold = 15;
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
          this.offset = this.sprites.run_left.offset;
          this.framesHold = 15;
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
          this.offset = this.sprites.attack_right.offset;
          this.framesHold = 7;
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
          (this.attackHitBox = {
            dir: this.sprites.attack_left.attackHitBox.dir,
            width: this.position.x,
            height: this.sprites.attack_left.attackHitBox.height,
          }),
            (this.row = 0);
          this.column = 0;
          this.offset = this.sprites.attack_left.offset;
          this.framesHold = 7;
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
    this.distance = null;
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
    if (this.dead) this.velocity.x = 0;
    if (this.dead) this.switchEnemySprite("dead");
    this.distance = this.checkDistance();
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
    if (Math.abs(this.distance) < 200) {
      this.attack(this.checkDistance());
    } else {
      this.attacking = false;
    }
    // this.attack();
  }

  die() {
    this.dead = true;
    this.switchEnemySprite("dead");
    console.log("enemy has died");
  }

  attack(dis) {
    platforms.forEach((platform) => {
      if (
        !this.dead &&
        this.position.x > platform.position.x &&
        this.position.x + this.hitbox.width <
          platform.position.x + tileSize * platform.tiles
      ) {
        if (dis < 0) {
          this.attacking = true;
          this.direction = "left";
          this.switchEnemySprite("attack_left");
          this.enemyMovement();
          // this.velocity.x = -2;
        } else if (dis > 0) {
          this.attacking = true;
          this.direction = "right";
          this.switchEnemySprite("attack_right");
          this.enemyMovement();
          // this.velocity.x = 2;
        }
      }
    });
  }

  enemyMovement() {
    platforms.forEach((platform) => {
      if (
        !this.dead &&
        !this.attacking &&
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
        !this.dead &&
        !this.attacking &&
        this.position.x > platform.position.x &&
        this.position.x + this.width ==
          platform.position.x + tileSize * platform.tiles
      ) {
        this.velocity.x = 0;
        this.direction = "left";
        this.velocity.x = -1;
        this.switchEnemySprite("left");
      } else if (
        !this.dead &&
        !this.attacking &&
        this.position.x == platform.position.x
      ) {
        this.velocity.x = 0;
        this.direction = "right";
        this.velocity.x = 1;
        this.switchEnemySprite("right");
      } else if (
        !this.dead &&
        this.attacking
        // this.position.x  <= platform.position.x + 20 &&
        // this.position.x  >= platform.position.x
      ) {
        if (
          this.position.x == platform.position.x ||
          this.position.x + this.hitbox.width ==
            platform.position.x + tileSize * platform.tiles
        ) {
          console.log("stop");
          this.velocity.x = 0;
        } else if (
          this.position.x + this.hitbox.width <
            platform.position.x + tileSize * platform.tiles  &&
          this.position.x > platform.position.x
        ) {
          this.direction === "right"
            ? (this.velocity.x = 1)
            : (this.velocity.x = -1);
        }
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
      case "dead":
        if (this.img !== this.sprites.dead.image) {
          this.img = this.sprites.dead.image;
          this.frames = {
            x: this.sprites.dead.frames.x,
            y: this.sprites.dead.frames.y,
          };
          this.hitFrame = 99;
          this.row = 0;
          this.column = 0;
        }
    }
  }

  checkDistance() {
    let distance;
    if (player.position.x + player.hitbox.width < this.position.x) {
      distance = player.position.x + player.hitbox.width - this.position.x;
    } else if (player.position.x > this.position.x + this.hitbox.width) {
      distance = player.position.x - (this.position.x + this.hitbox.width);
    }
    return distance;
  }
}
