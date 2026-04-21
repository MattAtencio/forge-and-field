"use client";

import { useState, useRef, useCallback } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getEffectiveStats, getHeroPower, canLevelUp, getUnequippedItems, getRestDuration, getPotionCost } from "@/lib/hero";
import { getHeroTemplate } from "@/lib/hero";
import { getUnlockedTitles, getTitleById } from "@/data/titles";
import { getBuildingEffect } from "@/data/village";
import { getHeroLevelCost } from "@/data/progression";
import { HERO_TEMPLATES } from "@/data/heroes";
import { getRarityColor } from "@/lib/rarity";
import { RESOURCES } from "@/data/resources";
import { getHeroSkills } from "@/lib/skills";
import HeroCard from "./shared/HeroCard";
import ItemCard from "./shared/ItemCard";
import SkillBadge from "./shared/SkillBadge";
import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
import ResourceCost from "@/components/sprites/ResourceCost";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./BarracksScreen.module.css";

export default function BarracksScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedHeroId, setSelectedHeroId] = useState(
    state.screenPayload?.heroId || state.heroes[0]?.id || null
  );
  const [equipSlot, setEquipSlot] = useState(null);
  const [inventoryView, setInventoryView] = useState("list");
  const [showTitlePicker, setShowTitlePicker] = useState(false);
  const [levelUpFlash, setLevelUpFlash] = useState(false);
  // Snapshot of stat deltas for the +N rises; cleared with the flash.
  const [levelUpDeltas, setLevelUpDeltas] = useState(null);
  const levelUpTimerRef = useRef(null);

  const selectedHero = state.heroes.find((h) => h.id === selectedHeroId);
  const effectiveStats = selectedHero ? getEffectiveStats(selectedHero, state.inventory) : null;
  const power = selectedHero ? getHeroPower(selectedHero, state.inventory) : 0;

  const handleLevelUp = () => {
    if (!selectedHero) return;
    const template = getHeroTemplate(selectedHero.templateId);
    if (!template) return;
    const cost = getHeroLevelCost(selectedHero.level);
    dispatch({
      type: "LEVEL_UP_HERO",
      heroId: selectedHero.id,
      cost,
      statGrowth: template.statGrowth,
      enduranceGrowth: template.enduranceGrowth || 5,
    });
    // Capture deltas locally so +N rises can render without a new dispatch action.
    setLevelUpDeltas({ ...template.statGrowth });
    setLevelUpFlash(true);
    clearTimeout(levelUpTimerRef.current);
    levelUpTimerRef.current = setTimeout(() => {
      setLevelUpFlash(false);
      setLevelUpDeltas(null);
    }, 900);
  };

  const handleEquip = (itemId) => {
    if (!selectedHero || !equipSlot) return;
    dispatch({
      type: "EQUIP_ITEM",
      heroId: selectedHero.id,
      itemId,
      slot: equipSlot,
    });
    setEquipSlot(null);
  };

  const handleUnequip = (slot) => {
    if (!selectedHero) return;
    dispatch({
      type: "UNEQUIP_ITEM",
      heroId: selectedHero.id,
      slot,
    });
  };

  const levelCost = selectedHero ? getHeroLevelCost(selectedHero.level) : 0;
  const canLevel = selectedHero ? canLevelUp(selectedHero, state.resources.gold) : false;

  return (
    <div className={styles.barracks}>
      <h2 className={styles.heading}>
        <Sprite name="barracks" size={22} /> Barracks
      </h2>

      {/* Hero Roster */}
      <PixelFrame variant="parchment" className={styles.rosterFrame}>
        <h4 className={styles.sectionHeading}>Roster</h4>
        <div className={styles.roster}>
          {state.heroes.map((hero) => (
            <div
              key={hero.id}
              className={`${styles.rosterSlot} ${hero.id === selectedHeroId ? styles.rosterSlotSelected : ""}`}
            >
              <HeroCard
                hero={hero}
                inventory={state.inventory}
                selected={hero.id === selectedHeroId}
                onClick={() => setSelectedHeroId(hero.id)}
              />
            </div>
          ))}
        </div>
      </PixelFrame>

      {/* Selected Hero Detail */}
      {selectedHero && (
        <PixelFrame variant="parchment" className={`${styles.detail} ${levelUpFlash ? styles.detailLevelUp : ""}`}>
          <div className={styles.detailHeader}>
            <Sprite name={selectedHero.templateId} size={36} animate="float" />
            <h3 className={styles.heroName}>{selectedHero.name}</h3>
            <span className={`${styles.levelBadge} ${levelUpFlash ? styles.levelBadgeBounce : ""}`}>Lv.{selectedHero.level}</span>
            <span className={`${styles.powerBadge} ${levelUpFlash ? styles.levelUpCelebrate : ""}`}>Power: {power}</span>
          </div>
          {levelUpFlash && <span className={styles.emberBurst} aria-hidden="true" />}
          {(() => {
            const template = HERO_TEMPLATES.find((t) => t.id === selectedHero.templateId);
            return template?.description ? (
              <p className={styles.heroDescription}>{template.description}</p>
            ) : null;
          })()}

          {/* Effective Stats */}
          <div className={styles.statsGrid}>
            {[
              { key: "hp", icon: "heart", label: "HP" },
              { key: "atk", icon: "attack", label: "ATK" },
              { key: "def", icon: "defense", label: "DEF" },
              { key: "spd", icon: "speed", label: "SPD" },
            ].map(({ key, icon, label }) => {
              const delta = levelUpDeltas?.[key] || 0;
              return (
                <PixelFrame key={key} variant="parchment" className={styles.statCell}>
                  <span className={styles.statIcon}><Sprite name={icon} size={16} /></span>
                  <span className={styles.statLabel}>{label}</span>
                  <span className={`${styles.statValue} ${levelUpFlash && delta > 0 ? styles.statValueBumped : ""}`}>
                    {effectiveStats[key]}
                  </span>
                  {levelUpFlash && delta > 0 && (
                    <span className={styles.statRise} aria-hidden="true">+{delta}</span>
                  )}
                </PixelFrame>
              );
            })}
          </div>

          {/* Endurance */}
          {(() => {
            const endurance = selectedHero.endurance || { current: 100, max: 100 };
            const pct = (endurance.current / endurance.max) * 100;
            const isResting = selectedHero.status === "resting";
            const restRemaining = isResting && selectedHero.restUntil
              ? Math.max(0, Math.ceil((selectedHero.restUntil - Date.now()) / 1000))
              : 0;
            const potCost = getPotionCost(selectedHero);
            const canAffordPotion = Object.entries(potCost).every(
              ([res, amt]) => (state.resources[res] || 0) >= amt
            );
            const apoLevel = state.village?.apothecary || 0;
            const apoEffect = apoLevel > 0 ? getBuildingEffect("apothecary", apoLevel) : null;
            const restMult = apoEffect?.restDurationMult || 1.0;
            const needsRecovery = endurance.current < endurance.max;

            return (
              <PixelFrame variant="parchment" className={styles.enduranceSection}>
                <div className={styles.enduranceHeader}>
                  <span className={styles.enduranceLabel}>Endurance</span>
                  <span className={styles.enduranceValue}>{endurance.current}/{endurance.max}</span>
                </div>
                <div className={styles.enduranceBar}>
                  <div
                    className={styles.enduranceFill}
                    style={{
                      width: `${pct}%`,
                      background: pct <= 20 ? "#ef4444" : pct <= 50 ? "#f59e0b" : "#22c55e",
                    }}
                  />
                </div>
                {isResting && (
                  <p className={styles.restingNote}>Resting... {restRemaining}s remaining</p>
                )}
                {selectedHero.status === "exploring" && (
                  <p className={styles.restingNote} style={{ color: "#a855f7" }}>Exploring...</p>
                )}
                {needsRecovery && selectedHero.status === "idle" && (
                  <div className={styles.enduranceActions}>
                    <button
                      className={`${styles.restBtn} juiceBtn`}
                      onClick={() => dispatch({
                        type: "REST_HERO",
                        heroId: selectedHero.id,
                        duration: getRestDuration(selectedHero, restMult),
                      })}
                    >
                      Rest ({Math.ceil(getRestDuration(selectedHero, restMult) / 1000)}s)
                    </button>
                    <button
                      className={`${styles.potionBtn} juiceBtn`}
                      disabled={!canAffordPotion}
                      onClick={() => dispatch({
                        type: "USE_POTION",
                        heroId: selectedHero.id,
                        cost: potCost,
                      })}
                    >
                      Potion (<ResourceCost costs={potCost} available={state.resources} />)
                    </button>
                  </div>
                )}
              </PixelFrame>
            );
          })()}

          {/* Title */}
          {(() => {
            const unlockedTitles = getUnlockedTitles(state.stats, state.worldMap, state.prestige);
            const currentTitle = selectedHero.activeTitle ? getTitleById(selectedHero.activeTitle) : null;
            return (
              <div className={styles.titleSection}>
                <div className={styles.titleHeader}>
                  <span className={styles.titleLabel}>Title</span>
                  <button
                    className={styles.titlePickerBtn}
                    onClick={() => setShowTitlePicker(true)}
                    disabled={unlockedTitles.length === 0}
                  >
                    {currentTitle ? currentTitle.name : "None"} {unlockedTitles.length > 0 ? "\u25BE" : ""}
                  </button>
                </div>
                {currentTitle && (
                  <span className={styles.titleBonus}>{currentTitle.bonus.label}</span>
                )}
                {unlockedTitles.length === 0 && (
                  <span className={styles.titleHint}>Titles are earned, not given.</span>
                )}
              </div>
            );
          })()}

          {/* Skills */}
          <h4 className={styles.sectionHeading}>Skills</h4>
          <div className={styles.skillList}>
            {getHeroSkills(selectedHero.templateId).map((skill) => (
              <SkillBadge
                key={skill.id}
                skill={skill}
                unlocked={selectedHero.level >= skill.unlockHeroLevel}
                heroLevel={selectedHero.level}
              />
            ))}
          </div>

          {/* Equipment Slots */}
          <h4 className={styles.sectionHeading}>Equipment</h4>
          <div className={styles.equipSlots}>
            {["weapon", "armor", "accessory"].map((slot) => {
              const itemId = selectedHero.equipment[slot];
              const item = itemId ? state.inventory.find((i) => i.id === itemId) : null;
              // Empty-slot silhouette hint per slot type — use registered icon keys, not sheet aliases.
              const slotHintSprite = slot === "weapon" ? "iron_sword" : slot === "armor" ? "iron_shield" : "scouts_ring";
              const rarityTint = item ? getRarityColor(item.rarity) : null;

              return (
                <PixelFrame
                  key={slot}
                  variant="iron"
                  className={`${styles.equipSlot} ${item ? styles.equipSlotFilled : styles.equipSlotEmpty}`}
                >
                  <span className={styles.slotLabel}>{slot}</span>
                  <div
                    className={styles.equipWell}
                    style={item ? { boxShadow: `inset 0 0 0 1px ${rarityTint}66, 0 0 8px ${rarityTint}44` } : undefined}
                  >
                    {item ? (
                      <div className={styles.equippedItem}>
                        <span
                          className={styles.equippedName}
                          style={{ color: rarityTint }}
                        >
                          <Sprite name={item.icon} size={16} /> {item.name}{(item.level || 1) > 1 ? ` Lv.${item.level}` : ""}
                        </span>
                        <button
                          className={styles.unequipBtn}
                          onClick={() => handleUnequip(slot)}
                          disabled={selectedHero.status === "expedition" || selectedHero.status === "exploring"}
                          aria-label={`Unequip ${slot}`}
                        >
                          {"\u2715"}
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`${styles.equipBtn} juiceBtn`}
                        onClick={() => setEquipSlot(slot)}
                        disabled={selectedHero.status === "expedition" || selectedHero.status === "exploring"}
                      >
                        <span className={styles.slotSilhouette} aria-hidden="true">
                          <Sprite name={slotHintSprite} size={20} />
                        </span>
                        <span className={styles.equipBtnLabel}>+ Equip</span>
                      </button>
                    )}
                  </div>
                </PixelFrame>
              );
            })}
          </div>

          {/* Level Up */}
          <button
            className={`${styles.levelUpBtn} juiceBtn`}
            onClick={handleLevelUp}
            disabled={!canLevel || selectedHero.status !== "idle"}
          >
            Level Up (<Sprite name="gold" size={14} /> {levelCost})
          </button>
        </PixelFrame>
      )}

      {/* Equipment Picker Modal */}
      {equipSlot && (() => {
        const pickerItems = getUnequippedItems(state.inventory, equipSlot);
        return (
          <Modal title={`Equip ${equipSlot}`} onClose={() => setEquipSlot(null)}>
            {pickerItems.length > 0 && (
              <div className={styles.invHeader}>
                <div className={styles.viewToggle} role="group" aria-label="Inventory view">
                  <button
                    className={`${styles.viewToggleBtn} ${inventoryView === "list" ? styles.active : ""}`}
                    onClick={() => setInventoryView("list")}
                    aria-pressed={inventoryView === "list"}
                  >
                    List
                  </button>
                  <button
                    className={`${styles.viewToggleBtn} ${inventoryView === "grid" ? styles.active : ""}`}
                    onClick={() => setInventoryView("grid")}
                    aria-pressed={inventoryView === "grid"}
                  >
                    Grid
                  </button>
                </div>
              </div>
            )}
            <PixelFrame variant="parchment" className={styles.invFrame}>
              <div className={inventoryView === "grid" ? styles.invGrid : styles.equipPicker}>
                {pickerItems.length === 0 ? (
                  <p className={styles.empty}>Nothing forged for this slot yet.</p>
                ) : (
                  pickerItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      compact={inventoryView === "grid"}
                      onClick={() => handleEquip(item.id)}
                    />
                  ))
                )}
              </div>
            </PixelFrame>
          </Modal>
        );
      })()}

      {/* Title Picker Modal */}
      {showTitlePicker && selectedHero && (() => {
        const equippedTitleId = selectedHero.activeTitle;
        return (
          <Modal title="Choose Title" onClose={() => setShowTitlePicker(false)}>
            <div className={styles.titlePicker}>
              <div className={`${styles.titleOptionWrap} ${!equippedTitleId ? styles.titleOptionWrapEquipped : ""}`}>
                <PixelFrame
                  variant="iron"
                  active={!equippedTitleId}
                  className={styles.titleOption}
                >
                  <button
                    className={styles.titleOptionBtn}
                    onClick={() => {
                      dispatch({ type: "SET_ACTIVE_TITLE", heroId: selectedHero.id, titleId: null });
                      setShowTitlePicker(false);
                    }}
                  >
                    <span className={styles.titleOptHeader}>
                      <span className={styles.titleOptName}>None</span>
                      {!equippedTitleId && <span className={styles.titleOptEquippedTag}>Equipped</span>}
                    </span>
                    <span className={styles.titleOptDesc}>No title bonus</span>
                  </button>
                </PixelFrame>
              </div>
              {getUnlockedTitles(state.stats, state.worldMap, state.prestige).map((title) => {
                const isEquipped = equippedTitleId === title.id;
                return (
                  <div
                    key={title.id}
                    className={`${styles.titleOptionWrap} ${isEquipped ? styles.titleOptionWrapEquipped : ""}`}
                  >
                    <PixelFrame
                      variant="iron"
                      active={isEquipped}
                      className={styles.titleOption}
                    >
                      <button
                        className={styles.titleOptionBtn}
                        onClick={() => {
                          dispatch({ type: "SET_ACTIVE_TITLE", heroId: selectedHero.id, titleId: title.id });
                          setShowTitlePicker(false);
                        }}
                      >
                        <span className={styles.titleOptHeader}>
                          <span className={styles.titleOptName}>{title.name}</span>
                          {isEquipped && <span className={styles.titleOptEquippedTag}>Equipped</span>}
                        </span>
                        <span className={styles.titleOptDesc}>{title.description}</span>
                        <span className={styles.titleOptBonus}>{title.bonus.label}</span>
                      </button>
                    </PixelFrame>
                  </div>
                );
              })}
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
