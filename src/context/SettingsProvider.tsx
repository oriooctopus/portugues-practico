import React, { useState } from "react";
import type { ReactNode } from "react";
import type {
  QuizSettings,
  SettingsContextType,
} from "../types";
import { defaultSettings } from "./defaultSettings";
import { SettingsContext } from "./SettingsContext";

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<
  SettingsProviderProps
> = ({ children }) => {
  const [settings, setSettings] =
    useState<QuizSettings>(
      defaultSettings,
    );

  const updateSettings = (
    newSettings: Partial<QuizSettings>,
  ) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
  };

  return (
    <SettingsContext.Provider
      value={value}
    >
      {children}
    </SettingsContext.Provider>
  );
};
