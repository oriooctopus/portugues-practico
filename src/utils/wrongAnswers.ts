import type { Question } from "../types";

export interface WrongAnswer {
  verb: string;
  infinitive: string;
  translation: string;
  pronoun: string;
  tense: string;
  userAnswer: string;
  correctAnswer: string;
  fullConjugation: string;
  timestamp: number;
}

const WRONG_ANSWERS_KEY =
  "portuguese_quiz_wrong_answers";

export const saveWrongAnswer = (
  question: Question,
  userAnswer: string,
): void => {
  try {
    const wrongAnswer: WrongAnswer = {
      verb: question.verb.verb,
      infinitive:
        question.verb.infinitive,
      translation:
        question.verb.translation,
      pronoun: question.pronoun,
      tense: question.tense,
      userAnswer: userAnswer.trim(),
      correctAnswer:
        question.correctAnswer,
      fullConjugation:
        question.fullConjugation,
      timestamp: Date.now(),
    };

    const existingWrongAnswers =
      getWrongAnswers();
    existingWrongAnswers.push(
      wrongAnswer,
    );

    // Keep only the last 100 wrong answers to prevent storage bloat
    const limitedWrongAnswers =
      existingWrongAnswers.slice(-100);

    localStorage.setItem(
      WRONG_ANSWERS_KEY,
      JSON.stringify(
        limitedWrongAnswers,
      ),
    );
  } catch (error) {
    console.error(
      "Failed to save wrong answer:",
      error,
    );
  }
};

export const getWrongAnswers =
  (): WrongAnswer[] => {
    try {
      const stored =
        localStorage.getItem(
          WRONG_ANSWERS_KEY,
        );
      return stored
        ? JSON.parse(stored)
        : [];
    } catch (error) {
      console.error(
        "Failed to get wrong answers:",
        error,
      );
      return [];
    }
  };

export const clearWrongAnswers =
  (): void => {
    try {
      localStorage.removeItem(
        WRONG_ANSWERS_KEY,
      );
    } catch (error) {
      console.error(
        "Failed to clear wrong answers:",
        error,
      );
    }
  };

export const exportWrongAnswers =
  (): string => {
    const wrongAnswers =
      getWrongAnswers();
    const dataStr = JSON.stringify(
      wrongAnswers,
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
      "wrong_answers.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return dataStr;
  };
