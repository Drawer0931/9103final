// input-mechanic.js
// Owner: Yiwen

// "push" or "grab". Press Tab to switch.
let currentMode = "push";

// Push mode 
let pushRange = 120;   // how close the mouse 
let pushStrength = 6;  // the biggest distance circle moves per frame

// Grab mode 
let heldCircle = null; 
let grabOffsetX = 0;   
let grabOffsetY = 0;


// AI assistance: ChatGPT helped with the implementation of blend modes and colour filters.
// Blend mode. normal, difference, black and white, invert
let blendModeIndex = 0;

function updateInput(manager) {
  if (currentMode === "push") {
    pushCircles(manager);
  } else if (currentMode === "grab") {
    dragHeldCircle();
  }

  // blendMode Source: https://p5js.org/reference/p5/blendMode/
  blendMode(getBlendModes()[blendModeIndex]);
}


// put the blend mode back to normal 
function finishInput() {
  blendMode(BLEND);

  // filter Source: https://p5js.org/reference/p5/filter/
  if (blendModeIndex === 2) {
    filter(GRAY);   
  } else if (blendModeIndex === 3) {
    filter(INVERT); 
  }
}



function getBlendModes() {
  return [BLEND, DIFFERENCE, BLEND, BLEND];
}


function getCurrentRadius(circle) {
  return circle.baseRadius;
}

// Push 
function pushCircles(manager) {
  let range = pushRange * canvasScale;
  let maxStep = pushStrength * canvasScale;

  for (let i = 0; i < manager.circles.length; i++) {
    let currentCircle = manager.circles[i];

    let distanceToCentre = dist(mouseX, mouseY, currentCircle.x, currentCircle.y);

    // Distance from the mouse to the circle 
    // Measure from the edge 
    let distanceToEdge = max(0, distanceToCentre - getCurrentRadius(currentCircle));

    if (distanceToEdge < range && distanceToCentre > 0) {
      // Closer to the mouse = bigger step
      let step = map(distanceToEdge, 0, range, maxStep, 0);

      let directionX = (currentCircle.x - mouseX) / distanceToCentre;
      let directionY = (currentCircle.y - mouseY) / distanceToCentre;

      // Move the base position
      currentCircle.baseX = currentCircle.baseX + directionX * step;
      currentCircle.baseY = currentCircle.baseY + directionY * step;

      keepInsideCanvas(currentCircle);
    }
  }
}

// Grab 
function dragHeldCircle() {
  if (heldCircle === null) {
    return;
  }
// AI assistance: ChatGPT helped with the drag offset calculation
  let targetX = mouseX + grabOffsetX;
  let targetY = mouseY + grabOffsetY;

  
  let driftX = heldCircle.x - heldCircle.baseX;
  let driftY = heldCircle.y - heldCircle.baseY;
  heldCircle.baseX = targetX - driftX;
  heldCircle.baseY = targetY - driftY;

  keepInsideCanvas(heldCircle);
}

// Keep a circle's base position inside the canvas 
function keepInsideCanvas(circle) {
  let margin = circle.baseRadius + 60 * canvasScale;
  circle.baseX = max(margin, min(width - margin, circle.baseX));
  circle.baseY = max(margin, min(height - margin, circle.baseY));
}

function mousePressed() {
  if (currentMode !== "grab") {
    return;
  }

  // Check the top circles first
  for (let i = circleManager.circles.length - 1; i >= 0; i--) {
    let currentCircle = circleManager.circles[i];
    let distanceToCentre = dist(mouseX, mouseY, currentCircle.x, currentCircle.y);

    if (distanceToCentre <= getCurrentRadius(currentCircle)) {
      heldCircle = currentCircle;
      grabOffsetX = currentCircle.x - mouseX;
      grabOffsetY = currentCircle.y - mouseY;
      break; // stop after the first hit
    }
  }
}

function mouseReleased() {
  heldCircle = null;
}

// Key pressed
function keyPressed() {
  if (key === "Tab") {
    if (currentMode === "push") {
      currentMode = "grab";
    } else {
      currentMode = "push";
    }
    heldCircle = null; 

    // stop 
    return false;
  }

  // M: next blend mode 
  if (key === "m" || key === "M") {
    blendModeIndex = (blendModeIndex + 1) % getBlendModes().length;
  }

  // R: new random composition
  if (key === "r" || key === "R") {
    heldCircle = null; // the old circles are about to be replaced

    // every press gives a different seed.
    let newSeed = floor(millis());
    initialiseCircles(newSeed, circleManager);
  }
}