class CircleManager {
  constructor() {

    this.circles = [];

   // Set 6 different levels of circle sizes, numbers, colour changing speeds, colour changing ranges and drift speeds.
this.sizeRules = [
  { radius: 150, count: 1, colourSpeed: 0.002, colourRange: 20, driftSpeed: 0.002 },
  { radius: 85, count: 1, colourSpeed: 0.004, colourRange: 20, driftSpeed: 0.002 },
  { radius: 60, count: 2, colourSpeed: 0.006, colourRange: 24, driftSpeed: 0.005 },
  { radius: 40, count: 4, colourSpeed: 0.008, colourRange: 28, driftSpeed: 0.005 },
  { radius: 25, count: 9, colourSpeed: 0.010, colourRange: 34, driftSpeed: 0.007 },
  { radius: 12, count: 13, colourSpeed: 0.012, colourRange: 40, driftSpeed: 0.007 }
];

  // Set a colour platte to acihieve consistent colour scheme.
    this.palette = [
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
  }

  displayCircles() {
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].display();
    }
  }
}

