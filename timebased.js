// Temporary lifecycle test for integration.
function updateTime(manager) {
  let now = millis();

  for (let i = 0; i < manager.circles.length; i++) {
    let c = manager.circles[i];
    let rule = manager.sizeRules[c.sizeLevel];

    // Convert elapsed milliseconds into seconds.
    let elapsed = (now - c.stateStartedAt) / 1000;

    // Fully visible: wait until this circle is old enough.
    if (c.lifeState === "alive") {
      if (elapsed >= rule.lifeSeconds) {
        let changing = countChangingCircles(manager, c.sizeLevel);
        let limit = manager.getMaxChanging(c.sizeLevel);

        // Start fading only when a replacement slot is available.
        if (changing < limit) {
          c.lifeState = "fadingOut";
          c.stateStartedAt = now;
        }
      }
    }

    // Fade out, then generate a replacement.
    else if (c.lifeState === "fadingOut") {
      let progress = min(1, elapsed / rule.fadeOutSeconds);
      c.lifeAlpha = 1 - progress;

      if (progress >= 1) {
        manager.replaceCircle(i);
      }
    }

    // Fade in the replacement.
    else if (c.lifeState === "fadingIn") {
      let progress = min(1, elapsed / rule.fadeInSeconds);
      c.lifeAlpha = progress;

      // Start its visible lifetime after it has fully appeared.
      if (progress >= 1) {
        c.lifeAlpha = 1;
        c.lifeState = "alive";
        c.stateStartedAt = now;
      }
    }
  }
}

// Count circles currently fading out or fading in.
function countChangingCircles(manager, level) {
  let count = 0;

  for (let i = 0; i < manager.circles.length; i++) {
    let c = manager.circles[i];

    if (
      c.sizeLevel === level &&
      (c.lifeState === "fadingOut" || c.lifeState === "fadingIn")
    ) {
      count = count + 1;
    }
  }

  return count;
}