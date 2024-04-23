let input;
let lines = []; // Array to store line objects
const circleSpacing = 10; // Spacing between circles
const maxSpeed = 0.1; // Maximum speed of circles
const tetherStrength = 0.02; // Strength of tethering force
let yPos = 50;
let lineIndex = 0; // Variable to keep track of the current line being processed
let circleIndex = 0; // Variable to keep track of the current circle being processed

function setup() {
    createCanvas(1500, 800);
    background(0);
    
    // Create a textarea for user input
    input = createElement('textarea', '');
    input.style('width', '500px');
    input.style('height', '150px');
    input.style('border-radius', '15px');
    input.style('padding', '20px');
    input.position(800, 60);
    input.input(drawCirclesFromInput);

    // Set an initial value for demonstration purposes
    input.value("input your favorite lines of poetry here. this is purely for illustrative purposes; each letter will be converted into a number, and each new line is a new visual element.");

    // Call the drawing function initially
    drawCirclesFromInput();
}

function draw() {
    background(0);
    moveCircles();
    drawCircles();
}

function moveCircles() {
    for (let line of lines) {
        // Apply tethering force between each circle and the previous circle in the line
        for (let i = 1; i < line.circles.length; i++) {
            let prevCircle = line.circles[i - 1];
            let circle = line.circles[i];
            let distance = p5.Vector.sub(prevCircle.position, circle.position);
            distance.mult(tetherStrength); // Multiply by tethering strength
            circle.velocity.add(distance);
        }

        // Update position based on velocity and handle boundary conditions
        for (let circle of line.circles) {
            circle.position.add(circle.velocity);

            // Bounce back if hitting the edges
            if (circle.position.x < circle.radius || circle.position.x > width - circle.radius) {
                circle.velocity.x *= -1;
            }
            if (circle.position.y < circle.radius || circle.position.y > height - circle.radius) {
                circle.velocity.y *= -1;
            }
        }
    }
}

function drawCircles() {
    for (let line of lines) {
        for (let circle of line.circles) {
            fill('#9e60f9');
            noStroke();
            ellipse(circle.position.x, circle.position.y, circle.radius * 2, circle.radius * 2);
        }
    }
}

function drawCirclesFromInput() {
    const inputText = input.value();
    const textLines = inputText.split('\n');

    yPos = 50; // Reset yPos for each input

    // Process each line of input
    for (let lineText of textLines) {
        let xPos = random(100, 800);
        const line = { circles: [], velocity: createVector(random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed)) };

        // Create circles for the current line
        for (let i = 0; i < lineText.length; i++) {
            const radius = random(5, 20);
            line.circles.push({
                position: createVector(xPos + radius, yPos),
                velocity: createVector(random(-maxSpeed/20, maxSpeed/20), random(-maxSpeed/20, maxSpeed/20)),
                radius
            });
            xPos += radius * 2 + circleSpacing;
        }

        lines.push(line);
        yPos += 100; // Move to the next line
    }
}
