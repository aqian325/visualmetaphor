let sketchInput = new p5(( sketch ) => {
    // Define variables for the sketch
    let input;

    // Setup function for initializing the sketch
    sketch.setup = () => {
        // Create canvas and other necessary elements
        sketch.createCanvas(200, 200);
        
        // Create the textarea for user input
        input = sketch.createElement('textarea', '');
        input.style('width', '400px');
        input.style('height', '200px');
        input.style('border-radius', '5px');
        input.style('padding', '10px');
        input.position(900, 200);

        // Set initial value
        input.value("input your favorite lines of poetry here. this is purely for illustrative purposes; each letter will be converted into a number, and each new line is a new visual element.");

        // Call processInput function when input changes
        input.input(processInput);
    };

// Function to process the input
function processInput() {
    // Access the value of the input field
    let inputValue = input.value();
    
    // Split input into lines
    let lines = inputValue.split('\n');
    
    // Convert letters to numbers for each line
    let processedInput = lines.map(line => convertLettersToNumbers(line));

    // Do something with the processed input value, e.g., send it to other sketches
    // For example:
    sketch1.update(processedInput);
    sketch2.update(processedInput);
}


// Function to convert letters to numbers
function convertLettersToNumbers(input) {
    return input.toLowerCase().split(' ').map(numStr => {
        const num = parseInt(numStr);
        return isNaN(num) ? 0 : num; // Convert non-number strings to 0
    });
}

});
