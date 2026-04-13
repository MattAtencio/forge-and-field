export const EXPLORATION_TEXT = {
  // When entering exploration
  enter: {
    greenwood: "The path narrows. Behind you, the forge glows steady. Ahead, the forest.",
    stormridge: "The wind finds you before the mountain does. Dress warm. Climb steady.",
    dusthaven: "Heat and silence. The wastes give nothing freely. Take what you can carry.",
    frostpeak: "The cold is immediate. Your breath crystallizes. This place does not welcome visitors.",
    dragons_reach: "The ground is warm underfoot. Somewhere ahead, something ancient breathes.",
  },

  // Node arrival by type
  nodeArrival: {
    combat: "Something stirs. Steel ready.",
    resource: "Useful materials. The forge will know what to do with these.",
    rest: "A moment of peace. The body remembers how to breathe.",
    poi: "Something left behind. Not by accident.",
    boss: "The air changes. This is what you came for.",
    empty: "Nothing here now. Move on.",
  },

  // Combat outcomes
  combat: {
    victory: "The threat passes. Gather what fell.",
    defeat: "Darkness. The forest takes what it is owed.",
    fled: "You break away. Pride costs less than your life.",
    fleedFailed: "No escape. Stand and fight.",
  },

  // Retreat/return
  retreat: {
    safe: "The forge light grows brighter. You made it back. The pack is heavy with what you found.",
    withLoot: "A good haul. The anvil waits for what you have brought.",
    empty: "Nothing gained, nothing lost. The forge is patient.",
  },

  // Endurance warnings
  endurance: {
    low: "Your legs grow heavy. The path back is still open.",
    critical: "Every step costs twice what it should. Turn back or fall.",
    depleted: "No strength left. The forest makes the decision for you.",
  },

  // Loot bag events
  loot: {
    resourceFound: "Added to the pack.",
    itemFound: "Something worth keeping.",
    bagFull: "The pack strains. Return to the forge or risk losing it all.",
  },
};
