
import React from 'react';
import { QuizQuestion } from '../types';
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from 'lucide-react';

interface QuestionDisplayProps {
  question: QuizQuestion;
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswer,
  setSelectedAnswer,
  isAnswerSubmitted,
  isCorrect
}) => {
  // Different input based on question type
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        return (
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={isAnswerSubmitted}
            className="space-y-2 mt-4"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`}
                  className={isAnswerSubmitted ? 
                    option === question.correctAnswer 
                      ? "font-medium text-green-600 dark:text-green-400" 
                      : option === selectedAnswer && option !== question.correctAnswer
                        ? "font-medium text-red-600 dark:text-red-400"
                        : ""
                    : ""}
                >
                  {option}
                  {isAnswerSubmitted && option === question.correctAnswer && (
                    <Check className="inline-block ml-2 h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                  {isAnswerSubmitted && option === selectedAnswer && option !== question.correctAnswer && (
                    <X className="inline-block ml-2 h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'calculation':
        return (
          <div className="mt-4">
            <Label htmlFor="calculation-answer">Your Answer</Label>
            <Input
              id="calculation-answer"
              type="number"
              step="0.01"
              placeholder="Enter your answer"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={isAnswerSubmitted}
              className={isAnswerSubmitted ? 
                isCorrect 
                  ? "border-green-500 focus-visible:ring-green-500" 
                  : "border-red-500 focus-visible:ring-red-500"
                : ""}
            />
            {isAnswerSubmitted && (
              <p className="text-sm mt-1">
                Correct answer: {question.correctAnswer}
              </p>
            )}
          </div>
        );
      
      case 'essay':
        return (
          <div className="mt-4">
            <Label htmlFor="essay-answer">Your Answer</Label>
            <Textarea
              id="essay-answer"
              placeholder="Write your answer here..."
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={isAnswerSubmitted}
              className="min-h-[150px]"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">{question.text}</h3>
      
      {renderQuestionInput()}
      
      {isAnswerSubmitted && (
        <Card className="mt-4 bg-muted/30">
          <CardContent className="pt-4">
            <h4 className="font-medium mb-2">Explanation</h4>
            <p>{question.explanation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionDisplay;
