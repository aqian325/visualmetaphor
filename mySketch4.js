let circleGroup = [];
let sA, sB, j;

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  // world.gravity.y = 10;

  // Create group of 4 circles positioned around a center
  for (let i = 0; i < 360; i += 12) {
    let x = width / 2 + cos(i) * 40; // Initial x using cosine function, slightly increased radius
    let y = height / 2 + sin(i) * 40; // Initial y using sine function, slightly increased radius
    circleGroup.push(new CircleSprite(x, y, 30)); // 20 is the radius
  }
  // Connect each circle to every other circle in the group only once
  for (let i = 0; i < circleGroup.length; i++) {
   for (let j = i + 1; j < circleGroup.length; j++) {
            let joint = new DistanceJoint(circleGroup[i], circleGroup[j]);
            joint.springiness = 0.6;
        }
  }
    // Create the sprites sA and sB
    sA = new Sprite(250, 0, 10, 50, 'k');
    sB = new Sprite(100, 20, 20);

    // Create a distance joint between sA and sB
    j = new DistanceJoint(sA, sB);
    j.offsetA.y = 25;
    j.springiness = 0.6;
}

function draw() {
  background(255); // Changed background to white for visibility

  // Draw and update each circle in the group
  circleGroup.forEach(circle => {
      circle.update();
      circle.display();
  });

  // Draw the sprites sA and sB
  sA.moveTowards(mouse);
  sA.display();
  sB.display();
}

// CircleSprite class
class CircleSprite {
  constructor(x, y, radius) {
    this.pos = createVector(x, y);
    this.radius = radius;
    this.angle = atan2(y - height / 2, x - width / 2); // Calculate angle based on position
  
  }

  update() {
    // Move along the circle's edge in a sine wave pattern
    this.pos.x = width / 2 + cos(this.angle) * (40 + sin(frameCount * 3) * 20); // More pronounced movement
    this.pos.y = height / 2 + sin(this.angle) * (40 + sin(frameCount * 5) * 20);
  }

  display() {
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}
