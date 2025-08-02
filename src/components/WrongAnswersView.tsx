import React, {
  useState,
  useEffect,
} from "react";
import styled from "@emotion/styled";
import {
  getWrongAnswers,
  clearWrongAnswers,
  exportWrongAnswers,
  type WrongAnswer,
} from "../utils/wrongAnswers";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem 1rem;
  box-shadow: 0 8px 32px
    rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-align: center;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  padding: 2rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const Button = styled.button`
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px
    rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px
      rgba(102, 126, 234, 0.6);
  }

  &.danger {
    background: linear-gradient(
      135deg,
      #ff6b6b 0%,
      #ee5a52 100%
    );
    box-shadow: 0 4px 15px
      rgba(255, 107, 107, 0.4);

    &:hover {
      box-shadow: 0 6px 20px
        rgba(255, 107, 107, 0.6);
    }
  }
`;

const WrongAnswerCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #ff6b6b;
`;

const VerbHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const VerbInfo = styled.div`
  flex: 1;
`;

const VerbName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const VerbTranslation = styled.p`
  margin: 0.25rem 0 0 0;
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
`;

const ConjugationInfo = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ConjugationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #333;
  min-width: 120px;
`;

const Value = styled.span<{
  isCorrect?: boolean;
}>`
  color: ${(props) =>
    props.isCorrect
      ? "#28a745"
      : "#dc3545"};
  font-weight: ${(props) =>
    props.isCorrect ? "600" : "400"};
`;

const Timestamp = styled.div`
  text-align: right;
  color: #999;
  font-size: 0.8rem;
  margin-top: 1rem;
`;

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
    voces: "vocês",
  };
  return pronounMap[pronoun] || pronoun;
};

const formatDate = (
  timestamp: number,
): string => {
  return new Date(
    timestamp,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const WrongAnswersView: React.FC =
  () => {
    const [
      wrongAnswers,
      setWrongAnswers,
    ] = useState<WrongAnswer[]>([]);

    useEffect(() => {
      setWrongAnswers(
        getWrongAnswers(),
      );
    }, []);

    const handleClearAll = () => {
      if (
        window.confirm(
          "Are you sure you want to clear all wrong answers?",
        )
      ) {
        clearWrongAnswers();
        setWrongAnswers([]);
      }
    };

    const handleExport = () => {
      exportWrongAnswers();
    };

    const handleRefresh = () => {
      setWrongAnswers(
        getWrongAnswers(),
      );
    };

    if (wrongAnswers.length === 0) {
      return (
        <Container>
          <Title>Wrong Answers</Title>
          <EmptyMessage>
            No wrong answers recorded
            yet. Keep practicing!
          </EmptyMessage>
          <ControlsContainer>
            <Button
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </ControlsContainer>
        </Container>
      );
    }

    return (
      <Container>
        <Title>
          Wrong Answers (
          {wrongAnswers.length})
        </Title>

        <ControlsContainer>
          <Button
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            onClick={handleExport}
          >
            Export JSON
          </Button>
          <Button
            className="danger"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </ControlsContainer>

        {wrongAnswers.map(
          (wrongAnswer, index) => (
            <WrongAnswerCard
              key={index}
            >
              <VerbHeader>
                <VerbInfo>
                  <VerbName>
                    {
                      wrongAnswer.infinitive
                    }
                  </VerbName>
                  <VerbTranslation>
                    {
                      wrongAnswer.translation
                    }
                  </VerbTranslation>
                </VerbInfo>
              </VerbHeader>

              <ConjugationInfo>
                <ConjugationRow>
                  <Label>
                    Conjugation:
                  </Label>
                  <Value>
                    {formatPronoun(
                      wrongAnswer.pronoun,
                    )}{" "}
                    -{" "}
                    {formatTense(
                      wrongAnswer.tense,
                    )}
                  </Value>
                </ConjugationRow>
                <ConjugationRow>
                  <Label>
                    Your Answer:
                  </Label>
                  <Value
                    isCorrect={false}
                  >
                    {
                      wrongAnswer.userAnswer
                    }
                  </Value>
                </ConjugationRow>
                <ConjugationRow>
                  <Label>
                    Correct Answer:
                  </Label>
                  <Value
                    isCorrect={true}
                  >
                    {
                      wrongAnswer.correctAnswer
                    }
                  </Value>
                </ConjugationRow>
                <ConjugationRow>
                  <Label>
                    Full Conjugation:
                  </Label>
                  <Value>
                    {
                      wrongAnswer.fullConjugation
                    }
                  </Value>
                </ConjugationRow>
              </ConjugationInfo>

              <Timestamp>
                {formatDate(
                  wrongAnswer.timestamp,
                )}
              </Timestamp>
            </WrongAnswerCard>
          ),
        )}
      </Container>
    );
  };
