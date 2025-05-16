let fruits;
let fruitHalves;
let trail = []; // store mouse positions
let score = 0;

function preload() {
  dojoBG = loadImage('assets/dojobackground.png')
  peachhalf1 = loadImage('assets/peachhalf.png'); // your sliced image 
  peachhalf2 = loadImage('assets/peachhalf2.png'); // your sliced image 
  peachImg = loadImage('assets/peachwhole.png'); // your sliced image 
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
  // display score
  stroke(0, 0, 0);
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);
  // Spawn a new fruit every 60 frames (~once a second)
  /*
  Frame Count is a built-in variable in p5.js.
  It counts how many frames have been drawn since the sketch started.
  It increments automatically every frame in draw().
 */
  if (frameCount % 30 === 0) {
    spawnFruit();
  }

  // Remove fruits that fall below the screen
  for (let fruit of fruits) {
    if (fruit.y > height + 50) {
      fruit.remove();
      if(score > 0) score -=1;
    }
  }

  sliceFruit();
}

// Function to create a fruit
function spawnFruit() {
  let fruit = new fruits.Sprite(random(100, 700), height + 20, 40); // spawn at bottom
  fruit.img = peachImg
  fruit.vel.y = random(-10, -15); // shoot upward
  fruit.vel.x = random(-3, 3); // give sideways curve
  fruit.drag = 0.5; // slow down horizontally
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

      splitFruit(fx, fy, fruit.type); // spawn halves
      score += 1
      
      break; // only slice one fruit per frame
    }
  }
}

function splitFruit(x, y) {
  // Create left half
  let left = new fruitHalves.Sprite(x - 10, y, 40, 40);
  left.img = peachhalf1;
  left.vel.x = -3;
  left.vel.y = random(-5, -2);
  left.rotationSpeed = -5;
  left.life = 90;

  // Create right half
  let right = new fruitHalves.Sprite(x + 10, y, 40, 40);
  right.img = peachhalf2;
  right.vel.x = 3;
  right.vel.y = random(-5, -2);
  right.rotationSpeed = 5;
  right.life = 90;
}