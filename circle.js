// Each circle stores its own properties.
class Circle {
  constructor(x, y, radius, red, green, blue, opacity, haloBrightness, haloSize) {
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

    this.haloBrightness = haloBrightness;
    this.haloSize = haloSize;

    this.ifPlaying = false;
    // Size category and lifecycle state.
  this.sizeLevel = 0;
  this.lifeAlpha = 1;
  this.lifeState = "alive";
  this.stateStartedAt = millis();


    this.flickerFrequency = 1;
    this.flickerPhase = 0;
    this.currentOpacity = this.opacity * this.lifeAlpha;
  }

  display() {
    this.currentOpacity = this.opacity * this.lifeAlpha;
    push();

    noStroke();

    if (this.ifPlaying){
      drawingContext.filter = "blur(20px)";
      for (let i = 2; i > 0; i--) {
        let haloRadius = this.baseRadius + 20 * i;
        let alpha = this.haloBrightness * 32 / i * this.lifeAlpha;
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
    if (this.ifPlaying){
      this.updateFlicker();
    }
    
    //fill(this.red, this.green, this.blue, this.opacity);
    fill(
      this.red,
      this.green,
      this.blue,
      this.currentOpacity
    );

    circle(this.x, this.y, this.baseRadius * 2);

    pop();
  }

  updateFlicker(){
    // Accumlate phase
    // Avoiding sudden shift of phase due to the frequency change
    this.flickerPhase += TWO_PI * this.flickerFrequency * (deltaTime / 1000);

    // calculate flicker intensity
    let flicker = (sin(this.flickerPhase) + 1) / 2;

    // map intensity to opacity
    // using opacity * lifeAlpha as the upper limit
    this.currentOpacity = map(
      flicker,
      0, 1,
      0.5 * this.opacity * this.lifeAlpha, this.opacity * this.lifeAlpha
    );
  }
}