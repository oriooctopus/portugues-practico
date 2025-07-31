export interface Verb {
  verb: string;
  infinitive: string;
  translation: string;
  regularity: "regular" | "irregular";
  irregular_category?: string[];
  conjugations: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export interface QuizSettings {
  pronouns: {
    eu: boolean;
    tu: boolean;
    voce: boolean;
    nos: boolean;
    voces: boolean;
  };
  tenses: {
    presentIndicative: boolean;
    preteriteIndicative: boolean;
    imperfectIndicative: boolean;
    futureIndicative: boolean;
    conditionalIndicative: boolean;
    presentSubjunctive: boolean;
    imperfectSubjunctive: boolean;
    futureSubjunctive: boolean;
    imperative: boolean;
  };
  regularity:
    | "all"
    | "regular"
    | "irregular";
  irregularCategories?: string[];
  spacedRepetition: {
    enabled: boolean;
    reviewIntervalDays: number;
  };
}

export interface QuizState {
  currentQuestion: Question | null;
  score: number;
  totalQuestions: number;
  isAnswered: boolean;
  isCorrect: boolean | null;
  userAnswer: string;
}

export interface Question {
  verb: Verb;
  pronoun: string;
  tense: string;
  stem: string;
  correctAnswer: string;
  fullConjugation: string;
}

export interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

export interface SettingsContextType {
  settings: QuizSettings;
  updateSettings: (
    newSettings: Partial<QuizSettings>,
  ) => void;
}

export type QuizAction =
  | {
      type: "SET_QUESTION";
      payload: Question;
    }
  | {
      type: "SET_ANSWER";
      payload: string;
    }
  | { type: "CHECK_ANSWER" }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET_QUIZ" }
  | { type: "INCREMENT_SCORE" }
  | { type: "RETRY_QUESTION" };
