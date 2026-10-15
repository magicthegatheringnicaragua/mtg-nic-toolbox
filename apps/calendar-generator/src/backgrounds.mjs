// backgrounds.mjs
//
// Selectable full-background gallery options. Each entry is a repo-hosted
// image drawn full-bleed with a "cover" fit (see render.mjs's drawCover()).
// (An entry with `image: null` falls back to render.mjs's
// drawStripedBackground(), which is kept as defensive code but is no
// longer reachable via any entry below.)
//
// Adding a future gallery option is just one more entry here plus one
// image file under assets/backgrounds/ - no other code changes needed.

export const BACKGROUNDS = [
  {
    id: 'echoverse-reveal',
    name: 'Echoverse',
    image: 'assets/backgrounds/echoverse-reveal.jpg',
  },
];

export const DEFAULT_BACKGROUND_ID = 'echoverse-reveal';

export function findBackground(id) {
  return BACKGROUNDS.find((entry) => entry.id === id) || null;
}
