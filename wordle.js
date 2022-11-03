const userInput = [];
let numberOfTries = 0;
let todaysWord = "ooaar";
let todaysWordArray = [];
let guessedWordBoolean = true;
let gameBoard = document.querySelector(".game");
let rows = gameBoard.children;
let letterBoxes = rows[numberOfTries].children;

// ------------TO DO------------------------
// capitalize displayed letters
// winning animation
// shaking row?
// spinner when waiting for validation (hitting enter)

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
    //getTodaysWord();
    eventListener();
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
        ? verifyGuessedWord(userInput.join(""))
        : console.log("invalid key", key);
}

// display valid input on square
function displayLetter(letter) {
    console.log(rows.length);
    if (userInput.length < 5) {
        letterBoxes[userInput.length].innerText = letter.toUpperCase();
        userInput.push(letter);
    }
}
// backspace deletes last entry
function deleteLetter() {
    if (userInput.length > 0) {
        letterBoxes[userInput.length - 1].innerText = " ";
        userInput.pop();
    }
}
// upon hitting return, verification function is called, testing word length and then validating word
async function verifyGuessedWord(word) {
    //console.log(await validateWord(word));
    console.log(guessedWordBoolean);
    console.log(todaysWord);

    if (word.length === 5 && guessedWordBoolean) {
        for (i = 0; i < letterBoxes.length; i++) {
            letterBoxes[i].setAttribute("class", "square gray");
        }
        for (i = 0; i < word.length; i++) {
            let flag = false;
            for (j = 0; j < todaysWord.length; j++) {
                if (word[i] === todaysWord[j]) {
                    // perfect match
                    if (i === j) {
                        letterBoxes[i].setAttribute("class", "square green");
                        flag = true;
                    } else {
                        // base case: no perfect match yet
                        !flag &&
                            letterBoxes[i].setAttribute(
                                "class",
                                "square yellow"
                            );
                        // no match if the first instance of the letter in the guessword and the last instance of the letter in todaysword is already passed
                        if (
                            word.indexOf(word[i]) < i &&
                            todaysWord.lastIndexOf(word[i]) < i
                        ) {
                            letterBoxes[i].setAttribute("class", "square gray");
                        }
                    }
                }
            }
        }
        numberOfTries++;
        letterBoxes = rows[numberOfTries].children;

        userInput.length = 0;
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
        guessedWordBoolean = processedResponse.validWord;
    } catch (error) {
        console.error(error);
    }
}
init();
