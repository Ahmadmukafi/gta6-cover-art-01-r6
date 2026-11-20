// VICE CITY QUARTET — hand-drawn Vice City scene backdrops.
// Every scene is original vector art painted in code: no photos, no
// Rockstar artwork, no external assets. Each scene returns SVG markup
// for an 800x600 backdrop, coloured by the active look's palette.

export const LOOKS = {
  sunset: {
    name: 'Sunset Strip', skyTop: '#1d0546', skyMid: '#7a1e6e', skyLow: '#ff7a3c',
    sun: '#ffd23c', sunCore: '#fff3a0', haze: '#ff9e57', neonA: '#ff2e88', neonB: '#19e3ff',
    neonC: '#ffd23c', building: '#170a33', building2: '#22104a', window: '#ffd76a',
    windowDim: '#8a6a35', ground: '#12041f', street: '#1c0b31', accent: '#ff2e88',
    mist: '#ff9e57', water: '#241040',
  },
  neon: {
    name: 'Neon Night', skyTop: '#05002e', skyMid: '#2b0a6e', skyLow: '#7b00ff',
    sun: '#ff4d6d', sunCore: '#ffb3c1', haze: '#b678ff', neonA: '#00f0ff', neonB: '#39ff88',
    neonC: '#ff5ce1', building: '#0a0426', building2: '#12083d', window: '#7df9ff',
    windowDim: '#2e6f7a', ground: '#060214', street: '#0d0524', accent: '#00f0ff',
    mist: '#8a5cff', water: '#0a0633',
  },
  noir: {
    name: 'Noir Vice', skyTop: '#04181f', skyMid: '#0d3a3a', skyLow: '#c96a2e',
    sun: '#ffb347', sunCore: '#ffe9b0', haze: '#e08a4c', neonA: '#ff8a5c', neonB: '#4de3c2',
    neonC: '#ffc46b', building: '#081a1a', building2: '#0d2424', window: '#ffc46b',
    windowDim: '#7a5a2e', ground: '#03100f', street: '#0a1f1c', accent: '#ff8a5c',
    mist: '#7fb8a6', water: '#0a2622',
  },
};

// Deterministic pseudo-random, so a scene paints the same every load.
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A grid of lit windows for one building face.
export function windows(rand, x, y, w, h, cols, rows, p, litChance) {
  let out = '';
  const cw = w / cols, ch = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rand() < litChance) {
        const lit = rand() < 0.75;
        out += `<rect x="${(x + c * cw + cw * 0.22).toFixed(1)}" y="${(y + r * ch + ch * 0.22).toFixed(1)}" width="${(cw * 0.56).toFixed(1)}" height="${(ch * 0.56).toFixed(1)}" fill="${lit ? p.window : p.windowDim}" opacity="${lit ? 0.95 : 0.55}"/>`;
      }
    }
  }
  return out;
}

// One palm silhouette, drawn from a trunk point, fanning fronds.
export function palm(x, y, s, lean, p) {
  const fronds = [];
  for (let i = 0; i < 7; i++) {
    const a = (-160 + i * 26) * Math.PI / 180;
    const len = s * (0.9 + (i % 3) * 0.14);
    const ex = x + Math.cos(a) * len + lean;
    const ey = y + Math.sin(a) * len * 0.55 - s * 0.12;
    const mx = x + Math.cos(a) * len * 0.5 + lean * 0.6;
    const my = y + Math.sin(a) * len * 0.28 - s * 0.3;
    fronds.push(`<path d="M ${x} ${y} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#0a0318" stroke-width="${(s * 0.09).toFixed(1)}" fill="none" stroke-linecap="round"/>`);
  }
  return `<g><path d="M ${x} ${y + s * 1.15} Q ${x + lean * 0.4} ${y + s * 0.4} ${x} ${y}" stroke="#0a0318" stroke-width="${(s * 0.08).toFixed(1)}" fill="none" stroke-linecap="round"/>${fronds.join('')}</g>`;
}

