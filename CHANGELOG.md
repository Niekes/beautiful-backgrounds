# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `<bb-fluid-morph>`: organic shapes morph smoothly between two silhouettes,
  with `speed`, `variation`, `stagger` and `colors`. A negative `speed` plays
  the morph backwards.

## [2.4.0] - 2026-11-23

A new background, `<bb-drifting-orbs>`, and tilted light shafts.

### Added

- `<bb-drifting-orbs>` (`BbDriftingOrbs`): large, soft orbs of color drift,
  fade in and out and slowly shift through their colors, all blurred
  together, with `orb-colors`, `orb-amount`, `orb-size`, `orb-blur` and
  `speed`. Based on "Shift" from Ambient Canvas Backgrounds by Sean Free
  (Codrops).
- `<bb-light-shafts>`: `shaft-angle` leans the shafts from upright, in
  degrees, clockwise. A negative `speed` drifts them the other way.

### Fixed

- `<bb-star-trail>` and `<bb-neon-rails>`: the first particles no longer
  all fade in together; they start at a random point in their life.
- `<bb-glow-swirl>`: no longer stops animating for good after being sized
  to zero.

### Changed

- New examples for Silk Waves (Ultraviolet, Lagoon) and Light Shafts
  (Meteor Shower), and Star Trail leads with Neon Vortex.
- Storybook lists the backgrounds alphabetically.

## [2.3.1] - 2026-11-23

`<bb-star-trail>` resizes without streaks.

### Fixed

- `<bb-star-trail>`: after a resize, every star briefly drew a long line
  across the canvas. The stars now move with the new middle without a
  streak.

### Changed

- The README links to the CodePen collection.

## [2.3.0] - 2026-11-22

A new background, `<bb-glow-swirl>`.

### Added

- `<bb-glow-swirl>` (`BbGlowSwirl`): glowing sparks swirl out of a band
  through the middle, steered by a slowly changing current, with
  `swirl-colors`, `particle-amount`, `particle-size`, `spread`, `turns`,
  `glow` and `speed`. It starts each frame clean; a lower `trail-opacity`
  leaves streaks. Based on "Swirl" from Ambient Canvas Backgrounds by Sean
  Free (Codrops).

## [2.2.1] - 2026-11-22

Faster backgrounds: less work per frame, and none while off screen.

### Changed

- Every background pauses while it is scrolled out of view, as it already
  did while the page is hidden.
- Every background draws at most 2 canvas pixels per CSS px, so on screens
  with a higher pixel ratio it draws fewer pixels. `<bb-gradient-slats>`,
  `<bb-light-shafts>`, `<bb-silk-waves>` and `<bb-smoke-ring>`, which are
  soft and look the same with fewer pixels, draw 1 per CSS px.
- `<bb-gradient-slats>` keeps the parts of a frame that do not change and
  reuses them, and `<bb-silk-waves>` no longer paints the same area twice.

## [2.2.0] - 2026-11-22

`<bb-gradient-slats>` can now look like ribbed glass: flat panels that each
show the same wash, every other one upside down.

### Added

- `<bb-gradient-slats>` `slat-flip`: every slat shows the whole wash
  squeezed to fit it, every other one turned upside down, instead of its
  own part of the wash. Lying slats keep the wash the right way up; at
  slanted angles each slat shows a slanted strip of it. Off by default.
- `<bb-gradient-slats>` `slat-shade`: how strongly each slat is shaded dark
  to white, from 0 (flat) to 1 (as before, the default).
- Two Gradient Slats examples that use them, Frosted Glass and Orchid.

## [2.1.0] - 2026-11-21

A new background, `<bb-gradient-slats>`, and a fix for `<bb-silk-waves>`
when it starts with no width.

### Added

- `<bb-gradient-slats>` (`BbGradientSlats`): a slowly moving wash of colors
  seen through a row of even slats, each dark along one edge and nearly
  white along the other, with `wash-colors`, `slat-amount`, `slat-angle` and
  `speed`. It paints over its background itself, so it has no trail.

### Fixed

- `<bb-silk-waves>` keeps animating when it starts at zero width, for
  example inside a hidden or not-yet-laid-out container. The first frame
  used to throw and stop the animation for good.

## [2.0.0] - 2026-10-27

