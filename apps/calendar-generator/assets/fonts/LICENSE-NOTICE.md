# Font license notice: magic-the-gathering.ttf

**This font is NOT freely licensed.** It is used here only because the repo
owner was explicitly informed of its copyright/licensing status and chose
to proceed anyway, for a non-commercial, hobbyist community project.

## What the font is

`magic-the-gathering.ttf` is Mike Hind's 1998 "Magic:the Gathering" font - a
hand-drawn lookalike of the classic Magic: The Gathering logo lettering,
originally distributed through Mike Hind's "StickFonts" site. It is not an
official Wizards of the Coast asset.

## Embedded copyright (from the font file's own name table)

The TTF's embedded metadata reads, verbatim:

```
Copyright (c) Mike Hind,StickFonts, 1998. All rights reserved.
Magic:the Gathering
Regular
StickFonts
```

This is an explicit "all rights reserved" copyright notice, embedded by the
font's author.

## Licensing status

- There is no accompanying license file, EULA, or redistribution grant
  bundled with this font.
- The site distributing it labels it **"personal use"** only; it does not
  grant commercial use, redistribution, or sublicensing rights.
- It does not appear on any open-font-license registry (no OFL, no
  Apache/MIT-style grant, nothing comparable to a free/libre font license).

**Do not characterize this font as freely licensed, open-source, or
public domain. It is not.**

## Why it is used here anyway

The repository owner (the MTG Nicaragua community organizer) was told the
above facts directly - the "all rights reserved" copyright string, the
absence of a redistribution license, and the "personal use" labeling on the
distributing site - and chose to proceed with it anyway for this specific
project: a non-commercial, hobbyist calendar-generator tool used to produce
promotional graphics for a volunteer-run Magic: The Gathering community in
Nicaragua. No revenue is generated from this project or its output.

This is a deliberate, informed risk accepted by the repo owner, not a claim
that usage is legally clear. If the original author (Mike Hind) or a rights
holder objects, this font should be removed and the app should fall back to
the existing system font stack (`"Arial Black", system-ui, sans-serif`),
which `src/render.mjs` already uses as the fallback in the display font's
own font stack and as the sole font for date numbers and per-day labels.

## Known glyph limitation

The font only covers basic Latin letters (A-Z, a-z) and digits (0-9) -
confirmed via fontTools inspection of the font's glyph/cmap tables. It has
no `Ñ`, `ñ`, `Á`, `É`, `Í`, `Ó`, `Ú`, `¿`, or `¡` glyphs. For this reason it
is wired up (see `src/render.mjs`) only for the two fixed, always-accent-free
strings in the poster - the month/year title (e.g. "OCTUBRE 2026") and the
VIERNES/SABADO/DOMINGO column headers - and never for date numbers or
per-day event labels, since labels are free-text and can contain accented
Spanish characters that would render as missing-glyph ("tofu") boxes in
this font.
