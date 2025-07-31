import type {
  Verb,
  Question,
  QuizSettings,
} from "../types";
import verbsData from "../data/verbs.json";

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
    return null;
  }

  const fullConjugation =
    conjugation[randomPronoun];

  return {
    verb: randomVerb,
    pronoun: randomPronoun,
    tense: randomTense,
    stem: "",
    correctAnswer: fullConjugation,
    fullConjugation,
  };
};
