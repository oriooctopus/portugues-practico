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
  margin: auto;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  max-width: 400px;
  text-align: center;
`;

const ConjugationTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ConjugationRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
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

const ConjugationStem = styled.span`
  // font-family: "Courier New", monospace;
  // color: #666;
`;

const ConjugationEnding = styled.span`
  font-family: "Courier New", monospace;
  color: #667eea;
  font-weight: 600;
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
      return `Regular ${verbType} verb.`;
    } else {
      return `Irregular`;
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

  const splitConjugation = (
    conjugation: string,
  ) => {
    const stem =
      question.stem.toLowerCase();
    const fullConjugation =
      conjugation.toLowerCase();

    // If the conjugation starts with the stem, split it
    if (
      fullConjugation.startsWith(stem)
    ) {
      return {
        stem: conjugation.substring(
          0,
          stem.length,
        ),
        ending: conjugation.substring(
          stem.length,
        ),
      };
    }

    // For irregular verbs, try to find a common prefix with infinitive
    const infinitive =
      question.verb.infinitive.toLowerCase();
    const baseInfinitive =
      infinitive.substring(
        0,
        infinitive.length - 2,
      ); // Remove -ar/-er/-ir

    let commonLength = 0;
    for (
      let i = 0;
      i <
      Math.min(
        baseInfinitive.length,
        fullConjugation.length,
      );
      i++
    ) {
      if (
        baseInfinitive[i] ===
        fullConjugation[i]
      ) {
        commonLength = i + 1;
      } else {
        break;
      }
    }

    // Only use common prefix if it's meaningful (at least 2 characters)
    if (commonLength >= 2) {
      return {
        stem: conjugation.substring(
          0,
          commonLength,
        ),
        ending: conjugation.substring(
          commonLength,
        ),
      };
    }

    // For completely different words, highlight the whole conjugation
    return {
      stem: "",
      ending: conjugation,
    };
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
                ]) => {
                  const {
                    stem,
                    ending,
                  } = splitConjugation(
                    conjugation as string,
                  );
                  return (
                    <ConjugationRow
                      key={pronoun}
                    >
                      <Pronoun>
                        {formatPronoun(
                          pronoun,
                        )}
                      </Pronoun>
                      <Conjugation>
                        <ConjugationStem>
                          {stem}
                        </ConjugationStem>
                        <ConjugationEnding>
                          {ending}
                        </ConjugationEnding>
                      </Conjugation>
                    </ConjugationRow>
                  );
                },
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
        >
          {isAnswered
            ? "Next Question"
            : userAnswer.trim()
            ? "Check Answer"
            : "I don't know"}
        </ActionButton>
      </ButtonsContainer>
    </FeedbackContainer>
  );
};
