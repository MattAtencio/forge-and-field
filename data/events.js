// Voice: quiet warm authority. Offers are in-voice, not transactional.
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

export const MERCHANT_MIN_INTERVAL_MS = 30 * 60 * 1000;
export const MERCHANT_MAX_INTERVAL_MS = 45 * 60 * 1000;
export const MERCHANT_OFFER_DURATION_MS = 5 * 60 * 1000;

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

export function rollNextAppearance(now = Date.now()) {
  return now + MERCHANT_MIN_INTERVAL_MS + Math.random() * (MERCHANT_MAX_INTERVAL_MS - MERCHANT_MIN_INTERVAL_MS);
}
