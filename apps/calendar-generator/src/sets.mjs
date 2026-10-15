// sets.mjs
//
// Selectable MTG set list. Each catalog format (Moderno, Pauper, etc.)
// resolves its artwork from the currently-selected set's image folder
// (see catalog.mjs's catalogImagePath()) rather than one fixed global
// image. Adding a future set when a new MTG set releases is just one more
// entry here plus a matching assets/images/<id>/ folder with the 12
// catalog images - no other code changes needed.

export const SETS = [{ id: 'reality-fracture', name: 'Reality Fracture' }];

export const DEFAULT_SET_ID = 'reality-fracture';

export function findSet(id) {
  return SETS.find((s) => s.id === id) || null;
}
