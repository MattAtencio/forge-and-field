# Task 22: Forge Juice — Craft Sparkle + Gold Coin Fly

## Objective
Add two pieces of game feel in the Forge screen:
1. A sparkle/glow burst when a craft completes and is collected
2. Gold coins flying from a sold item toward the top resource bar when the player sells

Both respect `prefers-reduced-motion`. Both stay inside `ForgeScreen.jsx` so they do not conflict with parallel work.

## Context Files (READ to understand)
- `components/ForgeScreen.jsx` — holds `handleCollect`, `handleSell`, `handleBatchSell`. Line numbers approximate; search for these handlers.
- `components/ForgeScreen.module.css` — existing styles
- `components/sprites/Sprite.jsx` — sprite rendering, a `"gold"` sprite exists
- `app/globals.css` — global keyframes live here for reuse

The Sprite component supports an `animate` prop that maps to a CSS class in `Sprite.module.css`. You do NOT need to modify Sprite for this spec — build isolated animation layers in ForgeScreen.

## What To Build

### 1. Craft Sparkle
When `handleCollect(craft)` runs, trigger a short (~900ms) sparkle effect on the craft slot the player just collected from:
- A radial glow pulse (orange→transparent) behind the slot
- Three to five tiny sparkle particles (dots or 4-pointed star SVG shapes) flung outward with `transform: translate()` and fading opacity
- Uses `forge ember` palette — `#f97316`, `#fbbf24`, `#fef3c7`

Implementation sketch:
- Add component-local state `const [sparkleAt, setSparkleAt] = useState(null);` holding the craft slot id mid-animation
- In `handleCollect`: set `sparkleAt = craft.id`, then `setTimeout(() => setSparkleAt(null), 900)`
- In render, overlay a `<div className={styles.sparkleLayer}>` absolutely-positioned on the collecting slot when its id === sparkleAt
- Particles are pure CSS, 4–5 `<span>` children with `animation` using staggered `animation-delay`

### 2. Gold Coin Fly (on sell)
When `handleSell(item)` or `handleBatchSell()` runs, fly one gold-coin sprite from the click origin toward the gold counter in the top bar:
- Use the existing `"gold"` sprite at size 16–20
- Animate with `transform: translate(...)` over ~600ms with an easing that overshoots slightly (cubic-bezier)
- On animation end, remove the fly element from the DOM
- For batch sell, fire one coin staggered ~80ms apart per item (cap at 8 coins so we don't spam)

Implementation sketch:
- Component-local state `const [coins, setCoins] = useState([]);` — each entry `{ id, fromX, fromY }`
- In `handleSell`: read `event.currentTarget.getBoundingClientRect()` (pass event through) OR use a ref on the sell button to know the start point. Target coords can be a fixed offset (top-center of viewport) since the gold counter lives in the page chrome. Add a new coin to the array, then remove it after 700ms.
- The fly overlay is a fixed-position `<div className={styles.coinFlyLayer}>` at the root of the ForgeScreen return, z-index above content.

If getting exact source coords from the click is awkward, approximate with the center of the selected-item detail modal (it is near where the sell button lives).

### 3. CSS (in `ForgeScreen.module.css`)
Add keyframes + selectors for:
- `.sparkleLayer`, `.sparkleParticle` (rotate + translate + fade)
- `.sparkleGlow` (radial glow scale + opacity fade)
- `.coinFlyLayer`, `.coinFly` (translate from origin → approximately top-center, ease-out overshoot, 600–700ms)

Wrap all new animations in:
```css
@media (prefers-reduced-motion: reduce) {
  .sparkleParticle, .sparkleGlow, .coinFly {
    animation: none;
    display: none;
  }
}
```

## Files You MUST Touch
- `components/ForgeScreen.jsx` (logic + overlay JSX)
- `components/ForgeScreen.module.css` (keyframes + classes)

## Files You MUST NOT Touch
- `lib/gameReducer.js` — no reducer changes (sparkle and fly are pure visual)
- `components/shared/ItemCard.jsx`
- `components/sprites/*` — Sprite stays unmodified
- Any other component

## Acceptance Criteria
- Collect a craft → sparkle burst plays for ~900ms on that slot, then clears
- Sell a single item → one gold coin flies toward the top
- Batch-sell N items → up to 8 coins staggered
- With `prefers-reduced-motion: reduce`, no sparkle, no fly (they collapse to nothing)
- `npm run dev` succeeds, HTTP 200 on `/`
- No new console errors/warnings

## Verification
1. `npm run dev` in worktree
2. Open the game, craft a T1 item with the speed utility if needed (there is a dev speed time accelerator in the repo), collect it — sparkle fires
3. Sell the collected item — coin flies
4. Toggle DevTools "Emulate CSS media feature prefers-reduced-motion: reduce" — confirm animations disappear
5. Curl HTTP 200

## Code Style
- No trailing summary comments
- Comments only for non-obvious WHY (e.g., "cap at 8 coins to avoid DOM spam on large batch sells" is a valid WHY; "increment counter" is not)
- No .md output
- Keep `setTimeout` ids in refs if you need cleanup on unmount

## Commit
One commit on the current branch. Suggested message: `Add forge juice: craft sparkle + gold-coin fly animation`. Do NOT push.
