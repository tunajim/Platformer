//Set up canvas
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const tileSize = 50;

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

console.log(player.sprites);

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
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 500,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
];


function createImage(imageSrc){
  const image = new Image();
  image.src = imageSrc; 
  return image;
}

const backgrounds = [
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById('p1')
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById('p2')
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById('p3')
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById('p4')
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById('p5')
  }),
]


player.load();
platform.loadImg();
let keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  space: { pressed: false },
};

/* ========================================== */
//ANIMATE
/* ========================================== */
function animate() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.velocity.x = 0;

  moveScreen();

  backgrounds.forEach((background) => {
    background.drawSprite();
  })

  platform.drawBox();
  platforms.forEach((platform) => {
    platform.drawSprite();
  });

  if(keys.w.pressed) player.charged = false;

  checkPlayerPosition();
  // checkForJump();
  listenForCharge();
  player.update();
  // stormhead.update();
  let game = window.requestAnimationFrame(animate);
  checkWin(game);
}
animate();

window.addEventListener("keydown", checkKeydown);
window.addEventListener("keyup", checkKeyup);


let chargeUp;
function checkWin(game) {
  if(player.dead) {
    window.cancelAnimationFrame(game);
    endGame();
  }
}

function endGame() {
  let overlay = document.getElementsByClassName('overlay')[0];
  overlay.classList.add('active');
}

function startGame() {
  player.dead = false;
  player.position.x = 100;
  player.position.y = 0;
  animate();
}

function checkKeydown(e) {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      // if(player.grounded) player.jumping = true;
      // if(player.grounded) player.velocity.y = -20;
      if(player.grounded && !player.charged) player.jump();
      if(player.grounded && player.charged) player.superJump();
      player.charged = false;
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case " ":
      if (!player.charged && !keys.a.pressed && !keys.d.pressed) {
        player.offset.y = -5;
        player.offset.x = -25;
        keys.space.pressed = true;
        chargeUp = setTimeout(activateSuperJump, 1000);
        player.switchSprite("charge");
      }
  }
}

function checkKeyup(e) {
  switch (e.key) {
    case "a":
      keys.a.pressed = false;
      !player.charged
        ? player.switchSprite("idle")
        : player.switchSprite("idle_charged");
      break;
    case "d":
      keys.d.pressed = false;
      !player.charged
        ? player.switchSprite("idle")
        : player.switchSprite("idle_charged");
      break;
    case "w":
      keys.w.pressed = false;
      player.charged = false;
    case " ":
      if (keys.space.pressed) {
        player.offset.y = -5;
        player.offset.x = 0;
        keys.space.pressed = false;
      }
      keys.space.pressed = false;
      clearTimeout(chargeUp);
      !player.charged
        ? player.switchSprite("idle")
        : player.switchSprite("idle_charged");
  }
}

function checkPlayerPosition() {
  //Check Right movements
  if (keys.d.pressed && player.lastKey === "d" && player.position.x <= 200) {
    player.velocity.x = 5;
    !player.charged
      ? player.switchSprite("run")
      : player.switchSprite("run_charged");
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x > 200
  ) {
    player.velocity.x = 0;
    !player.charged
      ? player.switchSprite("run")
      : player.switchSprite("run_charged");
  } else if (
    keys.a.pressed &&
    player.lastKey === "a" &&
    player.position.x >= 100
  ) {
    player.velocity.x = -5;
    !player.charged
      ? player.switchSprite("run_left")
      : player.switchSprite("run_left_charged");
  } else if (
    keys.a.pressed &&
    player.lastKey === "a" &&
    player.position.x < 100
  ) {
    player.velocity.x = 0;
    !player.charged
      ? player.switchSprite("run_left")
      : player.switchSprite("run_left_charged");
  } else {
    player.velocity.x = 0;
  }
}

function checkForJump() {
  if(keys.w.pressed && player.grounded) {
    player.velocity.y = -10;
    player.grounded = false;
    player.charged = false;
  } else if (keys.w.pressed && player.grounded && player.charged) {
    player.velocity.y = -30;
    player.grounded = false;
    player.jumping = true;
    player.charged = false;
  }
}

function moveScreen() {
  if (keys.d.pressed && player.lastKey === "d" && player.position.x > 200) {
    platforms.forEach((platform) => {
      platform.position.x -= 5;
    });
  } else if (
    keys.a.pressed &&
    player.lastKey === "a" &&
    player.position.x < 100
  ) {
    platforms.forEach((platform) => {
      platform.position.x += 5;
    });
  }
}



function listenForCharge() {
  if (keys.space.pressed && !player.charged) {
    player.switchSprite("charge");
  }
  if (!keys.space.pressed && !keys.d.pressed && !keys.a.pressed) {
    !player.charged
      ? player.switchSprite("idle")
      : player.switchSprite("idle_charged");
  }
}


function activateSuperJump() {
  player.charged = true;
  return;
}
