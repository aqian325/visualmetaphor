let circleGroup = [];
let joints = [];

function setup() {
    new Canvas(500, 500);
    angleMode(DEGREES);
    world.gravity.y = 0;  // Assuming no gravity for this simulation

    // Create a cluster of 8 sprites
    let numOfSprites = 10;
    let radius = 80;  // Distance from the center of the canvas
    for (let i = 0; i < numOfSprites; i++) {
        let angle = 360 / numOfSprites * i;
        let color = "yellow";
        let x = width / 2 + cos(angle) * radius;
        let y = height / 2 + sin(angle) * radius;
        let circle = new Sprite(x, y, radius,0); // Assuming Sprite takes x, y, diameter
        circleGroup.push(circle);
    }

    // Connect each sprite with every other sprite exactly once
    for (let i = 0; i < circleGroup.length; i++) {
        for (let j = i + 1; j < circleGroup.length; j++) {
            let joint = new DistanceJoint(circleGroup[i], circleGroup[j]);  // Assuming DistanceJoint constructor
            joint.springiness = 0.6;  // Example property
            joints.push(joint);
        }
    }
}

function draw() {
    background(0);

    // Animate and draw sprites
    for (let i = 0; i < circleGroup.length; i++) {
        let noNo=20*noise(0.1);
        let noNoX=0*noise(1);
        let noNoY=0*noise(0.1);
        let angle = frameCount * 2 + 360 / circleGroup.length * i * noNo;
        circleGroup[i].position.x = width / 2 + cos(angle) * (20 + sin(frameCount * 0.7) * 15);
        circleGroup[i].position.y = height / 2 + sin(angle) * (20 + sin(frameCount * 0.7) * 15);
        drawSprite(circleGroup[i]);
    }

    // Optionally draw joints if needed
    joints.forEach(joint => {
        drawJoint(joint);
    });
}

// Utility functions
function drawSprite(sprite) {
    fill(255, 204, 0);
    ellipse(sprite.position.x, sprite.position.y, sprite.diameter, sprite.diameter);
}

function drawJoint(joint) {
    stroke(255,20);
    line(joint.spriteA.position.x, joint.spriteA.position.y, joint.spriteB.position.x, joint.spriteB.position.y);
}
