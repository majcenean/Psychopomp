// var bg;
var ferryman;
var snakes;
var rain;
var splat;
var speedleftup = 0;
var speedrightdown = 0;
var health = 300;
var stamina = 300;
var facing = 1;
var door;
var doorisopen = 0;
var doorY = 300;
let Titillium;
var GRAVITY = 1;

function preload() {
  swipe = loadSound('../assets/sfx/swipe.mp3');
  hiss = loadSound('../assets/sfx/hiss.mp3');
  door_open = loadSound('../assets/sfx/door_open.mp3');
  Titillium = loadFont('../assets/typeface/Titillium.otf');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // bg = new Group();
  door = createSprite(width/2, doorY);
  ferryman = createSprite(width / 2, height - 30);
  snakes = new Group();
  rain = new Group();
  
  door.addAnimation('closed', '../assets/sprites/door/door1.png');
  door.addAnimation('open', '../assets/sprites/door/door2.png');

  var ferrymanMove = ferryman.addAnimation('idle',
    '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_4.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_5.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_6.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_5.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_4.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_7.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_8.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_7.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_4.png', '../assets/sprites/ferryman_rain/lantern/ferryman_rain_lantern_4.png');

  ferryman.addAnimation('moving', '../assets/sprites/ferryman_rain/walk/ferryman_rain_walk_1.png', '../assets/sprites/ferryman_rain/walk/ferryman_rain_walk_2.png', '../assets/sprites/ferryman_rain/walk/ferryman_rain_walk_3.png', '../assets/sprites/ferryman_rain/walk/ferryman_rain_walk_4.png', '../assets/sprites/ferryman_rain/walk/ferryman_rain_walk_5.png');

  //for a group of snakes
  for (var i = 0; i < 30; i++) {
    var newSnake = createSprite(random(0, width + 100), random(doorY + 300, height - 420));
    newSnake.addAnimation('slithering', '../assets/sprites/snakes/snake1_smaller.png', '../assets/sprites/snakes/snake2_smaller.png', '../assets/sprites/snakes/snake3_smaller.png');
    newSnake.rotationSpeed = -0.15;
    snakes.add(newSnake);
  }

  //for rain
  for (var r = 0; r < 20; r++) {
    var newRain = createSprite(random(0, width), random(0, height));
    newRain.addAnimation('falling', '../assets/sprites/rain/rain1.png', '../assets/sprites/rain/rain2.png');
    rain.add(newRain);
  }
}

