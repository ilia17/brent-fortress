// Depends on: constants.js, state.js, entities.js, audio.js

// ---------------------------------------------------------------------------
// HUD
// ---------------------------------------------------------------------------
function updateHUD() {
  document.getElementById('s-gold').textContent  = Math.floor(gold);
  document.getElementById('s-lives').textContent = lives;
  document.getElementById('s-wave').textContent  = wave + '/' + MAX_WAVES;
  document.getElementById('s-score').textContent = score;
}

function setMsg(msg) {
  document.getElementById('msgbar').textContent = msg;
}

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------
// Stat normalisation bounds (derived from TDEFS)
var STAT_MAX = { dmg: 90, spd: 60 / 38, range: 6 };

function makeStatBar(label, pct, color) {
  var wrap = document.createElement('div');
  wrap.className = 'stat-row';

  var lbl = document.createElement('span');
  lbl.className   = 'stat-lbl';
  lbl.textContent = label;

  var track = document.createElement('div');
  track.className = 'stat-track';

  var fill = document.createElement('div');
  fill.className = 'stat-fill';
  fill.style.width = Math.round(Math.min(pct, 1) * 100) + '%';
  fill.style.background = color;

  track.appendChild(fill);
  wrap.appendChild(lbl);
  wrap.appendChild(track);
  return wrap;
}

function makeBadge(text, color) {
  var b = document.createElement('span');
  b.className = 'stat-badge';
  b.textContent = text;
  b.style.borderColor = color;
  b.style.color = color;
  return b;
}

function openShop() {
  shopOpen = true;
  var sc = document.getElementById('shop-content');
  sc.innerHTML = '';

  // — Buy section —
  var buyTitle = document.createElement('div');
  buyTitle.className   = 'sec-title';
  buyTitle.textContent = 'Buy Towers';
  sc.appendChild(buyTitle);

  Object.keys(TDEFS).forEach(function (key) {
    var def = TDEFS[key];
    var row = document.createElement('div');
    row.className = 'shop-item';

    // Icon
    var iconEl = document.createElement('span');
    iconEl.style.cssText = 'font-size:24px;min-width:30px;';
    iconEl.textContent   = def.icon;

    // Info block
    var infoEl = document.createElement('div');
    infoEl.className = 'shop-item-info';

    // Name + cost on the same line
    var nameRow = document.createElement('div');
    nameRow.style.cssText = 'display:flex;align-items:baseline;gap:8px;margin-bottom:3px;';
    var nameEl = document.createElement('span');
    nameEl.className   = 'shop-item-name';
    nameEl.textContent = def.name;
    var costEl = document.createElement('span');
    costEl.style.cssText = 'font-size:10px;color:#FAC775;font-family:Orbitron,sans-serif;font-weight:700;';
    costEl.textContent   = def.cost + '\u20BF';
    nameRow.appendChild(nameEl);
    nameRow.appendChild(costEl);

    // Desc
    var descEl = document.createElement('div');
    descEl.className   = 'shop-item-desc';
    descEl.textContent = def.desc;

    // Stat bars
    var fireRate = (60 / def.rate);
    var statsEl  = document.createElement('div');
    statsEl.className = 'stat-bars';
    statsEl.appendChild(makeStatBar('DMG',   def.dmg  / STAT_MAX.dmg,   '#D85A30'));
    statsEl.appendChild(makeStatBar('SPD',   fireRate / STAT_MAX.spd,   '#5DCAA5'));
    statsEl.appendChild(makeStatBar('RANGE', def.range / STAT_MAX.range, '#378ADD'));

    // Special badges
    var badgeRow = document.createElement('div');
    badgeRow.style.cssText = 'display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;';
    if (def.splash > 0) badgeRow.appendChild(makeBadge('AoE ' + def.splash + ' cells', '#D85A30'));
    if (def.slow   > 0) badgeRow.appendChild(makeBadge('Slows ' + Math.round(def.slow * 100) + '%', '#5DCAA5'));
    var dps = Math.round(def.dmg * (60 / def.rate));
    badgeRow.appendChild(makeBadge('DPS ~' + dps, '#aaa'));

    infoEl.appendChild(nameRow);
    infoEl.appendChild(descEl);
    infoEl.appendChild(statsEl);
    infoEl.appendChild(badgeRow);
    row.appendChild(iconEl);
    row.appendChild(infoEl);

    // Buy button
    var btn = document.createElement('button');
    btn.className   = 'shop-btn';
    btn.textContent = gold >= def.cost ? 'Buy' : 'No funds';
    btn.disabled    = gold < def.cost;

    (function (k, d) {
      btn.onclick = function () {
        selectedType = k;
        document.querySelectorAll('.tbtn').forEach(function (b) {
          b.classList.toggle('sel', b.dataset.type === k);
        });
        closeShop();
        setMsg('Selected ' + d.name + ' \u2014 click grass to place!');
      };
    })(key, def);

    row.appendChild(btn);
    sc.appendChild(row);
  });

  // — Sell section —
  if (towers.length > 0) {
    var sellTitle = document.createElement('div');
    sellTitle.className   = 'sec-title';
    sellTitle.style.color = '#D85A30';
    sellTitle.textContent = 'Sell Towers';
    sc.appendChild(sellTitle);

    towers.forEach(function (t, i) {
      var row = document.createElement('div');
      row.className = 'shop-item';

      var iconEl = document.createElement('span');
      iconEl.style.cssText = 'font-size:20px;min-width:26px;';
      iconEl.textContent   = t.icon;

      var infoEl = document.createElement('div');
      infoEl.className = 'shop-item-info';

      var nameEl = document.createElement('div');
      nameEl.className   = 'shop-item-name';
      nameEl.textContent = t.name + ' Lv' + t.level;

      var descEl = document.createElement('div');
      descEl.className   = 'shop-item-desc';
      descEl.textContent = 'Grid [' + t.col + ',' + t.row + '] | Sell: +' + t.sellVal + '\u20BF | Upgrade: ' + t.upgCost + '\u20BF';

      infoEl.appendChild(nameEl);
      infoEl.appendChild(descEl);
      row.appendChild(iconEl);
      row.appendChild(infoEl);

      var sb = document.createElement('button');
      sb.className   = 'shop-btn sell';
      sb.textContent = '+' + t.sellVal + '\u20BF';

      (function (tower, idx) {
        sb.onclick = function () {
          gold += tower.sellVal;
          towers.splice(idx, 1);
          updateHUD();
          openShop();
          setMsg('Sold ' + tower.name + ' for ' + tower.sellVal + '\u20BF');
        };
      })(t, i);

      row.appendChild(sb);
      sc.appendChild(row);
    });
  }

  document.getElementById('shop-overlay').classList.add('show');
}

