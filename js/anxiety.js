var bg;
var ferryman;
var eyes;
var extraCanvas;
var dim = 200;
var speedleftup = 0;
var speedrightdown = 0;
var health = 300;
var stamina = 300;
var splat;
var facing = 1;
var isidle = 0;
var displacefactor = 30;
var collectibles;
var keygot = 0;
var door;
var doorisopen = 0;
var doorY = 300;
let Titillium;

function preload() {
  swipe = loadSound('../assets/sfx/swipe.mp3');
  chomp = loadSound('../assets/sfx/chomp.mp3');
  key_picked_up = loadSound('../assets/sfx/key_picked_up.mp3');
  door_open = loadSound('../assets/sfx/door_open.mp3');
  Titillium = loadFont('../assets/typeface/Titillium.otf');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);


  var SCENE_W = windowWidth * 2;
  var SCENE_H = windowHeight * 2;

  bg = new Group();
  door = createSprite(width, doorY);
  ferryman = createSprite(width, height);
  eyesLeft = new Group();
  eyesRight = new Group();


  //grass and rocks background texture
  for (var r = 0; r < 50; r++) {
    var grass = createSprite(random(-width, SCENE_W + width), random(doorY + 200, SCENE_H + height));
    //cycles through grass 0 1 2
    grass.addAnimation('breeze', '../assets/sprites/grass/grass1.png', '../assets/sprites/grass/grass2.png', '../assets/sprites/grass/grass3.png');
    bg.add(grass);
  }
  
  //door
  door.addAnimation('closed', '../assets/sprites/door/door1.png');
  door.addAnimation('open', '../assets/sprites/door/door2.png');

  //ferryman
  var ferrymanMove = ferryman.addAnimation('idle',
    '../assets/sprites/ferryman_new/lantern/ferryman_lantern_4.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_5.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_6.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_7.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_8.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_9.png');

  ferryman.addAnimation('moving', '../assets/sprites/ferryman_new/walk/ferryman_walk_1.png', '../assets/sprites/ferryman_new/walk/ferryman_walk_2.png', '../assets/sprites/ferryman_new/walk/ferryman_walk_3.png', '../assets/sprites/ferryman_new/walk/ferryman_walk_4.png', '../assets/sprites/ferryman_new/walk/ferryman_walk_5.png');

  //eyes
  for (var i = 0; i < 25; i++) {
    var newEyeLeft = createSprite(random(0, width - 200), random(0, height * 2));
    newEyeLeft.addAnimation('blinking', '../assets/sprites/eye/eye_1.png', '../assets/sprites/eye/eye_2.png', '../assets/sprites/eye/eye_3.png', '../assets/sprites/eye/eye_2.png');
    eyesLeft.add(newEyeLeft);
  }

  for (var j = 0; j < 25; j++) {
    var newEyeRight = createSprite(random(width + 200, width * 2), random(0, height * 2));
    newEyeRight.addAnimation('blinking', '../assets/sprites/eye/eye_1.png', '../assets/sprites/eye/eye_2.png', '../assets/sprites/eye/eye_3.png', '../assets/sprites/eye/eye_2.png');
    eyesRight.add(newEyeRight);
  }

  //darkness
  extraCanvas = createGraphics(width * 3 + width, height * 3 + height);
  extraCanvas.background(16, 0, 86, dim);

  //key
  collectibles = createSprite(random(0 + 200, width * 2 - 200), (0 + 200, height * 2 - 200));
  collectibles.addAnimation('normal', '../assets/sprites/key.png');
}


