const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

let leaderboard = require('./leaderboard.json');

// Add JSON parsing middleware
app.use(express.json());

// Set up Handlebars as the view engine
app.engine(
    'hbs',
    exphbs.engine({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views', 'partials'),
    })
);
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
        title: 'Super Cool Typing Game',
        topScores: leaderboard,
    });
});

// Save-score endpoint
app.post('/save-score', async (req, res) => {
    try {
        const { name, score } = req.body;

        // Validate input
        if (!name || typeof score !== 'number') {
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Add new score and sort
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);

        // Save to file
        await fs.writeFile('./leaderboard.json', JSON.stringify(leaderboard, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/leaderboard', (req, res) => {
    res.json(leaderboard);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
