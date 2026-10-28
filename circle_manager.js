class CircleManager {
  constructor() {

    this.circles = [];


    this.sizeRules = [
      { radius: 150, count: 1 },
      { radius: 85, count: 1 },
      { radius: 60, count: 2 },
      { radius: 40, count: 4 },
      { radius: 25, count: 9 },
      { radius: 12, count: 13 }
    ];


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

