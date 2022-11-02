const userInput = [];
let numberOfTries = 0;
let todaysWord;
let gameBoard = document.querySelector(".game");
let rows = gameBoard.children;
let letterBoxes = rows[numberOfTries].children;

// ------------non-api-validation----------
// compare valid guess word with daily word
// check for each letter of the guessed words if it is in the daily word
// if no: gray background
// check then if it has the same index
// if yes green background
// if no yellow background

// --------------design----------------
// shake row for invalid guess

async function init() {
    getTodaysWord();
    eventListener();
    // await validateWord("past")
}
function eventListener() {
    document
        .querySelector("body")
        .addEventListener("keydown", (event) => strokeHandler(event.key));
}
// -------------controls-------------
// testing if an input is not any symbols or signs, just single letters
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}
function strokeHandler(key) {
    // add exceptions for backspace and enter
    isLetter(key)
        ? displayLetter(key)
        : key === "Backspace"
        ? deleteLetter()
        : key === "Enter"
        ? console.log("enter", key)
        : console.log("invalid key", key);
}
init();
// display valid input on square
function displayLetter(letter) {
    if (userInput.length < 5) {
        letterBoxes[userInput.length].innerText = letter;
        userInput.push(letter);
        console.log(userInput);
    }
}
// backspace deletes last entry
function deleteLetter() {
    if (userInput.length > 0) {
        letterBoxes[userInput.length - 1].innerText = " ";
        userInput.pop();
        console.log(userInput);
    }
}
// upon hitting return, verification function is called, testing word length and then validating word
function verifyGuessedWord(word) {
    if (userInput.length === 5) {
        validateWord(word);
    }
}

// ------------api--------------
// get daily word
async function getTodaysWord() {
    const promise = await fetch("https://words.dev-apis.com/word-of-the-day");
    const processedResponse = await promise.json();
    todaysWord = processedResponse.word;
}

// post guessed word to validate against the dictionary
async function validateWord(word) {
    const objectifiedWord = { word: word };

    try {
        const response = await fetch(
            "https://words.dev-apis.com/validate-word",
            {
                method: "POST",
                body: JSON.stringify(objectifiedWord),
            }
        );
        const processedResponse = await response.json();
        return processedResponse.validWord;
    } catch (error) {
        console.error(error);
    }
}
