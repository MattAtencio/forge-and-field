"use client";

// Import for side effect: patches Date.now() when ?speed=N is in the URL.
// Must run before any game code touches Date.now.
import "./devSpeed";
import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from "react";
import { gameReducer, createInitialState } from "./gameReducer";
import { loadGame, saveGame } from "./save";

const GameStateContext = createContext(null);
const GameDispatchContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    const saved = loadGame();
    return saved ? { ...createInitialState(), ...saved, currentScreen: "hub" } : createInitialState();
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Auto-save on meaningful changes (debounced)
  const saveTimerRef = useRef(null);
  const lastSavedRef = useRef(null);

  const wrappedDispatch = useCallback((action) => {
    dispatch(action);

    // Debounce saves — at most every 2 seconds
    if (action.type !== "TICK") {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveGame(stateRef.current);
        lastSavedRef.current = Date.now();
      }, 100);
    }
  }, []);

  // Periodic save for tick updates (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      saveGame(stateRef.current);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Save on tab hide / app background
  useEffect(() => {
    const handleVisChange = () => {
      if (document.visibilityState === "hidden") {
        saveGame(stateRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);
    return () => document.removeEventListener("visibilitychange", handleVisChange);
  }, []);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={wrappedDispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (ctx === null) throw new Error("useGameState must be used within GameProvider");
  return ctx;
}

export function useGameDispatch() {
  const ctx = useContext(GameDispatchContext);
  if (ctx === null) throw new Error("useGameDispatch must be used within GameProvider");
  return ctx;
}
