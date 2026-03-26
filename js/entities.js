// Depends on: constants.js, path.js, state.js, audio.js

// ---------------------------------------------------------------------------
// Procedural sprite drawing helpers
// ---------------------------------------------------------------------------

var TOWER_ART = {
  laser: function (x, y) {
    var s = CELL / 2 - 2;
    // Dark base disc
    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fillStyle = '#0d1e30'; ctx.fill();
    ctx.strokeStyle = '#378ADD'; ctx.lineWidth = 2.5; ctx.stroke();
    // Glowing barrel
    ctx.shadowColor = '#378ADD'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#378ADD';
    ctx.beginPath(); ctx.roundRect(x - 4, y - s + 2, 8, s + 2, 3); ctx.fill();
    ctx.shadowBlur = 0;
    // Barrel tip glow ring
    ctx.beginPath(); ctx.arc(x, y - s + 4, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#A8DCFF'; ctx.fill();
    // Mount ring
    ctx.beginPath(); ctx.arc(x, y + 5, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#1a3a5a'; ctx.fill();
    ctx.strokeStyle = '#378ADD'; ctx.lineWidth = 1.5; ctx.stroke();
  },

  rocket: function (x, y) {
    var s = CELL / 2 - 2;
    var bx = x - s + 1, by = y - s + 1, bw = (s - 1) * 2, bh = (s - 1) * 2;
    // Metal base
    ctx.fillStyle = '#1e1e1e';
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill();
    ctx.strokeStyle = '#D85A30'; ctx.lineWidth = 2; ctx.stroke();
    // Hazard corners
    ctx.fillStyle = '#FAC775';
    [[bx,by,1,1],[bx+bw,by,-1,1],[bx,by+bh,1,-1],[bx+bw,by+bh,-1,-1]].forEach(function(t) {
      ctx.beginPath(); ctx.moveTo(t[0],t[1]); ctx.lineTo(t[0]+t[2]*9,t[1]); ctx.lineTo(t[0],t[1]+t[3]*9); ctx.closePath(); ctx.fill();
    });
    // Rocket pod
    ctx.fillStyle = '#D85A30';
    ctx.beginPath(); ctx.roundRect(x - 9, y - 12, 18, 22, 5); ctx.fill();
    ctx.strokeStyle = '#FF7050'; ctx.lineWidth = 1.5; ctx.stroke();
    // Twin rocket tips
    [[x-4,y-14],[x+4,y-14]].forEach(function(p) {
      ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FF3030'; ctx.fill();
    });
  },

  emp: function (x, y) {
    var s = CELL / 2 - 2;
    // Base disc
    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fillStyle = '#071f18'; ctx.fill();
    ctx.strokeStyle = '#5DCAA5'; ctx.lineWidth = 2.5; ctx.stroke();
    // 4 antenna arms
    var len = s - 3;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(function (d) {
      ctx.strokeStyle = '#5DCAA5'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d[0]*len, y + d[1]*len); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + d[0]*len, y + d[1]*len, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#9FEACC'; ctx.fill();
    });
    // Electric arcs
    ctx.strokeStyle = '#9FEACC'; ctx.lineWidth = 1; ctx.globalAlpha = 0.7;
    for (var i = 0; i < 4; i++) {
      var a = (i / 4) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(x, y, len * 0.55, a, a + 0.55); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Core
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#5DCAA5'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#E0FFF5'; ctx.fill();
  },

  meme: function (x, y) {
    var s = CELL / 2 - 2;
    // Dark chaotic base
    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fillStyle = '#180a14'; ctx.fill();
    ctx.strokeStyle = '#D4537E'; ctx.lineWidth = 2.5; ctx.stroke();
    // Skull head
    ctx.beginPath(); ctx.arc(x, y - 4, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#D4537E'; ctx.fill();
    // Skull jaw
    ctx.beginPath(); ctx.arc(x, y + 4, 8, 0, Math.PI);
    ctx.fillStyle = '#D4537E'; ctx.fill();
    // Eye sockets
    [[x-4,y-6],[x+4,y-6]].forEach(function(p) {
      ctx.beginPath(); ctx.arc(p[0],p[1],3,0,Math.PI*2);
      ctx.fillStyle = '#180a14'; ctx.fill();
      ctx.beginPath(); ctx.arc(p[0],p[1],1.5,0,Math.PI*2);
      ctx.fillStyle = '#FF44AA'; ctx.fill(); // glowing pupils
    });
    // Teeth
    ctx.fillStyle = '#180a14';
    for (var t = -1; t <= 1; t++) { ctx.fillRect(x + t * 5 - 1.5, y + 2, 3, 5); }
  },

  nuke: function (x, y) {
    var s = CELL / 2 - 2;
    // Octagonal bunker
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2 - Math.PI / 8;
      i === 0 ? ctx.moveTo(x + Math.cos(a)*s, y + Math.sin(a)*s) : ctx.lineTo(x + Math.cos(a)*s, y + Math.sin(a)*s);
    }
    ctx.closePath(); ctx.fillStyle = '#1c1a0c'; ctx.fill();
    ctx.strokeStyle = '#FAC775'; ctx.lineWidth = 2.5; ctx.stroke();
    // Radioactive fans
    ctx.save(); ctx.translate(x, y);
    for (var i = 0; i < 3; i++) {
      ctx.rotate(Math.PI * 2 / 3);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 11, -0.52, 0.52); ctx.closePath();
      ctx.fillStyle = '#FAC775'; ctx.fill();
    }
    ctx.restore();
    // Clear center hole + dot
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1a0c'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FAC775'; ctx.fill();
    // Green glow ring
    ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.strokeStyle = '#7FFF00'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5; ctx.stroke();
    ctx.globalAlpha = 1;
  },
};

var ENEMY_ART = {
  soldier: function (x, y, sz) {
    ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fillStyle = '#3B6D11'; ctx.fill();
    ctx.strokeStyle = '#2a5008'; ctx.lineWidth = 1.5; ctx.stroke();
    // Helmet
    ctx.beginPath(); ctx.arc(x, y - sz * 0.2, sz * 0.7, Math.PI, 0);
    ctx.fillStyle = '#1e3a06'; ctx.fill();
    // Eyes
    [[x - sz*0.3, y + sz*0.1],[x + sz*0.3, y + sz*0.1]].forEach(function(p) {
      ctx.beginPath(); ctx.arc(p[0], p[1], sz * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#eee'; ctx.fill();
    });
  },

  jeep: function (x, y, sz) {
    var w = sz * 1.9, h = sz * 2.4;
    ctx.fillStyle = '#8B7340';
    ctx.beginPath(); ctx.roundRect(x - w/2, y - h/2, w, h, 4); ctx.fill();
    ctx.strokeStyle = '#5a4820'; ctx.lineWidth = 1.5; ctx.stroke();
    // Windshield
    ctx.fillStyle = '#3a5a7a';
    ctx.fillRect(x - w/2 + 3, y - h/2 + 3, w - 6, h * 0.28);
    // Spare tyre
    ctx.beginPath(); ctx.arc(x, y + h/2 - 4, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#333'; ctx.fill();
    // Wheels
    ctx.fillStyle = '#222';
    [[-w/2+2,-h/2+3],[w/2-2,-h/2+3],[-w/2+2,h/2-3],[w/2-2,h/2-3]].forEach(function(d) {
      ctx.beginPath(); ctx.arc(x+d[0], y+d[1], 3.5, 0, Math.PI*2); ctx.fill();
    });
  },

  tank: function (x, y, sz) {
    var w = sz * 1.8, h = sz * 2.4;
    // Hull
    ctx.fillStyle = '#484848';
    ctx.fillRect(x - w/2, y - h/2, w, h);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.strokeRect(x - w/2, y - h/2, w, h);
    // Track marks
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    for (var ty = -h/2; ty < h/2; ty += 5) {
      ctx.beginPath(); ctx.moveTo(x - w/2, y+ty); ctx.lineTo(x - w/2 + 5, y+ty); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + w/2, y+ty); ctx.lineTo(x + w/2 - 5, y+ty); ctx.stroke();
    }
    // Turret
    ctx.beginPath(); ctx.arc(x, y, sz * 0.62, 0, Math.PI * 2);
    ctx.fillStyle = '#5a5a5a'; ctx.fill();
    ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.stroke();
    // Barrel (pointing "up" toward start of path)
    ctx.strokeStyle = '#4a4a4a'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - sz * 1.25); ctx.stroke();
  },

  drone: function (x, y, sz) {
    var armLen = sz * 1.1;
    // Arms
    [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(function(d) {
      ctx.strokeStyle = '#185FA5'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d[0]*armLen, y + d[1]*armLen); ctx.stroke();
      // Rotor disc
      ctx.beginPath(); ctx.arc(x + d[0]*armLen, y + d[1]*armLen, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#185FA5'; ctx.fill();
      ctx.strokeStyle = '#4a9acc'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x + d[0]*armLen, y + d[1]*armLen, 6, 0, Math.PI * 1.3); ctx.stroke();
    });
    // Center body
    ctx.beginPath(); ctx.arc(x, y, sz * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#185FA5'; ctx.fill();
    // Camera lens
    ctx.beginPath(); ctx.arc(x, y, sz * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = '#0a2a50'; ctx.fill();
    ctx.beginPath(); ctx.arc(x - 1, y - 1, sz * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = '#6ab4dd'; ctx.fill();
  },

  chopper: function (x, y, sz) {
    // Fuselage
    ctx.beginPath(); ctx.ellipse(x, y, sz * 0.6, sz * 1.1, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#533F9B'; ctx.fill();
    ctx.strokeStyle = '#7560CC'; ctx.lineWidth = 1.5; ctx.stroke();
    // Rotor blades
    ctx.strokeStyle = '#7560CC'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - sz*1.4, y); ctx.lineTo(x + sz*1.4, y); ctx.stroke();
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.45);
    ctx.beginPath(); ctx.moveTo(-sz*1.4, 0); ctx.lineTo(sz*1.4, 0); ctx.stroke();
    ctx.restore();
    // Cockpit
    ctx.beginPath(); ctx.ellipse(x, y - sz*0.15, sz*0.28, sz*0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#9980FF'; ctx.fill();
    // Tail rotor
    ctx.strokeStyle = '#7560CC'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 4, y + sz*1.1); ctx.lineTo(x + 4, y + sz*1.1); ctx.stroke();
  },
};

// Bosses drawn inline in Enemy.prototype.draw (they use the enemy color + extra details)

// ---------------------------------------------------------------------------
// FloatText — damage / reward numbers that drift upward and fade out
// ---------------------------------------------------------------------------
function FloatText(x, y, text, color) {
  this.x    = x;
  this.y    = y;
  this.t    = text;
  this.c    = color || '#FAC775';
  this.life = 65;
  this.vy   = -1.1;
}

FloatText.prototype.update = function () {
  this.y += this.vy;
  this.life--;
};

FloatText.prototype.draw = function () {
  ctx.save();
  ctx.globalAlpha = Math.min(1, this.life / 20);
  ctx.fillStyle   = this.c;
  ctx.font        = 'bold 13px sans-serif';
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(this.t, this.x, this.y);
  ctx.restore();
};

// ---------------------------------------------------------------------------
// Particle — burst of colored dots for explosions / deaths
// ---------------------------------------------------------------------------
function Particle(x, y, color, big) {
  this.x    = x;
  this.y    = y;
  this.c    = color;
  this.life = big ? 38 : 22;
  this.ml   = this.life;
  this.vx   = (Math.random() - 0.5) * (big ? 5.5 : 3.5);
  this.vy   = (Math.random() - 0.5) * (big ? 5.5 : 3.5);
  this.r    = big ? 4.5 : 2.5;
}

Particle.prototype.update = function () {
  this.x  += this.vx;
  this.y  += this.vy;
  this.vx *= 0.9;
  this.vy *= 0.9;
  this.life--;
};

Particle.prototype.draw = function () {
  ctx.save();
  ctx.globalAlpha = this.life / this.ml;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
  ctx.fillStyle = this.c;
  ctx.fill();
  ctx.restore();
};

// ---------------------------------------------------------------------------
// Enemy
// ---------------------------------------------------------------------------
function Enemy(typeIdx, isBoss, bossIdx) {
  this.isBoss  = !!isBoss;
  this.bossIdx = bossIdx || 0;

  if (this.isBoss) {
    var b = BOSSES[bossIdx];
    this.name        = b.name;
    this.maxHp       = b.hp + wave * 250;
    this.hp          = this.maxHp;
    this.spd         = b.spd;
    this.baseSpd     = b.spd;
    this.reward      = b.reward;
    this.color       = b.color;
    this.size        = b.size;
    this.icon        = b.icon;
    this.ability     = b.ability;
    this.abilityTimer = 0;
    this.abilityCD   = b.abilityCD;
    this.shielded    = false;
    this.shieldMaxHP = b.shieldHP || 0;
    this.shieldHP    = 0;
    this.enraged     = false;
  } else {
    var t = ETYPES[typeIdx];
    this.name    = t.name;
    this.maxHp   = t.hp + wave * 18;
    this.hp      = this.maxHp;
    this.spd     = t.spd;
    this.baseSpd = t.spd;
    this.reward  = t.reward;
    this.color   = t.color;
    this.size    = t.size;
    this.icon    = t.icon;
  }

  this.pathIdx   = 0;
  this.dead      = false;
  this.reached   = false;
  this.slowTimer = 0;
  var start = gpx(0);
  this.x = start.x;
  this.y = start.y;
}

// How far along the path this enemy has traveled (used for targeting priority)
Object.defineProperty(Enemy.prototype, 'progress', {
  get: function () {
    if (this.pathIdx >= GPATH.length - 1) return GPATH.length;
    var nxt = gpx(this.pathIdx + 1);
    return this.pathIdx + (1 - Math.hypot(nxt.x - this.x, nxt.y - this.y) / CELL);
  },
});

Enemy.prototype.update = function () {
  if (this.slowTimer > 0) {
    this.spd = this.baseSpd * 0.42;
    this.slowTimer--;
  } else {
    this.spd = this.baseSpd;
  }

  if (this.isBoss) {
    this.abilityTimer++;
    if (this.abilityTimer >= this.abilityCD) {
      this.abilityTimer = 0;

      if (this.ability === 'shield' && !this.shielded && this.hp < this.maxHp * 0.55) {
        this.shielded = true;
        this.shieldHP = this.shieldMaxHP;
        floats.push(new FloatText(this.x, this.y - 35, '\uD83D\uDEE1 SHIELD ACTIVATED!', '#9FE1CB'));
        sfxBoss();
      }

      if (this.ability === 'summon') {
        for (var i = 0; i < 4; i++) {
          spawnQueue.unshift({ typeIdx: Math.floor(Math.random() * 3), delay: i * 25, isBoss: false });
        }
        floats.push(new FloatText(this.x, this.y - 35, '\uD83D\uDCFB CALLING BACKUP!', '#FAC775'));
        sfxBoss();
      }

      if (this.ability === 'rage' && !this.enraged && this.hp < this.maxHp * 0.38) {
        this.enraged  = true;
        this.baseSpd *= 2.1;
        floats.push(new FloatText(this.x, this.y - 35, '\uD83D\uDCA2 ENRAGED! 2x SPEED!', '#F0997B'));
        sfxBoss();
      }
    }
  }

  if (this.pathIdx >= GPATH.length - 1) { this.reached = true; return; }

  var tgt  = gpx(this.pathIdx + 1);
  var dx   = tgt.x - this.x;
  var dy   = tgt.y - this.y;
  var dist = Math.hypot(dx, dy);
  if (dist < this.spd * 2 + 2) {
    this.pathIdx++;
  } else {
    this.x += (dx / dist) * this.spd * 2;
    this.y += (dy / dist) * this.spd * 2;
  }
};

Enemy.prototype.takeDmg = function (dmg) {
  if (this.shielded) {
    this.shieldHP -= dmg;
    if (this.shieldHP <= 0) {
      this.shielded = false;
      floats.push(new FloatText(this.x, this.y - 22, 'SHIELD BROKEN!', '#F0997B'));
    }
    return;
  }

  this.hp -= dmg;
  if (this.hp <= 0) {
    this.dead = true;
    gold  += this.reward;
    score += this.reward * (wave + 1);
    floats.push(new FloatText(this.x, this.y - 18, '+' + this.reward + '\u20BF', '#FAC775'));
    for (var i = 0; i < (this.isBoss ? 18 : 5); i++) {
      particles.push(new Particle(this.x, this.y, this.color, this.isBoss));
    }
    sfxDie();
    updateHUD();
  } else {
    sfxHit();
  }
};

Enemy.prototype.draw = function () {
  var x = this.x, y = this.y, sz = this.size;

  // ── Outer glow / shield (no clip active here) ──────────────────────────────
  if (this.isBoss) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, sz + 10, 0, Math.PI * 2);
    ctx.fillStyle = this.color + '44'; ctx.fill();
    if (this.enraged) {
      ctx.beginPath(); ctx.arc(x, y, sz + 15, 0, Math.PI * 2);
      ctx.strokeStyle = '#F0997B'; ctx.lineWidth = 3; ctx.stroke();
    }
    ctx.restore();
  }
  if (this.shielded) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, sz + 5, 0, Math.PI * 2);
    ctx.fillStyle = '#5DCAA522'; ctx.fill();
    ctx.strokeStyle = '#5DCAA5'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.restore();
  }

  // ── Body (clipped to circle) ───────────────────────────────────────────────
  var imgKey = this.isBoss ? 'boss_' + this.bossIdx : 'enemy_' + this.name.toLowerCase();
  var spr    = ASSETS[imgKey];

  ctx.save();
  if (spr) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Draw size, then clip = draw-half so ONLY the 4 corners are hidden,
    // the full sprite content stays visible
    var drawHalf = this.isBoss ? sz * 1.6 : sz * 2;
    var clipR    = drawHalf; // circle inscribed in the draw square → corners only
    ctx.beginPath(); ctx.arc(x, y, clipR, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(spr, x - drawHalf, y - drawHalf, drawHalf * 2, drawHalf * 2);
  } else {
    // Canvas art fallback
    if (this.isBoss) {
      ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2);
      ctx.fillStyle = this.color; ctx.fill();
      ctx.strokeStyle = '#fff3'; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = 'bold ' + Math.round(sz * 0.85) + 'px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FAC775';
      ctx.fillText(['\u2605', '\u2605\u2605', '\u2620\uFE0F'][this.bossIdx] || '\u2605', x, y);
    } else {
      var artFn = ENEMY_ART[this.name.toLowerCase()];
      if (artFn) artFn(x, y, sz);
      else {
        ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.fill();
      }
    }
  }
  ctx.restore(); // remove clip before drawing health bar

  // ── Health bar (no clip) ───────────────────────────────────────────────────
  var visR = spr ? (this.isBoss ? sz * 1.6 : sz * 2) : sz;
  var bw = visR * 2.4, bh = this.isBoss ? 7 : 4;
  var bx = x - bw / 2, by = y - visR - 10;
  ctx.fillStyle = '#300'; ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = this.hp / this.maxHp > 0.5 ? '#4a8a1a' : '#D85A30';
  ctx.fillRect(bx, by, bw * Math.max(0, this.hp / this.maxHp), bh);
  if (this.shielded && this.shieldMaxHP > 0) {
    ctx.fillStyle = '#5DCAA588';
    ctx.fillRect(bx, by, bw * (this.shieldHP / this.shieldMaxHP), bh);
  }
  if (this.isBoss) {
    ctx.fillStyle = '#ddd'; ctx.font = '9px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(this.name.split(' ').slice(0, 2).join(' '), x, by - 2);
  }
};

