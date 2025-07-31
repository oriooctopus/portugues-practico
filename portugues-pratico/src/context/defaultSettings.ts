import type { QuizSettings } from "../types";

export const defaultSettings: QuizSettings =
  {
    pronouns: {
      eu: true,
      tu: true,
      voce: true,
      nos: true,
      voces: true,
    },
    tenses: {
      presentIndicative: true,
      preteriteIndicative: false,
      imperfectIndicative: false,
      futureIndicative: false,
      conditionalIndicative: false,
      presentSubjunctive: false,
      imperfectSubjunctive: false,
      futureSubjunctive: false,
      imperative: false,
    },
    regularity: "all",
    spacedRepetition: {
      enabled: true,
      reviewIntervalDays: 1,
    },
  };