function draw() {
  background(50, 2, 44);

  //set the camera position to the ferryman position
  camera.position.x = ferryman.position.x;
  camera.position.y = ferryman.position.y;


  //accelerate with shift
  if ((keyIsDown(16)) && (stamina >= 0)) {
    speedleftup -= 0.2;
    speedrightdown += 0.2;
    stamina -= 2.5;
  } else {
    speedleftup = 0;
    speedrightdown = 0;
    stamina += 2;
  }
  //keep stamina within 0 to 300 points
  if (stamina >= 300) {
    stamina = 300;
  }
  if (stamina <= 0) {
    stamina = 0;
  }
  //if stamina runs out, cannot run anymore
  if (stamina == 0) {
    ferryman.velocity.x = -4;
    ferryman.velocity.y = -4;
    speedleftup = 0;
    speedrightdown = 0;
  }

  //control ferryman with WASD
  //left with A
  if (keyIsDown(65)) {
    ferryman.changeAnimation('moving');
    ferryman.mirrorX(-1);
    ferryman.velocity.x = -4 + speedleftup;
    facing = -1;
    isidle = 1;
  }
  //right with D
  else if (keyIsDown(68)) {
    ferryman.changeAnimation('moving');
    ferryman.mirrorX(1);
    ferryman.velocity.x = 4 + speedrightdown;
    facing = 1;
    isidle = 1;
  }
  //down with S
  else if (keyIsDown(83)) {
    ferryman.changeAnimation('moving');
    ferryman.velocity.y = 4 + speedrightdown;
    isidle = 1;
  }
  //up with W
  else if (keyIsDown(87)) {
    ferryman.changeAnimation('moving');
    ferryman.velocity.y = -4 + speedleftup;
    isidle = 1;
  } else {
    ferryman.changeAnimation('idle');
    ferryman.velocity.x = 0;
    ferryman.velocity.y = 0;
    isidle = 0;
  }

  //trapping him inside the canvas area >:3c
  if (ferryman.position.x < 0)
    ferryman.position.x = 0;
  if (ferryman.position.y < doorY + 100)
    ferryman.position.y = doorY + 100;
  if (ferryman.position.x > windowWidth * 2)
    ferryman.position.x = windowWidth * 2;
  if (ferryman.position.y > windowHeight * 2)
    ferryman.position.y = windowHeight * 2;


  // eyes positioning
  for (var i = 0; i < eyesLeft.length; i++) {
    var f = eyesLeft[i];
    f.position.x += sin(frameCount / 50);
    f.position.y += sin(frameCount / 50);

    //Make ferryman take damage and move away when touching an eye
    if (ferryman.overlapPoint(f.position.x, f.position.y)) {
      health -= 5;
      // ferryman.collide(eyesLeft);
      eyesLeft.displace(ferryman);
      chomp.play();
    }

    //displacing an eye
    var c1 = ferryman.position.x + 185
    if (facing == -1) {
      c1 = ferryman.position.x - 185
    } else {
      c1 = ferryman.position.x + 185
    }

    var eyeleft_north = f.position.y + 152;
    var eyeleft_south = f.position.y - 152;
    var eyeleft_east = f.position.x - 65;
    var eyeleft_west = f.position.x + 65;
    if ((c1 > eyeleft_east) && (c1 < eyeleft_west) && (ferryman.position.y + 10 > eyeleft_south) && (ferryman.position.y + 10 < eyeleft_north) && mouseIsPressed) {
      if (stamina > 50) {
        // console.log(true);
        if (facing == -1) {
          f.position.x -= displacefactor;
        } else if (facing == 1) {
          f.position.x += displacefactor;
        }
      }
    }
  }

  for (var j = 0; j < eyesRight.length; j++) {
    var h = eyesRight[j];
    h.position.x -= sin(frameCount / 50);
    h.position.y += sin(frameCount / 50);


    //Make ferryman take damage and move away when touching an eye
    if (ferryman.overlapPoint(h.position.x, h.position.y)) {
      health -= 5;
      // ferryman.collide(eyesRight);
      eyesRight.displace(ferryman);
      chomp.play();
    }

    //displacing an eye
    var c2 = ferryman.position.x + 185
    if (facing == -1) {
      c2 = ferryman.position.x - 185
    } else {
      c2 = ferryman.position.x + 185
    }
    var eyeright_north = h.position.y + 152;
    var eyeright_south = h.position.y - 152;
    var eyeright_east = h.position.x - 65;
    var eyeright_west = h.position.x + 65;
    if ((c2 > eyeright_east) && (c2 < eyeright_west) && (ferryman.position.y + 10 > eyeright_south) && (ferryman.position.y + 10 < eyeright_north) && mouseIsPressed) {
      if (stamina > 50) {
        // console.log(true);
        if (facing == -1) {
          h.position.x -= displacefactor;
        } else if (facing == 1) {
          h.position.x += displacefactor;
        }
      }
    }
  }

//to pick up the key
  ferryman.overlap(collectibles, collect);

  frameRate(46.5);
  drawSprites(bg);
  drawSprites(splat);
  drawSprites(eyesLeft);
  drawSprites(eyesRight);
  drawSprite(collectibles);
  
  if (keygot > 0) {
    openDoor();
  }
  
  if (doorisopen == 1) {
    door_open.play();
  }
  
  if (doorisopen > 0) {
    door.changeAnimation('open');
  } else {
    door.changeAnimation('closed');
  }

  //light
  noStroke();
  fill(38, 9, 159, 70);
  ellipse(ferryman.position.x, ferryman.position.y + 170, 250, 70);
  drawSprite(ferryman);

  //darkness
  fill(16, 0, 86, dim);
  rect(-(width / 2 + width / 4), -(height / 2 + width / 4), width * 3 + width, height * 3 + height);

  //make the light circle smaller if ferryman is moving
  if (isidle == 0) {
    ellipseMode(CENTER);
    noStroke();
    fill(227, 175, 176, 60);
    ellipse(ferryman.position.x, ferryman.position.y, 450, 450);
  } else {
    ellipseMode(CENTER);
    noStroke();
    fill(227, 175, 176, 30);
    ellipse(ferryman.position.x, ferryman.position.y, 400, 400);
  }
  
  //health bar
  push();
  noStroke();
  fill('#E3AFB0');
  rect(camera.position.x - width / 2 + 15 - ferryman.velocity.x, camera.position.y - height / 2 + 15 - ferryman.velocity.y, 310, 30);
  fill(227, 20, 94);
  rect(camera.position.x - width / 2 + 20 - ferryman.velocity.x, camera.position.y - height / 2 + 20 - ferryman.velocity.y, health, 20);
  //stamina bar
  fill('#E3AFB0');
  rect(camera.position.x - width / 2 + 15 - ferryman.velocity.x, camera.position.y - height / 2 + 55 - ferryman.velocity.y, 310, 30);
  noStroke();
  fill(38, 9, 159);
  rect(camera.position.x - width / 2 + 20 - ferryman.velocity.x, camera.position.y - height / 2 + 60 - ferryman.velocity.y, stamina, 20);
  pop();
    
    push();
    noStroke();
    fill('white');
    textFont(Titillium);
    textAlign(LEFT, CENTER);
    textSize(16);
    text('health', camera.position.x - width / 2 + 25 - ferryman.velocity.x, camera.position.y - height / 2 + 25 - ferryman.velocity.y, health);
    text('stamina', camera.position.x - width / 2 + 25 - ferryman.velocity.x, camera.position.y - height / 2 + 65 - ferryman.velocity.y);
    pop();


  //keep health within 0 to 300 points
  if (health >= 300) {
    health = 300;
  }
  if (health <= 0) {
    health = 0;
  }

  //What happens upon 'death', ie health running out
  if (health <= 0) {
    health = 300;
    ferryman.position.x = width / 2;
    ferryman.position.y = height - 130;
  }

  // //zoom out only for debug purposes; if you can't find the key on your own.
  // if (mouseIsPressed)
  //   camera.zoom = 0.5;
  // else
  //   camera.zoom = 1;
}



