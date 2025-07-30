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

      const userAnswerTrimmed =
        state.userAnswer
          .trim()
          .toLowerCase();
      const correctAnswer =
        state.currentQuestion.correctAnswer.toLowerCase();
      const stem =
        state.currentQuestion.stem.toLowerCase();

      let isCorrect =
        userAnswerTrimmed ===
        correctAnswer;

      // If not correct, check if user typed the full conjugation
      // and we need to remove the duplicate letter from concatenation
      if (
        !isCorrect &&
        userAnswerTrimmed.length > 0 &&
        stem.length > 0
      ) {
        const lastStemLetter =
          stem[stem.length - 1];
        const firstUserLetter =
          userAnswerTrimmed[0];

        // If the last letter of stem matches first letter of user answer,
        // try removing the first letter from user answer
        if (
          lastStemLetter ===
          firstUserLetter
        ) {
          const userAnswerWithoutFirst =
            userAnswerTrimmed.substring(
              1,
            );
          isCorrect =
            userAnswerWithoutFirst ===
            correctAnswer;
        }
      }

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

  const value: QuizContextType = {
    state,
    dispatch,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};
