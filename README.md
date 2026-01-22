# Beautiful Backgrounds

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Npm][npm-badge]][npm]
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://niekes.github.io/beautiful-backgrounds/)
<a href="https://github.com/niekes/beautiful-backgrounds"><img src="https://img.shields.io/github/stars/niekes/beautiful-backgrounds" alt="stars" /></a>
<a href="https://github.com/sponsors/niekes"><img src="https://img.shields.io/badge/sponsor-30363D?logo=GitHub-Sponsors&logoColor=#EA4AAA" alt="sponsor this project" /></a>

The "Beautiful Backgrounds" library offers a collection of customizable web components designed to enhance web pages with visually appealing animated backgrounds. Easy to integrate and use, these components are perfect for adding dynamic and interactive elements to your web applications.

[EXAMPLES][examples]

## Features

- **Multiple Background Components**: A variety of background components, each offering unique visual effects.
- **Customizable and Interactive**: Each component comes with customizable properties to suit different design needs.
- **Responsive and Efficient**: Components are responsive to screen size changes and optimized for performance.

## Installation

Using [`npm`][npm]:

```sh
npm i beautiful-backgrounds --save
```

```js
import { BbStarTrail } from "beautiful-backgrounds";
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { BbStarTrail } from "https://esm.sh/beautiful-backgrounds";
</script>
```

## Usage

The best way to explore all the possibilities, interactive controls, and properties for each background is through our [Storybook](https://niekes.github.io/beautiful-backgrounds/). It provides a real-time environment to tweak parameters and see the results instantly.

---

### [Ambient Ribbon](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/ambientRibbon.ts)

A beautiful, flowing animation of multiple ribbons with deep control over wave physics, rotation, and color transitions. Perfect for high-end, elegant design themes.

- 📖 [View in Storybook](https://niekes.github.io/beautiful-backgrounds/?path=/story/backgrounds-ambient-ribbon--signature-flow)
- 🔗 [Source Code](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/ambientRibbon.ts)

### [Digital Rain](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/digitalRain.ts)

A classic matrix-style falling character effect. Highly customizable with character sets, font sizes, speeds, and complex color gradients. Perfect for a retro-hacker or high-tech aesthetic.

- 📖 [View in Storybook](https://niekes.github.io/beautiful-backgrounds/?path=/story/backgrounds-digital-rain--classic-matrix-rain)
- 🔗 [Source Code](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/digitalRain.ts)

### [Hexagon Wave](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/hexagonWave.ts)

A sleek, organic waving grid of hexagons (or other polygons). It features dynamic shading, lightness boosts, and wave physics that create a premium, rhythmic motion across the screen.

- 📖 [View in Storybook](https://niekes.github.io/beautiful-backgrounds/?path=/story/backgrounds-hexagon-wave--honeycomb-pulsar)
- 🔗 [Source Code](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/hexagonWave.ts)

### [Liquid Lines](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/liquidLines.ts)

A fluid, undulating animation of multiple lines with gradients and 3D depth effects. It offers extensive control over wave physics, line thickness, and color transitions, making it perfect for organic or "liquid" design themes.

- 📖 [View in Storybook](https://niekes.github.io/beautiful-backgrounds/?path=/story/backgrounds-liquid-lines--serpentine-flow)
- 🔗 [Source Code](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/liquidLines.ts)

### [Neon Rails](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/neonRails.ts)

Fast-moving particles that follow a geometric grid, creating long neon trails. It's ideal for "electric" or "cyberpunk" themes, offering deep control over particle lifespan, grid geometry, and trail opacity.

- 📖 [View in Storybook](https://niekes.github.io/beautiful-backgrounds/?path=/story/backgrounds-neon-rails--cyber-grid-network)
- 🔗 [Source Code](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/neonRails.ts)

### [Star Trail](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/startTrail.ts)

A beautiful celestial animation featuring orbiting stars with fading trails. You can adjust orbit radii, star sizes, and colors to create anything from a subtle night sky to a vibrant cosmic nebula.

- 📖 [View in Storybook](https://niekes.github.io/beautiful-backgrounds/?path=/story/backgrounds-star-trail--galactic-vortex)
- 🔗 [Source Code](https://github.com/niekes/beautiful-backgrounds/blob/main/src/components/startTrail.ts)

<!-- Links -->

[build-badge]: https://img.shields.io/github/actions/workflow/status/niekes/beautiful-backgrounds/main.yml
[build]: https://github.com/niekes/beautiful-backgrounds/actions
[coverage-badge]: https://img.shields.io/codecov/c/github/niekes/beautiful-backgrounds.svg
[coverage]: https://codecov.io/github/niekes/beautiful-backgrounds
[esmsh]: https://esm.sh
[examples]: https://niekes.github.io/beautiful-backgrounds/
[npm-badge]: https://img.shields.io/npm/v/beautiful-backgrounds
[npm]: https://www.npmjs.com/package/beautiful-backgrounds
