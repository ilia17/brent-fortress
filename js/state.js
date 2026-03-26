// Depends on: constants.js (W, H)
// Sets up the canvas and holds all mutable game state.

const canvas = document.getElementById('gc');
const ctx    = canvas.getContext('2d');
canvas.width  = W;
canvas.height = H;

// Use high-quality downsampling for all PNG sprites
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Economy & progression
let gold  = 200;
let lives = 20;
let wave  = 0;
let score = 0;

// Wave management
let waveActive      = false;
let spawnQueue      = [];
let spawnTimer      = 0;
let cdInterval      = null;   // setInterval handle for the countdown
let cdSec           = 0;      // current seconds remaining

// Active game objects
let enemies   = [];
let towers    = [];
let bullets   = [];
let particles = [];
let floats    = [];

// UI state
let selectedType = 'laser';
let gameOver     = false;
let victory      = false;
let hoveredTower = null;
let shopOpen     = false;

// Leaderboard (persisted in sessionStorage)
let leaderboard = [];
try { leaderboard = JSON.parse(sessionStorage.getItem('brent_lb2') || '[]'); } catch (e) {}

function saveLB() {
  try { sessionStorage.setItem('brent_lb2', JSON.stringify(leaderboard)); } catch (e) {}
}

function addScore(s) {
  leaderboard.push({ name: 'Brent', score: s, wave: wave });
  leaderboard.sort(function (a, b) { return b.score - a.score; });
  leaderboard = leaderboard.slice(0, 10);
  saveLB();
}
