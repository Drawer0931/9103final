// Each circle stores its own properties.
class Circle {
  constructor(x, y, radius, red, green, blue, opacity) {
    // Current position
    this.x = x;
    this.y = y;

    // Base position for noise-based movement
    this.baseX = x;
    this.baseY = y;

    // Noise sampling positions for movement
    this.noiseX = 0;
    this.noiseY = 0;

    // Individual drift speed, assigned from the size rule.
    this.driftSpeed = 0.005;

    // Independent noise sampling positions for colour
    this.noiseRed = 0;
    this.noiseGreen = 0;
    this.noiseBlue = 0;

    // Base radius
    this.baseRadius = radius;

    // Default colour speed, assigned from the size rule when generated.
    this.colourSpeed = 0.01;

    // Maximum colour variation for this circle.
    this.colourRange = 20;

    // Base colour stays unchanged during the animation
    this.baseRed = red;
    this.baseGreen = green;
    this.baseBlue = blue;

    // Current display colour
    this.red = red;
    this.green = green;
    this.blue = blue;

    // Opacity
    this.opacity = opacity;
  }

  display() {
    push();

    noStroke();

    fill(this.red, this.green, this.blue, this.opacity);

    circle(this.x, this.y, this.baseRadius * 2);

    pop();
  }
}