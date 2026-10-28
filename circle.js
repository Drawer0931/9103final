// Each circle stores its own properties.
class Circle {
  constructor(x, y, radius, red, green, blue, opacity) {
    // Current position
    this.x = x;
    this.y = y;

    // Base position for noise-based movement
    this.baseX = x;
    this.baseY = y;

    // Noise sampling positions
    this.noiseX = 0;
    this.noiseY = 0;

    // Base radius
    this.baseRadius = radius;

    // Colour
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