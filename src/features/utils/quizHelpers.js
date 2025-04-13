export const calculateProgress = (current, total) => {
    return Math.min(100, (current / total) * 100);
  };
  
  export const getTimeBonus = (difficulty, config) => {
    const bonus = config.difficultyLevels[difficulty]?.timeBonus || 0;
    return bonus;
  };
  
  export const isPerfectScore = (score, totalQuestions) => {
    return score === totalQuestions;
  };
  
  export const getRewardData = (score, totalQuestions, rewards) => {
    const percentage = score / totalQuestions;
    
    if (percentage === 1) {
      return rewards.perfectScore;
    }
    if (percentage >= rewards.goodScore.threshold) {
      return rewards.goodScore;
    }
    return {
      message: "Keep practicing!",
      badge: "THM{{try_again}}"
    };
  };
  
  export const calculateScorePercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };
  
  export const filterByDifficulty = (questions, difficulty) => {
    return questions.filter(q => q.difficulty === difficulty);
  };
  
  export const getQuestionStats = (questions, correctAnswers, incorrectAnswers) => {
    return questions.map(question => ({
      ...question,
      answeredCorrectly: correctAnswers.includes(question.id),
      answeredIncorrectly: incorrectAnswers.includes(question.id),
      wasSkipped: !correctAnswers.includes(question.id) && 
                 !incorrectAnswers.includes(question.id)
    }));
  };