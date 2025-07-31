import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Slider = styled.input`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
  }
`;

const RatioDisplay = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  min-width: 120px;
  text-align: center;
`;

interface RegularIrregularRatioSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const RegularIrregularRatioSelector: React.FC<
  RegularIrregularRatioSelectorProps
> = ({ value, onChange }) => {
  // Ensure value is a valid number, default to 0.7 if undefined
  const safeValue =
    typeof value === "number" &&
    !isNaN(value)
      ? value
      : 0.7;
  const regularPercentage = Math.round(
    safeValue * 100,
  );
  const irregularPercentage =
    100 - regularPercentage;

  return (
    <Container>
      <Label>
        Regular vs Irregular Ratio
      </Label>
      <SliderContainer>
        <Slider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={safeValue}
          onChange={(e) =>
            onChange(
              parseFloat(
                e.target.value,
              ),
            )
          }
        />
        <RatioDisplay>
          {regularPercentage}% Regular •{" "}
          {irregularPercentage}%
          Irregular
        </RatioDisplay>
      </SliderContainer>
    </Container>
  );
};
