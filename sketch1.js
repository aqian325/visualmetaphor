// let bezierCurves = [];

// function setup() {
//     createCanvas(300, 300);
//     background(255,0,0);
// }

// function draw() {
//     background(0);
//     updateAndDrawCurves();
// }

// function sketch1Update(data) {
//     // Update sketch visuals based on the processed input data
//     bezierCurves = []; // Clear existing curves
//     let inputText = data.map(line => line.join(' ')).join('\n');
//     let lines = inputText.split('\n');

//     lines.forEach((line, i) => {
//         let numbers = line.split(' ').map(Number);
//         if (numbers.length >= 8) { // Ensure there are enough numbers to draw a Bezier curve
//             bezierCurves.push(new BezierCurve(...numbers.map(n => n * 20 + 20)));
//         }
//     });
// }

// function updateAndDrawCurves() {
//     bezierCurves.forEach(curve => {
//         updateCurve(curve);
//         drawBezierCurve(curve);
//     });
// }

// function updateCurve(curve) {
//     curve.points = curve.points.map((point, index) => {
//         // Update point position by its velocity
//         let velocity = curve.velocities[index];
//         let newPos = point + velocity;

//         // Check for boundary collision and reverse direction if needed
//         if (newPos <= 0 || newPos >= (index % 2 === 0 ? width : height)) {
//             curve.velocities[index] *= -1;
//             newPos = constrain(newPos, 0, (index % 2 === 0 ? width : height));
//         }

//         return newPos;
//     });
// }

// function drawBezierCurve(curve) {
//     noFill();
//     stroke(255, 0, 0);
//     strokeWeight(5);
//     bezier(
//         curve.points[0], curve.points[1],
//         curve.points[2], curve.points[3],
//         curve.points[4], curve.points[5],
//         curve.points[6], curve.points[7]
//     );
// }

// function BezierCurve(x1, y1, x2, y2, x3, y3, x4, y4) {
//     this.points = [x1, y1, x2, y2, x3, y3, x4, y4];
//     this.velocities = [
//         random(-2, 2), random(-2, 2),
//         random(-2, 2), random(-2, 2),
//         random(-2, 2), random(-2, 2),
//         random(-2, 2), random(-2, 2)
//     ];
// }


let sketch1 = new p5(( sketch ) => {
    // Define variables for the sketch
    let bezierCurves = [];

    // Setup function for initializing the sketch
    sketch.setup = () => {
        // Create canvas and other necessary elements
        sketch.createCanvas(300, 300);
        sketch.background(255, 0, 0);
    };

    // Function to update the sketch with new input value
    sketch.update = (data) => {
        // Ensure that data is an array before passing it to sketch1Update
        if (Array.isArray(data)) {
            // Update the bezierCurves variable with new data
            sketch1Update(data);
        } else {
            console.error("Input data is not an array:", data);
        }
    };


    // Draw function to render the sketch
    sketch.draw = () => {
        // Clear the canvas
        sketch.background(255,0,0);
        
        // Draw bezier curves
        updateAndDrawCurves();
    };

    // Function to update bezier curves based on input data
    function sketch1Update(data) {
        // Update sketch visuals based on the processed input data
        bezierCurves = []; // Clear existing curves
        let inputText = data.map(line => line.join(' ')).join('\n');
        let lines = inputText.split('\n');

        lines.forEach((line, i) => {
            let numbers = line.split(' ').map(Number);
            if (numbers.length >= 8) { // Ensure there are enough numbers to draw a Bezier curve
                bezierCurves.push(new BezierCurve(...numbers.map(n => n * 20 + 20)));
            }
        });
    }

    // Function to update and draw bezier curves
    function updateAndDrawCurves() {
        bezierCurves.forEach(curve => {
            updateCurve(curve);
            drawBezierCurve(curve);
        });
    }

    // Function to update curve position
    function updateCurve(curve) {
        curve.points = curve.points.map((point, index) => {
            // Update point position by its velocity
            let velocity = curve.velocities[index];
            let newPos = point + velocity;

            // Check for boundary collision and reverse direction if needed
            if (newPos <= 0 || newPos >= (index % 2 === 0 ? sketch.width : sketch.height)) {
                curve.velocities[index] *= -1;
                newPos = sketch.constrain(newPos, 0, (index % 2 === 0 ? sketch.width : sketch.height));
            }

            return newPos;
        });
    }

    // Function to draw bezier curves
    function drawBezierCurve(curve) {
        sketch.noFill();
        sketch.stroke(255, 0, 0);
        sketch.strokeWeight(5);
        sketch.bezier(
            curve.points[0], curve.points[1],
            curve.points[2], curve.points[3],
            curve.points[4], curve.points[5],
            curve.points[6], curve.points[7]
        );
    }

    // Constructor function for BezierCurve object
    function BezierCurve(x1, y1, x2, y2, x3, y3, x4, y4) {
        this.points = [x1, y1, x2, y2, x3, y3, x4, y4];
        this.velocities = [
            sketch.random(-2, 2), sketch.random(-2, 2),
            sketch.random(-2, 2), sketch.random(-2, 2),
            sketch.random(-2, 2), sketch.random(-2, 2),
            sketch.random(-2, 2), sketch.random(-2, 2)
        ];
    }
});
