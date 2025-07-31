import {
  generateQuestion,
  getFilteredVerbs,
  getAvailableTenses,
  getAvailablePronouns,
} from "../quizUtils";
import type { QuizSettings } from "../../types";

// Mock the verbs data
jest.mock(
  "../../data/verbs.json",
  () => [
    {
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
    {
      verb: "ser",
      infinitive: "ser",
      translation: "to be",
      regularity: "irregular",
      conjugations: {
        presentIndicative: {
          eu: "sou",
          tu: "és",
          voce: "é",
          nos: "somos",
          voces: "são",
        },
      },
    },
    {
      verb: "comer",
      infinitive: "comer",
      translation: "to eat",
      regularity: "regular",
      conjugations: {
        presentIndicative: {
          eu: "como",
          tu: "comes",
          voce: "come",
          nos: "comemos",
          voces: "comem",
        },
      },
    },
  ],
);

describe("quizUtils", () => {
  const mockSettings: QuizSettings = {
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
    pronouns: {
      eu: true,
      tu: true,
      voce: true,
      nos: true,
      voces: true,
    },
    regularity: "all",
    spacedRepetition: {
      enabled: true,
      reviewIntervalDays: 1,
    },
  };

  describe("getFilteredVerbs", () => {
    it('should return all verbs when regularity is "both"', () => {
      const verbs = getFilteredVerbs(
        mockSettings,
      );
      expect(verbs).toHaveLength(3);
    });

    it('should return only regular verbs when regularity is "regular"', () => {
      const settings = {
        ...mockSettings,
        regularity: "regular" as const,
      };
      const verbs =
        getFilteredVerbs(settings);
      expect(verbs).toHaveLength(2);
      expect(
        verbs.every(
          (v) =>
            v.regularity === "regular",
        ),
      ).toBe(true);
    });

    it('should return only irregular verbs when regularity is "irregular"', () => {
      const settings = {
        ...mockSettings,
        regularity:
          "irregular" as const,
      };
      const verbs =
        getFilteredVerbs(settings);
      expect(verbs).toHaveLength(1);
      expect(verbs[0].regularity).toBe(
        "irregular",
      );
    });
  });

  describe("getAvailableTenses", () => {
    it("should return enabled tenses", () => {
      const tenses = getAvailableTenses(
        mockSettings,
      );
      expect(tenses).toEqual([
        "presentIndicative",
      ]);
    });

    it("should return empty array when no tenses are enabled", () => {
      const settings = {
        ...mockSettings,
        tenses: {
          presentIndicative: false,
          preteriteIndicative: false,
          imperfectIndicative: false,
          futureIndicative: false,
          conditionalIndicative: false,
          presentSubjunctive: false,
          imperfectSubjunctive: false,
          futureSubjunctive: false,
          imperative: false,
        },
      };
      const tenses =
        getAvailableTenses(settings);
      expect(tenses).toEqual([]);
    });
  });

  describe("getAvailablePronouns", () => {
    it("should return enabled pronouns", () => {
      const pronouns =
        getAvailablePronouns(
          mockSettings,
        );
      expect(pronouns).toEqual([
        "eu",
        "tu",
        "voce",
        "nos",
        "voces",
      ]);
    });

    it("should return empty array when no pronouns are enabled", () => {
      const settings = {
        ...mockSettings,
        pronouns: {
          eu: false,
          tu: false,
          voce: false,
          nos: false,
          voces: false,
        },
      };
      const pronouns =
        getAvailablePronouns(settings);
      expect(pronouns).toEqual([]);
    });
  });

  describe("generateQuestion", () => {
    it("should generate a valid question with correct full conjugation", () => {
      const question = generateQuestion(
        mockSettings,
      );

      expect(question).not.toBeNull();
      expect(
        question?.verb,
      ).toBeDefined();
      expect(
        question?.pronoun,
      ).toBeDefined();
      expect(
        question?.tense,
      ).toBeDefined();
      expect(
        question?.correctAnswer,
      ).toBeDefined();
      expect(
        question?.fullConjugation,
      ).toBeDefined();

      // The correctAnswer should be the full conjugation, not just the ending
      expect(
        question?.correctAnswer,
      ).toBe(question?.fullConjugation);
      expect(question?.stem).toBe("");
    });

    it("should return null when no verbs are available", () => {
      const settings = {
        ...mockSettings,
        regularity: "regular" as const,
      };
      // Mock to return no verbs
      jest.doMock(
        "../../data/verbs.json",
        () => [],
      );

      const question =
        generateQuestion(settings);
      expect(question).toBeNull();
    });

    it("should return null when no tenses are available", () => {
      const settings = {
        ...mockSettings,
        tenses: {
          presentIndicative: false,
          preteriteIndicative: false,
          imperfectIndicative: false,
          futureIndicative: false,
          conditionalIndicative: false,
          presentSubjunctive: false,
          imperfectSubjunctive: false,
          futureSubjunctive: false,
          imperative: false,
        },
      };

      const question =
        generateQuestion(settings);
      expect(question).toBeNull();
    });

    it("should return null when no pronouns are available", () => {
      const settings = {
        ...mockSettings,
        pronouns: {
          eu: false,
          tu: false,
          voce: false,
          nos: false,
          voces: false,
        },
      };

      const question =
        generateQuestion(settings);
      expect(question).toBeNull();
    });

    it("should generate questions for all supported verb types", () => {
      const questions = [];
      for (let i = 0; i < 10; i++) {
        const question =
          generateQuestion(
            mockSettings,
          );
        if (question) {
          questions.push(question);
        }
      }

      // Should generate questions for different verbs
      const uniqueVerbs = new Set(
        questions.map(
          (q) => q.verb.infinitive,
        ),
      );
      expect(
        uniqueVerbs.size,
      ).toBeGreaterThan(1);

      // All questions should have correct full conjugations
      questions.forEach((question) => {
        expect(
          question.correctAnswer,
        ).toBe(
          question.fullConjugation,
        );
        expect(question.stem).toBe("");
      });
    });
  });
});
