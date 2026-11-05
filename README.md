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

## Individual contribution — Zoey1777

I am responsible for the Time-Based Mechanic. My development progressed from an initial time module, through a breathing-effect preview, to the integrated circle lifecycle.

Development commits:

1. [Create time-mechanic.js — e580ccc](https://github.com/Drawer0931/9103final/commit/e580ccc): Created the initial Time-Based Mechanic module.
2. [Refine breathing strength and add standalone time preview — d023610](https://github.com/Drawer0931/9103final/commit/d023610): Refined the breathing effect and added a standalone preview for evaluation.
3. [Integrate staggered circle lifecycle with existing mechanics — cc408cc](https://github.com/Drawer0931/9103final/commit/cc408cc): Integrated staggered fade-out, replacement Circle objects and smooth fade-in with the group's existing mechanics.

The first two commits are preserved on `feature/time-mechanic-zoey` as development history. The final integrated implementation was merged into `main` through [PR #7](https://github.com/Drawer0931/9103final/pull/7).
