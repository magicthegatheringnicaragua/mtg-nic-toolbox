// catalog.mjs
//
// Flat catalog of selectable formats/event types. Each entry is just
// "a thing with its own image" - there is no separate "format" vs.
// "event type" data model, matching the reference layout's mixed usage
// (e.g. "STORE CHAMPIONSHIP (PAUPER)" combines an event type and a format
// into one freely-editable label). Per-day label text defaults to the
// chosen entry's `name` but is always editable in the UI.
//
// Catalog entries are set-agnostic (id/name only) - the actual artwork is
// resolved per currently-selected MTG set via catalogImagePath() below (see
// sets.mjs). This keeps adding a new MTG set's art a pure data/asset
// change: a new entry in sets.mjs plus a new assets/images/<setId>/ folder
// with one PNG per catalog id, no catalog.mjs/app.mjs code changes needed.

export const CATALOG = [
  { id: 'moderno', name: 'Moderno' },
  { id: 'pauper', name: 'Pauper' },
  { id: 'duel', name: 'Duel' },
  { id: 'edh-fun', name: 'EDH Fun' },
  { id: 'store-championship', name: 'Store Championship' },
  { id: 'taller-novatos', name: 'Taller Novatos' },
  { id: 'commander-party', name: 'Commander Party' },
  { id: 'proximamente', name: 'Proximamente' },
  { id: 'standard', name: 'Standard' },
  { id: 'legacy', name: 'Legacy' },
  { id: 'draft', name: 'Draft' },
  { id: 'sealed', name: 'Sealed' },
];

// Generic image used for free-text custom events that are not in CATALOG.
// Not set-specific - shared across all sets.
export const CUSTOM_EVENT_IMAGE = 'assets/images/custom-event.png';

// Nicaragua flag graphic shown in the title bar. Not set-specific.
export const FLAG_IMAGE = 'assets/images/flag-nicaragua.png';

export function findCatalogEntry(id) {
  return CATALOG.find((entry) => entry.id === id) || null;
}

/**
 * Resolves the repo-hosted image path for a given catalog entry under a
 * given MTG set (see sets.mjs). e.g. catalogImagePath('reality-fracture',
 * 'moderno') -> 'assets/images/reality-fracture/moderno.png'.
 */
export function catalogImagePath(setId, catalogId) {
  return `assets/images/${setId}/${catalogId}.png`;
}