// ---------------------------------------------------------------------------
// Tower
// ---------------------------------------------------------------------------
function Tower(col, row, type) {
  var d = TDEFS[type];
  this.col     = col;
  this.row     = row;
  this.type    = type;
  this.name    = d.name;
  this.x       = col * CELL + CELL / 2;
  this.y       = row * CELL + CELL / 2;
  this.range   = d.range * CELL;
  this.dmg     = d.dmg;
  this.rate    = d.rate;
  this.color   = d.color;
  this.cost    = d.cost;
  this.splash  = d.splash  || 0;
  this.slow    = d.slow    || 0;
  this.slowDur = d.slowDur || 0;
  this.timer   = 0;
  this.level   = 1;
  this.icon    = d.icon;
}

Object.defineProperty(Tower.prototype, 'upgCost', {
  get: function () { return this.cost * this.level * 2; },
});

Object.defineProperty(Tower.prototype, 'sellVal', {
  get: function () { return Math.floor(this.cost * 0.6 + this.cost * 0.3 * (this.level - 1)); },
});

Tower.prototype.update = function () {
  if (this.timer > 0) { this.timer--; return; }

  var best  = null;
  var bestP = -1;
  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    if (e.dead || e.reached) continue;
    if (Math.hypot(e.x - this.x, e.y - this.y) <= this.range && e.progress > bestP) {
      bestP = e.progress;
      best  = e;
    }
  }
  if (!best) return;

  this.timer = Math.max(1, this.rate - this.level * 9);
  bullets.push(new Bullet(this, best));

  if      (this.type === 'laser')  sfxShoot();
  else if (this.type === 'rocket') sfxRocket();
  else if (this.type === 'nuke')   sfxNuke();
  else if (this.type === 'emp')    sfxEmp();
  else if (this.type === 'meme')   sfxMeme();
  else                             sfxShoot();
};

