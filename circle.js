// Each circle stores its own properties.
class Circle {
  constructor(x, y, radius, red, green, blue, opacity, haloBrightness, haloSize) {
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

    this.haloBrightness = haloBrightness;
    this.haloSize = haloSize;

    this.ifPlaying = false;
  }

  display() {
    push();

    noStroke();

    if (this.ifPlaying){
      drawingContext.filter = "blur(20px)";
      for (let i = 2; i > 0; i--) {
        let haloRadius = this.baseRadius + 20 * i;
        let alpha = this.haloBrightness * 20 / i;
        fill(
          this.red,
          this.green,
          this.blue,
          alpha
        );
        circle(this.x, this.y, haloRadius * 2);
      }
      drawingContext.filter = "none";
    }

    /*
    if (this.ifPlaying){
      drawingContext.filter = "blur(15px)";
      for (let i = 5; i > 0; i--) {
        let haloRadius = this.baseRadius + i * 8;
        let alpha = this.haloBrightness * 20 / i;
        fill(
          this.red,
          this.green,
          this.blue,
          alpha
        );
        circle(this.x, this.y, haloRadius * 2);
      }
      drawingContext.filter = "none";
    }
    */

    /*
    let c = color(this.red, this.green, this.blue);
    drawingContext.shadowBlur = 100;
    drawingContext.shadowColor =
      `rgba(${red(c)}, ${green(c)}, ${blue(c)}, ${this.haloBrightness})`;
    */
    
    fill(this.red, this.green, this.blue, this.opacity);

    circle(this.x, this.y, this.baseRadius * 2);

    pop();
  }
}