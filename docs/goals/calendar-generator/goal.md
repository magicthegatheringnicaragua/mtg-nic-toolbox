# Calendar Generator (mtg-nic-toolbox)

## Objective

Ship a working first app for the mtg-nic-toolbox: a browser tool that lets the
organizer pick a month, assign a Magic: The Gathering format (or a custom
event) to each Friday/Saturday/Sunday, and generate a downloadable poster-style
calendar image matching the reference layout, for the MTG community in
Nicaragua.

This is the first app in what will become a monorepo of small community apps.
Only this app's vertical slice is in scope for the current tranche.

## Original Request

> The goal is to have multiple small projects and apps that will be used by
> the Magic The Gathering community in Nicaragua. The first [app] will be an
> app where the users can generate the calendars for the monthly events. We
> want to follow the same structure as this image [reference calendar].
> The user should be able to select which format will be played for that
> specific day. Enter a custom format in case there's an event and get the
> image. Each format should have it's own image associated with it. To keep
> things simple we'll host the images in the repo and change them when
> needed. We want to have an image for custom events we can use.

Reference layout image preserved at:
`docs/goals/calendar-generator/notes/reference-calendar-layout.png`

## Intake Summary

- Input shape: `specific`
- Audience: Organizers/players in the Magic: The Gathering community in Nicaragua
- Authority: `requested`
- Proof type: `demo`
- Completion proof: Opening the app, generating a calendar for October 2026
  with formats assigned per the reference image, and downloading a PNG that
  visually reproduces the reference layout (title, Nicaragua flag, VIERNES /
  SABADO / DOMINGO columns, per-day format image + date + label, correct
  week-grid including adjacent-month spillover days).
- Goal oracle: Manual visual walkthrough/demo comparing a generated calendar
  against `notes/reference-calendar-layout.png`, plus a unit test asserting
  the October 2026 date grid matches the reference exactly (dates 2, 4, 9, 11,
  16, 18, 23, 24, 25, 30 in their correct Viernes/Sabado/Domingo cells, and
  Nov 1 spilling into the final Domingo row).
- Likely misfire: Building a generic full 7-day-per-week calendar grid instead
  of the actual reference structure (3 columns: Viernes/Sabado/Domingo only,
  rows = weeks, blank cells show filler background art); or building a backend
  service when a simple static client-side tool is sufficient; or missing that
  the last row can show a day number from the *next* month (Oct 30 week also
  contains Nov 1); or forgetting the custom-event image path.
