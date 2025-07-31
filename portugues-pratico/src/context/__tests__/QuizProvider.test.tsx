import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuizProvider } from "../QuizProvider";
import { useQuiz } from "../useQuiz";
import type { Question } from "../../types";

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

// Test component to access quiz context
const TestComponent: React.FC = () => {
  const { state, dispatch } = useQuiz();

  const setTestQuestion = () => {
    const question: Question = {
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
      pronoun: "tu",
      tense: "presentIndicative",
      stem: "",
      correctAnswer: "falas",
      fullConjugation: "falas",
    };
    dispatch({
      type: "SET_QUESTION",
      payload: question,
    });
  };

  const setSerQuestion = () => {
    const question: Question = {
      verb: {
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
      pronoun: "voce",
      tense: "presentIndicative",
      stem: "",
      correctAnswer: "é",
      fullConjugation: "é",
    };
    dispatch({
      type: "SET_QUESTION",
      payload: question,
    });
  };

  const setComerQuestion = () => {
    const question: Question = {
      verb: {
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
      pronoun: "nos",
      tense: "presentIndicative",
      stem: "",
      correctAnswer: "comemos",
      fullConjugation: "comemos",
    };
    dispatch({
      type: "SET_QUESTION",
      payload: question,
    });
  };

  const setAnswer = (
    answer: string,
  ) => {
    dispatch({
      type: "SET_ANSWER",
      payload: answer,
    });
  };

  const checkAnswer = () => {
    dispatch({ type: "CHECK_ANSWER" });
  };

  const retryQuestion = () => {
    dispatch({
      type: "RETRY_QUESTION",
    });
  };

  return (
    <div>
      <div data-testid="state">
        {JSON.stringify({
          hasQuestion:
            !!state.currentQuestion,
          isAnswered: state.isAnswered,
          isCorrect: state.isCorrect,
          userAnswer: state.userAnswer,
          score: state.score,
          totalQuestions:
            state.totalQuestions,
        })}
      </div>
      <button
        onClick={setTestQuestion}
        data-testid="set-falar-question"
      >
        Set Falar Question
      </button>
      <button
        onClick={setSerQuestion}
        data-testid="set-ser-question"
      >
        Set Ser Question
      </button>
      <button
        onClick={setComerQuestion}
        data-testid="set-comer-question"
      >
        Set Comer Question
      </button>
      <input
        data-testid="answer-input"
        value={state.userAnswer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
        placeholder="Enter answer"
      />
      <button
        onClick={checkAnswer}
        data-testid="check-answer"
      >
        Check Answer
      </button>
      <button
        onClick={retryQuestion}
        data-testid="retry-question"
      >
        Retry Question
      </button>
    </div>
  );
};

const renderWithProvider = (
  component: React.ReactElement,
) => {
  return render(
    <QuizProvider>
      {component}
    </QuizProvider>,
  );
};

describe("QuizProvider", () => {
  beforeEach(() => {
    // Clear any previous state
  });

  describe("Answer Evaluation Logic", () => {
    it("should correctly evaluate exact matches", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up a question
      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      // Type correct answer
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "falas");

      // Check answer
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          true,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should correctly evaluate case-insensitive matches", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up a question
      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      // Type correct answer in different case
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "FALAS");

      // Check answer
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          true,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should correctly evaluate answers with accents", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up ser question (has accent)
      fireEvent.click(
        screen.getByTestId(
          "set-ser-question",
        ),
      );

      // Type correct answer with accent
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "é");

      // Check answer
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          true,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should mark incorrect answers as wrong", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up a question
      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      // Type incorrect answer
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "falo");

      // Check answer
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          false,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should handle empty answers correctly", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up a question
      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      // Leave input empty
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.clear(input);

      // Check answer
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          false,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should handle whitespace correctly", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up a question
      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      // Type answer with whitespace
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(
        input,
        "  falas  ",
      );

      // Check answer
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          true,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should NOT normalize accents (require exact accent matching)", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up ser question (has accent)
      fireEvent.click(
        screen.getByTestId(
          "set-ser-question",
        ),
      );

      // Type answer without accent (should be wrong)
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "e");

      // Check answer
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          false,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should handle different accent scenarios correctly", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Test ser with "são" (has accent)
      fireEvent.click(
        screen.getByTestId(
          "set-ser-question",
        ),
      );

      // Change the question to test "são"
      const serQuestion: Question = {
        verb: {
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
        pronoun: "voces",
        tense: "presentIndicative",
        stem: "",
        correctAnswer: "são",
        fullConjugation: "são",
      };

      // Set up the question manually
      const { dispatch } = useQuiz();
      dispatch({
        type: "SET_QUESTION",
        payload: serQuestion,
      });

      // Test correct answer with accent
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.clear(input);
      await user.type(input, "são");

      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          true,
        );
      });

      // Test incorrect answer without accent
      fireEvent.click(
        screen.getByTestId(
          "retry-question",
        ),
      );
      await user.clear(input);
      await user.type(input, "sao");

      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          false,
        );
      });
    });

    it("should handle comer with accent correctly", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up comer question
      fireEvent.click(
        screen.getByTestId(
          "set-comer-question",
        ),
      );

      // Type correct answer
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "comemos");

      // Check answer
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          true,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should handle mixed accent scenarios", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Test various accent combinations
      const accentTests = [
        {
          input: "é",
          expected: "é",
          shouldPass: true,
        },
        {
          input: "e",
          expected: "é",
          shouldPass: false,
        },
        {
          input: "são",
          expected: "são",
          shouldPass: true,
        },
        {
          input: "sao",
          expected: "são",
          shouldPass: false,
        },
        {
          input: "falás",
          expected: "falas",
          shouldPass: false,
        }, // Wrong accent
        {
          input: "falas",
          expected: "falas",
          shouldPass: true,
        },
      ];

      for (const test of accentTests) {
        // Set up a simple question
        fireEvent.click(
          screen.getByTestId(
            "set-falar-question",
          ),
        );

        // Clear and type the test input
        const input =
          screen.getByTestId(
            "answer-input",
          );
        await user.clear(input);
        await user.type(
          input,
          test.input,
        );

        // Check answer
        fireEvent.click(
          screen.getByTestId(
            "check-answer",
          ),
        );

        await waitFor(() => {
          const state = JSON.parse(
            screen.getByTestId("state")
              .textContent || "{}",
          );
          expect(state.isCorrect).toBe(
            test.shouldPass,
          );
        });

        // Reset for next test
        fireEvent.click(
          screen.getByTestId(
            "retry-question",
          ),
        );
      }
    });
  });

  describe("Question State Management", () => {
    it("should set question correctly", () => {
      renderWithProvider(
        <TestComponent />,
      );

      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      const state = JSON.parse(
        screen.getByTestId("state")
          .textContent || "{}",
      );
      expect(state.hasQuestion).toBe(
        true,
      );
      expect(state.isAnswered).toBe(
        false,
      );
      expect(state.isCorrect).toBe(
        null,
      );
      expect(state.userAnswer).toBe("");
    });

    it("should update user answer correctly", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "test");

      const state = JSON.parse(
        screen.getByTestId("state")
          .textContent || "{}",
      );
      expect(state.userAnswer).toBe(
        "test",
      );
    });

    it("should retry question correctly", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up question and answer it
      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "wrong");
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      // Verify it's answered
      let state = JSON.parse(
        screen.getByTestId("state")
          .textContent || "{}",
      );
      expect(state.isAnswered).toBe(
        true,
      );
      expect(state.isCorrect).toBe(
        false,
      );

      // Retry question
      fireEvent.click(
        screen.getByTestId(
          "retry-question",
        ),
      );

      // Verify state is reset
      state = JSON.parse(
        screen.getByTestId("state")
          .textContent || "{}",
      );
      expect(state.isAnswered).toBe(
        false,
      );
      expect(state.isCorrect).toBe(
        null,
      );
      expect(state.userAnswer).toBe("");
    });
  });

  describe("Score Management", () => {
    it("should increment score for correct answers", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up question
      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      // Answer correctly
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "falas");
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.score).toBe(1);
        expect(
          state.totalQuestions,
        ).toBe(0); // Not incremented until next question
      });
    });

    it("should not increment score for incorrect answers", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      // Set up question
      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      // Answer incorrectly
      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "wrong");
      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.score).toBe(0);
        expect(
          state.totalQuestions,
        ).toBe(0);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long answers", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      const input = screen.getByTestId(
        "answer-input",
      );
      const longAnswer = "a".repeat(
        1000,
      );
      await user.type(
        input,
        longAnswer,
      );

      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          false,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should handle special characters", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(
        input,
        "!@#$%^&*()",
      );

      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          false,
        );
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });

    it("should handle unicode characters", async () => {
      const user = userEvent.setup();
      renderWithProvider(
        <TestComponent />,
      );

      fireEvent.click(
        screen.getByTestId(
          "set-falar-question",
        ),
      );

      const input = screen.getByTestId(
        "answer-input",
      );
      await user.type(input, "falás"); // With accent

      fireEvent.click(
        screen.getByTestId(
          "check-answer",
        ),
      );

      await waitFor(() => {
        const state = JSON.parse(
          screen.getByTestId("state")
            .textContent || "{}",
        );
        expect(state.isCorrect).toBe(
          false,
        ); // Should be wrong because it's not the correct answer
        expect(state.isAnswered).toBe(
          true,
        );
      });
    });
  });
});
