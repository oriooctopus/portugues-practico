import React, { useState } from "react";
import { SettingsProvider } from "./context/SettingsProvider";
import { QuizProvider } from "./context/QuizProvider";
import { Layout } from "./components/Layout";
import { QuizView } from "./components/QuizView";
import { SettingsView } from "./components/SettingsView";

function App() {
  const [currentView, setCurrentView] =
    useState<"quiz" | "settings">(
      "quiz",
    );

  return (
    <SettingsProvider>
      <QuizProvider>
        <Layout
          currentView={currentView}
          onViewChange={setCurrentView}
        >
          {currentView === "quiz" ? (
            <QuizView />
          ) : (
            <SettingsView />
          )}
        </Layout>
      </QuizProvider>
    </SettingsProvider>
  );
}

export default App;
