const express = require('express');
var app = express();

app.use(express.json());

app.use(function(req, res, next) {
    express.urlencoded({extended: false});
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

var leaderboard = [];

// ✅ MUST match client
var port = 3000;

// ✅ correct HTTP verb + route
app.post("/submitScore", (req, res) => {

    // ✅ extract fields
    var name = req.body.name;
    var score = parseInt(req.body.score);

    // validation
    if (!name || isNaN(score)) {
        return res.json({
            message: "Invalid input.",
            Leaders: formatLeaderboard()
        });
    }

    // update leaderboard
    leaderboard.push({ name, score });

    leaderboard.sort((a, b) => b.score - a.score);

    if (leaderboard.length > 3) {
        leaderboard = leaderboard.slice(0, 3);
    }

    const isTopScore = leaderboard.find(
        entry => entry.name === name && entry.score === score
    );

    const message = isTopScore
        ? "Score added to leaderboard."
        : "Score not high enough to enter the leaderboard.";

    // ✅ REQUIRED response format
    res.json({
        message: message,
        Leaders: formatLeaderboard()
    });
});

function formatLeaderboard() {
    if (leaderboard.length === 0) return "No leaders yet.";

    return leaderboard.map((entry, index) =>
        `${index + 1}. ${entry.name} - ${entry.score}`
    ).join("\n");
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
