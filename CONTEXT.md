# beautiful-backgrounds

Animated backgrounds for web pages, each one a custom element that paints a
canvas.

## Language

**Background**:
One animated effect, used as a custom element (`<bb-…>`) that fills its element.
_Avoid_: component, effect, animation

**Example**:
A named set of attribute values for one **Background**, shown with live
controls in the Storybook.
_Avoid_: preset, variant, theme

**Trail**:
The fading of earlier frames, so moving things leave a streak. A trail
opacity of 0 means nothing ever fades. A clean trail fades all the way out;
any other leaves its faintest traces for good.
_Avoid_: fade, afterglow

**Terrain**:
An invisible landscape of smooth random hills that a background reads heights
from but never shows. Its size is the size of its largest hills.
_Avoid_: noise, heightmap, field

**Flow**:
The way downhill at a point of the **Terrain**, and how steep it is there.
Particles follow it.
_Avoid_: gradient, force, vector field

**Contour**:
A visible line that forms where the strokes of many particles following the
**Flow** pile up.
_Avoid_: path, isoline

**Pulse**:
Waves of light that run along the **Contours**, from the highest ground of
the **Terrain** to the lowest.
_Avoid_: blink, glow, breathing

**Ring**:
A thin, wavy line of light that slowly runs through its colors and keeps
giving off **Smoke**.
_Avoid_: circle, halo, flower

**Smoke**:
The light a **Ring** has given off. It drifts outward, swirls where its own
colors push it, and fades with the **Trail**.
_Avoid_: feedback, echo, glow

**Shaft**:
An upright band of soft light that fades out at its top and bottom and
drifts sideways.
_Avoid_: bar, crystal, beam, streak

**Depth**:
How far away a **Shaft** is. Nearer shafts are wider, brighter and drift
faster than far ones.
_Avoid_: layer, z, distance

**Slat**:
One of a row of even, parallel folds that a background is cut into, dark
along one edge and nearly white along the other, as strongly as its shade
says (none at all at 0). It shows the **Wash** beneath it, or, under a **Flip**,
the whole **Wash** squeezed to fit it (a slanted strip of it when the
slats lean).
_Avoid_: strip, stripe, bar, blind, pleat

**Flip**:
Every **Slat** shows the same whole **Wash**, and every other one shows it
turned upside down, so neighbors meet like tiles turned end over end.
_Avoid_: shift, mirror, alternate

**Wash**:
A few large, soft patches of color that slowly wander and blend into each
other beneath the **Slats**.
_Avoid_: color field, blobs

**Spark**:
A glowing particle of a swirl. It starts in a band through the middle,
follows the **Current**, fades in and out over its short life, and then
starts over in the band.
_Avoid_: particle, dot, firefly

**Current**:
The way a **Spark** steers at a point: an angle read from two **Terrains**
drifting apart, so it slowly changes instead of sliding. Unlike **Flow**,
it does not lead downhill.
_Avoid_: flow, field, wind

**Orb**:
A large, soft disc of color that drifts in a straight line and fades in and
out over its short life. It takes its color from where and when it starts,
so nearby orbs match and the colors slowly shift over time.
_Avoid_: circle, blob, bubble

**Star**:
A small light that circles the middle of a star trail, fades in and out
over its life and draws a short streak that fades with the **Trail**. When
the background changes size, its circle moves with the middle.
_Avoid_: particle, dot
