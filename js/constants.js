// Canvas dimensions and grid settings
const W = 960;
const H = 640;
const CELL = 40;
const COLS = Math.floor(W / CELL); // 24
const ROWS = Math.floor(H / CELL); // 16
const MAX_WAVES = 10;

// Tower definitions
const TDEFS = {
  laser: {
    name: 'Laser Bot',
    color: '#378ADD',
    range: 3.5,
    dmg: 15,
    rate: 38,
    cost: 50,
    splash: 0,
    slow: 0,
    slowDur: 0,
    icon: '\u26A1',
    desc: 'Fast, reliable single target',
  },
  rocket: {
    name: 'Rocket Turret',
    color: '#D85A30',
    range: 4.5,
    dmg: 42,
    rate: 82,
    cost: 80,
    splash: 1.3,
    slow: 0,
    slowDur: 0,
    icon: '\uD83D\uDE80',
    desc: 'Splash damage, great vs groups',
  },
  emp: {
    name: 'EMP Tower',
    color: '#5DCAA5',
    range: 5,
    dmg: 10,
    rate: 105,
    cost: 120,
    splash: 0,
    slow: 0.45,
    slowDur: 100,
    icon: '\uD83C\uDF00',
    desc: 'Slows enemies significantly',
  },
  meme: {
    name: 'Meme Cannon',
    color: '#D4537E',
    range: 3.2,
    dmg: 28,
    rate: 52,
    cost: 60,
    splash: 0,
    slow: 0,
    slowDur: 0,
    icon: '\uD83D\uDC80',
    desc: 'Mid-range solid DPS',
  },
  nuke: {
    name: 'Nuke Tower',
    color: '#FAC775',
    range: 6,
    dmg: 90,
    rate: 175,
    cost: 200,
    splash: 2.1,
    slow: 0,
    slowDur: 0,
    icon: '\u2622\uFE0F',
    desc: 'Massive AoE but slow fire rate',
  },
};

// Enemy type definitions
const ETYPES = [
  { name: 'Soldier', hp: 100, spd: 1.0,  reward: 12, color: '#3B6D11', size: 9,  icon: '\uD83E\uDD96' },
  { name: 'Jeep',    hp: 220, spd: 1.35, reward: 18, color: '#BA7517', size: 11, icon: '\uD83D\uDE99' },
  { name: 'Tank',    hp: 480, spd: 0.48, reward: 30, color: '#555',    size: 14, icon: '\uD83D\uDEE1' },
  { name: 'Drone',   hp: 75,  spd: 2.3,  reward: 15, color: '#185FA5', size: 7,  icon: '\u2708' },
  { name: 'Chopper', hp: 340, spd: 1.55, reward: 28, color: '#533F9B', size: 12, icon: '\uD83D\uDE81' },
];

// Boss definitions
const BOSSES = [
  {
    name: 'Colonel Crypto-Crusher',
    hp: 1500, spd: 0.72, reward: 180,
    color: '#A32D2D', size: 21, icon: '\u2605',
    ability: 'shield', abilityCD: 280, shieldHP: 350,
  },
  {
    name: 'General Blockchain-Buster',
    hp: 3000, spd: 0.56, reward: 320,
    color: '#791F1F', size: 25, icon: '\u2606',
    ability: 'summon', abilityCD: 190, shieldHP: 0,
  },
  {
    name: 'Supreme Commander Satoshi-Stopper',
    hp: 5000, spd: 0.46, reward: 700,
    color: '#4a0a0a', size: 29, icon: '\u2726',
    ability: 'rage', abilityCD: 160, shieldHP: 0,
  },
];
