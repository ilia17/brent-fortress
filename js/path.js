// Depends on: constants.js (CELL, COLS, ROWS)

// Build the winding enemy path as an array of [col, row] grid coordinates.
//
// Layout overview (16 rows × 24 cols):
//   Row  1  →  cols 0-20   (enter left, sweep right)
//   Col 20  ↓  rows 1-4
//   Row  4  ←  cols 20-4   (sweep left)
//   Col  4  ↓  rows 4-7
//   Row  7  →  cols 4-22   (sweep right)
//   Col 22  ↓  rows 7-10
//   Row 10  ←  cols 22-6   (sweep left)
//   Col  6  ↓  rows 10-13
//   Row 13  →  cols 6-23   (exit right)
//
// Free build zones: row 0, rows 2-3, rows 5-6, rows 8-9, rows 11-12, rows 14-15
// plus all cells not on a path column within those rows — consistent 2-row corridors.
const GPATH = [];
for (let c = 0;  c <= 20; c++) GPATH.push([c, 1]);   // row 1  →
for (let r = 2;  r <= 4;  r++) GPATH.push([20, r]);   // col 20 ↓
for (let c = 19; c >= 4;  c--) GPATH.push([c, 4]);   // row 4  ←
for (let r = 5;  r <= 7;  r++) GPATH.push([4, r]);    // col 4  ↓
for (let c = 5;  c <= 22; c++) GPATH.push([c, 7]);   // row 7  →
for (let r = 8;  r <= 10; r++) GPATH.push([22, r]);   // col 22 ↓
for (let c = 21; c >= 6;  c--) GPATH.push([c, 10]);  // row 10 ←
for (let r = 11; r <= 13; r++) GPATH.push([6, r]);    // col 6  ↓
for (let c = 7;  c <= 23; c++) GPATH.push([c, 13]);  // row 13 → exit

// Fast lookup set for path tiles
const gpSet = new Set(GPATH.map(function (p) { return p[0] + ',' + p[1]; }));

function isPath(col, row) {
  return gpSet.has(col + ',' + row);
}

// Returns the pixel center of a path node by index
function gpx(i) {
  const p = GPATH[Math.min(i, GPATH.length - 1)];
  return { x: p[0] * CELL + CELL / 2, y: p[1] * CELL + CELL / 2 };
}

// Pre-compute decorative tree positions (non-path cells that pass a noise threshold)
const TREES = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (!isPath(c, r) && Math.sin(c * 7.3 + r * 13.7) > 0.72) {
      TREES.push([c, r]);
    }
  }
}
