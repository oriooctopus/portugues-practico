import React from "react";
import styled from "@emotion/styled";
import type { Question } from "../types";

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

const ExplanationSection = styled.div`
  background: rgba(220, 53, 69, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: left;
`;

const ExplanationTitle = styled.h4`
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  text-align: center;
`;

const ExplanationText = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const ConjugationTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ConjugationRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 6px;
`;

const Pronoun = styled.span`
  font-weight: 600;
  color: #667eea;
`;

const Conjugation = styled.span`
  font-family: "Courier New", monospace;
  color: #333;
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

interface FeedbackProps {
  isCorrect: boolean | null;
  correctAnswer: string;
  fullConjugation: string;
  onNext: () => void;
  onCheckAnswer: () => void;
  onRetry: () => void;
  isAnswered: boolean;
  userAnswer: string;
  question: Question;
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
  question,
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

  const getExplanationText = () => {
    const verbType =
      question.verb.infinitive.endsWith(
        "ar",
      )
        ? "-ar"
        : question.verb.infinitive.endsWith(
            "er",
          )
        ? "-er"
        : "-ir";
    const regularity =
      question.verb.regularity ===
      "regular"
        ? "regular"
        : "irregular";

    if (regularity === "regular") {
      return `Regular ${verbType} verb - follows standard conjugation patterns.`;
    } else {
      // Handle irregular verbs with brief explanations
      const irregularCategories =
        question.verb
          .irregular_category || [];

      if (
        irregularCategories.includes(
          "highly_irregular",
        )
      ) {
        return `Irregular verb with no similar verbs.`;
      } else if (
        irregularCategories.includes(
          "stem_changing",
        )
      ) {
        return `Stem-changing verb - the root changes in some forms.`;
      } else if (
        irregularCategories.includes(
          "orthographic",
        )
      ) {
        return `Spelling changes to maintain pronunciation.`;
      } else {
        return `Irregular verb - doesn't follow standard patterns.`;
      }
    }
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

      {isAnswered &&
        isCorrect === false && (
          <ExplanationSection>
            <ExplanationTitle>
              {question.verb.infinitive}{" "}
              -{" "}
              {formatTense(
                question.tense,
              )}
            </ExplanationTitle>

            <ExplanationText>
              {getExplanationText()}
            </ExplanationText>

            <ConjugationTable>
              {Object.entries(
                question.verb
                  .conjugations[
                  question.tense
                ] || {},
              ).map(
                ([
                  pronoun,
                  conjugation,
                ]) => (
                  <ConjugationRow
                    key={pronoun}
                  >
                    <Pronoun>
                      {formatPronoun(
                        pronoun,
                      )}
                    </Pronoun>
                    <Conjugation>
                      {
                        conjugation as string
                      }
                    </Conjugation>
                  </ConjugationRow>
                ),
              )}
            </ConjugationTable>
          </ExplanationSection>
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
