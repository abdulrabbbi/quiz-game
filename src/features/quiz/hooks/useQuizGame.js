import { useState, useEffect, useCallback, useMemo } from "react";
import {
  calculateProgress,
  getTimeBonus,
  isPerfectScore,
  getRewardData,
} from "../../utils/quizHelpers";

export const useQuizGame = (quizData) => {
  const defaultConfig = {
    shuffleQuestions: true,
    shuffleAnswers: true,
    timePerQuestion: 15,
    maxLives: 1,
    difficultyLevels: {
      easy: { timeBonus: 5 },
      medium: { timeBonus: 3 },
      hard: { timeBonus: 0 },
    },
  };

  const config = {
    ...defaultConfig,
    ...(quizData?.config || {}),
    maxLives: 1,
  };

  const [gameState, setGameState] = useState(() => {
    const questions =
      Array.isArray(quizData?.questions) && quizData.questions.length > 0
        ? config.shuffleQuestions
          ? shuffleArray([...quizData.questions])
          : [...quizData.questions]
        : [];

    return {
      questions,
      currentQuestionIndex: 0,
      lives: config.maxLives,
      score: 0,
      timer: config.timePerQuestion,
      gameStatus: questions.length > 0 ? "playing" : "failed",
      usedHints: 0,
      correctAnswers: [],
      incorrectAnswers: [],
      currentChoices: [],
      isAnswering: false,
    };
  });

  const currentQuestion = useMemo(() => {
    if (!Array.isArray(gameState.questions)) return null;
    if (
      gameState.currentQuestionIndex < 0 ||
      gameState.currentQuestionIndex >= gameState.questions.length
    ) {
      return null;
    }
    return gameState.questions[gameState.currentQuestionIndex];
  }, [gameState.questions, gameState.currentQuestionIndex]);

  const generateChoices = useCallback(() => {
    if (!currentQuestion || !Array.isArray(quizData?.allChoices)) return [];

    const { correct } = currentQuestion;
    const allChoices = [...quizData.allChoices];

    if (config.shuffleAnswers) {
      const incorrectChoices = allChoices.filter((c) => c !== correct);
      const shuffledIncorrect = shuffleArray(incorrectChoices).slice(0, 3);
      return shuffleArray([...shuffledIncorrect, correct]);
    }
    return allChoices.sort();
  }, [currentQuestion, quizData?.allChoices, config.shuffleAnswers]);

  useEffect(() => {
    if (gameState.gameStatus !== "playing") return;

    const newChoices = generateChoices();
    setGameState((prev) => ({
      ...prev,
      currentChoices: newChoices,
      isAnswering: false,
    }));
  }, [currentQuestion?.id, gameState.gameStatus, generateChoices]);

  useEffect(() => {
    if (gameState.gameStatus !== "playing" || gameState.isAnswering) return;

    if (gameState.timer <= 0) return;

    const timerId = setTimeout(() => {
      setGameState((prev) => {
        if (prev.timer <= 1) {
          return {
            ...prev,
            isAnswering: true,
          };
        }
        return {
          ...prev,
          timer: prev.timer - 1,
        };
      });
    }, 1000);

    return () => clearTimeout(timerId);
  }, [gameState.timer, gameState.gameStatus, gameState.isAnswering]);
  useEffect(() => {
    if (
      gameState.gameStatus === "playing" &&
      gameState.timer === 1 &&
      !gameState.isAnswering
    ) {
      handleAnswer("", true); 
    }
  }, [gameState.timer, gameState.gameStatus, gameState.isAnswering]);
  
  const handleAnswer = useCallback(
    (selectedChoice, isTimeout = false) => {
      setGameState((prev) => {
        const question = prev.questions[prev.currentQuestionIndex];
        if (!question) {
          return {
            ...prev,
            gameStatus: "failed",
            timer: 0,
            isAnswering: false,
          };
        }
  
        const isCorrect = selectedChoice === question.correct;
        const difficultyBonus = getTimeBonus(question.difficulty, config);
  
        // Timeout or wrong answer
        if (!isCorrect || isTimeout) {
          const newLives = prev.lives - 1;
          const status = newLives <= 0 ? "failed" : "playing";
  
          return {
            ...prev,
            lives: newLives,
            incorrectAnswers: [...prev.incorrectAnswers, question.id],
            timer: 0,
            gameStatus: status,
            isAnswering: true, // prevent double clicks
          };
        }
  
        // Correct answer
        const nextQuestionIndex = prev.currentQuestionIndex + 1;
        const isGameComplete = nextQuestionIndex >= prev.questions.length;
  
        return {
          ...prev,
          score: prev.score + 1,
          correctAnswers: [...prev.correctAnswers, question.id],
          currentQuestionIndex: nextQuestionIndex,
          timer: isGameComplete ? 0 : config.timePerQuestion + difficultyBonus,
          gameStatus: isGameComplete ? "completed" : "playing",
          isAnswering: false,
        };
      });
    },
    [config]
  );
  
  const skipQuestion = useCallback(() => {
    handleAnswer("", true);
  }, [handleAnswer]);

  const progress = calculateProgress(
    gameState.currentQuestionIndex,
    gameState.questions.length
  );

  const resetGame = useCallback(
    (newConfig = {}) => {
      const updatedConfig = { ...config, ...newConfig };
      const questions =
        Array.isArray(quizData?.questions) && quizData.questions.length > 0
          ? updatedConfig.shuffleQuestions
            ? shuffleArray([...quizData.questions])
            : [...quizData.questions]
          : [];

      setGameState({
        questions,
        currentQuestionIndex: 0,
        lives: updatedConfig.maxLives,
        score: 0,
        timer: updatedConfig.timePerQuestion,
        gameStatus: questions.length > 0 ? "playing" : "failed",
        usedHints: 0,
        correctAnswers: [],
        incorrectAnswers: [],
        currentChoices: [],
        isAnswering: false,
      });
    },
    [quizData?.questions, config]
  );

  useEffect(() => {
    console.log("GAME STATE UPDATE:", {
      status: gameState.gameStatus,
      lives: gameState.lives,
      timer: gameState.timer,
      currentQuestion: gameState.currentQuestionIndex,
      score: gameState.score,
    });
  }, [gameState]);

  return {
    gameState,
    currentQuestion,
    progress,
    handleAnswer,
    skipQuestion,
    resetGame,
    getChoices: () => gameState.currentChoices,
    isPerfect: isPerfectScore(gameState.score, gameState.questions.length),
    getReward: () =>
      getRewardData(
        gameState.score,
        gameState.questions.length,
        quizData?.rewards || {}
      ),
  };
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
