// catalog.mjs
//
// Flat catalog of selectable formats/event types. Each entry is just
// "a thing with its own image" - there is no separate "format" vs.
// "event type" data model, matching the reference layout's mixed usage
// (e.g. "STORE CHAMPIONSHIP (PAUPER)" combines an event type and a format
// into one freely-editable label). Per-day label text defaults to the
// chosen entry's `name` but is always editable in the UI.

export const CATALOG = [
  { id: 'moderno', name: 'Moderno', image: 'assets/images/moderno.png' },
  { id: 'pauper', name: 'Pauper', image: 'assets/images/pauper.png' },
  { id: 'duel', name: 'Duel', image: 'assets/images/duel.png' },
  { id: 'edh-fun', name: 'EDH Fun', image: 'assets/images/edh-fun.png' },
  {
    id: 'store-championship',
    name: 'Store Championship',
    image: 'assets/images/store-championship.png',
  },
  {
    id: 'taller-novatos',
    name: 'Taller Novatos',
    image: 'assets/images/taller-novatos.png',
  },
  {
    id: 'commander-party',
    name: 'Commander Party',
    image: 'assets/images/commander-party.png',
  },
  { id: 'proximamente', name: 'Proximamente', image: 'assets/images/proximamente.png' },
  { id: 'standard', name: 'Standard', image: 'assets/images/standard.png' },
  { id: 'legacy', name: 'Legacy', image: 'assets/images/legacy.png' },
  { id: 'draft', name: 'Draft', image: 'assets/images/draft.png' },
  { id: 'sealed', name: 'Sealed', image: 'assets/images/sealed.png' },
];

// Generic image used for free-text custom events that are not in CATALOG.
export const CUSTOM_EVENT_IMAGE = 'assets/images/custom-event.png';

// Continuous background/filler art that spans the whole poster; also what
// shows through on unset (unassigned) weekend days.
export const BACKGROUND_IMAGE = 'assets/images/background.png';

// Nicaragua flag graphic shown in the title bar.
export const FLAG_IMAGE = 'assets/images/flag-nicaragua.png';

export function findCatalogEntry(id) {
  return CATALOG.find((entry) => entry.id === id) || null;
}
