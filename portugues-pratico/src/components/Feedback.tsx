import React from "react";
import styled from "@emotion/styled";

const FeedbackContainer = styled.div<{
  isCorrect: boolean | null;
}>`
  border-radius: 12px;
  text-align: center;
  border-color: ${(props) =>
    props.isCorrect === true
      ? "rgba(40, 167, 69, 0.1)"
      : props.isCorrect === false
      ? "rgba(220, 53, 69, 0.1)"
      : "transparent"};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const CorrectAnswer = styled.div<{
  isCorrect: boolean | null;
  showAnswer: boolean;
}>`
  border-radius: 8px;
  font-family: "Courier New", monospace;
  font-size: 1.1rem;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${(props) =>
    props.isCorrect === true
      ? "#28a745"
      : props.isCorrect === false
      ? "#dc3545"
      : "transparent"};
  transition: opacity 0.2s ease;
`;

const BaseButton = styled.button`
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 180px;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px
      rgba(102, 126, 234, 0.4);
  }
`;

const ActionButton = styled(
  BaseButton,
)<{
  isAnswered: boolean;
  disabled?: boolean;
}>`
  cursor: ${(props) =>
    props.disabled
      ? "not-allowed"
      : "pointer"};
  margin-top: 1rem;
  opacity: ${(props) =>
    props.disabled ? 0.6 : 1};

  &:hover {
    transform: ${(props) =>
      props.disabled
        ? "none"
        : "translateY(-1px)"};
    box-shadow: ${(props) =>
      props.disabled
        ? "none"
        : "0 4px 15px rgba(102, 126, 234, 0.4)"};
  }
`;

interface FeedbackProps {
  isCorrect: boolean | null;
  correctAnswer: string;
  fullConjugation: string;
  onNext: () => void;
  onCheckAnswer: () => void;
  onRetry: () => void;
  isAnswered: boolean;
  userAnswer: string;
}

export const Feedback: React.FC<
  FeedbackProps
> = ({
  isCorrect,
  fullConjugation,
  onNext,
  onCheckAnswer,
  onRetry,
  isAnswered,
  userAnswer,
}) => {
  const handleButtonClick = () => {
    if (isAnswered) {
      onNext();
    } else {
      onCheckAnswer();
    }
  };

  const isDisabled =
    !isAnswered && !userAnswer.trim();

  return (
    <FeedbackContainer
      isCorrect={isCorrect}
    >
      {isCorrect !== null && (
        <CorrectAnswer
          isCorrect={isCorrect}
          showAnswer={
            isCorrect !== null
          }
        >
          {isCorrect === true ? (
            <>
              <span>✅</span>
              <span>Correct!</span>
            </>
          ) : isCorrect === false ? (
            <>
              <span>❌</span>
              <span>
                {fullConjugation}
              </span>
            </>
          ) : null}
        </CorrectAnswer>
      )}

      <ButtonsContainer>
        {isAnswered &&
          isCorrect === false && (
            <ActionButton
              onClick={onRetry}
              isAnswered={isAnswered}
            >
              Try Again
            </ActionButton>
          )}

        <ActionButton
          onClick={handleButtonClick}
          isAnswered={isAnswered}
          disabled={isDisabled}
        >
          {isAnswered
            ? "Next Question"
            : "Check Answer"}
        </ActionButton>
      </ButtonsContainer>
    </FeedbackContainer>
  );
};
