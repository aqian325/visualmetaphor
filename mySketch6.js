let numOfSpritesSlider, radiusSlider;
let noNoSlider, noNoXSlider, noNoYSlider;
let circleGroup = [];
let joints = [];
let prevNumOfSprites = 0; // To track changes in number of sprites
// let fill = (255, 204, 0); // Yellow color fill


function setup() {
    createCanvas(500, 500);
    angleMode(DEGREES);
    world.gravity.y = 0;
    // frameRate = 2; // trying to slow this down, didnt work

    // Labels and Sliders
    createP('number of sprites (8 to 50):').position(655, 480);
    numOfSpritesSlider = createSlider(8, 50, 8,1);
    numOfSpritesSlider.position(700, 500);

    createP('radius of sprite + movement (10 to 60):').position(655, 550);
    radiusSlider = createSlider(10, 60, 10,5);
    radiusSlider.position(700, 570);

    createP('angle between sprites (mult denom. factor of 0 to 2):').position(655, 620);
    noNoSlider = createSlider(0, 2, 1, 0.01);
    noNoSlider.position(700, 640);

    createP('noise x (0 to 2):').position(655, 690);
    noNoXSlider = createSlider(0, 2, 1, 0.01);
    noNoXSlider.position(700, 710);

    createP('noise y (0 to 2):').position(655, 760);
    noNoYSlider = createSlider(0, 2, 1, 0.01);
    noNoYSlider.position(700, 780);

    createP('springiness (0.1 to 1):').position(655, 830);
    springSlider = createSlider(0.1, 1, 1, 0.1);
    springSlider.position(700, 850);

    initSimulation();
}

function initSimulation() {
    circleGroup = [];
    joints = [];
    let numOfSprites = numOfSpritesSlider.value();
    let radius = radiusSlider.value();

    // Create a cluster of sprites
    for (let i = 0; i < numOfSprites; i++) {
        let angle = 360 / numOfSprites * i;
        let x = width / 2 + cos(angle) * radius;
        let y = height / 2 + sin(angle) * radius;
        let circle = new Sprite(x, y, radius); // Assuming Sprite takes x, y, diameter
        circle.color=color(255, 204, 0);
        circleGroup.push(circle);
    }

    // Connect each sprite with every other sprite exactly once
    for (let i = 0; i < circleGroup.length; i++) {
        for (let j = i + 1; j < circleGroup.length; j++) {
            let springiness = springSlider.value();
            let joint = new DistanceJoint(circleGroup[i], circleGroup[j]);
            joint.springiness = springiness;
            joints.push(joint);
        }
    }

}

function draw() {
    background(0);
    if (numOfSpritesSlider.value() !== circleGroup.length || radiusSlider.value() !== circleGroup[0].radius) {
        clear();
        initSimulation(); // Reinitialize simulation if sliders change
    }


    let noNo = noise(noNoSlider.value());
    let noNoX = noise(noNoXSlider.value());
    let noNoY = noise(noNoYSlider.value());

    // Animate and draw sprites
    for (let i = 0; i < circleGroup.length; i++) {
        let angle = frameCount * 2 + 360 / circleGroup.length * i;
        circleGroup[i].position.x = width / 2 + cos(angle) * (20 + sin(frameCount * 0.7 * noNoX) * 15);
        circleGroup[i].position.y = height / 2 + sin(angle) * (20 + sin(frameCount * 0.7 * noNoY) * 15);
        drawSprite(circleGroup[i]);
    }

    // Optionally draw joints if needed
    joints.forEach(joint => {
        drawJoint(joint);
    });
}

function drawSprite(sprite) {
    fill(255, 204, 0); // Yellow color fill
    noStroke(); // Ensure no outline
    ellipse(sprite.position.x, sprite.position.y, sprite.diameter, sprite.diameter);
}

function drawJoint(joint) {
    stroke(255,40); // White color for the joint lines
    // noStroke();
    line(joint.spriteA.position.x, joint.spriteA.position.y, joint.spriteB.position.x, joint.spriteB.position.y);
}
