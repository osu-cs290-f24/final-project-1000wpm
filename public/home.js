let playButton = document.getElementById("play-button");
let usernameInput = document.getElementById("username-input");

const startGame = () => {
    const username = usernameInput.value.trim();
    if (username) {
        window.location.href = `/game?username=${encodeURIComponent(username)}`;
    } else {
        alert('Please enter a username');
    }
};

playButton.addEventListener('click', startGame);

usernameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});