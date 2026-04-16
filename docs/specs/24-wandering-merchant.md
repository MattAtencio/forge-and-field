# Task 24: Wandering Merchant Event

## Objective
Add an engagement event: periodically (30–45 min), a Wandering Merchant appears with a limited-time offer. Player can accept (spend gold, receive item/resource bundle) or decline. Creates a reason to return to the game during mid-session.

Called out in Phase 3C of the project plan. Plays into the "return-session hook" engagement goal.

## What To Build

### 1. Data — `data/events.js` (new file)

```js
// Narrative voice: quiet warm authority. Offers are in-voice, not transactional.
export const MERCHANT_OFFERS = [
  {
    id: "iron_bundle",
    name: "Traveler's Iron",
    description: "A bundle bound in rough cloth. The iron inside is clean, twice-forged.",
    cost: { gold: 60 },
    grants: { resources: { iron: 30 } },
    weight: 20,
  },
  {
    id: "herb_bundle",
    name: "Dried Bouquet",
    description: "Herbs the merchant will not name, tied with twine. They smell of woodsmoke.",
    cost: { gold: 40 },
    grants: { resources: { herbs: 25 } },
    weight: 20,
  },
  {
    id: "gem_chip",
    name: "A Single Stone",
    description: "One gem, cut poorly, honestly priced. It will serve.",
    cost: { gold: 120 },
    grants: { resources: { gems: 3 } },
    weight: 15,
  },
  {
    id: "resource_mix",
    name: "Roadcutter's Pack",
    description: "Wood, stone, iron — whatever fit in the pack when he left the last camp.",
    cost: { gold: 80 },
    grants: { resources: { wood: 40, stone: 20, iron: 10 } },
    weight: 20,
  },
  {
    id: "gold_boost",
    name: "Loose Coin",
    description: "He will trade forty for sixty, if you have the forty. It is not a trick, only a debt coming due.",
    cost: { gold: 40 },
    grants: { resources: { gold: 60 } },
    weight: 10,
  },
];

export const MERCHANT_MIN_INTERVAL_MS = 30 * 60 * 1000; // 30 min
export const MERCHANT_MAX_INTERVAL_MS = 45 * 60 * 1000; // 45 min
export const MERCHANT_OFFER_DURATION_MS = 5 * 60 * 1000; // 5 min to decide

export function rollMerchantOffer() {
  const total = MERCHANT_OFFERS.reduce((s, o) => s + o.weight, 0);
  let roll = Math.random() * total;
  for (const offer of MERCHANT_OFFERS) {
    roll -= offer.weight;
    if (roll <= 0) return offer;
  }
  return MERCHANT_OFFERS[0];
}

export function getOfferById(id) {
  return MERCHANT_OFFERS.find((o) => o.id === id);
}
```

### 2. Reducer state — `lib/gameReducer.js`

In `createInitialState()`, add:
```js
merchant: {
  active: false,
  offerId: null,
  expiresAt: 0,
  nextAppearsAt: Date.now() + MERCHANT_MIN_INTERVAL_MS,
},
```

Import at the top:
```js
import { rollMerchantOffer, getOfferById, MERCHANT_MIN_INTERVAL_MS, MERCHANT_MAX_INTERVAL_MS, MERCHANT_OFFER_DURATION_MS } from "@/data/events";
```

### 3. Reducer actions — `lib/gameReducer.js`

Add three actions:

```js
case "MERCHANT_CHECK": {
  const now = Date.now();
  if (state.merchant.active) {
    // Expire if past window
    if (now >= state.merchant.expiresAt) {
      return {
        ...state,
        merchant: {
          active: false,
          offerId: null,
          expiresAt: 0,
          nextAppearsAt: now + MERCHANT_MIN_INTERVAL_MS + Math.random() * (MERCHANT_MAX_INTERVAL_MS - MERCHANT_MIN_INTERVAL_MS),
        },
      };
    }
    return state;
  }
  if (now < state.merchant.nextAppearsAt) return state;
  const offer = rollMerchantOffer();
  return {
    ...state,
    merchant: {
      active: true,
      offerId: offer.id,
      expiresAt: now + MERCHANT_OFFER_DURATION_MS,
      nextAppearsAt: 0,
    },
    _toast: "A traveler with a heavy pack waits at the gate.",
  };
}

case "MERCHANT_ACCEPT": {
  if (!state.merchant.active) return state;
  const offer = getOfferById(state.merchant.offerId);
  if (!offer) return state;
  for (const [resource, cost] of Object.entries(offer.cost || {})) {
    if ((state.resources[resource] || 0) < cost) return state;
  }
  const newResources = { ...state.resources };
  for (const [resource, cost] of Object.entries(offer.cost || {})) {
    newResources[resource] -= cost;
  }
  for (const [resource, amount] of Object.entries(offer.grants?.resources || {})) {
    newResources[resource] = (newResources[resource] || 0) + amount;
  }
  const now = Date.now();
  return {
    ...state,
    resources: newResources,
    merchant: {
      active: false,
      offerId: null,
      expiresAt: 0,
      nextAppearsAt: now + MERCHANT_MIN_INTERVAL_MS + Math.random() * (MERCHANT_MAX_INTERVAL_MS - MERCHANT_MIN_INTERVAL_MS),
    },
  };
}

case "MERCHANT_DECLINE": {
  if (!state.merchant.active) return state;
  const now = Date.now();
  return {
    ...state,
    merchant: {
      active: false,
      offerId: null,
      expiresAt: 0,
      nextAppearsAt: now + MERCHANT_MIN_INTERVAL_MS + Math.random() * (MERCHANT_MAX_INTERVAL_MS - MERCHANT_MIN_INTERVAL_MS),
    },
  };
}
```

