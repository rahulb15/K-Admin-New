import { createContext, useState } from "react";
import merge from "lodash/merge";
// CUSTOM COMPONENT
import { MatLayoutSettings } from "app/components/MatLayout/settings";

export const SettingsContext = createContext({
  settings: MatLayoutSettings,
  updateSettings: () => {}
});

export default function SettingsProvider({ settings, children }) {
  const [currentSettings, setCurrentSettings] = useState(settings || MatLayoutSettings);

  const handleUpdateSettings = (update = {}) => {
    const marged = merge({}, currentSettings, update);
    setCurrentSettings(marged);
  };

  return (
    <SettingsContext.Provider
      value={{ settings: currentSettings, updateSettings: handleUpdateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
