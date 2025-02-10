let WIDTH: number, HEIGHT: number;
const LETTERS: string = "ABCDE";
const TARGET_SCORE: number = 50;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let letters: Letter[] = [];
let score: number = 0;
let gameOver: boolean = false;
let paused: boolean = false;
let speed: number = 1;
let scoreColorTimeout: number | null = null;

const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const pauseBtn = document.getElementById("pause-btn") as HTMLButtonElement;
const restartBtn = document.getElementById("restart-btn") as HTMLButtonElement;
const sidebar = document.getElementById("sidebar") as HTMLDivElement;
const scoreEl = document.getElementById("score") as HTMLSpanElement;
const startScreen = document.getElementById("start-screen") as HTMLDivElement;
const gameContainer: HTMLDivElement = document.getElementById(
  "game-container"
) as HTMLDivElement;
const resultContainer = document.getElementById(
  "result-container"
) as HTMLDivElement;
const scoreContainer = document.getElementById(
  "score-container"
) as HTMLFieldSetElement;
const resultText = document.getElementById("result-text") as HTMLSpanElement;

//Nahodně generované písmeno s náhodnou velikostí a pozadím. Obsahuje metody update a draw pro vykreslování písmena a pozice, s kontrolou konce hry.
class Letter {
  char: string;
  fontSize: number;
  bgSize: number;
  speed: number;
  bgColor: string;
  x: number;
  y: number;

  constructor() {
    this.char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    this.fontSize = Math.floor(Math.random() * 64) + 16;
    this.bgSize = this.fontSize + Math.floor(Math.random() * 20) + 10;
    this.speed = speed;
    this.bgColor = getRandomColor();

    this.x = Math.random() * (WIDTH - this.bgSize);
    this.y = -this.bgSize;
  }

  update(): void {
    if (!gameOver && !paused) {
      this.y += speed;
      if (this.y + this.bgSize >= HEIGHT) {
        endGame();
      }
    }
  }

  draw(): void {
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(this.x, this.y, this.bgSize, this.bgSize);
    ctx.fillStyle = "black";
    ctx.font = `${this.fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.char, this.x + this.bgSize / 2, this.y + this.bgSize / 2);
  }
}

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
function initGame(): void {
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
    ctx = canvas.getContext("2d")!;
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
function resizeCanvas(): void {
  canvas.width = gameContainer.clientWidth;
  canvas.height = gameContainer.clientHeight;
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
}

// Herní smyčka
function gameLoop(): void {
  if (!gameOver) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (!paused) {
      if (Math.random() < 0.08) {
        letters.push(new Letter());
      }
      letters.forEach((l) => l.update());
    }

    letters.forEach((l) => l.draw());
    requestAnimationFrame(gameLoop);
  }
}

// Key handler pro ověřovaní získaných bodů
function onKeyPress(event: KeyboardEvent): void {
  if (gameOver || paused) return;
  const pressedKey = event.key.toUpperCase();
  const matchingLetters = letters.filter((l) => l.char === pressedKey);

  if (matchingLetters.length >= 2) {
    updateScore(1, "green");
    speed *= 1.03;
    letters = letters.filter((l) => l.char !== pressedKey);

    if (score >= TARGET_SCORE) {
      winGame();
    }
  } else {
    updateScore(-2, "red");
    speed *= 0.97;
  }
}

// Aktualizace skore
function updateScore(points: number, color: string): void {
  score += points;
  scoreEl.textContent = score.toString();
  scoreContainer.style.backgroundColor = color;
  if (scoreColorTimeout) clearTimeout(scoreColorTimeout);
  scoreColorTimeout = window.setTimeout(() => {
    scoreContainer.style.backgroundColor = "transparent";
  }, 500);
}

// Generování náhodné barvy
function getRandomColor(): string {
  return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

// Pauza / obnovení hry
function togglePause(): void {
  paused = !paused;
  pauseBtn.textContent = paused ? "Obnovit" : "Pozastavit";
}

// Reset hry
function restartGame(): void {
  window.removeEventListener("resize", resizeCanvas);
  window.removeEventListener("keydown", onKeyPress);
  pauseBtn.removeEventListener("click", togglePause);
  restartBtn.removeEventListener("click", restartGame);
  initGame();
}

// Konec hry
function endGame(): void {
  gameOver = true;
  resultContainer.style.display = "flex";
  resultContainer.style.backgroundColor = "red";
  resultText.textContent = `KONEC HRY! Získal jsi ${score} bodů.`;
  pauseBtn.style.display = "none";
  canvas.style.opacity = "0.25";
}

// Vítězná hra
function winGame(): void {
  gameOver = true;
  resultContainer.style.display = "flex";
  resultContainer.style.backgroundColor = "green";
  resultText.textContent = `VYHRÁL JSI! Skóre: ${score}`;
  pauseBtn.style.display = "none";
  canvas.style.opacity = "0.25";
}

//Start
showStartScreen();
