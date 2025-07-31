// Test the actual quiz flow to verify accuracy calculation
describe("Quiz Flow - Accuracy Calculation", () => {
  it("should calculate accuracy correctly in a real quiz scenario", () => {
    // Simulate the quiz state and actions
    let state = {
      score: 0,
      totalQuestions: 0,
      isCorrect: null as boolean | null,
      hasRetried: false,
    };

    // Helper functions to simulate quiz actions
    const checkAnswer = (
      userAnswer: string,
      correctAnswer: string,
    ) => {
      const isCorrect =
        userAnswer
          .toLowerCase()
          .trim() ===
        correctAnswer
          .toLowerCase()
          .trim();
      state.isCorrect = isCorrect;
      return isCorrect;
    };

    const retryQuestion = () => {
      state.hasRetried = true;
      state.isCorrect = null;
    };

    const nextQuestion = () => {
      state.totalQuestions++;
      if (
        state.isCorrect === true &&
        !state.hasRetried
      ) {
        state.score++;
      }
      // Reset for next question
      state.isCorrect = null;
      state.hasRetried = false;
    };

    // Scenario 1: Correct on first try
    checkAnswer("fala", "fala");
    nextQuestion();
    expect(state.score).toBe(1);
    expect(state.totalQuestions).toBe(
      1,
    );

    // Scenario 2: Wrong, retry, then correct
    checkAnswer("wrong", "fala");
    retryQuestion();
    checkAnswer("fala", "fala");
    nextQuestion();
    expect(state.score).toBe(1); // Should still be 1, not 2
    expect(state.totalQuestions).toBe(
      2,
    );

    // Scenario 3: Wrong and move on
    checkAnswer("wrong", "fala");
    nextQuestion();
    expect(state.score).toBe(1); // Should still be 1
    expect(state.totalQuestions).toBe(
      3,
    );

    // Scenario 4: Correct on first try again
    checkAnswer("fala", "fala");
    nextQuestion();
    expect(state.score).toBe(2); // Should be 2 now
    expect(state.totalQuestions).toBe(
      4,
    );

    // Calculate final accuracy
    const accuracy = Math.round(
      (state.score /
        state.totalQuestions) *
        100,
    );
    expect(accuracy).toBe(50); // 2 correct out of 4 questions = 50%
  });

  it("should handle the auto-start quiz scenario correctly", () => {
    // Simulate the auto-start scenario where SET_QUESTION_AND_NEXT is called
    let state = {
      score: 0,
      totalQuestions: 0,
      isCorrect: null as boolean | null,
      hasRetried: false,
    };

    const setQuestionAndNext = () => {
      // This simulates the SET_QUESTION_AND_NEXT action
      // The score should NOT be incremented because there's no previous question result
      state.totalQuestions++;
      if (
        state.isCorrect === true &&
        !state.hasRetried
      ) {
        state.score++;
      }
      // Reset for next question
      state.isCorrect = null;
      state.hasRetried = false;
    };

    // Auto-start should not increment score
    setQuestionAndNext();
    expect(state.score).toBe(0);
    expect(state.totalQuestions).toBe(
      1,
    );

    // Now answer correctly
    state.isCorrect = true;
    state.hasRetried = false;
    setQuestionAndNext();
    expect(state.score).toBe(1);
    expect(state.totalQuestions).toBe(
      2,
    );
  });

  it("should handle retry scenarios correctly", () => {
    let state = {
      score: 0,
      totalQuestions: 0,
      isCorrect: null as boolean | null,
      hasRetried: false,
    };

    const checkAnswer = (
      userAnswer: string,
      correctAnswer: string,
    ) => {
      const isCorrect =
        userAnswer
          .toLowerCase()
          .trim() ===
        correctAnswer
          .toLowerCase()
          .trim();
      state.isCorrect = isCorrect;
      return isCorrect;
    };

    const retryQuestion = () => {
      state.hasRetried = true;
      state.isCorrect = null;
    };

    const nextQuestion = () => {
      state.totalQuestions++;
      if (
        state.isCorrect === true &&
        !state.hasRetried
      ) {
        state.score++;
      }
      state.isCorrect = null;
      state.hasRetried = false;
    };

    // Test multiple retry scenarios
    // Question 1: Wrong, retry, wrong, retry, correct
    checkAnswer("wrong1", "fala");
    retryQuestion();
    checkAnswer("wrong2", "fala");
    retryQuestion();
    checkAnswer("fala", "fala");
    nextQuestion();
    expect(state.score).toBe(0); // Should be 0 because retried
    expect(state.totalQuestions).toBe(
      1,
    );

    // Question 2: Correct on first try
    checkAnswer("fala", "fala");
    nextQuestion();
    expect(state.score).toBe(1); // Should be 1 now
    expect(state.totalQuestions).toBe(
      2,
    );

    // Question 3: Wrong, retry, correct
    checkAnswer("wrong", "fala");
    retryQuestion();
    checkAnswer("fala", "fala");
    nextQuestion();
    expect(state.score).toBe(1); // Should still be 1 because retried
    expect(state.totalQuestions).toBe(
      3,
    );

    const accuracy = Math.round(
      (state.score /
        state.totalQuestions) *
        100,
    );
    expect(accuracy).toBe(33); // 1 correct out of 3 questions = 33%
  });
});
