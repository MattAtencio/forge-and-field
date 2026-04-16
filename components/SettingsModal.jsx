"use client";

import { useEffect, useRef, useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { exportSave, importSave } from "@/lib/save";
import Modal from "./shared/Modal";
import styles from "./SettingsModal.module.css";

// Keys are flat strings so migrations never touch them.
const ANIM_KEY = "ff_anim_intensity";
const SFX_KEY = "ff_sfx_volume";
const SAVE_KEY = "forgeAndField_save";

const MOTION_OPTIONS = [
  { value: "full", label: "Full" },
  { value: "reduced", label: "Reduced" },
  { value: "off", label: "Off" },
];

function todayStamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function SettingsModal({ onClose }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [message, setMessage] = useState(null);
  const [motion, setMotion] = useState("full");
  const [sfxVolume, setSfxVolume] = useState(80);
  const fileInputRef = useRef(null);

  // Load persisted settings on mount. Attribute may already be set by
  // a sibling effect; we re-assert it to stay the source of truth.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedMotion = localStorage.getItem(ANIM_KEY) || "full";
    const savedVolume = Number(localStorage.getItem(SFX_KEY));
    setMotion(savedMotion);
    if (Number.isFinite(savedVolume)) setSfxVolume(savedVolume);
    document.documentElement.dataset.animIntensity = savedMotion;
  }, []);

  const handleMotionChange = (value) => {
    setMotion(value);
    localStorage.setItem(ANIM_KEY, value);
    document.documentElement.dataset.animIntensity = value;
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    setSfxVolume(value);
    localStorage.setItem(SFX_KEY, String(value));
  };

  const handleExport = () => {
    try {
      const json = exportSave(state);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `forge-and-field-save-${todayStamp()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: "success", text: "Backup downloaded." });
    } catch {
      setMessage({ type: "error", text: "Could not prepare backup file." });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    // Reset the input so selecting the same file twice still fires change.
    e.target.value = "";
    if (!file) return;
    const ok = window.confirm("This will overwrite your current save. Continue?");
    if (!ok) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const migrated = importSave(text);
        localStorage.setItem(SAVE_KEY, JSON.stringify(migrated));
        location.reload();
      } catch {
        setMessage({ type: "error", text: "That file could not be read as a save." });
      }
    };
    reader.onerror = () => {
      setMessage({ type: "error", text: "Could not read the selected file." });
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure? This will erase all progress.")) {
      dispatch({ type: "RESET_GAME" });
      setMessage({ type: "success", text: "Game reset." });
    }
  };

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className={styles.settings}>
        {/* Motion — accessibility-first, not cosmetic. */}
        <div className={styles.section}>
          <h4 className={styles.label}>Motion</h4>
          <p className={styles.desc}>Calm the screen if animation feels like too much.</p>
          <div className={styles.segmented} role="radiogroup" aria-label="Motion intensity">
            {MOTION_OPTIONS.map((opt) => {
              const active = motion === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`${styles.segment} ${active ? styles.segmentActive : ""}`}
                  onClick={() => handleMotionChange(opt.value)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sound — slider stub; audio not wired yet, plumbing only. */}
        <div className={styles.section}>
          <h4 className={styles.label}>Sound</h4>
          <div className={styles.sliderRow}>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={sfxVolume}
              onChange={handleVolumeChange}
              className={styles.slider}
              aria-label="Sound effects volume"
            />
            <span className={styles.sliderValue}>{sfxVolume}%</span>
          </div>
        </div>

        {/* Backup — file I/O keeps this portable across devices. */}
        <div className={styles.section}>
          <h4 className={styles.label}>Save a backup</h4>
          <p className={styles.desc}>Download your progress as a file you can keep.</p>
          <button className={styles.primaryBtn} onClick={handleExport}>
            Save a backup
          </button>
        </div>

        <div className={styles.section}>
          <h4 className={styles.label}>Restore a backup</h4>
          <p className={styles.desc}>Replace your current save with a file you saved earlier.</p>
          <button className={styles.primaryBtn} onClick={handleImportClick}>
            Choose a file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className={styles.hiddenInput}
          />
        </div>

        {/* Reset */}
        <div className={styles.section}>
          <button className={styles.dangerBtn} onClick={handleReset}>
            Reset All Progress
          </button>
        </div>

        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
      </div>
    </Modal>
  );
}
