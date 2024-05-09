// Define engine and world
let engine;
let world;

// Define circles and joints
let circles = [];
let joints = [];

function setup() {
    createCanvas(500, 500);
    engine = Matter.Engine.create();
    world = engine.world;
    Matter.Runner.run(engine);

    // Add ground
    let ground = Matter.Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true });
    Matter.World.add(world, ground);

    // Create group of 8 circles positioned in a circular arrangement
    let numCircles = 8;
    let radius = 100;
    for (let i = 0; i < numCircles; i++) {
        let angle = (TWO_PI / numCircles) * i;
        let x = width / 2 + cos(angle) * radius; // Initial x using cosine function
        let y = height / 2 + sin(angle) * radius; // Initial y using sine function
        let circle = Matter.Bodies.circle(x, y, 20); // Creating a circle body
        circles.push(circle);
        Matter.World.add(world, circle);
    }

    // Create distance joints between each pair of circles
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let joint = Matter.Constraint.create({
                bodyA: circles[i],
                bodyB: circles[j],
                length: 0,
                stiffness: 0.6,
            });
            joints.push(joint);
            Matter.World.add(world, joint);
        }
    }
}

function draw() {
    background(0);

    // Draw circles
    fill(255, 204, 0); // Yellow color for circles
    noStroke();
    circles.forEach(circle => {
        ellipse(circle.position.x, circle.position.y, circle.circleRadius * 2);
    });

    // Draw joints
    stroke(255);
    joints.forEach(joint => {
        line(joint.bodyA.position.x, joint.bodyA.position.y, joint.bodyB.position.x, joint.bodyB.position.y);
    });
}
