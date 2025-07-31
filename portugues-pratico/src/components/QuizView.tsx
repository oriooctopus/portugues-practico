import React, {
  useEffect,
} from "react";
import styled from "@emotion/styled";
import { useQuiz } from "../context/useQuiz";
import { useSettings } from "../context/useSettings";
import { generateQuestion } from "../utils/quizUtils";
import { QuestionCard } from "./QuestionCard";
import { Scoreboard } from "./Scoreboard";
import { Feedback } from "./Feedback";

const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const QuizCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px
    rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const FeedbackArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: auto;
`;

const NoSettingsMessage = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px
    rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #666;
  width: 100%;
`;

const WelcomeTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

const WelcomeText = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.5;
`;

export const QuizView: React.FC =
  () => {
    const { state, dispatch } =
      useQuiz();
    const { settings } = useSettings();

    // Check if any settings are selected
    const hasValidSettings = () => {
      const hasPronouns = Object.values(
        settings.pronouns,
      ).some((enabled) => enabled);
      const hasTenses = Object.values(
        settings.tenses,
      ).some((enabled) => enabled);
      return hasPronouns && hasTenses;
    };

    // Auto-start quiz when valid settings are available and no current question
    useEffect(() => {
      if (
        hasValidSettings() &&
        !state.currentQuestion
      ) {
        const question =
          generateQuestion(settings);
        if (question) {
          dispatch({
            type: "SET_QUESTION",
            payload: question,
          });
          dispatch({
            type: "NEXT_QUESTION",
          });
        }
      }
    }, [
      settings,
      state.currentQuestion,
      dispatch,
    ]);

    // Global keyboard listener
    useEffect(() => {
      const handleKeyDown = (
        e: KeyboardEvent,
      ) => {
        if (e.key === "Enter") {
          if (!state.isAnswered) {
            // Check answer (will handle "I don't know" if no input)
            checkAnswer();
          } else {
            // If answer is incorrect, retry; otherwise go to next question
            if (
              state.isCorrect === false
            ) {
              retryQuestion();
            } else {
              nextQuestion();
            }
          }
        }
      };

      document.addEventListener(
        "keydown",
        handleKeyDown,
      );
      return () => {
        document.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    }, [
      state.isAnswered,
      state.isCorrect,
      state.userAnswer,
    ]);

    const nextQuestion = () => {
      const question =
        generateQuestion(settings);
      if (question) {
        dispatch({
          type: "SET_QUESTION",
          payload: question,
        });
        dispatch({
          type: "NEXT_QUESTION",
        });
      }
    };

    const checkAnswer = () => {
      dispatch({
        type: "CHECK_ANSWER",
      });
    };

    const retryQuestion = () => {
      dispatch({
        type: "RETRY_QUESTION",
      });
    };

    const handleAnswerChange = (
      answer: string,
    ) => {
      dispatch({
        type: "SET_ANSWER",
        payload: answer,
      });
    };

    if (!hasValidSettings()) {
      return (
        <QuizContainer>
          <NoSettingsMessage>
            <WelcomeTitle>
              Configure Your Practice
            </WelcomeTitle>
            <WelcomeText>
              Please go to Settings and
              select at least one
              pronoun and one tense to
              start practicing.
            </WelcomeText>
          </NoSettingsMessage>
        </QuizContainer>
      );
    }

    // Show loading state while generating first question
    if (!state.currentQuestion) {
      return (
        <QuizContainer>
          <QuizCard>
            <WelcomeTitle>
              Loading Quiz...
            </WelcomeTitle>
            <WelcomeText>
              Preparing your Portuguese
              practice session...
            </WelcomeText>
          </QuizCard>
        </QuizContainer>
      );
    }

    return (
      <QuizContainer>
        <Scoreboard
          score={state.score}
          totalQuestions={
            state.totalQuestions
          }
        />

        <QuizCard>
          <QuestionCard
            question={
              state.currentQuestion
            }
            userAnswer={
              state.userAnswer
            }
            isAnswered={
              state.isAnswered
            }
            onAnswerChange={
              handleAnswerChange
            }
          />

          <FeedbackArea>
            <Feedback
              isCorrect={
                state.isCorrect
              }
              correctAnswer={
                state.currentQuestion
                  .correctAnswer
              }
              fullConjugation={
                state.currentQuestion
                  .fullConjugation
              }
              onNext={nextQuestion}
              onCheckAnswer={
                checkAnswer
              }
              onRetry={retryQuestion}
              isAnswered={
                state.isAnswered
              }
              userAnswer={
                state.userAnswer
              }
              question={
                state.currentQuestion
              }
            />
          </FeedbackArea>
        </QuizCard>
      </QuizContainer>
    );
  };
