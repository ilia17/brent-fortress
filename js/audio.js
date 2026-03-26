// ---------------------------------------------------------------------------
// Web Audio API — kept for procedural tones (hit, die, win, lose, meme)
// ---------------------------------------------------------------------------
let AC = null;

function ac() {
  if (!AC) {
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}

function tone(freq, type, dur, vol, startFreq) {
  vol = vol || 0.1;
  const c = ac();
  if (!c) return;
  try {
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    if (startFreq) {
      osc.frequency.setValueAtTime(startFreq, c.currentTime);
      osc.frequency.linearRampToValueAtTime(freq, c.currentTime + dur);
    } else {
      osc.frequency.setValueAtTime(freq, c.currentTime);
    }
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    osc.start();
    osc.stop(c.currentTime + dur);
  } catch (e) {}
}

// ---------------------------------------------------------------------------
// File-based sound effects
// ---------------------------------------------------------------------------
var SND = {};
(function () {
  var files = {
    laser:     'assets/sounds/laser.mpeg',
    rocket:    'assets/sounds/rocket.mpeg',
    emp:       'assets/sounds/ewp.mpeg',
    nuke:      'assets/sounds/nuke.mpeg',
    waveStart: 'assets/sounds/wave start.mpeg',
  };
  Object.keys(files).forEach(function (key) {
    var a = new Audio(files[key]);
    a.volume = key === 'nuke' ? 0.01 : key === 'waveStart' ? 0.5 : 0.01;
    SND[key] = a;
  });
})();

// Throttle table — tower sounds won't retrigger faster than these intervals (ms)
var SND_THROTTLE = { laser: 120, rocket: 200, emp: 250, nuke: 400 };
var SND_LAST     = {};

function playSnd(key) {
  if (!SND[key]) return;
  var now      = Date.now();
  var cooldown = SND_THROTTLE[key] || 0;
  if (cooldown && (now - (SND_LAST[key] || 0)) < cooldown) return;
  SND_LAST[key] = now;
  var clone = SND[key].cloneNode();
  clone.volume = SND[key].volume;
  clone.play().catch(function () {});
}

// ---------------------------------------------------------------------------
// Background soundtrack (looping)
// ---------------------------------------------------------------------------
var MUSIC = new Audio('assets/sounds/soundtrack.mpeg');
MUSIC.loop   = true;
MUSIC.volume = 0.25;

function startMusic() {
  MUSIC.play().catch(function () {});
}

// ---------------------------------------------------------------------------
// Unlock everything on first user gesture
// ---------------------------------------------------------------------------
(function () {
  function unlock() {
    ac();
    document.removeEventListener('click',   unlock);
    document.removeEventListener('keydown', unlock);
  }
  document.addEventListener('click',   unlock);
  document.addEventListener('keydown', unlock);
})();

// ---------------------------------------------------------------------------
// Public sfx API
// ---------------------------------------------------------------------------
function sfxShoot()     { playSnd('laser'); }
function sfxRocket()    { playSnd('rocket'); }
function sfxEmp()       { playSnd('emp'); }
function sfxNuke()      { playSnd('nuke'); }
function sfxWaveStart() { playSnd('waveStart'); }

// Short UI click (place / upgrade)
function sfxClick() {
  var c = ac();
  if (!c) return;
  try {
    var buf  = c.createBuffer(1, Math.floor(c.sampleRate * 0.04), c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    var src  = c.createBufferSource();
    var gain = c.createGain();
    src.buffer = buf;
    gain.gain.value = 0.18;
    src.connect(gain);
    gain.connect(c.destination);
    src.start();
  } catch (e) {}
}

// Meme, hit, die still use procedural tones (no dedicated file)
function sfxMeme() { tone(420, 'square', 0.08, 0.08, 700); }
function sfxHit()  { tone(180, 'square', 0.04, 0.06); }
function sfxDie()  { tone(70,  'sawtooth', 0.18, 0.11, 280); }

// sfxBoss is now just an alias — wave start sound plays for all wave types
function sfxBoss() { playSnd('waveStart'); }

function sfxWin() {
  [523, 659, 784, 1047].forEach(function (f, i) {
    setTimeout(function () { tone(f, 'sine', 0.28, 0.14); }, i * 110);
  });
}

function sfxLose() {
  [280, 200, 150, 70].forEach(function (f, i) {
    setTimeout(function () { tone(f, 'sawtooth', 0.28, 0.14); }, i * 140);
  });
}