Tower.prototype.draw = function () {
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  var spr  = ASSETS['tower_' + this.type];
  var half = Math.round(CELL * 0.72); // sprite draw half-size (no clipping applied)
  // Ring radius capped at CELL/2-2 so it never overflows the tile boundary
  var ringR = CELL / 2 - 2;

  if (spr) {
    // ── Circle ring — fits inside the tile ───────────────────────────────────
    ctx.beginPath();
    ctx.arc(this.x, this.y, ringR, 0, Math.PI * 2);
    ctx.fillStyle   = this.color + '33';
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.lineWidth   = 2;
    ctx.stroke();

    // ── Sprite drawn at full size, no clipping ───────────────────────────────
    ctx.drawImage(spr, this.x - half, this.y - half, half * 2, half * 2);
  } else {
    var artFn = TOWER_ART[this.type];
    if (artFn) artFn(this.x, this.y);
  }

  ctx.restore(); // restore before drawing stars (stars must be outside clip)

  // ── Level stars ────────────────────────────────────────────────────────────
  if (this.level > 1) {
    ctx.save();
    ctx.fillStyle    = '#FAC775';
    ctx.font         = 'bold 10px sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('\u2605'.repeat(this.level - 1), this.x, this.y + CELL / 2 - 1);
    ctx.restore();
  }
};

