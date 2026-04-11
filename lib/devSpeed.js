"use client";

// Dev-only time acceleration. Gated on ?speed=N in the URL.
// Monkey-patches Date.now() so all game timers (ticks, crafts, expeditions,
// hero rest, daily quests) advance N× faster. setInterval still fires on real
// wall-clock, but each tick dispatch sees a much larger elapsed delta.
//
// Usage:
//   http://localhost:3000/?speed=60     -> 1 real sec = 60 game sec
//   http://localhost:3000/?speed=3600   -> 1 real sec = 1 game hour
//
// WARNING: while active, saves will record a `lastOnline` timestamp that is
// AHEAD of real wall-clock time. If you then reload WITHOUT ?speed=, the
// TICK reducer's `delta = now - lastOnline` will be negative and the game
// will freeze until real time catches up. To recover, either:
//   - reload with ?speed=N again, or
//   - run `localStorage.clear()` in devtools to reset the save.

let DEV_SPEED = 1;

if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("speed");
  const parsed = raw ? parseFloat(raw) : NaN;
  if (Number.isFinite(parsed) && parsed > 1) {
    DEV_SPEED = parsed;
    const realNow = Date.now.bind(Date);
    const origin = realNow();
    Date.now = () => origin + (realNow() - origin) * DEV_SPEED;
    window.__DEV_SPEED__ = DEV_SPEED;
    // eslint-disable-next-line no-console
    console.warn(
      `%c[DEV SPEED ${DEV_SPEED}x]%c Time acceleration active. 1 real sec = ${DEV_SPEED} game sec. Saves will have future lastOnline — clear save or reload with ?speed= to recover.`,
      "background:#f97316;color:#1a1a1a;font-weight:bold;padding:2px 6px;border-radius:3px",
      "color:#f97316"
    );
  }
}

export function getDevSpeed() {
  return DEV_SPEED;
}
