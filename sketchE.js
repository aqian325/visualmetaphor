// Sketch E
let sketchE = new p5((sketch) => {
    let x;
    let y;
    let speedX = 1;
    let speedY = 1;
    let squareSize = 50;
    let increment = 10; // Size increment for growing and shrinking
    let growing = true; // Boolean to track if the square is growing or shrinking

    sketch.setup = () => {
        let canvas = sketch.createCanvas(320, 320); // Create a canvas
        canvas.parent('sketchE'); // Set the parent container for the canvas

        // Initialize the square position at the center of the canvas
        x = (sketch.width - squareSize) / 2 + 10;
        y = (sketch.height - squareSize) / 2 + 10;
    };

    sketch.draw = () => {
        sketch.clear();
        // sketch.background(0);
        sketch.noFill();
        sketch.stroke(255);

        // // Draw outline trail
        // for (let i = squareSize; i >= increment; i -= increment) {
        //     sketch.rect(x, y, i, i);
        // }

        // Update square size
        if (growing) {
            squareSize += increment;
        } else {
            squareSize -= increment;
        }

        // Check if the square size reaches the canvas boundary
        if (squareSize >= sketch.width || squareSize >= sketch.height || squareSize <= 0) {
            growing = !growing; // Change direction
        }

        // Draw the current square
        sketch.noFill();
        sketch.rectMode(sketch.CENTER);
        sketch.rect(x, y, squareSize, squareSize);
           // Display "disorganized" text
        sketch.fill(255); // Set text color to white
        sketch.textSize(16); // Set text size
        sketch.text("true neutral", 120, 20); // Display text at coordinates (20, 20)
    
    };

    // sketch.windowResized = () => {
    //     sketch.resizeCanvas(300, 300); // Adjust canvas size
    //     // Reset square position and size to the center after resizing
    //     x = (sketch.width - squareSize) / 2;
    //     y = (sketch.height - squareSize) / 2;
    // };
    
});
