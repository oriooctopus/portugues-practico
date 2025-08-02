import React from "react";
import styled from "@emotion/styled";
import type { QuizSettings } from "../types";

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(120px, 1fr)
  );
  gap: 1rem;
  margin-top: 1rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
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

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const PronounLabel = styled.span`
  color: #333;
`;

interface PronounSelectorProps {
  pronouns: QuizSettings["pronouns"];
  onChange: (
    pronouns: QuizSettings["pronouns"],
  ) => void;
}

export const PronounSelector: React.FC<
  PronounSelectorProps
> = ({ pronouns, onChange }) => {
  const pronounLabels: Record<
    keyof QuizSettings["pronouns"],
    string
  > = {
    eu: "eu",
    tu: "tu",
    voce: "você",
    nos: "nós",
    voces: "vocês",
  };

  const handleToggle = (
    key: keyof QuizSettings["pronouns"],
  ) => {
    onChange({
      ...pronouns,
      [key]: !pronouns[key],
    });
  };

  return (
    <CheckboxGrid>
      {Object.entries(pronouns).map(
        ([key, checked]) => (
          <CheckboxItem key={key}>
            <Checkbox
              type="checkbox"
              checked={checked}
              onChange={() =>
                handleToggle(
                  key as keyof QuizSettings["pronouns"],
                )
              }
            />
            <PronounLabel>
              {
                pronounLabels[
                  key as keyof QuizSettings["pronouns"]
                ]
              }
            </PronounLabel>
          </CheckboxItem>
        ),
      )}
    </CheckboxGrid>
  );
};
