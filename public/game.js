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

let timerStarted = false;
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


document.getElementById('submit-score-btn').addEventListener('click', async () => {
    // Get username from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('username');
    const score = parseInt(document.getElementById('score').textContent.split(': ')[1]);
    
    if (!playerName) {
        alert('No username found. Please return to home page.');
        return;
    }

    try {
        const response = await fetch('/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playerName,
                score: score
            })
        });

        if (response.ok) {
            // Disable the save button to prevent multiple submissions
            document.getElementById('submit-score-btn').disabled = true;
            // Update the leaderboard display
            updateLeaderboard();
        } else {
            alert('Failed to save score. Please try again.');
        }
    } catch (error) {
        console.error('Error saving score:', error);
        alert('Error saving score. Please try again.');
    }
});

// Handle restart button click
document.getElementById('game-over-restart-btn').addEventListener('click', restartGame);

// Handle home button click (this could redirect to the home page or reset the game state)
document.getElementById('game-over-home-btn').addEventListener('click', function() {
    window.location.href = '/';  // Redirect to the home page, or you can reset as needed
});

// Call this when the page loads and after saving a score
document.addEventListener('DOMContentLoaded', updateLeaderboard);

gameOverHome.addEventListener('click', () => {
    window.location.href = '/';
})

gameOverRestart.addEventListener('click', startGame);

//Home buttons switch to home page
homeBtn.addEventListener('click', () => {
    window.location.href = '/';
});

//Restart buttons restart the game
restartBtn.addEventListener('click', function () {
    endGame();
    startGame();
});

userInput.addEventListener('keydown', function(event) {
    if (event.key && !gameInterval) {
        startGame();
    }
});

userInput.addEventListener('input', function(event) {
    if (!timerStarted) {
        timerStarted = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
});

window.addEventListener('load', loadWords);



//FUNCTIONS

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

// Update the endGame function to reset the timer flag
// In game.js, modify endGame function:
function endGame() {
    // Stop the game intervals (assuming these are for the timer and game logic)
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    timerStarted = false;

    // Clear the user input and disable it
    userInput.value = '';
    userInput.disabled = true;

    // Display the final score in the game-over message
    gameOverMessage.textContent = `Time's up! Your final score is: ${score}`;

    // Show the game-over modal and background
    gameOverModal.style.display = "block";
    gameOverBackground.style.display = "block";

    // Disable the submit score button until the player enters their name
    document.getElementById('submit-score-btn').disabled = false;

    // Hide the score and timer elements
    document.getElementById('score').classList.add('hidden');
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('user-input').classList.add('hidden');
}

function generateWordQueue() {
    return Array.from({length: 50}, () => words[Math.floor(Math.random() * words.length)]);
}

function loadWords() {
    //Credit to monkeytype for the the contents of words_alpha! I used english 5k https://github.com/monkeytypegame/monkeytype/blob/master/frontend/static/languages/english_5k.json
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

function restartGame() {
    // Reset the score and timer
    score = 0;  // Reset score to 0 (or whatever default value you want)
    timer = 0;  // Reset the timer (set to 0 or start value)
    
    // Reset the text content for score and timer (so they start from initial state)
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('timer').textContent = `Time: ${timer}`;
    
    // Show the score and timer again by removing the 'hidden' class
    document.getElementById('score').classList.remove('hidden');
    document.getElementById('timer').classList.remove('hidden');
    
    // Enable the user input again
    const userInput = document.getElementById('user-input'); // Make sure it's targeting the correct element
    userInput.disabled = false; // Enable the input
    userInput.value = '';  // Optionally clear user input field

    // Make sure user input is visible (remove the hidden class if any)
    userInput.classList.remove('hidden');

    // Hide the game-over modal and background
    gameOverModal.style.display = "none";
    gameOverBackground.style.display = "none";

    // Optionally, restart the game logic (e.g., start the timer and game mechanics)
    startGame();  // Assuming startGame() is a function that begins the game
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

     // Hide the score and timer elements
     document.getElementById('score').classList.remove('hidden');
     document.getElementById('timer').classList.remove('hidden');
     document.getElementById('user-input').classList.remove('hidden');
}

async function updateLeaderboard() {
    try {
        const response = await fetch('/leaderboard');
        const leaderboard = await response.json();
        
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        
        leaderboard.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${entry.name}: ${entry.score}`;
            leaderboardList.appendChild(li);
        });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
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





