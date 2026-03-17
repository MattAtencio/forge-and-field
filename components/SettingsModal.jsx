"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { exportSave, importSave } from "@/lib/save";
import Modal from "./shared/Modal";
import styles from "./SettingsModal.module.css";

export default function SettingsModal({ onClose }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState(null);

  const handleExport = async () => {
    const json = exportSave(state);
    try {
      await navigator.clipboard.writeText(json);
      setMessage({ type: "success", text: "Save copied to clipboard!" });
    } catch {
      // Fallback: show in textarea
      setImportText(json);
      setMessage({ type: "info", text: "Copy the text above to save your progress." });
    }
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    try {
      const data = importSave(importText.trim());
      dispatch({ type: "LOAD_SAVE", state: data });
      setMessage({ type: "success", text: "Save loaded successfully!" });
      setImportText("");
    } catch {
      setMessage({ type: "error", text: "Invalid save data. Please check and try again." });
    }
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
        {/* Export */}
        <div className={styles.section}>
          <h4 className={styles.label}>Backup Save</h4>
          <p className={styles.desc}>Copy your save data to restore later.</p>
          <button className={styles.primaryBtn} onClick={handleExport}>
            Export Save
          </button>
        </div>

        {/* Import */}
        <div className={styles.section}>
          <h4 className={styles.label}>Restore Save</h4>
          <textarea
            className={styles.textarea}
            placeholder="Paste save data here..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={3}
          />
          <button
            className={styles.primaryBtn}
            onClick={handleImport}
            disabled={!importText.trim()}
          >
            Import Save
          </button>
        </div>

        {/* Reset */}
        <div className={styles.section}>
          <button className={styles.dangerBtn} onClick={handleReset}>
            Reset All Progress
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
      </div>
    </Modal>
  );
}
