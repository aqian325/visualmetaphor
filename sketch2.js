let input;
let lines = []; // Array to store line objects
const circleSpacing = 10; // Spacing between circles
const maxSpeed = 2; // Maximum speed of circles
const tetherStrength = 0.02; // Strength of tethering force

function setup() {
    createCanvas(1500, 600);
    background(0);
    
    // Create a textarea for user input
    input = createElement('textarea', '');
    input.style('width', '500px');
    input.style('height', '100px');
    input.style('border-radius', '15px');
    input.style('padding', '20px');
    input.position(700, height - 100);
    input.input(drawCirclesFromInput);

    // Set an initial value for demonstration purposes
    input.value("input your favorite lines of poetry here. each new line is a new line.");

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
        // Apply tethering force within the same line
        for (let i = 0; i < line.circles.length - 1; i++) {
            let distance = p5.Vector.sub(line.circles[i + 1].position, line.circles[i].position);
            distance.setMag(distance.mag() * tetherStrength);
            line.circles[i].velocity.add(distance);
            line.circles[i + 1].velocity.sub(distance);
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
            fill(255, 0, 0,180);
            noStroke();
            ellipse(circle.position.x, circle.position.y, circle.radius * 5, circle.radius * 5);
        }
    }
}

function drawCirclesFromInput() {
    const inputText = input.value();
    const textLines = inputText.split('\n');
    lines = []; // Clear previous lines

    let yPos = 50;

    for (let lineText of textLines) {
        const numbers = convertLettersToNumbers(lineText).split(' ').map(Number);
        let xPos = random(100,800);
        let line = { circles: [], velocity: createVector(random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed)) };

        for (let i = 0; i < Math.min(numbers.length, 6); i++) {
            const radius = Math.sqrt(numbers[i]);
            line.circles.push({ position: createVector(xPos + radius, yPos), velocity: createVector(random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed)), radius });
            xPos += radius * 2 + circleSpacing;
        }

        lines.push(line);
        yPos += 100;
    }
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