function mousePressed() {
  var c = ferryman.position.x + 185

  if (facing == -1) {
    c = ferryman.position.x - 185
  } else {
    c = ferryman.position.x + 185
  }

  if (stamina > 30) {
    var splat = createSprite(c, ferryman.position.y + 10);
    splat.addAnimation('normal', '../assets/sprites/poof/poof_1.png', '../assets/sprites/poof/poof_2.png', '../assets/sprites/poof/poof_3.png', '../assets/sprites/poof/poof_2.png');
    swipe.play();
    stamina -= 30;
    splat.life = 25;
  }
}


function collect(collector, collected) {
  collected.remove();
  keygot += 1;

  if (keygot == 1) {
    key_picked_up.play();
  }
}


function openDoor() {
    var border_north = door.position.y + 135
    var border_south = door.position.y - 20
    var border_east = door.position.x - 70
    var border_west = door.position.x + 70

    if ((ferryman.position.x > border_east) && (ferryman.position.x < border_west) && (ferryman.position.y > border_south) && (ferryman.position.y < border_north) && (keygot > 0)) {
      noStroke();
      fill('white');
      textFont(Titillium);
      textAlign(CENTER, CENTER);
      textSize(36);
      text('press [E] to ENTER', ferryman.position.x, ferryman.position.y - 200);
      doorisopen += 1;
    } else {
      doorisopen = 0;
    }
  
      if ((ferryman.position.x > border_east) && (ferryman.position.x < border_west) && (ferryman.position.y > border_south) && (ferryman.position.y < border_north) && (keygot > 0) && keyIsDown(69)) {
      // console.log(true);
        window.location.href = "../rooms/rage.html"
    }
}