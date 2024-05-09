//wont work, cant access happyDots WHYYY

let circleGroup = [];
let joints = []; // Array to store the joints
let happyDots;

function setup() {
	new Canvas(500, 50);
    angleMode(DEGREES);
    world.gravity.y = 10;

	happyDots = new Group();
	happyDots.color = 'yellow';
	happyDots.y = 25;
	happyDots.diameter = 10;
	
	while (happyDots.length < 24) {
		let happyDots = new happyDots.Sprite();
		happyDots.x = happyDots.length * 20;
	}
    // Create group of 4 circles positioned around a center
    for (let i = 0; i < 360; i += 90) {
        let x = width / 2 + cos(i) * 40; // Initial x using cosine function, slightly increased radius
        let y = height / 2 + sin(i) * 40; // Initial y using sine function, slightly increased radius
        let circle = createSprite(x, y, 30, 30); // Create a sprite with radius 30
        circleGroup.push(circle); // Add the sprite to the circleGroup array
    }

    // Connect each circle to every other circle in the group only once
    for (let i = 0; i < circleGroup.length; i++) {
        for (let j = i + 1; j < circleGroup.length; j++) {
            let joint = new DistanceJoint(circleGroup[i], circleGroup[j]);
            joint.springiness = 0.6;
            joints.push(joint); // Store the joints in an array
        }
    }

    // Create the sprites sA and sB
    sA = createSprite(250, 0, 10, 'k');
    sB = createSprite(100, 20, 20);

    // Create a distance joint between sA and sB
    j = new DistanceJoint(sA, sB);
    j.offsetA.y = 25;
    j.springiness = 0.6;
}


function draw() {
    background(255);

    // Update and draw circle sprites
    circleGroup.forEach(circle => {
        // Example update for movement
        circle.position.x = width / 2 + cos(frameCount) * 100;
        circle.position.y = height / 2 + sin(frameCount) * 100;
        // drawSprite(circle); // Custom method to draw each sprite
    });

    // Display joints
    joints.forEach(joint => {
        // drawJoint(joint); // You might need to implement this if it's not handled automatically
    });
}

// Define drawSprite if it's not already provided by the library
function drawSprite(sprite) {
    fill(255, 204, 0); // Yellow color for circles
    ellipse(sprite.position.x, sprite.position.y, sprite.width, sprite.height);
}

// Define drawJoint if you need to visualize the joints
function drawJoint(joint) {
    stroke(255);
    line(joint.bodyA.position.x, joint.bodyA.position.y, joint.bodyB.position.x, joint.bodyB.position.y);
}
