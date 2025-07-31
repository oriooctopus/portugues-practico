import React from "react";
import styled from "@emotion/styled";
import type { QuizSettings } from "../types";

interface SpacedRepetitionSelectorProps {
  spacedRepetition: QuizSettings["spacedRepetition"];
  onChange: (
    spacedRepetition: QuizSettings["spacedRepetition"],
  ) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #333;
`;

const Toggle = styled.input`
  appearance: none;
  width: 3rem;
  height: 1.5rem;
  background: #ccc;
  border-radius: 1rem;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;

  &:checked {
    background: #667eea;
  }

  &::before {
    content: "";
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    background: white;
    top: 0.15rem;
    left: 0.15rem;
    transition: transform 0.3s;
  }

  &:checked::before {
    transform: translateX(1.5rem);
  }
`;

const IntervalContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const IntervalLabel = styled.label`
  font-weight: 500;
  color: #333;
  min-width: 120px;
`;

const IntervalInput = styled.input`
  width: 4rem;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const DaysLabel = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

export const SpacedRepetitionSelector: React.FC<
  SpacedRepetitionSelectorProps
> = ({
  spacedRepetition,
  onChange,
}) => {
  const handleToggleChange = (
    enabled: boolean,
  ) => {
    onChange({
      ...spacedRepetition,
      enabled,
    });
  };

  const handleIntervalChange = (
    reviewIntervalDays: number,
  ) => {
    onChange({
      ...spacedRepetition,
      reviewIntervalDays: Math.max(
        1,
        Math.min(
          30,
          reviewIntervalDays,
        ),
      ), // Limit between 1-30 days
    });
  };

  return (
    <Container>
      <ToggleContainer>
        <ToggleLabel>
          <Toggle
            type="checkbox"
            checked={
              spacedRepetition.enabled
            }
            onChange={(e) =>
              handleToggleChange(
                e.target.checked,
              )
            }
          />
          Enable Spaced Repetition
        </ToggleLabel>
      </ToggleContainer>

      {spacedRepetition.enabled && (
        <IntervalContainer>
          <IntervalLabel>
            Review after:
          </IntervalLabel>
          <IntervalInput
            type="number"
            min="1"
            max="30"
            value={
              spacedRepetition.reviewIntervalDays
            }
            onChange={(e) =>
              handleIntervalChange(
                parseInt(
                  e.target.value,
                ) || 1,
              )
            }
          />
          <DaysLabel>days</DaysLabel>
        </IntervalContainer>
      )}
    </Container>
  );
};
