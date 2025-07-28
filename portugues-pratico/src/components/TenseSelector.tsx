import React from "react";
import styled from "@emotion/styled";
import type { QuizSettings } from "../types";

const TenseContainer = styled.div`
  margin-top: 1rem;
`;

const MoodSection = styled.div`
  margin-bottom: 1.5rem;
`;

const MoodTitle = styled.h4`
  color: #667eea;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(180px, 1fr)
  );
  gap: 0.75rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid
    rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

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
  width: 16px;
  height: 16px;
  accent-color: #667eea;
`;

const TenseLabel = styled.span`
  color: #333;
`;

interface TenseSelectorProps {
  tenses: QuizSettings["tenses"];
  onChange: (
    tenses: QuizSettings["tenses"],
  ) => void;
}

export const TenseSelector: React.FC<
  TenseSelectorProps
> = ({ tenses, onChange }) => {
  const tenseGroups = {
    "Indicative Mood": [
      {
        key: "presentIndicative",
        label: "Present",
      },
      {
        key: "preteriteIndicative",
        label: "Preterite",
      },
      {
        key: "imperfectIndicative",
        label: "Imperfect",
      },
      {
        key: "futureIndicative",
        label: "Future",
      },
      {
        key: "conditionalIndicative",
        label: "Conditional",
      },
    ],
    "Subjunctive Mood": [
      {
        key: "presentSubjunctive",
        label: "Present",
      },
      {
        key: "imperfectSubjunctive",
        label: "Imperfect",
      },
      {
        key: "futureSubjunctive",
        label: "Future",
      },
    ],
    "Imperative Mood": [
      {
        key: "imperative",
        label: "Imperative",
      },
    ],
  };

  const handleToggle = (
    key: keyof QuizSettings["tenses"],
  ) => {
    onChange({
      ...tenses,
      [key]: !tenses[key],
    });
  };

  return (
    <TenseContainer>
      {Object.entries(tenseGroups).map(
        ([mood, moodTenses]) => (
          <MoodSection key={mood}>
            <MoodTitle>
              {mood}
            </MoodTitle>
            <CheckboxGrid>
              {moodTenses.map(
                ({ key, label }) => (
                  <CheckboxItem
                    key={key}
                  >
                    <Checkbox
                      type="checkbox"
                      checked={
                        tenses[
                          key as keyof QuizSettings["tenses"]
                        ]
                      }
                      onChange={() =>
                        handleToggle(
                          key as keyof QuizSettings["tenses"],
                        )
                      }
                    />
                    <TenseLabel>
                      {label}
                    </TenseLabel>
                  </CheckboxItem>
                ),
              )}
            </CheckboxGrid>
          </MoodSection>
        ),
      )}
    </TenseContainer>
  );
};
