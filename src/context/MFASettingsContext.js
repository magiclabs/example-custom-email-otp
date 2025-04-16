import { createContext, useState } from "react";

const MFASettingsContext = createContext(null);

export const MFASettingsProvider = ({ children }) => {
  const [mfaSettings, setMFASettings] = useState(undefined);

  return (
    <MFASettingsContext.Provider value={{ mfaSettings, setMFASettings }}>
      {children}
    </MFASettingsContext.Provider>
  );
};

export default MFASettingsContext;