- Blind spots considered:
  - Week-grid math: cells are grouped into weekly rows restricted to
    Fri/Sat/Sun; a row can show a date from the following/preceding month
    when that weekday falls outside the target month within the same week.
  - Unset days (no event) must render as filler/background art, not be
    hidden — see most Sabado cells in the reference.
  - "Format" and "event type" are not cleanly separable in the reference
    (e.g. "STORE CHAMPIONSHIP (PAUPER)" combines an event type and a format
    in one label). Resolution: keep one flat selectable catalog where every
    entry is just "a thing with its own image," and let the label text
    default to the selected entry's name but remain freely editable per day
    so combined labels like "Store Championship (Pauper)" are possible
    without a separate data model.
  - Output resolution should be reasonable for sharing on social media
    (match the reference image's rough aspect ratio/resolution).
- Existing plan facts: none (fresh build; repo is currently empty).

## Goal Oracle

`Generate the October 2026 calendar in the app, assign formats/custom events
per the reference image, download the resulting PNG, and visually confirm it
reproduces docs/goals/calendar-generator/notes/reference-calendar-layout.png's
structure (title bar + Nicaragua flag, 3 weekday columns, correct per-day
images/labels, correct week-grid math). A passing unit test for the date-grid
function covering October 2026 is required but not sufficient on its own —
the final audit must include the visual comparison.`

The PM must keep comparing task receipts to this oracle. A clean board or a
passing unit test alone is not enough — the goal finishes only when a final
Judge/PM audit maps receipts back to this oracle and records
`full_outcome_complete: true`.

## Goal Kind

`specific`

## Current Tranche

Enough for this tranche: a working, demoable first vertical slice of the
calendar generator app, scaffolded as `apps/calendar-generator/` in a
monorepo-structured repo, with:

- The initial format/event catalog (flat list, each with its own image):
  Moderno, Pauper, Duel, EDH Fun, Store Championship, Taller Novatos,
  Commander Party, Proximamente, Standard, Legacy, Draft, Sealed — plus a
  generic "custom event" image for free-text entries outside this list.
- Placeholder images per catalog entry (real art will be swapped in later by
  replacing files in the repo — no need to source final art now).
- A month/year picker and a per-day (Fri/Sat/Sun only) selector: pick a
  catalog entry or type a custom label; label text editable regardless of
  source.
- Correct week-grid computation (including adjacent-month spillover days) for
  any month/year, verified against October 2026 as the known-good case.
- Client-side composition (e.g. Canvas) of the full poster image matching the
  reference structure, with a download/export button.
- A lightweight automated check for the date-grid logic plus a final visual
  demo/comparison against the reference image.

Not in scope for this tranche: other future toolbox apps, real/final artwork,
hosting/deployment, authentication, persistence/save-load of past calendars.

## Non-Negotiable Constraints

- No backend/database required — static, client-side app only.
- Images are hosted as files inside the repo and swapped manually; do not
  build an upload/admin pipeline.
- Repo is a monorepo from day one: this app lives under
  `apps/calendar-generator/`, structured so future toolbox apps can be added
  as siblings without restructuring.
- UI/output text stays in Spanish, matching the reference (month names,
  VIERNES/SABADO/DOMINGO, etc.) and includes the Nicaragua flag graphic.
- Keep the stack simple (plain HTML/CSS/JS acceptable; avoid introducing a
  framework/build pipeline unless Scout/Judge find a concrete need).

## Stop Rule

Stop only when a final audit proves the full current-tranche outcome is
complete per the Goal Oracle above (unit test + visual demo comparison).

Do not stop after planning, discovery, or Judge selection — a safe Worker
task should be activated. Do not stop after the unit test passes alone; the
visual demo comparison is also required before `full_outcome_complete: true`.

## Slice Sizing

Safe means bounded, explicit, verified, and reversible. It does not mean tiny.

A good task is the largest safe useful slice. The first Worker task should
aim to deliver the whole working vertical slice (scaffold + catalog +
placeholders + picker UI + grid math + canvas rendering + export), not a
sequence of tiny wrapper tasks, unless Judge finds a concrete reason to split
(e.g. isolating the date-grid algorithm behind its own reviewed/tested task
because it is the highest-risk logic).

## Board Health

The PM owns board health. If the board looks stale, misleading, offline, or
inconsistent, run the bundled checker:

```bash
node <skill-path>/scripts/check-goal-state.mjs docs/goals/calendar-generator
```

## Canonical Board

Machine truth lives at:

`docs/goals/calendar-generator/state.yaml`

If this charter and `state.yaml` disagree, `state.yaml` wins for task status,
active task, receipts, verification freshness, and completion truth.

## Run Command

```text
Codex:      /goal Follow docs/goals/calendar-generator/goal.md.
Claude Code: /goalbuddy Follow docs/goals/calendar-generator/goal.md.
```

## PM Loop

On every `/goal` continuation:

1. Read this charter, and follow the GoalBuddy execution contract
   (`references/goal-execution.md` in the goal-prep skill) when available.
2. Read `state.yaml`.
3. Run the bundled GoalBuddy update checker when available and mention a
   newer version without blocking.
4. Re-check the intake: original request, input shape, authority, proof,
   blind spots, existing plan facts, and likely misfire.
5. Work only on the active board task.
6. Assign Scout, Judge, Worker, or PM according to the task.
7. Write a compact task receipt.
8. Update the board.
9. If safe local work remains, choose the next largest reversible Worker
   package and continue unless blocked.
10. If a problem, suggestion, or follow-up should become a repo artifact,
    create an approved issue/PR or ask the operator whether to create one.
11. Review at phase, risk, rejected-verification, ambiguity, or
    final-completion boundaries; do not review every small Worker by habit.
12. Before ending the host turn, run
    `node <skill-path>/scripts/check-can-stop.mjs docs/goals/calendar-generator`.
    A nonzero result means safe work remains and the PM must continue.
    Finish only when this gate passes and a Judge/PM audit receipt maps
    receipts and verification back to the Goal Oracle with
    `full_outcome_complete: true`.

Issue and PR handoffs are supporting artifacts. `state.yaml` remains
authoritative, and every external artifact decision must be recorded in a
task receipt.
