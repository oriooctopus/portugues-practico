import React from "react";
import styled from "@emotion/styled";
import type { Question } from "../types";

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
`;

const QuestionText = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
`;

const VerbInfo = styled.div`
  background: rgba(102, 126, 234, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #667eea;
`;

const VerbName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #667eea;
  font-size: 1.3rem;
`;

const VerbTranslation = styled.p`
  margin: 0;
  color: #666;
  font-style: italic;
`;

const ConjugationPrompt = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
`;

const StemDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
  font-family: "Courier New", monospace;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AnswerInput = styled.input`
  font-size: 1.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  font-family: "Courier New", monospace;
  width: 120px;
  transition: border-color 0.2s ease;

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
  font-size: 1.5rem;
  color: #667eea;
  font-weight: bold;
`;

interface QuestionCardProps {
  question: Question;
  userAnswer: string;
  isAnswered: boolean;
  onAnswerChange: (
    answer: string,
  ) => void;
  onKeyPress: (
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
      <QuestionText>
        Conjugate{" "}
        <strong>
          {question.verb.infinitive}
        </strong>{" "}
        in the{" "}
        <strong>
          {formatTense(question.tense)}
        </strong>{" "}
        for{" "}
        <strong>
          {formatPronoun(
            question.pronoun,
          )}
        </strong>
      </QuestionText>

      <VerbInfo>
        <VerbName>
          {question.verb.infinitive}
        </VerbName>
        <VerbTranslation>
          {question.verb.translation}
        </VerbTranslation>
      </VerbInfo>

      <ConjugationPrompt>
        Complete the conjugation:
      </ConjugationPrompt>

      <InputContainer>
        <StemDisplay>
          {question.stem}
        </StemDisplay>
        <PlusSign>+</PlusSign>
        <AnswerInput
          type="text"
          value={userAnswer}
          onChange={(e) =>
            onAnswerChange(
              e.target.value,
            )
          }
          onKeyPress={onKeyPress}
          disabled={isAnswered}
          placeholder="ending"
          autoFocus
        />
      </InputContainer>
    </QuestionContainer>
  );
};
