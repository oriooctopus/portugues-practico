import React from "react";
import styled from "@emotion/styled";
import {
  getSpacedRepetitionEntries,
  getMasteredConjugations,
  getStrugglingConjugations,
  clearSpacedRepetitionData,
} from "../utils/spacedRepetition";

const StatsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px
    rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const StatsTitle = styled.h3`
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(150px, 1fr)
  );
  gap: 1rem;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  border: 1px solid #e9ecef;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 1rem;
`;

const ClearButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
  }
`;

export const SpacedRepetitionStats: React.FC =
  () => {
    const entries =
      getSpacedRepetitionEntries();
    const mastered =
      getMasteredConjugations();
    const struggling =
      getStrugglingConjugations();

    const totalConjugations =
      entries.length;
    const masteredCount =
      mastered.length;
    const strugglingCount =
      struggling.length;

    const now = Date.now();
    const dueForReview = entries.filter(
      (entry) =>
        entry.nextReview <= now,
    ).length;

    const handleClearData = () => {
      if (
        window.confirm(
          "Are you sure you want to clear all spaced repetition data? This cannot be undone.",
        )
      ) {
        clearSpacedRepetitionData();
        window.location.reload(); // Simple way to refresh the component
      }
    };

    if (totalConjugations === 0) {
      return (
        <StatsContainer>
          <StatsTitle>
            Spaced Repetition Stats
          </StatsTitle>
          <NoDataMessage>
            No conjugations tracked yet.
            Start practicing to see your
            progress!
          </NoDataMessage>
        </StatsContainer>
      );
    }

    return (
      <StatsContainer>
        <StatsTitle>
          Spaced Repetition Stats
        </StatsTitle>
        <StatsGrid>
          <StatCard>
            <StatNumber>
              {totalConjugations}
            </StatNumber>
            <StatLabel>
              Total Tracked
            </StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>
              {masteredCount}
            </StatNumber>
            <StatLabel>
              Mastered
            </StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>
              {strugglingCount}
            </StatNumber>
            <StatLabel>
              Need Practice
            </StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>
              {dueForReview}
            </StatNumber>
            <StatLabel>
              Due for Review
            </StatLabel>
          </StatCard>
        </StatsGrid>
        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          <ClearButton
            onClick={handleClearData}
          >
            Clear All Data
          </ClearButton>
        </div>
      </StatsContainer>
    );
  };
