class CircleManager {
  constructor() {

    this.circles = [];

   // Set 6 different levels of circle sizes, numbers, colour changing speeds, colour changing ranges and drift speeds.

this.sizeRules = [
  {
    level: 0, radius: 150, count: 1,
    colourSpeed: 0.002, colourRange: 20, driftSpeed: 0.002,
    lifeSeconds: 45, fadeOutSeconds: 6, fadeInSeconds: 3
  },
  {
    level: 1, radius: 85, count: 1,
    colourSpeed: 0.004, colourRange: 20, driftSpeed: 0.002,
    lifeSeconds: 40, fadeOutSeconds: 5, fadeInSeconds: 3
  },
  {
    level: 2, radius: 60, count: 2,
    colourSpeed: 0.006, colourRange: 24, driftSpeed: 0.005,
    lifeSeconds: 35, fadeOutSeconds: 4, fadeInSeconds: 2.5
  },
  {
    level: 3, radius: 40, count: 4,
    colourSpeed: 0.008, colourRange: 28, driftSpeed: 0.005,
    lifeSeconds: 30, fadeOutSeconds: 3, fadeInSeconds: 2
  },
  {
    level: 4, radius: 25, count: 9,
    colourSpeed: 0.010, colourRange: 34, driftSpeed: 0.007,
    lifeSeconds: 25, fadeOutSeconds: 2.5, fadeInSeconds: 1.5
  },
  {
    level: 5, radius: 12, count: 13,
    colourSpeed: 0.012, colourRange: 40, driftSpeed: 0.007,
    lifeSeconds: 20, fadeOutSeconds: 2, fadeInSeconds: 1.5
  }
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


// AI used
// Maximum number of circles changing in one size category.
getMaxChanging(level) {
  let count = this.sizeRules[level].count;
  return max(1, floor(count / 2));
}

// Replace one circle after it has completely faded out.
replaceCircle(index) {
  let oldCircle = this.circles[index];
  let sizeRule = this.sizeRules[oldCircle.sizeLevel];

  let newCircle = createReplacementCircle(oldCircle, sizeRule);
  this.circles[index] = newCircle;

  return newCircle;
}


  displayCircles() {
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].display();
    }
  }
}

