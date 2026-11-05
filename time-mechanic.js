// Time lifecycle integration. Developed with ChatGPT/Codex assistance.
// Use the same millis() clock as Circle, with explicit timestamps for testing.
const lifecycleClocks = new WeakMap();

function timeSmoothstep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function updateTimeMechanic(manager, now = millis()) {
  let clock = lifecycleClocks.get(manager);
  if (!clock || clock.circles !== manager.circles) {
    clock = { circles: manager.circles, startedAt: now, nextFadeAt: now };
    lifecycleClocks.set(manager, clock);
    const counts = manager.sizeRules.map(() => 0);
    for (const c of manager.circles) {
      const rule = manager.sizeRules[c.sizeLevel];
      // Spread initial deaths across each size group; first change after 4s.
      c.stateStartedAt = now;
      c.fadeDueAt = now + 4000 + c.sizeLevel * 700 +
        counts[c.sizeLevel]++ * rule.lifeSeconds * 1000 / rule.count;
    }
  }

  // Retain the feature branch's continuous 35-second intensity envelope.
  const seconds = Math.max(0, (now - clock.startedAt) / 1000);
  const t = seconds % 35;
  const intensity = t < 6 ? 0.2 : t < 10 ? 0.2 + 0.6 * timeSmoothstep((t - 6) / 4)
    : t < 13 ? 0.8 + 0.7 * timeSmoothstep((t - 10) / 3)
    : t < 25 ? 1.5 : t < 29 ? 1.5 - 1.3 * timeSmoothstep((t - 25) / 4) : 0.2;
  manager.timeNoiseMultiplier = 0.8 + 0.4 * intensity / 1.5;

  const stepMs = Math.max(0, now - (clock.lastAt ?? now));
  clock.lastAt = now;
  let changing = manager.circles.filter(c => c.lifeState !== "alive").length;
  const limit = Math.max(1, Math.floor(manager.circles.length * 0.2));
  for (let i = 0; i < manager.circles.length; i++) {
    const c = manager.circles[i];
    const rule = manager.sizeRules[c.sizeLevel];
    const held = typeof heldCircle !== "undefined" && heldCircle === c;
    if (c.lifeState === "alive") {
      const groupChanging = manager.circles.filter(other =>
        other.sizeLevel === c.sizeLevel && other.lifeState !== "alive").length;
      if (!held && now >= c.fadeDueAt && now >= clock.nextFadeAt &&
          changing < limit && groupChanging < manager.getMaxChanging(c.sizeLevel)) {
        c.lifeState = "fadingOut";
        c.stateStartedAt = now;
        clock.nextFadeAt = now + 1200;
        changing++;
      }
    } else if (c.lifeState === "fadingOut") {
      // Keep a grabbed object visible and valid until it is released.
      if (held) {
        c.stateStartedAt += stepMs;
        continue;
      }
      c.lifeAlpha = 1 - timeSmoothstep((now - c.stateStartedAt) / (rule.fadeOutSeconds * 1000));
      if (c.lifeAlpha === 0) {
        c.lifeState = "invisible";
        c.stateStartedAt = now;
      }
    } else if (c.lifeState === "invisible") {
      // Keep a zero-alpha rendered frame before constructing a different object.
      if (!held && now > c.stateStartedAt) {
        const replacement = manager.replaceCircle(i);
        replacement.currentOpacity = 0;
        replacement.stateStartedAt = now;
      }
    } else if (c.lifeState === "fadingIn") {
      c.lifeAlpha = timeSmoothstep((now - c.stateStartedAt) / (rule.fadeInSeconds * 1000));
      if (c.lifeAlpha === 1) {
        c.lifeState = "alive";
        c.stateStartedAt = now;
        c.fadeDueAt = now + rule.lifeSeconds * 1000;
        changing--;
      }
    }
  }
}
