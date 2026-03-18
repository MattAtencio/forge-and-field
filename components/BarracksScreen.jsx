"use client";

import { useState } from "react";
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
import styles from "./BarracksScreen.module.css";

export default function BarracksScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedHeroId, setSelectedHeroId] = useState(
    state.screenPayload?.heroId || state.heroes[0]?.id || null
  );
  const [equipSlot, setEquipSlot] = useState(null); // 'weapon' | 'armor' | 'accessory' | null
  const [showTitlePicker, setShowTitlePicker] = useState(false);

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
      <h2 className={styles.heading}>{"\u2694\uFE0F"} Barracks</h2>

      {/* Hero Roster */}
      <div className={styles.roster}>
        {state.heroes.map((hero) => (
          <HeroCard
            key={hero.id}
            hero={hero}
            inventory={state.inventory}
            selected={hero.id === selectedHeroId}
            onClick={() => setSelectedHeroId(hero.id)}
          />
        ))}
      </div>

      {/* Selected Hero Detail */}
      {selectedHero && (
        <div className={styles.detail}>
          <div className={styles.detailHeader}>
            <h3 className={styles.heroName}>{selectedHero.name}</h3>
            <span className={styles.powerBadge}>Power: {power}</span>
          </div>

          {/* Effective Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCell}>
              <span className={styles.statIcon}>{"\u2764\uFE0F"}</span>
              <span className={styles.statLabel}>HP</span>
              <span className={styles.statValue}>{effectiveStats.hp}</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statIcon}>{"\u2694\uFE0F"}</span>
              <span className={styles.statLabel}>ATK</span>
              <span className={styles.statValue}>{effectiveStats.atk}</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statIcon}>{"\u{1F6E1}\uFE0F"}</span>
              <span className={styles.statLabel}>DEF</span>
              <span className={styles.statValue}>{effectiveStats.def}</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statIcon}>{"\u{1F4A8}"}</span>
              <span className={styles.statLabel}>SPD</span>
              <span className={styles.statValue}>{effectiveStats.spd}</span>
            </div>
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
              <div className={styles.enduranceSection}>
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
                {needsRecovery && selectedHero.status === "idle" && (
                  <div className={styles.enduranceActions}>
                    <button
                      className={styles.restBtn}
                      onClick={() => dispatch({
                        type: "REST_HERO",
                        heroId: selectedHero.id,
                        duration: getRestDuration(selectedHero, restMult),
                      })}
                    >
                      Rest ({Math.ceil(getRestDuration(selectedHero, restMult) / 1000)}s)
                    </button>
                    <button
                      className={styles.potionBtn}
                      disabled={!canAffordPotion}
                      onClick={() => dispatch({
                        type: "USE_POTION",
                        heroId: selectedHero.id,
                        cost: potCost,
                      })}
                    >
                      Potion ({Object.entries(potCost).filter(([,v]) => v > 0).map(([res, amt]) => `${RESOURCES[res]?.icon || res} ${amt}`).join(" ")})
                    </button>
                  </div>
                )}
              </div>
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
                  <span className={styles.titleHint}>Complete milestones to earn titles</span>
                )}
              </div>
            );
          })()}

          {/* Skills */}
          <h4 className={styles.subheading}>Skills</h4>
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
          <h4 className={styles.subheading}>Equipment</h4>
          <div className={styles.equipSlots}>
            {["weapon", "armor", "accessory"].map((slot) => {
              const itemId = selectedHero.equipment[slot];
              const item = itemId ? state.inventory.find((i) => i.id === itemId) : null;

              return (
                <div key={slot} className={styles.equipSlot}>
                  <span className={styles.slotLabel}>{slot}</span>
                  {item ? (
                    <div className={styles.equippedItem}>
                      <span
                        className={styles.equippedName}
                        style={{ color: getRarityColor(item.rarity) }}
                      >
                        {item.icon} {item.name}{(item.level || 1) > 1 ? ` Lv.${item.level}` : ""}
                      </span>
                      <button
                        className={styles.unequipBtn}
                        onClick={() => handleUnequip(slot)}
                        disabled={selectedHero.status === "expedition"}
                      >
                        {"\u2715"}
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.equipBtn}
                      onClick={() => setEquipSlot(slot)}
                      disabled={selectedHero.status === "expedition"}
                    >
                      + Equip
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Level Up */}
          <button
            className={styles.levelUpBtn}
            onClick={handleLevelUp}
            disabled={!canLevel || selectedHero.status !== "idle"}
          >
            Level Up ({"\u{1FA99}"} {levelCost})
          </button>
        </div>
      )}

      {/* Equipment Picker Modal */}
      {equipSlot && (
        <Modal title={`Equip ${equipSlot}`} onClose={() => setEquipSlot(null)}>
          <div className={styles.equipPicker}>
            {getUnequippedItems(state.inventory, equipSlot).length === 0 ? (
              <p className={styles.empty}>No {equipSlot} items available</p>
            ) : (
              getUnequippedItems(state.inventory, equipSlot).map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleEquip(item.id)}
                />
              ))
            )}
          </div>
        </Modal>
      )}

      {/* Title Picker Modal */}
      {showTitlePicker && selectedHero && (
        <Modal title="Choose Title" onClose={() => setShowTitlePicker(false)}>
          <div className={styles.titlePicker}>
            <button
              className={`${styles.titleOption} ${!selectedHero.activeTitle ? styles.titleActive : ""}`}
              onClick={() => {
                dispatch({ type: "SET_ACTIVE_TITLE", heroId: selectedHero.id, titleId: null });
                setShowTitlePicker(false);
              }}
            >
              <span className={styles.titleOptName}>None</span>
              <span className={styles.titleOptDesc}>No title bonus</span>
            </button>
            {getUnlockedTitles(state.stats, state.worldMap, state.prestige).map((title) => (
              <button
                key={title.id}
                className={`${styles.titleOption} ${selectedHero.activeTitle === title.id ? styles.titleActive : ""}`}
                onClick={() => {
                  dispatch({ type: "SET_ACTIVE_TITLE", heroId: selectedHero.id, titleId: title.id });
                  setShowTitlePicker(false);
                }}
              >
                <span className={styles.titleOptName}>{title.name}</span>
                <span className={styles.titleOptDesc}>{title.description}</span>
                <span className={styles.titleOptBonus}>{title.bonus.label}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