function draw() {
  background(208, 20, 94);

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
    facing = -1
  }
  //right with D
  else if (keyIsDown(68)) {
    ferryman.changeAnimation('moving');
    ferryman.mirrorX(1);
    ferryman.velocity.x = 4 + speedrightdown;
    facing = 1
  }
  //down with S
  else if (keyIsDown(83)) {
    ferryman.changeAnimation('moving');
    ferryman.velocity.y = 4 + speedrightdown;
  }
  //up with W
  else if (keyIsDown(87)) {
    ferryman.changeAnimation('moving');
    ferryman.velocity.y = -4 + speedleftup;
  } else {
    ferryman.changeAnimation('idle');
    ferryman.velocity.x = 0;
    ferryman.velocity.y = 0;
  }

  //trapping him inside the canvas area >:3c
  if (ferryman.position.x <= 0) {
    ferryman.position.x = 0;
  }
  if (ferryman.position.x >= width) {
    ferryman.position.x = width;
  }
  if (ferryman.position.y >= height) {
    ferryman.position.y = height;
  }
  if (ferryman.position.y <= doorY + 100) {
    ferryman.position.y = doorY + 100;
  }

  //snakes positioning
  for (var i = 0; i < snakes.length; i++) {
    var g = snakes[i];
    //moving all the snakes y following a sin function (sinusoid)
    g.position.y += sin(frameCount / 10);


    //make snakes stay in canvas frame
    if (g.position.x <= 0) {
      g.position.x = 0;
    }
    if (g.position.x >= width) {
      g.position.x = width;
    }
    if (g.position.y >= height) {
      g.position.y = height;
    }
    if (g.position.y <= doorY + 100) {
      g.position.y = doorY + 100;
    }

    //Make ferryman take damage and move away when touching a snake
    if (ferryman.overlapPoint(g.position.x, g.position.y)) {
      health -= 20;
      ferryman.collide(snakes);
      hiss.play();
    }


    //To kill a mockingbird-- I mean, a snake...
    var border_up = ferryman.position.y + 300
    var border_down = ferryman.position.y - 300
    var border_right = ferryman.position.x - 250
    var border_left = ferryman.position.x + 250

    var snake_north = g.position.y + 170.5
    var snake_south = g.position.y - 170.5
    var snake_east = g.position.x - 50
    var snake_west = g.position.x + 50
    if ((mouseX > snake_east) && (mouseX < snake_west) && (mouseY > snake_south) && (mouseY < snake_north) && (mouseX > border_right) && (mouseX < border_left) && (mouseY > border_down) && (mouseY < border_up) && mouseIsPressed) {
      if (stamina >= 50) {
        g.remove();
      }
    }

  }


  //circle for prediction of range
  var border_north = ferryman.position.y + 300
  var border_south = ferryman.position.y - 300
  var border_east = ferryman.position.x - 250
  var border_west = ferryman.position.x + 250
  if ((mouseX > border_east) && (mouseX < border_west) && (mouseY > border_south) && (mouseY < border_north)) {
    if (stamina > 50) {
      noStroke();
      fill(38, 9, 159, 30);
      ellipseMode(CENTER);
      ellipse(mouseX, mouseY, 70, 70);
      // ellipse(ferryman.position.x, ferryman.position.y, 500, 550);
    }
  }

  //make it rain
  for (var r = 0; r < rain.length; r++) {
    var r2 = rain[r];
    r2.velocity.y += GRAVITY;
    if (r2.velocity.y > 2) {
      r2.velocity.y = 0.5;
    }
    if (r2.position.y > height + 100) {
      r2.position.y = -100;
    }
    
    r2.position.x += random(1, 2);
    r2.position.x -= random(1, 2);
    
    
    if (r2.position.x > width - 100) {
      r2.position.x = width/2;
    } else if (r2.position.x < 100) {
      r2.position.x = width/2;
    }
  }

  frameRate(46.5);
  drawSprites(snakes);
  drawSprite(ferryman);
  drawSprites(rain);
  drawSprites(splat);
  
    var door_north = door.position.y + 135
    var door_south = door.position.y - 20
    var door_east = door.position.x - 70
    var door_west = door.position.x + 70

    if ((ferryman.position.x > door_east) && (ferryman.position.x < door_west) && (ferryman.position.y > door_south) && (ferryman.position.y < door_north)) {
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
  
      if ((ferryman.position.x > door_east) && (ferryman.position.x < door_west) && (ferryman.position.y > door_south) && (ferryman.position.y < door_north) && keyIsDown(69)) {
        window.location.href = "../dialogue/end_door.html"
    }
  
  
  if (doorisopen == 1) {
    door_open.play();
  }
  
  if (doorisopen > 0) {
    door.changeAnimation('open');
  } else {
    door.changeAnimation('closed');
  }

  //health bar
  push();
  noStroke();
  fill('#E3AFB0');
  rect(15, 15, 310, 30);
  fill(227, 20, 94);
  rect(20, 20, health, 20);
  //stamina bar
  fill('#E3AFB0');
  rect(15, 55, 310, 30);
  noStroke();
  fill(38, 9, 159);
  rect(20, 60, stamina, 20);
  pop();
    
    push();
    noStroke();
    fill('white');
    textFont(Titillium);
    textAlign(LEFT, CENTER);
    textSize(16);
    text('health', 25, 25);
    text('stamina', 25, 65);
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

}

function mousePressed() {
  //create a sprite

  //mouse controls where the splat attack occurs
  var border_north = ferryman.position.y + 300
  var border_south = ferryman.position.y - 300
  var border_east = ferryman.position.x - 250
  var border_west = ferryman.position.x + 250
  if ((mouseX > border_east) && (mouseX < border_west) && (mouseY > border_south) && (mouseY < border_north)) {
    if (stamina > 50) {
      var splat = createSprite(mouseX, mouseY);
      splat.addAnimation('normal', '../assets/sprites/poof/poof_1.png', '../assets/sprites/poof/poof_2.png', '../assets/sprites/poof/poof_3.png', '../assets/sprites/poof/poof_2.png');
      swipe.play();
      stamina -= 50;

      //set a self destruction timer (life)
      splat.life = 25;
    }
  }
}
