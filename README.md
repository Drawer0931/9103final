# IDEA 9103 FINAL PROJECT

## Inspiration

Our project is inspired by Wassily Kandinsky’s Several Circles (1926). Its contrasting circle sizes, layered overlaps and dark background suggest a floating, almost cosmic composition. These features shaped our use of a clear size hierarchy, translucent colours and overlapping circles. The simple geometric forms also provided an accessible starting point for recreating and extending the artwork in p5.js.

Kandinsky’s interest in the relationship between colour and music inspired our audio-responsive approach. We translate changes in music into halo brightness, rhythmic flickering and screen-edge glows, bringing a sense of musical rhythm to the composition.

We developed these ideas into a living, interactive artwork. Smooth drifting and gradual colour changes continually reshape the relationships between circles, while fading and regeneration allow the composition to evolve. Viewers can upload music, push or drag circles, and explore different visual effects and arrangements. These interactions invite viewers to participate in the artwork while retaining the original painting’s emphasis on colour, geometry and balance.

## Interaction instruction

Open index.html using Live Server. The circles automatically drift, change colour, fade out and regenerate. These animations work without music.

| Action | Result |
| --- | --- |
| Click **Upload Audio** | Select an audio file from your computer. |
| Click **Play/Pause** | Play or pause the uploaded music. During playback, halos and flickering respond to the audio, while detected peaks trigger glows around the screen edges. |
| Move the mouse near circles in **Push mode** | Push circles away from the cursor. The closer the cursor is to a circle’s edge, the stronger the push. This is the default mode. |
| Press **Tab** | Switch between **Push mode** and **Grab mode**. |
| Click and hold a circle in **Grab mode**, then move the mouse | Drag the selected circle. Release the mouse button to let go. Held circles are protected from fading out and being replaced. |
| Press **M** | Cycle through **Normal → Difference → Grayscale → Invert** visual effects. |
| Press **R** | Generate a new composition using a new random seed. Each size category retains its fixed circle count, and colours are selected from the shared palette. |

## Techniques

Our project uses p5.js and p5.sound to create an interactive interpretation of Several Circles. Each mechanic has a separate script, while the shared Circle class stores individual properties and CircleManager manages the collection and visual rules. setup() creates the canvas and initial composition, and draw() coordinates the mechanics and renders the artwork.

Perlin noise and randomness: random(), randomSeed() and noiseSeed() generate repeatable starting compositions with fixed quantities across six size categories and a shared colour palette. noise() and map() produce shared and individual drift, alongside gradual RGB changes within controlled ranges. Different speeds based on circle size create variation while preserving visual balance. Layered circles form a subtle background whose outward spread also changes with noise.

Audio: createFileInput() and loadSound() allow viewers to upload music. p5.FFT, p5.Amplitude and p5.PeakDetect analyse frequency energy, volume and peaks. Volume controls the brightness of blurred halos, while low- and high-frequency energy control flickering in larger and smaller circles. sin() and deltaTime produce continuous opacity oscillations, and detected peaks trigger brief glows around the screen edges. These mappings translate musical changes into visual responses.

Time-based animation: millis() drives a repeating 35-second cycle that adjusts noise animation speed. A lifecycle system uses smooth interpolation to fade circles out and introduce replacements. Size-based lifespans, staggered timings and limits on simultaneous transitions prevent too many circles disappearing together. Replacements retain their size category and base colour, maintaining the composition’s structure.

User input: dist() and map() calculate mouse proximity and pushing strength. Dragging uses mouse offsets and updates base positions so interaction works alongside noise movement. Keyboard events switch interaction modes, generate new seeded compositions, and apply blendMode() or filter() effects. Held circles are protected from removal during interaction.

Our key decisions were to share circle data across mechanics, preserve the size hierarchy and palette, and combine effects through separate properties. Lifecycle opacity also controls audio effects so halos fade with their circles. We reduced background layers and used pixelDensity(1) to lower rendering costs, with an FPS display to monitor performance.

## Mechanic ownership

