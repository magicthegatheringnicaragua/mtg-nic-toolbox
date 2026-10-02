// app.mjs
//
// DOM wiring: month/year picker, per-weekend-day selector UI (catalog entry
// or free-text custom label; label text always editable), canvas rendering,
// and PNG export/download.

import { getWeekendCells, dateKey, WEEKDAY_LABELS, SPANISH_MONTH_NAMES } from './grid.mjs';
import { CATALOG, CUSTOM_EVENT_IMAGE, BACKGROUND_IMAGE, FLAG_IMAGE, findCatalogEntry } from './catalog.mjs';
import { renderCalendar, buildAssignments, CANVAS_WIDTH, CANVAS_HEIGHT } from './render.mjs';

const DEFAULT_YEAR = 2026;
const DEFAULT_MONTH_INDEX = 9; // October - matches the reference demo month

const COLUMN_LABEL = { friday: 'VIERNES', saturday: 'SABADO', sunday: 'DOMINGO' };

/** selections: dateKey -> { kind: 'catalog' | 'custom', catalogId?: string, label: string } */
const selections = new Map();

let resolvedImages = null; // { catalogById: Map<id, Image>, custom: Image, background: Image, flag: Image }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function preloadImages() {
  const catalogEntries = await Promise.all(
    CATALOG.map(async (entry) => [entry.id, await loadImage(entry.image)]),
  );
  const [custom, background, flag] = await Promise.all([
    loadImage(CUSTOM_EVENT_IMAGE),
    loadImage(BACKGROUND_IMAGE),
    loadImage(FLAG_IMAGE),
  ]);
  return {
    catalogById: new Map(catalogEntries),
    custom,
    background,
    flag,
  };
}

function buildCatalogOptionsHtml() {
  return CATALOG.map((entry) => `<option value="${entry.id}">${entry.name}</option>`).join('');
}

function dayRowTemplate(cell) {
  const key = dateKey(cell.date);
  const dayNumber = cell.date.getDate();
  const spilloverNote = cell.inMonth ? '' : ' <span class="spillover">(mes siguiente)</span>';
  return `
    <div class="day-row" data-key="${key}">
      <div class="day-row-heading">
        <span class="day-column">${COLUMN_LABEL[cell.column]}</span>
        <span class="day-number">${dayNumber}</span>${spilloverNote}
      </div>
      <select class="day-select">
        <option value="">-- Sin asignar --</option>
        ${buildCatalogOptionsHtml()}
        <option value="custom">Personalizado...</option>
      </select>
      <input type="text" class="day-label" placeholder="Etiqueta" disabled />
    </div>
  `;
}

function renderDayRows(year, monthIndex) {
  const container = document.getElementById('days-list');
  const cells = getWeekendCells(year, monthIndex);
  container.innerHTML = cells.map(dayRowTemplate).join('');

  container.querySelectorAll('.day-row').forEach((rowEl) => {
    const key = rowEl.dataset.key;
    const select = rowEl.querySelector('.day-select');
    const labelInput = rowEl.querySelector('.day-label');

    select.addEventListener('change', () => {
      const value = select.value;
      if (!value) {
        selections.delete(key);
        labelInput.value = '';
        labelInput.disabled = true;
      } else if (value === 'custom') {
        labelInput.disabled = false;
        labelInput.value = labelInput.value || '';
        selections.set(key, { kind: 'custom', label: labelInput.value });
      } else {
        const entry = findCatalogEntry(value);
        labelInput.disabled = false;
        labelInput.value = entry.name;
        selections.set(key, { kind: 'catalog', catalogId: value, label: entry.name });
      }
      scheduleRender();
    });

    labelInput.addEventListener('input', () => {
      const current = selections.get(key);
      if (current) {
        current.label = labelInput.value;
        scheduleRender();
      }
    });
  });
}

function getCanvas() {
  return document.getElementById('calendar-canvas');
}

function renderNow() {
  if (!resolvedImages) return;
  const year = Number(document.getElementById('year-input').value) || DEFAULT_YEAR;
  const monthIndex = Number(document.getElementById('month-select').value);
  const canvas = getCanvas();
  const ctx = canvas.getContext('2d');
  const assignments = buildAssignments(selections, resolvedImages);
  renderCalendar(ctx, {
    year,
    monthIndex,
    assignments,
    images: { background: resolvedImages.background, flag: resolvedImages.flag },
  });
}

let renderScheduled = false;
function scheduleRender() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    renderNow();
  });
}

function buildMonthOptionsHtml() {
  return SPANISH_MONTH_NAMES.map((name, i) => `<option value="${i}">${name}</option>`).join('');
}

function regenerateForSelectedMonth() {
  const year = Number(document.getElementById('year-input').value) || DEFAULT_YEAR;
  const monthIndex = Number(document.getElementById('month-select').value);
  selections.clear();
  renderDayRows(year, monthIndex);
  scheduleRender();
}

function setupControls() {
  const monthSelect = document.getElementById('month-select');
  monthSelect.innerHTML = buildMonthOptionsHtml();
  monthSelect.value = String(DEFAULT_MONTH_INDEX);

  const yearInput = document.getElementById('year-input');
  yearInput.value = String(DEFAULT_YEAR);

  monthSelect.addEventListener('change', regenerateForSelectedMonth);
  yearInput.addEventListener('change', regenerateForSelectedMonth);

  const canvas = getCanvas();
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const downloadButton = document.getElementById('download-button');
  downloadButton.addEventListener('click', () => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('canvas.toBlob returned no blob (export failed).');
        return;
      }
      const url = URL.createObjectURL(blob);
      const year = yearInput.value;
      const monthIndex = Number(monthSelect.value);
      const monthName = SPANISH_MONTH_NAMES[monthIndex].toLowerCase();
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendario-${monthName}-${year}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, 'image/png');
  });
}

async function init() {
  setupControls();
  const status = document.getElementById('status');
  try {
    resolvedImages = await preloadImages();
    regenerateForSelectedMonth();
    status.textContent = '';
  } catch (err) {
    console.error(err);
    status.textContent = `Error cargando imagenes: ${err.message}`;
  }
}

init();
