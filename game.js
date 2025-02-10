var WIDTH, HEIGHT;
var LETTERS = "ABCDE";
var TARGET_SCORE = 50;
var canvas;
var ctx;
var letters = [];
var score = 0;
var gameOver = false;
var paused = false;
var speed = 1;
var scoreColorTimeout = null;
var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");
var sidebar = document.getElementById("sidebar");
var scoreEl = document.getElementById("score");
var startScreen = document.getElementById("start-screen");
var gameContainer = document.getElementById("game-container");
var resultContainer = document.getElementById("result-container");
var scoreContainer = document.getElementById("score-container");
var resultText = document.getElementById("result-text");
//Nahodně generované písmeno s náhodnou velikostí a pozadím. Obsahuje metody update a draw pro vykreslování písmena a pozice, s kontrolou konce hry.
var Letter = /** @class */ (function () {
    function Letter() {
        this.char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        this.fontSize = Math.floor(Math.random() * 64) + 16;
        this.bgSize = this.fontSize + Math.floor(Math.random() * 20) + 10;
        this.speed = speed;
        this.bgColor = getRandomColor();
        this.x = Math.random() * (WIDTH - this.bgSize);
        this.y = -this.bgSize;
    }
    Letter.prototype.update = function () {
        if (!gameOver && !paused) {
            this.y += speed;
            if (this.y + this.bgSize >= HEIGHT) {
                endGame();
            }
        }
    };
    Letter.prototype.draw = function () {
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(this.x, this.y, this.bgSize, this.bgSize);
        ctx.fillStyle = "black";
        ctx.font = "".concat(this.fontSize, "px Arial");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.char, this.x + this.bgSize / 2, this.y + this.bgSize / 2);
    };
    return Letter;
}());
// Úvodní obrazovka
function showStartScreen() {
    startScreen.style.display = "flex";
    startBtn.addEventListener("click", startGame, { once: true });
}
// Zahájení hry
function startGame() {
    startScreen.style.display = "none";
    gameContainer.style.display = "block";
    sidebar.style.display = "flex";
    initGame();
}
// Inicializace
function initGame() {
    gameOver = false;
    score = 0;
    scoreEl.textContent = score.toString();
    speed = 1;
    letters = [];
    resultContainer.style.display = "none";
    pauseBtn.style.display = "block";
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.style.backgroundColor = "black";
        ctx = canvas.getContext("2d");
        gameContainer.appendChild(canvas);
    }
    canvas.style.opacity = "1";
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("keydown", onKeyPress);
    pauseBtn.addEventListener("click", togglePause);
    restartBtn.addEventListener("click", restartGame);
    gameLoop();
}
// Změna velikosti okna
function resizeCanvas() {
    canvas.width = gameContainer.clientWidth;
    canvas.height = gameContainer.clientHeight;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
}
// Herní smyčka
function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        if (!paused) {
            if (Math.random() < 0.08) {
                letters.push(new Letter());
            }
            letters.forEach(function (l) { return l.update(); });
        }
        letters.forEach(function (l) { return l.draw(); });
        requestAnimationFrame(gameLoop);
    }
}
// Key handler pro ověřovaní získaných bodů
function onKeyPress(event) {
    if (gameOver || paused)
        return;
    var pressedKey = event.key.toUpperCase();
    var matchingLetters = letters.filter(function (l) { return l.char === pressedKey; });
    if (matchingLetters.length >= 2) {
        updateScore(1, "green");
        speed *= 1.03;
        letters = letters.filter(function (l) { return l.char !== pressedKey; });
        if (score >= TARGET_SCORE) {
            winGame();
        }
    }
    else {
        updateScore(-2, "red");
        speed *= 0.97;
    }
}
// Aktualizace skore
function updateScore(points, color) {
    score += points;
    scoreEl.textContent = score.toString();
    scoreContainer.style.backgroundColor = color;
    if (scoreColorTimeout)
        clearTimeout(scoreColorTimeout);
    scoreColorTimeout = window.setTimeout(function () {
        scoreContainer.style.backgroundColor = "transparent";
    }, 500);
}
// Generování náhodné barvy
function getRandomColor() {
    return "hsl(".concat(Math.random() * 360, ", 70%, 60%)");
}
// Pauza / obnovení hry
function togglePause() {
    paused = !paused;
    pauseBtn.textContent = paused ? "Obnovit" : "Pozastavit";
}
// Reset hry
function restartGame() {
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("keydown", onKeyPress);
    pauseBtn.removeEventListener("click", togglePause);
    restartBtn.removeEventListener("click", restartGame);
    initGame();
}
// Konec hry
function endGame() {
    gameOver = true;
    resultContainer.style.display = "flex";
    resultContainer.style.backgroundColor = "red";
    resultText.textContent = "KONEC HRY! Z\u00EDskal jsi ".concat(score, " bod\u016F.");
    pauseBtn.style.display = "none";
    canvas.style.opacity = "0.25";
}
// Vítězná hra
function winGame() {
    gameOver = true;
    resultContainer.style.display = "flex";
    resultContainer.style.backgroundColor = "green";
    resultText.textContent = "VYHR\u00C1L JSI! Sk\u00F3re: ".concat(score);
    pauseBtn.style.display = "none";
    canvas.style.opacity = "0.25";
}
//Start
showStartScreen();
