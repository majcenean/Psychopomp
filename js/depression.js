var ferryman;
var spirits;
var flames;
var speedleftup = 0;
var speedrightdown = 0;
var health = 300;
var stamina = 300;
var splat;
var facing = 1;
var canpush = 1;
var soundvar = 0;
var door;
var doorisopen = 0;
var doorY = 300;
var Titillium;

function preload() {
    swipe = loadSound('../assets/sfx/swipe.mp3');
    portal = loadSound('../assets/sfx/portal.mp3');
    portal_open = loadSound('../assets/sfx/portal_open.mp3');
    door_open = loadSound('../assets/sfx/door_open.mp3');
    Titillium = loadFont('../assets/typeface/Titillium.otf');
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    door = createSprite(width / 2, doorY);
    flames = createSprite(width / 2, height / 2 + 250);
    ferryman = createSprite(width / 2, height - 130);
    spirits = new Group();


    door.addAnimation('closed', '../assets/sprites/door/door1.png');
    door.addAnimation('open', '../assets/sprites/door/door2.png');

    var ferrymanMove = ferryman.addAnimation('idle',
        '../assets/sprites/ferryman_new/lantern/ferryman_lantern_4.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_5.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_6.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_7.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_8.png', '../assets/sprites/ferryman_new/lantern/ferryman_lantern_9.png');

    ferryman.addAnimation('moving', '../assets/sprites/ferryman_new/walk/ferryman_walk_1.png', '../assets/sprites/ferryman_new/walk/ferryman_walk_2.png', '../assets/sprites/ferryman_new/walk/ferryman_walk_3.png', '../assets/sprites/ferryman_new/walk/ferryman_walk_4.png', '../assets/sprites/ferryman_new/walk/ferryman_walk_5.png');

    //spirits
    // north
    var newSpirit_boreas = createSprite(random(0, width), random(0, height / 2));
    newSpirit_boreas.addAnimation('floating', '../assets/sprites/spirit/spirit_1.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_3.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_2.png');
    spirits.add(newSpirit_boreas);

    // south
    var newSpirit_notus = createSprite(random(0, width), random((height / 2), height));
    newSpirit_notus.addAnimation('floating', '../assets/sprites/spirit/spirit_1.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_3.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_2.png');
    spirits.add(newSpirit_notus);

    // east
    var newSpirit_eurus = createSprite(random((width / 2), width), random(0, height));
    newSpirit_eurus.addAnimation('floating', '../assets/sprites/spirit/spirit_1.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_3.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_2.png');
    spirits.add(newSpirit_eurus);

    // west
    var newSpirit_zephyrus = createSprite(random(0, width / 2), random(0, height));
    newSpirit_zephyrus.addAnimation('floating', '../assets/sprites/spirit/spirit_1.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_3.png', '../assets/sprites/spirit/spirit_2.png', '../assets/sprites/spirit/spirit_2.png');
    spirits.add(newSpirit_zephyrus);

    var flamesMove = flames.addAnimation('inactive',
        '../assets/sprites/flames/flames_0.png');

    flames.addAnimation('active', '../assets/sprites/flames/flames_1.png', '../assets/sprites/flames/flames_2.png', '../assets/sprites/flames/flames_3.png');
}

function draw() {
    background(16, 0, 86);

    //accelerate with shift
    if ((keyIsDown(16)) && (stamina >= 0)) {
        speedleftup -= 0.2;
        speedrightdown += 0.2;
        stamina -= 2.5;
    } else {
        speedleftup = 0;
        speedrightdown = 0;
        stamina += 5;
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
    }
    //right with D
    else if (keyIsDown(68)) {
        ferryman.changeAnimation('moving');
        ferryman.mirrorX(1);
        ferryman.velocity.x = 4 + speedrightdown;
        facing = 1;
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

    //spirits positioning
    for (var i = 0; i < spirits.length; i++) {
        var g = spirits[i];
        //moving all the ghosts y following a sin function (sinusoid)
        g.position.y += sin(frameCount / 10);


        if (canpush == 1) {
            //move spirits left 
            if ((ferryman.position.x >= g.position.x) && (ferryman.position.x <= g.position.x + 150)) {
                g.position.x -= 5;
            }
            //move spirits right 
            if ((ferryman.position.x <= g.position.x) && (ferryman.position.x >= g.position.x - 150)) {
                g.position.x += 5;
            }
            //move spirits up 
            if ((ferryman.position.y <= g.position.y) && (ferryman.position.y >= g.position.y - 150)) {
                g.position.y += 5;
            }
            //move spirits down
            if ((ferryman.position.y >= g.position.y) && (ferryman.position.y <= g.position.y + 150)) {
                g.position.y -= 5;
            }
        }

        //make spirits stay in canvas frame
        if (g.position.x <= 0 + 30) {
            g.position.x = 0 + 30;
        }
        if (g.position.x >= width - 30) {
            g.position.x = width - 30;
        }
        if (g.position.y >= height - 30) {
            g.position.y = height - 30;
        }
        if (g.position.y <= doorY + 100 + 30) {
            g.position.y = doorY + 100 + 30;
        }

        //activating the portal
        var border_north = flames.position.y + 20
        var border_south = flames.position.y - 20
        var border_east = flames.position.x - 40
        var border_west = flames.position.x + 40


        if ((g.position.x > border_east) && (g.position.x < border_west) && (g.position.y > border_south) && (g.position.y < border_north)) {
            flames.changeAnimation('active');
            border_north += sin(frameCount / 10);
            border_south -= sin(frameCount / 10);
            border_east -= sin(frameCount / 10);
            border_west += sin(frameCount / 10);
            canpush = 0;
            soundvar += 1;
            doorisopen += 1;
        }
    }

    if (soundvar == 1) {
        portal_open.play();
    }


    frameRate(46.5);
    drawSprite(flames);
    drawSprite(door);
    drawSprite(ferryman);
    drawSprites(spirits);
    drawSprites(splat);

    if (doorisopen == 1) {
        door.changeAnimation('open');
        door_open.play();
    }

    if (doorisopen > 0) {
        openDoor();
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
}


function mousePressed() {
    //create a sprite

    var c = ferryman.position.x + 65

    if (facing == -1) {
        c = ferryman.position.x - 65
    } else {
        c = ferryman.position.x + 65
    }

    if (stamina > 30) {
        var splat = createSprite(c, ferryman.position.y + 10);
        splat.addAnimation('normal', '../assets/sprites/poof/poof_1.png', '../assets/sprites/poof/poof_2.png', '../assets/sprites/poof/poof_3.png', '../assets/sprites/poof/poof_2.png');
        swipe.play();
        stamina -= 30;
        splat.life = 25;
    }
}


function openDoor() {
    var border_north = door.position.y + 135
    var border_south = door.position.y - 20
    var border_east = door.position.x - 70
    var border_west = door.position.x + 70

    if ((ferryman.position.x > border_east) && (ferryman.position.x < border_west) && (ferryman.position.y > border_south) && (ferryman.position.y < border_north)) {
        noStroke();
        fill('white');
        textFont(Titillium);
        textAlign(CENTER, CENTER);
        textSize(36);
        text('press [E] to ENTER', ferryman.position.x, ferryman.position.y - 200);
    }

    if ((ferryman.position.x > border_east) && (ferryman.position.x < border_west) && (ferryman.position.y > border_south) && (ferryman.position.y < border_north) && keyIsDown(69)) {
        window.location.href = "../rooms/anxiety.html"
    }
}
