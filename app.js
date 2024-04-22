const express = require('express');
const app = express();
const port = 3000;

// Middleware to handle form data parsing
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handling the form submission
app.post('/submit', (req, res) => {
    const inputText = req.body.inputText;
    const translatedText = lettersToNumbers(inputText);
    res.send(`
        <h1>Visual Metaphor Machine</h1>
        <p>You entered: ${inputText}</p>
        <p>Translated to numbers: ${translatedText}</p>
        <a href="/">Try another</a>
    `);
});

// Function to convert letters to their numeric position in the alphabet
function lettersToNumbers(input) {
    return input.toLowerCase().split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 97 && code <= 122) { // Check for lowercase a-z
            return code - 96; // Convert ASCII to alphabetical index (a=1, b=2, ..., z=26)
        }
        return char; // Non-alphabet characters are returned unchanged
    }).join(' ');
}

// Starting the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
