import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";

export default function ShowSettings({ userInfo, setShowMFASettings }) {
  const { user } = useContext(UserContext);

  const handleMFASettings = async () => {
    await setShowMFASettings(true);
  };

  return (
    <button className="settings-button" onClick={handleMFASettings}>
      {`${user.isMfaEnabled ? "Disable" : "Enable"} MFA`}
    </button>
  );
}
