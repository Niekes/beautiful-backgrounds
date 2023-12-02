# Beautiful Backgrounds

The "Beautiful Backgrounds" library offers a collection of customizable web components designed to enhance web pages with visually appealing animated backgrounds. Easy to integrate and use, these components are perfect for adding dynamic and interactive elements to your web applications.

[EXAMPLES][examples]

## Features

-   **Multiple Background Components**: A variety of background components, each offering unique visual effects.
-   **Customizable and Interactive**: Each component comes with customizable properties to suit different design needs.
-   **Responsive and Efficient**: Components are responsive to screen size changes and optimized for performance.

## Installation

```sh
npm i beautiful-backgrounds --save
```

In Deno with [`esm.sh`][esmsh]:

```js
import { BbStarTrail } from 'beautiful-backgrounds';
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
    import { BbStarTrail } from 'https://esm.sh/beautiful-backgrounds'
</script>
```

## Usage

```js
import { BbStarTrail } from 'beautiful-backgrounds';
```

```html
<bb-star-trail
    class="bb-star-trail"
    data-num-stars="567"
    data-star-size-min="0.1"
    data-star-size-max="1.5"
    data-star-speed-min="0.001"
    data-star-speed-max="0.003"
    data-star-color-hue-start="30"
    data-star-color-hue-end="75"
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
-   `data-star-color-hue-start`: Starting hue for star color.
-   `data-star-color-hue-end`: Ending hue for star color.
-   `data-radius-min`: Minimum radius for star orbit.
-   `data-radius-max`: Maximum radius for star orbit.
-   `data-star-lifespan-min`: Minimum lifespan of a star in milliseconds.
-   `data-star-lifespan-max`: Maximum lifespan of a star in milliseconds.
-   `data-width`: Width of the star trail component, remove to fit the size of the container
-   `data-height`: height of the star trail component, remove to fit the size of the container

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/A0A3QJPZ9)

<!-- Links -->

[esmsh]: https://esm.sh
[examples]: https://codepen.io/collection/aMPozo
