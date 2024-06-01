let numOfSpritesSlider, radiusSlider;
let circleGroup; // Changed from array to Group object
let joints = [];
let prevNumOfSprites = 0; // To track changes in number of sprites
let floor, ceiling, leftWall, rightWall;
let anger;
let angerSprites;
let angerSound;
let explosionSprites;
let lastPoofTime = 0;
let poofCooldown = 1000; // Cooldown time in milliseconds

function preload() {
    angerSound = loadSound("assets/anger.wav");
    //source: https://mixkit.co/free-sound-effects/explosion/
}

let refresh = false;

function changeSlider() {
    refresh = true;
}

function setup() {
    createCanvas(1000, 200);
    angleMode(DEGREES);
    world.gravity.y = 0;

    circleGroup = new Group(); // Initialize circleGroup as a Group
    angerGroup = new Group(); // Initialize angerGroup as a Group
    initAnger();

    initSimulation();
    mouse.visible = false;

    // Building walls
    floor = new Sprite();
    floor.y = height;
    floor.w = width;
    floor.h = 0.1;
    floor.stroke = 'black';
    floor.collider = 'static';
    floor.bounciness=100;

    ceiling = new Sprite();
    ceiling.y = 0;
    ceiling.w = width;
    ceiling.h = 0;
    ceiling.stroke = 'black';
    ceiling.collider = 'static';
    ceiling.bounciness = 0.9;

    // Creating anger
    anger = new Sprite();
    anger.x = width;
    anger.y = height / 2;
    // anger.d = height;
    anger.d = 10;
    anger.color = 'black';
    anger.collider = 'd';
    anger.bounciness = 0.9;

    // circleGroup.overlaps(anger, triggerExplosion);

    // Debugging: Check if setup is complete
    console.log("Setup complete");
}

function initSimulation() {
    if (circleGroup) {
        circleGroup.forEach(s => s.remove());
    }
    if (explosionSprites) {
        explosionSprites.forEach(s => s.remove());
    }
    joints.forEach(j => j.remove()); // Remove all joints
    joints = [];

    let numOfSprites = 100;
    let radius = 15;

    let colorEdge = color(139, 0, 0); // Dark blood red

    circleGroup = new Group();

    centerSprite = new circleGroup.Sprite(100, height / 2, radius);
    centerSprite.draw = function() {
        fill(colorEdge);
        noStroke();
        ellipse(0, 0, this.diameter, this.diameter);
    };

    circleGroup.add(centerSprite);

    let angleIncrement = 360 / (numOfSprites - 1);

    for (let i = 0; i < numOfSprites - 1; i++) {
        let angle = angleIncrement * i;
        let x = centerSprite.x + cos(angle) * radius;
        let y = centerSprite.y + sin(angle) * radius;
        let edgeSprite = new circleGroup.Sprite(x, y, radius);
        edgeSprite.draw = function() {
            fill(colorEdge);
            noStroke();
            ellipse(0, 0, this.diameter, this.diameter);
        };
        edgeSprite.bounciness = 1;
        circleGroup.add(edgeSprite);
    }

    for (let i = 1; i < circleGroup.length; i++) {
        let centerJoint = new DistanceJoint(centerSprite, circleGroup[i]);
        centerJoint.springiness = 0.2;
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
        line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.x);
    };
    joints.push(finalJoint);

    circleGroup.mass = 0.1;
    // Debugging: Check if simulation initialization is complete
    console.log("Simulation initialized with " + circleGroup.length + " sprites");
}

function initAnger() {
    let numOfAngerSprites = 30; // Number of small anger circles
    let diameter = 10;
    for (let i = 0; i < numOfAngerSprites; i++) {
        let x = random(width);
        let y = random(height);
        let angerSprite = new angerGroup.Sprite(x, y, diameter);
        angerSprite.color = 'black';
        angerSprite.collider = 'd';
        angerGroup.add(angerSprite);
        angerSprite.bounciness=1;
    }

    // Set overlap handler
    colliding();
    angerSound.play();

}

