import React from "react";
import styled from "@emotion/styled";
import type { Question } from "../types";

const QuestionContainer = styled.div``;

const VerbInfo = styled.div`
  background: rgba(102, 126, 234, 0.15);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #667eea;
  text-align: center;
`;

const VerbName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #4a5568;
  font-size: 1.3rem;
  font-weight: 700;
`;

const VerbTranslation = styled.p`
  margin: 0;
  color: #2d3748;
  font-style: italic;
  font-weight: 500;
`;

const StemDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Courier New", monospace;
  font-size: 1.5rem;
  color: #666;
  font-weight: 600;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  min-height: 60px;
  height: 60px;
`;

const AnswerInput = styled.input`
  font-size: 1.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  font-family: "Courier New", monospace;
  width: 120px;
  height: 60px;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px
      rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
  }
`;

const PlusSign = styled.span`
  color: #667eea;
  font-weight: 700;
  font-size: 1.5rem;
`;

interface QuestionCardProps {
  question: Question;
  userAnswer: string;
  isAnswered: boolean;
  onAnswerChange: (
    answer: string,
  ) => void;
  onKeyPress?: (
    e: React.KeyboardEvent,
  ) => void;
}

export const QuestionCard: React.FC<
  QuestionCardProps
> = ({
  question,
  userAnswer,
  isAnswered,
  onAnswerChange,
  onKeyPress,
}) => {
  const formatTense = (
    tense: string,
  ): string => {
    return tense
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) =>
        str.toUpperCase(),
      )
      .trim();
  };

  const formatPronoun = (
    pronoun: string,
  ): string => {
    const pronounMap: Record<
      string,
      string
    > = {
      eu: "eu",
      tu: "tu",
      voce: "você",
      nos: "nós",
      vos: "vós",
      voces: "vocês",
    };
    return (
      pronounMap[pronoun] || pronoun
    );
  };

  return (
    <QuestionContainer>
      <VerbInfo>
        <VerbName>
          {question.verb.infinitive}
        </VerbName>
        <VerbTranslation>
          {formatTense(question.tense)
            .toLowerCase()
            .replace(/\s+/g, "-")}
          {question.tense !==
            "presentIndicative" ||
          (question.pronoun !==
            "voce" &&
            question.pronoun !==
              "nos") ? (
            <>
              ,{" "}
              {formatPronoun(
                question.pronoun,
              )}
            </>
          ) : null}
        </VerbTranslation>
      </VerbInfo>

      <InputContainer>
        <StemDisplay>
          {formatPronoun(
            question.pronoun,
          )}
          <PlusSign>+</PlusSign>
        </StemDisplay>
        <AnswerInput
          type="text"
          value={userAnswer}
          onChange={(e) =>
            onAnswerChange(
              e.target.value,
            )
          }
          onKeyPress={
            onKeyPress || undefined
          }
          disabled={isAnswered}
          autoFocus
        />
      </InputContainer>
    </QuestionContainer>
  );
};
