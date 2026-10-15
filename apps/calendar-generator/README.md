# Calendar Generator

Static, client-side app (no backend, no build step) that lets an organizer
pick a month/year, assign a Magic: The Gathering format (or a free-text
custom event) to each Friday/Saturday/Sunday, and export a PNG poster
matching the reference layout used by the MTG Nicaragua community.

## Running locally

Canvas image export requires the app be served over `http(s)://`, not opened
directly via `file://` (browsers can block/taint canvas reads of
locally-loaded images under the `file://` origin). From this directory:

```bash
python3 -m http.server 8080
# or: npx serve .
```

Then open `http://localhost:8080/` in a browser.

## Structure

- `index.html` / `style.css` - page shell and styling.
- `src/grid.mjs` - pure week-grid math (Fri/Sat/Sun rows, adjacent-month
  spillover), covered by `src/grid.test.mjs` (`node --test src/grid.test.mjs`).
- `src/catalog.mjs` - the flat 12-entry format/event catalog plus the
  generic custom-event image and shared background/flag asset paths.
- `src/backgrounds.mjs` - the selectable full-background gallery list (the
  "Fondo" picker). Each entry is `{id, name, image}`; `image: null` means
  "use the existing procedural `drawStripedBackground()`", otherwise it is
  a repo-hosted image path drawn full-bleed with a "cover" fit. Adding a
  future gallery option is just one more entry here plus one image file
  under `assets/backgrounds/`.
- `src/render.mjs` - pure Canvas 2D composition (background, title bar,
  flag, column headers, per-day cells). Only depends on a
  CanvasRenderingContext2D-shaped `ctx`, so it is reusable outside the
  browser (e.g. with a Node canvas polyfill) for headless verification.
- `src/app.mjs` - DOM wiring: month/year/background pickers, per-day
  selector UI, preloading images (catalog art plus any image-backed
  background gallery options), scheduling re-renders, and the PNG download
  button (`canvas.toBlob` + `URL.createObjectURL` + `<a download>`).
- `assets/images/` - catalog art (Magic: The Gathering *Reality Fracture*
  card art) for each catalog entry, the generic custom-event image, the
  continuous background/filler art, and the top-right MTG Nicaragua logo
  graphic (`flag-nicaragua.png`). Filenames and the catalog's `image` paths
  stay in sync. See `assets/images/ATTRIBUTION.md` for card-art sourcing and
  the Wizards of the Coast Fan Content Policy notice.
- `assets/backgrounds/` - image-backed full-background gallery options
  listed in `src/backgrounds.mjs` (currently just `echoverse-reveal.jpg`).
  See `assets/backgrounds/ATTRIBUTION.md` for sourcing.
- `assets/fonts/beleren-bold.ttf` - the real Beleren2016-Bold typeface (the
  actual font used in Magic's branding), used only for the poster's
  month/year title and VIERNES/SABADO/DOMINGO column headers (see
  `src/render.mjs`). Copyright Wizards of the Coast, no formal redistribution
  license; it is used here by the repo owner's explicit, informed choice for
  this non-commercial community project. See `assets/fonts/LICENSE-NOTICE.md`
  before reusing or redistributing it elsewhere.

## Catalog

One flat, selectable list - formats and event types are not modeled
separately. Picking an entry pre-fills the day's label with the entry's
name, but the label is always editable, so combined labels like
"Store Championship (Pauper)" are possible without a separate data model.
Choosing "Personalizado..." starts from a blank free-text label and uses the
generic custom-event image.

## Known limitation (this tranche)

Changing the month/year selector resets per-day assignments for simplicity;
there is no save/load of past calendars (out of scope for this tranche per
`docs/goals/calendar-generator/goal.md`).