function closeShop() {
  shopOpen = false;
  document.getElementById('shop-overlay').classList.remove('show');
}

document.getElementById('close-shop').onclick = closeShop;

// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------
function openLB() {
  var container = document.getElementById('lb-rows');
  container.innerHTML = '';

  if (!leaderboard.length) {
    container.innerHTML = '<div style="color:#5a7a5a;font-size:13px;padding:8px 0;">No scores yet. Beat a wave first!</div>';
  } else {
    leaderboard.forEach(function (entry, i) {
      var row = document.createElement('div');
      row.className = 'lb-row' + (i === 0 ? ' gold' : '');
      row.innerHTML =
        '<span class="lb-rank">#' + (i + 1) + '</span>' +
        '<span class="lb-name">'  + entry.name  + '</span>' +
        '<span class="lb-wave">W' + entry.wave  + '</span>' +
        '<span class="lb-score">' + entry.score + '\u20BF</span>';
      container.appendChild(row);
    });
  }

  document.getElementById('lb-overlay').classList.add('show');
}

document.getElementById('close-lb').onclick = function () {
  document.getElementById('lb-overlay').classList.remove('show');
};

// ---------------------------------------------------------------------------
// Tutorial
// ---------------------------------------------------------------------------
document.getElementById('close-tut').onclick = function () {
  document.getElementById('tut-overlay').classList.remove('show');
  ac();         // unlock Web Audio API
  startMusic(); // start looping soundtrack
  startCountdown(8, 'WAVE 1 STARTS IN');
};

document.getElementById('lb-btn').onclick = openLB;

// ---------------------------------------------------------------------------
// Countdown badge — click to skip the wait
// ---------------------------------------------------------------------------
document.getElementById('wave-cd').addEventListener('click', function () {
  if (!cdInterval || waveActive || gameOver || victory) return;
  launchWave();
});

// ---------------------------------------------------------------------------
// Canvas interactions
// ---------------------------------------------------------------------------
canvas.addEventListener('mousemove', function (e) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = W / rect.width;
  var scaleY = H / rect.height;
  var mx = (e.clientX - rect.left) * scaleX;
  var my = (e.clientY - rect.top)  * scaleY;
  hoveredTower = towers.find(function (t) { return Math.hypot(t.x - mx, t.y - my) < CELL / 2; }) || null;
});

canvas.addEventListener('click', function (e) {
  if (gameOver || victory || shopOpen) return;

  var rect   = canvas.getBoundingClientRect();
  var scaleX = W / rect.width;
  var scaleY = H / rect.height;
  var mx     = (e.clientX - rect.left) * scaleX;
  var my     = (e.clientY - rect.top)  * scaleY;
  var col    = Math.floor(mx / CELL);
  var row    = Math.floor(my / CELL);

  // Click existing tower → upgrade
  var existing = towers.find(function (t) { return t.col === col && t.row === row; });
  if (existing) {
    var uc = existing.upgCost;
    if (gold >= uc) {
      gold -= uc;
      existing.level++;
      existing.dmg   = TDEFS[existing.type].dmg   * (1 + 0.28 * (existing.level - 1));
      existing.range = TDEFS[existing.type].range  * CELL * (1 + 0.08 * (existing.level - 1));
      updateHUD();
      setMsg('Upgraded ' + existing.name + ' to Lv' + existing.level + '!');
      sfxClick();
    } else {
      setMsg('Need ' + uc + '\u20BF to upgrade (or sell in shop)!');
    }
    return;
  }

  if (isPath(col, row))               { setMsg("Can't build on the path!"); return; }
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;

  var cost = TDEFS[selectedType].cost;
  if (gold < cost) { setMsg('Need ' + cost + '\u20BF! Open shop to sell towers.'); return; }

  gold -= cost;
  towers.push(new Tower(col, row, selectedType));
  updateHUD();
  setMsg('Placed ' + TDEFS[selectedType].name + '! Click it to upgrade.');
  sfxClick();
});

// ---------------------------------------------------------------------------
// Tower selector buttons
// ---------------------------------------------------------------------------
document.querySelectorAll('.tbtn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tbtn').forEach(function (b) { b.classList.remove('sel'); });
    btn.classList.add('sel');
    selectedType = btn.dataset.type;
    var d = TDEFS[selectedType];
    setMsg(d.name + ' selected \u2014 ' + d.cost + '\u20BF | ' + d.desc);
  });
});
