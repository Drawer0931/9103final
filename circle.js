// Circle size rules, each rule defines a radius and how many circles of that size should be created
let sizeRules = [
  { radius: 150, count: 1 },
  { radius: 85, count: 1 },
  { radius: 60, count: 2 },
  { radius: 40, count: 4 },
  { radius: 25, count: 9 },
  { radius: 12, count: 13 }
];

// Shared color palette for the circles, defined as RGB values
let palette = [
  [58, 79, 158], 
  [70, 139, 183],  
  [54, 128, 126],  
  [143, 158, 103], 
  [144, 124, 174], 
  [214, 139, 153], 
  [190, 70, 62],   
  [220, 178, 63],  
  [234, 216, 158], 
  [205, 207, 218]   
];

// Each circle has a base position, a radius, and a color. 
class Circle {
  constructor(x, y, radius, red, green, blue, opacity) {
    // Current position of the circle
    this.x = x;
    this.y = y;

    // Base position of the circle, used for noise-based movement
    this.baseX = x;
    this.baseY = y;

    // Noise offsets for smooth movement
    this.noiseX = 0;
    this.noiseY = 0;

    // Base radius of the circle
    this.baseRadius = radius;

    // Current color of the circle
    this.red = red;
    this.green = green;
    this.blue = blue;

    // Current opacity of the circle
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