// input-mechanic.js
// Owner: Yiwen
// This file handles the mouse and keyboard input.

// The current mode. Only "push" for now, "grab" will be added later.
let currentMode = "push";

// Push mode settings (written for a canvas scale of 1, multiplied by canvasScale when used)
let pushRange = 150;   // how close the mouse must be to push a circle
let pushStrength = 6;  // the biggest step a circle moves in one frame

// Called once per frame from draw() in sketch.js
function updateInput(manager) {
  if (currentMode === "push") {
    pushCircles(manager);
  }
}

// Push mode: circles near the mouse are gently pushed away
function pushCircles(manager) {
  let range = pushRange * canvasScale;
  let maxStep = pushStrength * canvasScale;

  for (let i = 0; i < manager.circles.length; i++) {
    let c = manager.circles[i];

    // dist() gives the distance between two points.
    // It is not covered in class. Source: https://p5js.org/reference/p5/dist/
    let d = dist(mouseX, mouseY, c.x, c.y);

    // Only push circles inside the range (d > 0 avoids dividing by zero)
    if (d < range && d > 0) {
      // Closer to the mouse = bigger step
      let step = map(d, 0, range, maxStep, 0);

      // Direction from the mouse to the circle, scaled to a length of 1
      let directionX = (c.x - mouseX) / d;
      let directionY = (c.y - mouseY) / d;

      // Move the base position, because noise.js rebuilds x and y from it every frame
      c.baseX = c.baseX + directionX * step;
      c.baseY = c.baseY + directionY * step;

      // Keep the circle inside the canvas (same margin noise.js uses when placing circles)
      let margin = c.baseRadius + 60 * canvasScale;
      c.baseX = max(margin, min(width - margin, c.baseX));
      c.baseY = max(margin, min(height - margin, c.baseY));
    }
  }
}