| Mechanic | Author | Branch | Main Script File |
| --- | --- | --- | --- |
| Audio | Zihan Wo | ziwo-audio | audio_analyzer.js |
| Time-based | Zoey Wo | feature/time-mechanic-zoey | time-mechanic.js |
| Perlin noise & randomness | Bowen Wei | Bowen-noise | noise.js |
| User input | Yiwen Zhang | input-mechanic | input-mechanic.js |

## Audio

__Visual effect based on audio file__

User can upload an audio file by clicking the "Upload Audio" button at the 
bottom of the screen. After the audio file is completely uploaded, user can 
click on the "Play/Pause" button to play or stop the music in the audio file. 
There will also be some visual effect on the screen. The audioAnalyzer will 
extract the volume and energy in the high and low frequency band. The audioAnalyzer 
will also use PeakDetect() to detect drumbeat of the music. For the visual effect, 
the brightness of the halo is based on the volume. The small circles will flicker 
based on the energy in high frequency band. The higher the energy, the faster 
the circles flicker. The big circles will flicker based on the energy in low 
frequency band. The higher the energy, the slower the circles flicker. When a 
drumbeat is detected, there will be a white edge glow flash briefly at the edge 
of the screen.

__Contributions__

audio_analyzer.js -- Creating p5.FFT(), p5.Amplitude() and p5.PeakDetect(), 
detecting energy, volume and drumbeats respectively.

circle_manager.js -- Data handling for "volume, lowEnergy, highEnergy" in 
displayCircles() function.

circle.js -- Drawing halos in the display() function. Implementing the flicker 
effect, which is the updateFlicker() function.

sketch.js -- Creating the "file input" and 2 buttons in the setup() function. 
Creating handleFile() function which is used for check the file type, wait for 
the file uploads completely, and then create an audioAnalyzer. Creating the 
playPause() function which controls the playing of the audio. Calling analyzeVolume() 
and analyzeFrequencyBand() which extract the data and detect the drumbeat in 
the draw() function. Implementing the white edge glow afterwards. And finally 
calling the displayCircles(), which act as a starting point for further processing 
of volume and energy data and realising the visual effects of halo and circle 
flicker.

__General flow of the code__

p5.FFT(), p5.Amplitude() and p5.PeakDetect() is created in AudioAnalyzer class 
to detect energy, volume and drumbeats respectively. The functions that retrieve 
these values will be called in sketch.js. White edge glow will be implemented 
directly in sketch.js, because this is a screen effect and it has nothing to 
do with circles. The white edge glow is achieved by drawing a semi-transparent 
white rectangle with blurred edges along each of the screen’s four edges. Volume 
and energy will be given to the displayCircles() function in CircleManager class. 
CircleManager class contains a list storing every existing circle. And 
displayCircles() will handle the values of ‘haloBrightness’ and ‘flickerFrequency’ 
for each circle. Each circle will implement the halo and flicker effects 
individually using the `display()` method in the `Circle` class. The Halo effect 
is achieved by adding two concentric circles outside each circle, with gradually 
increasing radii, lower transparency and blurred edges. The higher the volume, the 
less transparent these two circles become, making the halo appear brighter.The 
flickering effect is achieved by periodically altering the transparency of the 
circle. The circle’s transparency is calculated by converting the frequency into 
a period using a sine function, and then map to a number between maximum opacity 
and half of the maximum opacity.

## Time-based

__Contributions__

I am responsible for the Time-Based Mechanic. My development progressed from an initial time module, through a breathing-effect preview, to the integrated circle lifecycle.

__Development commits:__

