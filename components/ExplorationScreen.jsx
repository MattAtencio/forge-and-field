"use client";

import { useState, useMemo } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getAdjacentNodes, getMoveCost, getLootBagSummary } from "@/lib/exploration";
import { getUsableConsumables } from "@/lib/consumables";
import { getRegionById } from "@/data/regions";
import { RESOURCES } from "@/data/resources";
import ExplorationCombat from "./ExplorationCombat";
import LootBagIndicator from "./LootBagIndicator";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./ExplorationScreen.module.css";

const NODE_COLORS = {
  start: "#e8e0d4",
  combat: "#ef4444",
  resource: "#fbbf24",
  rest: "#22c55e",
  poi: "#a855f7",
  boss: "#f97316",
};

const NODE_LABELS = {
  start: "Safe",
  combat: "Combat",
  resource: "Resource",
  rest: "Rest",
  poi: "Discovery",
  boss: "Boss",
};

export default function ExplorationScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showLootModal, setShowLootModal] = useState(false);
  const [retreatSummary, setRetreatSummary] = useState(null);
  const [defeatSummary, setDefeatSummary] = useState(null);

  const exp = state.exploration;
  if (!exp?.active && !retreatSummary && !defeatSummary) return null;

  const hero = state.heroes.find((h) => h.id === exp?.heroId);
  const region = getRegionById(exp?.regionId);
  const nodeMap = exp?.nodeMap;

  const adjacent = useMemo(
    () => (exp?.active ? getAdjacentNodes(exp) : []),
    [exp?.currentNode, exp?.nodeMap]
  );
  const adjacentIds = adjacent.map((n) => n.id);

  // If in combat, show combat UI
  if (exp?.combat) {
    return <ExplorationCombat />;
  }

  const handleMoveToNode = (nodeId) => {
    dispatch({ type: "EXPLORATION_MOVE", nodeId });
    setSelectedNode(null);
  };

  const handleRetreat = () => {
    const summary = { ...exp.lootBag };
    setRetreatSummary(summary);
    dispatch({ type: "EXPLORATION_RETREAT" });
  };

  const handleUseConsumable = (consumableId) => {
    dispatch({ type: "EXPLORATION_USE_CONSUMABLE", consumableId });
  };

  const currentNode = nodeMap?.nodes.find((n) => n.id === exp?.currentNode);
  const canRetreat = currentNode?.type === "start" || (currentNode?.type !== "combat" && currentNode?.type !== "boss");
  const lootSummary = exp?.lootBag ? getLootBagSummary(exp.lootBag) : { resourceCount: 0, itemCount: 0, isEmpty: true };

  // Consumables usable on the map
  const mapConsumables = getUsableConsumables(state.inventory, "exploration");

  // Retreat summary overlay
  if (retreatSummary) {
    return (
      <div className={styles.screen} style={{ background: region?.theme?.bg || "#0d1f0d" }}>
        <div className={styles.overlay}>
          <PixelFrame variant="parchment" className={styles.resultModal}>
            <h2 className={styles.resultTitle} style={{ color: "#fbbf24" }}>Safe Return</h2>
            <p className={styles.resultText}>The forge receives your haul.</p>
            {Object.keys(retreatSummary.resources).length > 0 && (
              <div className={styles.resultLoot}>
                {Object.entries(retreatSummary.resources).map(([key, amount]) => (
                  <span key={key} className={styles.resultResource}>
                    <Sprite name={RESOURCES[key]?.icon || key} size={14} /> {Math.round(amount)} {RESOURCES[key]?.name || key}
                  </span>
                ))}
              </div>
            )}
            {retreatSummary.items.length > 0 && (
              <p className={styles.resultItems}>{retreatSummary.items.length} item(s) collected</p>
            )}
            <button
              className={`${styles.resultBtn} juiceBtn`}
              onClick={() => {
                setRetreatSummary(null);
                dispatch({ type: "SET_SCREEN", screen: "expedition" });
              }}
            >
              Continue
            </button>
          </PixelFrame>
        </div>
      </div>
    );
  }

  // Defeat summary overlay
  if (defeatSummary) {
    return (
      <div className={styles.screen} style={{ background: "#0f0e17" }}>
        <div className={styles.overlay}>
          <PixelFrame variant="parchment" className={styles.resultModal}>
            <h2 className={styles.resultTitle} style={{ color: "#ef4444" }}>Fallen</h2>
            <p className={styles.resultText}>The forest takes what it is owed. Your pack is lost.</p>
            <button
              className={`${styles.resultBtn} juiceBtn`}
              onClick={() => {
                setDefeatSummary(null);
                dispatch({ type: "SET_SCREEN", screen: "hub" });
              }}
            >
              Return to Forge
            </button>
          </PixelFrame>
        </div>
      </div>
    );
  }

  if (!nodeMap || !hero) return null;

  const endPct = hero.endurance ? (hero.endurance.current / hero.endurance.max) * 100 : 100;

  return (
    <div className={styles.screen} style={{ background: region?.theme?.bg || "#0d1f0d" }}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.regionName}>{region?.name || "Exploration"}</h2>
          <button
            className={`${styles.retreatBtn} juiceBtn`}
            onClick={handleRetreat}
            disabled={!canRetreat}
          >
            Retreat
          </button>
        </div>
        <div className={styles.heroInfo}>
          <Sprite name={hero.templateId} size={24} />
          <span className={styles.heroName}>{hero.name}</span>
          <span className={styles.enduranceText}>
            {hero.endurance?.current || 0}/{hero.endurance?.max || 100}
          </span>
        </div>
        <div className={styles.enduranceBar}>
          <div
            className={styles.enduranceFill}
            style={{
              width: `${endPct}%`,
              background: endPct <= 20 ? "#ef4444" : endPct <= 50 ? "#f59e0b" : "#22c55e",
            }}
          />
        </div>
      </div>

      {/* Node Map SVG */}
      <div className={styles.mapContainer}>
        <svg viewBox="0 0 100 100" className={styles.mapSvg}>
          {/* Edges */}
          {nodeMap.edges.map(([a, b], i) => {
            const nodeA = nodeMap.nodes.find((n) => n.id === a);
            const nodeB = nodeMap.nodes.find((n) => n.id === b);
            if (!nodeA || !nodeB) return null;
            const isWalkable =
              (exp.currentNode === a && adjacentIds.includes(b)) ||
              (exp.currentNode === b && adjacentIds.includes(a));
            return (
              <line
                key={i}
                x1={nodeA.x}
                y1={nodeA.y}
                x2={nodeB.x}
                y2={nodeB.y}
                stroke={isWalkable ? "#94a3b8" : "#334155"}
                strokeWidth={isWalkable ? 0.6 : 0.3}
                strokeDasharray={isWalkable ? "none" : "1 1"}
              />
            );
          })}

          {/* Nodes */}
          {nodeMap.nodes.map((node) => {
            const isCurrent = node.id === exp.currentNode;
            const isAdj = adjacentIds.includes(node.id);
            const isVisited = exp.visitedNodes.includes(node.id);
            const color = NODE_COLORS[node.type] || "#666";
            const radius = node.type === "boss" ? 3.5 : 2.5;

            return (
              <g key={node.id} onClick={() => isAdj && setSelectedNode(node)} style={{ cursor: isAdj ? "pointer" : "default" }}>
                {/* Glow ring for current node */}
                {isCurrent && (
                  <circle cx={node.x} cy={node.y} r={radius + 1.5} fill="none" stroke="#f97316" strokeWidth={0.5} opacity={0.7} />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={color}
                  opacity={isVisited && !isCurrent ? 0.5 : isAdj || isCurrent ? 1 : 0.3}
                  stroke={isCurrent ? "#f97316" : isAdj ? "#e8e0d4" : "none"}
                  strokeWidth={0.4}
                />
                <text
                  x={node.x}
                  y={node.y + radius + 3}
                  textAnchor="middle"
                  fontSize="2.2"
                  fill={isAdj || isCurrent ? "#e8e0d4" : "#64748b"}
                  fontFamily="var(--font-dm-serif), serif"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Detail Panel */}
      {selectedNode && (
        <PixelFrame variant="parchment" className={styles.nodeDetail}>
          <div className={styles.nodeHeader}>
            <span className={styles.nodeType} style={{ color: NODE_COLORS[selectedNode.type] }}>
              {NODE_LABELS[selectedNode.type]}
            </span>
            <h3 className={styles.nodeLabel}>{selectedNode.label}</h3>
          </div>
          <p className={styles.nodeDesc}>{selectedNode.description}</p>
          <div className={styles.nodeActions}>
            <span className={styles.nodeCost}>
              Endurance: -{getMoveCost(nodeMap, selectedNode)}
            </span>
            <button
              className={`${styles.moveBtn} juiceBtn`}
              disabled={hero.endurance.current < getMoveCost(nodeMap, selectedNode)}
              onClick={() => handleMoveToNode(selectedNode.id)}
            >
              Move Here
            </button>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedNode(null)}
            >
              Cancel
            </button>
          </div>
        </PixelFrame>
      )}

      {/* Consumable quick-use (exploration map context) */}
      {mapConsumables.length > 0 && (
        <div className={styles.consumableBar}>
          {mapConsumables.map((item) => (
            <button
              key={item.id}
              className={`${styles.consumableBtn} juiceBtn`}
              onClick={() => handleUseConsumable(item.id)}
              title={item.description}
            >
              <Sprite name={item.icon} size={18} />
              <span className={styles.consumableCount}>{item.count || 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Loot Bag Indicator */}
      <LootBagIndicator
        lootBag={exp.lootBag}
        onClick={() => setShowLootModal(!showLootModal)}
      />

      {/* Loot Bag Modal */}
      {showLootModal && (
        <div className={styles.overlay} onClick={() => setShowLootModal(false)}>
          <PixelFrame variant="parchment" className={styles.lootModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.lootTitle}>Your Pack</h3>
            {lootSummary.isEmpty ? (
              <p className={styles.lootEmpty}>Empty. The journey has only begun.</p>
            ) : (
              <>
                {Object.entries(exp.lootBag.resources).map(([key, amount]) => (
                  <div key={key} className={styles.lootRow}>
                    <Sprite name={RESOURCES[key]?.icon || key} size={16} />
                    <span>{RESOURCES[key]?.name || key}</span>
                    <span className={styles.lootAmount}>{Math.round(amount)}</span>
                  </div>
                ))}
                {exp.lootBag.items.map((item, i) => (
                  <div key={i} className={styles.lootRow}>
                    <Sprite name={item.icon} size={16} />
                    <span>{item.name}</span>
                  </div>
                ))}
                <p className={styles.lootFlavor}>Your pack grows heavier.</p>
              </>
            )}
            <button className={`${styles.closeBtn} juiceBtn`} onClick={() => setShowLootModal(false)}>
              Close
            </button>
          </PixelFrame>
        </div>
      )}
    </div>
  );
}
