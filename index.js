//Set up canvas
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

let loaded = false;

player.load();
enemies.forEach((enemy) => {
  enemy.load();
});
finishLine.load();
console.log(finishLine);
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
  // platform.drawBox();

  // if (keys.w.pressed) player.charged = false;

  checkPlayerPosition();
  finishLine.update();
  player.update();
  enemies.forEach((enemy) => {
    enemy.update();
  });
  let game = window.requestAnimationFrame(animate);
  checkWin(game);
}
animate();

window.addEventListener("keydown", checkKeydown);
window.addEventListener("keyup", checkKeyup);

// prevent scroll on spacebar press
window.addEventListener("keydown", function (e) {
  if (e.key == " ") {
    e.preventDefault();
  }
});

let chargeUp;
function checkWin(game) {
  if (player.dead) {
    window.cancelAnimationFrame(game);
    gameover();
  }
  if(player.position.x + player.hitbox.width >= finishLine.position.x &&
      player.position.x <= finishLine.position.x + finishLine.hitbox.width &&
      player.position.y <= finishLine.position.y + finishLine.hitbox.height &&
      player.position.y + player.hitbox.height >= finishLine.position.y 
    ){
      console.log("you won");
      winGame();
    }

}

function winGame() {
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.add("active");
  overlay.style.backgroundColor = "#04BF8A";

  let header = overlay.getElementsByTagName("h2")[0];
  header.textContent = "You Won!";

  let caption = overlay.getElementsByTagName("p")[0];
  caption.textContent = "Congratulations, you found your way!"

  

  console.log(header);
}

function gameover() {
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
  playerPlatforms.forEach((platform) => {
    platform.drawSprite();
  });
}

function drawFinishLine() {
  finishLine.update();
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
      if (!player.attacking) player.attacking = true;
      keys.space.pressed = true;
    // if (!player.charged && !keys.a.pressed && !keys.d.pressed) {
    //   player.offset.y = -5;
    //   player.offset.x = -25;
    //   keys.space.pressed = true;
    //   chargeUp = setTimeout(activateSuperJump, 1000);
    //   player.switchSprite("charge");
    // }
  }
}

function checkKeyup(e) {
  switch (e.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      player.charged = false;
    case " ":
      keys.space.pressed = false;
      player.attacking = false;
      if (!keys.a.pressed && !keys.d.pressed) player.switchSprite("idle");
      player.update();
    // player.column = 0;
    // player. row = 0;
  }
}

function checkPlayerPosition() {
  //Check Right movements
  if (keys.d.pressed && player.lastKey === "d") {
    if (player.position.x < 400) {
      player.velocity.x = 3;
      !player.attacking
        ? player.switchSprite("run")
        : player.switchSprite("attack_right");
    } else if (player.position.x >= 400) {
      player.velocity.x = 0;
      !player.attacking
        ? player.switchSprite("run")
        : player.switchSprite("attack_right");
    }
  } else if (keys.a.pressed && player.lastKey === "a") {
    if (player.position.x > 300) {
      player.velocity.x = -3;
      !player.attacking
        ? player.switchSprite("run_left")
        : player.switchSprite("attack_left");
    } else if (player.position.x <= 300) {
      player.velocity.x = 0;
      !player.attacking
        ? player.switchSprite("run_left")
        : player.switchSprite("attack_left");
    }
  }

  if (!keys.d.pressed && !keys.a.pressed && keys.space.pressed) {
    player.velocity.x = 0;
    if (player.lastKey === "d") {
      player.switchSprite("attack_right");
    } else if (player.lastKey === "a") {
      player.switchSprite("attack_left");
    }
  }

  if (!keys.d.pressed && !keys.a.pressed && !keys.space.pressed) {
    if (player.lastKey == "d" || player.lastKey == null) {
      player.switchSprite("idle");
    } else if (player.lastKey == "a") {
      player.switchSprite("idle_left");
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
  if (player.position.x >= 400 && player.lastKey === "d") {
    if (keys.d.pressed) {
      platforms.forEach((platform) => {
        platform.position.x -= 3;
      });
      playerPlatforms.forEach((platform) => {
        platform.position.x -= 3;
      });
      enemies.forEach((enemy) => {
        enemy.position.x -= 3;
      });
      finishLine.position.x -= 3;
      parallaxBackground(-1);
    }
  } else if (player.position.x < 300 && player.lastKey === "a") {
    if (keys.a.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += 3;
      });
      playerPlatforms.forEach((platform) => {
        platform.position.x += 3;
      });
      enemies.forEach((enemy) => {
        enemy.position.x += 3;
      });
      finishLine.position.x += 3;
      parallaxBackground(1);
    }
  }
}

function activateSuperJump() {
  player.charged = true;
  return;
}

function parallaxBackground(dir) {
  for (let i = backgrounds.length - 1; i > 0; i--) {
    backgrounds[i].position.x += 0.05 * i * dir;
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
