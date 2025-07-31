import {
  getConjugationKey,
  getSpacedRepetitionEntries,
  updateSpacedRepetitionEntry,
  shouldShowConjugation,
  getDueConjugations,
  getMasteredConjugations,
  getStrugglingConjugations,
  clearSpacedRepetitionData,
} from "../spacedRepetition";
import type {
  Question,
  QuizSettings,
} from "../../types";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(
  window,
  "localStorage",
  {
    value: localStorageMock,
  },
);

describe("Spaced Repetition", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(
      null,
    );
  });

  const mockQuestion: Question = {
    verb: {
      verb: "falar",
      infinitive: "falar",
      translation: "to speak",
      regularity: "regular",
      conjugations: {
        presentIndicative: {
          eu: "falo",
          tu: "falas",
          voce: "fala",
          nos: "falamos",
          voces: "falam",
        },
      },
    },
    pronoun: "eu",
    tense: "presentIndicative",
    stem: "",
    correctAnswer: "falo",
    fullConjugation: "falo",
  };

  const mockSettings: QuizSettings = {
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

  describe("getConjugationKey", () => {
    it("should create a unique key for a conjugation", () => {
      const key = getConjugationKey(
        mockQuestion,
      );
      expect(key).toEqual({
        verb: "falar",
        pronoun: "eu",
        tense: "presentIndicative",
      });
    });
  });

  describe("getSpacedRepetitionEntries", () => {
    it("should return empty array when no data exists", () => {
      const entries =
        getSpacedRepetitionEntries();
      expect(entries).toEqual([]);
    });

    it("should return parsed entries when data exists", () => {
      const mockEntries = [
        {
          key: {
            verb: "falar",
            pronoun: "eu",
            tense: "presentIndicative",
          },
          lastSeen: Date.now(),
          correctCount: 1,
          incorrectCount: 0,
          nextReview:
            Date.now() + 86400000,
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockEntries),
      );

      const entries =
        getSpacedRepetitionEntries();
      expect(entries).toEqual(
        mockEntries,
      );
    });
  });

  describe("updateSpacedRepetitionEntry", () => {
    it("should create new entry for correct answer", () => {
      const now = Date.now();
      jest
        .spyOn(Date, "now")
        .mockReturnValue(now);

      updateSpacedRepetitionEntry(
        mockQuestion,
        true,
        1,
      );

      expect(
        localStorageMock.setItem,
      ).toHaveBeenCalledWith(
        "portuguese_quiz_spaced_repetition",
        JSON.stringify([
          {
            key: {
              verb: "falar",
              pronoun: "eu",
              tense:
                "presentIndicative",
            },
            lastSeen: now,
            correctCount: 1,
            incorrectCount: 0,
            nextReview:
              now +
              365 * 24 * 60 * 60 * 1000, // 1 year
          },
        ]),
      );
    });

    it("should create new entry for incorrect answer", () => {
      const now = Date.now();
      jest
        .spyOn(Date, "now")
        .mockReturnValue(now);

      updateSpacedRepetitionEntry(
        mockQuestion,
        false,
        2,
      );

      expect(
        localStorageMock.setItem,
      ).toHaveBeenCalledWith(
        "portuguese_quiz_spaced_repetition",
        JSON.stringify([
          {
            key: {
              verb: "falar",
              pronoun: "eu",
              tense:
                "presentIndicative",
            },
            lastSeen: now,
            correctCount: 0,
            incorrectCount: 1,
            nextReview:
              now +
              2 * 24 * 60 * 60 * 1000, // 2 days
          },
        ]),
      );
    });
  });

  describe("shouldShowConjugation", () => {
    it("should return true when spaced repetition is disabled", () => {
      const disabledSettings = {
        ...mockSettings,
        spacedRepetition: {
          enabled: false,
          reviewIntervalDays: 1,
        },
      };

      const shouldShow =
        shouldShowConjugation(
          mockQuestion,
          disabledSettings,
        );
      expect(shouldShow).toBe(true);
    });

    it("should return true for new conjugation", () => {
      const shouldShow =
        shouldShowConjugation(
          mockQuestion,
          mockSettings,
        );
      expect(shouldShow).toBe(true);
    });

    it("should return true for conjugation due for review", () => {
      const now = Date.now();
      const pastTime = now - 86400000; // 1 day ago

      const mockEntries = [
        {
          key: {
            verb: "falar",
            pronoun: "eu",
            tense: "presentIndicative",
          },
          lastSeen: pastTime,
          correctCount: 0,
          incorrectCount: 1,
          nextReview: pastTime, // Due for review
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockEntries),
      );

      const shouldShow =
        shouldShowConjugation(
          mockQuestion,
          mockSettings,
        );
      expect(shouldShow).toBe(true);
    });

    it("should return false for mastered conjugation", () => {
      const now = Date.now();
      const futureTime = now + 86400000; // 1 day in future

      const mockEntries = [
        {
          key: {
            verb: "falar",
            pronoun: "eu",
            tense: "presentIndicative",
          },
          lastSeen: now,
          correctCount: 2,
          incorrectCount: 0,
          nextReview: futureTime, // Not due for review
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockEntries),
      );

      const shouldShow =
        shouldShowConjugation(
          mockQuestion,
          mockSettings,
        );
      expect(shouldShow).toBe(false);
    });
  });

  describe("getDueConjugations", () => {
    it("should return empty array when spaced repetition is disabled", () => {
      const disabledSettings = {
        ...mockSettings,
        spacedRepetition: {
          enabled: false,
          reviewIntervalDays: 1,
        },
      };

      const dueConjugations =
        getDueConjugations(
          disabledSettings,
        );
      expect(dueConjugations).toEqual(
        [],
      );
    });

    it("should return conjugations due for review", () => {
      const now = Date.now();
      const pastTime = now - 86400000; // 1 day ago

      const mockEntries = [
        {
          key: {
            verb: "falar",
            pronoun: "eu",
            tense: "presentIndicative",
          },
          lastSeen: pastTime,
          correctCount: 0,
          incorrectCount: 1,
          nextReview: pastTime, // Due for review
        },
        {
          key: {
            verb: "comer",
            pronoun: "tu",
            tense: "presentIndicative",
          },
          lastSeen: now,
          correctCount: 1,
          incorrectCount: 0,
          nextReview: now + 86400000, // Not due for review
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockEntries),
      );

      const dueConjugations =
        getDueConjugations(
          mockSettings,
        );
      expect(dueConjugations).toEqual([
        {
          verb: "falar",
          pronoun: "eu",
          tense: "presentIndicative",
        },
      ]);
    });
  });

  describe("getMasteredConjugations", () => {
    it("should return conjugations with 2+ correct answers", () => {
      const mockEntries = [
        {
          key: {
            verb: "falar",
            pronoun: "eu",
            tense: "presentIndicative",
          },
          lastSeen: Date.now(),
          correctCount: 2,
          incorrectCount: 0,
          nextReview:
            Date.now() + 86400000,
        },
        {
          key: {
            verb: "comer",
            pronoun: "tu",
            tense: "presentIndicative",
          },
          lastSeen: Date.now(),
          correctCount: 1,
          incorrectCount: 0,
          nextReview:
            Date.now() + 86400000,
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockEntries),
      );

      const mastered =
        getMasteredConjugations();
      expect(mastered).toEqual([
        {
          verb: "falar",
          pronoun: "eu",
          tense: "presentIndicative",
        },
      ]);
    });
  });

  describe("getStrugglingConjugations", () => {
    it("should return conjugations with 2+ incorrect answers", () => {
      const mockEntries = [
        {
          key: {
            verb: "falar",
            pronoun: "eu",
            tense: "presentIndicative",
          },
          lastSeen: Date.now(),
          correctCount: 0,
          incorrectCount: 2,
          nextReview:
            Date.now() + 86400000,
        },
        {
          key: {
            verb: "comer",
            pronoun: "tu",
            tense: "presentIndicative",
          },
          lastSeen: Date.now(),
          correctCount: 0,
          incorrectCount: 1,
          nextReview:
            Date.now() + 86400000,
        },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockEntries),
      );

      const struggling =
        getStrugglingConjugations();
      expect(struggling).toEqual([
        {
          verb: "falar",
          pronoun: "eu",
          tense: "presentIndicative",
        },
      ]);
    });
  });

  describe("clearSpacedRepetitionData", () => {
    it("should clear localStorage data", () => {
      clearSpacedRepetitionData();
      expect(
        localStorageMock.removeItem,
      ).toHaveBeenCalledWith(
        "portuguese_quiz_spaced_repetition",
      );
    });
  });
});
