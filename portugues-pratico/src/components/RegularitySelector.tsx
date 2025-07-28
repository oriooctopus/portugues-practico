import React from "react";
import styled from "@emotion/styled";
import type { QuizSettings } from "../types";

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const RadioItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid
    rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: rgba(
      102,
      126,
      234,
      0.1
    );
    border-color: rgba(
      102,
      126,
      234,
      0.4
    );
  }

  input:checked + span {
    color: #667eea;
    font-weight: 600;
  }
`;

const Radio = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const RegularityLabel = styled.span`
  color: #333;
`;

const Description = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
  font-weight: normal;
`;

interface RegularitySelectorProps {
  regularity: QuizSettings["regularity"];
  onChange: (
    regularity: QuizSettings["regularity"],
  ) => void;
}

export const RegularitySelector: React.FC<
  RegularitySelectorProps
> = ({ regularity, onChange }) => {
  const options = [
    {
      value: "all" as const,
      label: "All Verbs",
      description:
        "Practice with both regular and irregular verbs",
    },
    {
      value: "regular" as const,
      label: "Regular Verbs Only",
      description:
        "Focus on verbs that follow standard conjugation patterns",
    },
    {
      value: "irregular" as const,
      label: "Irregular Verbs Only",
      description:
        "Practice with verbs that have irregular conjugations",
    },
  ];

  return (
    <RadioGroup>
      {options.map(
        ({
          value,
          label,
          description,
        }) => (
          <RadioItem key={value}>
            <Radio
              type="radio"
              name="regularity"
              value={value}
              checked={
                regularity === value
              }
              onChange={(e) =>
                onChange(
                  e.target
                    .value as QuizSettings["regularity"],
                )
              }
            />
            <div>
              <RegularityLabel>
                {label}
              </RegularityLabel>
              <Description>
                {description}
              </Description>
            </div>
          </RadioItem>
        ),
      )}
    </RadioGroup>
  );
};
