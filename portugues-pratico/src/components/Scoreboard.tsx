import React from "react";
import styled from "@emotion/styled";

const ScoreboardContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px
    rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  min-width: 300px;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  height: 80px;
`;

const ScoreItem = styled.div`
  text-align: center;
  flex: 1;
  min-width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1;
`;

const ScoreValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const Accuracy = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
  margin-bottom: 0.25rem;
`;

interface ScoreboardProps {
  score: number;
  totalQuestions: number;
}

export const Scoreboard: React.FC<
  ScoreboardProps
> = ({ score, totalQuestions }) => {
  const accuracy =
    totalQuestions > 0
      ? Math.round(
          (score / totalQuestions) *
            100,
        )
      : 0;

  return (
    <ScoreboardContainer>
      <ScoreItem>
        <ScoreLabel>
          Question
        </ScoreLabel>
        <ScoreValue>
          {totalQuestions}
        </ScoreValue>
      </ScoreItem>

      <ScoreItem>
        <ScoreLabel>
          Accuracy
        </ScoreLabel>
        <Accuracy>{accuracy}%</Accuracy>
      </ScoreItem>
    </ScoreboardContainer>
  );
};
