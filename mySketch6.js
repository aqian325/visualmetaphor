let numOfSpritesSlider, radiusSlider;
let noNoSlider, noNoXSlider, noNoYSlider;
let circleGroup; // Changed from array to Group object
let joints = [];
let prevNumOfSprites = 0; // To track changes in number of sprites

let refresh = false;

function changeSlider() {
    refresh = true;
}

function setup() {
    createCanvas(500, 500);
    angleMode(DEGREES);
    world.gravity.y = 0;

    // Setup UI elements
    setupUI();

    // Initialize simulation
    circleGroup = new Group(); // Initialize circleGroup as a Group
    initSimulation();
}

function setupUI() {
    // Simplified and organized UI setup
    createP('Number of sprites (8 to 50):').position(655, 480);
    numOfSpritesSlider = createSlider(8, 50, 8, 1);
    numOfSpritesSlider.position(700, 500);
    numOfSpritesSlider.input(changeSlider); // Simplified event listener setup

    createP('Radius of sprite + movement (10 to 60):').position(655, 550);
    radiusSlider = createSlider(10, 60, 10, 5);
    radiusSlider.position(700, 570);
    radiusSlider.input(changeSlider);

    createP('Angle between sprites (mult denom. factor of 0 to 2):').position(655, 620);
    noNoSlider = createSlider(0, 2, 1, 0.01);
    noNoSlider.position(700, 640);
    noNoSlider.input(changeSlider);

    // createP('Noise X (0 to 2):').position(655, 690);
    // noNoXSlider = createSlider(0, 2, 1, 0.01);
    // noNoXSlider.position(700, 710);
    // noNoXSlider.input(changeSlider);

    // createP('Noise Y (0 to 2):').position(655, 760);
    // noNoYSlider = createSlider(0, 2, 1, 0.01);
    // noNoYSlider.position(700, 780);
    // noNoYSlider.input(changeSlider);

    createP('Springiness (0.1 to 1):').position(655, 690);
    springSlider = createSlider(0.1, 1, 0.5, 0.01); // Adjusted default and step
    springSlider.position(700, 710);
    springSlider.input(changeSlider);
}

function initSimulation() {
    circleGroup.forEach(s => s.remove());
    console.log(circleGroup.length);
    joints.forEach(j => j.remove()); // Remove all joints
    joints = [];
    
    let numOfSprites = numOfSpritesSlider.value();
    let radius = radiusSlider.value();

    // Reinitialize group
    circleGroup = new Group();

    // Create the center sprite and add to the group
    const centerSprite = new circleGroup.Sprite(width / 2, height / 2, 2*radius);
    centerSprite.draw = function() {
        fill(255, 0, 0); // Color for the center sprite
        noStroke();
        ellipse(0, 0, this.diameter, this.diameter);
    };
    circleGroup.add(centerSprite);

    // Calculate the angle between each sprite
    let angleIncrement = 360 / (numOfSprites - 1);

    // Create the edge sprites positioned on the circumference of a circle
    for (let i = 0; i < numOfSprites - 1; i++) {
        let angle = angleIncrement * i;
        let x = centerSprite.x + cos(angle) * radius;
        let y = centerSprite.y + sin(angle) * radius;
        let edgeSprite = new circleGroup.Sprite(x, y, radius);
        edgeSprite.draw = function() {
            fill(255, 0, 0);
            noStroke();
            ellipse(0, 0, this.diameter, this.diameter);
        };
        circleGroup.add(edgeSprite);
    }

    // Connect each edge sprite with adjacent edge sprites and the center sprite
    for (let i = 1; i < circleGroup.length; i++) {
        let centerJoint = new DistanceJoint(centerSprite, circleGroup[i]);
        // centerJoint.springiness = springSlider.value(); // Use the springiness slider value
        centerJoint.springiness = 0.1; // Use the springiness slider value
        centerJoint.draw = function() {
            stroke(0, 255, 0);
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };
        joints.push(centerJoint);

        let nextIndex = i + 1 < circleGroup.length ? i + 1 : 1; // Wrap around to the first edge sprite
        let edgeJoint = new DistanceJoint(circleGroup[i], circleGroup[nextIndex]);
        edgeJoint.springiness = springSlider.value() * 0.01; // Reduced springiness for edge connections
        edgeJoint.draw = function() {
            stroke(255, 255, 255);
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };
        
        joints.push(edgeJoint);
    }

    // Connect the first edge sprite (index 1) with the last edge sprite
    let lastEdgeSprite = circleGroup[circleGroup.length - 1];
    let firstEdgeSprite = circleGroup[1];
    let finalJoint = new DistanceJoint(lastEdgeSprite, firstEdgeSprite);
    // finalJoint.springiness = springSlider.value() * 0.1;
    finalJoint.springiness = 0;
    finalJoint.draw = function() {
        stroke(255, 255, 255);
        line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
    };
    joints.push(finalJoint);
}



function draw() {
    background(0);
    if (refresh) {
        initSimulation(); // Reinitialize simulation if sliders change
        refresh = false;
    }

    // Optional: Move the center sprite towards the mouse cursor
    circleGroup[0].moveTowards(mouse, 0.2); // Assuming moveTowards is correctly implemented

    // // Apply noise-based movement (This section might need your specific logic adjustment)
    // let noNo = noise(noNoSlider.value());
    // let noNoX = noise(noNoXSlider.value());
    // let noNoY = noise(noNoYSlider.value());
}
