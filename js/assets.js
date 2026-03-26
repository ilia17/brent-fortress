// Loads all sprite PNGs and stores them ready for ctx.drawImage().
// Images are expected to have proper transparency already (no white-bg removal needed).
// Exposes: ASSETS (keyed HTMLImageElements), loadAssets(callback)

const ASSETS = {};

const ASSET_LIST = [
  { key: 'tower_laser',   src: 'assets/towers/laser.png' },
  { key: 'tower_rocket',  src: 'assets/towers/rocket.png' },
  { key: 'tower_emp',     src: 'assets/towers/emp.png' },
  { key: 'tower_meme',    src: 'assets/towers/meme.png' },
  { key: 'tower_nuke',    src: 'assets/towers/nuke.png' },
  { key: 'enemy_soldier', src: 'assets/enemies/soldier.png' },
  { key: 'enemy_jeep',    src: 'assets/enemies/jeep.png' },
  { key: 'enemy_tank',    src: 'assets/enemies/tank.png' },
  { key: 'enemy_drone',   src: 'assets/enemies/drone.png' },
  { key: 'enemy_chopper', src: 'assets/enemies/chopper.png' },
  { key: 'boss_0',        src: 'assets/bosses/boss1.png' },
  { key: 'boss_1',        src: 'assets/bosses/boss2.png' },
  { key: 'boss_2',        src: 'assets/bosses/boss3.png' },
  { key: 'decor_tree',    src: 'assets/tiles/tree.png' },
  { key: 'brent',         src: 'assets/brent.png' },
];

function loadAssets(callback) {
  var remaining = ASSET_LIST.length;

  ASSET_LIST.forEach(function (entry) {
    var img = new Image();

    img.onload = function () {
      ASSETS[entry.key] = img; // use directly — images already have transparency
      if (--remaining === 0) callback();
    };

    img.onerror = function () {
      // Missing file — drawing code falls back to canvas art
      if (--remaining === 0) callback();
    };

    img.src = entry.src;
  });
}
