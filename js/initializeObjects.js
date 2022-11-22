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
      offset: {
        x: -22,
        y: -20,
      },
    },
    idle_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_idle_left.png",
      frames: {
        x: 1,
        y: 6,
      },
      hitFrame: 99,
      offset: {
        x: -22,
        y: -20,
      },
    },
    run: {
      imageSrc: "spritesheet/blue_witch/B_witch_run.png",
      frames: {
        x: 1,
        y: 8,
      },
      hitFrame: 99,
      offset: {
        x: -22,
        y: -20,
      },
    },
    run_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_run_left.png",
      frames: {
        x: 1,
        y: 8,
      },
      hitFrame: 99,
      offset: {
        x: -22,
        y: -20,
      },
    },
    attack_right: {
      imageSrc: "spritesheet/blue_witch/B_witch_attack.png",
      frames: {
        x: 1,
        y: 9,
      },
      hitFrame: 6,
      attackHitBox: {
        dir: 1,
        width: 250,
        height: 100,
      },
      offset: {
        x: -22,
        y: -20,
      },
    },
    attack_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_attack_left.png",
      frames: {
        x: 1,
        y: 9,
      },
      hitFrame: 6,
      attackHitBox: {
        dir: -1,
        width: 250,
        height: 100,
      },
      offset: {
        x: -225,
        y: -20,
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
    tiles: 10,
  }),
  new Platform({
    position: {
      x: 700,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 4,
  }),
  new Platform({
    position: {
      x: 1000,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 3,
  }),
  new Platform({
    position: {
      x: 1250,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
  new Platform({
    position: {
      x: 1500,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
  new Platform({
    position: {
      x: 1700,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
  new Platform({
    position: {
      x: 1900,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 6,
  }),
  new Platform({
    position: {
      x: 2350,
      y: canvas.height - tileSize - 175,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 6,
  }),
  new Platform({
    position: {
      x: 2700,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 10,
  }),
];

const playerPlatforms = [
  new Platform({
    position: {
      x: 2800,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 3050,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
];

const enemySprites = {
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
  dead: {
    imageSrc: "spritesheet/reaper-right/death.png",
    frames: {
      x: 20,
      y: 1,
    },
  },
}

const enemies = [
  new Enemy({
    position: {
      x: 2800,
      y: canvas.height - 500,
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
    sprites: enemySprites    
  }),
  new Enemy({
    position: {
      x: 2500,
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
    sprites: enemySprites
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
