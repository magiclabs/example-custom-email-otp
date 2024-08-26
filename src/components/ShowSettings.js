import React from "react";
import { magic } from "../lib/magic";

export default function ShowSettings() {
  const handleShowSettings = async () => {
    try{
      await magic.user.showSettings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button className="settings-button" onClick={handleShowSettings}>
      Settings
    </button>
  );
}
