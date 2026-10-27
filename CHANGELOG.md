# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `<bb-light-shafts>` (`BbLightShafts`): upright shafts of soft light drift
  sideways, after Tibix's "Crystal Parallax", with `shaft-colors`,
  `shaft-amount` and `speed`. Each shaft lies at its own depth: nearer ones
  are wider and brighter and drift faster. Their light adds to the
  background, so they show best on a dark one, and a `trail-opacity` below
  1 smears them as they drift.

### Changed

- Lines are never drawn thinner than two pixels of the screen. A thinner
  `ribbon-line-width`, `line-width` or particle size is drawn that wide and
  as much fainter, so it gives off the same light, and many thin lines side
  by side no longer break up into a grid of pixels.

## [2.0.0] - 2026-10-27

A major release: `<bb-contour-flow>` replaces `<bb-concentric-pulse>`. Its
attributes differ, so a page that uses `<bb-concentric-pulse>` needs a new
setup, which the Contour Flow stories show with live controls.

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

### Removed

- **Breaking:** `<bb-concentric-pulse>` (`BbConcentricPulse`). Use
  `<bb-contour-flow>` instead.

### Changed

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
