// input-mechanic.js
// Owner: Yiwen
// This file handles the mouse and keyboard input.

// The current mode. Only "push" for now, "grab" will be added later.
let currentMode = "push";

// Push mode settings (written for a canvas scale of 1, multiplied by canvasScale when used)
let pushRange = 120;   // how close the mouse must be to the EDGE of a circle to push it
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
    let currentCircle = manager.circles[i];

    // dist() gives the distance between two points.
    // It is not covered in class. Source: https://p5js.org/reference/p5/dist/
    let distanceToCentre = dist(mouseX, mouseY, currentCircle.x, currentCircle.y);

    // Distance from the mouse to the edge of the circle (0 if the mouse is inside the circle).
    // Measuring from the edge makes big and small circles start moving at the same distance.
    let distanceToEdge = max(0, distanceToCentre - currentCircle.baseRadius);

    // Only push circles whose edge is inside the range (distanceToCentre > 0 avoids dividing by zero)
    if (distanceToEdge < range && distanceToCentre > 0) {
      // Closer to the mouse = bigger step
      let step = map(distanceToEdge, 0, range, maxStep, 0);

      // Direction from the mouse to the circle, scaled to a length of 1
      let directionX = (currentCircle.x - mouseX) / distanceToCentre;
      let directionY = (currentCircle.y - mouseY) / distanceToCentre;

      // Move the base position, because noise.js rebuilds x and y from it every frame
      currentCircle.baseX = currentCircle.baseX + directionX * step;
      currentCircle.baseY = currentCircle.baseY + directionY * step;

      // Keep the circle inside the canvas (same margin noise.js uses when placing circles)
      let margin = currentCircle.baseRadius + 60 * canvasScale;
      currentCircle.baseX = max(margin, min(width - margin, currentCircle.baseX));
      currentCircle.baseY = max(margin, min(height - margin, currentCircle.baseY));
    }
  }
}