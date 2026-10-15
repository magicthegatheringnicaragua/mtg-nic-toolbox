# Font license notice: beleren-bold.ttf

**This font is NOT freely licensed.** It is used here only because the repo
owner was explicitly informed of its copyright/licensing status and chose
to proceed anyway, for a non-commercial, hobbyist community project.

> Supersedes an earlier version of this notice, which covered a different
> placeholder display font (`magic-the-gathering.ttf`, Mike Hind's 1998
> "StickFonts" lookalike). That font has been removed from this repo and
> replaced with the real Beleren2016-Bold, described below.

## What the font is

`beleren-bold.ttf` is **Beleren2016-Bold**, the actual bold display
typeface used in modern Magic: The Gathering branding, created by Wizards
of the Coast's font vendor (Delve Fonts / Delve Withrington). This is the
genuine Wizards typeface, not a third-party lookalike.

This specific file was sourced from the
[Saeris/typeface-beleren-bold](https://github.com/Saeris/typeface-beleren-bold)
GitHub repo, which packages the font (extracted from Wizards' own website)
as an npm-installable CSS webfont. **Only that repo's own wrapper code
(the CSS/JS/package.json it adds around the font) is covered by its MIT
license. The font file itself is not MIT-licensed** - the Saeris repo's own
README states explicitly: *"This is not an official or authorized
library! ... published for non-commercial use"*, and that the underlying
font remains Wizards of the Coast's copyrighted property.

## Embedded copyright (from the font file's own name table)

The TTF's embedded metadata reads, verbatim:

```
Copyright (c) 2014-2016 Wizards of the Coast, a Hasbro Subsidiary. All rights reserved.
Beleren2016-Bold
Beleren is a trademark of Wizards of the Coast.
Delve Fonts / Delve Withrington
http://www.magicthegathering.com
http://www.delvefonts.com
```

This is an explicit "all rights reserved" copyright notice, embedded by
Wizards of the Coast (via their font vendor), not a free/open license.

## Licensing status

- There is no license grant from Wizards of the Coast for redistribution
  or use of this font outside their own branding.
- The GitHub repo this file was sourced from (Saeris/typeface-beleren-bold)
  only licenses its own CSS wrapper code (MIT); its README is explicit that
  the library itself is unofficial/unauthorized and intended for
  non-commercial use, and that the font is not theirs to license.
- It does not appear on any open-font-license registry (no OFL, no
  Apache/MIT-style grant, nothing comparable to a free/libre font license).

**Do not characterize this font as freely licensed, open-source, or
public domain. It is not.**

## Why it is used here anyway

The repository owner (the MTG Nicaragua community organizer) was told the
above facts directly - the "all rights reserved" Wizards of the Coast
copyright, the lack of any redistribution license, and the Saeris repo's
own "not an official or authorized library ... non-commercial use" caveat
- and chose to proceed with it anyway for this specific project: a
non-commercial, hobbyist calendar-generator tool used to produce
promotional graphics for a volunteer-run Magic: The Gathering community in
Nicaragua. No revenue is generated from this project or its output. This
is the same risk category the owner already accepted for the prior
display font.

This is a deliberate, informed risk accepted by the repo owner, not a
claim that usage is legally clear. If Wizards of the Coast or another
rights holder objects, this font should be removed and the app should fall
back to the existing system font stack (`"Arial Black", system-ui,
sans-serif`), which `src/render.mjs` already uses as the fallback in the
display font's own font stack and as the sole font for date numbers and
per-day labels.

## Glyph coverage (for context, not currently used for this)

Unlike the prior placeholder font, Beleren2016-Bold has full Spanish
glyph coverage (confirmed via fontTools inspection: `Ñ`, `ñ`, accented
vowels, `¿`, `¡` are all present). Despite that, it is kept scoped (see
`src/render.mjs`) to only the two fixed strings in the poster - the
month/year title (e.g. "OCTUBRE 2026") and the VIERNES/SABADO/DOMINGO
column headers - and not used for date numbers or per-day event labels.
Expanding its use to labels/date numbers is a separate decision the repo
owner has not made yet, independent of glyph coverage.