A major release: `<bb-contour-flow>` replaces `<bb-concentric-pulse>`. Its
attributes differ, so a page that uses `<bb-concentric-pulse>` needs a new
setup, which the Contour Flow stories show with live controls. It also
brings three more backgrounds, and trails and thin lines that no longer
break up into pixels.

### Added

- `<bb-contour-flow>` (`BbContourFlow`): particles flow downhill across an
  invisible terrain, and their faint lines pile up into topographic contour
  lines, with `particle-amount`, `particle-life`, `flow-speed`,
  `terrain-size`, `line-colors`, `line-opacity`, `pulse-strength` and
  `pulse-speed`. The `line-colors` run from the lowest ground to the
  highest, so the colors flow along the lines, and waves of light run
  downhill. Particles start over somewhere new at the end of their life and
  old lines fade, so the picture never fills up.
- `<bb-smoke-ring>` (`BbSmokeRing`): a wavy ring of light gives off smoke
  that drifts outward and swirls where its own colors push it, after Vanta's
  Halo but without WebGL, with `ring-colors`, `ring-size`, `ring-wobble` and
  `speed`. The ring runs through its `ring-colors`, and its light adds to
  the background, so it shows best on a dark one.
- `<bb-light-shafts>` (`BbLightShafts`): upright shafts of soft light drift
  sideways, after Tibix's "Crystal Parallax", with `shaft-colors`,
  `shaft-amount` and `speed`. Each shaft lies at its own depth: nearer ones
  are wider and brighter and drift faster. Their light adds to the
  background, so they show best on a dark one, and a `trail-opacity` below
  1 smears them as they drift.
- `<bb-silk-waves>` (`BbSilkWaves`): a sea of rolling waves in one color,
  seen from above its front and shaded from its troughs to its crests, after
  Vanta's Waves but without WebGL, with `silk-color`, `swell`, `sheen`,
  `reach` and `speed`.

### Removed

- **Breaking:** `<bb-concentric-pulse>` (`BbConcentricPulse`). Use
  `<bb-contour-flow>` instead.

### Changed

- Trails fade all the way out. A low `trail-opacity` used to round the
  faintest traces back to themselves, so they stayed for good and piled up
  into jagged, pixelated remains, most of all on high-density screens. Every
  background now fades a scattered share of its pixels at a time instead,
  as `<bb-contour-flow>` already did, and shows its background from CSS
  behind the canvas. `clean-trail="false"` brings the old trails back.
  `<bb-smoke-ring>`, `<bb-light-shafts>` and `<bb-silk-waves>` keep it off,
  as they paint over their background on the canvas themselves.
- Lines are never drawn thinner than two pixels of the screen. A thinner
  `ribbon-line-width`, `line-width` or particle size is drawn that wide and
  as much fainter, so it gives off the same light, and many thin lines side
  by side no longer break up into a grid of pixels.
- The bundle no longer includes d3-color: the browser parses the colors in
  `hex-colors` and `line-colors`, so newer formats such as `oklch()` work
  too. Both builds are minified, and `bb.es.js` shrinks from 105 kB to
  42 kB.
- The package no longer ships the declaration files of the stories or the
  Vite logo.

### Fixed

- The first frame after a background starts, or after its tab shows again,
  no longer runs backwards in time.
- Gray colors in `hex-colors` and `line-colors` no longer produce an
  invalid color.
- `HTMLElementTagNameMap` knows `bb-ambient-ribbon`.

## [1.1.0] - 2026-10-24

### Added

- `<bb-concentric-pulse>` (`BbConcentricPulse`): concentric rings that pulse
  in a staggered wave while their colors flow outwards, with `ring-count`,
  `ring-spacing`, `ring-amplitude`, `pulse-speed` and `ring-colors`.

### Fixed

- The background gradient spans the canvas exactly at every `bg-angle`.
  Before, it was sized to the canvas diagonal at every angle, so its ends fell
  outside the visible area.
- Speeds, story names and source code links in the Storybook examples.

### Changed

- The tooling moved to Storybook 10.6, Vite 8, Vitest 5 and TypeScript 7.
  The `lit ^3` peer range is unchanged.

## [1.0.0] - 2026-01-22

Initial official release.

## [0.0.5] - 2023-12-02
