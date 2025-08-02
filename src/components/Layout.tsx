import React from "react";
import styled from "@emotion/styled";
import type { ReactNode } from "react";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px
    rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button<{
  active?: boolean;
}>`
  background: ${(props) =>
    props.active
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: rgba(
      255,
      255,
      255,
      0.2
    );
    transform: translateY(-1px);
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

interface LayoutProps {
  children: ReactNode;
  currentView:
    | "quiz"
    | "settings"
    | "wrong-answers";
  onViewChange: (
    view:
      | "quiz"
      | "settings"
      | "wrong-answers",
  ) => void;
}

export const Layout: React.FC<
  LayoutProps
> = ({
  children,
  currentView,
  onViewChange,
}) => {
  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>Português Prático</Logo>
          <Nav>
            <NavButton
              active={
                currentView === "quiz"
              }
              onClick={() =>
                onViewChange("quiz")
              }
            >
              Quiz
            </NavButton>
            <NavButton
              active={
                currentView ===
                "settings"
              }
              onClick={() =>
                onViewChange("settings")
              }
            >
              Settings
            </NavButton>
            <NavButton
              active={
                currentView ===
                "wrong-answers"
              }
              onClick={() =>
                onViewChange(
                  "wrong-answers",
                )
              }
            >
              Wrong Answers
            </NavButton>
          </Nav>
        </HeaderContent>
      </Header>
      <Main>
        <MainContent>
          {children}
        </MainContent>
      </Main>
    </LayoutContainer>
  );
};
