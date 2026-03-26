// Depends on: constants.js, path.js, state.js

// ---------------------------------------------------------------------------
// Per-tile deterministic "noise" — avoids Math.random() per frame
// ---------------------------------------------------------------------------
function tileHash(col, row) {
  var v = (col * 2654435761 ^ row * 2246822519) >>> 0;
  return v % 100; // 0-99
}

// ---------------------------------------------------------------------------
// Army camp — fixed at top-left, 5 cells wide × 3 cells tall
// ---------------------------------------------------------------------------
function drawArmyCamp() {
  var campW = CELL * 5;  // 200 px
  var campH = CELL * 3;  // 120 px — enough room for tent + flag + badge
  var ox = 0, oy = 0;

  ctx.save();

  // ── Camo ground pad ───────────────────────────────────────────────────────
  ctx.fillStyle = '#1c2210';
  ctx.fillRect(ox, oy, campW, campH);
  ctx.save();
  ctx.globalAlpha = 0.10;
  for (var si = 0; si < 8; si++) {
    ctx.fillStyle = si % 2 === 0 ? '#3a5020' : '#283818';
    ctx.fillRect(ox + si * 26, oy, 13, campH);
  }
  ctx.restore();

  // Dashed perimeter
  ctx.strokeStyle = '#4a6030'; ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 3]);
  ctx.strokeRect(ox + 1, oy + 1, campW - 2, campH - 2);
  ctx.setLineDash([]);

  // ── Tent — centred horizontally, lower half of camp ───────────────────────
  // ty is the tent body baseline; roof peak is ty-26; whole thing sits comfortably in 120px
  var tx = ox + campW * 0.58;  // shift right to leave room for flag on the left
  var ty = oy + 92;            // baseline near bottom (leaves 28px for sandbags)

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.beginPath(); ctx.ellipse(tx, ty + 11, 28, 6, 0, 0, Math.PI * 2); ctx.fill();

  // Tent body
  ctx.fillStyle = '#3d5228';
  ctx.beginPath(); ctx.roundRect(tx - 26, ty - 4, 52, 18, 3); ctx.fill();

  // Tent roof
  ctx.fillStyle = '#2e4020';
  ctx.beginPath();
  ctx.moveTo(tx - 30, ty - 2); ctx.lineTo(tx, ty - 26); ctx.lineTo(tx + 30, ty - 2);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5a7a35'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(tx - 30, ty - 2); ctx.lineTo(tx, ty - 26); ctx.lineTo(tx + 30, ty - 2);
  ctx.stroke();

  // Entrance flap
  ctx.fillStyle = '#1c2c10';
  ctx.beginPath(); ctx.roundRect(tx - 8, ty - 3, 16, 18, [0, 0, 3, 3]); ctx.fill();

  // Guy-ropes + pegs
  ctx.strokeStyle = '#8a8060'; ctx.lineWidth = 1;
  [[-30, -2, -40, 10], [30, -2, 40, 10]].forEach(function(l) {
    ctx.beginPath(); ctx.moveTo(tx+l[0], ty+l[1]); ctx.lineTo(tx+l[2], ty+l[3]); ctx.stroke();
  });
  ctx.fillStyle = '#8a8060';
  [[-40,10],[40,10]].forEach(function(p) {
    ctx.beginPath(); ctx.arc(tx+p[0], ty+p[1], 2, 0, Math.PI*2); ctx.fill();
  });

  // ── Flag pole — left side of camp, fully within 120px height ─────────────
  // Pole base at y=100, pole top at y=28 (leaves 8px at top for badge)
  var fpx = ox + 28;
  var fBase = oy + 100, fTop = oy + 28;
  ctx.strokeStyle = '#c0b070'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(fpx, fBase); ctx.lineTo(fpx, fTop); ctx.stroke();

  // US flag — attaches at pole top, 30×20 px
  var fW = 30, fH = 20, fy0 = fTop;
  ctx.fillStyle = '#fff'; ctx.fillRect(fpx, fy0, fW, fH);
  var sh = fH / 7;
  for (var fs = 0; fs < 7; fs++) {
    ctx.fillStyle = '#B22234';
    ctx.fillRect(fpx, fy0 + fs * sh * 2, fW, sh);
  }
  ctx.fillStyle = '#3C3B6E';
  ctx.fillRect(fpx, fy0, Math.round(fW * 0.46), Math.round(fH * 0.55));
  ctx.fillStyle = '#fff';
  ctx.font = '4px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]].forEach(function(s) {
    ctx.fillText('\u2605', fpx + 3 + s[0] * 4.5, fy0 + 3 + s[1] * 4);
  });

  // ── Oil drums — left of tent ───────────────────────────────────────────────
  [[tx - 46, ty + 4, '#333'], [tx - 36, ty + 4, '#1a3a10'], [tx - 41, ty - 4, '#333']].forEach(function(d) {
    ctx.fillStyle = d[2];
    ctx.beginPath(); ctx.ellipse(d[0], d[1], 5, 8, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#cc4400'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(d[0], d[1]-3, 5, 1.5, 0, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(d[0], d[1]+3, 5, 1.5, 0, 0, Math.PI*2); ctx.stroke();
  });

  // ── Sandbag wall — bottom of camp ────────────────────────────────────────
  var bagY = oy + campH - 7;
  for (var bi = 0; bi < 13; bi++) {
    ctx.fillStyle = bi % 2 === 0 ? '#7a6a30' : '#6a5a25';
    ctx.beginPath(); ctx.ellipse(ox + bi * 16 + 8, bagY, 8, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#3a2e10'; ctx.lineWidth = 0.5; ctx.stroke();
  }

  // ── "★ AMERICAN FREEDOM CAMP ★" badge — top strip ────────────────────────
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.beginPath(); ctx.roundRect(ox + 2, oy + 3, campW - 4, 20, 4); ctx.fill();
  ctx.strokeStyle = '#B22234'; ctx.lineWidth = 1;
  ctx.strokeRect(ox + 2, oy + 3, campW - 4, 20);
  ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#B22234'; ctx.fillText('\u2605', ox + 11, oy + 13);
  ctx.fillStyle = '#ffffff';  ctx.fillText('AMERICAN FREEDOM CAMP', ox + campW / 2, oy + 13);
  ctx.fillStyle = '#B22234'; ctx.fillText('\u2605', ox + campW - 11, oy + 13);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Brent's vault — bottom-right corner (rows 14-15, cols 18-23)
// Mirrors the army camp style at the opposite end of the path
// ---------------------------------------------------------------------------
function drawBrentVault() {
  // Vault spans the bottom-right: 5 cells wide, 4 cells tall
  var vW  = CELL * 5;       // 200 px wide
  var vH  = CELL * 4;       // 160 px tall — much more room for portrait
  var ox  = W - vW;
  var oy  = H - vH;

  ctx.save();

  // ── Gold-tinted ground pad ────────────────────────────────────────────────
  ctx.fillStyle = '#1a1608';
  ctx.fillRect(ox, oy, vW, vH);

  // Shimmer stripes
  ctx.save();
  ctx.globalAlpha = 0.09;
  for (var si = 0; si < 8; si++) {
    ctx.fillStyle = si % 2 === 0 ? '#c8a030' : '#a07820';
    ctx.fillRect(ox + si * 26, oy, 13, vH);
  }
  ctx.restore();

  // Gold dashed border
  ctx.strokeStyle = '#b89020';
  ctx.lineWidth   = 1.5;
  ctx.setLineDash([6, 3]);
  ctx.strokeRect(ox + 1, oy + 1, vW - 2, vH - 2);
  ctx.setLineDash([]);

  // ── Brent portrait — large, left-aligned ─────────────────────────────────
  var brentSpr = ASSETS['brent'];
  // Portrait fills most of the vault height, maintains roughly 4:3 source ratio
  var pH = vH - 28;           // leave room for badge at bottom
  var pW = Math.round(pH * (4 / 3));
  if (pW > vW - 4) pW = vW - 4; // clamp to vault width
  var pX = ox + Math.round((vW - pW) / 2);
  var pY = oy + 4;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (brentSpr) {
    // Outer gold glow
    ctx.shadowColor = '#FAC775';
    ctx.shadowBlur  = 24;
    ctx.drawImage(brentSpr, pX, pY, pW, pH);
    ctx.shadowBlur  = 0;
    // Thin gold frame around portrait
    ctx.strokeStyle = '#c8a030';
    ctx.lineWidth   = 2;
    ctx.strokeRect(pX, pY, pW, pH);
  }

  // ── "₿ PROTECT BRENT ₿" badge ────────────────────────────────────────────
  var badgeY = oy + vH - 22;
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.beginPath(); ctx.roundRect(ox + 4, badgeY, vW - 8, 18, 5); ctx.fill();
  ctx.strokeStyle = '#c8a030'; ctx.lineWidth = 1;
  ctx.strokeRect(ox + 4, badgeY, vW - 8, 18);
  ctx.fillStyle    = '#FAC775';
  ctx.font         = 'bold 11px sans-serif';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\u20BF  PROTECT BRENT  \u20BF', ox + vW / 2, badgeY + 9);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Main map drawing
// ---------------------------------------------------------------------------
function drawMap() {
  // ── Base fill ──────────────────────────────────────────────────────────────
  ctx.fillStyle = '#1a3310';
  ctx.fillRect(0, 0, W, H);

  // ── Tiles ──────────────────────────────────────────────────────────────────
  for (var row = 0; row < ROWS; row++) {
    for (var col = 0; col < COLS; col++) {
      var x = col * CELL;
      var y = row * CELL;
      var h = tileHash(col, row);

      if (isPath(col, row)) {
        // Original brown path with slight variation
        ctx.fillStyle = h < 40 ? '#7a6040' : h < 75 ? '#746040' : '#7e6444';
        ctx.fillRect(x, y, CELL, CELL);
        // Tyre-track grooves on straight runs
        if (h % 5 === 0) {
          ctx.strokeStyle = 'rgba(0,0,0,0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x + 9, y); ctx.lineTo(x + 9, y + CELL); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + CELL - 9, y); ctx.lineTo(x + CELL - 9, y + CELL); ctx.stroke();
        }
        // Occasional mud/oil smear on road
        if (h > 88) {
          ctx.fillStyle = 'rgba(5,4,2,0.5)';
          ctx.beginPath();
          ctx.ellipse(x + CELL * 0.5, y + CELL * 0.5, CELL * 0.32, CELL * 0.22, h * 0.05, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = '#5a4520'; ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, CELL, CELL);

      } else {
        // ── Green grass (original look) ──────────────────────────────────────
        ctx.fillStyle = (col + row) % 2 === 0 ? '#234416' : '#1e3d13';
        ctx.fillRect(x, y, CELL, CELL);

        // Oil puddle on ~18% of grass tiles — seeps up through the ground
        if (h >= 12 && h <= 29) {
          ctx.fillStyle = 'rgba(4,4,2,0.72)';
          ctx.beginPath();
          ctx.ellipse(
            x + CELL * 0.5 + (h % 7 - 3) * 2,
            y + CELL * 0.5 + (h % 5 - 2) * 2,
            CELL * 0.32, CELL * 0.2,
            h * 0.07, 0, Math.PI * 2
          );
          ctx.fill();
          // Iridescent sheen (rainbow oil slick)
          ctx.fillStyle = 'rgba(30,90,60,0.25)';
          ctx.beginPath();
          ctx.ellipse(
            x + CELL * 0.45 + (h % 3) * 2,
            y + CELL * 0.44,
            CELL * 0.1, CELL * 0.06,
            h * 0.12, 0, Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }

  // ── Decorative trees ───────────────────────────────────────────────────────
  var treeSpr = ASSETS['decor_tree'];
  for (var i = 0; i < TREES.length; i++) {
    var ttx = TREES[i][0] * CELL + CELL / 2;
    var tty = TREES[i][1] * CELL + CELL / 2;
    var tr  = CELL / 2 - 3;

    if (treeSpr) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      var th = tr;
      ctx.globalAlpha = 0.3;
      ctx.drawImage(treeSpr, ttx - th + 3, tty - th + 4, th * 2, th * 2);
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(ttx, tty, th, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(treeSpr, ttx - th, tty - th, th * 2, th * 2);
      ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(ttx + 2, tty + 2, tr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
      ctx.beginPath(); ctx.arc(ttx, tty, tr, 0, Math.PI * 2);
      ctx.fillStyle = '#1a5c10'; ctx.fill();
      ctx.beginPath(); ctx.arc(ttx - 1, tty - 1, tr * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = '#267318'; ctx.fill();
      ctx.beginPath(); ctx.arc(ttx, tty, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#5a3a10'; ctx.fill();
    }
  }

  // ── Very faint grid (just enough to read tile positions) ──────────────────
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth   = 0.5;
  for (var gr = 0; gr <= ROWS; gr++) {
    ctx.beginPath(); ctx.moveTo(0, gr * CELL); ctx.lineTo(W, gr * CELL); ctx.stroke();
  }
  for (var gc3 = 0; gc3 <= COLS; gc3++) {
    ctx.beginPath(); ctx.moveTo(gc3 * CELL, 0); ctx.lineTo(gc3 * CELL, H); ctx.stroke();
  }

  // ── Edge vignette — darkens canvas corners for depth ─────────────────────
  var vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // ── Army camp at start ─────────────────────────────────────────────────────
  drawArmyCamp();

  // ── Brent's vault — bottom-right corner, mirrors army camp style ────────────
  drawBrentVault();
}

function drawOverlay() {
  if (!gameOver && !victory) return;

  ctx.fillStyle = 'rgba(0,0,0,.78)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  var bx = W / 2 - 240, by = H / 2 - 75, bw = 480, bh = 150;

  if (gameOver) {
    ctx.fillStyle = '#6a1010';
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 12); ctx.fill();
    ctx.strokeStyle = '#A32D2D'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 32px sans-serif';
    ctx.fillText('GAME OVER', W / 2, H / 2 - 24);
    ctx.font = '16px sans-serif'; ctx.fillStyle = '#F0997B';
    ctx.fillText("The US Army seized Brent's BTC!", W / 2, H / 2 + 12);
    ctx.font = '13px sans-serif'; ctx.fillStyle = '#aaa';
    ctx.fillText('Score: ' + score + ' | Wave: ' + wave + '/10 | Refresh to retry', W / 2, H / 2 + 42);
  } else {
    ctx.fillStyle = '#0a3a25';
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 12); ctx.fill();
    ctx.strokeStyle = '#5DCAA5'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 32px sans-serif';
    ctx.fillText('BRENT WINS! \u20BF', W / 2, H / 2 - 24);
    ctx.font = '16px sans-serif'; ctx.fillStyle = '#9FE1CB';
    ctx.fillText('All 10 waves defeated! Crypto secured!', W / 2, H / 2 + 12);
    ctx.font = '13px sans-serif'; ctx.fillStyle = '#aaa';
    ctx.fillText('Final Score: ' + score + ' | Refresh to play again', W / 2, H / 2 + 42);
  }
}
