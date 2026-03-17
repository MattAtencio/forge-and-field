"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getEffectiveStats, getHeroPower, canLevelUp, getUnequippedItems } from "@/lib/hero";
import { getHeroTemplate } from "@/lib/hero";
import { getHeroLevelCost } from "@/data/progression";
import { HERO_TEMPLATES } from "@/data/heroes";
import { getRarityColor } from "@/lib/rarity";
import { getHeroSkills } from "@/lib/skills";
import HeroCard from "./shared/HeroCard";
import ItemCard from "./shared/ItemCard";
import SkillBadge from "./shared/SkillBadge";
import Modal from "./shared/Modal";
import styles from "./BarracksScreen.module.css";

export default function BarracksScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedHeroId, setSelectedHeroId] = useState(state.heroes[0]?.id || null);
  const [equipSlot, setEquipSlot] = useState(null); // 'weapon' | 'armor' | 'accessory' | null

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

          {/* Skills */}
          <h4 className={styles.subheading}>Skills</h4>
          <div className={styles.skillList}>
            {getHeroSkills(selectedHero.templateId).map((skill) => (
              <SkillBadge
                key={skill.id}
                skill={skill}
                unlocked={selectedHero.level >= skill.unlockHeroLevel}
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
                        {item.icon} {item.name}
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
            disabled={!canLevel || selectedHero.status === "expedition"}
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
    </div>
  );
}