Tower.prototype.drawRange = function () {
  ctx.save();
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
  ctx.strokeStyle = this.color + '66';
  ctx.lineWidth   = 1.2;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.restore();
};

// ---------------------------------------------------------------------------
// Bullet
// ---------------------------------------------------------------------------
function Bullet(tower, target) {
  this.x       = tower.x;
  this.y       = tower.y;
  this.target  = target;
  this.dmg     = tower.dmg * (1 + 0.38 * (tower.level - 1));
  this.splash  = tower.splash;
  this.slow    = tower.slow;
  this.slowDur = tower.slowDur;
  this.color   = tower.color;
  this.spd     = 9;
  this.done    = false;
  this.sz      = tower.type === 'nuke' ? 8 : tower.type === 'rocket' ? 5 : 3;
}

Bullet.prototype.update = function () {
  if (this.target.dead) { this.done = true; return; }
  var dx   = this.target.x - this.x;
  var dy   = this.target.y - this.y;
  var dist = Math.hypot(dx, dy);
  if (dist < this.spd + this.sz) {
    this.hit();
    this.done = true;
  } else {
    this.x += (dx / dist) * this.spd;
    this.y += (dy / dist) * this.spd;
  }
};

Bullet.prototype.hit = function () {
  var self = this;
  var tgts = this.splash > 0
    ? enemies.filter(function (e) {
        return !e.dead && !e.reached &&
               Math.hypot(e.x - self.target.x, e.y - self.target.y) < self.splash * CELL;
      })
    : [this.target];

  if (this.splash > 0) {
    for (var i = 0; i < 10; i++) {
      particles.push(new Particle(this.target.x, this.target.y, this.color, true));
    }
  }

  for (var i = 0; i < tgts.length; i++) {
    tgts[i].takeDmg(this.dmg);
    if (this.slow) tgts[i].slowTimer = this.slowDur;
  }
};

Bullet.prototype.draw = function () {
  ctx.save();
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.restore();
};