// A low sports car, side profile, with headlight beams.
export function sportsCar(x, y, s, p, body) {
  return `<g>
    <ellipse cx="${x + 95 * s}" cy="${y + 34 * s}" rx="${62 * s}" ry="${7 * s}" fill="${p.neonB}" opacity="0.35"/>
    <path d="M ${x} ${y + 30 * s} L ${x + 22 * s} ${y + 12 * s} L ${x + 62 * s} ${y + 2 * s} L ${x + 118 * s} ${y + 4 * s} L ${x + 158 * s} ${y + 14 * s} L ${x + 176 * s} ${y + 30 * s} Z" fill="${body}"/>
    <path d="M ${x + 66 * s} ${y + 5 * s} L ${x + 112 * s} ${y + 6 * s} L ${x + 104 * s} ${y + 15 * s} L ${x + 70 * s} ${y + 14 * s} Z" fill="#0d1526" opacity="0.9"/>
    <circle cx="${x + 42 * s}" cy="${y + 30 * s}" r="${13 * s}" fill="#0a0a12"/><circle cx="${x + 42 * s}" cy="${y + 30 * s}" r="${6 * s}" fill="#2a2f45"/>
    <circle cx="${x + 140 * s}" cy="${y + 30 * s}" r="${13 * s}" fill="#0a0a12"/><circle cx="${x + 140 * s}" cy="${y + 30 * s}" r="${6 * s}" fill="#2a2f45"/>
    <path d="M ${x + 176 * s} ${y + 18 * s} L ${x + 235 * s} ${y + 8 * s} L ${x + 235 * s} ${y + 26 * s} Z" fill="${p.sun}" opacity="0.55"/>
    <circle cx="${x + 174 * s}" cy="${y + 20 * s}" r="${4 * s}" fill="#fff8d0"/>
  </g>`;
}

// Lucia: long hair, fitted jacket, hand on hip. Jason: backwards cap,
// broad shoulders, bomber jacket, arms crossed. Flat black silhouettes
// with a single neon rim line on the sun-facing side. (x, y) is the
// ground point under the figure's feet; the figure is ~150*s tall.
export function lucia(x, y, s, p) {
  return `<g fill="#07030f">
    <ellipse cx="${x - 6 * s}" cy="${y - 116 * s}" rx="${17 * s}" ry="${32 * s}"/>
    <circle cx="${x}" cy="${y - 132 * s}" r="${13 * s}"/>
    <path d="M ${x - 15 * s} ${y - 108 * s} L ${x + 15 * s} ${y - 108 * s} L ${x + 12 * s} ${y - 58 * s} L ${x + 10 * s} ${y - 10 * s} L ${x - 10 * s} ${y - 10 * s} L ${x - 13 * s} ${y - 58 * s} Z"/>
    <path d="M ${x - 13 * s} ${y - 100 * s} Q ${x - 30 * s} ${y - 78 * s} ${x - 22 * s} ${y - 56 * s}" fill="none" stroke="#07030f" stroke-width="${7 * s}" stroke-linecap="round"/>
    <path d="M ${x + 13 * s} ${y - 100 * s} Q ${x + 21 * s} ${y - 72 * s} ${x + 17 * s} ${y - 42 * s}" fill="none" stroke="#07030f" stroke-width="${7 * s}" stroke-linecap="round"/>
    <path d="M ${x - 11 * s} ${y - 12 * s} L ${x - 3 * s} ${y - 12 * s} L ${x - 6 * s} ${y} L ${x - 15 * s} ${y} Z"/>
    <path d="M ${x + 3 * s} ${y - 12 * s} L ${x + 11 * s} ${y - 12 * s} L ${x + 15 * s} ${y} L ${x + 6 * s} ${y} Z"/>
    <path d="M ${x + 15 * s} ${y - 106 * s} Q ${x + 19 * s} ${y - 70 * s} ${x + 13 * s} ${y - 24 * s}" fill="none" stroke="${p.neonA}" stroke-width="${2.4 * s}" stroke-linecap="round" opacity="0.9"/>
    <path d="M ${x + 12 * s} ${y - 140 * s} Q ${x + 20 * s} ${y - 118 * s} ${x + 14 * s} ${y - 96 * s}" fill="none" stroke="${p.neonA}" stroke-width="${2.2 * s}" stroke-linecap="round" opacity="0.9"/>
  </g>`;
}

