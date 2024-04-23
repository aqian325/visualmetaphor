// Define an array containing the paths to your sketch files.
const sketchFiles = ['sketch1.js', 'sketch2.js', 'sketch3.js', 'sketch4.js', 'sketch5.js', 'sketch6.js'];
let currentSketchIndex = 0;

// Function to switch between sketches
function switchSketch() {
    // Remove the current sketch script if it exists.
    const existingScript = document.getElementById('sketchScript');
    if (existingScript) {
        existingScript.remove();
    }

    // Create a new script element for the next sketch.
    const scriptTag = document.createElement('script');
    scriptTag.id = 'sketchScript';
    scriptTag.src = sketchFiles[currentSketchIndex];
    scriptTag.onload = function() {
        console.log('Successfully loaded script: ' + scriptTag.src);
    };

    document.body.appendChild(scriptTag);

    // Update the index to point to the next sketch in the array, cycling back to the start if necessary.
    currentSketchIndex = (currentSketchIndex + 1) % sketchFiles.length;
}

// Attach the switchSketch function to a button click event.
document.querySelector('button').addEventListener('click', switchSketch);

// Load the first sketch when the page loads.
window.onload = switchSketch;
