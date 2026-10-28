// Based on the seed and shared rules, generate the initial composition
function initialiseCircles(seed) {
  randomSeed(seed);
  noiseSeed(seed);

  circles = [];

  // Based on the size rules in circle.js, create a list of radii to be assigned
  let sizes = [];

  for (let i = 0; i < sizeRules.length; i++) {
    for (let j = 0; j < sizeRules[i].count; j++) {
      sizes.push(sizeRules[i].radius);
    }
  }

  let totalCount = sizes.length;

  for (let i = 0; i < totalCount; i++) {
    // Randomly select a radius and scale it according to the canvas size
    let sizeIndex = floor(random(sizes.length));
    let radius = sizes[sizeIndex] * canvasScale;

    // Remove the selected item to ensure fixed counts for each size
    sizes.splice(sizeIndex, 1);

    // Define margins to prevent circles from being too close to the edges of the canva
    let margin = radius + 60 * canvasScale;

    // Using window width for horizontal spread, and original scaled range for vertical spread
    let spreadX = width * 0.35;
    let spreadY = 220 * canvasScale;

    let left = max(margin, width / 2 - spreadX);
    let right = min(width - margin, width / 2 + spreadX);

    let top = max(margin, height / 2 - spreadY);
    let bottom = min(height - margin, height / 2 + spreadY);

    // Randomly generate position and opacity
    let x = random(left, right);
    let y = random(top, bottom);

    let opacity = random(100, 190);

    // Select a color from the shared palette in circle.js
    let chosenColour = random(palette);

    let newCircle = new Circle(
      x,
      y,
      radius,
      chosenColour[0],
      chosenColour[1],
      chosenColour[2],
      opacity
    );

    // Set initial noise offsets for smooth movement
    newCircle.noiseX = random(1000);
    newCircle.noiseY = random(1000);

    circles.push(newCircle);
  }
}

// Update the position of each circle based on Perlin noise to create a drifting effect
function updateNoise() {
  for (let i = 0; i < circles.length; i++) {
    let currentCircle = circles[i];

    let valueX = noise(currentCircle.noiseX);
    let valueY = noise(currentCircle.noiseY);

    // Drift range is scaled based on the canva size to maintain visual consistency across different screen sizes
    let driftRange = 60 * canvasScale;

    let drifX = map(valueX, 0, 1, -driftRange, driftRange);
    let drifY = map(valueY, 0, 1, -driftRange, driftRange);

    currentCircle.x = currentCircle.baseX + drifX;
    currentCircle.y = currentCircle.baseY + drifY;

    // Slowly advance the noise sampling positions
    currentCircle.noiseX = currentCircle.noiseX + 0.005;
    currentCircle.noiseY = currentCircle.noiseY + 0.005;
  }
}