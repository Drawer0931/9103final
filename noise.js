// Generate the initial composition using the shared manager.
function initialiseCircles(seed, manager) {
  randomSeed(seed);
  noiseSeed(seed);

  
  manager.circles = [];


  let sizes = [];

  for (let i = 0; i < manager.sizeRules.length; i++) {
    for (let j = 0; j < manager.sizeRules[i].count; j++) {
      sizes.push(manager.sizeRules[i].radius);
    }
  }

  let totalCount = sizes.length;

  for (let i = 0; i < totalCount; i++) {
    // Select a radius and apply the canvas scale.
    let sizeIndex = floor(random(sizes.length));
    let radius = sizes[sizeIndex] * canvasScale;

    // Remove the selected item to keep each size count fixed.
    sizes.splice(sizeIndex, 1);

    // Leave space for the circle and its movement.
    let margin = radius + 60 * canvasScale;

    let spreadX = width * 0.35;
    let spreadY = 220 * canvasScale;

    let left = max(margin, width / 2 - spreadX);
    let right = min(width - margin, width / 2 + spreadX);

    let top = max(margin, height / 2 - spreadY);
    let bottom = min(height - margin, height / 2 + spreadY);

    // Generate position and opacity.
    let x = random(left, right);
    let y = random(top, bottom);

    let opacity = random(100, 190);

    // Select a colour from the manager's palette.
    let chosenColour = random(manager.palette);

    let newCircle = new Circle(
      x,
      y,
      radius,
      chosenColour[0],
      chosenColour[1],
      chosenColour[2],
      opacity,
      0.1,
      40
    );

    // Set independent noise starting points.
    newCircle.noiseX = random(1000);
    newCircle.noiseY = random(1000);

    // Add the circle to the shared collection.
    manager.circles.push(newCircle);
  }
}

// Update positions using Perlin noise.
function updateNoise(manager) {
  for (let i = 0; i < manager.circles.length; i++) {
    let currentCircle = manager.circles[i];

    let valueX = noise(currentCircle.noiseX);
    let valueY = noise(currentCircle.noiseY);

    let driftRange = 60 * canvasScale;

    let drifX = map(valueX, 0, 1, -driftRange, driftRange);
    let drifY = map(valueY, 0, 1, -driftRange, driftRange);

    currentCircle.x = currentCircle.baseX + drifX;
    currentCircle.y = currentCircle.baseY + drifY;

    // Slowly advance the noise sampling positions.
    currentCircle.noiseX = currentCircle.noiseX + 0.005;
    currentCircle.noiseY = currentCircle.noiseY + 0.005;
  }
}