export function jason(x, y, s, p) {
  return `<g fill="#07030f">
    <circle cx="${x}" cy="${y - 136 * s}" r="${13 * s}"/>
    <ellipse cx="${x + 2 * s}" cy="${y - 147 * s}" rx="${15 * s}" ry="${6 * s}"/>
    <path d="M ${x - 15 * s} ${y - 146 * s} L ${x + 17 * s} ${y - 146 * s} L ${x + 26 * s} ${y - 140 * s} L ${x + 2 * s} ${y - 138 * s} L ${x - 14 * s} ${y - 140 * s} Z"/>
    <path d="M ${x - 24 * s} ${y - 122 * s} L ${x + 24 * s} ${y - 122 * s} L ${x + 20 * s} ${y - 62 * s} L ${x + 16 * s} ${y - 12 * s} L ${x - 16 * s} ${y - 12 * s} L ${x - 20 * s} ${y - 62 * s} Z"/>
    <rect x="${x - 21 * s}" y="${y - 100 * s}" width="${42 * s}" height="${11 * s}" rx="${5 * s}"/>
    <path d="M ${x - 15 * s} ${y - 14 * s} L ${x - 7 * s} ${y - 14 * s} L ${x - 10 * s} ${y} L ${x - 20 * s} ${y} Z"/>
    <path d="M ${x + 7 * s} ${y - 14 * s} L ${x + 15 * s} ${y - 14 * s} L ${x + 20 * s} ${y} L ${x + 10 * s} ${y} Z"/>
    <path d="M ${x - 24 * s} ${y - 120 * s} Q ${x - 28 * s} ${y - 78 * s} ${x - 20 * s} ${y - 30 * s}" fill="none" stroke="${p.neonB}" stroke-width="${2.4 * s}" stroke-linecap="round" opacity="0.9"/>
    <path d="M ${x - 13 * s} ${y - 144 * s} Q ${x - 20 * s} ${y - 124 * s} ${x - 15 * s} ${y - 104 * s}" fill="none" stroke="${p.neonB}" stroke-width="${2.2 * s}" stroke-linecap="round" opacity="0.9"/>
  </g>`;
}

// ---- Scene 1: Boulevard Dusk -------------------------------------------
// Neon Ocean Drive skyline, low sun, palms, wet street, Lucia + Jason
// back to back under the classic GTA diagonal beam.
export function sceneBoulevard(p) {
  const rand = rng(11);
  // Skyline with a notch in the middle so the low sun shows through.
  const skyline = [
    [0, 200, 92, 400], [86, 140, 104, 460], [182, 225, 76, 375], [252, 110, 96, 490],
    [342, 180, 84, 420], [424, 360, 60, 240], [480, 380, 72, 220], [548, 350, 62, 250],
    [606, 130, 100, 470], [700, 210, 100, 390],
  ];
  let buildings = '';
  skyline.forEach(([x, y, w, h], i) => {
    buildings += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i % 2 ? p.building : p.building2}"/>`;
    buildings += windows(rand, x + 6, y + 14, w - 12, h - 24, 4, 9, p, 0.42);
  });
  return `<g>
    <defs>
      <linearGradient id="bd-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.skyTop}"/><stop offset="0.55" stop-color="${p.skyMid}"/><stop offset="1" stop-color="${p.skyLow}"/>
      </linearGradient>
      <linearGradient id="bd-street" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.street}"/><stop offset="1" stop-color="${p.ground}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bd-sky)"/>
    <g fill="#fff" opacity="0.8">
      <circle cx="90" cy="60" r="2"/><circle cx="210" cy="40" r="1.6"/><circle cx="330" cy="84" r="2.2"/><circle cx="470" cy="46" r="1.5"/><circle cx="580" cy="90" r="2"/><circle cx="690" cy="52" r="1.7"/><circle cx="760" cy="110" r="2.1"/>
    </g>
    <circle cx="515" cy="300" r="112" fill="${p.sun}" opacity="0.92"/>
    <circle cx="515" cy="300" r="82" fill="${p.sunCore}" opacity="0.95"/>
    <rect x="0" y="300" width="800" height="300" fill="url(#bd-street)"/>
    ${buildings}
    <g font-family="Arial Black, Impact, sans-serif" font-weight="900" text-anchor="middle">
      <text x="130" y="300" fill="${p.neonA}" font-size="20" letter-spacing="2" transform="rotate(-90 130 300)">OCEAN DRIVE</text>
      <text x="300" y="280" fill="${p.neonB}" font-size="26" letter-spacing="3">HOTEL VICE</text>
      <text x="655" y="250" fill="${p.neonC}" font-size="30" letter-spacing="4">NEON</text>
      <text x="650" y="382" fill="${p.neonC}" font-size="22" letter-spacing="3">CASINO</text>
      <text x="762" y="330" fill="${p.neonA}" font-size="26" letter-spacing="3" transform="rotate(-90 762 330)">PALMS</text>
      <text x="48" y="382" fill="${p.neonB}" font-size="22" letter-spacing="3">BAR</text>
    </g>
    <g opacity="0.5">
      <rect x="180" y="470" width="60" height="7" fill="${p.neonA}"/><rect x="370" y="500" width="90" height="7" fill="${p.neonB}"/>
      <rect x="540" y="480" width="70" height="7" fill="${p.neonC}"/><rect x="660" y="510" width="80" height="7" fill="${p.neonA}"/>
    </g>
    ${palm(52, 520, 62, -14, p)}${palm(742, 530, 56, 12, p)}
    <rect x="0" y="0" width="800" height="600" fill="${p.haze}" opacity="0.06"/>
    <path d="M 400 0 L 336 600 L 352 600 L 416 0 Z" fill="#ffffff" opacity="0.14"/>
    ${lucia(462, 402, 1.05, p)}
    ${jason(548, 402, 1.08, p)}
  </g>`;
}

