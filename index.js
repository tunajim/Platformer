//Set up canvas
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

player.load();
platform.load();
enemy1.load();
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

  drawBackgrounds();
  drawPlatforms();
  platform.drawBox();

  if (keys.w.pressed) player.charged = false;

  checkPlayerPosition();
  listenForCharge();
  player.update();
  enemy1.update();
  let game = window.requestAnimationFrame(animate);
  checkWin(game);
}
animate();

window.addEventListener("keydown", checkKeydown);
window.addEventListener("keyup", checkKeyup);

let chargeUp;
function checkWin(game) {
  if (player.dead) {
    window.cancelAnimationFrame(game);
    endGame();
  }
}

function endGame() {
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.add("active");
}

function startGame() {
  player.dead = false;
  player.position.x = 100;
  player.position.y = 0;
  animate();
}

function drawBackgrounds() {
  backgrounds.forEach((background) => {
    background.drawSprite();
  });
}

function drawPlatforms() {
  platforms.forEach((platform) => {
    platform.drawSprite();
  });
}

function checkKeydown(e) {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      // if(player.grounded) player.jumping = true;
      // if(player.grounded) player.velocity.y = -20;
      if (player.grounded && !player.charged) player.jump();
      if (player.grounded && player.charged) player.superJump();
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
  if (keys.d.pressed && player.lastKey === "d") {
    if (player.position.x < 200) {
      player.velocity.x = 3;
      !player.charged
        ? player.switchSprite("run")
        : player.switchSprite("run_charged");
    } else if (player.position.x > 200) {
      player.velocity.x = 0;
      !player.charged
        ? player.switchSprite("run")
        : player.switchSprite("run_charged");
    }
  } else if (keys.a.pressed && player.lastKey === "a") {
    if (player.position.x >= 100) {
      player.velocity.x = -3;
      !player.charged
        ? player.switchSprite("run_left")
        : player.switchSprite("run_left_charged");
    } else if (player.position.x < 100) {
      player.velocity.x = 0;
      !player.charged
        ? player.switchSprite("run_left")
        : player.switchSprite("run_left_charged");
    }
  }
}

function checkForJump() {
  if (keys.w.pressed && player.grounded) {
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
  if (player.position.x > 200 && player.lastKey === "d") {
    if (keys.d.pressed) {
      platforms.forEach((platform) => {
        platform.position.x -= 3;
      });
      parallaxBackground(-1);
    }
  } else if (player.position.x < 100 && player.lastKey === "a") {
    if (keys.a.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += 3;
      });
      parallaxBackground(1);
    }
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

function parallaxBackground(dir) {
  for (let i = backgrounds.length - 1; i > 0; i--) {
    backgrounds[i].position.x += 0.05 * i * dir;
    console.log(backgrounds[0].position.x);
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}