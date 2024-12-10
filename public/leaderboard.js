// Existing game variables
let timer = 0;
let score = 0;
let gameActive = false;
let currentText = '';
let timerInterval;
let currentUsername = getUsername();

// Get DOM elements
const textToType = document.getElementById('text-to-type');
const userInput = document.getElementById('user-input');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const gameOverBox = document.getElementById('game-over-box');
const gameOverBackground = document.getElementById('game-over-background');
const gameOverMessage = document.getElementById('game-over-message');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const gameOverRestartBtn = document.getElementById('game-over-restart-btn');
const gameOverHomeBtn = document.getElementById('game-over-home-btn');
const submitScoreBtn = document.getElementById('submit-score-btn');

// Event listeners
submitScoreBtn.addEventListener('click', submitScore);

// Initialize leaderboard on page load
document.addEventListener('DOMContentLoaded', updateLeaderboard);

homeBtn.addEventListener('click', goHome);

restartBtn.addEventListener('click', resetGame);

gameOverRestartBtn.addEventListener('click', () => {
    gameOverBox.style.display = 'none';
    gameOverBackground.style.display = 'none';
    resetGame();
});

gameOverHomeBtn.addEventListener('click', () => {
    gameOverBox.style.display = 'none';
    gameOverBackground.style.display = 'none';
    goHome();
});


//FUNCTIONS

// Game over function
function gameOver() {
    gameActive = false;
    clearInterval(timerInterval);
    
    gameOverMessage.textContent = `Game Over! ${currentUsername}'s score: ${score}`;
    gameOverBox.style.display = 'block';
    gameOverBackground.style.display = 'block';
    
    // Enable submit button for new score
    submitScoreBtn.disabled = false;
    
    updateLeaderboard();
}

// Get username from URL
function getUsername() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username');
}

// Navigation function
function goHome() {
    window.location.href = '/';
}

// Reset game function
function resetGame() {
    timer = 60;
    score = 0;
    gameActive = false;
    currentText = '';
    timerDisplay.textContent = `Time: ${timer}`;
    scoreDisplay.textContent = 'Score: 0';
    textToType.textContent = 'Start Typing to Begin!';
    userInput.value = '';
    
    gameOverBox.style.display = 'none';
    gameOverBackground.style.display = 'none';
}

// Submit score to leaderboard
async function submitScore() {
    if (!currentUsername) {
        alert('No username found. Please return to home page.');
        return;
    }

    try {
        const response = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: currentUsername, score })
        });

        if (response.ok) {
            submitScoreBtn.disabled = true; // Disable only for current game over screen
            updateLeaderboard();
        } else {
            alert('Failed to submit score. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting score:', error);
        alert('Failed to submit score. Please try again.');
    }
}

// Update leaderboard display
async function updateLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaderboard = await response.json();
        
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        
        leaderboard.slice(0, 10).forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
            leaderboardList.appendChild(li);
        });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
}





