import React, { useState } from "react";
import { SettingsProvider } from "./context/SettingsProvider";
import { QuizProvider } from "./context/QuizProvider";
import { Layout } from "./components/Layout";
import { QuizView } from "./components/QuizView";
import { SettingsView } from "./components/SettingsView";
import { WrongAnswersView } from "./components/WrongAnswersView";

function App() {
  const [currentView, setCurrentView] =
    useState<
      | "quiz"
      | "settings"
      | "wrong-answers"
    >("quiz");

  return (
    <SettingsProvider>
      <QuizProvider>
        <Layout
          currentView={currentView}
          onViewChange={setCurrentView}
        >
          {currentView === "quiz" ? (
            <QuizView />
          ) : currentView ===
            "settings" ? (
            <SettingsView />
          ) : (
            <WrongAnswersView />
          )}
        </Layout>
      </QuizProvider>
    </SettingsProvider>
  );
}

export default App;
