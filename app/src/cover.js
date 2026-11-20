// VICE CITY QUARTET — the multi-panel cover composer.
// Each template is a GTA-style multi-panel poster: scene panels, photo
// panels (the user's photo, cropped and positioned), and a bold caption
// band. The composer paints one standalone SVG per poster.

import { SCENES, LOOKS } from './scenes.js';

export const ASPECTS = {
  '1:1': { w: 1080, h: 1080, label: '1080 × 1080' },
  '4:5': { w: 1080, h: 1350, label: '1080 × 1350' },
  '16:9': { w: 1920, h: 1080, label: '1920 × 1080' },
};

let uidCounter = 0;
const nextUid = () => `u${++uidCounter}`;

// Prefix every gradient/filter id in a scene's markup so two copies of
// the same scene can live in one document (stage + poster view).
function uniquify(markup, u) {
  return markup
    .replace(/id="([a-z]{2})-/g, `id="$1-${u}-`)
    .replace(/url\(#([a-z]{2})-/g, `url(#$1-${u}-`);
}

function scenePanel(scene, x, y, w, h, p, u, crop) {
  const vb = crop || '0 0 800 600';
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="xMidYMid slice">${uniquify(scene.paint(p), u)}</svg>`;
}

function photoPanel(photo, x, y, w, h, u, frame) {
  let inner;
  if (photo && photo.src) {
    const vw = 800 / (photo.zoom || 1);
    const vh = 600 / (photo.zoom || 1);
    const vx = Math.max(0, Math.min(800 - vw, photo.x || 0));
    const vy = Math.max(0, Math.min(600 - vh, photo.y || 0));
    inner = `<svg x="0" y="0" width="${w}" height="${h}" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}" preserveAspectRatio="xMidYMid slice"><image href="${photo.src}" x="0" y="0" width="800" height="600" preserveAspectRatio="xMidYMid slice"/></svg>`;
  } else {
    inner = `<g>
      <rect x="0" y="0" width="${w}" height="${h}" fill="#14102a"/>
      <rect x="10" y="10" width="${w - 20}" height="${h - 20}" fill="none" stroke="#5a4a8a" stroke-width="3" stroke-dasharray="14 10"/>
      <g fill="none" stroke="#8a7cc0" stroke-width="4">
        <rect x="${w / 2 - 46}" y="${h / 2 - 34}" width="92" height="68" rx="8"/>
        <circle cx="${w / 2}" cy="${h / 2}" r="18"/>
      </g>
      <text x="${w / 2}" y="${h / 2 + 62}" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#8a7cc0" letter-spacing="3">YOUR PHOTO</text>
    </g>`;
  }
  const frameRect = frame
    ? `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#f5f0e6" stroke-width="14"/><rect x="14" y="14" width="${w - 28}" height="${h - 28}" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>`
    : `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="2"/>`;
  // The nested <svg> above clips the photo to its viewport; the
  // placeholder and frame are drawn inside the panel bounds, so no
  // clipPath is needed here.
  return `<g transform="translate(${x} ${y})">${inner}${frameRect}</g>`;
}

