// Standalone preview developed with ChatGPT/Codex assistance.
// Reuse the team's classes and mechanics without changing their entry point.
let previewManager;
let canvasScale = 1; // Required by shared initialization, noise and mouse input.
let previewPhaseLabels;
let previewIntensityLabel;

function setup() {
  // Match sketch.js exactly; no extra resize or input handlers are installed.
  createCanvas(windowWidth, windowHeight);
  canvasScale = min(width / 1280, height / 720);

  previewManager = new CircleManager();
  initialiseCircles(1, previewManager);
  initialiseTimeMechanic(previewManager);

  previewPhaseLabels = document.querySelectorAll("#time-preview-status [data-phase]");
  previewIntensityLabel = document.getElementById("time-preview-intensity");
}

function draw() {
  background(16, 18, 27);

  // Preserve mouse changes to base positions, then apply shared noise drift.
  updateInput(previewManager);
  updateNoise(previewManager);
  const timeStatus = updateTimeMechanic(previewManager);

  // Read calculated display values only; Circle.display() remains untouched.
  push();
  noStroke();
  for (const c of previewManager.circles) {
    fill(c.red, c.green, c.blue, c.displayOpacity);
    circle(c.x, c.y, c.displayRadius * 2);
  }
  pop();

  updatePreviewIndicator(timeStatus);
}

function updatePreviewIndicator(status) {
  for (const label of previewPhaseLabels) {
    if (label.dataset.phase === status.phase) {
      label.setAttribute("aria-current", "step");
    } else {
      label.removeAttribute("aria-current");
    }
  }
  previewIntensityLabel.textContent =
    "Intensity " + status.intensity.toFixed(2) +
    " | " + status.cycleSeconds.toFixed(1) + " / 35 s";
}
