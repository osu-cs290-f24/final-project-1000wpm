const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

var leaderboard = require("./leaderboard.json");

// Set up Handlebars as the view engine
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Super Cool Typing Game',
        topScores: leaderboard,
    });
});

app.get('/game', (req, res) => {
    res.render('index', {
        title: 'Super Cool Typing Game'
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
