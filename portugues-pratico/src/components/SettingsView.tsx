import React from "react";
import styled from "@emotion/styled";
import { useSettings } from "../context/useSettings";
import { PronounSelector } from "./PronounSelector";
import { TenseSelector } from "./TenseSelector";
import { RegularitySelector } from "./RegularitySelector";
import { RegularIrregularRatioSelector } from "./RegularIrregularRatioSelector";
import { SpacedRepetitionSelector } from "./SpacedRepetitionSelector";
import { SpacedRepetitionStats } from "./SpacedRepetitionStats";

const SettingsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const SettingsCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px
    rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
`;

const SettingsTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-style: italic;
`;

export const SettingsView: React.FC =
  () => {
    const { settings, updateSettings } =
      useSettings();

    return (
      <SettingsContainer>
        <SettingsCard>
          <SettingsTitle>
            Quiz Settings
          </SettingsTitle>

          <Section>
            <SectionTitle>
              Pronouns
            </SectionTitle>
            <PronounSelector
              pronouns={
                settings.pronouns
              }
              onChange={(pronouns) =>
                updateSettings({
                  pronouns,
                })
              }
            />
            <InfoText>
              Select which pronouns you
              want to practice with.
            </InfoText>
          </Section>

          <Section>
            <SectionTitle>
              Tenses & Moods
            </SectionTitle>
            <TenseSelector
              tenses={settings.tenses}
              onChange={(tenses) =>
                updateSettings({
                  tenses,
                })
              }
            />
            <InfoText>
              Choose which tenses and
              moods to include in your
              practice.
            </InfoText>
          </Section>

          <Section>
            <SectionTitle>
              Verb Regularity
            </SectionTitle>
            <RegularitySelector
              regularity={
                settings.regularity
              }
              onChange={(regularity) =>
                updateSettings({
                  regularity,
                })
              }
            />
            {settings.regularity ===
              "all" && (
              <div
                style={{
                  marginTop: "1rem",
                }}
              >
                <RegularIrregularRatioSelector
                  value={
                    settings.regularIrregularRatio
                  }
                  onChange={(
                    regularIrregularRatio,
                  ) => {
                    updateSettings({
                      regularIrregularRatio,
                    });
                  }}
                />
              </div>
            )}
            <InfoText>
              Filter verbs by their
              regularity pattern.
            </InfoText>
          </Section>

          <Section>
            <SectionTitle>
              Spaced Repetition
            </SectionTitle>
            <SpacedRepetitionSelector
              spacedRepetition={
                settings.spacedRepetition
              }
              onChange={(
                spacedRepetition,
              ) =>
                updateSettings({
                  spacedRepetition,
                })
              }
            />
            <InfoText>
              Enable spaced repetition
              to focus on conjugations
              you struggle with. Correct
              answers won't appear
              again, while incorrect
              ones will be reviewed
              later.
            </InfoText>
          </Section>
        </SettingsCard>

        <SettingsCard>
          <SpacedRepetitionStats />
        </SettingsCard>
      </SettingsContainer>
    );
  };
