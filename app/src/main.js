// VICE CITY QUARTET — editor wiring: state, photo loading, crop and
// position, templates, looks, GTA-fy grade, poster view and PNG export.
// Fully offline: photos are read on this machine and never uploaded.

import { composeCover, exportCover, ASPECTS, TEMPLATE_NAMES, LOOK_NAMES } from './cover.js';
import { LOOKS } from './scenes.js';

const $ = (sel) => document.querySelector(sel);

const state = {
  template: 0,
  look: 'sunset',
  grade: 70,
  gtafy: true,
  title: 'GRAND THEFT AUTO VI',
  tagline: 'LEONIDA',
  aspect: '1:1',
  useAinBoth: false,
  photoA: { src: '', x: 0, y: 0, zoom: 1 },
  photoB: { src: '', x: 0, y: 0, zoom: 1 },
  selectedPhoto: 'A',
};

const SAMPLES = {
  A: 'samples/photo-portrait.svg',
  B: 'samples/photo-car.svg',
};

function setStatus(msg) {
  $('#status').textContent = msg;
}

// Load a sample photo as a data: URL so the exported SVG stays
// self-contained. Falls back to the plain path if fetch is unavailable
// (for example when the app is opened from file://).
async function loadSample(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error('read failed'));
      r.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

function render() {
  $('#stage').innerHTML = composeCover(state);
  document.querySelectorAll('[data-template]').forEach((b) =>
    b.classList.toggle('active', Number(b.dataset.template) === state.template));
  document.querySelectorAll('[data-look]').forEach((b) =>
    b.classList.toggle('active', b.dataset.look === state.look));
  document.querySelectorAll('[data-aspect]').forEach((b) =>
    b.classList.toggle('active', b.dataset.aspect === state.aspect));
  document.querySelectorAll('[data-paspect]').forEach((b) =>
    b.classList.toggle('active', b.dataset.paspect === state.aspect));
  $('#gradeOut').textContent = `${state.gtafy ? state.grade : 0}%`;
  $('#gradeRange').value = String(state.grade);
  $('#gtafyToggle').checked = state.gtafy;
  syncPhotoPanel();
}

function photoSlot() {
  return state.selectedPhoto === 'A' ? state.photoA : state.photoB;
}

function syncPhotoPanel() {
  const p = photoSlot();
  $('#photoZoom').value = String(p.zoom);
  $('#photoX').value = String(Math.round(p.x));
  $('#photoY').value = String(Math.round(p.y));
  $('#photoZoomOut').textContent = `${p.zoom.toFixed(1)}×`;
  $('#photoXOut').textContent = `${Math.round(p.x)}`;
  $('#photoYOut').textContent = `${Math.round(p.y)}`;
  $('#photoAName').textContent = state.photoA.src ? 'Photo A loaded' : 'Photo A empty';
  $('#photoBName').textContent = state.photoB.src ? 'Photo B loaded' : 'Photo B empty';
  document.querySelectorAll('[data-photoslot]').forEach((b) =>
    b.classList.toggle('active', b.dataset.photoslot === state.selectedPhoto));
}

// ---- photo loading -------------------------------------------------------
function readPhotoFile(file, slot) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const target = slot === 'A' ? state.photoA : state.photoB;
    target.src = String(reader.result);
    target.x = 0; target.y = 0; target.zoom = 1;
    setStatus(`${slot === 'A' ? 'Photo A' : 'Photo B'} loaded: ${file.name}`);
    render();
  };
  reader.onerror = () => setStatus('Could not read that file.');
  reader.readAsDataURL(file);
}

async function loadSampleInto(slot) {
  const src = await loadSample(SAMPLES[slot]);
  const target = slot === 'A' ? state.photoA : state.photoB;
  target.src = src;
  target.x = 0; target.y = 0; target.zoom = 1;
  state.selectedPhoto = slot;
  setStatus(`Sample photo loaded into slot ${slot}.`);
  render();
}

// ---- poster view ---------------------------------------------------------
function openPoster() {
  $('#posterArt').innerHTML = composeCover(state);
  $('#posterView').hidden = false;
  document.body.classList.add('poster-open');
  if (state.clean) {
    // Clean poster mode (for screenshots): no bar, pure black surround,
    // the finished poster alone in the frame.
    $('#posterBar').style.display = 'none';
    $('#posterView').style.background = '#000';
  }
}

function closePoster() {
  $('#posterView').hidden = true;
  document.body.classList.remove('poster-open');
}

function renderPoster() {
  if (!$('#posterView').hidden) $('#posterArt').innerHTML = composeCover(state);
}

// ---- export --------------------------------------------------------------
async function doExport() {
  setStatus('Exporting…');
  try {
    const res = await exportCover(state);
    window.__lastExport = res;
    setStatus(`Saved ${res.name} (${Math.round(res.bytes / 1024)} KB)`);
  } catch (err) {
    window.__lastExport = { ok: false, error: String(err) };
    setStatus(`Export failed: ${err.message}`);
  }
}

// ---- drag to reposition the selected photo --------------------------------
function bindStageDrag() {
  const stage = $('#stage');
  let dragging = false, lastX = 0, lastY = 0;
  stage.addEventListener('pointerdown', (ev) => {
    dragging = true; lastX = ev.clientX; lastY = ev.clientY;
    stage.setPointerCapture(ev.pointerId);
  });
  stage.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    const p = photoSlot();
    if (!p.src) return;
    p.x += (ev.clientX - lastX) * 1.2;
    p.y += (ev.clientY - lastY) * 1.2;
    lastX = ev.clientX; lastY = ev.clientY;
    render();
  });
  stage.addEventListener('pointerup', () => { dragging = false; });
  stage.addEventListener('pointercancel', () => { dragging = false; });
}

