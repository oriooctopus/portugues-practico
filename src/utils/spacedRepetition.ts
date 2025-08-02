import type {
  Question,
  QuizSettings,
} from "../types";

export interface ConjugationKey {
  verb: string;
  pronoun: string;
  tense: string;
}

export interface SpacedRepetitionEntry {
  key: ConjugationKey;
  lastSeen: number; // timestamp
  correctCount: number;
  incorrectCount: number;
  nextReview: number; // timestamp when it should be reviewed again
}

const SPACED_REPETITION_KEY =
  "portuguese_quiz_spaced_repetition";

// Get a unique key for a conjugation
export const getConjugationKey = (
  question: Question,
): ConjugationKey => ({
  verb: question.verb.infinitive,
  pronoun: question.pronoun,
  tense: question.tense,
});

// Get all spaced repetition entries
export const getSpacedRepetitionEntries =
  (): SpacedRepetitionEntry[] => {
    try {
      const stored =
        localStorage.getItem(
          SPACED_REPETITION_KEY,
        );
      return stored
        ? JSON.parse(stored)
        : [];
    } catch (error) {
      console.error(
        "Failed to get spaced repetition entries:",
        error,
      );
      return [];
    }
  };

// Save spaced repetition entries
export const saveSpacedRepetitionEntries =
  (
    entries: SpacedRepetitionEntry[],
  ): void => {
    try {
      localStorage.setItem(
        SPACED_REPETITION_KEY,
        JSON.stringify(entries),
      );
    } catch (error) {
      console.error(
        "Failed to save spaced repetition entries:",
        error,
      );
    }
  };

// Update entry after answering a question
export const updateSpacedRepetitionEntry =
  (
    question: Question,
    isCorrect: boolean,
    reviewIntervalDays: number,
  ): void => {
    const key =
      getConjugationKey(question);
    const entries =
      getSpacedRepetitionEntries();
    const now = Date.now();

    // Find existing entry or create new one
    let entry = entries.find(
      (e) =>
        e.key.verb === key.verb &&
        e.key.pronoun === key.pronoun &&
        e.key.tense === key.tense,
    );

    if (!entry) {
      entry = {
        key,
        lastSeen: now,
        correctCount: 0,
        incorrectCount: 0,
        nextReview: now,
      };
      entries.push(entry);
    }

    // Update counts
    if (isCorrect) {
      entry.correctCount++;
      // If they got it right, they won't see it again (nextReview set to far future)
      entry.nextReview =
        now + 365 * 24 * 60 * 60 * 1000; // 1 year from now
    } else {
      entry.incorrectCount++;
      // If they got it wrong, show it again after the review interval
      entry.nextReview =
        now +
        reviewIntervalDays *
          24 *
          60 *
          60 *
          1000;
    }

    entry.lastSeen = now;

    saveSpacedRepetitionEntries(
      entries,
    );
  };

// Get conjugations that are due for review
export const getDueConjugations = (
  settings: QuizSettings,
): ConjugationKey[] => {
  if (
    !settings.spacedRepetition.enabled
  ) {
    return []; // If spaced repetition is disabled, return empty array
  }

  const entries =
    getSpacedRepetitionEntries();
  const now = Date.now();

  return entries
    .filter(
      (entry) =>
        entry.nextReview <= now,
    )
    .map((entry) => entry.key);
};

// Check if a conjugation should be shown (either new or due for review)
export const shouldShowConjugation = (
  question: Question,
  settings: QuizSettings,
): boolean => {
  if (
    !settings.spacedRepetition.enabled
  ) {
    return true; // If spaced repetition is disabled, show all conjugations
  }

  const key =
    getConjugationKey(question);
  const entries =
    getSpacedRepetitionEntries();

  // Check if this conjugation has been seen before
  const existingEntry = entries.find(
    (e) =>
      e.key.verb === key.verb &&
      e.key.pronoun === key.pronoun &&
      e.key.tense === key.tense,
  );

  if (!existingEntry) {
    return true; // New conjugation, show it
  }

  // Check if it's due for review
  const now = Date.now();
  return (
    existingEntry.nextReview <= now
  );
};

// Get conjugations that have been mastered (correct multiple times)
export const getMasteredConjugations =
  (): ConjugationKey[] => {
    const entries =
      getSpacedRepetitionEntries();
    return entries
      .filter(
        (entry) =>
          entry.correctCount >= 2,
      ) // Consider mastered after 2 correct answers
      .map((entry) => entry.key);
  };

// Get conjugations that need more practice (incorrect multiple times)
export const getStrugglingConjugations =
  (): ConjugationKey[] => {
    const entries =
      getSpacedRepetitionEntries();
    return entries
      .filter(
        (entry) =>
          entry.incorrectCount >= 2,
      ) // Consider struggling after 2 incorrect answers
      .map((entry) => entry.key);
  };

// Clear all spaced repetition data
export const clearSpacedRepetitionData =
  (): void => {
    try {
      localStorage.removeItem(
        SPACED_REPETITION_KEY,
      );
    } catch (error) {
      console.error(
        "Failed to clear spaced repetition data:",
        error,
      );
    }
  };

// Export spaced repetition data
export const exportSpacedRepetitionData =
  (): string => {
    const entries =
      getSpacedRepetitionEntries();
    const dataStr = JSON.stringify(
      entries,
      null,
      2,
    );
    const dataBlob = new Blob(
      [dataStr],
      { type: "application/json" },
    );
    const url =
      URL.createObjectURL(dataBlob);

    const link =
      document.createElement("a");
    link.href = url;
    link.download =
      "spaced_repetition_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return dataStr;
  };