function titleBand(x, y, w, h, title, tagline, p, u) {
  const fs = Math.round(h * 0.52);
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0a0616"/>
    <rect x="${x}" y="${y}" width="${w}" height="6" fill="${p.accent}"/>
    <text x="${x + w / 2}" y="${y + h * 0.52}" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="${fs}" fill="#f5f0e6" textLength="${Math.round(w * 0.92)}" lengthAdjust="spacingAndGlyphs">${escapeXml(title)}</text>
    <text x="${x + w / 2}" y="${y + h * 0.88}" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="${Math.round(h * 0.26)}" fill="${p.accent}" letter-spacing="${Math.round(h * 0.22)}">${escapeXml(tagline)}</text>
  </g>`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// One template = a function (W, H, state, palette) => { panels, title }.
// Panels are painted in order; the title band paints last.
const TEMPLATES = [
  {
    id: 'duo', name: 'Boulevard Duo', scene: 0,
    layout(W, H, s, p, u) {
      const bandH = Math.round(H * 0.16);
      const rowY = Math.round(H * 0.52), rowH = H - bandH - rowY;
      return [
        scenePanel(SCENES[0], 0, 0, W, rowY, p, u),
        photoPanel(s.photoA, 0, rowY, Math.round(W * 0.3), rowH, `${u}a`),
        photoPanel(s.useAinBoth ? s.photoA : s.photoB, Math.round(W * 0.3), rowY, Math.round(W * 0.3), rowH, `${u}b`),
        scenePanel(SCENES[1], Math.round(W * 0.6), rowY, W - Math.round(W * 0.6), rowH, p, `${u}c`, '90 40 620 465'),
        titleBand(0, H - bandH, W, bandH, s.title, s.tagline, p, u),
      ].join('');
    },
  },
  {
    id: 'pier', name: 'Pier Nights', scene: 1,
    layout(W, H, s, p, u) {
      const bandH = Math.round(H * 0.14);
      const heroY = bandH, heroH = Math.round(H * 0.48);
      const rowY = heroY + heroH, rowH = H - rowY;
      return [
        titleBand(0, 0, W, bandH, s.title, s.tagline, p, u),
        scenePanel(SCENES[1], 0, heroY, W, heroH, p, u),
        photoPanel(s.photoA, 0, rowY, Math.round(W * 0.34), rowH, `${u}a`),
        photoPanel(s.useAinBoth ? s.photoA : s.photoB, Math.round(W * 0.34), rowY, Math.round(W * 0.28), rowH, `${u}b`),
        scenePanel(SCENES[2], Math.round(W * 0.62), rowY, W - Math.round(W * 0.62), rowH, p, `${u}c`, '60 90 640 480'),
      ].join('');
    },
  },
  {
    id: 'heist', name: 'Neon Heist', scene: 2,
    layout(W, H, s, p, u) {
      const bandH = Math.round(H * 0.16);
      const heroH = Math.round(H * 0.6);
      const rowY = heroH, rowH = H - bandH - rowY;
      const split = Math.round(W * 0.58);
      return [
        `<g clip-path="url(#${u}-dl)"><defs><clipPath id="${u}-dl"><polygon points="0,0 ${split},0 ${Math.round(W * 0.4)},${heroH} 0,${heroH}"/></clipPath></defs>${scenePanel(SCENES[2], 0, 0, W, heroH, p, `${u}l`)}</g>`,
        `<g clip-path="url(#${u}-dr)"><defs><clipPath id="${u}-dr"><polygon points="${split},0 ${W},0 ${W},${heroH} ${Math.round(W * 0.4)},${heroH}"/></clipPath></defs>${scenePanel(SCENES[0], 0, 0, W, heroH, p, `${u}r`, '120 0 680 510')}</g>`,
        `<path d="M ${split} 0 L ${Math.round(W * 0.4)} ${heroH}" stroke="#ffffff" stroke-width="7" opacity="0.85"/>`,
        photoPanel(s.photoA, 0, rowY, Math.round(W * 0.3), rowH, `${u}a`),
        photoPanel(s.useAinBoth ? s.photoA : s.photoB, Math.round(W * 0.3), rowY, Math.round(W * 0.3), rowH, `${u}b`),
        scenePanel(SCENES[3], Math.round(W * 0.6), rowY, W - Math.round(W * 0.6), rowH, p, `${u}c`, '40 120 640 480'),
        titleBand(0, H - bandH, W, bandH, s.title, s.tagline, p, u),
      ].join('');
    },
  },
  {
    id: 'noir', name: 'Leonida Noir', scene: 3,
    layout(W, H, s, p, u) {
      const bandH = Math.round(H * 0.17);
      const a = { x: Math.round(W * 0.06), y: Math.round(H * 0.08), w: Math.round(W * 0.36), h: Math.round(H * 0.36) };
      const b = { x: Math.round(W * 0.6), y: Math.round(H * 0.05), w: Math.round(W * 0.32), h: Math.round(H * 0.3) };
      return [
        scenePanel(SCENES[3], 0, 0, W, H, p, u),
        `<g transform="rotate(-2 ${a.x + a.w / 2} ${a.y + a.h / 2})">${photoPanel(s.photoA, a.x, a.y, a.w, a.h, `${u}a`, true)}</g>`,
        `<g transform="rotate(2 ${b.x + b.w / 2} ${b.y + b.h / 2})">${photoPanel(s.useAinBoth ? s.photoA : s.photoB, b.x, b.y, b.w, b.h, `${u}b`, true)}</g>`,
        `<g><rect x="0" y="${H - bandH}" width="${W}" height="${bandH}" fill="#0a0616" opacity="0.88"/><rect x="0" y="${H - bandH}" width="${W}" height="6" fill="${p.accent}"/>${titleBand(0, H - bandH, W, bandH, s.title, s.tagline, p, u).replace(/<rect x="0" y="[^"]*" width="[^"]*" height="[^"]*" fill="#0a0616"\/>/, '').replace(/<rect x="0" y="[^"]*" width="[^"]*" height="6" fill="[^"]*"\/>/, '')}</g>`,
      ].join('');
    },
  },
];

export const TEMPLATE_NAMES = TEMPLATES.map((t) => t.name);
export const LOOK_NAMES = Object.values(LOOKS).map((l) => l.name);

// Compose the poster's SVG. `standalone` adds xmlns + pixel size (export).
export function composeCover(state, standalone = false) {
  const aspect = ASPECTS[state.aspect] || ASPECTS['1:1'];
  const { w: W, h: H } = aspect;
  const p = LOOKS[state.look] || LOOKS.sunset;
  const tpl = TEMPLATES[state.template] || TEMPLATES[0];
  const u = nextUid();
  const grade = state.gtafy ? Math.max(0, Math.min(100, state.grade || 0)) : 0;
  const art = tpl.layout(W, H, state, p, u);
  const gradeDefs = grade > 0 ? `<defs>
    <filter id="gtafy-${u}" x="0" y="0" width="100%" height="100%">
      <feComponentTransfer><feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1"/><feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1"/><feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1"/></feComponentTransfer>
      <feColorMatrix type="saturate" values="1.3"/>
    </filter>
    <pattern id="half-${u}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.1" fill="#000"/></pattern>
    <radialGradient id="vig-${u}" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.32"/></radialGradient>
  </defs>` : '';
  const gradeOverlays = grade > 0 ? `
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#half-${u})" opacity="${(grade / 100 * 0.26).toFixed(3)}"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#vig-${u})"/>` : '';
  const body = `${gradeDefs}<g ${grade > 0 ? `filter="url(#gtafy-${u})"` : ''}>${art}</g>${gradeOverlays}`;
  if (standalone) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="GTA VI style cover art">${body}</svg>`;
}

// Export the current cover as a PNG at the poster's pixel size.
export async function exportCover(state) {
  const aspect = ASPECTS[state.aspect] || ASPECTS['1:1'];
  const svg = composeCover(state, true);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error('poster image failed to load'));
      im.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = aspect.w;
    canvas.height = aspect.h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, aspect.w, aspect.h);
    const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!png) throw new Error('canvas produced no PNG');
    const name = `vice-city-quartet-${aspect.w}x${aspect.h}.png`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(png);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    return { ok: true, name, bytes: png.size };
  } finally {
    URL.revokeObjectURL(url);
  }
}
