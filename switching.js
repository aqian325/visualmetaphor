let currentSketch = 1;

function setup() {
    createCanvas(1500, 800);
    background(200);

    // Create a button element and place it beneath the canvas.
    let btn = createButton('Change Sketch');
    btn.position(0, 100);

    // Call changeSketch() when the button is pressed.
    btn.mousePressed(changeSketch);

    // Describe the sketch
}

// Toggle between different sketches
function changeSketch() {
    currentSketch++;
    if (currentSketch > 6) {
        currentSketch = 1; // Reset to first sketch
    }

    // Call the appropriate sketch based on the currentSketch value
    switch (currentSketch) {
        case 1:
            sketch1();
            break;
        case 2:
            sketch2();
            break;
        case 3:
            sketch3();
            break;
        case 4:
            sketch4();
            break;
        case 5:
            sketch5();
            break;            
        case 6:
            sketch6();
            break;  
        default:
            break;
    }
}
