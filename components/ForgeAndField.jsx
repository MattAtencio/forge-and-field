"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GameProvider, useGameState, useGameDispatch } from "@/lib/gameContext";
import { getDevSpeed } from "@/lib/devSpeed";
import { calculateOfflineProgress } from "@/lib/tick";
import { getPlayerLevel, getUnlocksForLevel } from "@/data/progression";
import { HERO_TEMPLATES } from "@/data/heroes";
import { createHeroFromTemplate } from "@/lib/hero";
import ResourceBar from "./shared/ResourceBar";
import NavBar from "./shared/NavBar";
import HubScreen from "./HubScreen";
import ForgeScreen from "./ForgeScreen";
import BarracksScreen from "./BarracksScreen";
import WorldMapScreen from "./WorldMapScreen";
import SeasonScreen from "./SeasonScreen";
import VillageScreen from "./VillageScreen";
import OnboardingModal from "./onboarding/OnboardingModal";
import WelcomeBackModal from "./WelcomeBackModal";
import HeroUnlockModal from "./HeroUnlockModal";
import SettingsModal from "./SettingsModal";
import ExplorationScreen from "./ExplorationScreen";
import styles from "./ForgeAndField.module.css";

function GameShell() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const tickRef = useRef(null);
  const [offlineData, setOfflineData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [unlockedHeroes, setUnlockedHeroes] = useState([]);
  const initializedRef = useRef(false);

  // Calculate offline progress on first load
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const progress = calculateOfflineProgress(state);
    if (progress && progress.elapsed > 60000) {
      // Only show modal if away > 1 minute
      setOfflineData(progress);
    }
    dispatch({ type: "TICK", now: Date.now() });
  }, []);

  // Game tick loop — 1 second interval
  useEffect(() => {
    tickRef.current = setInterval(() => {
      dispatch({ type: "TICK", now: Date.now() });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [dispatch]);

  // Check for level-ups after XP changes
  useEffect(() => {
    const computedLevel = getPlayerLevel(state.player.xp);
    if (computedLevel > state.player.level) {
      const unlocks = getUnlocksForLevel(computedLevel);
      dispatch({
        type: "LEVEL_UP_PLAYER",
        newLevel: computedLevel,
        newUnlocks: unlocks.screens,
      });
    }
  }, [state.player.xp, state.player.level, dispatch]);

  // Retroactive hero recruitment — fix for existing saves missing heroes
  useEffect(() => {
    const missing = HERO_TEMPLATES.filter(
      (t) => t.unlockLevel <= state.player.level && !state.heroes.find((h) => h.templateId === t.id)
    );
    if (missing.length > 0) {
      const recruited = missing.map((t) => createHeroFromTemplate(t));
      for (const hero of recruited) {
        dispatch({ type: "RECRUIT_HERO", hero });
      }
      setUnlockedHeroes(recruited);
    }
  }, []); // Run once on load

  // Show unlock modal when reducer signals new heroes
  useEffect(() => {
    if (state._newlyRecruitedHeroes?.length > 0) {
      setUnlockedHeroes((prev) => [...prev, ...state._newlyRecruitedHeroes]);
      dispatch({ type: "CLEAR_NEW_HEROES" });
    }
  }, [state._newlyRecruitedHeroes, dispatch]);

  const handleTutorialComplete = useCallback(() => {
    dispatch({ type: "SET_TUTORIAL_DONE" });
  }, [dispatch]);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case "forge":
        return <ForgeScreen />;
      case "barracks":
        return <BarracksScreen />;
      case "expedition":
        return <WorldMapScreen />;
      case "season":
        return <SeasonScreen />;
      case "village":
        return <VillageScreen />;
      case "hub":
      default:
        return <HubScreen onOpenSettings={() => setShowSettings(true)} />;
    }
  };

  const devSpeed = getDevSpeed();

  return (
    <div className={styles.container}>
      {devSpeed > 1 && (
        <div
          style={{
            position: "fixed",
            top: 8,
            right: 8,
            zIndex: 9999,
            background: "#f97316",
            color: "#1a1a1a",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 3,
            boxShadow: "0 0 0 1px #1a1a1a, 0 2px 0 #7c2d12",
            letterSpacing: "0.05em",
            pointerEvents: "none",
          }}
        >
          DEV {devSpeed}×
        </div>
      )}
      <ResourceBar />
      <div className={styles.screenArea}>{renderScreen()}</div>
      <NavBar />

      {/* Exploration overlay — fullscreen when active */}
      {state.exploration?.active && <ExplorationScreen />}

      {/* Onboarding — first launch only */}
      {!state.player.tutorialDone && (
        <OnboardingModal onComplete={handleTutorialComplete} />
      )}

      {/* Welcome back — after being away */}
      {offlineData && state.player.tutorialDone && (
        <WelcomeBackModal
          offlineData={offlineData}
          state={state}
          onDismiss={() => setOfflineData(null)}
        />
      )}

      {/* Hero Unlock Celebration */}
      {unlockedHeroes.length > 0 && (
        <HeroUnlockModal
          heroes={unlockedHeroes}
          onDismiss={() => setUnlockedHeroes([])}
        />
      )}

      {/* Settings */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default function ForgeAndField() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