1. [Create time-mechanic.js — e580ccc](https://github.com/Drawer0931/9103final/commit/e580ccc): Created the initial Time-Based Mechanic module.
2. [Refine breathing strength and add standalone time preview — d023610](https://github.com/Drawer0931/9103final/commit/d023610): Refined the breathing effect and added a standalone preview for evaluation.
3. [Integrate staggered circle lifecycle with existing mechanics — cc408cc](https://github.com/Drawer0931/9103final/commit/cc408cc): Integrated staggered fade-out, replacement Circle objects and smooth fade-in with the group's existing mechanics.

The first two commits are preserved on `feature/time-mechanic-zoey` as development history. The final integrated implementation was merged into `main` through [PR #7](https://github.com/Drawer0931/9103final/pull/7).

## Perlin Noise & Randomness

My mechanic introduces randomly generated compositions, smooth drifting, continuous colour transitions, and a soft, changing background. Shared movement gives the composition a unified flow, while each circle’s independent drift changes its position and overlaps with other circles, adding visual interest. Colours change smoothly within a limited range around each circle’s base colour, keeping the artwork varied while maintaining a consistent palette. Random seeds allow viewers to explore different compositions and reproduce a particular starting arrangement.

__Contributions__

- __[noise.js](./noise.js) — Random Composition and Noise Effects__
I use random(), randomSeed(), and noiseSeed() to generate reproducible starting compositions. Positions, colours, and opacity are randomly assigned while preserving the required number of circles in each size category. Perlin noise drives both group and individual drifting, as well as smooth changes to each circle’s RGB values. I also draw a softly edged background around the circles and use noise to vary how far it extends outward. A separate generation function creates replacement circles with new positions and noise starting points while preserving their original size category and base colour.

- __[circle_manager.js](./circle_manager.js) — Shared Visual Rules and Circle Management__
I define six size categories and their circle counts, a shared palette of ten colours, six colour-change speed levels, and three drift speed levels. This file also stores lifecycle parameters for the time-based mechanic. It manages the collection of circles and provides replacement limits for each size category, together with an interface for replacing individual circles. These shared rules allow the other mechanics to work with a consistent visual structure.

- __[circle.js](./circle.js) — Basic Structure of Each Circle__
I establish the shared Circle class, which stores each circle’s base and current positions, radius, base and displayed colours, opacity, and independent noise starting points. It also provides the basic drawing method. Properties such as the size category, lifecycle state, and lifeAlpha support fading controlled by the time-based mechanic and provide a foundation for other team members to extend each circle’s behaviour.

- __[sketch.js](./sketch.js) — Canvas Setup and Mechanic Integration__
I set up the full-window canvas, dark background, and a shared scaling factor so that circle sizes and drift ranges adapt to different window dimensions. I connect the initial composition generation, noise updates, and background drawing to the main sketch, allowing my mechanic to work alongside the other team members’ mechanics on the same collection of circles.

__Development commits:__

1. [Noise V1 – f5711af](https://github.com/Drawer0931/9103final/commit/f5711afc23126f6934ff15f0cba1cd8b427b09c6): Established the base composition with a shared colour palette, six circle size categories with fixed counts, and independent Perlin-noise drifting.

2. [Noise V3 – 06da8b0](https://github.com/Drawer0931/9103final/commit/06da8b0b8c26fdd26dc02a975339afbbc62d547d): Added shared drift to unify the composition, noise-driven colour transitions, and different colour-changing and drifting speeds based on circle size. Introduced a soft background around the circles.

3. [Noise V4 – 572f4a1](https://github.com/Drawer0931/9103final/commit/572f4a10effbf12541737fc516392b189a1991ff): Reduced background layers from 40 to 20 and set pixelDensity(1) to reduce rendering workload. Set a target frame rate of 60 FPS and added an FPS counter to monitor performance.

4. [Noise V5 – d3db22d](https://github.com/Drawer0931/9103final/commit/d3db22d0ff886d47fc934fc1fb21c51588fdbac4): Added lifecycle settings for each circle size category and replacement generation at random positions, preserving each replaced circle’s size category and base colour. Added a temporary time-based module to test fading and regeneration together.

## User Input

Start here

## AI acknowledgment

We used ChatGPT to refine the wording in README.md, check spelling and grammar, and improve clarity and accuracy while preserving our original meaning.

We also used ChatGPT to review and optimise our code, helping identify and resolve conflicts and errors when integrating team members’ contributions. AI-generated code sections are marked with comments in the relevant files.

## External references

- **Kandinsky artwork reference:** [Several Circles (1926)](https://www.guggenheim.org/artwork/1992), used as the visual reference for the circle size hierarchy, colour palette, overlapping forms and dark background.

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
