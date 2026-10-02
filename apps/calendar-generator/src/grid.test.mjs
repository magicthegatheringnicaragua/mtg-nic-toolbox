import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getWeekendGrid,
  getWeekendCells,
  firstFridayOfMonth,
  daysInMonth,
  isInMonth,
  dateKey,
} from './grid.mjs';

function iso(date) {
  return dateKey(date);
}

test('October 2026: exact reference date-grid (dates + spillover)', () => {
  const rows = getWeekendGrid(2026, 9); // monthIndex 9 = October

  assert.equal(rows.length, 5, 'October 2026 has 5 weekend rows');

  const expected = [
    { friday: '2026-10-02', saturday: '2026-10-03', sunday: '2026-10-04' },
    { friday: '2026-10-09', saturday: '2026-10-10', sunday: '2026-10-11' },
    { friday: '2026-10-16', saturday: '2026-10-17', sunday: '2026-10-18' },
    { friday: '2026-10-23', saturday: '2026-10-24', sunday: '2026-10-25' },
    { friday: '2026-10-30', saturday: '2026-10-31', sunday: '2026-11-01' },
  ];

  rows.forEach((row, i) => {
    assert.equal(iso(row.friday), expected[i].friday, `row ${i} friday`);
    assert.equal(iso(row.saturday), expected[i].saturday, `row ${i} saturday`);
    assert.equal(iso(row.sunday), expected[i].sunday, `row ${i} sunday`);
  });

  // The exact date set called out by the goal oracle.
  const allDates = rows.flatMap((r) => [r.friday, r.saturday, r.sunday]);
  const dayNumbers = allDates
    .filter((d) => isInMonth(d, 2026, 9))
    .map((d) => d.getDate())
    .sort((a, b) => a - b);
  assert.deepEqual(dayNumbers, [2, 3, 4, 9, 10, 11, 16, 17, 18, 23, 24, 25, 30, 31]);

  // Spillover: only the final row's Sunday leaves October, landing on Nov 1 2026.
  const lastRow = rows[rows.length - 1];
  assert.equal(isInMonth(lastRow.sunday, 2026, 9), false, 'last Sunday is spillover');
  assert.equal(lastRow.sunday.getFullYear(), 2026);
  assert.equal(lastRow.sunday.getMonth(), 10, 'spillover lands in November (monthIndex 10)');
  assert.equal(lastRow.sunday.getDate(), 1);

  // No other cell in the grid should be spillover.
  for (const row of rows.slice(0, -1)) {
    assert.ok(isInMonth(row.friday, 2026, 9));
    assert.ok(isInMonth(row.saturday, 2026, 9));
    assert.ok(isInMonth(row.sunday, 2026, 9));
  }
  assert.ok(isInMonth(lastRow.friday, 2026, 9));
  assert.ok(isInMonth(lastRow.saturday, 2026, 9));
});

test('October 2026: the goal-required highlighted dates appear in correct columns', () => {
  const cells = getWeekendCells(2026, 9);
  const byDate = new Map(cells.map((c) => [iso(c.date), c]));

  const expectedColumn = {
    '2026-10-02': 'friday',
    '2026-10-04': 'sunday',
    '2026-10-09': 'friday',
    '2026-10-11': 'sunday',
    '2026-10-16': 'friday',
    '2026-10-18': 'sunday',
    '2026-10-23': 'friday',
    '2026-10-24': 'saturday',
    '2026-10-25': 'sunday',
    '2026-10-30': 'friday',
    '2026-11-01': 'sunday',
  };

  for (const [key, column] of Object.entries(expectedColumn)) {
    const cell = byDate.get(key);
    assert.ok(cell, `expected a grid cell for ${key}`);
    assert.equal(cell.column, column, `${key} should be in the ${column} column`);
  }

  const nov1 = byDate.get('2026-11-01');
  assert.equal(nov1.inMonth, false, 'Nov 1 cell is flagged as spillover (not in October)');
  assert.equal(nov1.rowIndex, 4, 'Nov 1 spillover is in the final (5th) row');
});

test('firstFridayOfMonth / daysInMonth helpers for October 2026', () => {
  assert.equal(firstFridayOfMonth(2026, 9), 2);
  assert.equal(daysInMonth(2026, 9), 31);
});

test('getWeekendGrid works for an arbitrary month/year (no spillover case)', () => {
  // January 2027: Jan 1 2027 is a Friday, so the grid should start exactly on
  // day 1 and every row should stay inside January (no forward spillover needed
  // since the last Friday + 2 still fits inside the month in this case: check it).
  const rows = getWeekendGrid(2027, 0);
  assert.ok(rows.length >= 4);
  assert.equal(iso(rows[0].friday), '2027-01-01');
  // Every row's friday must land on an actual Friday.
  for (const row of rows) {
    assert.equal(row.friday.getDay(), 5);
    assert.equal(row.saturday.getDay(), 6);
    assert.equal(row.sunday.getDay(), 0);
  }
});

test('getWeekendGrid works for a month where the first Friday is late (forces spillover check)', () => {
  // February 2026: Feb 1 2026 is a Sunday, so the first Friday is Feb 6.
  const rows = getWeekendGrid(2026, 1);
  assert.equal(iso(rows[0].friday), '2026-02-06');
  const last = rows[rows.length - 1];
  // Confirm whichever month the final Sunday lands in, it is never *before*
  // the target month.
  assert.ok(
    last.sunday.getFullYear() > 2026 ||
      (last.sunday.getFullYear() === 2026 && last.sunday.getMonth() >= 1),
  );
});

test('dateKey formats using the date\'s own calendar date (stable across spillover)', () => {
  const d = new Date(2026, 10, 1); // Nov 1 2026
  assert.equal(dateKey(d), '2026-11-01');
});
