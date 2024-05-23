let numOfSpritesSlider, radiusSlider;
let noNoSlider, noNoXSlider, noNoYSlider;
let circleGroup; // Changed from array to Group object
let joints = [];
let prevNumOfSprites = 0; // To track changes in number of sprites
let floor, ceiling, leftWall, rightWall;
let fear;
let fearfulSprites;
let a;

let fearSound;

function preload() {
	fearSound = loadSound("assets/bubble.wav");
    //source: https://mixkit.co/free-sound-effects/bubbles/
}

let refresh = false;

function changeSlider() {
    refresh = true;
}

function setup() {
    world.gravity=100;
    createCanvas(1000, 200);
    angleMode(DEGREES);
    world.gravity.y = 0;

    // Setup UI elements
    // setupUI();

    // Initialize simulation
    circleGroup = new Group(); // Initialize circleGroup as a Group
    initSimulation();
	mouse.visible = false;

    //building walls 
    floor = new Sprite();
	floor.y = height;
	floor.w = width;
	floor.h = 0.1;
    floor.stroke = 'black';
	floor.collider = 'static';
    floor.bounciness = 0;

    ceiling = new Sprite();
	ceiling.y = 0;
	ceiling.w = width;
	ceiling.h = 0;
    ceiling.stroke = 'black';
	ceiling.collider = 'static';
    ceiling.bounciness=0;

    leftWall = new Sprite();
	leftWall.x = 0;
	leftWall.w = 0;
	leftWall.h = height;
    leftWall.stroke = 'black';
	leftWall.collider = 'static';
    leftWall.bounciness=1;

    rightWall = new Sprite();
	rightWall.x = width;
	rightWall.w = 0;
	rightWall.h = height;
    // rightWall.color = 'pink';
    rightWall.stroke = 'black';
	rightWall.collider = 'static';
    rightWall.bounciness = 0.5;

    //creating fear ! 
    fear = new Sprite();
    // fear.x = width*6/8;
    // fear.y = height/2;
    // fear.d=50;
    // // fear.w=60;
    // fear.w = 40;
    // fear.h = 40;
    // fear.collider = 's';
    // fear.color = '#f7e688';
    // fear.stroke = '#f7e688';
    // // fear.text = '  fear';
    // fear.textSize = 20;
    // // fear.speed = 0.01;
    // fear.bounciness = 20;
    // fear.repelStrength = 3;
    // fear.addCollider(3, 0, 40);
    // fear.addCollider(8, 0, 40);
    // fear.addCollider(-20, 0, 40);

    fear.x=width;
    fear.y=height/2;
    fear.d=height*2*sin(random(0,360));
    fear.color='#202020';
    fear.stroke="#000000";
    fear.collider = 'k';
    // joy.friction=4;
    fear.bounciness=20;

    //calling eek interaction
    circleGroup.overlaps(fear, eek);

}

