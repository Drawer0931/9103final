// Shared noise sampling positions for the whole group.
let groupNoiseX = 0;
let groupNoiseY = 1000;

// Shared movement speed.
let groupDriftSpeed = 0.004;

// Noise progress for the background around the circles.
let regionNoiseTime = 0;

// Generate the initial composition using the shared manager.
function initialiseCircles(seed, manager) {
  randomSeed(seed);
  noiseSeed(seed);
  
  // Restart the group movement when the composition resets.
  groupNoiseX = 0;
  groupNoiseY = 1000;
  regionNoiseTime = 0;
  manager.circles = [];

  // Build a list of size rules.
  // Each item contains a radius and its colour speed.
  let sizes = [];

  for (let i = 0; i < manager.sizeRules.length; i++) {
    for (let j = 0; j < manager.sizeRules[i].count; j++) {
      sizes.push(manager.sizeRules[i]);
    }
  }

  let totalCount = sizes.length;

  for (let i = 0; i < totalCount; i++) {
    // Select a size rule and apply the canvas scale.
    let sizeIndex = floor(random(sizes.length));
    let sizeRule = sizes[sizeIndex];
    let radius = sizeRule.radius * canvasScale;

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
      opacity
    );

    // Assign the colour speed for this size category.
    newCircle.colourSpeed = sizeRule.colourSpeed;
    newCircle.colourRange = sizeRule.colourRange;
    newCircle.driftSpeed = sizeRule.driftSpeed;

    // Set independent noise starting points for movement.
    newCircle.noiseX = random(1000);
    newCircle.noiseY = random(1000);

    manager.circles.push(newCircle);
  }

  // Initialise colour noise after generating all circles.
  // This preserves the original composition for each seed.
  for (let i = 0; i < manager.circles.length; i++) {
    let currentCircle = manager.circles[i];

    currentCircle.noiseRed = random(1000);
    currentCircle.noiseGreen = random(1000, 2000);
    currentCircle.noiseBlue = random(2000, 3000);
  }
}

// Update group movement, individual movement and colours.
function updateNoise(manager) {
  // Calculate the shared movement once per frame.
  let groupRange = 25 * canvasScale;

  let groupDriftX = map(
    noise(groupNoiseX),
    0, 1,
    -groupRange, groupRange
  );

  let groupDriftY = map(
    noise(groupNoiseY),
    0, 1,
    -groupRange, groupRange
  );

  // Advance the shared noise sampling positions.
  groupNoiseX = groupNoiseX + groupDriftSpeed;
  groupNoiseY = groupNoiseY + groupDriftSpeed;

  for (let i = 0; i < manager.circles.length; i++) {
    let currentCircle = manager.circles[i];

    // Individual movement
    let valueX = noise(currentCircle.noiseX);
    let valueY = noise(currentCircle.noiseY);

    // Keep individual movement smaller than group movement.
    let driftRange = 35 * canvasScale;

    let drifX = map(
      valueX, 0, 1, -driftRange, driftRange
    );

    let drifY = map(
      valueY, 0, 1, -driftRange, driftRange
    );

    // Combine base position, group drift and individual drift.
    currentCircle.x =
      currentCircle.baseX + groupDriftX + drifX;

    currentCircle.y =
      currentCircle.baseY + groupDriftY + drifY;

    // Keep the three individual speed levels.
    currentCircle.noiseX =
      currentCircle.noiseX + currentCircle.driftSpeed;

    currentCircle.noiseY =
      currentCircle.noiseY + currentCircle.driftSpeed;

    // Colour
    let valueRed = noise(currentCircle.noiseRed);
    let valueGreen = noise(currentCircle.noiseGreen);
    let valueBlue = noise(currentCircle.noiseBlue);

    let colourRange = currentCircle.colourRange;

    let redOffset = map(
      valueRed, 0, 1, -colourRange, colourRange
    );

    let greenOffset = map(
      valueGreen, 0, 1, -colourRange, colourRange
    );

    let blueOffset = map(
      valueBlue, 0, 1, -colourRange, colourRange
    );

    // Calculate from the base colour and stay within 0–255.
    currentCircle.red = max(
      0,
      min(255, currentCircle.baseRed + redOffset)
    );

    currentCircle.green = max(
      0,
      min(255, currentCircle.baseGreen + greenOffset)
    );

    currentCircle.blue = max(
      0,
      min(255, currentCircle.baseBlue + blueOffset)
    );

    // Advance colour noise using this circle's own speed.
    currentCircle.noiseRed =
      currentCircle.noiseRed + currentCircle.colourSpeed;

    currentCircle.noiseGreen =
      currentCircle.noiseGreen + currentCircle.colourSpeed;

    currentCircle.noiseBlue =
      currentCircle.noiseBlue + currentCircle.colourSpeed;
  }
}

function drawCircleBackground(manager) {
  // Calculate the outward distance from each circle's edge.
  let spread = map(
  noise(regionNoiseTime),
  0, 1,
  80, 200
  );

  spread = spread * canvasScale;

  // Keep the background colour strength low and constant.
  let shade = 0.6;

  let layers = 40;

  push();
  blendMode(BLEND);
  ellipseMode(CENTER);
  noStroke();

  // Draw from the outermost layer toward the circles.
  for (let layer = layers; layer >= 0; layer--) {
    let padding = map(
      layer, 0, layers,
      0, spread
    );

    let strength = map(
      layer, 0, layers,
      1, 0
    );

    // Keep the inner area even and fade toward the outside.
    strength = min(1, strength * 2);
    strength = strength * shade;

    // Use the same colour for every circle at this layer.
    fill(
      16 + 6 * strength,
      18 + 8 * strength,
      27 + 12 * strength
    );

    for (let i = 0; i < manager.circles.length; i++) {
      let c = manager.circles[i];

      let backgroundRadius = c.baseRadius + padding;

      circle(
        c.x,
        c.y,
        backgroundRadius * 2
      );
    }
  }

  pop();

  // Slowly advance the background noise.
  regionNoiseTime = regionNoiseTime + 0.008;
}