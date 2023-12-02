# Beautiful Backgrounds

[![Build][build-badge]][build]

The "Beautiful Backgrounds" library offers a collection of customizable web components designed to enhance web pages with visually appealing animated backgrounds. Easy to integrate and use, these components are perfect for adding dynamic and interactive elements to your web applications.

[EXAMPLES][examples]

## Features

-   **Multiple Background Components**: A variety of background components, each offering unique visual effects.
-   **Customizable and Interactive**: Each component comes with customizable properties to suit different design needs.
-   **Responsive and Efficient**: Components are responsive to screen size changes and optimized for performance.

## Installation

Using [`npm`][npm]:

```sh
npm i beautiful-backgrounds --save
```

```js
import { BbStarTrail } from 'beautiful-backgrounds';
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
    import { BbStarTrail } from 'https://esm.sh/beautiful-backgrounds';
</script>
```

## Usage

### Star Trail

```html
<bb-star-trail
    data-num-stars="567"
    data-star-size-min="0.1"
    data-star-size-max="1.5"
    data-star-speed-min="0.001"
    data-star-speed-max="0.003"
    data-star-color-hue-start="30"
    data-star-color-hue-end="75"
    data-star-color-saturation-start="90"
    data-star-color-saturation-end="90"
    data-star-color-lightness-start="40"
    data-star-color-lightness-end="60"
    data-orbit-radius-min="10"
    data-orbit-radius-max="300"
    data-star-lifespan-min="1000"
    data-star-lifespan-max="50000"
    data-width="500"
    data-height="500"
></bb-star-trail>
```

#### Attributes for bb-star-trail

-   `data-num-stars`: Number of stars to be rendered.
-   `data-star-size-min`: Minimum size of a star.
-   `data-star-size-max`: Maximum size of a star.
-   `data-star-speed-min`: Minimum speed of a star.
-   `data-star-speed-max`: Maximum speed of a star.
-   `data-star-color-hue-start`: Starting hue for star color. Should be a value between 0 and 360.
-   `data-star-color-hue-end`: Ending hue for star color. Should be a value between 0 and 360.
-   `data-star-color-saturation-start`: Specifies the starting color saturation for star color. Should be a value between 0 and 100.
-   `data-star-color-saturation-start`: Specifies the ending color saturation for star color. Should be a value between 0 and 100.
-   `data-star-color-lightness-start`: Specifies the starting color lightness for star color. Should be a value between 0 and 100.
-   `data-star-color-lightness-start`: Specifies the ending color lightness for star color. Should be a value between 0 and 100.
-   `data-radius-min`: Minimum radius for star orbit.
-   `data-radius-max`: Maximum radius for star orbit.
-   `data-star-lifespan-min`: Minimum lifespan of a star in milliseconds.
-   `data-star-lifespan-max`: Maximum lifespan of a star in milliseconds.
-   `data-width`: Width of the star trail component, remove to fit the size of the container
-   `data-height`: height of the star trail component, remove to fit the size of the container
-   `data-background-color`: Background color of the canvas element

### Digital Rain

```html
<bb-digital-rain
    data-characteras="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    data-font-size="16"
    data-font-color-hue-start="60"
    data-font-color-hue-end="150"
    ata-font-color-saturation-start="90"
    ata-font-color-saturation-end="90"
    ata-font-color-lightness-start="40"
    ata-font-color-lightness-end="60"
    data-speed="1"
></bb-star-trail>
```

#### Attributes for bb-digital-rain

-   `data-characters`: Sets the characters for the digital rain effect.
-   `data-font-size`: Defines the font size of the falling characters.
-   `data-font-color-hue-start`: Specifies the starting color hue for the rain. Should be a value between 0 and 360.
-   `data-font-color-hue-end`: Sets the ending color hue for the rain. Should be a value between 0 and 360.
-   `data-font-color-saturation-start`: Specifies the starting color saturation for the rain. Should be a value between 0 and 100.
-   `data-font-color-saturation-start`: Specifies the ending color saturation for the rain. Should be a value between 0 and 100.
-   `data-font-color-lightness-start`: Specifies the starting color lightness for the rain. Should be a value between 0 and 100.
-   `data-font-color-lightness-start`: Specifies the ending color lightness for the rain. Should be a value between 0 and 100.
-   `data-speed`: Controls the falling speed of the digital rain.
-   `data-background-color`: Background color of the canvas element

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/A0A3QJPZ9)

<!-- Links -->

[build-badge]: https://github.com/niekes/beautiful-backgrounds/workflows/main/badge.svg
[build]: https://github.com/niekes/beautiful-backgrounds/actions
[esmsh]: https://esm.sh
[npm]: https://www.npmjs.com/package/beautiful-backgrounds
[examples]: https://codepen.io/collection/aMPozo
