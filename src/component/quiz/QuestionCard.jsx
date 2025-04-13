import { useEffect, useState } from "react";
import { AnswerChoice } from "./AnswerChoice";
import { Card, CardContent } from "../ui/card";
import { Check, X } from "lucide-react"; 

export const QuestionCard = ({ 
  question, 
  choices, 
  onAnswer,
  currentQuestion,
  totalQuestions
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    setSelectedChoice(null);
    setIsCorrect(null);
  }, [question]);

  const handleSelect = (choice) => {
    if (selectedChoice) return; 

    setSelectedChoice(choice);
    const correct = choice === question.correct;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onAnswer(choice);
    }, 1000);
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Question {currentQuestion} of {totalQuestions}
          </h2>
          <p className="text-lg bg-gray-50 p-4 rounded-md">
            {question.question}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice;
            let bgColor = "bg-white";
            let icon = null;
            
            if (isSelected) {
              if (choice === question.correct) {
                bgColor = "bg-green-100 border-green-500";
                icon = <Check className="h-5 w-5 text-green-500 ml-2" />;
              } else {
                bgColor = "bg-red-100 border-red-500";
                icon = <X className="h-5 w-5 text-red-500 ml-2" />;
              }
            }
            
            const showAsCorrect = selectedChoice && 
                                selectedChoice !== question.correct && 
                                choice === question.correct;
            
            if (showAsCorrect) {
              bgColor = "bg-green-100 border-green-500";
              icon = <Check className="h-5 w-5 text-green-500 ml-2" />;
            }

            return (
              <AnswerChoice
                key={choice}
                choice={choice}
                onSelect={handleSelect}
                isSelected={isSelected}
                disabled={selectedChoice !== null}
                bgColor={bgColor}
                icon={icon}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};