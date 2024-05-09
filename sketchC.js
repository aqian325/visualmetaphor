// Sketch C
let sketchC = new p5(( sketch ) => {
    let x = 0;
    let y = 0;

    sketch.setup = () => {
        let canvas = sketch.createCanvas(300, 300);
        canvas.parent('sketchC'); // Set the parent to the grid item with id 'grid-item-2'
    };

    sketch.draw = () => {
        sketch.background(0);
        sketch.fill(255, 0, 0);
        sketch.rect(sketch.random(0, 200), sketch.random(0, 200), 50, 50);

        // Display "disorganized" text
        sketch.fill(255); // Set text color to white
        sketch.textSize(16); // Set text size
        sketch.text("chaotic evil", 120, 20); // Display text at coordinates (20, 20)
    };
});
