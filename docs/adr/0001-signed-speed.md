# Signed speed for Fluid Morph

`<bb-fluid-morph>` takes a single signed `speed`: `1` is the normal pace, `2`
twice as fast, `0` still, and negative values run the morph backwards. The sign
drives one clock, so reverse playback is an exact time-mirror — the staggered
starts undo in reverse order too. We chose this over clamping negatives to zero
(the majority convention in the other backgrounds) because light shafts already
established that a negative speed means the other way, and over rejecting
negatives or merely mirroring the shapes because neither gives a usable reverse
playback. A cyclic morph needs this decision recorded: unlike spatial drift, its
phase wraps, and the modulo has to be normalised before it can run backwards.

_Considered options_: clamp negatives to zero, reject negatives, reverse the
shape pair without reversing time.
