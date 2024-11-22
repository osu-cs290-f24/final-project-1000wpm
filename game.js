// game.js
let textToType = document.getElementById('text-to-type');
let userInput = document.getElementById('user-input');
let timerDisplay = document.getElementById('timer');
let scoreDisplay = document.getElementById('score');
let restartBtn = document.getElementById('restart-btn');

let timeLimit = 60;  // Time in seconds
let timeLeft = timeLimit;
let score = 0;
let gameInterval;
let timerInterval;

// List of texts to type
const texts = [
    'The quick brown fox jumps over the lazy dog.',
    'JavaScript is a versatile programming language.',
    'Typing games help improve your speed and accuracy.',
    'Practice makes perfect, keep typing!',
    'Never stop learning, never stop improving.'
];

// Start a new game
function startGame() {
    // Reset values
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    userInput.value = '';
    userInput.disabled = false;
    userInput.focus();

    // Pick a random sentence from the texts array
    let randomText = texts[Math.floor(Math.random() * texts.length)];
    textToType.textContent = randomText;

    // Reset timer
    timeLeft = timeLimit;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    // Start the timer
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    // Start the game loop
    clearInterval(gameInterval);
    gameInterval = setInterval(checkTyping, 100);
}

// Update the timer every second
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
    } else {
        clearInterval(timerInterval);
        endGame();
    }
}

// Check if the user is typing correctly
function checkTyping() {
    if (userInput.value === textToType.textContent) {
        // Correctly typed the text
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        startGame(); // Restart with a new text
    }
}

// End the game when the time is up
function endGame() {
    userInput.disabled = true;
    alert(`Time's up! Your final score is: ${score}`);
}

// Restart the game when the button is clicked
restartBtn.addEventListener('click', startGame);

// Start the game initially
startGame();
