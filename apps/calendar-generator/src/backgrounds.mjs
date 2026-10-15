// backgrounds.mjs
//
// Selectable full-background gallery options. Each entry is either the
// existing procedural striped background (`image: null`, see
// render.mjs's drawStripedBackground()) or a repo-hosted image drawn
// full-bleed with a "cover" fit (see render.mjs's drawCover()).
//
// Adding a future gallery option is just one more entry here plus one
// image file under assets/backgrounds/ - no other code changes needed.

export const BACKGROUNDS = [
  { id: 'striped', name: 'Rayas Azules (default)', image: null },
  {
    id: 'echoverse-reveal',
    name: 'Echoverse',
    image: 'assets/backgrounds/echoverse-reveal.jpg',
  },
];

export const DEFAULT_BACKGROUND_ID = 'striped';

export function findBackground(id) {
  return BACKGROUNDS.find((entry) => entry.id === id) || null;
}
