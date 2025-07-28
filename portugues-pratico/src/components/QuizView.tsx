import React from "react";
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
`;

const StartButton = styled.button`
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px
    rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px
      rgba(102, 126, 234, 0.6);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
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

    const startQuiz = () => {
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

    const handleAnswerChange = (
      answer: string,
    ) => {
      dispatch({
        type: "SET_ANSWER",
        payload: answer,
      });
    };

    const handleKeyPress = (
      e: React.KeyboardEvent,
    ) => {
      if (
        e.key === "Enter" &&
        !state.isAnswered
      ) {
        checkAnswer();
      } else if (
        e.key === "Enter" &&
        state.isAnswered
      ) {
        nextQuestion();
      }
    };

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

    if (!state.currentQuestion) {
      return (
        <QuizContainer>
          <QuizCard>
            <WelcomeTitle>
              Ready to Practice
              Portuguese?
            </WelcomeTitle>
            <WelcomeText>
              Test your knowledge of
              Portuguese verb
              conjugations!
            </WelcomeText>
            <StartButton
              onClick={startQuiz}
            >
              Start Quiz
            </StartButton>
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
            onKeyPress={handleKeyPress}
          />

          {state.isAnswered && (
            <Feedback
              isCorrect={
                state.isCorrect
              }
              fullConjugation={
                state.currentQuestion
                  .fullConjugation
              }
              onNext={nextQuestion}
            />
          )}

          {!state.isAnswered && (
            <StartButton
              onClick={checkAnswer}
              disabled={
                !state.userAnswer.trim()
              }
            >
              Check Answer
            </StartButton>
          )}
        </QuizCard>
      </QuizContainer>
    );
  };
