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

  // Handle mouse and keyboard input.
updateInput(circleManager);

  // Update the shared circles.
  updateNoise(circleManager);

  // Draw the shared circles.
  circleManager.displayCircles();
}