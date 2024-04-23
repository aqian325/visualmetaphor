let input;
let bezierCurves = [];
// bezierCurves.push(new BezierCurve(...params));

function setup() {
    createCanvas(1500, 800);
    background(0);

    // Create a textarea for user input
    input = createElement('textarea', '');
    input.style('width', '500px');
    input.style('height', '150px');
    input.style('border-radius', '15px');
    input.style('padding', '20px'); // Add padding inside the textarea
    input.position(800, 60);
    input.input(drawCurves);

    // Set an initial value for demonstration purposes
    input.value("input your favorite lines of poetry here. this is purely for illustrative purposes; each letter will be converted into a number, and each new line is a new visual element.");
    drawCurves();
}

function draw() {
    background(0);
    updateAndDrawCurves();
}

function drawCurves() {
    bezierCurves = []; // Clear existing curves
    let inputText = input.value();
    let lines = inputText.split('\n');

    lines.forEach((line, i) => {
        let numbers = convertLettersToNumbers(line).split(' ').map(Number);
        if (numbers.length >= 8) { // Ensure there are enough numbers to draw a Bezier curve
            bezierCurves.push(new BezierCurve(...numbers.map(n => n * 20 + 20)));
        }
    });
}

function updateAndDrawCurves() {
    bezierCurves.forEach(curve => {
        updateCurve(curve);
        drawBezierCurve(curve);
    });
}

function updateCurve(curve) {
    curve.points = curve.points.map((point, index) => {
        // Update point position by its velocity
        let velocity = curve.velocities[index];
        let newPos = point + velocity;

        // Check for boundary collision and reverse direction if needed
        if (newPos <= 0 || newPos >= (index % 2 === 0 ? width : height)) {
            curve.velocities[index] *= -1;
            newPos = constrain(newPos, 0, (index % 2 === 0 ? width : height));
        }

        return newPos;
    });
}

function drawBezierCurve(curve) {
    noFill();
    stroke(0, 0, 255);
    strokeWeight(15);
    bezier(
        curve.points[0], curve.points[1],
        curve.points[2], curve.points[3],
        curve.points[4], curve.points[5],
        curve.points[6], curve.points[7]
    );
}

function BezierCurve(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.points = [x1, y1, x2, y2, x3, y3, x4, y4];
    this.velocities = [
        random(-20, 20), random(-20, 20),
        random(-20, 20), random(-20, 20),
        random(-2, 2), random(-2, 2),
        random(-20, 20), random(-20, 20)
    ];
}

function convertLettersToNumbers(input) {
    return input.toLowerCase().split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 97 && code <= 122) { // a-z
            return code - 96; // Convert ASCII to alphabetical index (a=1, b=2, ..., z=26)
        }
        return '0'; // Non-alphabet characters converted to '0'
    }).join(' ');
}
