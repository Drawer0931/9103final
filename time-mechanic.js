// Time-Based Mechanic - first stage, deliberately not connected to sketch.js.
// Developed with ChatGPT/Codex assistance for structure, interpolation and checks.
// This module uses existing circles only; input, noise and drawing remain unchanged.

const timeMechanicStates = new WeakMap();
const timeMechanicBaselines = new WeakMap();

// Adaptations for 30-circle integration, NOT previously tested Experiment E values:
// proportional contraction reaches 30% at intensity 1.5; opacity uses the
// prototype's 60/170 amplitude as a multiplier of each circle's saved opacity.
const TIME_MECHANIC_DEFAULTS = Object.freeze({
  maximumContraction: 0.30,
  relativeOpacityAmplitude: 60 / 170
});

// Use elapsed milliseconds, never frameCount or an accumulated per-frame step.
// Explicit timestamps can be passed to both public functions for repeatable tests.
function timeMechanicNow() {
  return performance.now();
}

function timeMechanicSmoothstep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function timeMechanicLerp(start, end, progress) {
  return start + (end - start) * timeMechanicSmoothstep(progress);
}

// A continuous 35-second envelope, including the Recovery -> Awakening seam.
// These intensity holds and transitions reproduce the selected Experiment E.
function timeMechanicPhase(elapsedSeconds) {
  const cycleSeconds = ((elapsedSeconds % 35) + 35) % 35;
  if (cycleSeconds < 10) {
    return {
      name: "Awakening",
      cycleSeconds,
      intensity: cycleSeconds <= 6
        ? 0.2
        : timeMechanicLerp(0.2, 0.8, (cycleSeconds - 6) / 4)
    };
  }
  if (cycleSeconds < 25) {
    const intensity = cycleSeconds < 13
      ? timeMechanicLerp(0.8, 1.5, (cycleSeconds - 10) / 3)
      : 1.5;
    return { name: "Expansion", cycleSeconds, intensity };
  }
  return {
    name: "Recovery",
    cycleSeconds,
    intensity: cycleSeconds < 29
      ? timeMechanicLerp(1.5, 0.2, (cycleSeconds - 25) / 4)
      : 0.2
  };
}

// Call after initialiseCircles(seed, manager), when integration is authorised.
// Reinitialising restarts the clock but retains each object's original opacity.
// Reinitialise after replacing/reordering manager.circles; never create circles here.
function initialiseTimeMechanic(manager, options = {}, nowMs = timeMechanicNow()) {
  if (!manager || !Array.isArray(manager.circles)) {
    throw new TypeError("Time mechanic requires a manager with a circles array.");
  }
  const settings = { ...TIME_MECHANIC_DEFAULTS, ...options };
  for (const key of ["maximumContraction", "relativeOpacityAmplitude"]) {
    if (!Number.isFinite(settings[key]) || settings[key] < 0 || settings[key] > 1) {
      throw new RangeError(key + " must be a number between 0 and 1.");
    }
  }
  if (settings.maximumContraction > 0.30) {
    throw new RangeError("maximumContraction cannot exceed the 30% preview experiment limit.");
  }
  if (!Number.isFinite(nowMs)) {
    throw new TypeError("Time mechanic timestamp must be finite milliseconds.");
  }

  const periods = [3, 5, 8];
  const entries = manager.circles.map((circle, index) => {
    if (!timeMechanicBaselines.has(circle)) {
      timeMechanicBaselines.set(circle, circle.opacity);
    }
    const baselineOpacity = timeMechanicBaselines.get(circle);
    // Index assignment uses no random()/randomSeed()/noiseSeed() calls.
    // Thirty circles receive ten of each period; offsets avoid synchronised starts.
    const periodSeconds = periods[index % periods.length];
    const phaseOffset = ((index * 0.618033988749895) % 1) * Math.PI * 2;
    // Every third circle changes opacity: ten selected, twenty stay at baseline.
    // A block-based rule gives selected circles all three breathing periods.
    const opacitySelected = index % 3 === Math.floor(index / 3) % 3;
    circle.baselineOpacity = baselineOpacity;
    circle.breathingPeriodSeconds = periodSeconds;
    circle.timeOpacitySelected = opacitySelected;
    circle.displayRadius = circle.baseRadius;
    circle.displayOpacity = baselineOpacity;
    return { circle, baselineOpacity, periodSeconds, phaseOffset, opacitySelected };
  });

  timeMechanicStates.set(manager, { startMs: nowMs, settings, entries });
  return updateTimeMechanic(manager, nowMs);
}

// Later integration point: after input/noise updates and before drawing.
// Circle.display() currently ignores displayRadius/displayOpacity; no rendering
// methods are replaced here. The later renderer must explicitly read these fields.
function updateTimeMechanic(manager, nowMs = timeMechanicNow()) {
  const state = timeMechanicStates.get(manager);
  if (!state) {
    throw new Error("Call initialiseTimeMechanic(manager) before updating it.");
  }
  if (!Number.isFinite(nowMs)) {
    throw new TypeError("Time mechanic timestamp must be finite milliseconds.");
  }
  const elapsedSeconds = Math.max(0, (nowMs - state.startMs) / 1000);
  const phase = timeMechanicPhase(elapsedSeconds);

  for (const entry of state.entries) {
    const angle = Math.PI * 2 * elapsedSeconds / entry.periodSeconds + entry.phaseOffset;
    const sine = Math.sin(angle);
    const breath = (1 + sine) / 2;
    const normalisedIntensity = phase.intensity / 1.5;
    // Contraction-only breathing: [baseRadius * (1 - strength), baseRadius].
    // Do not change baseRadius: mouse bounds still reserve baseRadius + noise drift.
    // A previous symmetric +/- amplitude cannot retain its outward expansion here.
    const contraction = state.settings.maximumContraction * normalisedIntensity * breath;
    entry.circle.displayRadius = entry.circle.baseRadius * (1 - contraction);
    // Relative adaptation: baseline * [1 + (60/170) * (intensity/1.5) * sin].
    // At peak intensity this keeps the prototype's relative oscillation depth.
    // Clamp to p5's default alpha range; unselected circles retain exact baseline.
    const multiplier = 1 + state.settings.relativeOpacityAmplitude * normalisedIntensity * sine;
    // Always derive from the saved baseline, never the previous frame's result.
    entry.circle.displayOpacity = entry.opacitySelected
      ? Math.max(0, Math.min(255, entry.baselineOpacity * multiplier))
      : entry.baselineOpacity;
  }

  // Returned status lets a future UI inspect phases without another global clock.
  return { phase: phase.name, cycleSeconds: phase.cycleSeconds, intensity: phase.intensity };
}
