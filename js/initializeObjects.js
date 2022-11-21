const tileSize = 50;
canvas.width = 1024;
canvas.height = 576;

const player = new Player({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  imageSrc: "spritesheet/blue_witch/B_witch_idle.png",
  frames: {
    x: 1,
    y: 6,
  },
  scale: 3,
  offset: {
    x: -22,
    y: -20,
  },
  hitbox: {
    width: 45,
    height: 100,
  },
  sprites: {
    idle: {
      imageSrc: "spritesheet/blue_witch/B_witch_idle.png",
      frames: {
        x: 1,
        y: 6,
      },
      hitFrame: 99,
    },
    run: {
      imageSrc: "spritesheet/blue_witch/B_witch_run.png",
      frames: {
        x: 1,
        y: 8,
      },
      hitFrame: 99
    },
    run_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_run_left.png",
      frames: {
        x: 1,
        y: 8,
      },
      hitFrame: 99
    },
    attack_right: {
      imageSrc: "spritesheet/blue_witch/B_witch_attack.png",
      frames: {
        x: 1,
        y: 9
      },
      hitFrame: 6,
      attackHitBox: {
        dir: 1,
        width: 250,
        height: 100,
      },
    },
    attack_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_attack_left.png",
      frames: {
        x: 1,
        y: 9
      },
      hitFrame: 6,
      attackHitBox: {
        dir: -1,
        width: 250,
        height: 100,
      },
    },
  },
});

const platform = new Platform({
  position: {
    x: 100,
    y: canvas.height - tileSize,
  },
  imageSrc: "spritesheet/platforms/flat-platform.png",
  tiles: 5,
});

const platforms = [
  new Platform({
    position: {
      x: 100,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 400,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 400,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 725,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 850,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 1000,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 1250,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
];

const enemies = [
  new Enemy({
    position: {
      x: 500,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: {
      right: {
        imageSrc: "spritesheet/reaper-right/idle.png",
        frames: {
          x: 4,
          y: 1,
        },
      },
      left: {
        imageSrc: "spritesheet/reaper-left/idle.png",
        frames: {
          x: 4,
          y: 1,
        },
      },
      attack_left: {
        imageSrc: "spritesheet/reaper-left/attacking.png",
        frames: {
          x: 6,
          y: 1,
        },
        hitFrame: 4,
        attackHitBox: {
          dir: -1,
          width: 50,
          height: 100,
        },
      },
      attack_right: {
        imageSrc: "spritesheet/reaper-right/attacking.png",
        frames: {
          x: 6,
          y: 1,
        },
        hitFrame: 4,
        attackHitBox: {
          dir: 1,
          width: 50,
          height: 100,
        },
      },
      die: {
        imageSrc: "spritesheet/reaper-right/death.png",
        frames: {
          x: 10,
          y: 2
        }
      }
    },
  }),
  new Enemy({
    position: {
      x: 1000,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: {
      right: {
        imageSrc: "spritesheet/reaper-right/idle.png",
        frames: {
          x: 4,
          y: 1,
        },
      },
      left: {
        imageSrc: "spritesheet/reaper-left/idle.png",
        frames: {
          x: 4,
          y: 1,
        },
      },
      attack_left: {
        imageSrc: "spritesheet/reaper-left/attacking.png",
        frames: {
          x: 6,
          y: 1,
        },
        hitFrame: 3,
        attackHitBox: {
          dir: -1,
          width: 50,
          height: 100,
        },
      },
      attack_right: {
        imageSrc: "spritesheet/reaper-right/attacking.png",
        frames: {
          x: 6,
          y: 1,
        },
        hitFrame: 3,
        attackHitBox: {
          dir: 1,
          width: 50,
          height: 100,
        },
      },
    },
  }),
];

const backgrounds = [
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p1"),
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p2"),
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p3"),
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p4"),
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p5"),
  }),
];
