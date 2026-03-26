// Depends on: all other modules
// Entry point — contains the wave builder and the main game loop.

function buildWave(n) {
  var q      = [];
  var isBoss = n % 3 === 0 && n > 0;

  if (isBoss) {
    var bi = Math.min(Math.floor(n / 3) - 1, BOSSES.length - 1);
    var minionCnt = 7 + n;
    // Spread boss + minions across a 5-second (300-frame) window
    var bossGap = Math.max(1, Math.floor(280 / minionCnt));
    q.push({ typeIdx: 0, delay: 10, isBoss: true, bossIdx: bi });
    for (var i = 0; i < minionCnt; i++) {
      q.push({ typeIdx: Math.min(i % 3, ETYPES.length - 1), delay: 20 + i * bossGap, isBoss: false });
    }
    setMsg('\u26A0\uFE0F BOSS WAVE! ' + BOSSES[bi].name + " is coming for Brent's wallet!");
  } else {
    // Exponential enemy count: ~8 on wave 1, ~83 on wave 10
    var cnt = Math.round(8 * Math.pow(1.3, n - 1));

    // Spawn window shrinks as waves progress
    var windowFrames = n <= 3 ? 180   // waves 1-3 → 3 seconds
                     : n <= 6 ? 120   // waves 4-6 → 2 seconds
                     :           60;  // waves 7-10 → 1 second

    var gap = Math.max(1, Math.floor(windowFrames / cnt));

    for (var i = 0; i < cnt; i++) {
      var t = 0;
      var r = Math.random();
      if (n >= 2 && r < 0.22) t = 1;
      if (n >= 3 && r < 0.18) t = 2;
      if (n >= 4 && r < 0.22) t = 3;
      if (n >= 5 && r < 0.18) t = 4;
      q.push({ typeIdx: t, delay: 10 + i * gap, isBoss: false });
    }
    setMsg('Wave ' + n + ' incoming! The US Army marches on Brent\'s BTC!');
  }

  return q;
}

// ---------------------------------------------------------------------------
// Countdown helpers
// ---------------------------------------------------------------------------
function setCDDisplay(label, num, active) {
  var el = document.getElementById('wave-cd');
  document.getElementById('cd-label').textContent = label;
  document.getElementById('cd-num').textContent   = num;
  el.classList.toggle('cd-active', !!active);
  el.classList.toggle('cd-wave',   !active);
}

function stopCountdown() {
  if (cdInterval) { clearInterval(cdInterval); cdInterval = null; }
}

function launchWave() {
  stopCountdown();
  wave++;
  if (wave > MAX_WAVES) { victory = true; addScore(score); sfxWin(); return; }
  spawnQueue = buildWave(wave);
  spawnTimer = 0;
  waveActive = true;
  sfxWaveStart();
  var isBoss = wave % 3 === 0 && wave > 0;
  setCDDisplay('WAVE ' + wave + ' OF ' + MAX_WAVES, isBoss ? '⚠ BOSS' : 'GO!', false);
  updateHUD();
}

function startCountdown(seconds, label) {
  stopCountdown();
  cdSec = seconds;
  setCDDisplay(label, cdSec, true);
  cdInterval = setInterval(function () {
    cdSec--;
    if (cdSec <= 0) {
      launchWave();
    } else {
      document.getElementById('cd-num').textContent = cdSec;
    }
  }, 1000);
}

// ---------------------------------------------------------------------------
// Main game loop
// ---------------------------------------------------------------------------
function loop() {
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  drawMap();

  if (hoveredTower) hoveredTower.drawRange();

  towers.forEach(function (t) { t.update(); });
  towers.forEach(function (t) { t.draw(); });

  // Spawn enemies from queue
  if (waveActive && spawnQueue.length > 0) {
    spawnTimer++;
    while (spawnQueue.length > 0 && spawnTimer >= spawnQueue[0].delay) {
      spawnTimer = 0;
      var s = spawnQueue.shift();
      enemies.push(new Enemy(s.typeIdx, s.isBoss, s.bossIdx || 0));
    }
  }

  enemies.forEach(function (e) { e.update(); });
  enemies.forEach(function (e) { if (!e.dead) e.draw(); });

  bullets   = bullets.filter(function (b) { return !b.done; });
  bullets.forEach(function (b) { b.update(); b.draw(); });

  particles = particles.filter(function (p) { return p.life > 0; });
  particles.forEach(function (p) { p.update(); p.draw(); });

  floats    = floats.filter(function (f) { return f.life > 0; });
  floats.forEach(function (f) { f.update(); f.draw(); });

  // Enemies reaching Brent
  enemies.filter(function (e) { return e.reached; }).forEach(function (e) {
    var dmg = e.isBoss ? 5 : 1;
    lives  -= dmg;
    e.dead  = true;
    var ep  = gpx(GPATH.length - 1);
    floats.push(new FloatText(
      ep.x + Math.random() * 30 - 15,
      ep.y - 15,
      e.isBoss ? '-5 \u2764\uFE0F' : '-1 \u2764\uFE0F',
      '#F0997B'
    ));
    updateHUD();
  });

  if (lives <= 0 && !gameOver) {
    gameOver = true;
    stopCountdown();
    addScore(score);
    sfxLose();
    setCDDisplay('GAME OVER', '\u2620', false);
    setMsg('GAME OVER! The US Army got Brent!');
  }

  enemies = enemies.filter(function (e) { return !e.dead && !e.reached; });

  // Wave cleared?
  if (waveActive && spawnQueue.length === 0 && enemies.length === 0 && !gameOver && !victory) {
    waveActive = false;
    var bonus  = wave * 35;
    gold      += bonus;
    updateHUD();
    if (wave >= MAX_WAVES) {
      victory = true;
      stopCountdown();
      addScore(score);
      sfxWin();
      setCDDisplay('VICTORY!', '\u20BF', false);
    } else {
      sfxWin();
      setMsg('Wave ' + wave + ' cleared! +' + bonus + '\u20BF bonus! Next wave incoming \u2014 buy upgrades!');
      setTimeout(openShop, 800);
      startCountdown(12, 'WAVE ' + (wave + 1) + ' STARTS IN');
    }
  }

  drawOverlay();
  requestAnimationFrame(loop);
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
loadAssets(function () {
  updateHUD();
  loop();
  // Countdown starts only after the player dismisses the tutorial (see ui.js)
});
