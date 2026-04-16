"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { canCraft, getAvailableRecipes, generateItem, getCraftRefund, getRecipeById } from "@/lib/crafting";
import { getSellValue, getRarityColor, getRarityLabel, getUpgradeCost, getRepairCost, getDismantleReturns } from "@/lib/rarity";
import { RESOURCES } from "@/data/resources";
import ItemCard from "./shared/ItemCard";
import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
import ResourceCost from "@/components/sprites/ResourceCost";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./ForgeScreen.module.css";

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3 };
const SLOT_ORDER = { weapon: 0, armor: 1, accessory: 2 };

function SparkleBurst() {
  return (
    <div className={styles.sparkleLayer} aria-hidden="true">
      <span className={styles.sparkleGlow} />
      <span className={styles.sparkleParticle} style={{ "--sx": "28px", "--sy": "-22px", animationDelay: "0ms" }} />
      <span className={styles.sparkleParticle} style={{ "--sx": "-26px", "--sy": "-18px", animationDelay: "60ms" }} />
      <span className={styles.sparkleParticle} style={{ "--sx": "18px", "--sy": "24px", animationDelay: "120ms" }} />
      <span className={styles.sparkleParticle} style={{ "--sx": "-20px", "--sy": "20px", animationDelay: "180ms" }} />
      <span className={styles.sparkleParticle} style={{ "--sx": "0px", "--sy": "-30px", animationDelay: "240ms" }} />
    </div>
  );
}

