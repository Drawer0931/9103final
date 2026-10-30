let circleManager;
let canvasScale = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);

  pixelDensity(1);   //AI used
  frameRate(60);     // AI used end

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

  circleManager.displayCircles();

  // AI used
  // Show the current frame rate.
  push();
  noStroke();
  fill(255);
  textSize(14);
  text("FPS: " + round(frameRate()), 16, 24);

  // End of AI used
  pop();

}