function setupUI() {
    //creating sliders
    let sliderX = 800;
    let sliderTextX = sliderX+45;
    let sliderYStart = 200

    // Simplified and organized UI setup
    createP('sprite population (8 to 100):').position(sliderX, sliderYStart);
    numOfSpritesSlider = createSlider(8, 100, 100, 1);
    numOfSpritesSlider.position(sliderTextX, sliderYStart+20);
    numOfSpritesSlider.input(changeSlider); // Simplified event listener setup

    createP('sprite size (10 to 60):').position(sliderX, sliderYStart+60);
    radiusSlider = createSlider(10, 60, 1, 5);
    radiusSlider.position(sliderTextX, sliderYStart+80);
    radiusSlider.input(changeSlider);

    //no longer needed
    
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
    
    let numOfSprites = 100;
    let radius = 1;

    //setting up color based on location
    let colorLeft = color(245, 255, 201,200); // Pale yellow
    let colorRight = color(0,0,0); // white
    let colorRightEdge = color(0,0,0); // black

    // Reinitialize group
    circleGroup = new Group();

    // Create the center sprite and add to the group
    const centerSprite = new circleGroup.Sprite(100, height / 2, radius);
    centerSprite.draw = function() {
        const lerpFactor = this.x / (width*7/8);
        const edgeLerp = (this.x-7/8) / (width*2/8);            // Interpolate color based on x position
        // Interpolate color based on x position
        if (this.x <= (width*7/8)) {
            let finalColor = lerpColor(colorLeft, colorRight, lerpFactor);
            fill(finalColor); // Conditional color based on position
        } else {
            let finalColor = lerpColor(colorRight,colorRightEdge,edgeLerp);
            fill(finalColor); // Conditional color based on position
    }
        noStroke();
        ellipse(0, 0, this.diameter-(0.5*this.speed), this.diameter-(0.5*this.speed));
        // this.x = this.x + 1000;
        // if (this.x = width-10) {
        //   this.x = 100;
        // }
    };
    centerSprite.bounciness = 0.3;
    // centerSprite.speed = 0.3;

    //move on its own

    circleGroup.add(centerSprite);

    //figure out convex hull

    // Calculate the angle between each sprite
    let angleIncrement = 360 / (numOfSprites - 1);
        //not sure if needed

    // Create the edge sprites positioned on the circumference of a circle
    for (let i = 0; i < numOfSprites - 1; i++) {
        let angle = angleIncrement * i;
        let x = centerSprite.x + cos(angle) * radius;
        let y = centerSprite.y + sin(angle+50) * radius;
        let edgeSprite = new circleGroup.Sprite(x, y, radius);
        edgeSprite.draw = function() {
            let colorLeft = color(245, 255, 201,200); // Pale yellow
            let colorRight = color(255,0,0,100); // white        
            let colorRightEdge = color(0,0,0); // black        
            const lerpFactor = this.x / (width*7/8);
            const edgeLerp = ((this.x-7/8)/width);            // Interpolate color based on x position
            // const edgeLerp = this.x-8/8;            // Interpolate color based on x position

            // // Interpolate color based on x position
            // if (this.x <= (width*7/8)) {
                let finalColor = lerpColor(colorLeft, colorRight, lerpFactor);
                fill(finalColor);
            // } else {
            //     let finalColor = lerpColor(colorRight,colorRightEdge,edgeLerp);
            //     fill(finalColor); // Conditional color based on position
            // }
            noStroke();
            // translate(-width/2,0)
            ellipse(0, 0,this.diameter-(this.speed*0.4), this.diameter-(this.speed*0.4)); //adding blobbyness
            // this.x = this.x +10;
            // if (this.x > width) {
            //   this.x = -width/2;
            // }
            // edgeSprite.bounciness=0.5; //unfriendly
        };
        // edgeSprite.speed = 0.9;
        // edgeSprite.bounciness=0.9;
        edgeSprite.jitter = 1;
        circleGroup.add(edgeSprite);
    }

    // Connect each edge sprite with adjacent edge sprites and the center sprite
    for (let i = 1; i < circleGroup.length; i++) {
        let centerJoint = new DistanceJoint(centerSprite, circleGroup[i]);
        // centerJoint.springiness = springSlider.value(); // Use the springiness slider value
        centerJoint.springiness = 0.89; // 0 = rigid
        // centerJoint.rotation = 10;
        centerJoint.draw = function() {
            // stroke(0, 255, 0);
            noStroke();
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };
        joints.push(centerJoint);

        let nextIndex = i + 1 < circleGroup.length ? i + 1 : 1; // Wrap around to the first edge sprite
        let edgeJoint = new DistanceJoint(circleGroup[i], circleGroup[nextIndex]);
        edgeJoint.springiness = 0.99; // boiinggg
        edgeJoint.draw = function() {
            // stroke(255, 255, 255);
            noStroke();
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };
        
        joints.push(edgeJoint);
    }

    // Connect the first edge sprite (index 1) with the last edge sprite
    let lastEdgeSprite = circleGroup[circleGroup.length - 1];
    let firstEdgeSprite = circleGroup[1];
    let finalJoint = new DistanceJoint(lastEdgeSprite, firstEdgeSprite);
    // finalJoint.springiness = springSlider.value() * 0.1;
    finalJoint.springiness = 0.2; //same springiness as other edges
    finalJoint.draw = function() {
        // stroke(255, 255, 255);
        noStroke();
        line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
    };
    joints.push(finalJoint);

    // if (kb.pressing('space')) {
	// 	edgeSprite.overlaps(centerSprite);
	// 	centerSprite.color = 'purple';
	// } //tried to allow overlaps didnt work

    if (kb.pressing('p')) {
		centerSprite.x = centerSprite.x + 10;
	} //tried to allow overlaps didnt work

}



