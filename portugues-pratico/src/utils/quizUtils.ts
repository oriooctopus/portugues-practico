import type {
  Verb,
  Question,
  QuizSettings,
} from "../types";
import verbsData from "../data/verbs.json";
import {
  shouldShowConjugation,
  getDueConjugations,
} from "./spacedRepetition";

export const getFilteredVerbs = (
  settings: QuizSettings,
): Verb[] => {
  return (verbsData as Verb[]).filter(
    (verb) => {
      // Filter by regularity
      if (
        settings.regularity ===
          "regular" &&
        verb.regularity !== "regular"
      ) {
        return false;
      }
      if (
        settings.regularity ===
          "irregular" &&
        verb.regularity !== "irregular"
      ) {
        return false;
      }
      return true;
    },
  );
};

export const getAvailableTenses = (
  settings: QuizSettings,
): string[] => {
  return Object.entries(settings.tenses)
    .filter(([, enabled]) => enabled)
    .map(([tense]) => tense);
};

export const getAvailablePronouns = (
  settings: QuizSettings,
): string[] => {
  return Object.entries(
    settings.pronouns,
  )
    .filter(([, enabled]) => enabled)
    .map(([pronoun]) => pronoun);
};

export const generateQuestion = (
  settings: QuizSettings,
): Question | null => {
  const filteredVerbs =
    getFilteredVerbs(settings);
  const availableTenses =
    getAvailableTenses(settings);
  const availablePronouns =
    getAvailablePronouns(settings);

  if (
    filteredVerbs.length === 0 ||
    availableTenses.length === 0 ||
    availablePronouns.length === 0
  ) {
    return null;
  }

  // Get conjugations due for review if spaced repetition is enabled
  const dueConjugations =
    getDueConjugations(settings);

  // If there are due conjugations, prioritize them
  if (dueConjugations.length > 0) {
    // Randomly select from due conjugations
    const randomDue =
      dueConjugations[
        Math.floor(
          Math.random() *
            dueConjugations.length,
        )
      ];

    // Find the verb for this conjugation
    const verb = filteredVerbs.find(
      (v) =>
        v.infinitive === randomDue.verb,
    );
    if (verb) {
      const conjugation =
        verb.conjugations[
          randomDue.tense
        ];
      if (
        conjugation &&
        conjugation[randomDue.pronoun]
      ) {
        const fullConjugation =
          conjugation[
            randomDue.pronoun
          ];
        return {
          verb,
          pronoun: randomDue.pronoun,
          tense: randomDue.tense,
          stem: "",
          correctAnswer:
            fullConjugation,
          fullConjugation,
        };
      }
    }
  }

  // Generate random questions, but filter by spaced repetition if enabled
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  while (attempts < maxAttempts) {
    // Randomly select verb, tense, and pronoun
    const randomVerb =
      filteredVerbs[
        Math.floor(
          Math.random() *
            filteredVerbs.length,
        )
      ];
    const randomTense =
      availableTenses[
        Math.floor(
          Math.random() *
            availableTenses.length,
        )
      ];
    const randomPronoun =
      availablePronouns[
        Math.floor(
          Math.random() *
            availablePronouns.length,
        )
      ];

    const conjugation =
      randomVerb.conjugations[
        randomTense
      ];
    if (
      !conjugation ||
      !conjugation[randomPronoun]
    ) {
      attempts++;
      continue;
    }

    const fullConjugation =
      conjugation[randomPronoun];

    const question = {
      verb: randomVerb,
      pronoun: randomPronoun,
      tense: randomTense,
      stem: "",
      correctAnswer: fullConjugation,
      fullConjugation,
    };

    // Check if this conjugation should be shown based on spaced repetition
    if (
      shouldShowConjugation(
        question,
        settings,
      )
    ) {
      return question;
    }

    attempts++;
  }

  // If we couldn't find a suitable question, return null
  return null;
};
