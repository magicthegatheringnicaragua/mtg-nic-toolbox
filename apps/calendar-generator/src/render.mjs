// render.mjs
//
// Pure Canvas 2D composition for the calendar poster. This module only
// depends on a CanvasRenderingContext2D-shaped `ctx` (drawImage/fillRect/
// fillText/strokeText/measureText) and plain data - it does not touch the
// DOM, so it works both in a browser <canvas> and in a headless Node
// canvas implementation used for self-verification (both expose the same
// 2D context API).
//
// Fonts: a generic bold system font stack is used everywhere, with
// strokeText (black) under fillText (white) to get the thick
// white-fill/black-stroke "poster" look from the reference image. No
// custom/licensed web font is bundled in this tranche.

import { getWeekendGrid, isInMonth, dateKey, WEEKDAY_LABELS, SPANISH_MONTH_NAMES } from './grid.mjs';

export const CANVAS_WIDTH = 1600;
export const CANVAS_HEIGHT = 1236;

const FONT_STACK = '"Arial Black", system-ui, sans-serif';

const TITLE_AREA_HEIGHT = 170;
const HEADER_HEIGHT = 75;
const GRID_TOP = TITLE_AREA_HEIGHT + HEADER_HEIGHT;
const GRID_MARGIN_X = 24;
const GRID_BOTTOM_MARGIN = 16;
const COLUMN_COUNT = 3;

function outlinedText(ctx, text, x, y, { font, strokeWidth = 8, align = 'left', baseline = 'alphabetic' }) {
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = '#000000';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, x, y);
}

function wrapText(ctx, text, maxWidth, font) {
  ctx.font = font;
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} options
 * @param {number} options.year
 * @param {number} options.monthIndex - 0-based
 * @param {Map<string, {label: string, image: any}>} options.assignments
 *   Keyed by grid.dateKey(date). Presence of a key = the day is "set".
 *   `image` is a pre-loaded image-like object (HTMLImageElement or
 *   node-canvas Image) to draw for that day's cell.
 * @param {object} options.images
 * @param {any} options.images.background - full-bleed background/filler art
 * @param {any} options.images.flag - Nicaragua flag graphic
 */
export function renderCalendar(ctx, { year, monthIndex, assignments, images }) {
  const rows = getWeekendGrid(year, monthIndex);
  const rowCount = rows.length;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 1. Full-bleed continuous background/filler art behind everything,
  // including unset cells (matches the reference: unset Sabado cells show
  // the same background art bleeding through, not a blank cell).
  if (images.background) {
    ctx.drawImage(images.background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // 2. Title bar: "OCTUBRE 2026"
  const title = `${SPANISH_MONTH_NAMES[monthIndex]} ${year}`;
  outlinedText(ctx, title, GRID_MARGIN_X, 110, {
    font: `bold 92px ${FONT_STACK}`,
    strokeWidth: 10,
    align: 'left',
    baseline: 'alphabetic',
  });

  // 3. Nicaragua flag, top-right.
  if (images.flag) {
    const flagW = 340;
    const flagH = 180;
    ctx.drawImage(images.flag, CANVAS_WIDTH - flagW - GRID_MARGIN_X, 10, flagW, flagH);
  }

  // 4. Column headers (VIERNES / SABADO / DOMINGO)
  const gridWidth = CANVAS_WIDTH - GRID_MARGIN_X * 2;
  const columnWidth = gridWidth / COLUMN_COUNT;
  WEEKDAY_LABELS.forEach((label, i) => {
    const cx = GRID_MARGIN_X + columnWidth * i + columnWidth / 2;
    outlinedText(ctx, label, cx, TITLE_AREA_HEIGHT + 52, {
      font: `bold 46px ${FONT_STACK}`,
      strokeWidth: 7,
      align: 'center',
      baseline: 'alphabetic',
    });
  });

  // 5. Grid rows/cells.
  const gridHeight = CANVAS_HEIGHT - GRID_TOP - GRID_BOTTOM_MARGIN;
  const rowHeight = gridHeight / rowCount;
  const columns = ['friday', 'saturday', 'sunday'];

  rows.forEach((row, rowIndex) => {
    columns.forEach((column, colIndex) => {
      const date = row[column];
      const cellX = GRID_MARGIN_X + columnWidth * colIndex;
      const cellY = GRID_TOP + rowHeight * rowIndex;

      const key = dateKey(date);
      const assignment = assignments.get(key);

      if (assignment && assignment.image) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(cellX, cellY, columnWidth, rowHeight);
        ctx.clip();
        drawCover(ctx, assignment.image, cellX, cellY, columnWidth, rowHeight);
        ctx.restore();
      }

      // Grid border, drawn over every cell (set or unset) to keep the
      // table structure visible, matching the reference's faint lines
      // over the continuous background art on unset cells.
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 2;
      ctx.strokeRect(cellX, cellY, columnWidth, rowHeight);

      if (assignment) {
        // Date number, top-left of the cell.
        const dayNumber = String(date.getDate());
        outlinedText(ctx, dayNumber, cellX + 14, cellY + 54, {
          font: `bold 54px ${FONT_STACK}`,
          strokeWidth: 8,
          align: 'left',
          baseline: 'alphabetic',
        });

        // Label, wrapped to fit the cell, anchored near the bottom.
        const labelFont = `bold 34px ${FONT_STACK}`;
        const maxWidth = columnWidth - 28;
        const lines = wrapText(ctx, assignment.label || '', maxWidth, labelFont);
        const lineHeight = 40;
        const startY = cellY + rowHeight - 18 - (lines.length - 1) * lineHeight;
        lines.forEach((line, li) => {
          outlinedText(ctx, line, cellX + columnWidth / 2, startY + li * lineHeight, {
            font: labelFont,
            strokeWidth: 6,
            align: 'center',
            baseline: 'alphabetic',
          });
        });
      }
    });
  });
}

/**
 * Draws `image` into the rect (x, y, w, h) scaled to cover the full rect
 * (like CSS `background-size: cover`), cropping overflow, instead of the
 * default drawImage stretch-to-fit behavior.
 */
function drawCover(ctx, image, x, y, w, h) {
  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;
  if (!imgW || !imgH) {
    ctx.drawImage(image, x, y, w, h);
    return;
  }
  const scale = Math.max(w / imgW, h / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.drawImage(image, dx, dy, drawW, drawH);
}

/**
 * Builds the `assignments` Map expected by renderCalendar() from a plain
 * per-day selection map, resolving each entry's drawable image.
 *
 * @param {Map<string, {kind: 'catalog'|'custom', catalogId?: string, label: string}>} selections
 * @param {object} resolvedImages
 * @param {Map<string, any>} resolvedImages.catalogById
 * @param {any} resolvedImages.custom
 */
export function buildAssignments(selections, resolvedImages) {
  const assignments = new Map();
  for (const [key, selection] of selections.entries()) {
    const image =
      selection.kind === 'catalog'
        ? resolvedImages.catalogById.get(selection.catalogId)
        : resolvedImages.custom;
    assignments.set(key, { label: selection.label, image });
  }
  return assignments;
}

export { isInMonth };
