let circles = [];
let canvasScale = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);

  canvasScale = min(width / 1280, height / 720);

  initialiseCircles(1);
}

function draw() {
  background(16, 18, 27);

  updateNoise();

  for (let i = 0; i < circles.length; i++) {
    circles[i].display();
  }
}