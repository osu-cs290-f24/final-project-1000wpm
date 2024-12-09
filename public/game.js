let textToType = document.getElementById('text-to-type');
let userInput = document.getElementById('user-input');
let timerDisplay = document.getElementById('timer');
let scoreDisplay = document.getElementById('score');
let restartBtn = document.getElementById('restart-btn');
let homeBtn = document.getElementById("home-btn");
let gameOverModal = document.getElementById('game-over-box');
let gameOverBackground = document.getElementById('game-over-background');
let gameOverMessage = document.getElementById('game-over-message');
let gameOverRestart = document.getElementById('game-over-restart-btn');
let gameOverHome = document.getElementById("game-over-home-btn");

let timeLimit = 60;  // Time in seconds
let timeLeft = timeLimit;
let score = 0;
let gameInterval;
let timerInterval;
let words = [];
let wordQueue = [];
let currentIndex = 0;
let previousWord = '';
let currentWord = '';
let nextWord = '';

function loadWords() {
    fetch('/words_alpha.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load words');
            }
            return response.text();
        })
        .then(data => {
            words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
            startGame();
        })
        .catch(error => {
            console.error('Error loading words:', error);
        });
}

function startGame() {
    if (words.length === 0) {
        console.error('Words not loaded yet');
        return;
    }

    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    userInput.value = '';
    userInput.disabled = false;
    userInput.focus();

    gameOverModal.style.display = "none";
    gameOverBackground.style.display = "none";

    wordQueue = generateWordQueue();
    currentIndex = 0;
    updateWordDisplay();

    // Reset timer display but don't start it
    timeLeft = timeLimit;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    // Clear any existing intervals
    clearInterval(timerInterval);
    clearInterval(gameInterval);

    // Only start the game loop for checking typing
    gameInterval = setInterval(checkTyping, 50);
}

// Add a flag to track if timer has started
let timerStarted = false;

// Add an input event listener to start timer on first keystroke
userInput.addEventListener('input', function(event) {
    if (!timerStarted) {
        timerStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
});

// Update the endGame function to reset the timer flag
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    timerStarted = false;
    userInput.value = '';
    userInput.disabled = true;
    gameOverMessage.textContent = `Time's up! Your final score is: ${score}`;
    gameOverModal.style.display = "block";
    gameOverBackground.style.display = "block";
}

function generateWordQueue() {
    return Array.from({length: 50}, () => words[Math.floor(Math.random() * words.length)]);
}

function updateWordDisplay() {
    previousWord = currentIndex > 0 ? wordQueue[currentIndex - 1] : '';
    currentWord = wordQueue[currentIndex];
    nextWord = wordQueue[currentIndex + 1];

    textToType.innerHTML = `
        <span class="previous-word">${previousWord}</span>
        <span class="current-word">${currentWord.split('').map(letter => 
            `<span class="untyped-letter">${letter}</span>`).join('')}</span>
        <span class="next-word">${nextWord}</span>
    `;
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
    } else {
        clearInterval(timerInterval);
        endGame();
    }
}

function checkTyping() {
    const currentWordLetters = wordQueue[currentIndex].split('');
    const userLetters = userInput.value.split('');
    
    // Create a span for each letter with appropriate styling
    const letterSpans = currentWordLetters.map((letter, index) => {
        if (index >= userLetters.length) {
            // Letter hasn't been typed yet
            return `<span class="untyped-letter">${letter}</span>`;
        } else if (userLetters[index] === letter) {
            // Letter is correct
            return `<span class="correct-letter">${letter}</span>`;
        } else {
            // Letter is incorrect
            return `<span class="incorrect-letter">${letter}</span>`;
        }
    });

    // Update only the current word with colored letters
    const currentWordElement = document.querySelector('.current-word');
    currentWordElement.innerHTML = letterSpans.join('');

    // Check if word is complete and correct
    if (userInput.value === wordQueue[currentIndex]) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        userInput.value = '';
        
        currentIndex++;
        if (currentIndex >= wordQueue.length - 1) {
            wordQueue = wordQueue.concat(generateWordQueue());
        }
        updateWordDisplay();
    }
}

userInput.addEventListener('keydown', function(event) {
    if (event.key && !gameInterval) {
        startGame();
    }
});

window.addEventListener('load', loadWords);


//Restart buttons restart the game
restartBtn.addEventListener('click', function () {
    endGame();
    startGame();
});
gameOverRestart.addEventListener('click', startGame);

//Home buttons switch to home page
homeBtn.addEventListener('click', () => {
    window.location.href = '/';
});
gameOverHome.addEventListener('click', () => {
    window.location.href = '/';
})