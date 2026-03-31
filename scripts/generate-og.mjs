/**
 * Generate OG image (1200x630) as SVG → PNG
 * Logo centered with hex grid extending outward, colored with undulating warm tones
 */
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const W = 1200;
const H = 630;
const SQRT7 = Math.sqrt(7);
const AP7_ROT = Math.atan2(Math.sqrt(3), 5);

// Hex grid params
const R = 28; // hex radius for grid
const rot = 0;

// Colors
const BG = '#FFE4CC'; // linen
const LOGO_DARK = '#190f0a'; // espresso

// Flock colors (orange-300, red-300) matching the site
const ORANGE = [253, 186, 116];
const RED = [252, 165, 165];

function hexPoints(cx, cy, r, rotation = 0) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rotation;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function honeycombCenters(r, rotation, rings) {
  const dist = r * Math.sqrt(3);
  const dirs = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + rotation;
    dirs.push([dist * Math.cos(a), dist * Math.sin(a)]);
  }
  const centers = [{ x: 0, y: 0 }];
  const seen = new Set(['0,0']);
  for (let ring = 1; ring <= rings; ring++) {
    let x = dirs[4][0] * ring;
    let y = dirs[4][1] * ring;
    for (let side = 0; side < 6; side++) {
      for (let step = 0; step < ring; step++) {
        const key = `${Math.round(x * 10)},${Math.round(y * 10)}`;
        if (!seen.has(key)) {
          seen.add(key);
          centers.push({ x, y });
        }
        x += dirs[side][0];
        y += dirs[side][1];
      }
    }
  }
  return centers;
}

// Undulation function - static version of the site's flock pattern
function undulate(x, y) {
  // 3 static "flock" centers positioned around the image
  const flocks = [
    { x: -200, y: -100 },
    { x: 250, y: 80 },
    { x: -50, y: 180 },
    { x: 300, y: -150 },
    { x: -300, y: 50 },
  ];
  const radius = 220;
  let acc = 0;
  let rr = 0, gg = 0, bb = 0;
  for (let i = 0; i < flocks.length; i++) {
    const dx = x - flocks[i].x;
    const dy = y - flocks[i].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.exp(-(dist * dist) / (radius * radius * 2));
    // 80% orange, 20% red
    const color = i < 4 ? ORANGE : RED;
    rr += color[0] * influence;
    gg += color[1] * influence;
    bb += color[2] * influence;
    acc += influence;
  }
  const v = Math.min(acc, 1.0);
  const alpha = v * v * v;
  if (acc > 0.001) {
    rr /= acc;
    gg /= acc;
    bb /= acc;
  } else {
    rr = 127; gg = 94; bb = 70;
  }
  return { alpha, r: Math.round(rr), g: Math.round(gg), b: Math.round(bb) };
}

// Build grid centered on image
const cx = W / 2;
const cy = H / 2;
const rings = Math.ceil(Math.max(W, H) / (R * Math.sqrt(3))) + 1;
const cells = honeycombCenters(R, rot, rings);

// Build SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
svg += `<rect width="${W}" height="${H}" fill="${BG}"/>`;

// Grid hexes with undulating fill
for (const cell of cells) {
  const sx = cx + cell.x;
  const sy = cy + cell.y;
  if (sx < -R || sx > W + R || sy < -R || sy > H + R) continue;

  const { alpha, r, g, b } = undulate(cell.x, cell.y);
  const fa = alpha * 0.15;
  if (fa > 0.005) {
    svg += `<polygon points="${hexPoints(sx, sy, R, rot)}" fill="rgba(${r},${g},${b},${fa.toFixed(3)})" stroke="none"/>`;
  }
}

// Logo - 3 nested aperture-7 hexes, centered
const logoR = 52;
const logoR2 = logoR * 0.85;
const logoR3 = logoR2 * 0.85;

svg += `<polygon points="${hexPoints(cx, cy, logoR, -AP7_ROT * 2)}" fill="${LOGO_DARK}" opacity="0.08"/>`;
svg += `<polygon points="${hexPoints(cx, cy, logoR2, -AP7_ROT)}" fill="${LOGO_DARK}" opacity="0.2"/>`;
svg += `<polygon points="${hexPoints(cx, cy, logoR3, 0)}" fill="${LOGO_DARK}" stroke="${LOGO_DARK}" stroke-width="1" opacity="0.85"/>`;

// Brand text below logo
svg += `<text x="${cx}" y="${cy + 90}" text-anchor="middle" font-family="'Quicksand', system-ui, sans-serif" font-weight="700" font-size="28" fill="${LOGO_DARK}" letter-spacing="6" opacity="0.9">murmura labs</text>`;
svg += `<text x="${cx}" y="${cy + 120}" text-anchor="middle" font-family="'Inter', system-ui, sans-serif" font-weight="400" font-size="14" fill="#7f5e46" letter-spacing="3">URBAN FORESIGHT PLATFORM</text>`;

svg += `</svg>`;

// Write SVG
writeFileSync('public/og-image.svg', svg);
console.log('Written public/og-image.svg');

// Convert to PNG if possible
try {
  // Try rsvg-convert first (best quality)
  execSync('which rsvg-convert', { stdio: 'ignore' });
  execSync('rsvg-convert -w 1200 -h 630 public/og-image.svg -o public/og-image.png');
  console.log('Written public/og-image.png (via rsvg-convert)');
} catch {
  try {
    // Try sips (macOS built-in) - works with SVG on some versions
    execSync('sips -s format png public/og-image.svg --out public/og-image.png 2>/dev/null');
    console.log('Written public/og-image.png (via sips)');
  } catch {
    console.log('Could not convert to PNG automatically. SVG is at public/og-image.svg');
    console.log('Convert manually: npx svgexport public/og-image.svg public/og-image.png 1200:630');
  }
}
