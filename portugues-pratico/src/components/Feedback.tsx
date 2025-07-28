import React from "react";
import styled from "@emotion/styled";

const FeedbackContainer = styled.div<{
  isCorrect: boolean;
}>`
  background: ${(props) =>
    props.isCorrect
      ? "rgba(40, 167, 69, 0.1)"
      : "rgba(220, 53, 69, 0.1)"};
  border: 2px solid
    ${(props) =>
      props.isCorrect
        ? "#28a745"
        : "#dc3545"};
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
`;

const FeedbackIcon = styled.div<{
  isCorrect: boolean;
}>`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${(props) =>
    props.isCorrect
      ? "#28a745"
      : "#dc3545"};
`;

const FeedbackMessage = styled.div<{
  isCorrect: boolean;
}>`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) =>
    props.isCorrect
      ? "#28a745"
      : "#dc3545"};
  margin-bottom: 1rem;
`;

const CorrectAnswer = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid #667eea;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: "Courier New", monospace;
  font-size: 1.1rem;
  color: #667eea;
`;

const NextButton = styled.button`
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
  margin-top: 1rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px
      rgba(102, 126, 234, 0.4);
  }
`;

interface FeedbackProps {
  isCorrect: boolean | null;
  correctAnswer: string;
  fullConjugation: string;
  onNext: () => void;
}

export const Feedback: React.FC<
  FeedbackProps
> = ({
  isCorrect,
  fullConjugation,
  onNext,
}) => {
  if (isCorrect === null) return null;

  return (
    <FeedbackContainer
      isCorrect={isCorrect}
    >
      <FeedbackIcon
        isCorrect={isCorrect}
      >
        {isCorrect ? "✅" : "❌"}
      </FeedbackIcon>

      <FeedbackMessage
        isCorrect={isCorrect}
      >
        {isCorrect
          ? "Correct!"
          : "Incorrect"}
      </FeedbackMessage>

      {!isCorrect && (
        <div>
          <p>The correct answer is:</p>
          <CorrectAnswer>
            {fullConjugation}
          </CorrectAnswer>
        </div>
      )}

      <NextButton onClick={onNext}>
        Next Question
      </NextButton>
    </FeedbackContainer>
  );
};
