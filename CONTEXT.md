# beautiful-backgrounds

Animated backgrounds for web pages, each one a custom element that paints a
canvas.

## Language

**Background**:
One animated effect, used as a custom element (`<bb-…>`) that fills its element.
_Avoid_: component, effect, animation

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
