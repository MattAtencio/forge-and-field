"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { canCraft, getAvailableRecipes, generateItem, getCraftRefund, getRecipeById } from "@/lib/crafting";
import { getSellValue, getRarityColor, getRarityLabel } from "@/lib/rarity";
import { RESOURCES } from "@/data/resources";
import ItemCard from "./shared/ItemCard";
import Modal from "./shared/Modal";
import styles from "./ForgeScreen.module.css";

export default function ForgeScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [tab, setTab] = useState("recipes"); // 'recipes' | 'inventory'

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
    const goldValue = recipe ? getSellValue(recipe, item.rarity) : 5;
    dispatch({ type: "SELL_ITEM", itemId: item.id, goldValue });
    setSelectedItem(null);
  };

  const now = Date.now();

  return (
    <div className={styles.forge}>
      <h2 className={styles.heading}>{"\u{1F525}"} The Forge</h2>

      {/* Crafting Queue */}
      {state.craftingQueue.length > 0 && (
        <div className={styles.queue}>
          <h3 className={styles.subheading}>Crafting Queue</h3>
          {state.craftingQueue.map((craft) => {
            const recipe = getRecipeById(craft.recipeId);
            const elapsed = now - craft.startedAt;
            const remaining = Math.max(0, craft.duration - elapsed);
            const done = remaining <= 0;
            const pct = Math.min((elapsed / craft.duration) * 100, 100);

            return (
              <div key={craft.id} className={styles.queueItem}>
                <span className={styles.queueIcon}>{recipe?.icon || "?"}</span>
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
          })}
        </div>
      )}

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
          Inventory ({state.inventory.length})
        </button>
      </div>

      {/* Recipes List */}
      {tab === "recipes" && (
        <div className={styles.recipeList}>
          {recipes.map((recipe) => {
            const affordable = canCraft(recipe, state.resources);
            const queueFull = state.craftingQueue.length >= 2;

            return (
              <div key={recipe.id} className={styles.recipeCard}>
                <div className={styles.recipeHeader}>
                  <span className={styles.recipeIcon}>{recipe.icon}</span>
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
                      style={{ color: (state.resources[res] || 0) >= cost ? RESOURCES[res]?.color : "#ef4444" }}
                    >
                      {RESOURCES[res]?.icon} {cost}
                    </span>
                  ))}
                  <span className={styles.craftTime}>
                    {"\u23F1\uFE0F"} {Math.round(recipe.duration / 1000)}s
                  </span>
                </div>
                <div className={styles.recipeStats}>
                  {recipe.baseStats.atk > 0 && <span>ATK {recipe.baseStats.atk}</span>}
                  {recipe.baseStats.def > 0 && <span>DEF {recipe.baseStats.def}</span>}
                  {recipe.baseStats.spd !== 0 && <span>SPD {recipe.baseStats.spd > 0 ? "+" : ""}{recipe.baseStats.spd}</span>}
                </div>
                <button
                  className={styles.craftBtn}
                  disabled={!affordable || queueFull}
                  onClick={() => handleCraft(recipe)}
                >
                  {queueFull ? "Queue Full" : affordable ? "Craft" : "Need Resources"}
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
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))
          )}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <Modal title={selectedItem.name} onClose={() => setSelectedItem(null)}>
          <div className={styles.itemDetail}>
            <div className={styles.itemDetailHeader}>
              <span className={styles.itemDetailIcon}>{selectedItem.icon}</span>
              <div>
                <span
                  className={styles.itemDetailRarity}
                  style={{ color: getRarityColor(selectedItem.rarity) }}
                >
                  {getRarityLabel(selectedItem.rarity)}
                </span>
                <span className={styles.itemDetailSlot}>{selectedItem.slot}</span>
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
            {selectedItem.equippedBy ? (
              <p className={styles.equippedNote}>Currently equipped</p>
            ) : (
              <button
                className={styles.sellBtn}
                onClick={() => handleSell(selectedItem)}
              >
                Sell for {getSellValue(getRecipeById(selectedItem.recipeId) || { ingredients: {}, tier: 1 }, selectedItem.rarity)} {"\u{1FA99}"}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
