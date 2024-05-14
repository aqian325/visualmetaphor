let numOfSpritesSlider, radiusSlider;
let noNoSlider, noNoXSlider, noNoYSlider;
let circleGroup; // Changed from array to Group object
let joints = [];
let prevNumOfSprites = 0; // To track changes in number of sprites
let floor, ceiling, leftWall, rightWall;

let refresh = false;

function changeSlider() {
    refresh = true;
}

function setup() {
    createCanvas(1800, 600);
    angleMode(DEGREES);
    world.gravity.y = 0;

    // Setup UI elements
    setupUI();

    // Initialize simulation
    circleGroup = new Group(); // Initialize circleGroup as a Group
    initSimulation();
	mouse.visible = false;

    floor = new Sprite();
	floor.y = height;
	floor.w = width;
	floor.h = 0.1;
    floor.color = 'invisible';
	floor.collider = 'static';

    ceiling = new Sprite();
	ceiling.y = 0;
	ceiling.w = width;
	ceiling.h = 0;
    ceiling.color = 'black';
	ceiling.collider = 'static';
    ceiling.bounciness=0.4;

    leftWall = new Sprite();
	leftWall.x = 0;
	leftWall.w = 0;
	leftWall.h = height;
    leftWall.color = 'black';
	leftWall.collider = 'static';

    rightWall = new Sprite();
	rightWall.x = 1800;
	rightWall.w = 0;
	rightWall.h = height;
    rightWall.color = 'black';
	rightWall.collider = 'static';
}

function setupUI() {
    let sliderX = 800;
    let sliderTextX = sliderX+45;
    let sliderYStart = 380

    // Simplified and organized UI setup
    createP('Number of sprites (8 to 100):').position(sliderX, sliderYStart);
    numOfSpritesSlider = createSlider(8, 100, 20, 1);
    numOfSpritesSlider.position(sliderTextX, sliderYStart+20);
    numOfSpritesSlider.input(changeSlider); // Simplified event listener setup

    createP('Radius of sprite (10 to 60):').position(sliderX, sliderYStart+60);
    radiusSlider = createSlider(10, 60, 30, 5);
    radiusSlider.position(sliderTextX, sliderYStart+80);
    radiusSlider.input(changeSlider);

    // createP('Springiness (0.1 to 1):').position(sliderX, sliderYStart+120);
    // springSlider = createSlider(0.1, 1, 0.5, 0.01); // Adjusted default and step
    // springSlider.position(sliderTextX, sliderYStart+140);
    // springSlider.input(changeSlider);

    // createP('Angle between sprites (mult denom. factor of 0 to 2):').position(655, 620);
    // noNoSlider = createSlider(0, 2, 1, 0.01);
    // noNoSlider.position(700, 640);
    // noNoSlider.input(changeSlider);

    // createP('Noise X (0 to 2):').position(655, 690);
    // noNoXSlider = createSlider(0, 2, 1, 0.01);
    // noNoXSlider.position(700, 710);
    // noNoXSlider.input(changeSlider);

    // createP('Noise Y (0 to 2):').position(655, 760);
    // noNoYSlider = createSlider(0, 2, 1, 0.01);
    // noNoYSlider.position(700, 780);
    // noNoYSlider.input(changeSlider);


}

function initSimulation() {
    circleGroup.forEach(s => s.remove());
    console.log(circleGroup.length);
    joints.forEach(j => j.remove()); // Remove all joints
    joints = [];
    
    let numOfSprites = numOfSpritesSlider.value();
    let radius = radiusSlider.value();
    let colorLeft = color(245, 198, 201); // Pale pink
    let colorRight = color(208, 234, 242); // Pale blue

    // Calculate interpolation factor based on x position

 
    // Reinitialize group
    circleGroup = new Group();



    // Create the center sprite and add to the group
    const centerSprite = new circleGroup.Sprite(width / 2, height / 2, radius);
    centerSprite.draw = function() {
        const lerpFactor = this.x / width;
        // Interpolate color based on x position
        let finalColor = lerpColor(colorLeft, colorRight, lerpFactor);
        fill(finalColor); // Conditional color based on position
        noStroke();
        ellipse(0, 0, this.diameter+(0.5*this.speed), this.diameter+(0.5*this.speed));
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
            const lerpFactor = this.x / width;
            // Interpolate color based on x position
             let finalColor = lerpColor(colorLeft, colorRight, lerpFactor);
            fill(finalColor); // Conditional color based on position
            noStroke();
            ellipse(0, 0,this.diameter+(2*this.speed), this.diameter+(0.7*this.speed)); //adding blobbyness
        // edgeSprite.bounciness=0.5; //unfriendly
        };
        circleGroup.add(edgeSprite);
    }

    // Connect each edge sprite with adjacent edge sprites and the center sprite
    for (let i = 1; i < circleGroup.length; i++) {
        let centerJoint = new DistanceJoint(centerSprite, circleGroup[i]);
        // centerJoint.springiness = springSlider.value(); // Use the springiness slider value
        centerJoint.springiness = 0.08; // Use the springiness slider value
        centerJoint.draw = function() {
            stroke(0, 255, 0);
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };
        joints.push(centerJoint);

        let nextIndex = i + 1 < circleGroup.length ? i + 1 : 1; // Wrap around to the first edge sprite
        let edgeJoint = new DistanceJoint(circleGroup[i], circleGroup[nextIndex]);
        edgeJoint.springiness = 1; // Reduced springiness for edge connections
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
    finalJoint.springiness = 1;
    finalJoint.draw = function() {
        stroke(255, 255, 255);
        line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
    };
    joints.push(finalJoint);

    if (kb.pressing('space')) {
		edgeSprite.overlaps(centerSprite);
		centerSprite.color = 'purple';
	} //didnt work
}



function draw() {
    background(0);
    if (refresh) {
        initSimulation(); // Reinitialize simulation if sliders change
        refresh = false;
    }
    for (let i = 0; i < width * height * 5 / 100; i++) {
        stroke(250, 250, 250, 40);
        let px = random(width);
        let py = random(height);
        point(px, py);
      }
    
    // Optional: Move the center sprite towards the mouse cursor

    circleGroup[0].moveTowards(mouse, 0.07); // Assuming moveTowards is correctly implemented
    // circleGroup[0].attractTo(mouseX, mouseY, 400, 50, 5000);

    circleGroup.forEach(sprite => {

        // Check and handle proximity to edges
        // handleEdgeProximity(sprite);

    });
}

    // // Apply noise-based movement (This section might need your specific logic adjustment)
    // let noNo = noise(noNoSlider.value());
    // let noNoX = noise(noNoXSlider.value());
    // let noNoY = noise(noNoYSlider.value());

    function handleEdgeProximity(sprite) {
        const edgePadding = 5;
        const repelStrength = 10;
    
        // Check proximity to left and right edges
        if (sprite.x - sprite.diameter / 2 <= edgePadding) {
            sprite.moveAway(width, sprite.y, repelStrength); // Move away from left edge
        }
        if (sprite.x + sprite.diameter / 2 >= width - edgePadding) {
            sprite.moveAway(0, sprite.y, repelStrength); // Move away from right edge
        }
    
        // Check proximity to top and bottom edges
        if (sprite.y - sprite.diameter / 2 <= edgePadding) {
            sprite.moveAway(sprite.x, height, repelStrength); // Move away from top edge
        }
        if (sprite.y + sprite.diameter / 2 >= height - edgePadding) {
            sprite.moveAway(sprite.x, 0, repelStrength); // Move away from bottom edge
        }
    }