export default function ForgeScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [tab, setTab] = useState("recipes"); // 'recipes' | 'inventory'
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortBy, setSortBy] = useState("rarity"); // 'rarity' | 'level' | 'type'
  const [filterSlot, setFilterSlot] = useState("all"); // 'all' | 'weapon' | 'armor' | 'accessory'
  const [sparkleAt, setSparkleAt] = useState(null);
  const [coins, setCoins] = useState([]);
  const longPressRef = useRef(null);
  const sparkleTimerRef = useRef(null);
  const coinTimersRef = useRef(new Set());
  const sellBtnRef = useRef(null);
  const batchSellBtnRef = useRef(null);

  // Clear pending timers on unmount so no setState after teardown.
  useEffect(() => {
    return () => {
      if (sparkleTimerRef.current) clearTimeout(sparkleTimerRef.current);
      coinTimersRef.current.forEach((t) => clearTimeout(t));
      coinTimersRef.current.clear();
    };
  }, []);

  const spawnCoin = (fromX, fromY) => {
    const id = `coin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setCoins((prev) => [...prev, { id, fromX, fromY }]);
    const t = setTimeout(() => {
      setCoins((prev) => prev.filter((c) => c.id !== id));
      coinTimersRef.current.delete(t);
    }, 750);
    coinTimersRef.current.add(t);
  };

  const getSellOrigin = (ref) => {
    const el = ref?.current;
    if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const recipes = getAvailableRecipes(state.player.level);

  const maxSlots = state.maxCraftSlots || 2;

  const handleCraft = (recipe) => {
    if (state.craftingQueue.length >= maxSlots) return;
    if (!canCraft(recipe, state.resources)) return;
    dispatch({ type: "START_CRAFT", recipe });
  };

  const handleCollect = (craft, slotIndex) => {
    const recipe = getRecipeById(craft.recipeId);
    if (!recipe) return;
    const item = generateItem(recipe);
    dispatch({ type: "COMPLETE_CRAFT", craftId: craft.id, item });
    // Track slot index because the craft is removed from state on dispatch.
    setSparkleAt(slotIndex);
    if (sparkleTimerRef.current) clearTimeout(sparkleTimerRef.current);
    sparkleTimerRef.current = setTimeout(() => setSparkleAt(null), 900);
  };

  const handleCancel = (craft) => {
    const recipe = getRecipeById(craft.recipeId);
    const refund = recipe ? getCraftRefund(recipe) : {};
    dispatch({ type: "CANCEL_CRAFT", craftId: craft.id, refund });
  };

  const handleSell = (item) => {
    const recipe = getRecipeById(item.recipeId);
    const goldValue = recipe ? getSellValue(recipe, item.rarity, item.level) : 5;
    const origin = getSellOrigin(sellBtnRef);
    spawnCoin(origin.x, origin.y);
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
    // Cap at 8 coins to avoid DOM spam on large batch sells.
    const coinCount = Math.min(items.length, 8);
    const origin = getSellOrigin(batchSellBtnRef);
    for (let i = 0; i < coinCount; i++) {
      const t = setTimeout(() => {
        spawnCoin(origin.x, origin.y);
        coinTimersRef.current.delete(t);
      }, i * 80);
      coinTimersRef.current.add(t);
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

  const filteredAndSorted = useMemo(() => {
    let items = [...state.inventory];
    if (filterSlot !== "all") {
      items = items.filter((i) => i.slot === filterSlot);
    }
    items.sort((a, b) => {
      if (sortBy === "rarity") return (RARITY_ORDER[b.rarity] || 0) - (RARITY_ORDER[a.rarity] || 0);
      if (sortBy === "level") return (b.level || 1) - (a.level || 1);
      if (sortBy === "type") return (SLOT_ORDER[a.slot] || 0) - (SLOT_ORDER[b.slot] || 0);
      return 0;
    });
    return items;
  }, [state.inventory, filterSlot, sortBy]);

  const now = Date.now();

  return (
    <div className={styles.forge}>
      <h2 className={styles.heading}>
        <Sprite name="forge" size={22} /> The Forge
      </h2>

      {/* Crafting Queue — always show all slots for stable layout */}
      <PixelFrame variant="iron" className={styles.queue}>
        <h3 className={styles.subheading}>Crafting Queue</h3>
        {Array.from({ length: maxSlots }, (_, i) => {
          const craft = state.craftingQueue[i];
          if (craft) {
            const recipe = getRecipeById(craft.recipeId);
            const elapsed = now - craft.startedAt;
            const remaining = Math.max(0, craft.duration - elapsed);
            const done = remaining <= 0;
            const pct = Math.min((elapsed / craft.duration) * 100, 100);

            return (
              <div key={craft.id} className={`${styles.queueItem} ${done ? styles.craftReady : ""}`}>
                {sparkleAt === i && <SparkleBurst />}
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
                  <button className={`${styles.collectBtn} juiceBtn`} onClick={() => handleCollect(craft, i)}>
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
              {sparkleAt === i && <SparkleBurst />}
              <span className={styles.queueIcon}>
                <Sprite name="forge" size={22} />
              </span>
              <div className={styles.queueInfo}>
                <span className={styles.queueName}>The anvil waits.</span>
                <div className={styles.queueBar} />
              </div>
            </div>
          );
        })}
      </PixelFrame>

      {/* Tab Switch */}
      <PixelFrame variant="iron" className={styles.tabs}>
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
      </PixelFrame>

      {/* Recipes List */}
      {tab === "recipes" && (
        <div className={styles.recipeList}>
          {recipes.map((recipe) => {
            const affordable = canCraft(recipe, state.resources);
            const queueFull = state.craftingQueue.length >= maxSlots;
            const invFull = state.inventory.length >= (state.inventoryCapacity || 20);

            return (
              <PixelFrame key={recipe.id} variant="iron" className={styles.recipeCard}>
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
                  {recipe.baseStats ? (
                    <>
                      {recipe.baseStats.atk > 0 && <span>ATK {recipe.baseStats.atk}</span>}
                      {recipe.baseStats.def > 0 && <span>DEF {recipe.baseStats.def}</span>}
                      {recipe.baseStats.spd !== 0 && <span>SPD {recipe.baseStats.spd > 0 ? "+" : ""}{recipe.baseStats.spd}</span>}
                    </>
                  ) : recipe.effect ? (
                    <span className={styles.effectLabel}>{recipe.description}</span>
                  ) : null}
                </div>
                <button
                  className={`${styles.craftBtn} juiceBtn`}
                  disabled={!affordable || queueFull || invFull}
                  onClick={() => handleCraft(recipe)}
                >
                  {invFull ? "Stores Full" : queueFull ? "Queue Full" : affordable ? "Craft" : "Gather More"}
                </button>
              </PixelFrame>
            );
          })}
        </div>
      )}

      {/* Inventory */}
      {tab === "inventory" && (
        <>
        <div className={styles.inventoryControls}>
          <div className={styles.filterRow}>
            {["all", "weapon", "armor", "accessory"].map((slot) => (
              <button
                key={slot}
                className={`${styles.filterBtn} ${filterSlot === slot ? styles.filterActive : ""}`}
                onClick={() => setFilterSlot(slot)}
              >
                {slot === "all" ? "All" : slot.charAt(0).toUpperCase() + slot.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.sortRow}>
            <span className={styles.sortLabel}>Sort:</span>
            {["rarity", "level", "type"].map((s) => (
              <button
                key={s}
                className={`${styles.sortBtn} ${sortBy === s ? styles.sortActive : ""}`}
                onClick={() => setSortBy(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.inventoryGrid}>
          {state.inventory.length === 0 ? (
            <p className={styles.empty}>Your stores are bare. The forge awaits.</p>
          ) : (
            filteredAndSorted.map((item) => (
              <div
                key={item.id}
                className={`${styles.selectableItem} ${selectionMode && selectedIds.has(item.id) ? styles.itemSelected : ""}`}
                onPointerDown={() => {
                  longPressRef.current = setTimeout(() => handleLongPress(item), 400);
                }}
                onPointerUp={() => clearTimeout(longPressRef.current)}
                onPointerLeave={() => clearTimeout(longPressRef.current)}
              >
                {selectionMode && !item.equippedBy && selectedIds.has(item.id) && (
                  <span className={styles.selectMark} />
                )}
                <ItemCard
                  item={item}
                  onClick={() => handleItemInteraction(item)}
                />
              </div>
            ))
          )}
        </div>
        </>
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
              ref={batchSellBtnRef}
              className={`${styles.batchSellBtn} juiceBtn`}
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
                      className={`${styles.repairBtn} juiceBtn`}
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
                className={`${styles.dismantleBtn} juiceBtn`}
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
                  className={`${styles.upgradeBtn} juiceBtn`}
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
                ref={sellBtnRef}
                className={`${styles.sellBtn} juiceBtn`}
                onClick={() => handleSell(selectedItem)}
              >
                Sell for {getSellValue(getRecipeById(selectedItem.recipeId) || { ingredients: {}, tier: 1 }, selectedItem.rarity, selectedItem.level)} <Sprite name="gold" size={14} />
              </button>
            )}
          </div>
        </Modal>
      )}

      {coins.length > 0 && (
        <div className={styles.coinFlyLayer} aria-hidden="true">
          {coins.map((c) => (
            <span
              key={c.id}
              className={styles.coinFly}
              style={{ left: c.fromX, top: c.fromY }}
            >
              <Sprite name="gold" size={18} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
