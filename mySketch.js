let circleGroup = [];

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  // Create group of 4 circles positioned around a center
  for (let i = 0; i < 360; i += 45) {
    let x = width / 2 + cos(i) * 40; // Initial x using cosine function, slightly increased radius
    let y = height / 2 + sin(i) * 40; // Initial y using sine function, slightly increased radius
    circleGroup.push(new CircleSprite(x, y, 30)); // 20 is the radius
  }
}

function draw() {
  background(0); // Changed background to white for visibility
//   stroke(200);
//   strokeWeight(2);
	noStroke();
  	fill(255, 204, 0); // Yellow color for circles

  beginShape();
  circleGroup.forEach((circle, index) => {
    circle.update();
    vertex(circle.pos.x, circle.pos.y); // Connects the circles with vertices
  });
  endShape(CLOSE); // Closes the shape connecting the last point to the first

  // Draw and fill circles after to overlay the connecting lines
  circleGroup.forEach(circle => {
    circle.display();
  });
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
