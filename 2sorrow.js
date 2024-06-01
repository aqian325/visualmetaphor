let numOfSpritesSlider, radiusSlider;
let noNoSlider, noNoXSlider, noNoYSlider;
let circleGroup; // Changed from array to Group object
let joints = [];
let prevNumOfSprites = 0; // To track changes in number of sprites
let floor, ceiling, leftWall, rightWall;
let sad;
let sadSprites;
let sadSound;
let changeColor = false;

function preload() {
    sadSound = loadSound("assets/sad.wav");
    //source: https://mixkit.co/free-sound-effects/bubbles/
}

let refresh = false;

function changeSlider() {
    refresh = true;
}

function setup() {
    createCanvas(1000, 200);
    angleMode(DEGREES);
    world.gravity.y = world.x * 100;
    frameRate = 1;

    circleGroup = new Group(); // Initialize circleGroup as a Group
    initSimulation();
    mouse.visible = false;

    // Building walls
    floor = new Sprite();
    floor.y = height;
    floor.w = width;
    floor.h = 0.1;
    floor.stroke = 'black';
    floor.collider = 'static';

    ceiling = new Sprite();
    ceiling.y = 0;
    ceiling.w = width;
    ceiling.h = 0;
    ceiling.stroke = 'black';
    ceiling.collider = 'static';
    ceiling.bounciness = 0.4;

    // Creating sorrow
    sad = new Sprite();
    sad.x = width;
    sad.y = height /2;
    sad.d = height * 0.6;
    sad.color = '#4974a5';
    sad.stroke = "#000000";
    sad.collider = 'k';
    sad.friction = 4;
    sad.bounciness = 1;

    // Calling poof interaction
    circleGroup.overlaps(sad, poof);
}

function initSimulation() {
    circleGroup.forEach(s => s.remove());
    joints.forEach(j => j.remove()); // Remove all joints
    joints = [];

    let numOfSprites = 100;
    let radius = 20;

    let colorLeft = color(255, 255, 255); // Pale pink
    let colorRight = color(20, 20, 20); // coral
    let colorRightEdge = color('#4974a5'); // blue

    // Reinitialize group
    circleGroup = new Group();

    // Create the center sprite and add to the group
    const centerSprite = new circleGroup.Sprite(100, height / 2, radius);
    centerSprite.draw = function() {
        if (changeColor) {
            fill('#4974a5');
        } else {
            const lerpFactor = this.x / (width * 7 / 8);
            const edgeLerp = (this.x - 7 / 8) / (width * 2 / 8);
            if (this.x <= (width * 7 / 8)) {
                let finalColor = lerpColor(colorLeft, colorRight, lerpFactor);
                fill(finalColor);
            } else {
                let finalColor = lerpColor(colorRight, colorRightEdge, edgeLerp);
                fill(finalColor);
            }
        }
        noStroke();
        ellipse(0, 0, this.diameter, this.diameter);
    };

    circleGroup.add(centerSprite);

    let angleIncrement = 360 / (numOfSprites - 1);

    for (let i = 0; i < numOfSprites - 1; i++) {
        let angle = angleIncrement * i;
        let x = centerSprite.x + cos(angle) * radius;
        let y = centerSprite.y + sin(angle + 50) * radius;
        let edgeSprite = new circleGroup.Sprite(x, y, radius);
        edgeSprite.draw = function() {
            if (changeColor) {
                fill('#4974a5');
            } else {
                let colorLeft = color(255, 255, 255); // Pale pink
                let colorRight = color(20, 20, 20, 200); // coral
                let colorRightEdge = color('#4974a5'); // blue

                const lerpFactor = this.x / (width * 7 / 8);
                const edgeLerp = ((this.x - 7 / 8) / width);

                if (this.x <= (width * 7 / 8)) {
                    let finalColor = lerpColor(colorLeft, colorRight, lerpFactor);
                    fill(finalColor);
                } else {
                    let finalColor = lerpColor(colorRight, colorRightEdge, edgeLerp);
                    fill(finalColor);
                }
            }
            noStroke();
            ellipse(0, 0, this.diameter + (this.speed), this.diameter + (this.speed));
        };

        circleGroup.add(edgeSprite);
    }

    for (let i = 1; i < circleGroup.length; i++) {
        let centerJoint = new DistanceJoint(centerSprite, circleGroup[i]);
        centerJoint.springiness = 0.12;
        centerJoint.draw = function() {
            noStroke();
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };
        joints.push(centerJoint);

        let nextIndex = i + 1 < circleGroup.length ? i + 1 : 1;
        let edgeJoint = new DistanceJoint(circleGroup[i], circleGroup[nextIndex]);
        edgeJoint.springiness = 1;
        edgeJoint.draw = function() {
            noStroke();
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };

        joints.push(edgeJoint);
    }

    let lastEdgeSprite = circleGroup[circleGroup.length - 1];
    let firstEdgeSprite = circleGroup[1];
    let finalJoint = new DistanceJoint(lastEdgeSprite, firstEdgeSprite);
    finalJoint.springiness = 1;
    finalJoint.draw = function() {
        noStroke();
        line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
    };
    joints.push(finalJoint);
}

function draw() {
    background(0);
    if (refresh) {
        initSimulation();
        refresh = false;
    }

    sad.x = width;
    sad.y = height / 1.5;
    sad.d = sad.d * 1.006;
    sad.color = '#4974a5';
    sad.stroke = "#000000";
    sad.collider = 's';
    sad.friction = 4;
    sad.bounciness = 20;

    stroke(0);
    sad.draw();

    circleGroup[0].drag = 15;
    circleGroup[0].moveTowards(sad.x, sad.y, 0.98);

    // Calculate convex hull
    let vertices = [];
    circleGroup.forEach(sprite => {
        vertices.push(createVector(sprite.x, sprite.y));
    });

    let hull = convexHull(vertices);

    // Draw convex hull
    if (changeColor) {
        fill('#4974a5');
        stroke('#4974a5');
    } else {
        noFill();
        stroke(0);
    }
    beginShape();
    hull.forEach(v => {
        vertex(v.x, v.y);
    });
    endShape(CLOSE);

    if (circleGroup[0].x > width) {
        changeColor = false; // Revert to original colors
        circleGroup.x = 0;
    }
}

function convexHull(points) {
    points.sort((a, b) => a.x - b.x);

    function cross(o, a, b) {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    }

    let lower = [];
    for (let point of points) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
            lower.pop();
        }
        lower.push(point);
    }

    let upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
        let point = points[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
            upper.pop();
        }
        upper.push(point);
    }

    upper.pop();
    lower.pop();

    return lower.concat(upper);
}

function poof(circleGroup, sad) {
    changeColor = true; // Change color of circleGroup sprites and convex hull
    sadSprites = new Group();
    sadSprites.draw();
    sadSprites.x = circleGroup.x + 20;
    sadSprites.y = circleGroup.y + 20;
    sadSprites.diameter = 15;
    sadSprites.amount = 1;
    sadSprites.life = random(100, 120);
    sadSprites.color = "#4974a5";

    sadSound.play();
}
