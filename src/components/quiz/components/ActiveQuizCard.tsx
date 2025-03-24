
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion } from '../types';
import QuestionDisplay from './QuestionDisplay';
import { 
  Brain, 
  Check, 
  X, 
  HelpCircle, 
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ActiveQuizCardProps {
  currentQuestion: QuizQuestion;
  currentIndex: number;
  availableQuestions: QuizQuestion[];
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  submitAnswer: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  skipQuestion: () => void;
}

const ActiveQuizCard: React.FC<ActiveQuizCardProps> = ({
  currentQuestion,
  currentIndex,
  availableQuestions,
  selectedAnswer,
  setSelectedAnswer,
  isAnswerSubmitted,
  isCorrect,
  submitAnswer,
  nextQuestion,
  previousQuestion,
  skipQuestion
}) => {
  if (!currentQuestion) return null;

  const getQuestionIcon = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice': return <HelpCircle className="h-5 w-5" />;
      case 'calculation': return <Calculator className="h-5 w-5" />;
      case 'essay': return <BookOpen className="h-5 w-5" />;
      case 'true-false': return <Brain className="h-5 w-5" />;
      default: return null;
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    return difficulty === 1 ? 'Easy' : difficulty === 2 ? 'Medium' : 'Hard';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getQuestionIcon()}
              Question {currentIndex + 1} of {availableQuestions.length}
            </CardTitle>
            <CardDescription>
              Topic: {currentQuestion.topic} | Difficulty: {getDifficultyLabel(currentQuestion.difficulty)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isAnswerSubmitted && (
              isCorrect 
                ? <Check className="h-6 w-6 text-green-500" />
                : <X className="h-6 w-6 text-red-500" />
            )}
          </div>
        </div>
        <Progress 
          value={(currentIndex + 1) / availableQuestions.length * 100} 
          className="h-2"
        />
      </CardHeader>
      <CardContent>
        <QuestionDisplay 
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          isAnswerSubmitted={isAnswerSubmitted}
          isCorrect={isCorrect}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isAnswerSubmitted ? (
          <div className="flex w-full gap-2">
            <Button 
              variant="outline" 
              onClick={skipQuestion}
              className="mr-auto"
            >
              Skip
            </Button>
            <Button 
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              className="ml-auto"
            >
              Submit Answer
            </Button>
          </div>
        ) : (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentIndex === 0}
              className="mr-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button onClick={nextQuestion} className="ml-auto">
              {currentIndex === availableQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              {currentIndex !== availableQuestions.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ActiveQuizCard;
