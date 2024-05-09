// Sketch D
let sketchD = new p5((sketch) => {
    let x;
    let y = 150; // Set y-coordinate of the main square
    let speedX = 1; // Set the speed of movement
    let squareSize = 10;
    let squares = [];

    sketch.setup = () => {
        let canvas = sketch.createCanvas(300, 300); // Create a canvas
        canvas.parent('sketchD'); // Set the parent container for the canvas

        // Initialize the square position at the left edge
        x = 150;
    };

    sketch.draw = () => {
        sketch.background(0);
        sketch.noFill();
        sketch.stroke(255);

        // Draw original square
        sketch.rectMode(sketch.CENTER);
        sketch.rect(x, y, squareSize, squareSize);

        // Move original square to the right and oscillate
        x += speedX;

        // Reverse direction if the square hits the right or left edge
        if (x + squareSize / 2 >= sketch.width || x - squareSize / 2 <= 0) {
            speedX *= -1;
        }

        // Draw and update other squares
        squares.forEach(square => {
            sketch.rect(square.x, square.y, squareSize, squareSize);
            square.x += square.speedX;
            square.y += square.speedY;

            // Calculate the direction of attraction towards the main square
            let dx = x - square.x;
            let dy = y - square.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Normalize the direction vector
            dx /= distance;
            dy /= distance;

            // Update the position of the square based on attraction towards the main square
            square.x += dx;
            square.y += dy;
        });

        // Display "disorganized" text
        sketch.fill(255); // Set text color to white
        sketch.textSize(16); // Set text size
        sketch.text("lawful neutral", 120, 20); // Display text at coordinates (20, 20)
    };

    // Add a mousePressed function to add squares when the mouse is clicked
    sketch.mousePressed = () => {
        squares.push({
            x: sketch.mouseX,
            y: sketch.mouseY,
            speedX: sketch.random(-1, 1),
            speedY: sketch.random(-1, 1)
        });
    };
});
