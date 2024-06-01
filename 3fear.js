let numOfSpritesSlider, radiusSlider;
let circleGroup; // Changed from array to Group object
let joints = [];
let prevNumOfSprites = 0; // To track changes in number of sprites
let floor, ceiling, leftWall, rightWall;
let fear;
let fearfulSprites;
let fearSound;


function preload() {
    fearSound = loadSound("assets/fear.wav");
    //source: https://mixkit.co/free-sound-effects/bubbles/
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
    initSimulation();
    mouse.visible = false;

    //building walls :(
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

    //creating fear
    fear = new Sprite();
    fear.x = width;
    fear.y = height / 2;
    fear.d = height;
    // fear.color = '#d2deb6';
    fear.color = (3,3,3,100);
    fear.stroke = 'black';
    fear.collider = 'k';
    fear.bounciness = 0.2;

    circleGroup.overlaps(fear, poof);
}

function initSimulation() {
    if (circleGroup) {
        circleGroup.forEach(s => s.remove());
    }
    joints.forEach(j => j.remove()); // Remove all joints
    joints = [];

    let numOfSprites = 200;
    let radius = 10;

    let colorLeft = color(216, 232, 117, 100); // Pale puke green

    circleGroup = new Group();

    const centerSprite = new circleGroup.Sprite(100, height / 2, radius);
    centerSprite.draw = function() {
        fill(colorLeft);
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
            fill(colorLeft);
            noStroke();
            ellipse(0, 0, this.diameter, this.diameter);
        };
        circleGroup.add(edgeSprite);
    }

    for (let i = 1; i < circleGroup.length; i++) {
        let centerJoint = new DistanceJoint(centerSprite, circleGroup[i]);
        centerJoint.springiness = 0.08;
        centerJoint.draw = function() {
            noStroke();
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };
        joints.push(centerJoint);

        let nextIndex = i + 1 < circleGroup.length ? i + 1 : 1;
        let edgeJoint = new DistanceJoint(circleGroup[i], circleGroup[nextIndex]);
        edgeJoint.springiness = 0.08;
        edgeJoint.draw = function() {
            noStroke();
            line(this.spriteA.x, this.spriteA.y, this.spriteB.x, this.spriteB.y);
        };
        joints.push(edgeJoint);
    }

    let lastEdgeSprite = circleGroup[circleGroup.length - 1];
    let firstEdgeSprite = circleGroup[1];
    let finalJoint = new DistanceJoint(lastEdgeSprite, firstEdgeSprite);
    finalJoint.springiness = 0.08;
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

    let vertices = [];
    circleGroup.forEach(sprite => {
        vertices.push(createVector(sprite.x, sprite.y));
    });

    let hull = convexHull(vertices);

    fill(216, 232, 117, 220); // Pale puke green with opacity
    beginShape();
    let curvePoints = catmullRomSpline(hull, 40,0.7); // Generate curved points with resolution 20
    curvePoints.forEach(v => {
        vertex(v.x, v.y);
    });
    endShape(CLOSE);

    stroke(216, 232, 117);
    fear.draw();

    circleGroup[0].moveTowards(width * 0.8, height / 2, 0.02);
    if (frameCount % 120 === 0) {
        circleGroup[0].moveTowards(width * 0.6, height / 2, 0.02);
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

function poof(circleGroup, fear) {
    fearfulSprites = new Group();
    fearfulSprites.draw();
    fearfulSprites.x = circleGroup.x;
    fearfulSprites.y = circleGroup.y;
    fearfulSprites.diameter = 10;
    fearfulSprites.amount = 1;
    fearfulSprites.life = random(0, 30);
    fearfulSprites.color = "pale puke green";

    fearSound.play();
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
