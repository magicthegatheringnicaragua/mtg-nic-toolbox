// grid.mjs
//
// Pure week-grid math for the calendar poster.
//
// The reference layout (docs/goals/calendar-generator/notes/reference-calendar-layout.png)
// only shows three weekday columns: VIERNES (Friday), SABADO (Saturday), DOMINGO (Sunday).
// Rows are weeks, anchored on the first Friday that falls inside the target month.
// Because each row always starts on an in-month Friday but runs 2 days forward,
// the Sunday (or, rarely, the Saturday/Sunday) of the final row can spill into the
// *next* calendar month (e.g. Oct 2026's last row ends on Sun Nov 1 2026). This module
// never spills backward into the previous month, because rows are anchored at the
// first in-month Friday.
//
// All date math uses the native Date constructor/arithmetic (new Date(year, month, day))
// so month/year rollover (e.g. day 32 of October becomes Nov 1) is handled automatically
// by the JS Date implementation - no manual overflow logic is needed.

export const WEEKDAY_LABELS = ['VIERNES', 'SABADO', 'DOMINGO'];

export const SPANISH_MONTH_NAMES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
];

const FRIDAY = 5; // JS Date#getDay(): 0 = Sunday ... 5 = Friday ... 6 = Saturday

/**
 * Returns the day-of-month (1-based, within `monthIndex`) of the first Friday
 * that falls in the given month/year.
 */
export function firstFridayOfMonth(year, monthIndex) {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const dow = firstOfMonth.getDay();
  const offset = (FRIDAY - dow + 7) % 7;
  return 1 + offset;
}

/**
 * Returns the number of days in `monthIndex` (0-based) for `year`.
 */
export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Computes the full weekend week-grid for a given month/year.
 *
 * @param {number} year - full year, e.g. 2026
 * @param {number} monthIndex - 0-based month index (0 = January, 9 = October)
 * @returns {Array<{ friday: Date, saturday: Date, sunday: Date }>}
 *   One row per week that has an in-month Friday. `saturday`/`sunday` may fall
 *   in the following month (spillover) but never in the previous month.
 */
export function getWeekendGrid(year, monthIndex) {
  const firstFriday = firstFridayOfMonth(year, monthIndex);
  const lastDay = daysInMonth(year, monthIndex);
  const rows = [];
  for (let d = firstFriday; d <= lastDay; d += 7) {
    const friday = new Date(year, monthIndex, d);
    const saturday = new Date(year, monthIndex, d + 1);
    const sunday = new Date(year, monthIndex, d + 2);
    rows.push({ friday, saturday, sunday });
  }
  return rows;
}

/**
 * True if `date` falls within `monthIndex`/`year` (used to flag spillover cells).
 */
export function isInMonth(date, year, monthIndex) {
  return date.getFullYear() === year && date.getMonth() === monthIndex;
}

/**
 * Formats a Date as a stable key for assignment lookups, e.g. "2026-10-02".
 * Uses the date's own (local) year/month/day so it is independent of which
 * target month the date is being rendered under (important for spillover days).
 */
export function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Flattens getWeekendGrid() into a single ordered list of
 * { date, column, rowIndex, inMonth } cells, column being one of
 * 'friday' | 'saturday' | 'sunday'. Convenient for both UI list rendering
 * and canvas composition, which iterate the same cells.
 */
export function getWeekendCells(year, monthIndex) {
  const rows = getWeekendGrid(year, monthIndex);
  const cells = [];
  rows.forEach((row, rowIndex) => {
    for (const column of ['friday', 'saturday', 'sunday']) {
      const date = row[column];
      cells.push({
        date,
        column,
        rowIndex,
        inMonth: isInMonth(date, year, monthIndex),
      });
    }
  });
  return cells;
}