function draw() {
    background(0);
    if (refresh) {
        initSimulation();
        refresh = false;
    }

    // Move edge sprites towards the target point with vertical oscillation
    let oscillationSpeed = 20;
    let amplitude = 10;

    circleGroup.forEach((sprite, index) => {
        let angle = millis() / oscillationSpeed + index;
        sprite.moveTowards(width, height *2 + sin(angle) * amplitude, 0.04);
    });

    // Recalculate the convex hull based on the latest positions
    let vertices = [];
    circleGroup.forEach(sprite => {
        vertices.push(createVector(sprite.x, sprite.y));
    });

    let hull = convexHull(vertices);

    // Calculate centroid
    let centroid = createVector(0, 0);
    hull.forEach(v => {
        centroid.x += v.x;
        centroid.y += v.y;
    });
    centroid.x /= hull.length;
    centroid.y /= hull.length;

    // Scale hull points outward to create spikes
    let scaleFactor = 1.1; // Adjust this value to make the hull slightly bigger
    let spikeFactor = 1.2; // Adjust this value to make spikes more pronounced
    let scaledHull = hull.map(v => {
        let dir = p5.Vector.sub(v, centroid);
        dir.mult(scaleFactor);
        return p5.Vector.add(centroid, dir);
    });

    let spikeHull = hull.map(v => {
        let dir = p5.Vector.sub(v, centroid);
        dir.mult(spikeFactor);
        return p5.Vector.add(centroid, dir);
    });

    let colorEdge = color(139, 0, 0); // Dark blood red
    fill(colorEdge);
    noStroke();
    beginShape();
    let curvePoints = catmullRomSpline(scaledHull, 30, 0.7); // Increase resolution and adjust tension
    curvePoints.forEach(v => {
        vertex(v.x, v.y);
    });
    endShape(CLOSE);

    stroke(colorEdge);
    strokeWeight(2);
    for (let i = 0; i < scaledHull.length; i++) {
        let nextIndex = (i + 1) % scaledHull.length;
        let midPoint = p5.Vector.add(scaledHull[i], scaledHull[nextIndex]).mult(0.5);
        let spike = spikeHull[i];
        fill(colorEdge);
        noStroke();
        beginShape();
        vertex(scaledHull[i].x, scaledHull[i].y);
        vertex(midPoint.x, midPoint.y);
        vertex(spike.x, spike.y);
        endShape(CLOSE);
    }

    // Draw the anger sprite last to ensure it is on top
    stroke(255);
    anger.draw();

    if (circleGroup[0].x > width) {
        circleGroup.forEach(sprite => sprite.remove());
        // joints.forEach(j => j.remove());
        setTimeout(resetShape, 5000);
        initAnger();
    }
    // collides(anger);
}

function colliding(anger) {
    setTimeout(() => {
        for (let i = 0; i < 50; i++) {
            let piece = new Sprite(centerSprite.x-10, centerSprite.y, 13);
            piece.draw = function() {
                fill("red");
                noStroke();
                beginShape();
                vertex(this.x, this.y - this.diameter / 2);
                vertex(this.x - this.diameter / 2, this.y + this.diameter / 2);
                vertex(this.x + this.diameter / 2, this.y + this.diameter / 2);
                endShape(CLOSE);
            };
            piece.life = random(30, 100);
        }
        // anger.remove();
    }, 1000); // Delay of 1 second
    circleGroup.applyForce(10)
}


function resetShape() {
    initSimulation();
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

function catmullRomSpline(points, resolution) {
    let curvePoints = [];
    for (let i = 0; i < points.length; i++) {
        let p0 = points[(i - 1 + points.length) % points.length];
        let p1 = points[i];
        let p2 = points[(i + 1) % points.length];
        let p3 = points[(i + 2) % points.length];

        for (let t = 0; t < resolution; t++) {
            let t1 = t / resolution;
            let t2 = t1 * t1;
            let t3 = t2 * t1;

            let x = 0.5 * ((2 * p1.x) +
                (-p0.x + p2.x) * t1 +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

            let y = 0.5 * ((2 * p1.y) +
                (-p0.y + p2.y) * t1 +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

            curvePoints.push(createVector(x, y));
        }
    }
    return curvePoints;
}
