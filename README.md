# 9103final

Inspiration

Techniques

Mechanic ownership

AL acknowledgment

External references

Interaction instructions


## Time lifecycle integration

Open index.html using Live Server. No audio is required for the lifecycle.
The first large circle begins fading after about 4 seconds, reaches zero at
about 10 seconds, and is replaced by a new Circle at a new position. Its
replacement fades in over 3 seconds. Other groups start at staggered times.
Subsequent alive durations and fade durations use CircleManager.sizeRules.
At most six circles change at once, with per-size limits and a 1.2-second
spacing between fade starts. Grabbed circles pause fading until released.
The existing 35-second Time intensity envelope now gently modulates Perlin
movement/colour speed (0.8–1.2x), without changing base radii or opacity.

Validation: `node lifecycle-test.cjs` simulates four minutes, checks all six
groups replace real objects only at zero alpha, fixed counts, concurrency,
and composition reset. Browser/audio/input visual review is still required
before merging: watch 60 seconds, upload/play/pause audio, test Tab grab/push,
M blend modes and R reset. Implementation assisted by ChatGPT/Codex.
