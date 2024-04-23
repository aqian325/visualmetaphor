// switching.js

// Define an array containing the paths to your sketch files.
const sketchFiles = ['sketch1.js', 'sketch2.js', 'sketch3.js', 'sketch4.js', 'sketch5.js','sketch6.js'];
let currentSketchIndex = 0;

// This function will be called either on page load or when the switch button is clicked.
function switchSketch() {
    // Remove the current sketch script if it exists.
    const existingScript = document.getElementById('sketchScript');
    if (existingScript) {
        existingScript.remove();
        console.log(`Removed existing sketch script: ${existingScript.src}`);
    }

    // Get the input element
    const input = document.getElementById('input');

    // Create a new script element for the next sketch.
    const scriptTag = document.createElement('script');
    scriptTag.id = 'sketchScript';
    scriptTag.src = sketchFiles[currentSketchIndex];
    scriptTag.onerror = function() {
        console.error('Error loading the script: ' + scriptTag.src);
    };
    scriptTag.onload = function() {
        console.log('Successfully loaded script: ' + scriptTag.src);
    };

    // Call the setup function of the loaded sketch and pass the input as a parameter
    scriptTag.onload = function() {
        console.log('Successfully loaded script: ' + scriptTag.src);
        setup(input);
    };

    document.body.appendChild(scriptTag);

    // Update the index to point to the next sketch in the array, cycling back to the start if necessary.
    currentSketchIndex = (currentSketchIndex + 1) % sketchFiles.length;
}

// Attach the switchSketch function to window.onload to ensure the first sketch loads when the page is opened.
window.onload = function() {
    console.log("Page loaded. Loading the first sketch...");
    switchSketch();
};