// ---- Scene 2: Pier Night ------------------------------------------------
// Neon pier, ferris wheel, string lights, rain, a lone rider on a bike.
export function scenePier(p) {
  const rand = rng(23);
  let rain = '';
  for (let i = 0; i < 46; i++) {
    const x = rand() * 800, y = rand() * 420;
    rain += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - 9).toFixed(0)}" y2="${(y + 26).toFixed(0)}" stroke="#cfe8ff" stroke-width="1.4" opacity="0.35"/>`;
  }
  let wheelCabins = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    wheelCabins += `<circle cx="${(560 + Math.cos(a) * 92).toFixed(1)}" cy="${(215 + Math.sin(a) * 92).toFixed(1)}" r="9" fill="${i % 2 ? p.neonA : p.neonB}"/>`;
  }
  return `<g>
    <defs>
      <linearGradient id="pn-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.skyTop}"/><stop offset="0.6" stop-color="${p.skyMid}"/><stop offset="1" stop-color="${p.skyLow}"/>
      </linearGradient>
      <linearGradient id="pn-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.water}"/><stop offset="1" stop-color="${p.ground}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#pn-sky)"/>
    <circle cx="150" cy="110" r="34" fill="${p.sunCore}" opacity="0.85"/>
    <g fill="#fff" opacity="0.85">
      <circle cx="90" cy="60" r="2"/><circle cx="300" cy="48" r="1.6"/><circle cx="430" cy="90" r="2.1"/><circle cx="640" cy="56" r="1.7"/><circle cx="740" cy="130" r="2"/>
    </g>
    <rect x="0" y="380" width="800" height="220" fill="url(#pn-sea)"/>
    <g opacity="0.45">
      <rect x="60" y="400" width="120" height="5" fill="${p.neonB}"/><rect x="300" y="430" width="150" height="5" fill="${p.neonA}"/>
      <rect x="540" y="410" width="130" height="5" fill="${p.neonC}"/><rect x="180" y="470" width="170" height="5" fill="${p.neonB}"/>
    </g>
    <g stroke="${p.neonA}" stroke-width="3" fill="none" opacity="0.95">
      <circle cx="560" cy="215" r="92"/><circle cx="560" cy="215" r="52"/>
      <line x1="560" y1="123" x2="560" y2="307"/><line x1="468" y1="215" x2="652" y2="215"/>
      <line x1="495" y1="150" x2="625" y2="280"/><line x1="625" y1="150" x2="495" y2="280"/>
    </g>
    <circle cx="560" cy="215" r="10" fill="${p.neonC}"/>
    ${wheelCabins}
    <g stroke="#0a0318" stroke-width="7" fill="none"><line x1="500" y1="290" x2="470" y2="430"/><line x1="620" y1="290" x2="650" y2="430"/></g>
    <rect x="0" y="430" width="800" height="26" fill="#150a28"/>
    <g fill="#150a28">
      <rect x="30" y="456" width="740" height="144"/>
      <rect x="30" y="456" width="740" height="10" fill="#241640"/>
    </g>
    <g>
      <line x1="0" y1="446" x2="800" y2="446" stroke="#0a0318" stroke-width="3"/>
      ${[60, 140, 220, 300, 380, 460, 540, 620, 700, 770].map((x, i) => `<circle cx="${x}" cy="446" r="5" fill="${i % 2 ? p.neonA : p.neonB}"/>`).join('')}
    </g>
    <g fill="#07030f" stroke="${p.neonB}" stroke-width="2" stroke-opacity="0.8">
      <circle cx="330" cy="452" r="11"/>
      <path d="M 322 462 L 340 462 L 338 486 L 324 486 Z"/>
      <circle cx="306" cy="500" r="10" fill="none" stroke-width="3"/><circle cx="356" cy="500" r="10" fill="none" stroke-width="3"/>
      <path d="M 318 486 L 306 498 M 338 486 L 354 498 M 324 470 L 352 496" stroke-width="3" fill="none"/>
    </g>
    ${rain}
    <rect x="0" y="0" width="800" height="600" fill="${p.mist}" opacity="0.05"/>
  </g>`;
}

