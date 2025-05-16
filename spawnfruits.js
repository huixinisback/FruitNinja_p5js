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
    }
  }
}

// Function to create a fruit
function spawnFruit() {
  let fruit = new fruits.Sprite(random(100, 700), height + 20, 40); // spawn at bottom
  fruit.img = peachImg
  fruit.vel.y = random(-10, -15); // shoot upward
  fruit.vel.x = random(-3, 3); // give sideways curve
  fruit.drag = 0.5; // slow down horizontally
}