function draw() {
    background(0);
    if (refresh) {
        initSimulation(); // Reinitialize simulation if sliders change
        refresh = false;
    }

    fear.x=width;
    fear.y=height/2;
    fear.d=height*0.8*sin(random(0,180));
    fear.color='#202020';
    fear.stroke="#000000";
    fear.collider = 'k';
    // joy.friction=4;
    fear.bounciness=20;

    // //blinking old tv back drop
    // for (let i = 0; i < width * height * 5 / 100; i++) {
    //     stroke(250, 250, 250, 40);
    //     let px = random(width);
    //     let py = random(height);
    //     point(px, py);
    //   }
    
    stroke(255);
    // line(width,0,width,height);
    //didnt work
    fear.draw();

    // Optional: Move the center sprite towards the mouse cursor

    // circleGroup[0].moveTowards(mouse, 0.07); // Assuming moveTowards is correctly implemented

    circleGroup[0].moveTowards(width,height/2, 0.02); // Assuming moveTowards is correctly implemented

    circleGroup[4].attractTo(0,height/2,1000);
    circleGroup[8].attractTo(0,height/2,100);
    circleGroup[12].attractTo(0,height/2,1000);
    circleGroup[16].attractTo(0,height/2,100);
    circleGroup[17].attractTo(0,height/2,1000);
    circleGroup[18].attractTo(0,height/2,100);
    circleGroup[19].attractTo(width/2,height/2,100);
    circleGroup[20].attractTo(0,height/2,1000);

    circleGroup[2].moveAway(fear.x,fear.y,0.1);
    circleGroup[6].moveAway(fear.x,fear.y,0.1);
    circleGroup[10].moveAway(fear.x,fear.y,0.1);
    circleGroup[16].moveAway(fear.x,fear.y,0.1);
    circleGroup[17].moveAway(fear.x,fear.y,0.1);
    circleGroup[18].moveAway(fear.x,fear.y,0.1);
    circleGroup[19].moveAway(fear.x,fear.y,0.1);
    circleGroup[20].moveAway(fear.x,fear.y,0.1);

    // circleGroup[0].attractTo(width*1.5, height/2, 400);

    if (circleGroup[0].x > width*1.2) {
        // refresh = true;
        circleGroup.x = 0;
    }

    // circleGroup.repelFrom = fear;

        //attractTo function too slow

    // circleGroup.forEach(sprite => {

    //     // Check and handle proximity to edges
    //     // handleEdgeProximity(sprite);

    // });

}

    // // Apply noise-based movement (This section might need your specific logic adjustment)
    // let noNo = noise(noNoSlider.value());
    // let noNoX = noise(noNoXSlider.value());
    // let noNoY = noise(noNoYSlider.value());

    //didnt use this
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

//eek
function eek(circleGroup,fear) {
    newColor = (255,0,0,0);
    fearfulSprites = new Group();
    fearfulSprites.draw();
    fearfulSprites.x=circleGroup.x+random(-5,5);
    fearfulSprites.y=circleGroup.y+random(-5,5);
    fearfulSprites.diameter = 15;
    fearfulSprites.amount = 1;
    fearfulSprites.life = random(1000,10000);
    fearfulSprites.color = newColor;
    fearfulSprites.repelStrength = 1;
    fearfulSprites.rotation = 100;

    //play bubble sound
	// joySound.play();
}

// joy = occurence of desirable event
// sad = occurence of an undesirable event
// hope = occurence of an unconfirmed desirable event
// fear = occurence of an unconfirmed undesirable event
// anger = complex emotion; sad + reproach
// gratitude = complex emotion; joy + admiration

// for reference
// reproach = action is done by the other and is not approved by agent's standards
// admiration = action is done by the other and is not approved by agent's standards