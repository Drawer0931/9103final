let circleManager;
let canvasScale = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);

  canvasScale = min(width / 1280, height / 720);

  // Create one shared manager.
  circleManager = new CircleManager();


  initialiseCircles(1, circleManager);
}

function draw() {
  background(16, 18, 27);

  // Handle mouse input first.
  updateInput(circleManager);

  // Update circle movement and colours.
  updateNoise(circleManager);

  // Draw the background around the circles.
  drawCircleBackground(circleManager);

  // Draw the circles.
  circleManager.displayCircles();
}