// ---- controls ------------------------------------------------------------
function buildControls() {
  const tplBox = $('#templateBox');
  TEMPLATE_NAMES.forEach((name, i) => {
    const b = document.createElement('button');
    b.textContent = `${i + 1} · ${name}`;
    b.dataset.template = String(i);
    b.addEventListener('click', () => { state.template = i; render(); renderPoster(); });
    tplBox.appendChild(b);
  });
  const lookBox = $('#lookBox');
  Object.keys(LOOKS).forEach((key) => {
    const b = document.createElement('button');
    b.textContent = LOOK_NAMES[Object.keys(LOOKS).indexOf(key)];
    b.dataset.look = key;
    b.addEventListener('click', () => { state.look = key; render(); renderPoster(); });
    lookBox.appendChild(b);
  });
  const aspectBox = $('#aspectBox');
  Object.keys(ASPECTS).forEach((key) => {
    const b = document.createElement('button');
    b.textContent = ASPECTS[key].label;
    b.dataset.aspect = key;
    b.addEventListener('click', () => { state.aspect = key; render(); renderPoster(); });
    aspectBox.appendChild(b);
  });
  const pAspectBox = $('#posterAspectBox');
  Object.keys(ASPECTS).forEach((key) => {
    const b = document.createElement('button');
    b.textContent = ASPECTS[key].label;
    b.dataset.paspect = key;
    b.addEventListener('click', () => { state.aspect = key; render(); renderPoster(); });
    pAspectBox.appendChild(b);
  });

  $('#fileA').addEventListener('change', (ev) => readPhotoFile(ev.target.files[0], 'A'));
  $('#fileB').addEventListener('change', (ev) => readPhotoFile(ev.target.files[0], 'B'));
  $('#sampleA').addEventListener('click', () => loadSampleInto('A'));
  $('#sampleB').addEventListener('click', () => loadSampleInto('B'));
  document.querySelectorAll('[data-photoslot]').forEach((b) =>
    b.addEventListener('click', () => { state.selectedPhoto = b.dataset.photoslot; syncPhotoPanel(); }));
  $('#useAinBoth').addEventListener('change', (ev) => { state.useAinBoth = ev.target.checked; render(); renderPoster(); });
  $('#photoZoom').addEventListener('input', (ev) => { photoSlot().zoom = Number(ev.target.value); render(); });
  $('#photoX').addEventListener('input', (ev) => { photoSlot().x = Number(ev.target.value); render(); });
  $('#photoY').addEventListener('input', (ev) => { photoSlot().y = Number(ev.target.value); render(); });
  $('#titleInput').addEventListener('input', (ev) => { state.title = ev.target.value || 'GRAND THEFT AUTO VI'; render(); renderPoster(); });
  $('#taglineInput').addEventListener('input', (ev) => { state.tagline = ev.target.value || 'LEONIDA'; render(); renderPoster(); });
  $('#gradeRange').addEventListener('input', (ev) => { state.grade = Number(ev.target.value); state.gtafy = true; render(); renderPoster(); });
  $('#gtafyToggle').addEventListener('change', (ev) => { state.gtafy = ev.target.checked; render(); renderPoster(); });
  $('#posterBtn').addEventListener('click', openPoster);
  $('#posterClose').addEventListener('click', closePoster);
  $('#posterView').addEventListener('click', (ev) => { if (ev.target.id === 'posterView') closePoster(); });
  document.querySelectorAll('[data-export]').forEach((b) =>
    b.addEventListener('click', async () => { state.aspect = b.dataset.export; render(); renderPoster(); await doExport(); }));
  // Keyboard shortcuts (round 2): 1–4 switch templates, G toggles the
  // GTA-fy grade, E exports the PNG, P opens the poster view, Esc goes back.
  document.addEventListener('keydown', (ev) => {
    const t = ev.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const k = ev.key.toLowerCase();
    if (k === 'escape') { closePoster(); return; }
    if (!$('#posterView').hidden) return;
    if (k >= '1' && k <= '4') { state.template = Number(k) - 1; render(); return; }
    if (k === 'g') { state.gtafy = !state.gtafy; $('#gtafyToggle').checked = state.gtafy; render(); renderPoster(); return; }
    if (k === 'e') { doExport(); return; }
    if (k === 'p') { openPoster(); }
  });

  bindStageDrag();
}

// ---- boot ----------------------------------------------------------------
function applyQuery() {
  const q = new URLSearchParams(location.search);
  const t = Number(q.get('t'));
  if (Number.isInteger(t) && t >= 0 && t < TEMPLATE_NAMES.length) state.template = t;
  if (q.get('look') && LOOKS[q.get('look')]) state.look = q.get('look');
  if (q.get('aspect') && ASPECTS[q.get('aspect')]) state.aspect = q.get('aspect');
  const g = Number(q.get('grade'));
  if (Number.isFinite(g)) state.grade = Math.max(0, Math.min(100, g));
  state.clean = q.get('clean') === '1';
  return q.get('poster') === '1';
}

async function boot() {
  buildControls();
  const wantPoster = applyQuery();
  setStatus('Loading sample photos…');
  const [a, b] = await Promise.all([loadSample(SAMPLES.A), loadSample(SAMPLES.B)]);
  state.photoA.src = a;
  state.photoB.src = b;
  render();
  if (wantPoster) openPoster();
  setStatus('Ready — pick a template, load your photo, export a cover.');
  window.__ready = true;
}

boot();
