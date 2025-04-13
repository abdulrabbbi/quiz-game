import { useQuizGame } from "../features/quiz/hooks/useQuizGame";
import { quizData } from "../data/quizData";
import { QuizHeader, QuizProgress, QuestionCard } from "../component/quiz";
import { RotateCw ,Trophy} from "lucide-react";

export default function QuizPage() {
  const { 
    gameState, 
    handleAnswer, 
    currentQuestion, 
    progress,
    getChoices,
    getReward,
    resetGame
  } = useQuizGame(quizData);

  if (gameState.gameStatus === "completed") {
    const reward = getReward();
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-300 rounded-2xl p-6 shadow-md">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Quiz Completed!</h1>
          <p className="text-lg mb-4 text-green-800">
            Score: <span className="font-bold">{gameState.score}</span> / {quizData.questions.length}
          </p>
          <p className="text-base mb-4 text-green-600 italic">{reward.message}</p>
  
          <div className="bg-white border border-green-200 p-4 rounded-lg mb-6">
            <p className="text-xl font-mono font-bold text-green-700">{reward.badge}</p>
            <p className="text-sm text-gray-500 mt-1">Your achievement</p>
          </div>
  
          <button
            onClick={resetGame}
            className="flex items-center justify-center gap-2 
                      bg-green-600 hover:bg-green-700 text-white 
                      px-6 py-3 rounded-xl text-lg font-semibold
                      transition-all duration-200 mx-auto"
          >
            <RotateCw className="h-5 w-5" />
            Play Again
          </button>
  
          <p className="mt-4 text-sm text-gray-500">Click to restart the quiz</p>
        </div>
      </div>
    );
  }
  

  if (gameState.gameStatus === "failed") {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="bg-red-100 border border-red-300 rounded-2xl p-8 shadow-lg">
          <div className="flex justify-center mb-4">
            <span className="text-red-600 text-6xl">💀</span>
          </div>
          <h1 className="text-3xl font-extrabold text-red-700 mb-4">Game Over</h1>
          <p className="text-lg text-gray-700 mb-4">
            Your final score:
          </p>
          <p className="text-2xl font-bold text-red-800 mb-6">
            {gameState.score}/{quizData.questions.length}
          </p>
  
          <button
            onClick={resetGame}
            className="flex items-center w-full justify-center gap-2 
                      bg-red-600 hover:bg-red-700 text-white 
                      px-6 py-3 rounded-xl text-lg font-semibold
                      transition-all duration-200 ease-in-out"
          >
            <RotateCw className="h-5 w-5" />
            Try Again
          </button>
  
          <p className="mt-6 text-sm text-gray-500">
            You can always come back stronger 💪
          </p>
        </div>
      </div>
    );
  }
  

  // Loading state
  if (!currentQuestion || gameState.currentChoices.length === 0) {
    return <div className="text-center p-8">Loading questions...</div>;
  }

  // Main game screen
  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-700">
      <QuizHeader 
        timer={gameState.timer}
        currentQuestion={gameState.currentQuestionIndex + 1}
        totalQuestions={quizData.questions.length}
        lives={gameState.lives}
      />
      
      <QuizProgress progress={progress} />
      
      <QuestionCard 
        question={currentQuestion}
        choices={getChoices()}
        onAnswer={handleAnswer}
        currentQuestion={gameState.currentQuestionIndex + 1}
        totalQuestions={quizData.questions.length}
        disabled={gameState.isAnswering}
      />
    </div>
  );
}