"use client";

import { useState, useRef } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { canCraft, getAvailableRecipes, generateItem, getCraftRefund, getRecipeById } from "@/lib/crafting";
import { getSellValue, getRarityColor, getRarityLabel, getUpgradeCost, getRepairCost, getDismantleReturns } from "@/lib/rarity";
import { RESOURCES } from "@/data/resources";
import ItemCard from "./shared/ItemCard";
import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
import ResourceCost from "@/components/sprites/ResourceCost";
import styles from "./ForgeScreen.module.css";

export default function ForgeScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [tab, setTab] = useState("recipes"); // 'recipes' | 'inventory'
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const longPressRef = useRef(null);

  const recipes = getAvailableRecipes(state.player.level);

  const handleCraft = (recipe) => {
    if (state.craftingQueue.length >= 2) return;
    if (!canCraft(recipe, state.resources)) return;
    dispatch({ type: "START_CRAFT", recipe });
  };

  const handleCollect = (craft) => {
    const recipe = getRecipeById(craft.recipeId);
    if (!recipe) return;
    const item = generateItem(recipe);
    dispatch({ type: "COMPLETE_CRAFT", craftId: craft.id, item });
  };

  const handleCancel = (craft) => {
    const recipe = getRecipeById(craft.recipeId);
    const refund = recipe ? getCraftRefund(recipe) : {};
    dispatch({ type: "CANCEL_CRAFT", craftId: craft.id, refund });
  };

  const handleSell = (item) => {
    const recipe = getRecipeById(item.recipeId);
    const goldValue = recipe ? getSellValue(recipe, item.rarity, item.level) : 5;
    dispatch({ type: "SELL_ITEM", itemId: item.id, goldValue });
    setSelectedItem(null);
  };

  const handleUpgrade = (item) => {
    const cost = getUpgradeCost(item);
    if (!cost) return;
    dispatch({ type: "UPGRADE_ITEM", itemId: item.id, cost });
    setSelectedItem(null);
  };

  const handleRepair = (item) => {
    const cost = getRepairCost(item);
    if (!cost) return;
    dispatch({ type: "REPAIR_ITEM", itemId: item.id, cost });
    setSelectedItem(null);
  };

  const handleDismantle = (item) => {
    const returns = getDismantleReturns(item);
    dispatch({ type: "DISMANTLE_ITEM", itemId: item.id, returns });
    setSelectedItem(null);
  };

  const handleBatchSell = () => {
    const items = state.inventory.filter((i) => selectedIds.has(i.id) && !i.equippedBy);
    if (items.length === 0) return;
    let totalGold = 0;
    const itemIds = [];
    for (const item of items) {
      const recipe = getRecipeById(item.recipeId);
      totalGold += recipe ? getSellValue(recipe, item.rarity, item.level) : 5;
      itemIds.push(item.id);
    }
    dispatch({ type: "SELL_ITEMS_BATCH", itemIds, totalGold });
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelection = (itemId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleItemInteraction = (item) => {
    if (selectionMode) {
      if (!item.equippedBy) toggleSelection(item.id);
    } else {
      setSelectedItem(item);
    }
  };

  const handleLongPress = (item) => {
    if (item.equippedBy) return;
    setSelectionMode(true);
    setSelectedIds(new Set([item.id]));
  };

  const now = Date.now();

  return (
    <div className={styles.forge}>
      <h2 className={styles.heading}>
        <Sprite name="forge" size={22} /> The Forge
      </h2>

      {/* Crafting Queue — always show all slots for stable layout */}
      <div className={styles.queue}>
        <h3 className={styles.subheading}>Crafting Queue</h3>
        {Array.from({ length: 2 }, (_, i) => {
          const craft = state.craftingQueue[i];
          if (craft) {
            const recipe = getRecipeById(craft.recipeId);
            const elapsed = now - craft.startedAt;
            const remaining = Math.max(0, craft.duration - elapsed);
            const done = remaining <= 0;
            const pct = Math.min((elapsed / craft.duration) * 100, 100);

            return (
              <div key={craft.id} className={styles.queueItem}>
                <span className={styles.queueIcon}>
                  <Sprite name={recipe?.icon || "forge"} size={22} animate={done ? "glow" : "spin"} />
                </span>
                <div className={styles.queueInfo}>
                  <span className={styles.queueName}>{recipe?.name || "Unknown"}</span>
                  <div className={styles.queueBar}>
                    <div
                      className={styles.queueFill}
                      style={{ width: `${pct}%`, background: done ? "#22c55e" : "#f97316" }}
                    />
                  </div>
                </div>
                {done ? (
                  <button className={styles.collectBtn} onClick={() => handleCollect(craft)}>
                    Collect
                  </button>
                ) : (
                  <div className={styles.queueActions}>
                    <span className={styles.queueTime}>{Math.ceil(remaining / 1000)}s</span>
                    <button className={styles.cancelBtn} onClick={() => handleCancel(craft)}>
                      {"\u2715"}
                    </button>
                  </div>
                )}
              </div>
            );
          }
          return (
            <div key={`empty-${i}`} className={`${styles.queueItem} ${styles.queueEmpty}`}>
              <span className={styles.queueIcon}>
                <Sprite name="forge" size={22} />
              </span>
              <div className={styles.queueInfo}>
                <span className={styles.queueName}>Empty Slot</span>
                <div className={styles.queueBar} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Switch */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "recipes" ? styles.tabActive : ""}`}
          onClick={() => setTab("recipes")}
        >
          Recipes
        </button>
        <button
          className={`${styles.tab} ${tab === "inventory" ? styles.tabActive : ""}`}
          onClick={() => setTab("inventory")}
        >
          Inventory ({state.inventory.length}/{state.inventoryCapacity || 20})
        </button>
      </div>

      {/* Recipes List */}
      {tab === "recipes" && (
        <div className={styles.recipeList}>
          {recipes.map((recipe) => {
            const affordable = canCraft(recipe, state.resources);
            const queueFull = state.craftingQueue.length >= 2;
            const invFull = state.inventory.length >= (state.inventoryCapacity || 20);

            return (
              <div key={recipe.id} className={styles.recipeCard}>
                <div className={styles.recipeHeader}>
                  <span className={styles.recipeIcon}>
                    <Sprite name={recipe.icon} size={28} />
                  </span>
                  <div>
                    <span className={styles.recipeName}>{recipe.name}</span>
                    <span className={styles.recipeTier}>Tier {recipe.tier} &middot; {recipe.slot}</span>
                  </div>
                </div>
                <div className={styles.ingredients}>
                  {Object.entries(recipe.ingredients).map(([res, cost]) => (
                    <span
                      key={res}
                      className={styles.ingredient}
                      style={{ color: (state.resources[res] || 0) >= cost ? RESOURCES[res]?.color : "#ef4444", display: "inline-flex", alignItems: "center", gap: 2 }}
                    >
                      <Sprite name={RESOURCES[res]?.icon || res} size={12} /> {cost}
                    </span>
                  ))}
                  <span className={styles.craftTime}>
                    {Math.round(recipe.duration / 1000)}s
                  </span>
                </div>
                <div className={styles.recipeStats}>
                  {recipe.baseStats.atk > 0 && <span>ATK {recipe.baseStats.atk}</span>}
                  {recipe.baseStats.def > 0 && <span>DEF {recipe.baseStats.def}</span>}
                  {recipe.baseStats.spd !== 0 && <span>SPD {recipe.baseStats.spd > 0 ? "+" : ""}{recipe.baseStats.spd}</span>}
                </div>
                <button
                  className={styles.craftBtn}
                  disabled={!affordable || queueFull || invFull}
                  onClick={() => handleCraft(recipe)}
                >
                  {invFull ? "Inventory Full" : queueFull ? "Queue Full" : affordable ? "Craft" : "Need Resources"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Inventory */}
      {tab === "inventory" && (
        <div className={styles.inventoryGrid}>
          {state.inventory.length === 0 ? (
            <p className={styles.empty}>No items yet. Start crafting!</p>
          ) : (
            state.inventory.map((item) => (
              <div
                key={item.id}
                className={`${styles.selectableItem} ${selectionMode && selectedIds.has(item.id) ? styles.itemSelected : ""}`}
                onPointerDown={() => {
                  longPressRef.current = setTimeout(() => handleLongPress(item), 400);
                }}
                onPointerUp={() => clearTimeout(longPressRef.current)}
                onPointerLeave={() => clearTimeout(longPressRef.current)}
              >
                {selectionMode && !item.equippedBy && (
                  <span className={styles.selectCheck}>
                    {selectedIds.has(item.id) ? "\u2611" : "\u2610"}
                  </span>
                )}
                <ItemCard
                  item={item}
                  onClick={() => handleItemInteraction(item)}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* Batch Sell Bar */}
      {selectionMode && (
        <div className={styles.batchBar}>
          <span className={styles.batchCount}>
            {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className={styles.batchActions}>
            <button
              className={styles.batchCancel}
              onClick={() => { setSelectionMode(false); setSelectedIds(new Set()); }}
            >
              Cancel
            </button>
            <button
              className={styles.batchSellBtn}
              disabled={selectedIds.size === 0}
              onClick={handleBatchSell}
            >
              Sell All (<Sprite name="gold" size={12} />{" "}
              {state.inventory
                .filter((i) => selectedIds.has(i.id) && !i.equippedBy)
                .reduce((sum, item) => {
                  const recipe = getRecipeById(item.recipeId);
                  return sum + (recipe ? getSellValue(recipe, item.rarity, item.level) : 5);
                }, 0)})
            </button>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <Modal title={selectedItem.name} onClose={() => setSelectedItem(null)}>
          <div className={styles.itemDetail}>
            <div className={styles.itemDetailHeader}>
              <span className={styles.itemDetailIcon}>
                <Sprite name={selectedItem.icon} size={36} />
              </span>
              <div>
                <span
                  className={styles.itemDetailRarity}
                  style={{ color: getRarityColor(selectedItem.rarity) }}
                >
                  {getRarityLabel(selectedItem.rarity)}
                </span>
                <span className={styles.itemDetailSlot}>
                  {selectedItem.slot}{(selectedItem.level || 1) > 1 ? ` \u00B7 Lv.${selectedItem.level}` : ""}
                </span>
              </div>
            </div>
            <div className={styles.itemDetailStats}>
              {Object.entries(selectedItem.stats).map(([stat, val]) =>
                val !== 0 ? (
                  <div key={stat} className={styles.itemDetailStat}>
                    <span>{stat.toUpperCase()}</span>
                    <span style={{ color: val > 0 ? "#22c55e" : "#ef4444" }}>
                      {val > 0 ? "+" : ""}{val}
                    </span>
                  </div>
                ) : null
              )}
            </div>
            {/* Durability */}
            {selectedItem.durability && (
              <div className={styles.durabilitySection}>
                <div className={styles.durabilityHeader}>
                  <span className={styles.durabilityLabel}>Durability</span>
                  <span className={styles.durabilityValue}>
                    {selectedItem.durability.current}/{selectedItem.durability.max}
                  </span>
                </div>
                <div className={styles.durabilityBarLarge}>
                  <div
                    className={styles.durabilityFillLarge}
                    style={{
                      width: `${(selectedItem.durability.current / selectedItem.durability.max) * 100}%`,
                      background: selectedItem.durability.current <= 0
                        ? "#ef4444"
                        : selectedItem.durability.current < selectedItem.durability.max * 0.3
                        ? "#f59e0b"
                        : "#22c55e",
                    }}
                  />
                </div>
                {selectedItem.durability.current <= 0 && (
                  <p className={styles.brokenNote}>Broken — no stat bonus until repaired</p>
                )}
                {(() => {
                  const repCost = getRepairCost(selectedItem);
                  if (!repCost) return null;
                  const canAffordRepair = Object.entries(repCost).every(
                    ([res, amt]) => (state.resources[res] || 0) >= amt
                  );
                  return (
                    <button
                      className={styles.repairBtn}
                      disabled={!canAffordRepair}
                      onClick={() => handleRepair(selectedItem)}
                    >
                      Repair (<ResourceCost costs={repCost} available={state.resources} />)
                    </button>
                  );
                })()}
              </div>
            )}

            {/* Dismantle button */}
            {!selectedItem.equippedBy && (
              <button
                className={styles.dismantleBtn}
                onClick={() => handleDismantle(selectedItem)}
              >
                Dismantle (<ResourceCost costs={getDismantleReturns(selectedItem)} />)
              </button>
            )}

            {/* Upgrade button */}
            {(() => {
              const upgradeCost = getUpgradeCost(selectedItem);
              if (!upgradeCost) return null;
              const canAfford = Object.entries(upgradeCost).every(
                ([res, amt]) => amt === 0 || (state.resources[res] || 0) >= amt
              );
              return (
                <button
                  className={styles.upgradeBtn}
                  disabled={!canAfford || !!selectedItem.equippedBy}
                  onClick={() => handleUpgrade(selectedItem)}
                >
                  Upgrade to Lv.{(selectedItem.level || 1) + 1}
                  {" ("}
                  <ResourceCost costs={upgradeCost} available={state.resources} />
                  {")"}
                </button>
              );
            })()}

            {selectedItem.equippedBy ? (
              <p className={styles.equippedNote}>Currently equipped</p>
            ) : (
              <button
                className={styles.sellBtn}
                onClick={() => handleSell(selectedItem)}
              >
                Sell for {getSellValue(getRecipeById(selectedItem.recipeId) || { ingredients: {}, tier: 1 }, selectedItem.rarity, selectedItem.level)} <Sprite name="gold" size={14} />
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
