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
  frames: 6,
  scale: 3,
  offset: {
    x: 0,
    y: -5,
  },
  sprites: {
    idle: {
      imageSrc: "spritesheet/blue_witch/B_witch_idle.png",
      frames: 6,
    },
    run: {
      imageSrc: "spritesheet/blue_witch/B_witch_run.png",
      frames: 8,
    },
    run_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_run_left.png",
      frames: 8,
    },
    charge: {
    imageSrc: "spritesheet/blue_witch/B_witch_charge.png",
      frames: 5,
    },
    idle_charged: {
      imageSrc: "spritesheet/blue_witch/B_witch_idle_charged.png",
      frames: 6,
    },
    run_left_charged: {
      imageSrc: "spritesheet/blue_witch/B_witch_run_left_charged.png",
      frames: 8,
    },
    run_charged: {
      imageSrc: "spritesheet/blue_witch/B_witch_run_charged.png",
      frames: 8,
    },

  },
});


const platform = new Platform({
  position: {
    x: 100,
    y: canvas.height - tileSize,
  },
  imageSrc: "~/spritesheet/platforms/flat-platform.png",
  tiles: 5,
});

const platforms = [
  new Platform({
    position: {
      x: 100,
      y: canvas.height - tileSize,
    },
    imageSrc: "~/spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 400,
      y: canvas.height - tileSize,
    },
    imageSrc: "~/spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 725,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "~/spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 850,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "~/spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 1000,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "~/spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 1250,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "~/spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
];

const enemy1 = new Enemy({
    position: {
        x: 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "~/spritesheet/reaper-right/idle.png",
    frames: 2,
    scale: 1,
    offset: {
        x: 0,
        y: 0
    },
    sprites: {
        right: {
            imageSrc: "~/spritesheet/reaper-right/idle.png",
            frames: 2
        }
    }
});

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
