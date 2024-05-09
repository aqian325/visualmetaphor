let processedInput = [];

let sketch2 = new p5(( sketch ) => {
    // Define variables for the sketch
    let lines = []; // Array to store line objects
    const circleSpacing = 10; // Spacing between circles
    const maxSpeed = 2; // Maximum speed of circles
    const tetherStrength = 0.02; // Strength of tethering force

    // Setup function for initializing the sketch
    sketch.setup = () => {
        // Create canvas and other necessary elements
        sketch.createCanvas(400, 400);
        sketch.background(255);
        
        // Function to update the sketch with new input value
        sketch.update = (data) => {
            // Ensure that data is an array before passing it to sketch1Update
            if (Array.isArray(data)) {
                // Update the bezierCurves variable with new data
                sketch2Update(data);
            } else {
                console.error("Input data is not an array:", data);
            }
        };
        // Ensure processedInput is defined
        if (typeof processedInput !== 'undefined') {
            // Call the drawing function initially
            drawCirclesFromInput();
        } else {
            console.error('processedInput is not defined.');
        }
        // Call the drawing function initially
        drawCirclesFromInput();
    };

    // Draw function to render the sketch
    sketch.draw = () => {
        // Clear the canvas
        sketch.background(0);
        moveCircles();
        drawCircles();
    };

    // Function to move circles
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
                if (circle.position.x < circle.radius || circle.position.x > sketch.width - circle.radius) {
                    circle.velocity.x *= -1;
                }
                if (circle.position.y < circle.radius || circle.position.y > sketch.height - circle.radius) {
                    circle.velocity.y *= -1;
                }
            }
        }
    }

    // Function to draw circles
    function drawCircles() {
        for (let line of lines) {
            for (let circle of line.circles) {
                sketch.fill(255, 0, 0, 180);
                sketch.noStroke();
                sketch.ellipse(circle.position.x, circle.position.y, circle.radius * 50, circle.radius * 50);
            }
        }
    }

    // Function to draw circles from input data
    function drawCirclesFromInput() {
        const inputText = processedInput.map(line => line.join(' ')).join('\n');
        const textLines = inputText.split('\n');
        lines = []; // Clear previous lines

        let yPos = 20;

        for (let lineText of textLines) {
            const numbers = lineText.split(' ').map(Number);
            let xPos = sketch.random(100,400);
            let line = { circles: [], velocity: sketch.createVector(sketch.random(-maxSpeed, maxSpeed), sketch.random(-maxSpeed, maxSpeed)) };

            for (let i = 0; i < Math.min(numbers.length, 6); i++) {
                const radius = Math.sqrt(numbers[i]);
                line.circles.push({ position: sketch.createVector(xPos + radius, yPos), velocity: sketch.createVector(sketch.random(-maxSpeed, maxSpeed), sketch.random(-maxSpeed, maxSpeed)), radius });
                xPos += radius * 2 + circleSpacing;
            }

            lines.push(line);
            yPos += 100;
        }
    }

    // Function to update sketch based on input data
    function sketch2Update(data) {
        // Update the visualization based on the input data
        processedInput = data;
        drawCirclesFromInput();
    }
});
