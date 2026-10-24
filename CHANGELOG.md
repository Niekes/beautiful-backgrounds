# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