Hook `MERCHANT_CHECK` into the existing tick — find the tick action (likely `TICK` or equivalent, search for how resource generation is driven) and dispatch a merchant check there, OR add a `setInterval` in the game shell to fire it every 10–15 seconds. The cleanest approach: add the check at the start of the existing `TICK` reducer case so it happens on every tick naturally.

### 4. Save migration — `lib/save.js`

Bump `CURRENT_VERSION` to 8. Add:
```js
if (data.version < 8) {
  if (!data.merchant) {
    data.merchant = {
      active: false,
      offerId: null,
      expiresAt: 0,
      nextAppearsAt: Date.now() + 30 * 60 * 1000,
    };
  }
  data.version = 8;
}
```

### 5. Modal — `components/WanderingMerchantModal.jsx` (new, plus CSS module)

Props: `offer`, `expiresAt`, `canAfford`, `onAccept`, `onDecline`.
Layout:
- Header: "A Traveler Waits" (in narrative voice — see tone notes below)
- Body: offer.name, offer.description, a list of what is being offered vs what it costs (small resource icons using `<Sprite>` with existing resource sprites)
- A live countdown showing time remaining (format `Mm Ss`), updates every second
- Two buttons: `Accept` (disabled if `!canAfford`) and `Decline`
- Dismiss on decline. Clicking outside should decline.

Visuals: parchment/iron feel consistent with the rest of the game. Reuse existing Modal shell if one exists in `components/shared/Modal.jsx` — check that file. Use existing CSS token colors.

### 6. Mount in `components/ForgeAndField.jsx`

Import the modal. Pull `state.merchant` and dispatch. When `state.merchant.active && getOfferById(state.merchant.offerId)` is truthy, render the modal. Accept/decline dispatch the corresponding actions.

Place the mount near where other modals are rendered (search for `WelcomeBackModal` to find the right spot).

## Narrative Voice Reference
From `data/expeditions.js` and `data/recipes.js`. Voice: quiet warm authority, low-key, never cheerful marketing. Examples:
- "The anvil waits." (empty craft slot)
- "Bitter herbs steeped in forge-warmed water. It mends what rest alone cannot." (Health Tonic)
- "Tastes like bark and determination." (Stamina Draught)

Match this register in all merchant-facing copy (header, decline button tooltip, toast). Do not use "Welcome!", "Great deal!", or exclamation points in copy — one exception is the toast `"A traveler with a heavy pack waits at the gate."` which is fine as-is.

## Files You MUST Touch
- `data/events.js` (new)
- `lib/gameReducer.js` (initial state, actions, tick hook)
- `lib/save.js` (migration + bump CURRENT_VERSION)
- `components/WanderingMerchantModal.jsx` (new)
- `components/WanderingMerchantModal.module.css` (new)
- `components/ForgeAndField.jsx` (mount modal)

## Files You MUST NOT Touch
- `components/ForgeScreen.jsx`
- `components/BarracksScreen.jsx`
- `components/HubScreen.jsx`
- `components/VillageScreen.jsx`
- `components/SeasonScreen.jsx`
- `app/page.js`
- Any other component not listed in "MUST Touch"

## Acceptance Criteria
- Merchant appears in-game after the interval elapses (you can set `nextAppearsAt` to a near-future time in dev testing, but leave the default production interval in code)
- Modal renders with offer details and live countdown
- Accept: gold deducted, grants added to resources, modal closes, merchant goes on cooldown
- Decline (or countdown expiry): no resource change, modal closes, merchant goes on cooldown
- Save/load: merchant state persists; migration adds defaults to old saves
- `npm run dev` succeeds, HTTP 200 on `/`
- No console errors/warnings

## Verification
1. `npm run dev` in worktree
2. In the browser console, run `localStorage.setItem("forgeAndField_save", JSON.stringify({ ...JSON.parse(localStorage.getItem("forgeAndField_save")), merchant: { active: false, offerId: null, expiresAt: 0, nextAppearsAt: Date.now() - 1000 } }))` to force next appearance, then wait a tick
3. Accept an offer — confirm resources update
4. Reload — merchant on cooldown
5. Curl HTTP 200

## Code Style
- No narrative summary comments
- Comments only for non-obvious invariants (e.g., weighted-roll math is obvious, don't comment it)
- No new .md files outside the spec itself

## Commit
One commit on the current branch. Suggested message: `Add Wandering Merchant event with weighted offer pool`. Do NOT push.