// ---- Scene 3: Neon Heist ------------------------------------------------
// Downtown getaway: sports car, helicopter searchlight, two runners.
export function sceneHeist(p) {
  const rand = rng(37);
  const towers = [
    [0, 130, 120, 470], [112, 70, 96, 530], [200, 160, 110, 440], [302, 90, 100, 510],
    [396, 150, 92, 450], [482, 60, 108, 540], [584, 140, 96, 460], [674, 100, 126, 500],
  ];
  let buildings = '';
  towers.forEach(([x, y, w, h], i) => {
    buildings += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i % 2 ? p.building : p.building2}"/>`;
    buildings += windows(rand, x + 6, y + 12, w - 12, h - 26, 4, 11, p, 0.5);
  });
  return `<g>
    <defs>
      <linearGradient id="nh-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.skyTop}"/><stop offset="0.55" stop-color="${p.skyMid}"/><stop offset="1" stop-color="${p.skyLow}"/>
      </linearGradient>
      <radialGradient id="nh-siren-r" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ff2e4d" stop-opacity="0.85"/><stop offset="1" stop-color="#ff2e4d" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="nh-siren-b" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#2e7dff" stop-opacity="0.85"/><stop offset="1" stop-color="#2e7dff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#nh-sky)"/>
    <circle cx="640" cy="90" r="300" fill="url(#nh-siren-r)" opacity="0.5"/>
    <circle cx="140" cy="120" r="280" fill="url(#nh-siren-b)" opacity="0.5"/>
    ${buildings}
    <g font-family="Arial Black, Impact, sans-serif" font-weight="900" text-anchor="middle">
      <text x="160" y="220" fill="${p.neonA}" font-size="30" letter-spacing="3">24H</text>
      <text x="350" y="180" fill="${p.neonB}" font-size="24" letter-spacing="3">MOTEL</text>
      <text x="540" y="210" fill="${p.neonC}" font-size="26" letter-spacing="3">LIQUOR</text>
      <text x="724" y="250" fill="${p.neonA}" font-size="22" letter-spacing="2">DINE</text>
    </g>
    <rect x="0" y="470" width="800" height="130" fill="${p.street}"/>
    <g opacity="0.55">
      <rect x="40" y="500" width="110" height="6" fill="${p.neonB}"/><rect x="330" y="520" width="140" height="6" fill="${p.neonA}"/>
      <rect x="590" y="505" width="120" height="6" fill="${p.neonC}"/>
    </g>
    <g>
      <ellipse cx="620" cy="120" rx="46" ry="16" fill="#0a0a12"/>
      <rect x="576" y="112" width="88" height="7" rx="3" fill="#0a0a12"/>
      <rect x="600" y="104" width="40" height="10" rx="4" fill="#1c2438"/>
      <path d="M 620 128 L 470 420 L 700 420 Z" fill="#fff8d0" opacity="0.16"/>
      <circle cx="620" cy="128" r="7" fill="#fff8d0"/>
    </g>
    ${sportsCar(90, 505, 1.05, p, '#ff2e4d')}
    <g fill="#07030f" stroke="${p.neonA}" stroke-width="2" stroke-opacity="0.8">
      <circle cx="470" cy="480" r="10"/>
      <path d="M 462 490 L 480 490 L 486 522 L 496 552 L 486 552 L 476 522 L 466 522 L 456 552 L 446 552 L 458 520 Z"/>
      <path d="M 462 496 L 446 512 M 478 496 L 494 508" stroke-width="3" fill="none"/>
      <circle cx="540" cy="492" r="10"/>
      <path d="M 532 502 L 550 502 L 556 530 L 566 556 L 556 556 L 546 528 L 536 528 L 528 556 L 518 556 L 528 526 Z"/>
      <path d="M 532 508 L 518 522 M 548 508 L 562 516" stroke-width="3" fill="none"/>
    </g>
    <g stroke="#cfe8ff" stroke-width="1.3" opacity="0.3">
      ${Array.from({ length: 30 }, (_, i) => { const x = (i * 67) % 800; const y = (i * 53) % 380; return `<line x1="${x}" y1="${y}" x2="${x - 8}" y2="${y + 22}"/>`; }).join('')}
    </g>
  </g>`;
}

