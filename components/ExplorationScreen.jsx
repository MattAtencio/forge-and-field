"use client";

import { useState, useMemo } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getAdjacentNodes, getMoveCost, getLootBagSummary } from "@/lib/exploration";
import { getUsableConsumables } from "@/lib/consumables";
import { getRegionById } from "@/data/regions";
import { RESOURCES } from "@/data/resources";
import { EXPLORATION_TEXT } from "@/data/explorationText";
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

// Single-glyph silhouette per node type so type reads even desaturated.
const NODE_GLYPHS = {
  start: "△",
  combat: "✕",
  resource: "◆",
  rest: "◯",
  poi: "?",
  boss: "✦",
};

export default function ExplorationScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showLootModal, setShowLootModal] = useState(false);
  const [retreatSummary, setRetreatSummary] = useState(null);
  const [defeatSummary, setDefeatSummary] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(
    state.player?.explorationTutorialDone ? -1 : 0
  );

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

  const mapConsumables = getUsableConsumables(state.inventory, "exploration");

  // Retreat summary overlay — parchment frame, warm in-voice headline, bordered chips
  if (retreatSummary) {
    const hasResources = Object.keys(retreatSummary.resources).length > 0;
    const itemCount = retreatSummary.items.length;
    return (
      <div className={styles.screen} style={{ background: region?.theme?.bg || "#0d1f0d" }}>
        <div className={styles.overlay}>
          <PixelFrame variant="parchment" className={styles.resultModal}>
            <h2 className={styles.resultTitleRetreat}>Safe Return</h2>
            <p className={styles.resultText}>The forge receives your haul.</p>
            {(hasResources || itemCount > 0) && (
              <div className={styles.resultLoot}>
                {hasResources && Object.entries(retreatSummary.resources).map(([key, amount]) => (
                  <span key={key} className={styles.resultResource}>
                    <Sprite name={RESOURCES[key]?.icon || key} size={14} /> {Math.round(amount)} {RESOURCES[key]?.name || key}
                  </span>
                ))}
                {itemCount > 0 && (
                  <span className={styles.resultItemsChip}>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
                )}
              </div>
            )}
            <button
              className={`${styles.resultBtn} juiceBtn`}
              onClick={() => {
                setRetreatSummary(null);
                dispatch({ type: "SET_SCREEN", screen: "expedition" });
              }}
            >
              Return to Forge
            </button>
          </PixelFrame>
        </div>
      </div>
    );
  }

  // Defeat summary overlay — parchment frame, muted in-voice headline, iron press button
  if (defeatSummary) {
    return (
      <div className={styles.screen} style={{ background: "#0f0e17" }}>
        <div className={styles.overlay}>
          <PixelFrame variant="parchment" className={styles.resultModal}>
            <h2 className={styles.resultTitleDefeat}>Fallen</h2>
            <p className={styles.resultText}>The forest takes what it is owed. Your pack is lost.</p>
            <button
              className={`${styles.resultBtn} ${styles.resultBtnDefeat} juiceBtn`}
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
  const enduranceLow = endPct < 30;
  const enduranceCritical = endPct < 15;

  // Boss adjacency drives a deeper glow + an in-voice hint near the action drawer
  const adjacentToBoss = adjacent.some((n) => n.type === "boss");

  return (
    <div className={styles.screen} style={{ background: region?.theme?.bg || "#0d1f0d" }}>
      {/* Top header — parchment frame (info) */}
      <PixelFrame variant="parchment" className={styles.headerFrame}>
        <div className={styles.headerTop}>
          <h2 className={styles.regionName}>{region?.name || "Exploration"}</h2>
          <button
            className={styles.retreatBtn}
            onClick={handleRetreat}
            disabled={!canRetreat}
          >
            Retreat
          </button>
        </div>
        <div className={styles.heroInfo}>
          <Sprite name={hero.templateId} size={24} />
          <span className={styles.heroName}>{hero.name}</span>
          <span
            className={`${styles.enduranceText} ${
              enduranceCritical ? styles.enduranceTextDanger : enduranceLow ? styles.enduranceTextWarn : ""
            }`}
          >
            {hero.endurance?.current || 0}/{hero.endurance?.max || 100}
          </span>
        </div>
        {/* Iron sub-frame plate around the bar — bordered, NOT a nested PixelFrame */}
        <div className={styles.endurancePlate}>
          <div className={styles.enduranceBar}>
            <div
              className={`${styles.enduranceFill} ${
                enduranceCritical
                  ? styles.enduranceFillDanger
                  : enduranceLow
                  ? styles.enduranceFillWarn
                  : styles.enduranceFillSafe
              }`}
              style={{ width: `${endPct}%` }}
            />
          </div>
        </div>
        {enduranceCritical && (
          <p className={styles.enduranceVoice}>Your strength wanes.</p>
        )}
      </PixelFrame>

      {/* Map viewport — parchment frame */}
      <PixelFrame variant="parchment" className={styles.mapFrame}>
        <div className={styles.mapContainer}>
          <svg viewBox="0 0 100 100" className={styles.mapSvg}>
            {/* Edges — tinted by traversal state */}
            {nodeMap.edges.map(([a, b], i) => {
              const nodeA = nodeMap.nodes.find((n) => n.id === a);
              const nodeB = nodeMap.nodes.find((n) => n.id === b);
              if (!nodeA || !nodeB) return null;
              const reachableNow =
                (exp.currentNode === a && adjacentIds.includes(b)) ||
                (exp.currentNode === b && adjacentIds.includes(a));
              const aVisited = exp.visitedNodes.includes(a);
              const bVisited = exp.visitedNodes.includes(b);
              // Visited path = both endpoints visited (the trail you walked)
              const isVisitedPath = aVisited && bVisited;
              const cls = reachableNow
                ? styles.pathReachable
                : isVisitedPath
                ? styles.pathVisited
                : styles.pathLocked;
              return (
                <line
                  key={i}
                  x1={nodeA.x}
                  y1={nodeA.y}
                  x2={nodeB.x}
                  y2={nodeB.y}
                  className={cls}
                />
              );
            })}

            {/* Nodes */}
            {nodeMap.nodes.map((node) => {
              const isCurrent = node.id === exp.currentNode;
              const isAdj = adjacentIds.includes(node.id);
              const isVisited = exp.visitedNodes.includes(node.id);
              const isBoss = node.type === "boss";
              const color = NODE_COLORS[node.type] || "#666";
              const radius = isBoss ? 3.5 : 2.5;
              const opacity = isCurrent || isAdj ? 1 : isVisited ? 0.55 : 0.3;
              const glyph = NODE_GLYPHS[node.type] || "";

              return (
                <g
                  key={node.id}
                  className={isAdj ? styles.nodeGroupAdj : styles.nodeGroup}
                  onClick={() => isAdj && setSelectedNode(node)}
                >
                  {/* Adjacent halo: warm pulse telegraphs reachability */}
                  {isAdj && !isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius + 1.5}
                      fill={isBoss ? "#f97316" : "#fbbf24"}
                      className={isBoss ? styles.haloBoss : styles.haloAdj}
                    />
                  )}
                  {/* Current node ember ring */}
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius + 1.6}
                      fill="none"
                      stroke="#f97316"
                      className={styles.ringCurrent}
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={color}
                    opacity={opacity}
                    stroke={isCurrent ? "#f97316" : isBoss ? "#fbbf24" : isAdj ? "#e8e0d4" : "none"}
                    strokeWidth={isBoss ? 0.55 : 0.4}
                    className={`${styles.nodeBody} ${isCurrent ? styles.nodeBodyCurrent : ""}`}
                  />
                  {/* Inner glyph cue — readable even when desaturated */}
                  <text
                    x={node.x}
                    y={node.y + (isBoss ? 1.2 : 0.85)}
                    textAnchor="middle"
                    fontSize={isBoss ? 3.2 : 2.4}
                    className={`${styles.nodeIcon} ${!(isCurrent || isAdj) ? styles.nodeIconMuted : ""}`}
                  >
                    {glyph}
                  </text>
                  {/* Visited check overlay (skip when current — current ring conveys position) */}
                  {isVisited && !isCurrent && (
                    <text
                      x={node.x + radius * 0.85}
                      y={node.y - radius * 0.55}
                      textAnchor="middle"
                      fontSize="1.8"
                      className={styles.nodeCheck}
                    >
                      ✓
                    </text>
                  )}
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
      </PixelFrame>

      {/* Node Detail Panel (already wears its own PixelFrame) */}
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

      {/* Action drawer — iron frame (action surface) */}
      <PixelFrame variant="iron" className={styles.actionDrawer}>
        {adjacentToBoss && (
          <span className={styles.bossHint}>The deep iron waits.</span>
        )}
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
        {!adjacentToBoss && mapConsumables.length === 0 && (
          <span style={{ fontSize: "0.7rem", color: "#64748b", fontStyle: "italic" }}>
            The trail waits.
          </span>
        )}
      </PixelFrame>

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

      {/* Tutorial Overlay */}
      {tutorialStep >= 0 && tutorialStep <= 2 && (
        <div className={styles.overlay}>
          <PixelFrame variant="parchment" className={styles.tutorialModal}>
            {tutorialStep === 0 && (
              <p className={styles.tutorialText}>
                The forest opens before you. Each mark on the trail is a choice — shelter, danger, or fortune.
              </p>
            )}
            {tutorialStep === 1 && (
              <p className={styles.tutorialText}>
                Your strength is not infinite. Every step costs endurance. Press too far and you will not make it back.
              </p>
            )}
            {tutorialStep === 2 && (
              <p className={styles.tutorialText}>
                What you find stays in your pack until you return to the forge. If you fall, the forest takes it all.
              </p>
            )}
            <button
              className={`${styles.resultBtn} juiceBtn`}
              onClick={() => {
                if (tutorialStep < 2) {
                  setTutorialStep(tutorialStep + 1);
                } else {
                  setTutorialStep(-1);
                  dispatch({ type: "EXPLORATION_TUTORIAL_COMPLETE" });
                }
              }}
            >
              {tutorialStep < 2 ? "Next" : "Begin"}
            </button>
          </PixelFrame>
        </div>
      )}
    </div>
  );
}
