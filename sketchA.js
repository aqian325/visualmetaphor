// Sketch A
let sketchA = new p5(( sketch ) => {
    let x = 200;
    let y = 100;
    let speedX = 1;
    let speedY = 1;
    let squareSize = 50;
  
    sketch.setup = () => {
        let canvas = sketch.createCanvas(300, 300); // Create a canvas
        canvas.parent('sketchA'); // Set the parent container for the canvas
    };
  
    sketch.draw = () => {
        sketch.background(0);
        sketch.fill(255);
        sketch.rect(x, y, squareSize, squareSize);
        // Update square position
        x += speedX;
        y += speedY;
        
        // Check if the square has completely exited the canvas
        if (x < 0 || x + squareSize > sketch.width || y < 0 || y + squareSize > sketch.height) {
            // Reset square position to the top-left corner
            x = 0;
            y = 0;
        }
    
        // Display "linear" text
        sketch.fill(255); // Set text color to white
        sketch.textSize(16); // Set text size
        sketch.text("lawful evil", 150, 20); // Display text at coordinates (, 20)
    };
});
