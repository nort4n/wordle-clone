const userInput = [];
let numberOfTries = 0;

let gameBoard = document.querySelector(".game");
let rows = gameBoard.children;
let letterBoxes = rows[numberOfTries].children;
// ------------api--------------
// get daily word
// put guessed word to validate against the dictionary
// ------------non-api-validation----------
// compare valid guess word with daily word
// check for each letter of the guessed words if it is in the daily word
// if no: gray background
// check then if it has the same index
// if yes green background
// if no yellow background

// -------------controls-------------
// testing if an input is not any symbols or signs, just single letters
function isLetter(letter) {
    // add exceptions for backspace and enter
    return /^[a-zA-Z]$/.test(letter);
}
// display valid input on square
// backspace deletes last entry
// upon hitting, verification function is called, testing word length and then validating word

// --------------design----------------
// shake row for invalid guess
function init() {
    eventListener();
}
function eventListener() {
    document
        .querySelector("body")
        .addEventListener("keydown", (event) => strokeHandler(event.key));
}
function strokeHandler(key) {
    isLetter(key)
        ? displayLetter(key)
        : key === "Backspace"
        ? deleteLetter()
        : key === "Enter"
        ? console.log("enter", key)
        : console.log("invalid key", key);
}
init();

function displayLetter(letter) {
    if (userInput.length < 5) {
        letterBoxes[userInput.length].innerText = letter;
        userInput.push(letter);
        console.log(userInput);
    }
}
function deleteLetter() {
    if (userInput.length > 0) {
        letterBoxes[userInput.length - 1].innerText = " ";
        userInput.pop();
        console.log(userInput);
    }
}
