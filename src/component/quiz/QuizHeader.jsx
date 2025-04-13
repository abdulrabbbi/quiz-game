import { Clock } from 'lucide-react';
import { LifeCounter } from './LifeCounter';

export const QuizHeader = ({ timer, currentQuestion, totalQuestions, lives }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center text-sm text-gray-500">
      <Clock className="mr-1 h-4 w-4" />
      {timer}s
    </div>
    <div className="text-sm text-gray-500">
      Question {currentQuestion} of {totalQuestions}
    </div>
    <LifeCounter lives={lives} />
  </div>
);