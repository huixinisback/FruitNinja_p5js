let fruits;
let fruitHalves;
let trail = []; // store mouse positions
let fruitTypes = []; // store fruit images
let score = 0;
//splash points
let splashEffects = [];

// sound assets
let backgroundTrack;
let sliceSound;


function preload() {
  dojoBG = loadImage('assets/dojobackground.png')
  // Peach
  let peach = {
    whole: loadImage('assets/peachwhole.png'),
    half1: loadImage('assets/peachhalf.png'),
    half2: loadImage('assets/peachhalf2.png'),
    splash: loadImage('assets/peachsplash.png'),
  };

  // Watermelon
  let watermelon = {
    whole: loadImage('assets/watermelonwhole.png'),
    half1: loadImage('assets/watermelonhalf.png'),
    half2: loadImage('assets/watermelonhalf.png'),
    splash: loadImage('assets/watermelonsplash.png'),
  };


  fruitTypes = [peach, watermelon];

  // sound effects
  backgroundTrack = createAudio('assets/fruit-ninja-bgtrack.mp3');
  sliceSound = createAudio('assets/fruit-ninja-combo.mp3');
}

function setup() {
  new Canvas(800, 600);
  world.gravity.y = 10; // Make things fall

  fruits = new Group();
  fruitHalves = new Group();
}

function draw() {
  clear();
  image(dojoBG, 0, 0, width, height); // draw image to fill canvas
  stroke(158, 69, 69); // rgb colour
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);

   backgroundTrack.loop();

  /*
  Frame Count is a built-in variable in p5.js.
  It counts how many frames have been drawn since the sketch started.
  It increments automatically every frame in draw().
 */
  if (frameCount % 60 === 0) {
    spawnFruit();
  }

  // Remove fruits that fall below the screen
  for (let fruit of fruits) {
    if (fruit.y > height + 50) {
      fruit.remove();
      if (score > 0) score -= 1; // deduct for missed fruit
    }
  }

  // Update & draw mouse trail
  updateMouseTrail();

  sliceFruit();

  displaySplash();
  
}

function displaySplash(){
  //display splash
  for (let i = splashEffects.length - 1; i >= 0; i--) {
    let splash = splashEffects[i];
  
    push();
    imageMode(CENTER);
    tint(255, map(splash.life, 0, 30, 0, 255)); // fade out
    image(splash.img, splash.x, splash.y, splash.size, splash.size);
    pop();
  
    splash.life--;
    if (splash.life <= 0) {
      splashEffects.splice(i, 1);
    }
  }
}

// Function to create a fruit
function spawnFruit() {
  let fruitData = random(fruitTypes); // pick one at random
  let fruit = new fruits.Sprite(random(100, 700), height + 20, 40); // spawn at bottom
  fruit.img = fruitData.whole;
  fruit.type = fruitData; // store reference to its type
  fruit.vel.y = random(-10, -15); // shoot upward
  fruit.vel.x = random(-3, 3); // give sideways curve
  fruit.friction = 0; // amount the sprite's physics body resists moving when rubbing against another physics body.
}

// Mouse trail system
function updateMouseTrail() {
  if (mouse.pressing()) {
    trail.push({ x: mouse.x, y: mouse.y, life: 15 }); // store current point
  }

  // Fade + draw lines between trail points
  stroke(255, 100, 100);
  strokeWeight(4);
  noFill();
  for (let i = trail.length - 1; i >= 0; i--) {
    let p1 = trail[i];
  
    // Only draw lines if there's a previous point
    if (i > 0) {
      let p2 = trail[i - 1];
      line(p1.x, p1.y, p2.x, p2.y);
    }
  
    // Decrease life and remove if expired
    p1.life--;
    if (p1.life <= 0) {
      trail.splice(i, 1);
    }
  }
  
  console.log(trail)
}

function sliceFruit() {
  if (!mouse.pressing()) return;
  for (let fruit of fruits) {
    if (fruit.sliced) continue; // skip already sliced fruits

    let d = dist(mouse.x, mouse.y, fruit.x, fruit.y);

    if (d < ((fruit.d / 2) + 5)) {
      fruit.sliced = true; // prevent repeat slicing

      const fx = fruit.x;
      const fy = fruit.y;

      fruit.remove(); // remove whole fruit
      sliceSound.play();

      splitFruit(fx, fy, fruit.type); // spawn halves
      score += 1
      
      break; // only slice one fruit per frame
    }
  }
}



function splitFruit(x, y, fruitData) {
  // Create left half
  let left = new fruitHalves.Sprite(x - 10, y, 40, 40);
  left.img = fruitData.half1;
  left.vel.x = -3;
  left.vel.y = random(-5, -2);
  left.rotationSpeed = -5;
  left.life = 90;

  // Create right half
  let right = new fruitHalves.Sprite(x + 10, y, 40, 40);
  right.img = fruitData.half1;
  right.vel.x = 3;
  right.vel.y = random(-5, -2);
  right.rotationSpeed = 5;
  right.life = 90;

  splashEffects.push({
    x: x,
    y: y,
    img: fruitData.splash,
    size: 80,
    life: 30 // frames to show
  });
}