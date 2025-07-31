import React, {
  useReducer,
} from "react";
import type { ReactNode } from "react";
import type {
  QuizState,
  QuizAction,
  QuizContextType,
} from "../types";
import { QuizContext } from "./QuizContext";
import { saveWrongAnswer } from "../utils/wrongAnswers";
import { updateSpacedRepetitionEntry } from "../utils/spacedRepetition";
import { useSettings } from "./useSettings";

const initialState: QuizState = {
  currentQuestion: null,
  score: 0,
  totalQuestions: 0,
  isAnswered: false,
  isCorrect: null,
  userAnswer: "",
};

function quizReducer(
  state: QuizState,
  action: QuizAction,
): QuizState {
  switch (action.type) {
    case "SET_QUESTION":
      return {
        ...state,
        currentQuestion: action.payload,
        isAnswered: false,
        isCorrect: null,
        userAnswer: "",
      };
    case "SET_ANSWER":
      return {
        ...state,
        userAnswer: action.payload,
      };
    case "CHECK_ANSWER": {
      if (!state.currentQuestion)
        return state;

      // Normalize accents by removing them
      const normalizeAccents = (
        text: string,
      ): string => {
        return text
          .normalize("NFD")
          .replace(
            /[\u0300-\u036f]/g,
            "",
          );
      };

      const userAnswerTrimmed =
        state.userAnswer
          .trim()
          .toLowerCase();
      const correctAnswer =
        state.currentQuestion.correctAnswer.toLowerCase();

      // Normalize accents for comparison
      const normalizedUserAnswer =
        normalizeAccents(
          userAnswerTrimmed,
        );
      const normalizedCorrectAnswer =
        normalizeAccents(correctAnswer);

      // Compare normalized answers
      const isCorrect =
        normalizedUserAnswer ===
        normalizedCorrectAnswer;

      // Save wrong answer if incorrect
      if (!isCorrect) {
        saveWrongAnswer(
          state.currentQuestion,
          state.userAnswer,
        );
      }

      return {
        ...state,
        isAnswered: true,
        isCorrect,
        score: isCorrect
          ? state.score + 1
          : state.score,
      };
    }
    case "NEXT_QUESTION":
      return {
        ...state,
        totalQuestions:
          state.totalQuestions + 1,
        isAnswered: false,
        isCorrect: null,
        userAnswer: "",
      };
    case "RESET_QUIZ":
      return {
        ...initialState,
        totalQuestions: 0,
      };
    case "INCREMENT_SCORE":
      return {
        ...state,
        score: state.score + 1,
      };
    case "RETRY_QUESTION":
      return {
        ...state,
        isAnswered: false,
        isCorrect: null,
        userAnswer: "",
      };
    default:
      return state;
  }
}

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<
  QuizProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(
    quizReducer,
    initialState,
  );
  const { settings } = useSettings();

  const value: QuizContextType = {
    state,
    dispatch,
  };

  // Update spaced repetition when answer is checked
  React.useEffect(() => {
    if (
      state.isAnswered &&
      state.currentQuestion
    ) {
      updateSpacedRepetitionEntry(
        state.currentQuestion,
        state.isCorrect || false,
        settings.spacedRepetition
          .reviewIntervalDays,
      );
    }
  }, [
    state.isAnswered,
    state.isCorrect,
    state.currentQuestion,
    settings.spacedRepetition
      .reviewIntervalDays,
  ]);

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};
