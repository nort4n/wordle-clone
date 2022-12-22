const ANSWER_LENGTH = 6;
const ROUNDS = 6;
let currentRow = 0;
let todaysWord;

let validWord = false;
let isLoading = true;
let done = false;
const userInput = [];
const gameBoard = document.querySelector(".game");
// const keyBoard = document.querySelector(".keyboard");
// const keys = keyBoard.querySelectorAll(":scope > * > *");

const rows = gameBoard.children;
let letterBoxes = rows[currentRow].children;
const loadingDiv = document.querySelector(".info-bar");

async function init() {
    setLoading(isLoading);
    todaysWord = await getTodaysWord();

    isLoading = false;
    setLoading(isLoading);
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
    return /^[a-zA-ZäöüÄÖÜß]$/.test(letter);
}
function strokeHandler(key) {
    if (done || isLoading) {
        return;
    }
    // add exceptions for backspace and enter
    isLetter(key)
        ? displayLetter(key)
        : key === "Backspace"
        ? deleteLetter()
        : key === "Enter"
        ? verifyGuessedWord(userInput)
        : console.log("invalid key", key);
}

// display valid input on square
function displayLetter(letter) {
    if (userInput.length < 5 && letter != "ß") {
        letterBoxes[userInput.length].innerText = letter.toUpperCase();
        userInput.push(letter.toUpperCase());
    }
    if (userInput.length < 5 && letter === "ß") {
        letterBoxes[userInput.length].innerText = letter;
        userInput.push(letter.toUpperCase());
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
async function verifyGuessedWord(userInput) {
    const word = userInput.join("");
    if (word.length !== ANSWER_LENGTH) {
        // incomplete attempt
        return;
    }
    const wordArray = todaysWord.split("");
    isLoading = true;
    setLoading(isLoading);
    await validateWord(word);
    isLoading = false;
    setLoading(isLoading);

    if (!validWord) {
        markInvalidWord();
        return;
    }
    const map = makeMap(wordArray);

    // verifying try in several steps
    // first pass, checking for perfect matches

    for (i = 0; i < ANSWER_LENGTH; i++) {
        if (userInput[i] === wordArray[i]) {
            letterBoxes[i].classList.add("green");

            document.querySelector(`#${userInput[i]}`).style.backgroundColor =
                "yellowgreen";
            map[userInput[i]]--;
        }
    }
    // second loop for non-perfect matches and misses
    for (i = 0; i < ANSWER_LENGTH; i++) {
        if (userInput[i] === wordArray[i]) {
            // do nothing
        } else if (map[userInput[i]] && map[userInput[i]] > 0) {
            letterBoxes[i].classList.add("yellow");
            map[userInput[i]]--;
            if (
                document.querySelector(`#${userInput[i]}`).style
                    .backgroundColor != "yellowgreen" &&
                document.querySelector(`#${userInput[i]}`).style
                    .backgroundColor != "gray"
            ) {
                document.querySelector(
                    `#${userInput[i]}`
                ).style.backgroundColor = "goldenrod";
            }
        } else {
            letterBoxes[i].classList.add("gray");
            document.querySelector(`#${userInput[i]}`).style.backgroundColor =
                "gray";
        }
    }
    currentRow++;
    userInput.length = 0;
    if (word === todaysWord) {
        document.querySelector(".brand").classList.add("winner");
        alert("You Win!");
        done = true;
    } else if (currentRow === ROUNDS) {
        alert(`You lose. The word was ${todaysWord}`);
        done = true;
        return;
    }
    letterBoxes = rows[currentRow].children;
}
// ------------api--------------
// get daily word
async function getTodaysWord() {
    const promise = await fetch("https://words.dev-apis.com/word-of-the-day");
    const processedResponse = await promise.json();
    const word = processedResponse.word.toUpperCase();
    return word;
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
        validWord = processedResponse.validWord;
    } catch (error) {
        console.error(error);
    }
}

function makeMap(array) {
    const obj = {};
    for (i = 0; i < array.length; i++) {
        if (obj[array[i]]) {
            obj[array[i]++];
        } else {
            obj[array[i]] = 1;
        }
    }
    return obj;
}

// loading function for later use
function setLoading(isLoading) {
    loadingDiv.classList.toggle("hidden", !isLoading);
    return;
}

// UI response to invalid attempt
function markInvalidWord() {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
        letterBoxes[i].classList.remove("invalid");
        setTimeout(() => letterBoxes[i].classList.add("invalid"), 10);
    }
}

init();