// ---- Scene 4: Leonida Noir ----------------------------------------------
// Swamp dusk: mangroves, airboat with fan, heron, mist over still water.
export function sceneNoir(p) {
  const rand = rng(53);
  let reeds = '';
  for (let i = 0; i < 26; i++) {
    const x = 20 + rand() * 760, h = 34 + rand() * 66;
    reeds += `<path d="M ${x.toFixed(0)} 560 Q ${(x + 6).toFixed(0)} ${560 - h * 0.6} ${(x - 4).toFixed(0)} ${560 - h}" stroke="#03100f" stroke-width="3.5" fill="none"/>`;
  }
  return `<g>
    <defs>
      <linearGradient id="ln-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.skyTop}"/><stop offset="0.55" stop-color="${p.skyMid}"/><stop offset="1" stop-color="${p.skyLow}"/>
      </linearGradient>
      <linearGradient id="ln-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p.water}"/><stop offset="1" stop-color="${p.ground}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#ln-sky)"/>
    <circle cx="560" cy="330" r="120" fill="${p.sun}" opacity="0.9"/>
    <circle cx="560" cy="330" r="84" fill="${p.sunCore}" opacity="0.9"/>
    <g fill="#0a0318" opacity="0.9">
      <path d="M 0 340 Q 120 300 260 336 Q 420 306 560 338 Q 680 312 800 340 L 800 380 L 0 380 Z"/>
      <path d="M 0 372 Q 200 344 420 368 Q 620 348 800 372 L 800 400 L 0 400 Z"/>
    </g>
    <rect x="0" y="380" width="800" height="220" fill="url(#ln-water)"/>
    <g opacity="0.4">
      <rect x="420" y="410" width="180" height="6" fill="${p.sun}"/><rect x="180" y="450" width="220" height="6" fill="${p.neonB}"/>
      <rect x="520" y="490" width="150" height="6" fill="${p.sun}"/>
    </g>
    <g>
      <ellipse cx="330" cy="470" rx="150" ry="16" fill="${p.mist}" opacity="0.12"/>
      <ellipse cx="560" cy="500" rx="170" ry="14" fill="${p.mist}" opacity="0.1"/>
    </g>
    <g>
      <path d="M 250 470 L 470 470 L 450 500 L 270 500 Z" fill="#3d2b1f"/>
      <rect x="252" y="462" width="216" height="10" rx="4" fill="#54382a"/>
      <circle cx="360" cy="400" r="52" fill="none" stroke="#1c1410" stroke-width="6"/>
      <circle cx="360" cy="400" r="10" fill="#1c1410"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        return `<line x1="${(360 + Math.cos(r) * 10).toFixed(1)}" y1="${(400 + Math.sin(r) * 10).toFixed(1)}" x2="${(360 + Math.cos(r) * 52).toFixed(1)}" y2="${(400 + Math.sin(r) * 52).toFixed(1)}" stroke="#1c1410" stroke-width="4"/>`;
      }).join('')}
      <g fill="#07030f"><circle cx="300" cy="440" r="9"/><path d="M 292 448 L 310 448 L 306 470 L 296 470 Z"/></g>
      <path d="M 250 500 L 240 512 M 470 500 L 480 512" stroke="#3d2b1f" stroke-width="5"/>
    </g>
    <g fill="#07030f" stroke="${p.neonB}" stroke-width="1.6" stroke-opacity="0.7">
      <path d="M 640 470 L 636 520 L 652 520 L 650 478 Q 656 450 668 436 L 676 448 Q 662 462 660 478 Z"/>
      <path d="M 668 436 L 690 430 L 700 436 L 678 442 Z"/>
      <path d="M 640 520 L 632 556 M 650 520 L 660 556" stroke-width="3" fill="none"/>
    </g>
    ${reeds}
    <g fill="#03100f">
      <path d="M 60 380 L 96 330 L 132 380 Z"/><path d="M 700 380 L 730 318 L 766 380 Z"/>
    </g>
  </g>`;
}

export const SCENES = [
  { id: 'boulevard', name: 'Boulevard Dusk', paint: sceneBoulevard },
  { id: 'pier', name: 'Pier Night', paint: scenePier },
  { id: 'heist', name: 'Neon Heist', paint: sceneHeist },
  { id: 'noir', name: 'Leonida Noir', paint: sceneNoir },
];
